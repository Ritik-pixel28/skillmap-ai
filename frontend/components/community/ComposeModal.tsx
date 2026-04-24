"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, HelpCircle, BookOpen, Send } from "lucide-react";
import { createPost } from "@/services/communityService";
import { CommunityPost } from "@/services/communityService";

const POST_TYPES = [
  {
    id: "milestone",
    label: "Milestone",
    icon: Trophy,
    desc: "Share a learning achievement",
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    activeBg: "bg-amber-500",
  },
  {
    id: "question",
    label: "Question",
    icon: HelpCircle,
    desc: "Ask the community",
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-200",
    activeBg: "bg-violet-500",
  },
  {
    id: "share",
    label: "Share Resource",
    icon: BookOpen,
    desc: "Recommend a resource",
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-200",
    activeBg: "bg-sky-500",
  },
] as const;

const PLACEHOLDERS: Record<string, string> = {
  milestone: "Share what you just accomplished — a completed week, a new skill, a project shipped...",
  question: "Ask anything! The community is here to help.",
  share: "Paste a link or describe a resource you found valuable...",
};

interface ComposeModalProps {
  onClose: () => void;
  onPost: (post: CommunityPost) => void;
  onToast: (msg: string, type?: "success" | "error") => void;
}

export default function ComposeModal({ onClose, onPost, onToast }: ComposeModalProps) {
  const [selectedType, setSelectedType] = useState<"milestone" | "question" | "share">("milestone");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const MAX_CHARS = 500;

  const handleSubmit = async () => {
    if (!content.trim()) {
      onToast("Write something before posting!", "error");
      return;
    }
    setSubmitting(true);
    try {
      const post = await createPost(selectedType, content.trim());
      if (post) {
        onPost(post);
        onToast("Post published to the community! 🎉");
        onClose();
      } else {
        onToast("Failed to create post", "error");
      }
    } catch {
      onToast("Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 pt-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-black text-white">New Post</h2>
          <p className="text-sm text-white/50 mt-1">Share with the SkillMap community</p>
        </div>

        <div className="p-8 flex flex-col gap-5">
          {/* Type Selector */}
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Post Type</p>
            <div className="grid grid-cols-3 gap-2">
              {POST_TYPES.map((t) => {
                const isActive = selectedType === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                      isActive
                        ? `${t.activeBg} border-transparent text-white`
                        : `${t.bg} ${t.border} ${t.text} hover:opacity-80`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
              placeholder={PLACEHOLDERS[selectedType]}
              rows={5}
              className="w-full resize-none rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3.5 text-sm text-slate-700 placeholder:text-slate-300 font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
            />
            <p className={`absolute bottom-3 right-3 text-[10px] font-bold ${content.length >= MAX_CHARS ? "text-rose-400" : "text-slate-300"}`}>
              {content.length}/{MAX_CHARS}
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
