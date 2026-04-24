"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trophy, HelpCircle, BookOpen, Clock, ChevronDown, MessageCircle, Trash2, Send } from "lucide-react";
import { CommunityPost, PostComment, addComment } from "@/services/communityService";

const TYPE_CONFIG = {
  milestone: {
    label: "Milestone",
    icon: Trophy,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
    dot: "bg-amber-400",
  },
  question: {
    label: "Question",
    icon: HelpCircle,
    bg: "bg-violet-50",
    text: "text-violet-600",
    border: "border-violet-100",
    dot: "bg-violet-400",
  },
  share: {
    label: "Resource Share",
    icon: BookOpen,
    bg: "bg-sky-50",
    text: "text-sky-600",
    border: "border-sky-100",
    dot: "bg-sky-400",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
];

function getAvatarColor(userId: number): string {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface PostCardProps {
  post: CommunityPost;
  onLike: (id: number) => void;
  onDelete?: (id: number) => void;
  onCommentAdded?: (postId: number, comment: PostComment) => void;
  likingId: number | null;
  currentUserId?: number;
}

export default function PostCard({ post, onLike, onDelete, onCommentAdded, likingId, currentUserId = 1 }: PostCardProps) {
  const conf = TYPE_CONFIG[post.type] ?? TYPE_CONFIG.milestone;
  const Icon = conf.icon;
  const isLiking = likingId === post.id;
  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const isLong = post.content.length > 220;
  const isMyPost = post.user_id === currentUserId;

  const handleAddComment = async () => {
    if (!commentText.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      const comment = await addComment(post.id, commentText.trim());
      if (comment && onCommentAdded) {
        onCommentAdded(post.id, comment);
      }
      setCommentText("");
    } catch {
      // handled by parent
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-300"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarColor(post.user_id)} flex items-center justify-center shrink-0`}
          >
            <span className="text-xs font-black text-white">{getInitials(post.author_name)}</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900">{post.author_name}</p>
            {post.author_career_goal && (
              <p className="text-xs text-slate-400 font-medium">{post.author_career_goal}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Type Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${conf.bg} ${conf.border} border shrink-0`}>
            <Icon className={`w-3.5 h-3.5 ${conf.text}`} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${conf.text}`}>
              {conf.label}
            </span>
          </div>

          {/* Delete button (own posts only) */}
          {isMyPost && onDelete && (
            <button
              onClick={() => onDelete(post.id)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
              title="Delete post"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <p className={`text-sm text-slate-700 leading-relaxed ${!expanded && isLong ? "line-clamp-3" : ""}`}>
          {post.content}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-bold text-blue-500 hover:text-blue-700 mt-1 transition-colors"
          >
            {expanded ? "Show less" : "Read more"}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo(post.created_at)}
        </div>

        <div className="flex items-center gap-2">
          {/* Comment Button */}
          <button
            onClick={() => setShowComments((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-bold ${
              showComments
                ? "bg-blue-50 text-blue-500"
                : "bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{post.comments_count}</span>
          </button>

          {/* Like Button */}
          <button
            onClick={() => onLike(post.id)}
            disabled={isLiking}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 text-sm font-bold ${
              post.liked_by_me
                ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
                : "bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={post.liked_by_me ? "liked" : "unliked"}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.6 }}
              >
                <Heart
                  className={`w-4 h-4 transition-all ${post.liked_by_me ? "fill-rose-500" : ""}`}
                />
              </motion.span>
            </AnimatePresence>
            <span>{post.likes_count}</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-50 pt-4 flex flex-col gap-3">
              {/* Existing comments */}
              {post.comments.length > 0 && (
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-xl bg-gradient-to-br ${getAvatarColor(comment.user_id)} flex items-center justify-center shrink-0`}
                      >
                        <span className="text-[8px] font-black text-white">{getInitials(comment.author_name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-slate-800">{comment.author_name}</span>
                          <span className="text-[10px] text-slate-300">{timeAgo(comment.created_at)}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment input */}
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-blue-200 focus:ring-1 focus:ring-blue-50 transition-all"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || submittingComment}
                  className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
