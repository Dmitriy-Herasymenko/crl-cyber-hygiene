import { cookies } from "next/headers";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { attempts, courseProgress } from "@/db/schema";
import { courses } from "@/lib/courses-data";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminTable } from "@/components/AdminTable";
import { AdminInProgressTable } from "@/components/AdminInProgressTable";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthed = verifySessionToken(token);

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <AdminLoginForm />
      </div>
    );
  }

  const [rows, progressRows] = await Promise.all([
    db.select().from(attempts).orderBy(desc(attempts.createdAt)),
    db.select().from(courseProgress).orderBy(desc(courseProgress.updatedAt)),
  ]);

  const completedNames = new Set(
    rows.map((r) => r.fullName.trim().toLowerCase())
  );
  const inProgressRows = progressRows.filter(
    (p) => !completedNames.has(p.fullName.trim().toLowerCase())
  );

  const completedPeopleCount = completedNames.size;
  const inProgressPeopleCount = inProgressRows.length;
  const totalPeopleCount = completedPeopleCount + inProgressPeopleCount;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900">
            Результати проходження інструктажу
          </h1>
          <form action="/api/admin/logout" method="post">
            <button
              formAction="/api/admin/logout"
              className="text-sm text-slate-500 hover:text-slate-800"
              type="submit"
            >
              Вийти
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Всього людей</p>
            <p className="text-2xl font-bold text-slate-900">
              {totalPeopleCount}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">Завершили інструктаж</p>
            <p className="text-2xl font-bold text-green-600">
              {completedPeopleCount}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 mb-1">В процесі проходження</p>
            <p className="text-2xl font-bold text-amber-600">
              {inProgressPeopleCount}
            </p>
          </div>
        </div>

        <AdminTable
          rows={rows.map((r) => ({
            id: r.id,
            fullName: r.fullName,
            department: r.department,
            score: r.score,
            totalQuestions: r.totalQuestions,
            mistakes: r.mistakes,
            createdAt: r.createdAt.toISOString(),
          }))}
        />

        <AdminInProgressTable
          totalCourses={courses.length}
          rows={inProgressRows.map((p) => ({
            id: p.id,
            fullName: p.fullName,
            department: p.department,
            completedCount: p.completedCourseIds.length,
            updatedAt: p.updatedAt.toISOString(),
          }))}
        />
      </main>
    </div>
  );
}
