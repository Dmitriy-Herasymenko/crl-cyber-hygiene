"use client";

import { useMemo, useState } from "react";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

type Row = {
  id: number;
  fullName: string;
  department: string;
  score: number;
  totalQuestions: number;
  mistakes: number;
  createdAt: string;
};

type AdminTableProps = {
  rows: Row[];
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

export function AdminTable({ rows }: AdminTableProps) {
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [search, setSearch] = useState("");

  const departments = useMemo(() => {
    const set = new Set(rows.map((r) => r.department));
    return Array.from(set).sort();
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (departmentFilter !== "all" && r.department !== departmentFilter) {
        return false;
      }
      if (
        search.trim() &&
        !r.fullName.toLowerCase().includes(search.trim().toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [rows, departmentFilter, search]);

  const stats = useMemo(() => {
    const total = filteredRows.length;
    const avgScore = total
      ? (
          filteredRows.reduce((sum, r) => sum + r.score, 0) / total
        ).toFixed(1)
      : "0";
    const totalMistakes = filteredRows.reduce((sum, r) => sum + r.mistakes, 0);
    return { total, avgScore, totalMistakes };
  }, [filteredRows]);

  async function handleExportDocx() {
    // Експорт завжди по всіх даних, незалежно від пошуку/фільтра відділення
    // в таблиці на екрані.
    const grouped = new Map<string, Row[]>();
    for (const r of rows) {
      if (!grouped.has(r.department)) grouped.set(r.department, []);
      grouped.get(r.department)!.push(r);
    }
    const departmentNames = Array.from(grouped.keys()).sort((a, b) =>
      a.localeCompare(b, "uk")
    );

    const children: Paragraph[] = [
      new Paragraph({
        text: "Результати проходження інструктажу з кібербезпеки",
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Сформовано: ${formatDate(new Date().toISOString())}`,
            italics: true,
            color: "666666",
          }),
        ],
        spacing: { after: 300 },
      }),
    ];

    for (const dep of departmentNames) {
      children.push(
        new Paragraph({
          text: dep,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 150 },
        })
      );

      const docs = [...grouped.get(dep)!].sort((a, b) =>
        a.fullName.localeCompare(b.fullName, "uk")
      );

      docs.forEach((r, i) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${i + 1}. ${r.fullName}`, bold: true }),
              new TextRun({
                text: ` — ${r.score}/${r.totalQuestions} балів (${r.mistakes} ${
                  r.mistakes === 1 ? "помилка" : "помилок"
                }), пройдено ${formatDate(r.createdAt)}`,
              }),
            ],
            spacing: { after: 80 },
          })
        );
      });
    }

    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cyber-hygiene-results-${new Date()
      .toISOString()
      .slice(0, 10)}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Середній бал</p>
          <p className="text-2xl font-bold text-slate-900">{stats.avgScore}</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-500 mb-1">Всього помилок</p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.totalMistakes}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Пошук за ПІБ…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full sm:w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Усі відділення</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleExportDocx}
          className="sm:ml-auto inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Експорт
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500">
              <th className="px-4 py-3 font-medium">ПІБ</th>
              <th className="px-4 py-3 font-medium">Відділення</th>
              <th className="px-4 py-3 font-medium">Бал</th>
              <th className="px-4 py-3 font-medium">Помилок</th>
              <th className="px-4 py-3 font-medium">Дата</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 text-slate-800">{r.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{r.department}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      r.score >= Math.ceil(r.totalQuestions * 0.6)
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {r.score}/{r.totalQuestions}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{r.mistakes}</td>
                <td className="px-4 py-3 text-slate-500">
                  {formatDate(r.createdAt)}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Немає результатів за обраними фільтрами
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
