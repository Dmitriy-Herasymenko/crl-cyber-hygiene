type InProgressRow = {
  id: number;
  fullName: string;
  department: string;
  completedCount: number;
  updatedAt: string;
};

type AdminInProgressTableProps = {
  rows: InProgressRow[];
  totalCourses: number;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function AdminInProgressTable({
  rows,
  totalCourses,
}: AdminInProgressTableProps) {
  if (rows.length === 0) return null;

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          В процесі проходження
        </h2>
        <p className="text-sm text-slate-500">
          Зареєструвались і почали курси, але ще не завершили фінальний тест.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">ПІБ</th>
              <th className="px-4 py-3 font-medium">Відділення</th>
              <th className="px-4 py-3 font-medium">Прогрес</th>
              <th className="px-4 py-3 font-medium">Остання активність</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-800">{r.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{r.department}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `${(r.completedCount / totalCourses) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-amber-700 whitespace-nowrap">
                      {r.completedCount}/{totalCourses} курсів
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(r.updatedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
