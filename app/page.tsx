"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Profile, SwipeAction } from "@/types";
import Header from "@/components/Header";
import TabBar, { TabType } from "@/components/TabBar";
import FilterBar, { FilterOption } from "@/components/FilterBar";
import SwipeCard from "@/components/SwipeCard";
import CardControls from "@/components/CardControls";
import MatchModal from "@/components/MatchModal";
import MatchesView from "@/components/MatchesView";
import EmptyState from "@/components/EmptyState";
import HomePlaceholder from "@/components/HomePlaceholder";
import ChatModal from "@/components/ChatModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("discover");
  const [activeFilter, setActiveFilter] = useState<FilterOption>({
    id: "all",
    label: "All",
    gender: "all",
    orientation: "all",
  });

  const [feedProfiles, setFeedProfiles] = useState<Profile[]>([]);
  const [matches, setMatches] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [chatProfile, setChatProfile] = useState<Profile | null>(null);

  // Fetch feed profiles from /api/feed
  const fetchFeed = useCallback(async (filter = activeFilter) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filter.gender && filter.gender !== "all") params.append("gender", filter.gender);
      if (filter.orientation && filter.orientation !== "all")
        params.append("orientation", filter.orientation);

      const url = `/api/feed${params.toString() ? `?${params.toString()}` : ""}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setFeedProfiles(data.profiles);
      }
    } catch (err) {
      console.error("Failed to load feed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  // Fetch mutual matches from /api/matches
  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch("/api/matches");
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (err) {
      console.error("Failed to load matches:", err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchFeed();
    fetchMatches();
  }, [fetchFeed, fetchMatches]);

  // Change filter
  const handleSelectFilter = (filter: FilterOption) => {
    setActiveFilter(filter);
    fetchFeed(filter);
  };

  // Reset demo state
  const handleResetDemo = async () => {
    try {
      setIsResetting(true);
      const res = await fetch("/api/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await Promise.all([fetchFeed(), fetchMatches()]);
      }
    } catch (err) {
      console.error("Failed to reset:", err);
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Swipe (like or pass)
  const handleSwipe = async (action: SwipeAction) => {
    if (feedProfiles.length === 0) return;

    // The top card being swiped
    const currentCard = feedProfiles[0];

    // Optimistically remove from frontend feed
    setFeedProfiles((prev) => prev.slice(1));

    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: currentCard.id, action }),
      });
      const data = await res.json();

      if (data.success && data.matched && data.matchedProfile) {
        // Trigger celebratory match modal & update matches count
        setMatchedProfile(data.matchedProfile);
        fetchMatches();
      }
    } catch (err) {
      console.error("Swipe submission failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col items-center">
      {/* Mobile-sized shell for authentic app experience */}
      <main className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col shadow-2xl relative border-x border-slate-200/60">
        {/* Global Top Header */}
        <Header onReset={handleResetDemo} isResetting={isResetting} />

        {/* Tab 1: Home Placeholder */}
        {activeTab === "home" && (
          <HomePlaceholder onGoToDiscover={() => setActiveTab("discover")} />
        )}

        {/* Tab 2: Discover Tab (The Main Experience) */}
        {activeTab === "discover" && (
          <div className="flex-1 flex flex-col px-4 pt-2 pb-24 max-w-md mx-auto w-full">
            {/* Inclusive Filter Bar */}
            <div className="mb-2">
              <FilterBar
                activeFilterId={activeFilter.id}
                onSelectFilter={handleSelectFilter}
                disabled={isLoading}
              />
            </div>

            {/* Main Card Deck Area */}
            <div className="flex-1 flex flex-col justify-center items-center relative my-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                  <p className="text-xs font-semibold">Finding compatible people...</p>
                </div>
              ) : feedProfiles.length === 0 ? (
                <EmptyState onReset={handleResetDemo} isResetting={isResetting} />
              ) : (
                <div className="w-full max-w-sm aspect-[3/4.4] relative">
                  {/* Card Stack: render second card behind top card for realism */}
                  {feedProfiles.length > 1 && (
                    <SwipeCard
                      key={feedProfiles[1].id}
                      profile={feedProfiles[1]}
                      onSwipe={() => {}}
                      isFrontCard={false}
                    />
                  )}

                  {/* Top Active Card */}
                  <AnimatePresence>
                    {feedProfiles.length > 0 && (
                      <SwipeCard
                        key={feedProfiles[0].id}
                        profile={feedProfiles[0]}
                        onSwipe={handleSwipe}
                        isFrontCard={true}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Desktop & Mobile Pass/Like Action Buttons */}
            {feedProfiles.length > 0 && !isLoading && (
              <CardControls onSwipe={handleSwipe} />
            )}
          </div>
        )}

        {/* Tab 3: Matches Tab */}
        {activeTab === "matches" && (
          <MatchesView
            matches={matches}
            onStartSwiping={() => setActiveTab("discover")}
            onOpenChat={(profile) => setChatProfile(profile)}
          />
        )}

        {/* Mutual Match Celebration Popup */}
        <MatchModal
          matchedProfile={matchedProfile}
          onClose={() => setMatchedProfile(null)}
          onViewMatches={() => {
            setMatchedProfile(null);
            setActiveTab("matches");
          }}
        />

        {/* Icebreaker Chat Modal */}
        <ChatModal
          profile={chatProfile}
          onClose={() => setChatProfile(null)}
        />

        {/* Bottom Tab Bar */}
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          matchesCount={matches.length}
        />
      </main>
    </div>
  );
}
