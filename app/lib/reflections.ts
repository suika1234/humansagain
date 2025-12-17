// Utility functions for managing reflection history

export type Reflection = {
  id: string;
  date: string; // YYYY-MM-DD format
  challengeText: string;
  challengeCategory: string;
  feeling: string | null;
  note: string;
  timestamp: number; // For sorting
};

const REFLECTIONS_STORAGE_KEY = "connection-challenge-reflections";

export function saveReflection(reflection: Omit<Reflection, "id" | "timestamp">): void {
  if (typeof window === "undefined") return;

  try {
    const existing = getReflections();
    const newReflection: Reflection = {
      ...reflection,
      id: `${reflection.date}-${Date.now()}`,
      timestamp: Date.now(),
    };
    
    const updated = [newReflection, ...existing];
    window.localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save reflection", e);
  }
}

export function getReflections(): Reflection[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(REFLECTIONS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Reflection[];
  } catch (e) {
    console.error("Failed to load reflections", e);
    return [];
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === formatDateKey(today)) {
    return "Today";
  } else if (dateString === formatDateKey(yesterday)) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });
  }
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}
