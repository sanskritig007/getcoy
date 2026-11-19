"use client";

import React from "react";
import { Home, Flame, MessageCircleHeart } from "lucide-react";

export type TabType = "home" | "discover" | "matches";

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  matchesCount: number;
}

export default function TabBar({ activeTab, onTabChange, matchesCount }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 py-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* Home Tab (Placeholder as per requirements) */}
        <button
          onClick={() => onTabChange("home")}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 px-3 ${
            activeTab === "home" ? "text-pink-500 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px]">Home</span>
        </button>

        {/* Discover Tab (Main Swipe Feed) */}
        <button
          onClick={() => onTabChange("discover")}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 px-3 ${
            activeTab === "discover" ? "text-pink-500 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Flame className="w-5 h-5" />
          <span className="text-[11px]">Discover</span>
          {activeTab === "discover" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-pink-500" />
          )}
        </button>

        {/* Matches Tab */}
        <button
          onClick={() => onTabChange("matches")}
          className={`flex flex-col items-center gap-1 transition-colors relative py-1 px-3 ${
            activeTab === "matches" ? "text-pink-500 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <div className="relative">
            <MessageCircleHeart className="w-5 h-5" />
            {matchesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-pink-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {matchesCount}
              </span>
            )}
          </div>
          <span className="text-[11px]">Matches</span>
          {activeTab === "matches" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-pink-500" />
          )}
        </button>
      </div>
    </nav>
  );
}

