"use client";

import { useEffect, useState } from "react";
import {
  calculateWeeklyStats,
  shouldShowWeeklyReport,
  markWeeklyReportAsShown,
  formatWeekRange,
  type WeeklyStats,
} from "../lib/weeklyReport";
import { Sparkles, Calendar, TrendingUp, Heart } from "lucide-react";
import { Smile, Meh, AlertCircle } from "lucide-react";

const feelingLabels: Record<string, { label: string; icon: any }> = {
  good: { label: "Better than expected", icon: Smile },
  neutral: { label: "Neutral", icon: Meh },
  uncomfortable: { label: "Uncomfortable but proud", icon: AlertCircle },
};

export default function WeeklyReport() {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // TEMPORARY: Always show for testing - remove this and uncomment below for production
    const stats = calculateWeeklyStats();
    if (stats && stats.totalChallenges > 0) {
      setWeeklyStats(stats);
      setIsVisible(true);
      // Don't mark as shown so it keeps appearing for testing
    }
    
    // PRODUCTION CODE (commented out for testing):
    // if (shouldShowWeeklyReport()) {
    //   const stats = calculateWeeklyStats();
    //   if (stats) {
    //     setWeeklyStats(stats);
    //     setIsVisible(true);
    //     markWeeklyReportAsShown();
    //   }
    // }
  }, []);

  if (!isVisible || !weeklyStats) return null;

  const FeelingIcon = weeklyStats.mostCommonFeeling
    ? feelingLabels[weeklyStats.mostCommonFeeling]?.icon
    : null;

  return (
    <div className="mb-8 rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-rose-50 p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-orange-200">
            <Calendar className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Week in Review</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {formatWeekRange(weeklyStats.weekStart, weeklyStats.weekEnd)}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 transition"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        {/* Main stat */}
        <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <p className="text-sm font-semibold text-slate-700">You showed up</p>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {weeklyStats.totalChallenges} time{weeklyStats.totalChallenges !== 1 ? "s" : ""}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {weeklyStats.daysActive} day{weeklyStats.daysActive !== 1 ? "s" : ""} active this week
          </p>
        </div>

        {/* Feeling insight */}
        {weeklyStats.mostCommonFeeling && FeelingIcon && (
          <div className="bg-white/80 rounded-xl p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-orange-600" />
              <p className="text-sm font-semibold text-slate-700">You often felt</p>
            </div>
            <div className="flex items-center gap-2">
              <FeelingIcon className="w-6 h-6 text-orange-600" />
              <p className="text-lg font-bold text-slate-800">
                {feelingLabels[weeklyStats.mostCommonFeeling].label}
              </p>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {weeklyStats.feelingCounts[weeklyStats.mostCommonFeeling]} out of{" "}
              {weeklyStats.totalChallenges} challenge{weeklyStats.totalChallenges !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Additional insights */}
        <div className="grid grid-cols-2 gap-3">
          {weeklyStats.notesCount > 0 && (
            <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
              <p className="text-xs text-slate-600 mb-1">Reflections captured</p>
              <p className="text-xl font-bold text-orange-600">{weeklyStats.notesCount}</p>
            </div>
          )}

          {Object.keys(weeklyStats.categoryBreakdown).length > 0 && (
            <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
              <p className="text-xs text-slate-600 mb-1">Focus areas</p>
              <p className="text-xl font-bold text-orange-600">
                {Object.keys(weeklyStats.categoryBreakdown).length}
              </p>
            </div>
          )}
        </div>

        {/* Encouragement message */}
        <div className="pt-3 border-t border-orange-200">
          <p className="text-sm text-slate-700 text-center font-medium">
            {weeklyStats.totalChallenges >= 5
              ? "🌟 Amazing week! You're building strong connection habits."
              : weeklyStats.totalChallenges >= 3
              ? "✨ Great progress! Every challenge counts."
              : "🌱 Every step forward matters. Keep going!"}
          </p>
        </div>
      </div>
    </div>
  );
}
