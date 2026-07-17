# StudySpark AI

**Turn Notes into Interactive Learning**

StudySpark AI turns pasted notes (or just a topic) into AI-generated flashcards and a multiple-choice quiz — built and structured like a real SaaS product rather than a one-off script.

## Features

### Core Features (Assignment Requirements)

- 📝 **Smart Notes Input** — paste notes or enter any topic, live character counter, clear input
- 🤖 **AI Flashcard Generator** — generate, flip, previous/next, shuffle, restart
- 📚 **AI Quiz Generator** — multiple-choice questions, instant scoring, correct-answer reveal, retry only the questions you got wrong
- 🔄 **Regenerate** — request a fresh set of flashcards or a fresh quiz independently
- 📱 **Responsive Design** — verified on desktop, tablet, and mobile layouts
- 🌙 **Dark Mode** — persisted across sessions, respects system preference on first load
- ⚠️ **Robust Error Handling** — loading states, empty AI responses, invalid JSON, network errors, request timeouts, a retry button, and protection against stale responses overwriting newer ones

### Bonus Features (Beyond the Assignment)

- 📊 **Study Statistics Dashboard** — lifetime flashcards generated, quiz attempts, average/highest score, accuracy, all persisted locally
- 📄 **Export Flashcards to PDF** — download the current flashcard set as a PDF
- ✏️ **Edit & Delete Flashcards** — correct or remove individual cards after generation
- 🔍 **Live Flashcard Search** — instantly filter cards by question or answer text
- 💾 **Session Persistence** — reload the page and pick up right where you left off

## Tech Stack

**Frontend** — React 18, Vite, React Router, Tailwind CSS, Axios, jsPDF
**Backend** — Node.js, Express, [Groq SDK](https://console.groq.com) (`llama-3.3-70b-versatile`)
**Persistence** — browser `localStorage` (session state + lifetime stats), no database required

## App Flow

```
Home → Generate → Flashcards → Quiz → Results → Retry Wrong Answers
```

Study Statistics are available from the navbar at any time.

## Project Structure

```
StudyAI/
├── client/                         React + Vite frontend
│   └── src/
│       ├── components/             FlashCard, Quiz, Result, ErrorBox, Toast, etc.
│       ├── pages/                  Home, Flashcards, QuizPage, Results, Stats
│       ├── context/                ThemeContext, ToastContext, StatsContext, StudyContext
│       ├── hooks/                  useAI (loading/error state, stale-request guard)
│       ├── services/               api.js (axios client)
│       └── utils/                  validateJSON.js, exportPdf.js
│
└── server/                         Express backend
    ├── routes/ai.js
    ├── controllers/aiController.js
    ├── services/groqService.js     Groq client + error handling
    ├── utils/                      promptBuilder.js, validateResponse.js
    └── index.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- A free Groq API key from [console.groq.com](https://console.groq.com)

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
# edit .env and set GROQ_API_KEY=your_actual_key
npm run dev
```

The server starts on `http://localhost:5000`.

### 2. Frontend setup

```bash
cd client
npm install
npm run dev
```

The app starts on `http://localhost:5173` (or the next free port).

## Environment Variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on (default `5000`) |
| `GROQ_API_KEY` | Your Groq API key |
| `CLIENT_ORIGIN` | Frontend origin for CORS (any `localhost:<port>` is allowed automatically in development) |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/generate` | Generate flashcards + quiz from `{ notes, topic }` |
| `POST` | `/api/flashcards` | Regenerate flashcards only |
| `POST` | `/api/quiz` | Regenerate the quiz only |

All endpoints return structured JSON errors (`{ error, code }`) with the appropriate HTTP status — `400` bad request, `429` rate limit/quota, `502` malformed/empty AI response, `504` timeout.

## Error Handling

The assignment specifically emphasizes handling unreliable AI output, so the app treats it as a first-class concern on both ends:

- **Server** — validates the AI response is present, is valid JSON, and matches the expected flashcard/quiz shape before ever reaching the client
- **Client** — a shared `useAI` hook tracks loading/error state per request, uses an `AbortController` + incrementing request ID so an older in-flight request can never overwrite a newer one, and every failure surfaces a specific, human-readable message (network error, timeout, rate limit, malformed response) with a **Retry** button

## AI Usage Note

This project was built with **Claude (Claude Code)** as an AI pair-programmer throughout the whole build — scaffolding the client/server structure, the Express + Groq backend, the React frontend, the error-handling layers, and the bonus features (Stats dashboard, PDF export, flashcard edit/search).

Specific things worth being upfront about:
- The AI provider was switched twice during development (Gemini → hit a `limit: 0` free-tier quota issue tied to the Google account type → Groq), and a real bug in the Gemini SDK integration (it was silently switching to Vertex AI/OAuth auth mode because of an ambient environment variable) was diagnosed and fixed along the way.
- Architectural decisions — like using an incrementing request ID + `AbortController` in `useAI.js` to stop stale AI responses from overwriting newer ones, and keeping the Express controller provider-agnostic so swapping Gemini for Groq only touched one file — were made deliberately for this assignment's specific emphasis on handling unreliable AI output, not left as defaults.
- Every feature was verified by actually running the app (via Playwright browser automation) rather than just reading the code — including deliberately simulating network failures, empty/malformed AI responses, and rapid duplicate requests to confirm the failure-handling actually works.

**[Fill in: your own role — what you directed, reviewed, changed, or debugged yourself, and which parts of the codebase you'd want to walk through in the interview.]**

## Known Limitations

- Only two AI-returned block types are supported (flashcards and multiple-choice quiz) — the stretch goal of rendering arbitrary block types (chart, checklist, etc.) wasn't built.
- No streaming — generation returns as a single complete response rather than rendering incrementally.
- No true refinement loop — "Regenerate" replaces the flashcard/quiz set entirely rather than editing the existing result via a follow-up prompt.
- Session and stats persistence is local-only (`localStorage`), single-user, no accounts or backend storage.
- Groq's free tier has request-rate limits; heavy use can surface a 429 rate-limit error (handled gracefully, but it does limit throughput).
- The flashcard flip target is a clickable `div`, not keyboard-navigable yet (no `tabIndex`/`onKeyDown`) — the rest of the UI (buttons, inputs) is natively keyboard-accessible.
- No automated test suite (Jest/RTL) — verification during development was manual + Playwright-driven, not wired into CI.
- Not yet deployed — runs locally only.

**[Fill in: anything else you noticed while using it, or would call out yourself in the interview.]**

## Time Spent

**[Fill in honestly — the assignment asks you to aim for ~8 hours and not exceed that. Given the scope built here (including the bonus features), be candid in the interview about actual time spent, what you'd cut if constrained to 8 hours, and what you'd tackle next if given more time.]**
