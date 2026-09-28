import { NextResponse } from "next/server";
import { ilike, desc } from "drizzle-orm";
import { db } from "@/db";
import { courseProgress } from "@/db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fullName = searchParams.get("fullName");

  if (!fullName || !fullName.trim()) {
    return NextResponse.json({ progress: null });
  }

  const [row] = await db
    .select()
    .from(courseProgress)
    .where(ilike(courseProgress.fullName, fullName.trim()))
    .orderBy(desc(courseProgress.updatedAt))
    .limit(1);

  if (!row) {
    return NextResponse.json({ progress: null });
  }

  return NextResponse.json({
    progress: {
      completedCourseIds: row.completedCourseIds,
      answers: row.answers,
      department: row.department,
      updatedAt: row.updatedAt.toISOString(),
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { fullName, department, completedCourseIds, answers } = body as {
    fullName?: string;
    department?: string;
    completedCourseIds?: string[];
    answers?: Record<string, { questionId: string; chosenIndex: number }[]>;
  };

  if (
    !fullName ||
    typeof fullName !== "string" ||
    !fullName.trim() ||
    !department ||
    typeof department !== "string" ||
    !department.trim() ||
    !Array.isArray(completedCourseIds) ||
    typeof answers !== "object" ||
    answers === null
  ) {
    return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
  }

  // Атомарний upsert по fullName — уникає дублікатів при паралельних
  // запитах (наприклад, подвійний клік користувача).
  await db
    .insert(courseProgress)
    .values({
      fullName: fullName.trim(),
      department: department.trim(),
      completedCourseIds,
      answers,
    })
    .onConflictDoUpdate({
      target: courseProgress.fullName,
      set: {
        department: department.trim(),
        completedCourseIds,
        answers,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
