"use client";

import { useState } from "react";
import { departments } from "@/lib/departments-data";

type IntroFormProps = {
  onStart: (fullName: string, department: string) => void;
};

const OTHER_VALUE = "__other__";

export function IntroForm({ onStart }: IntroFormProps) {
  const [fullName, setFullName] = useState("");
  const [departmentSelect, setDepartmentSelect] = useState("");
  const [customDepartment, setCustomDepartment] = useState("");
  const [touched, setTouched] = useState(false);

  const isOther = departmentSelect === OTHER_VALUE;
  const department = isOther ? customDepartment.trim() : departmentSelect;
  const isValid = fullName.trim().length > 2 && department.length > 1;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onStart(fullName.trim(), department);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7 mb-10"
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Перед початком вкажіть свої дані
        </h2>
        <p className="text-sm text-slate-500">
          Потрібно для фіксації проходження інструктажу та видачі сертифіката.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            ПІБ
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Прізвище Ім'я По-батькові"
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
          />
          {touched && fullName.trim().length <= 2 && (
            <p className="text-xs text-red-600 mt-1.5">Введіть повне ПІБ</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Відділення
          </label>
          <select
            value={departmentSelect}
            onChange={(e) => setDepartmentSelect(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 bg-white transition-colors"
          >
            <option value="" disabled>
              Оберіть відділення
            </option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
            <option value={OTHER_VALUE}>Інше (вказати вручну)</option>
          </select>
          {isOther && (
            <input
              type="text"
              value={customDepartment}
              onChange={(e) => setCustomDepartment(e.target.value)}
              placeholder="Вкажіть назву відділення"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
            />
          )}
          {touched && department.length <= 1 && (
            <p className="text-xs text-red-600 mt-1.5">Вкажіть відділення</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all"
      >
        Продовжити
        <span aria-hidden>→</span>
      </button>
    </form>
  );
}
