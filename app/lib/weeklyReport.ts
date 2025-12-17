// Utility functions for weekly insights report

import { getReflections, type Reflection } from "./reflections";

export type WeeklyStats = {
  weekStart: string; // YYYY-MM-DD
  weekEnd: string; // YYYY-MM-DD
  totalChallenges: number;
  mostCommonFeeling: string | null;
  feelingCounts: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  notesCount: number;
  daysActive: number;
};

const LAST_WEEKLY_REPORT_KEY = "last-weekly-report-date";

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday is 0, so this gets us to Sunday
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

export function getWeekEnd(date: Date = new Date()): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateWeeklyStats(): WeeklyStats | null {
  if (typeof window === "undefined") return null;

  const reflections = getReflections();
  if (reflections.length === 0) return null;

  const today = new Date();
  const weekStart = getWeekStart(today);
  const weekEnd = getWeekEnd(today);
  
  const weekStartStr = formatDateKey(weekStart);
  const weekEndStr = formatDateKey(weekEnd);

  // Filter reflections from this week
  const weekReflections = reflections.filter((r) => {
    const reflectionDate = new Date(r.date + "T00:00:00");
    return reflectionDate >= weekStart && reflectionDate <= weekEnd;
  });

  if (weekReflections.length === 0) return null;

  // Calculate stats
  const feelingCounts: Record<string, number> = {};
  const categoryBreakdown: Record<string, number> = {};
  const uniqueDays = new Set<string>();
  let notesCount = 0;

  weekReflections.forEach((r) => {
    uniqueDays.add(r.date);
    
    if (r.feeling) {
      feelingCounts[r.feeling] = (feelingCounts[r.feeling] || 0) + 1;
    }
    
    categoryBreakdown[r.challengeCategory] =
      (categoryBreakdown[r.challengeCategory] || 0) + 1;
    
    if (r.note && r.note.trim()) {
      notesCount++;
    }
  });

  const mostCommonFeeling = Object.entries(feelingCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || null;

  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    totalChallenges: weekReflections.length,
    mostCommonFeeling,
    feelingCounts,
    categoryBreakdown,
    notesCount,
    daysActive: uniqueDays.size,
  };
}

export function shouldShowWeeklyReport(): boolean {
  if (typeof window === "undefined") return false;

  const today = new Date();
  const isSunday = today.getDay() === 0;

  if (!isSunday) return false;

  // Check if we've already shown the report for this Sunday
  const lastReportDate = window.localStorage.getItem(LAST_WEEKLY_REPORT_KEY);
  const todayStr = formatDateKey(today);

  if (lastReportDate === todayStr) {
    return false; // Already shown today
  }

  // Check if there are any reflections from this week
  const weeklyStats = calculateWeeklyStats();
  if (!weeklyStats || weeklyStats.totalChallenges === 0) {
    return false; // No activity this week
  }

  return true;
}

export function markWeeklyReportAsShown(): void {
  if (typeof window === "undefined") return;
  const today = new Date();
  const todayStr = formatDateKey(today);
  window.localStorage.setItem(LAST_WEEKLY_REPORT_KEY, todayStr);
}

export function formatWeekRange(weekStart: string, weekEnd: string): string {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(weekEnd + "T00:00:00");
  
  const startMonth = start.toLocaleDateString("en-US", { month: "short" });
  const startDay = start.getDate();
  const endMonth = end.toLocaleDateString("en-US", { month: "short" });
  const endDay = end.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
}
