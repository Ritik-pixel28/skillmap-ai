"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Video, GraduationCap, Bookmark, BookmarkCheck, ExternalLink, Clock, Signal, ChevronRight } from "lucide-react";
import { Resource } from "@/services/libraryService";

const TYPE_CONFIG = {
  article: { icon: BookOpen, label: "Article", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
  video: { icon: Video, label: "Video", bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  course: { icon: GraduationCap, label: "Course", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-100" },
};

const DIFFICULTY_CONFIG = {
  beginner: { label: "Beginner", color: "text-emerald-600 bg-emerald-50" },
  intermediate: { label: "Intermediate", color: "text-amber-600 bg-amber-50" },
  advanced: { label: "Advanced", color: "text-rose-600 bg-rose-50" },
};

interface ResourceCardProps {
  resource: Resource;
  onSave: (id: number) => void;
  onUnsave: (id: number) => void;
  onClick: (resource: Resource) => void;
  savingId: number | null;
}

export default function ResourceCard({ resource, onSave, onUnsave, onClick, savingId }: ResourceCardProps) {
  const typeConf = TYPE_CONFIG[resource.type] ?? TYPE_CONFIG.article;
  const diffConf = DIFFICULTY_CONFIG[resource.difficulty] ?? DIFFICULTY_CONFIG.beginner;
  const TypeIcon = typeConf.icon;
  const isSaving = savingId === resource.id;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.10)" }}
      className="group relative bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4 cursor-pointer transition-shadow duration-300"
      onClick={() => onClick(resource)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className={`shrink-0 p-3 rounded-2xl ${typeConf.bg} ${typeConf.border} border`}>
          <TypeIcon className={`w-5 h-5 ${typeConf.text}`} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resource.is_saved ? onUnsave(resource.id) : onSave(resource.id);
          }}
          disabled={isSaving}
          className={`shrink-0 p-2 rounded-xl transition-all duration-200 ${
            resource.is_saved
              ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
              : "text-slate-300 hover:text-blue-500 hover:bg-blue-50"
          }`}
          title={resource.is_saved ? "Remove from saved" : "Save resource"}
        >
          <AnimatePresence mode="wait">
            {resource.is_saved ? (
              <motion.span key="saved" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <BookmarkCheck className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="unsaved" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Bookmark className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-black text-slate-900 text-base leading-tight group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {resource.title}
        </h3>
        {resource.source && (
          <p className="text-xs text-slate-400 font-semibold mt-1">{resource.source}</p>
        )}
      </div>

      {/* Description */}
      {resource.description && (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{resource.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
        <div className="flex items-center gap-2">
          {resource.duration && (
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {resource.duration}
            </div>
          )}
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${diffConf.color}`}>
            {diffConf.label}
          </span>
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${typeConf.text}`}>
          <span>{typeConf.label}</span>
          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        </div>
      </div>
    </motion.div>
  );
}
