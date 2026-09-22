import { NextResponse } from "next/server";
import { db } from "@/db";
import { attempts, attemptAnswers } from "@/db/schema";
import { allQuizQuestions } from "@/lib/courses-data";

type AnswerInput = {
  questionId: string;
  chosenIndex: number;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { fullName, department, answers } = body as {
    fullName?: string;
    department?: string;
    answers?: AnswerInput[];
  };

  if (
    !fullName ||
    typeof fullName !== "string" ||
    !fullName.trim() ||
    !department ||
    typeof department !== "string" ||
    !department.trim() ||
    !Array.isArray(answers) ||
    answers.length === 0
  ) {
    return NextResponse.json({ error: "Некоректні дані" }, { status: 400 });
  }

  let score = 0;
  const gradedAnswers = answers.map((answer) => {
    const question = allQuizQuestions.find((q) => q.id === answer.questionId);
    const isCorrect = !!question && question.correctIndex === answer.chosenIndex;
    if (isCorrect) score += 1;
    return {
      questionId: answer.questionId,
      chosenIndex: answer.chosenIndex,
      isCorrect,
    };
  });

  const [attempt] = await db
    .insert(attempts)
    .values({
      fullName: fullName.trim(),
      department: department.trim(),
      score,
      totalQuestions: answers.length,
      mistakes: answers.length - score,
    })
    .returning();

  if (gradedAnswers.length > 0) {
    await db.insert(attemptAnswers).values(
      gradedAnswers.map((a) => ({
        attemptId: attempt.id,
        questionId: a.questionId,
        chosenIndex: a.chosenIndex,
        isCorrect: a.isCorrect,
      }))
    );
  }

  return NextResponse.json({
    attemptId: attempt.id,
    score,
    total: answers.length,
  });
}
