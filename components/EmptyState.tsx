"use client";

import React from "react";
import { CheckCircle2, RotateCcw, Sparkles } from "lucide-react";

interface EmptyStateProps {
  onReset: () => void;
  isResetting?: boolean;
}

export default function EmptyState({ onReset, isResetting }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] bg-white rounded-3xl border border-slate-100 shadow-sm max-w-sm mx-auto my-auto">
      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
        You&apos;re All Caught Up! ✨
      </h3>

      <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
        There are no new profiles matching your current filter right now. You can reset the demo anytime to test again from the start.
      </p>

      <button
        onClick={onReset}
        disabled={isResetting}
        className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
      >
        <RotateCcw className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
        <span>{isResetting ? "Resetting Demo..." : "Reset Demo (30 Profiles)"}</span>
      </button>

      <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-pink-400" />
        Pre-liked profiles will trigger mutual matches again
      </p>
    </div>
  );
}

