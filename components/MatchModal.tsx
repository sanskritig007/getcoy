"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { MessageCircle, Flame, Sparkles } from "lucide-react";
import { Profile } from "@/types";

interface MatchModalProps {
  matchedProfile: Profile | null;
  onClose: () => void;
  onViewMatches: () => void;
}

export default function MatchModal({ matchedProfile, onClose, onViewMatches }: MatchModalProps) {
  useEffect(() => {
    if (matchedProfile) {
      // Fire festive celebration confetti
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [matchedProfile]);

  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 text-center text-white border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Sparkles Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Mutual Connection
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            It&apos;s a match! 🎉
          </h2>
          <p className="text-slate-300 text-sm mb-6">
            You and <span className="text-pink-400 font-bold">{matchedProfile.name}</span> liked each other
          </p>

          {/* Overlapping Profile Circles */}
          <div className="flex items-center justify-center -space-x-4 mb-6">
            {/* Logged in User Placeholder */}
            <div className="w-20 h-20 rounded-full border-4 border-slate-900 overflow-hidden shadow-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-black text-2xl z-0">
              You
            </div>

            {/* Matched Profile Photo */}
            <div className="w-20 h-20 rounded-full border-4 border-slate-900 overflow-hidden shadow-xl z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={matchedProfile.photo}
                alt={matchedProfile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Profile Tagline */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 mb-6 text-xs text-slate-300">
            <p className="font-semibold text-white mb-0.5">{matchedProfile.collegeOrCity}</p>
            <p className="line-clamp-1 italic text-slate-400">&ldquo;{matchedProfile.bio}&rdquo;</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                onViewMatches();
              }}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-sm shadow-lg shadow-pink-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              View in Matches
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              Keep Swiping
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

