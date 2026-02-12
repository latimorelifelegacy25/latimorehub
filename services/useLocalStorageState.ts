import { useEffect, useState } from 'react';

/**
 * Tiny localStorage-backed state hook.
 * - Reads once on mount
 * - Persists on change
 * - Safe in SSR/preview (guards window)
 */
export function useLocalStorageState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>, { reset: () => void }] {
  const getInitial = () => {
    const fallback = typeof initialValue === 'function' ? (initialValue as any)() : initialValue;
    if (typeof window === 'undefined') return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  const [value, setValue] = useState<T>(getInitial);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore storage quota / private mode errors
    }
  }, [key, value]);

  const reset = () => {
    const fallback = typeof initialValue === 'function' ? (initialValue as any)() : initialValue;
    setValue(fallback);
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  };

  return [value, setValue, { reset }];
}
