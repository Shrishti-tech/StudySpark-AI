export class InvalidShapeError extends Error {
  constructor(message = "The server response did not match the expected format.") {
    super(message);
    this.name = "InvalidShapeError";
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseIfString(data) {
  if (typeof data !== "string") return data;

  try {
    return JSON.parse(data);
  } catch (err) {
    throw new InvalidShapeError("The server returned data that was not valid JSON.");
  }
}

export function validateFlashcards(flashcards) {
  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    throw new InvalidShapeError("No flashcards were returned.");
  }

  const valid = flashcards.every(
    (card) => card && isNonEmptyString(card.question) && isNonEmptyString(card.answer)
  );

  if (!valid) {
    throw new InvalidShapeError("Received malformed flashcard data.");
  }

  return flashcards;
}

export function validateQuiz(quiz) {
  if (!Array.isArray(quiz) || quiz.length === 0) {
    throw new InvalidShapeError("No quiz questions were returned.");
  }

  const valid = quiz.every(
    (item) =>
      item &&
      isNonEmptyString(item.question) &&
      Array.isArray(item.options) &&
      item.options.length >= 2 &&
      isNonEmptyString(item.answer) &&
      item.options.includes(item.answer)
  );

  if (!valid) {
    throw new InvalidShapeError("Received malformed quiz data.");
  }

  return quiz;
}
