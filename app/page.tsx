// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CHALLENGES, Challenge } from "@/data/challenges";
import { saveReflection } from "./lib/reflections";
import Link from "next/link";
import BottomNav from "./components/BottomNav";
import { Sprout, Flame, Sparkles, MessageCircle, Smile, Meh, AlertCircle } from "lucide-react";

type StoredState = {
  streak: number;
  lastCompletedDate: string | null;
};

const STORAGE_KEY = "connection-challenge-state";

function getTodayKey(date = new Date()): string {
  // Always use local date (Tokyo in your case) in YYYY-MM-DD
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayChallenge(): Challenge {
  const todayKey = getTodayKey();
  // Very simple deterministic “hash” so the challenge is
  // consistent for the same day but changes tomorrow
  let hash = 0;
  for (let i = 0; i < todayKey.length; i++) {
    hash = (hash + todayKey.charCodeAt(i)) % CHALLENGES.length;
  }
  return CHALLENGES[hash];
}

export default function HomePage() {
  const [challenge] = useState<Challenge>(() => getTodayChallenge());
  const [streak, setStreak] = useState(0);
  const [lastCompletedDate, setLastCompletedDate] = useState<string | null>(null);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [feeling, setFeeling] = useState<string | null>(null);
  const [note, setNote] = useState("");

  // Load stored streak from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored: StoredState = JSON.parse(raw);
      setStreak(stored.streak ?? 0);
      setLastCompletedDate(stored.lastCompletedDate ?? null);

      const today = getTodayKey();
      if (stored.lastCompletedDate === today) {
        setHasCompletedToday(true);
      }
    } catch (e) {
      console.error("Failed to read stored state", e);
    }
  }, []);

  // Save to localStorage
  const saveState = (newStreak: number, date: string | null) => {
    setStreak(newStreak);
    setLastCompletedDate(date);
    if (typeof window !== "undefined") {
      const state: StoredState = {
        streak: newStreak,
        lastCompletedDate: date,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  };

  const handleComplete = () => {
    const today = getTodayKey();
  
    if (hasCompletedToday) {
      // Still show reflection even if already completed
      setShowReflection(true);
      return;
    }
  
    let newStreak = streak;
  
    if (!lastCompletedDate) {
      newStreak = 1;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = getTodayKey(yesterday);
  
      newStreak = lastCompletedDate === yesterdayKey ? streak + 1 : 1;
    }
  
    saveState(newStreak, today);
    setHasCompletedToday(true);
    setShowReflection(true);
  };
  

  const handleSkip = () => {
    setStatusMessage("No worries. Some days just noticing is enough.");
  };

  const categoryLabel: Record<Challenge["category"], string> = {
    warm: "Warmth",
    confidence: "Confidence",
    charisma: "Charisma",
    connection: "Connection",
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center px-4 pb-20">
      <div className="w-full max-w-md rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-lg border border-orange-100">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sprout className="w-6 h-6 text-orange-600" />
            <p className="text-sm text-orange-600 font-medium">Small Brave Moments</p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            Your daily connection practice
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            One small step toward deeper, more meaningful connections
          </p>
        </header>

        {/* Streak + category */}
        <section className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-rose-100">
            <Flame className="w-5 h-5 text-orange-600" />
            <span className="text-slate-700 font-medium">
              <span className="font-bold text-orange-600">{streak}</span> day{streak === 1 ? "" : "s"} streak
            </span>
          </div>
          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {categoryLabel[challenge.category]}
          </span>
        </section>

        {/* Challenge card */}
        <section className="mb-6 rounded-2xl bg-slate-900/90 p-4 border border-slate-800">
          <p className="text-sm text-slate-400 mb-1">Today’s Challenge</p>
          <p className="text-base leading-relaxed text-slate-50">
            {challenge.text}
          </p>
        </section>

        {/* Buttons */}
        {!showReflection && (
          <section className="mb-6 flex gap-3">
            <button
              onClick={handleComplete}
              className="flex-1 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 px-6 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-rose-500 active:scale-95 transition-all"
            >
              <span className="flex items-center gap-2">
                I did it! <Sparkles className="w-4 h-4" />
              </span>
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 rounded-full border-2 border-slate-300 px-6 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition"
            >
              Not today
            </button>
          </section>
        )}

        {showReflection && (
          <section className="mb-6 rounded-2xl border-2 border-orange-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  How did that feel?
                </h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Taking a moment to reflect helps you learn and grow from each experience
              </p>
            </div>

            <div className="space-y-4">
              {/* Feeling section */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  How did this feel?
                </label>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setFeeling("good")}
                    className={`rounded-full px-5 py-3 text-sm font-medium transition-all ${
                      feeling === "good"
                        ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg scale-105"
                        : "border-2 border-slate-300 text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Smile className="w-4 h-4" /> Better than expected
                    </span>
                  </button>

                  <button
                    onClick={() => setFeeling("neutral")}
                    className={`rounded-full px-5 py-3 text-sm font-medium transition-all ${
                      feeling === "neutral"
                        ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg scale-105"
                        : "border-2 border-slate-300 text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Meh className="w-4 h-4" /> Neutral
                    </span>
                  </button>

                  <button
                    onClick={() => setFeeling("uncomfortable")}
                    className={`rounded-full px-5 py-3 text-sm font-medium transition-all ${
                      feeling === "uncomfortable"
                        ? "bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-lg scale-105"
                        : "border-2 border-slate-300 text-slate-700 hover:border-orange-300 hover:bg-orange-50"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Uncomfortable but proud
                    </span>
                  </button>
                </div>
              </div>

              {/* Reflection prompt */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  What did you learn?
                </label>
                <textarea
                  placeholder="What surprised you? What felt easier or harder than expected? What would you do differently next time?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-slate-50 border-2 border-slate-200 p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
                />
                <p className="mt-2 text-xs text-slate-500">
                  <Sparkles className="w-3 h-3 inline mr-1" /> Capture insights that will help you next time
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const today = getTodayKey();
                // Save reflection
                saveReflection({
                  date: today,
                  challengeText: challenge.text,
                  challengeCategory: categoryLabel[challenge.category],
                  feeling: feeling,
                  note: note,
                });
                
                setShowReflection(false);
                setStatusMessage("Nice. You showed up for connection today");
                // Reset form
                setFeeling(null);
                setNote("");
              }}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-orange-400 to-rose-400 px-6 py-4 text-base font-bold text-white hover:from-orange-500 hover:to-rose-500 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <span className="flex items-center gap-2">
                Save reflection <Sparkles className="w-4 h-4" />
              </span>
            </button>
          </section>
        )}

        {/* Status message */}
        {statusMessage && (
          <div className="mt-6 p-4 rounded-xl bg-orange-100 border border-orange-200">
            <p className="text-sm text-slate-700 font-medium text-center">
              {statusMessage}
            </p>
          </div>
        )}

        {/* Tiny footer */}
        <footer className="mt-8 border-t border-orange-200 pt-6">
          <p className="text-sm text-slate-600 text-center">
            <span className="flex items-center gap-2 justify-center">
              One tiny action a day to feel closer to people <Sprout className="w-4 h-4 text-orange-600" />
            </span>
          </p>
        </footer>
      </div>
      <BottomNav />
    </main>
  );
}
