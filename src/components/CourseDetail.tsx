"use client";

import { useMemo, useState } from "react";
import type { Course } from "@/lib/courses-data";
import { CourseIllustration } from "@/components/CourseIllustration";
import { courseExamples } from "@/components/course-examples";
import { shuffleQuestionOptions } from "@/lib/shuffle";

export type CourseQuizAnswer = { questionId: string; chosenIndex: number };

type CourseDetailProps = {
  course: Course;
  onComplete: (answers: CourseQuizAnswer[]) => void;
  onBack: () => void;
};

export function CourseDetail({ course, onComplete, onBack }: CourseDetailProps) {
  const [pageIndex, setPageIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<CourseQuizAnswer[]>([]);
  const [finishing, setFinishing] = useState(false);

  const courseQuestions = course.quiz;
  const question = courseQuestions[quizStep];
  const { options: shuffledOptions, correctIndex: shuffledCorrectIndex, order } =
    useMemo(() => shuffleQuestionOptions(question), [question]);
  const isCorrect = selected !== null && selected === shuffledCorrectIndex;
  const isLastQuestion = quizStep === courseQuestions.length - 1;

  const totalPages = course.pages.length;
  const page = course.pages[pageIndex];
  const isLastPage = pageIndex === totalPages - 1;
  const ExampleComponent = courseExamples[page.exampleKey];

  function handleQuizNext() {
    if (selected === null || finishing) return;
    const nextAnswers = [
      ...answers,
      { questionId: question.id, chosenIndex: order[selected] },
    ];
    if (isLastQuestion) {
      setFinishing(true);
      onComplete(nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
    setQuizStep((s) => s + 1);
    setSelected(null);
  }

  return (
    <section className="mb-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <span aria-hidden>←</span> До всіх курсів
      </button>

      {!showQuiz && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
          <CourseIllustration
            courseId={course.id}
            className="w-full h-40 sm:h-48 block"
          />
          <div className="p-6 sm:p-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-xl">
                  {course.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    {course.title} · сторінка {pageIndex + 1} з {totalPages}
                  </p>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {page.heading}
                  </h2>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {course.pages.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-6 rounded-full transition-colors ${
                      i <= pageIndex ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {page.paragraphs.map((paragraph, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {ExampleComponent && (
              <div className="mt-4">
                <ExampleComponent />
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                disabled={pageIndex === 0}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <span aria-hidden>←</span> Назад
              </button>
              <button
                type="button"
                onClick={() =>
                  isLastPage ? setShowQuiz(true) : setPageIndex((p) => p + 1)
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all"
              >
                {isLastPage
                  ? `Перевірити себе (${courseQuestions.length} питань)`
                  : "Далі"}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showQuiz && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Перевірте себе — питання {quizStep + 1} з {courseQuestions.length}
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{
                width: `${((quizStep + (selected !== null ? 1 : 0)) / courseQuestions.length) * 100}%`,
              }}
            />
          </div>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
            {question.situation}
          </p>

          <div className="space-y-2.5">
            {shuffledOptions.map((option, index) => {
              const isChosen = selected === index;
              const isRightAnswer = index === shuffledCorrectIndex;
              let stateClasses =
                "border-slate-200 hover:border-blue-400 hover:bg-blue-50/60";
              let badge: React.ReactNode = null;
              if (selected !== null) {
                if (isRightAnswer) {
                  stateClasses = "border-green-500 bg-green-50";
                  badge = <span className="text-green-600">✓</span>;
                } else if (isChosen && !isRightAnswer) {
                  stateClasses = "border-red-400 bg-red-50";
                  badge = <span className="text-red-500">✕</span>;
                } else {
                  stateClasses = "border-slate-200 opacity-50";
                }
              }
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => selected === null && setSelected(index)}
                  disabled={selected !== null}
                  className={`w-full flex items-start gap-3 text-left rounded-lg border px-4 py-3 text-sm text-slate-700 transition-colors ${stateClasses}`}
                >
                  <span className="flex-1">{option}</span>
                  {badge}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <div
              className={`mt-5 rounded-lg p-4 text-sm border animate-step ${
                isCorrect
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-amber-50 text-amber-900 border-amber-200"
              }`}
            >
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                {isCorrect ? "✅ Правильно!" : "💡 Не зовсім так"}
              </p>
              <p>{question.explanation}</p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            {quizStep === 0 ? (
              <button
                type="button"
                onClick={() => setShowQuiz(false)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span aria-hidden>←</span> До пояснення
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={handleQuizNext}
              disabled={selected === null || finishing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all"
            >
              {finishing
                ? "Зберігаємо…"
                : isLastQuestion
                  ? "Завершити курс"
                  : "Наступне питання"}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
