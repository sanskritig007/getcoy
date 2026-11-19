"use client";

import React from "react";
import { X, Heart } from "lucide-react";
import { SwipeAction } from "@/types";

interface CardControlsProps {
  onSwipe: (action: SwipeAction) => void;
  disabled?: boolean;
}

export default function CardControls({ onSwipe, disabled }: CardControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Pass Button (Red Cross) */}
      <button
        onClick={() => onSwipe("pass")}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-rose-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all transform active:scale-90 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none group"
        title="Pass (Swipe Left)"
      >
        <X className="w-7 h-7 stroke-[2.5] transition-transform group-hover:scale-110" />
      </button>

      {/* Like Button (Green Heart) */}
      <button
        onClick={() => onSwipe("like")}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-xl shadow-pink-500/25 flex items-center justify-center transition-all transform active:scale-90 hover:scale-105 disabled:opacity-40 disabled:pointer-events-none group"
        title="Like (Swipe Right)"
      >
        <Heart className="w-8 h-8 fill-white transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}

