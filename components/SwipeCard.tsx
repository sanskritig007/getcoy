"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { MapPin, Info, Sparkles } from "lucide-react";
import { Profile, SwipeAction } from "@/types";

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (action: SwipeAction) => void;
  isFrontCard: boolean;
}

export default function SwipeCard({ profile, onSwipe, isFrontCard }: SwipeCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const x = useMotionValue(0);

  // Dynamic rotation: drags right tilts clockwise, drags left tilts counter-clockwise
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);

  // Stamp opacities
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-40, -120], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 90;
    if (info.offset.x > threshold) {
      onSwipe("like");
    } else if (info.offset.x < -threshold) {
      onSwipe("pass");
    }
  };

  return (
    <motion.div
      style={{
        x: isFrontCard ? x : 0,
        rotate: isFrontCard ? rotate : 0,
        zIndex: isFrontCard ? 10 : 0,
      }}
      drag={isFrontCard ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isFrontCard ? handleDragEnd : undefined}
      initial={{ scale: isFrontCard ? 1 : 0.96, y: isFrontCard ? 0 : 10, opacity: 1 }}
      animate={{ scale: isFrontCard ? 1 : 0.96, y: isFrontCard ? 0 : 10, opacity: 1 }}
      exit={{
        x: x.get() >= 0 ? 400 : -400,
        opacity: 0,
        scale: 0.85,
        transition: { duration: 0.25 },
      }}
      className="absolute inset-0 w-full h-full select-none cursor-grab active:cursor-grabbing rounded-3xl overflow-hidden shadow-xl bg-white border border-slate-100 touch-none"
    >
      {/* Background Profile Photo */}
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent pointer-events-none" />

        {/* "LIKE" Stamp Feedback (Top-Left) */}
        {isFrontCard && (
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 -rotate-12 border-4 border-emerald-400 bg-emerald-500/20 backdrop-blur-sm text-emerald-400 font-black text-2xl tracking-wider uppercase px-3 py-1 rounded-xl shadow-lg pointer-events-none z-20"
          >
            LIKE
          </motion.div>
        )}

        {/* "NOPE" Stamp Feedback (Top-Right) */}
        {isFrontCard && (
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 rotate-12 border-4 border-rose-500 bg-rose-500/20 backdrop-blur-sm text-rose-500 font-black text-2xl tracking-wider uppercase px-3 py-1 rounded-xl shadow-lg pointer-events-none z-20"
          >
            NOPE
          </motion.div>
        )}

        {/* Card Content & Details */}
        <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10">
          {/* Header Row: Name, Age, Info Toggle */}
          <div className="flex items-end justify-between mb-1.5">
            <div>
              <h2 className="text-2xl font-black tracking-tight leading-tight flex items-baseline gap-2">
                <span>{profile.name}</span>
                <span className="text-xl font-light text-slate-300">{profile.age}</span>
              </h2>

              {/* Pronouns & Orientation Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-sm text-slate-100 px-2 py-0.5 rounded-full">
                  {profile.pronouns}
                </span>
                <span className="text-[11px] font-bold bg-pink-500/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  {profile.orientation !== "Straight" ? "🌈" : "✨"} {profile.orientation}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails((prev) => !prev);
              }}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
              title="Toggle details"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          {/* Location / College */}
          <div className="flex items-center gap-1 text-slate-300 text-xs font-medium mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-pink-400 shrink-0" />
            <span className="truncate">{profile.collegeOrCity}</span>
          </div>

          {/* Short Bio */}
          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed mb-3">
            {profile.bio}
          </p>

          {/* Interests Badges */}
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="text-[10px] font-semibold bg-white/15 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-white/10"
              >
                {interest}
              </span>
            ))}
          </div>

          {/* Expanded Drawer Details (if user clicked info) */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 pt-3 border-t border-white/20 text-xs text-slate-200"
            >
              <p className="font-semibold text-pink-300 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> About {profile.name.split(" ")[0]}
              </p>
              <p className="text-slate-200 leading-relaxed">{profile.bio}</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

