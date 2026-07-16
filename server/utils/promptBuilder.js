const JSON_INSTRUCTIONS = `
Return ONLY valid JSON. Do not include markdown code fences, explanations, or any text outside the JSON object.
`;

function sourceBlock(notes, topic) {
  if (notes && notes.trim()) {
    return `Study material:\n"""\n${notes.trim()}\n"""`;
  }
  return `Topic: "${topic.trim()}"\nGenerate content from your own knowledge of this topic.`;
}

export function buildFlashcardsPrompt({ notes, topic, count = 8 }) {
  return `
You are an expert study assistant. Based on the material below, create exactly ${count} flashcards
that help a student memorize and understand the key concepts.

${sourceBlock(notes, topic)}

${JSON_INSTRUCTIONS}
Respond with this exact JSON shape:
{
  "flashcards": [
    { "question": "string", "answer": "string" }
  ]
}
`.trim();
}

export function buildQuizPrompt({ notes, topic, count = 5 }) {
  return `
You are an expert study assistant. Based on the material below, create exactly ${count} multiple-choice
quiz questions that test understanding of the key concepts. Each question must have exactly 4 options
with exactly one correct answer.

${sourceBlock(notes, topic)}

${JSON_INSTRUCTIONS}
Respond with this exact JSON shape:
{
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string (must exactly match one of the options)"
    }
  ]
}
`.trim();
}

export function buildFullPrompt({ notes, topic, flashcardCount = 8, quizCount = 5 }) {
  return `
You are an expert study assistant. Based on the material below, generate both flashcards and a
multiple-choice quiz to help a student study.

${sourceBlock(notes, topic)}

Create exactly ${flashcardCount} flashcards and exactly ${quizCount} quiz questions.
Each quiz question must have exactly 4 options with exactly one correct answer.

${JSON_INSTRUCTIONS}
Respond with this exact JSON shape:
{
  "flashcards": [
    { "question": "string", "answer": "string" }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": "string (must exactly match one of the options)"
    }
  ]
}
`.trim();
}
