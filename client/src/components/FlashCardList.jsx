import { useEffect, useState } from "react";
import FlashCard from "./FlashCard.jsx";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function FlashCardList({ flashcards }) {
  const [cards, setCards] = useState(flashcards);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setCards(flashcards);
    setIndex(0);
    setFlipped(false);
  }, [flashcards]);

  if (!cards || cards.length === 0) return null;

  const goTo = (newIndex) => {
    setIndex((newIndex + cards.length) % cards.length);
    setFlipped(false);
  };

  const handleShuffle = () => {
    setCards(shuffleArray(cards));
    setIndex(0);
    setFlipped(false);
  };

  const current = cards[index];
  const buttonClass =
    "rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Card {index + 1} of {cards.length}
      </p>

      <FlashCard
        question={current.question}
        answer={current.answer}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />

      <div className="flex items-center gap-3">
        <button onClick={() => goTo(index - 1)} className={buttonClass}>
          ← Previous
        </button>
        <button onClick={handleShuffle} className={buttonClass}>
          🔀 Shuffle
        </button>
        <button onClick={() => goTo(index + 1)} className={buttonClass}>
          Next →
        </button>
      </div>
    </div>
  );
}
