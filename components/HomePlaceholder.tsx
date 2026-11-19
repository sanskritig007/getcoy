"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HomePlaceholderProps {
  onGoToDiscover: () => void;
}

export default function HomePlaceholder({ onGoToDiscover }: HomePlaceholderProps) {
  return (
    <div className="p-5 pb-24 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-black text-slate-900">
            coy<span className="text-pink-500 font-extrabold text-2xl">.</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
            Placeholder
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-800 leading-snug mb-2">
          Find out if your crush likes you back
        </h3>

        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          As required by the assignment guidelines, the Home tab is kept blank/placeholder while the new swipe-based feature is built inside the <strong>Discover</strong> tab.
        </p>

        <button
          onClick={onGoToDiscover}
          className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs shadow-md shadow-pink-500/20 hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Discover Tab</span>
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>
      </div>
    </div>
  );
}

