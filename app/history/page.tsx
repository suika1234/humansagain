"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getReflections, formatDate, type Reflection } from "../lib/reflections";
import BottomNav from "../components/BottomNav";
import WeeklyReport from "../components/WeeklyReport";
import { BarChart3, Sparkles, Smile, Meh, AlertCircle } from "lucide-react";

const feelingLabels: Record<string, { label: string; icon: any }> = {
  good: { label: "Better than expected", icon: Smile },
  neutral: { label: "Neutral", icon: Meh },
  uncomfortable: { label: "Uncomfortable but proud", icon: AlertCircle },
};

function calculateInsights(reflections: Reflection[]) {
  if (reflections.length === 0) return null;

  // Most common feeling
  const feelingCounts: Record<string, number> = {};
  reflections.forEach((r) => {
    if (r.feeling) {
      feelingCounts[r.feeling] = (feelingCounts[r.feeling] || 0) + 1;
    }
  });
  const mostCommonFeeling = Object.entries(feelingCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  reflections.forEach((r) => {
    categoryCounts[r.challengeCategory] =
      (categoryCounts[r.challengeCategory] || 0) + 1;
  });
  const mostCommonCategory = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  // Reflections with notes
  const withNotes = reflections.filter((r) => r.note && r.note.trim()).length;
  const notePercentage = Math.round((withNotes / reflections.length) * 100);

  return {
    totalReflections: reflections.length,
    mostCommonFeeling,
    mostCommonCategory,
    withNotes,
    notePercentage,
  };
}

export default function HistoryPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);

  useEffect(() => {
    setReflections(getReflections());
  }, []);

  const insights = useMemo(() => calculateInsights(reflections), [reflections]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-8 pb-24">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-7 h-7 text-orange-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Insights
            </h1>
          </div>
          <p className="text-base text-slate-600 leading-relaxed">
            Your journey of connection and growth
          </p>
        </header>

        {/* Weekly Report */}
        <WeeklyReport />

        {/* Insights section */}
        {insights && insights.totalReflections > 0 && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border-2 border-orange-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-medium">Total Reflections</p>
              <p className="text-3xl font-bold text-orange-600 mb-1">
                {insights.totalReflections}
              </p>
              <p className="text-xs text-slate-600">
                Days of practice
              </p>
            </div>
            <div className="rounded-xl border-2 border-orange-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-medium">Most Common Feeling</p>
              <div className="flex items-center gap-2">
                {insights.mostCommonFeeling && feelingLabels[insights.mostCommonFeeling] ? (
                  <>
                    {(() => {
                      const Icon = feelingLabels[insights.mostCommonFeeling].icon;
                      return <Icon className="w-4 h-4 text-orange-600" />;
                    })()}
                    <p className="text-base font-semibold text-slate-800">
                      {feelingLabels[insights.mostCommonFeeling].label}
                    </p>
                  </>
                ) : (
                  <p className="text-base font-semibold text-slate-800">—</p>
                )}
              </div>
            </div>
            <div className="rounded-xl border-2 border-orange-200 bg-white/90 p-5 shadow-sm">
              <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-medium">Focus Area</p>
              <p className="text-base font-semibold text-slate-800">
                {insights.mostCommonCategory || "—"}
              </p>
            </div>
          </div>
        )}

        {/* Reflections list */}
        {reflections.length === 0 ? (
          <div className="rounded-2xl border-2 border-orange-200 bg-white/90 p-8 text-center shadow-sm">
            <p className="text-slate-700 mb-2 font-medium">No reflections yet</p>
            <p className="text-sm text-slate-600 mb-4">
              Complete a challenge to see your reflections here
            </p>
            <Link
              href="/"
              className="inline-block rounded-full bg-gradient-to-r from-orange-400 to-rose-400 px-6 py-3 text-sm font-bold text-white hover:from-orange-500 hover:to-rose-500 transition-all shadow-lg"
            >
              <span className="flex items-center gap-2">
                Start your first challenge <Sparkles className="w-4 h-4" />
              </span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Your Journey
              </h2>
              <p className="text-sm text-slate-600">
                Review your reflections to notice patterns and growth
              </p>
            </div>
            {reflections.map((reflection) => (
              <div
                key={reflection.id}
                className="rounded-2xl border-2 border-orange-200 bg-white/90 p-6 hover:shadow-md transition shadow-sm"
              >
                {/* Date and category */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-slate-700">
                    {formatDate(reflection.date)}
                  </span>
                  <span className="rounded-full bg-orange-100 px-4 py-1.5 text-xs uppercase tracking-wide text-orange-700 font-medium">
                    {reflection.challengeCategory}
                  </span>
                </div>

                {/* Challenge text */}
                <p className="text-base text-slate-800 mb-4 font-medium leading-relaxed">
                  {reflection.challengeText}
                </p>

                {/* Feeling */}
                {reflection.feeling && (
                  <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50">
                    <span className="text-sm text-slate-600 font-medium">Feeling:</span>
                    <span className="text-sm text-slate-800 font-semibold flex items-center gap-1">
                      {reflection.feeling && feelingLabels[reflection.feeling] ? (
                        <>
                          {(() => {
                            const Icon = feelingLabels[reflection.feeling].icon;
                            return <Icon className="w-4 h-4" />;
                          })()}
                          {feelingLabels[reflection.feeling].label}
                        </>
                      ) : (
                        reflection.feeling
                      )}
                    </span>
                  </div>
                )}

                {/* Note / Learning */}
                {reflection.note && (
                  <div className="mt-4 pt-4 border-t border-orange-200">
                    <p className="text-xs text-orange-600 mb-2 font-semibold uppercase tracking-wide">
                      What I Learned
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {reflection.note}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
