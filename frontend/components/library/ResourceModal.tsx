"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ExternalLink, BookOpen, Video, GraduationCap, Clock, Signal,
  Bookmark, BookmarkCheck, Calendar, Tag
} from "lucide-react";
import { Resource } from "@/services/libraryService";
import { linkResource } from "@/services/libraryService";

const TYPE_CONFIG = {
  article: { icon: BookOpen, label: "Article", bg: "bg-sky-50", text: "text-sky-600" },
  video: { icon: Video, label: "Video", bg: "bg-rose-50", text: "text-rose-600" },
  course: { icon: GraduationCap, label: "Course", bg: "bg-violet-50", text: "text-violet-600" },
};

const DIFFICULTY_CONFIG = {
  beginner: { label: "Beginner", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  intermediate: { label: "Intermediate", color: "text-amber-700 bg-amber-50 border-amber-200" },
  advanced: { label: "Advanced", color: "text-rose-700 bg-rose-50 border-rose-200" },
};

interface ResourceModalProps {
  resource: Resource;
  onClose: () => void;
  onSave: (id: number) => void;
  onUnsave: (id: number) => void;
  roadmapWeeks?: { week: number; title: string }[];
  onToast: (msg: string, type?: "success" | "error") => void;
}

export default function ResourceModal({ resource, onClose, onSave, onUnsave, roadmapWeeks, onToast }: ResourceModalProps) {
  const [linkingWeek, setLinkingWeek] = useState<number | null>(null);
  const [linked, setLinked] = useState<number[]>([]);

  const typeConf = TYPE_CONFIG[resource.type] ?? TYPE_CONFIG.article;
  const diffConf = DIFFICULTY_CONFIG[resource.difficulty] ?? DIFFICULTY_CONFIG.beginner;
  const TypeIcon = typeConf.icon;

  const handleLink = async (week: number) => {
    setLinkingWeek(week);
    try {
      const ok = await linkResource(resource.id, week);
      if (ok) {
        setLinked((prev) => [...prev, week]);
        onToast(`Linked to Week ${week}!`);
      } else {
        onToast("Could not link — roadmap not found", "error");
      }
    } catch {
      onToast("Link failed", "error");
    } finally {
      setLinkingWeek(null);
    }
  };

  return (
    <AnimatePresence>
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
          {/* Color Accent Top Bar */}
          <div className={`h-2 w-full ${resource.type === "article" ? "bg-sky-400" : resource.type === "video" ? "bg-rose-400" : "bg-violet-400"}`} />

          <div className="p-8">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4 mb-6 pr-8">
              <div className={`p-3.5 rounded-2xl ${typeConf.bg} shrink-0`}>
                <TypeIcon className={`w-6 h-6 ${typeConf.text}`} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 leading-tight">{resource.title}</h2>
                {resource.source && <p className="text-sm text-slate-400 font-semibold mt-1">{resource.source}</p>}
              </div>
            </div>

            {/* Meta Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${diffConf.color}`}>
                <Signal className="w-3 h-3 inline mr-1" />
                {diffConf.label}
              </span>
              {resource.duration && (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {resource.duration}
                </span>
              )}
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${typeConf.bg} ${typeConf.text}`}>
                {typeConf.label}
              </span>
            </div>

            {/* Description */}
            {resource.description && (
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{resource.description}</p>
            )}

            {/* Tags */}
            {resource.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {resource.tags.split(",").map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full font-medium">
                    <Tag className="w-3 h-3" />
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Link to Roadmap Week */}
            {roadmapWeeks && roadmapWeeks.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" /> Link to Roadmap Week
                </p>
                <div className="flex flex-wrap gap-2">
                  {roadmapWeeks.map((w) => {
                    const isLinked = linked.includes(w.week);
                    return (
                      <button
                        key={w.week}
                        onClick={() => !isLinked && handleLink(w.week)}
                        disabled={linkingWeek === w.week}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                          isLinked
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        Week {w.week}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Resource
              </a>
              <button
                onClick={() => resource.is_saved ? onUnsave(resource.id) : onSave(resource.id)}
                className={`p-4 rounded-2xl border transition-all ${
                  resource.is_saved
                    ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                }`}
              >
                {resource.is_saved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
