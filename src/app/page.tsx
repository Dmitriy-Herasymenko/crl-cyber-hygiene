"use client";

import { useEffect, useState } from "react";
import { IntroForm } from "@/components/IntroForm";
import { CoursesOverview } from "@/components/CoursesOverview";
import { CourseDetail, type CourseQuizAnswer } from "@/components/CourseDetail";
import { FinalTest, type FinalTestAnswer } from "@/components/FinalTest";
import { ResultCard } from "@/components/ResultCard";
import { ReturningUserCard } from "@/components/ReturningUserCard";
import { StepIndicator } from "@/components/StepIndicator";
import { courses } from "@/lib/courses-data";

type Step =
  | "login"
  | "returning"
  | "courses"
  | "course-detail"
  | "final-test"
  | "result";

const STEP_INDEX: Record<Step, number> = {
  login: 0,
  returning: 0,
  courses: 1,
  "course-detail": 1,
  "final-test": 2,
  result: 3,
};

type ReturningAttempt = {
  id: number;
  department: string;
  score: number;
  totalQuestions: number;
  createdAt: string;
};

type CourseAnswersMap = Record<string, CourseQuizAnswer[]>;

const IDENTITY_KEY = "chr-identity";

type Identity = { fullName: string; department: string };

function loadIdentity(): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(IDENTITY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Identity;
    if (!parsed.fullName || !parsed.department) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function Home() {
  const [step, setStep] = useState<Step>("login");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [returningAttempt, setReturningAttempt] =
    useState<ReturningAttempt | null>(null);
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingHistory, setCheckingHistory] = useState(false);
  const [completedCourseIds, setCompletedCourseIds] = useState<string[]>([]);
  const [courseAnswers, setCourseAnswers] = useState<CourseAnswersMap>({});
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(true);

  // Особисту прив'язку (ПІБ + відділення) тримаємо в браузері, щоб людину не
  // розлогінювало після оновлення сторінки. Сам прогрес по курсах і тестах
  // завжди підтягується з бази даних за ПІБ, тому дані не переплутаються між
  // людьми — досить натиснути «Вийти» перед тим, як передати комп'ютер
  // колезі.
  async function loadForIdentity(name: string, dep: string) {
    setFullName(name);
    setDepartment(dep);
    setError(null);
    try {
      const attemptRes = await fetch(
        `/api/attempts/lookup?fullName=${encodeURIComponent(name)}`
      );
      if (attemptRes.ok) {
        const data = await attemptRes.json();
        if (data.attempt) {
          setReturningAttempt(data.attempt);
          setStep("returning");
          return;
        }
      }

      const progressRes = await fetch(
        `/api/course-progress?fullName=${encodeURIComponent(name)}`
      );
      if (progressRes.ok) {
        const data = await progressRes.json();
        if (data.progress) {
          const completed: string[] = data.progress.completedCourseIds ?? [];
          setCompletedCourseIds(completed);
          setCourseAnswers(data.progress.answers ?? {});
          setStep(
            completed.length === courses.length ? "final-test" : "courses"
          );
          return;
        }
      }

      setCompletedCourseIds([]);
      setCourseAnswers({});
      setStep("courses");
    } catch {
      setCompletedCourseIds([]);
      setCourseAnswers({});
      setStep("courses");
    }
  }

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const identity = loadIdentity();
    if (!identity) {
      setRestoring(false);
      return;
    }
    loadForIdentity(identity.fullName, identity.department).finally(() =>
      setRestoring(false)
    );
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  async function handleStart(name: string, dep: string) {
    setCheckingHistory(true);
    try {
      window.localStorage.setItem(
        IDENTITY_KEY,
        JSON.stringify({ fullName: name, department: dep })
      );
    } catch {
      // localStorage недоступний — увійти все одно можна, просто без
      // збереження між сесіями.
    }
    await loadForIdentity(name, dep);
    setCheckingHistory(false);
  }

  function handleLogout() {
    try {
      window.localStorage.removeItem(IDENTITY_KEY);
    } catch {
      // ignore
    }
    setFullName("");
    setDepartment("");
    setReturningAttempt(null);
    setResult(null);
    setError(null);
    setCompletedCourseIds([]);
    setCourseAnswers({});
    setActiveCourseId(null);
    setStep("login");
  }

  function handleRetake() {
    setCompletedCourseIds([]);
    setCourseAnswers({});
    setStep("courses");
  }

  function handleOpenCourse(id: string) {
    setActiveCourseId(id);
    setStep("course-detail");
  }

  async function handleCompleteCourse(answers: CourseQuizAnswer[]) {
    if (!activeCourseId) {
      setStep("courses");
      return;
    }
    const courseId = activeCourseId;
    const nextCompleted = completedCourseIds.includes(courseId)
      ? completedCourseIds
      : [...completedCourseIds, courseId];
    const nextAnswers: CourseAnswersMap = {
      ...courseAnswers,
      [courseId]: answers,
    };

    setCompletedCourseIds(nextCompleted);
    setCourseAnswers(nextAnswers);
    setActiveCourseId(null);

    try {
      await fetch("/api/course-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          department,
          completedCourseIds: nextCompleted,
          answers: nextAnswers,
        }),
      });
    } catch {
      // Прогрес курсу лишається в поточній сесії, навіть якщо збереження в
      // базу тимчасово не вдалося.
    }

    setStep(
      nextCompleted.length === courses.length ? "final-test" : "courses"
    );
  }

  async function handleFinishFinalTest(answers: FinalTestAnswer[]) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, department, answers }),
      });
      if (!res.ok) throw new Error("Помилка збереження результату");
      const data = await res.json();
      setResult({ score: data.score, total: data.total });
      setStep("result");
    } catch {
      setError(
        "Не вдалося зберегти результат. Перевірте з'єднання та спробуйте ще раз."
      );
      setStep("final-test");
    } finally {
      setSubmitting(false);
    }
  }

  const activeCourse = courses.find((c) => c.id === activeCourseId) ?? null;
  const isLoggedIn = step !== "login";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-slate-50">
      <header className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-600">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        {isLoggedIn && fullName && (
          <div className="relative w-full flex justify-end px-4 sm:px-6 pt-3">
            <div className="flex items-center gap-2.5 rounded-full bg-white/10 pl-3 pr-1.5 py-1 backdrop-blur-sm">
              <span
                className="text-xs font-medium text-blue-50 truncate max-w-[40vw] sm:max-w-none"
                title={`${fullName} · ${department}`}
              >
                {fullName}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/25 transition-colors"
              >
                🚪 Вийти
              </button>
            </div>
          </div>
        )}

        <div className="relative max-w-3xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-2xl backdrop-blur-sm">
              🛡️
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              Уманська центральна районна лікарня
            </p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-2xl">
            Інструктаж «Основи кібербезпеки та захисту персональних даних
            пацієнтів»
          </h1>
          <p className="mt-2 text-blue-100 text-sm max-w-xl">
            4 короткі курси з реальної роботи — фішинг, паролі, носії та
            блокування екрана. У кожному курсі — детальне пояснення та
            контрольний тест по темі, а наприкінці — фінальний тест.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
        <StepIndicator current={STEP_INDEX[step]} />

        <div className="animate-step" key={step + (activeCourseId ?? "")}>
          {restoring && (
            <div className="h-40 rounded-xl border border-slate-200 bg-white animate-pulse" />
          )}

          {!restoring && step === "login" && (
            <>
              <IntroForm onStart={handleStart} />
              {checkingHistory && (
                <p className="text-center text-sm text-slate-500">
                  Перевіряємо, чи ви вже проходили інструктаж…
                </p>
              )}
            </>
          )}

          {step === "returning" && returningAttempt && (
            <ReturningUserCard
              fullName={fullName}
              score={returningAttempt.score}
              total={returningAttempt.totalQuestions}
              createdAt={returningAttempt.createdAt}
              onRetake={handleRetake}
            />
          )}

          {step === "courses" && (
            <CoursesOverview
              completedIds={completedCourseIds}
              onOpenCourse={handleOpenCourse}
            />
          )}

          {step === "course-detail" && activeCourse && (
            <CourseDetail
              course={activeCourse}
              onComplete={handleCompleteCourse}
              onBack={() => {
                setActiveCourseId(null);
                setStep("courses");
              }}
            />
          )}

          {step === "final-test" && (
            <FinalTest onFinish={handleFinishFinalTest} />
          )}

          {step === "result" && result && (
            <ResultCard
              score={result.score}
              total={result.total}
              fullName={fullName}
            />
          )}
        </div>

        {submitting && (
          <p className="text-center text-sm text-slate-500">Збереження результату…</p>
        )}
        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}
      </main>

      <footer className="max-w-3xl mx-auto px-4 pb-10 text-center text-xs text-slate-400">
        Результати проходження фіксуються автоматично та доступні
        адміністрації закладу.
      </footer>
    </div>
  );
}
