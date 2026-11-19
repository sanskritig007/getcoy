"use client";

import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  isResetting?: boolean;
}

export default function Header({ onReset, isResetting }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Coy Brand Logo */}
        <div className="flex items-center gap-1.5">
          <span className="text-2xl font-black tracking-tight text-slate-900">
            coy<span className="text-pink-500 font-extrabold text-3xl leading-none">.</span>
          </span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-pink-600 px-2 py-0.5 rounded-full border border-pink-100 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" />
            Discover
          </span>
        </div>

        {/* Reset Demo State Button */}
        <button
          onClick={onReset}
          disabled={isResetting}
          title="Reset demo (restore all 30 profiles)"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-full transition-all active:scale-95 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
          <span>Reset Demo</span>
        </button>
      </div>
    </header>
  );
}

