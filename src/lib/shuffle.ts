import type { QuizQuestion } from "@/lib/courses-data";

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleQuestionOptions(question: QuizQuestion): {
  options: string[];
  correctIndex: number;
  /** order[shuffledIndex] = original index of that option in question.options */
  order: number[];
} {
  const order = shuffleArray(question.options.map((_, i) => i));
  return {
    options: order.map((i) => question.options[i]),
    correctIndex: order.indexOf(question.correctIndex),
    order,
  };
}
