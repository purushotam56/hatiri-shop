import { useCallback, useRef, useEffect } from "react";

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffMultiplier?: number;
}

/**
 * useAsync - Handle async operations with loading, error, and data states
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  onSuccess?: (data: T) => void,
  onError?: (error: E) => void,
) {
  const [status, setStatus] = React.useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [data, setData] = React.useState<T | null>(null);
  const [error, setError] = React.useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus("pending");
    setData(null);
    setError(null);
    try {
      const response = await asyncFunction();

      setData(response);
      setStatus("success");
      onSuccess?.(response);

      return response;
    } catch (error) {
      setError(error as E);
      setStatus("error");
      onError?.(error as E);
    }
  }, [asyncFunction, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      Promise.resolve().then(() => {
        execute();
      });
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

/**
 * useRetry - Retry async function with exponential backoff
 */
export function useRetry<T>(
  asyncFunction: () => Promise<T>,
  options: RetryOptions = {},
) {
  const { maxRetries = 3, delayMs = 1000, backoffMultiplier = 2 } = options;
  const [attempts, setAttempts] = React.useState(0);

  const execute = useCallback(async () => {
    let lastError: Error | null = null;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        setAttempts(i + 1);

        return await asyncFunction();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries) {
          const delay = delayMs * Math.pow(backoffMultiplier, i);

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error("Max retries exceeded");
  }, [asyncFunction, maxRetries, delayMs, backoffMultiplier]);

  return { execute, attempts };
}

/**
 * useDebounce - Debounce a value
 */
export function useDebounce<T>(value: T, delayMs = 500): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * useLocalStorage - Sync state with localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // console.error(error);

      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // console.error(error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}

// Add missing React import
import * as React from "react";
