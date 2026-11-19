"use client";

import React from "react";
import { Sparkles, RotateCcw, MapPin } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  isResetting?: boolean;
}

export default function Header({ onReset, isResetting }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-2.5">
      <div className="max-w-md mx-auto">
        {/* Top Row: Logo & Reset Demo */}
        <div className="flex items-center justify-between">
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
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className={`w-3 h-3 ${isResetting ? "animate-spin" : ""}`} />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Bottom Row: Active Logged-in User Pill */}
        <div className="mt-1.5 pt-1.5 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white text-[9px] font-bold flex items-center justify-center">
              S
            </span>
            <span className="font-medium text-slate-700">
              Logged in as <strong className="font-semibold text-slate-900">Sanskriti</strong>
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-full font-medium">
              she/her
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-slate-400 text-[10px]">
            <MapPin className="w-3 h-3 text-pink-400" />
            <span>Delhi</span>
          </div>
        </div>
      </div>
    </header>
  );
}
