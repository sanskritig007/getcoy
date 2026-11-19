"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, MessageCircle } from "lucide-react";
import { Profile } from "@/types";

interface ChatModalProps {
  profile: Profile | null;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "match";
  text: string;
  time: string;
}

export default function ChatModal({ profile, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-0",
      sender: "match",
      text: "Hey! Glad we matched on Coy! 😊",
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");

  if (!profile) return null;

  const quickPrompts = [
    `Ask about ${profile.interests[0] || "music"} 🎸`,
    "Coffee date or late night drive? ☕",
    "Send a wave 👋",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    // Simulated warm auto-reply after 1 second
    setTimeout(() => {
      const matchReply: Message = {
        id: `m-${Date.now()}`,
        sender: "match",
        text: `Haha totally! I'm always up for that. Let's chat more on WhatsApp! ✨`,
        time: "Just now",
      };
      setMessages((prev) => [...prev, matchReply]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col h-[85vh] sm:h-[620px] overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {profile.name}
                </h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>{profile.collegeOrCity}</span>
                  <span>•</span>
                  <span className="text-pink-600 font-semibold">{profile.orientation}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Icebreaker Prompt Pills */}
          <div className="px-4 py-2 bg-pink-50/50 border-b border-pink-100/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span className="text-[10px] font-bold text-pink-700 uppercase tracking-wider shrink-0">
              Icebreakers:
            </span>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white text-[11px] font-medium text-slate-700 border border-pink-200 hover:bg-pink-100 active:scale-95 transition-all shadow-xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
            <div className="text-center my-2">
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">
                Mutual Match on Coy • End-to-end private
              </span>
            </div>

            {messages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-xs shadow-sm"
                        : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${profile.name.split(" ")[0]}...`}
              className="flex-1 px-4 py-2.5 rounded-full bg-slate-100 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white border border-transparent focus:border-pink-300 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-full bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white flex items-center justify-center transition-all active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

