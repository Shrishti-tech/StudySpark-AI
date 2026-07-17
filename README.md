# 📚 StudySpark AI

Turn Notes into Interactive Learning with AI.

StudySpark AI is a full-stack AI-powered study assistant that transforms notes or topics into interactive flashcards and multiple-choice quizzes using the Groq LLM API. It is designed to provide a clean, responsive learning experience while handling unreliable AI responses gracefully through validation, retries, and structured error handling.

---

## 🚀 Live Demo

**Frontend:** https://study-spark-ai-ten.vercel.app

**Backend Health Check:** https://studyspark-ai-server.onrender.com/api/health

---

## ✨ Features

### Core Features

- 📝 Paste notes or enter any study topic
- 🤖 AI-generated flashcards
- 📚 AI-generated multiple-choice quizzes
- 🔄 Regenerate flashcards independently
- 🔄 Regenerate quiz independently
- 🌙 Dark / Light mode
- 📱 Fully responsive design
- ⚡ Fast loading with skeleton placeholders
- ⚠️ Comprehensive error handling
- 🔁 Retry failed requests

---

### Flashcards

- Flip cards
- Previous / Next navigation
- Shuffle flashcards
- Restart deck
- Edit flashcards
- Delete flashcards
- Search flashcards instantly
- Export flashcards as PDF

---

### Quiz

- Multiple-choice questions
- Instant answer validation
- Progress indicator
- Final score
- Retry only incorrect questions
- Regenerate quiz

---

### Study Dashboard

Tracks learning statistics including:

- Flashcards generated
- Quiz attempts
- Questions answered
- Correct answers
- Highest score
- Average score
- Accuracy percentage

Statistics are stored locally using browser LocalStorage.

---

## 🛠 Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- jsPDF

### Backend

- Node.js
- Express.js
- Groq SDK
- Llama 3.3 70B Versatile

### Deployment

- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```
StudySpark-AI
│
├── client
│   ├── components
│   ├── context
│   ├── hooks
│   ├── pages
│   ├── services
│   └── utils
│
├── server
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── utils
│   └── index.js
│
├── render.yaml
├── README.md
└── vercel.json
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>

cd StudySpark-AI
```

---

### Backend Setup

```bash
cd server

npm install

npm run dev
```

Create a `.env` file inside the server folder:

```env
PORT=5000

GROQ_API_KEY=YOUR_GROQ_API_KEY

CLIENT_ORIGIN=http://localhost:5173
```

---

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

Create a `.env` file inside the client folder:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Deployment

### Frontend

Hosted on **Vercel**

Production Environment Variable

```env
VITE_API_URL=https://studyspark-ai-server.onrender.com/api
```

---

### Backend

Hosted on **Render**

Environment Variables

```env
PORT=5000

GROQ_API_KEY=YOUR_GROQ_API_KEY

CLIENT_ORIGIN=https://study-spark-ai-ten.vercel.app
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Health Check |
| POST | `/api/generate` | Generate Flashcards & Quiz |
| POST | `/api/flashcards` | Regenerate Flashcards |
| POST | `/api/quiz` | Regenerate Quiz |

---

## 🛡 Error Handling

The application includes robust client-side and server-side validation.

Handled scenarios include:

- Network failures
- Request timeout
- Empty AI response
- Invalid JSON
- Incorrect response format
- Rate limiting
- Server errors
- Stale request protection
- Loading skeletons

---

## 💾 Local Storage

The application stores:

- Theme preference
- Flashcards
- Quiz data
- Study statistics
- Session progress

---

## 🎯 Future Improvements

- User authentication
- Cloud database integration
- Study history
- AI follow-up conversations
- Image-based flashcards
- Spaced repetition algorithm
- Multi-language support

---


## 👩‍💻 Author

**Shrishti Dixit**

B.Tech CSE Student

GitHub: https://github.com/Shrishti-tech

LinkedIn: linkedin.com/in/shrishti-dixit-7735382b3

---

## 📄 License

This project is developed for educational purposes as part of a Frontend Internship Assignment.
