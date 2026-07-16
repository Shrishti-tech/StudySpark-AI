import { useCallback, useRef, useState } from "react";

/**
 * Generic hook for calling an async API function with loading/error state.
 * Guards against stale responses (an older in-flight request resolving after
 * a newer one) by aborting the previous request and tagging each call with
 * an incrementing id.
 */
export function useAI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);
  const lastCallRef = useRef(null);

  const run = useCallback(async (apiFn, args, transform) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++requestIdRef.current;
    lastCallRef.current = { apiFn, args, transform };

    setLoading(true);
    setError(null);

    try {
      const raw = await apiFn(args, controller.signal);
      if (requestId !== requestIdRef.current) return undefined;

      const result = transform ? transform(raw) : raw;
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return undefined;
      }
      if (requestId !== requestIdRef.current) return undefined;

      setError(err);
      setLoading(false);
      throw err;
    }
  }, []);

  const retry = useCallback(() => {
    if (!lastCallRef.current) return undefined;
    const { apiFn, args, transform } = lastCallRef.current;
    return run(apiFn, args, transform);
  }, [run]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, run, retry, reset };
}
