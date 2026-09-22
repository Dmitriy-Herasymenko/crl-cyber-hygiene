type ReturningUserCardProps = {
  fullName: string;
  score: number;
  total: number;
  createdAt: string;
  onRetake: () => void;
};

export function ReturningUserCard({
  fullName,
  score,
  total,
  createdAt,
  onRetake,
}: ReturningUserCardProps) {
  const formattedDate = new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center mb-10">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
        👋
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        {fullName}, ви вже проходили цей інструктаж
      </h2>

      <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 border border-slate-200 px-5 py-2 mb-2 mt-1">
        <span className="text-xl font-bold text-blue-600">
          {score}/{total}
        </span>
        <span className="text-sm text-slate-500">від {formattedDate}</span>
      </div>

      <div className="flex justify-center mt-6">
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors"
        >
          🔄 Пройти тест повторно
        </button>
      </div>
    </section>
  );
}
