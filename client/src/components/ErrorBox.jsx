function describeError(error) {
  if (!error) return { icon: "⚠️", title: "Something went wrong" };

  if (error.isTimeout) {
    return { icon: "⏱️", title: "Request timed out", detail: error.message };
  }
  if (error.isNetworkError) {
    return { icon: "📡", title: "Network error", detail: error.message };
  }
  if (error.name === "InvalidShapeError" || error.code === "InvalidJSONError" || error.code === "InvalidShapeError") {
    return { icon: "🧩", title: "The AI response was malformed", detail: error.message };
  }
  if (error.code === "EmptyResponseError") {
    return { icon: "📭", title: "The AI returned nothing", detail: error.message };
  }
  return { icon: "⚠️", title: "Something went wrong", detail: error.message };
}

export default function ErrorBox({ error, onRetry }) {
  const { icon, title, detail } = describeError(error);

  return (
    <div className="w-full max-w-xl mx-auto rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-6 text-center flex flex-col items-center gap-3">
      <span className="text-3xl">{icon}</span>
      <p className="font-semibold text-red-700 dark:text-red-300">{title}</p>
      {detail && <p className="text-sm text-red-600/80 dark:text-red-400/80">{detail}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
