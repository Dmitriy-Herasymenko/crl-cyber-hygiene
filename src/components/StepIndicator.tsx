const STEPS = [
  { key: "login", label: "Дані" },
  { key: "courses", label: "Курси" },
  { key: "final-test", label: "Тест" },
  { key: "result", label: "Результат" },
] as const;

type StepIndicatorProps = {
  current: number;
};

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <ol className="flex items-center w-full mb-8">
      {STEPS.map((step, index) => {
        const isDone = index < current;
        const isActive = index === current;
        return (
          <li key={step.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isDone
                    ? "bg-blue-600 text-white"
                    : isActive
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : "bg-white text-slate-400 border border-slate-300"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </div>
              <span
                className={`hidden sm:inline text-sm font-medium whitespace-nowrap ${
                  isActive
                    ? "text-slate-900"
                    : isDone
                      ? "text-slate-600"
                      : "text-slate-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-3 h-0.5 flex-1 rounded transition-colors ${
                  isDone ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
