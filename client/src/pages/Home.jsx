import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromptInput from "../components/PromptInput.jsx";
import ErrorBox from "../components/ErrorBox.jsx";
import { Spinner } from "../components/Loading.jsx";
import { useStudy } from "../context/StudyContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function Home() {
  const { notes, topic, generate, loading, error, retry, clearSession } = useStudy();
  const [localNotes, setLocalNotes] = useState(notes);
  const [localTopic, setLocalTopic] = useState(topic);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleGenerate = async () => {
    try {
      const result = await generate({ notes: localNotes, topic: localTopic });
      if (result) {
        showToast("Flashcards and quiz generated!", "success");
        navigate("/flashcards");
      }
    } catch {
      showToast("Generation failed.", "error");
    }
  };

  const handleClear = () => {
    setLocalNotes("");
    setLocalTopic("");
    clearSession();
  };

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-12 sm:py-16 animate-[fadeIn_0.2s_ease-out]">
      <div className="text-center space-y-2">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">StudySpark AI</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Turn Notes into Interactive Learning</p>
      </div>

      <PromptInput
        notes={localNotes}
        topic={localTopic}
        onNotesChange={setLocalNotes}
        onTopicChange={setLocalTopic}
        onGenerate={handleGenerate}
        onClear={handleClear}
        loading={loading}
      />

      {loading && <Spinner label="Generating your flashcards & quiz…" />}
      {error && !loading && <ErrorBox error={error} onRetry={retry} />}
    </div>
  );
}
