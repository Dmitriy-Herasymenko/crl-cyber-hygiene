type ResultCardProps = {
  score: number;
  total: number;
  fullName: string;
};

export function ResultCard({ score, total, fullName }: ResultCardProps) {
  const mistakes = total - score;
  const passed = score >= Math.ceil(total * 0.6);

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-10 text-center mb-10">
      <div
        className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
          passed ? "bg-green-50" : "bg-amber-50"
        }`}
      >
        {passed ? "✅" : "⚠️"}
      </div>
      <h2 className="text-xl font-semibold text-slate-800 mb-2">
        {passed ? "Інструктаж пройдено!" : "Варто повторити матеріал"}
      </h2>
      <p className="text-slate-600 mb-2">{fullName}</p>

      <div className="inline-flex items-center gap-3 rounded-full bg-slate-50 border border-slate-200 px-5 py-2 mt-2">
        <span className="text-2xl font-bold text-blue-600">
          {score}/{total}
        </span>
        <span className="text-sm text-slate-500">
          {mistakes === 0
            ? "без помилок"
            : `${mistakes} ${mistakes === 1 ? "помилка" : "помилок"}`}
        </span>
      </div>

      <p className="text-xs text-slate-400 mt-6">
        Результат автоматично збережено та доступний адміністратору.
      </p>
    </section>
  );
}
