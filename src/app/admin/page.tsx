import { cookies } from "next/headers";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { attempts } from "@/db/schema";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { AdminTable } from "@/components/AdminTable";

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

  const rows = await db
    .select()
    .from(attempts)
    .orderBy(desc(attempts.createdAt));

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
      <main className="max-w-6xl mx-auto px-4 py-8">
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
      </main>
    </div>
  );
}
