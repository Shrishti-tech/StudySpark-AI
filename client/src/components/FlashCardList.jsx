import { useEffect, useMemo, useState } from "react";
import FlashCard from "./FlashCard.jsx";
import { useStudy } from "../context/StudyContext.jsx";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function FlashCardList() {
  const { flashcards, updateFlashcard, deleteFlashcard } = useStudy();
  const [orderIds, setOrderIds] = useState(() => flashcards.map((c) => c.id));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draftQuestion, setDraftQuestion] = useState("");
  const [draftAnswer, setDraftAnswer] = useState("");

  useEffect(() => {
    setOrderIds(flashcards.map((c) => c.id));
    setIndex(0);
    setFlipped(false);
    setSearch("");
    setEditingId(null);
  }, [flashcards]);

  const byId = useMemo(() => new Map(flashcards.map((c) => [c.id, c])), [flashcards]);
  const orderedCards = orderIds.map((id) => byId.get(id)).filter(Boolean);

  const query = search.trim().toLowerCase();
  const visibleCards = query
    ? orderedCards.filter(
        (c) => c.question.toLowerCase().includes(query) || c.answer.toLowerCase().includes(query)
      )
    : orderedCards;

  if (flashcards.length === 0) return null;

  const safeIndex = Math.min(index, Math.max(visibleCards.length - 1, 0));
  const current = visibleCards[safeIndex];
  const buttonClass =
    "rounded-lg border border-slate-300 dark:border-slate-700 px-4 py-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

  const goTo = (newIndex) => {
    if (visibleCards.length === 0) return;
    setIndex((newIndex + visibleCards.length) % visibleCards.length);
    setFlipped(false);
  };

  const handleShuffle = () => {
    setOrderIds(shuffleArray(flashcards.map((c) => c.id)));
    setSearch("");
    setIndex(0);
    setFlipped(false);
  };

  const handleRestart = () => {
    setOrderIds(flashcards.map((c) => c.id));
    setSearch("");
    setIndex(0);
    setFlipped(false);
  };

  const startEdit = (card) => {
    setEditingId(card.id);
    setDraftQuestion(card.question);
    setDraftAnswer(card.answer);
    setFlipped(false);
  };

  const saveEdit = () => {
    if (!draftQuestion.trim() || !draftAnswer.trim()) return;
    updateFlashcard(editingId, { question: draftQuestion.trim(), answer: draftAnswer.trim() });
    setEditingId(null);
  };

  const handleDelete = (card) => {
    deleteFlashcard(card.id);
    setOrderIds((prev) => prev.filter((id) => id !== card.id));
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIndex(0);
        }}
        placeholder="🔍 Search flashcards..."
        className="w-full max-w-xl rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {visibleCards.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 py-8">No flashcards match your search.</p>
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Card {safeIndex + 1} of {visibleCards.length}
          </p>

          {editingId === current.id ? (
            <div className="w-full max-w-xl mx-auto rounded-2xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 p-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Question</label>
                <textarea
                  value={draftQuestion}
                  onChange={(e) => setDraftQuestion(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Answer</label>
                <textarea
                  value={draftAnswer}
                  onChange={(e) => setDraftAnswer(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setEditingId(null)} className={buttonClass}>
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <FlashCard
                question={current.question}
                answer={current.answer}
                flipped={flipped}
                onFlip={() => setFlipped((f) => !f)}
              />
              <div className="flex items-center gap-3">
                <button onClick={() => startEdit(current)} className={buttonClass}>
                  ✏ Edit
                </button>
                <button onClick={() => handleDelete(current)} className={buttonClass}>
                  🗑 Delete
                </button>
              </div>
            </>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => goTo(safeIndex - 1)} className={buttonClass}>
              ← Previous
            </button>
            <button onClick={handleShuffle} className={buttonClass}>
              🔀 Shuffle
            </button>
            <button onClick={() => goTo(safeIndex + 1)} className={buttonClass}>
              Next →
            </button>
            <button onClick={handleRestart} className={buttonClass}>
              ⟲ Restart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
