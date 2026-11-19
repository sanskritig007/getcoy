"use client";

import React from "react";
import { MessageCircle, MapPin, Sparkles, HeartCrack } from "lucide-react";
import { Profile } from "@/types";

interface MatchesViewProps {
  matches: Profile[];
  onStartSwiping: () => void;
  onOpenChat: (profile: Profile) => void;
}

export default function MatchesView({ matches, onStartSwiping, onOpenChat }: MatchesViewProps) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh]">
        <div className="w-16 h-16 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-400 mb-4">
          <HeartCrack className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No Matches Yet</h3>
        <p className="text-xs text-slate-500 max-w-xs mb-6">
          Keep swiping on the Discover tab! When someone you like also likes you back, they will appear here.
        </p>
        <button
          onClick={onStartSwiping}
          className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
        >
          Go to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      {/* Header Info */}
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>Mutual Matches</span>
          <span className="text-xs font-bold bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">
            {matches.length}
          </span>
        </h2>
        <p className="text-xs text-slate-500">
          These people liked you back! You both added each other on Coy.
        </p>
      </div>

      {/* Grid of Matches */}
      <div className="grid grid-cols-2 gap-3.5">
        {matches.map((profile) => (
          <div
            key={profile.id}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col"
          >
            {/* Photo & Orientation Badge */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-2 left-2">
                <span className="text-[10px] font-bold bg-slate-900/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                  {profile.orientation}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 truncate">
                  {profile.name}, <span className="font-normal text-slate-500 text-xs">{profile.age}</span>
                </h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate">
                  <MapPin className="w-3 h-3 text-pink-400 shrink-0" />
                  <span className="truncate">{profile.collegeOrCity}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenChat(profile)}
                className="mt-3 w-full py-1.5 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-600 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Say Hi</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

