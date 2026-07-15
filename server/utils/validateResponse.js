export class EmptyResponseError extends Error {
  constructor(message = "The AI returned an empty response.") {
    super(message);
    this.name = "EmptyResponseError";
    this.statusCode = 502;
  }
}

export class InvalidJSONError extends Error {
  constructor(message = "The AI response was not valid JSON.") {
    super(message);
    this.name = "InvalidJSONError";
    this.statusCode = 502;
  }
}

export class InvalidShapeError extends Error {
  constructor(message = "The AI response JSON did not match the expected shape.") {
    super(message);
    this.name = "InvalidShapeError";
    this.statusCode = 502;
  }
}

function stripCodeFences(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return fenced ? fenced[1] : text;
}

export function parseJSON(rawText) {
  if (!rawText || !rawText.trim()) {
    throw new EmptyResponseError();
  }

  const cleaned = stripCodeFences(rawText).trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new InvalidJSONError(`Could not parse AI response as JSON: ${err.message}`);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateFlashcards(flashcards) {
  if (!Array.isArray(flashcards) || flashcards.length === 0) {
    throw new InvalidShapeError("Expected a non-empty \"flashcards\" array.");
  }

  const valid = flashcards.every(
    (card) => card && isNonEmptyString(card.question) && isNonEmptyString(card.answer)
  );

  if (!valid) {
    throw new InvalidShapeError("Each flashcard must have a non-empty \"question\" and \"answer\".");
  }

  return flashcards;
}

export function validateQuiz(quiz) {
  if (!Array.isArray(quiz) || quiz.length === 0) {
    throw new InvalidShapeError("Expected a non-empty \"quiz\" array.");
  }

  const valid = quiz.every(
    (item) =>
      item &&
      isNonEmptyString(item.question) &&
      Array.isArray(item.options) &&
      item.options.length >= 2 &&
      item.options.every(isNonEmptyString) &&
      isNonEmptyString(item.correctAnswer) &&
      item.options.includes(item.correctAnswer)
  );

  if (!valid) {
    throw new InvalidShapeError(
      "Each quiz question must have a question, an options array, and a correctAnswer present in options."
    );
  }

  return quiz;
}
