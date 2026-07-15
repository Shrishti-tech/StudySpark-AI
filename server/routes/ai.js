import { Router } from "express";
import { generate, generateFlashcards, generateQuiz } from "../controllers/aiController.js";

const router = Router();

router.post("/generate", generate);
router.post("/flashcards", generateFlashcards);
router.post("/quiz", generateQuiz);

export default router;
