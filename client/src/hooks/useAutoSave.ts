import { useEffect, useRef } from "react";

interface UseAutoSaveOptions<T> {
  data: T;
  key: string;
  delay?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave<T>({ data, key, delay = 2000, enabled = true }: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>("");

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Only save if data has changed
    if (currentData === previousDataRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, currentData);
        previousDataRef.current = currentData;
        console.log(`Auto-saved to ${key}`);
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, key, delay, enabled]);
}

export function loadSavedData<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (error) {
    console.error("Failed to load saved data:", error);
  }
  return defaultValue;
}

export function clearSavedData(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to clear saved data:", error);
  }
}
