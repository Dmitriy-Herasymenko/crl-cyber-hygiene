import { courses } from "@/lib/courses-data";

const ACCENTS: Record<string, string> = {
  passwords: "bg-violet-50 text-violet-600",
  phishing: "bg-rose-50 text-rose-600",
  media: "bg-amber-50 text-amber-600",
  "lock-screen": "bg-emerald-50 text-emerald-600",
};

type CoursesOverviewProps = {
  completedIds: string[];
  onOpenCourse: (id: string) => void;
};

export function CoursesOverview({
  completedIds,
  onOpenCourse,
}: CoursesOverviewProps) {
  return (
    <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Пройдіть 4 короткі курси по черзі
        </h2>
        <p className="text-sm text-slate-500">
          Кожен наступний курс відкривається після завершення попереднього.
          У кожному курсі — детальне пояснення та контрольний тест із 10
          питань по темі.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Пройдено {completedIds.length} з {courses.length} курсів
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map((course, index) => {
          const isDone = completedIds.includes(course.id);
          const isUnlocked =
            index === 0 || completedIds.includes(courses[index - 1].id);
          const isLocked = !isDone && !isUnlocked;

          return (
            <button
              key={course.id}
              type="button"
              onClick={() => !isLocked && onOpenCourse(course.id)}
              disabled={isLocked}
              className={`text-left rounded-xl border p-4 shadow-sm transition-all relative ${
                isLocked
                  ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                  : "border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {isDone && (
                <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  ✓
                </span>
              )}
              {isLocked && (
                <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-xs">
                  🔒
                </span>
              )}
              <div
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-xl ${
                  isLocked
                    ? "bg-slate-200 text-slate-400"
                    : (ACCENTS[course.id] ?? "bg-blue-50 text-blue-600")
                }`}
              >
                {course.icon}
              </div>
              <h3
                className={`font-semibold mb-2 ${
                  isLocked ? "text-slate-500" : "text-slate-800"
                }`}
              >
                {course.title}
              </h3>
              <ul className="space-y-1.5 mb-3">
                {course.summary.map((point, i) => (
                  <li
                    key={i}
                    className={`text-sm leading-snug flex gap-1.5 ${
                      isLocked ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <span className="text-slate-300 shrink-0">–</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <span
                className={`text-xs font-semibold ${
                  isLocked
                    ? "text-slate-400"
                    : isDone
                      ? "text-green-600"
                      : "text-blue-600"
                }`}
              >
                {isLocked
                  ? "Спочатку пройдіть попередній курс"
                  : isDone
                    ? "Курс пройдено — переглянути ще раз"
                    : "Відкрити курс →"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
