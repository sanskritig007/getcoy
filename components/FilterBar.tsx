"use client";

import React from "react";
import { Gender } from "@/types";

export type FilterOption = {
  id: string;
  label: string;
  gender?: Gender | "all";
  orientation?: string | "all";
};

const FILTER_OPTIONS: FilterOption[] = [
  { id: "all", label: "All", gender: "all", orientation: "all" },
  { id: "women", label: "Women", gender: "woman", orientation: "all" },
  { id: "men", label: "Men", gender: "man", orientation: "all" },
  { id: "non-binary", label: "Non-binary", gender: "non-binary", orientation: "all" },
  { id: "queer", label: "🌈 Queer", gender: "all", orientation: "queer-community" },
];

interface FilterBarProps {
  activeFilterId: string;
  onSelectFilter: (filter: FilterOption) => void;
  disabled?: boolean;
}

export default function FilterBar({ activeFilterId, onSelectFilter, disabled }: FilterBarProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-1 flex items-center gap-1.5">
      {FILTER_OPTIONS.map((opt) => {
        const isSelected = activeFilterId === opt.id;
        return (
          <button
            key={opt.id}
            disabled={disabled}
            onClick={() => onSelectFilter(opt)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 disabled:opacity-50 ${
              isSelected
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

