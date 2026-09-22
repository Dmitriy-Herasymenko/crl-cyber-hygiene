"use client";

import { useMemo, useState } from "react";
import { pickFinalTestQuestions, type QuizQuestion } from "@/lib/courses-data";
import { shuffleQuestionOptions } from "@/lib/shuffle";

export type FinalTestAnswer = { questionId: string; chosenIndex: number };

type FinalTestProps = {
  onFinish: (answers: FinalTestAnswer[]) => void;
};

export function FinalTest({ onFinish }: FinalTestProps) {
  const [questions] = useState<QuizQuestion[]>(() => pickFinalTestQuestions());
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FinalTestAnswer[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  const question = questions[step];
  const { options: shuffledOptions, correctIndex: shuffledCorrectIndex, order } =
    useMemo(() => shuffleQuestionOptions(question), [question]);
  const isLast = step === questions.length - 1;
  const isCorrect = selected !== null && selected === shuffledCorrectIndex;

  function handleSelect(index: number) {
    if (selected !== null) return;
    setSelected(index);
  }

  function handleNext() {
    if (selected === null) return;
    const nextAnswers = [
      ...answers,
      { questionId: question.id, chosenIndex: order[selected] },
    ];
    if (isLast) {
      onFinish(nextAnswers);
      return;
    }
    setAnswers(nextAnswers);
    setSelected(null);
    setStep((s) => s + 1);
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-7 mb-10">
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Фінальний тест — питання {step + 1} із {questions.length}
          </p>
          <p className="text-xs text-slate-400">
            {Math.round(((step + 1) / questions.length) * 100)}%
          </p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden mb-3">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${((step + (selected !== null ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
        <h2 className="text-base font-semibold text-slate-800">
          {question.title}
        </h2>
      </div>

      <p className="text-sm text-slate-600 mb-5 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
        {question.situation}
      </p>

      <div className="space-y-2.5">
        {shuffledOptions.map((option, index) => {
          const isChosen = selected === index;
          const isRightAnswer = index === shuffledCorrectIndex;
          let stateClasses =
            "border-slate-200 hover:border-blue-400 hover:bg-blue-50/60";
          let badge: React.ReactNode = null;
          if (selected !== null) {
            if (isRightAnswer) {
              stateClasses = "border-green-500 bg-green-50";
              badge = <span className="text-green-600">✓</span>;
            } else if (isChosen && !isRightAnswer) {
              stateClasses = "border-red-400 bg-red-50";
              badge = <span className="text-red-500">✕</span>;
            } else {
              stateClasses = "border-slate-200 opacity-50";
            }
          }
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={selected !== null}
              className={`w-full flex items-start gap-3 text-left rounded-lg border px-4 py-3 text-sm text-slate-700 transition-colors ${stateClasses}`}
            >
              <span className="flex-1">{option}</span>
              {badge}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div
          className={`mt-5 rounded-lg p-4 text-sm border animate-step ${
            isCorrect
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-amber-50 text-amber-900 border-amber-200"
          }`}
        >
          <p className="font-semibold mb-1 flex items-center gap-1.5">
            {isCorrect ? "✅ Правильно!" : "💡 Не зовсім так"}
          </p>
          <p>{question.explanation}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          disabled={selected === null}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed transition-all"
        >
          {isLast ? "Завершити тест" : "Наступне питання"}
          <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
