"use client";

import { useEffect, useState } from "react";
import { getReflections } from "../lib/reflections";
import BottomNav from "../components/BottomNav";
import { User, Flame, FileText, Sprout } from "lucide-react";

const STORAGE_KEY = "connection-challenge-state";

type StoredState = {
  streak: number;
  lastCompletedDate: string | null;
};

export default function ProfilePage() {
  const [streak, setStreak] = useState(0);
  const [totalReflections, setTotalReflections] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Load streak
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored: StoredState = JSON.parse(raw);
        setStreak(stored.streak ?? 0);
      }

      // Load total reflections
      const reflections = getReflections();
      setTotalReflections(reflections.length);
    } catch (e) {
      console.error("Failed to load profile data", e);
    }
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 px-4 py-8 pb-24">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-7 h-7 text-orange-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
          </div>
          <p className="text-base text-slate-600 leading-relaxed">
            Your connection practice overview
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border-2 border-orange-200 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-6 h-6 text-orange-600" />
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Current Streak
              </p>
            </div>
            <p className="text-4xl font-bold text-orange-600 mb-1">{streak}</p>
            <p className="text-xs text-slate-600">days in a row</p>
          </div>

          <div className="rounded-xl border-2 border-orange-200 bg-white/90 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-6 h-6 text-orange-600" />
              <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                Total Reflections
              </p>
            </div>
            <p className="text-4xl font-bold text-orange-600 mb-1">
              {totalReflections}
            </p>
            <p className="text-xs text-slate-600">moments captured</p>
          </div>
        </div>

        {/* About section */}
        <div className="rounded-xl border-2 border-orange-200 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sprout className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-slate-900">
              About Small Brave Moments
            </h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed mb-3">
            Every day, you're taking small steps to build deeper connections with
            the people around you. Each challenge is an opportunity to practice
            warmth, confidence, charisma, and connection.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="flex items-center gap-2">
              Remember: progress isn't about perfection. It's about showing up,
              trying, and learning from each experience. <Sprout className="w-4 h-4 text-orange-600" />
            </span>
          </p>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
