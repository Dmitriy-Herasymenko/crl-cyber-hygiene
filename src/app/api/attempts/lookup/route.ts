import { NextResponse } from "next/server";
import { ilike, desc } from "drizzle-orm";
import { db } from "@/db";
import { attempts } from "@/db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fullName = searchParams.get("fullName");

  if (!fullName || !fullName.trim()) {
    return NextResponse.json({ attempt: null });
  }

  const [attempt] = await db
    .select()
    .from(attempts)
    .where(ilike(attempts.fullName, fullName.trim()))
    .orderBy(desc(attempts.createdAt))
    .limit(1);

  if (!attempt) {
    return NextResponse.json({ attempt: null });
  }

  return NextResponse.json({
    attempt: {
      id: attempt.id,
      department: attempt.department,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      createdAt: attempt.createdAt.toISOString(),
    },
  });
}
