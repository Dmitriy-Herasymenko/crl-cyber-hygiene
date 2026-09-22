import type { ReactNode } from "react";

export function MockupFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-2 border-b border-slate-200">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-slate-500">{title}</span>
      </div>
      <div className="bg-white p-4 sm:p-5 text-sm">{children}</div>
    </div>
  );
}

export function FlagList({
  flags,
}: {
  flags: { n: number; label: string; detail: string }[];
}) {
  return (
    <ul className="mt-4 space-y-2">
      {flags.map((f) => (
        <li key={f.n} className="flex items-start gap-2.5 text-sm">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-xs font-bold">
            {f.n}
          </span>
          <span className="text-slate-600">
            <span className="font-medium text-slate-800">{f.label}.</span>{" "}
            {f.detail}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CompareTwo({
  left,
  right,
}: {
  left: { label: string; text: string };
  right: { label: string; text: string };
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-red-700 mb-1.5">
          <span aria-hidden>✕</span> {left.label}
        </p>
        <p className="text-sm text-red-900/80 leading-snug">{left.text}</p>
      </div>
      <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-green-700 mb-1.5">
          <span aria-hidden>✓</span> {right.label}
        </p>
        <p className="text-sm text-green-900/80 leading-snug">{right.text}</p>
      </div>
    </div>
  );
}

export function Timeline({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
            {i + 1}
          </span>
          <span className="text-sm text-slate-700 pt-0.5">{step}</span>
        </li>
      ))}
    </ol>
  );
}

export function KeyCap({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-lg border-2 border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-[0_2px_0_0_#cbd5e1]">
      {children}
    </span>
  );
}
