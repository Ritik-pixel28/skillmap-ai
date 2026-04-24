"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import {
  Users, Trophy, Map, PenSquare, Search, X,
  CheckCircle2, AlertCircle,
} from "lucide-react";
import { Sidebar } from "@/components/roadmap/Sidebar";
import PostCard from "@/components/community/PostCard";
import LeaderboardTable from "@/components/community/LeaderboardTable";
import RoadmapCard from "@/components/community/RoadmapCard";
import ComposeModal from "@/components/community/ComposeModal";
import {
  CommunityPost, PostComment, LeaderboardEntry, SharedRoadmap,
  getFeed, getLeaderboard, getSharedRoadmaps,
  toggleLike, deletePost, getCommunityStats,
} from "@/services/communityService";

// ─────────────────────────────────────────────────────────────
//  Tab definitions
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "feed",        label: "Feed",            icon: Users },
  { id: "leaderboard", label: "Leaderboard",     icon: Trophy },
  { id: "roadmaps",    label: "Shared Roadmaps", icon: Map },
] as const;

type Tab = (typeof TABS)[number]["id"];

// ─────────────────────────────────────────────────────────────
//  Toast
// ─────────────────────────────────────────────────────────────
interface Toast { id: number; msg: string; type: "success" | "error" }

function ToastStack({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.85 }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold text-white ${
              t.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{t.msg}</span>
            <button onClick={() => onRemove(t.id)} className="ml-1 opacity-70 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Skeleton
// ─────────────────────────────────────────────────────────────
function SkeletonPost() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-2xl" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 bg-slate-100 rounded-full w-1/3" />
          <div className="h-3 bg-slate-100 rounded-full w-1/4" />
        </div>
        <div className="w-24 h-7 bg-slate-100 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded-full" />
        <div className="h-3 bg-slate-100 rounded-full w-4/5" />
        <div className="h-3 bg-slate-100 rounded-full w-3/5" />
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-50">
        <div className="h-3 w-16 bg-slate-100 rounded-full" />
        <div className="h-7 w-16 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Main page
// ─────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const router = useRouter();

  // Data
  const [feed, setFeed]             = useState<CommunityPost[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [roadmaps, setRoadmaps]     = useState<SharedRoadmap[]>([]);
  const [stats, setStats]           = useState({ total_posts: 0, total_members: 0 });

  // UI state
  const [activeTab, setActiveTab]   = useState<Tab>("feed");
  const [loading, setLoading]       = useState(true);
  const [likingId, setLikingId]     = useState<number | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [toasts, setToasts]         = useState<Toast[]>([]);
  const [roadmapSearch, setRoadmapSearch] = useState("");

  // Auth guard
  useEffect(() => {
    if (!getAuthToken()) router.push("/auth/login");
  }, [router]);

  // ── Toast helper ──
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Load stats on mount ──
  useEffect(() => {
    getCommunityStats().then(setStats).catch(() => {});
  }, []);

  // ── Load data when tab changes ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (activeTab === "feed") {
          const data = await getFeed();
          setFeed(data);
        } else if (activeTab === "leaderboard") {
          const data = await getLeaderboard();
          setLeaderboard(data);
        } else if (activeTab === "roadmaps") {
          const data = await getSharedRoadmaps();
          setRoadmaps(data);
        }
      } catch {
        addToast("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeTab, addToast]);

  // ── Like handler ──
  const handleLike = useCallback(async (postId: number) => {
    setLikingId(postId);
    try {
      const result = await toggleLike(postId);
      if (result) {
        setFeed((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, liked_by_me: result.liked, likes_count: result.likes_count }
              : p
          )
        );
      }
    } catch {
      addToast("Could not update like", "error");
    } finally {
      setLikingId(null);
    }
  }, [addToast]);

  // ── Delete handler ──
  const handleDelete = useCallback(async (postId: number) => {
    try {
      const success = await deletePost(postId);
      if (success) {
        setFeed((prev) => prev.filter((p) => p.id !== postId));
        setStats((prev) => ({ ...prev, total_posts: prev.total_posts - 1 }));
        addToast("Post deleted");
      } else {
        addToast("Could not delete post", "error");
      }
    } catch {
      addToast("Failed to delete", "error");
    }
  }, [addToast]);

  // ── Comment added handler ──
  const handleCommentAdded = useCallback((postId: number, comment: PostComment) => {
    setFeed((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, comments_count: p.comments_count + 1, comments: [...p.comments, comment] }
          : p
      )
    );
  }, []);

  // ── New post handler ──
  const handleNewPost = useCallback((post: CommunityPost) => {
    setFeed((prev) => [post, ...prev]);
    setStats((prev) => ({ ...prev, total_posts: prev.total_posts + 1 }));
  }, []);

  // ── Filtered roadmaps ──
  const filteredRoadmaps = roadmapSearch
    ? roadmaps.filter(
        (r) =>
          r.career_goal?.toLowerCase().includes(roadmapSearch.toLowerCase()) ||
          r.user_name.toLowerCase().includes(roadmapSearch.toLowerCase())
      )
    : roadmaps;

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 to-white overflow-hidden font-sans antialiased text-slate-900">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Community</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Community Hub</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              Connect, share progress, and learn together
            </p>
          </div>

          {/* Stats + New Post button */}
          <div className="hidden md:flex items-center gap-3">
            <div className="text-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-black text-blue-600">{stats.total_posts}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Posts</p>
            </div>
            <div className="text-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-black text-slate-900">{stats.total_members}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Members</p>
            </div>
            <button
              onClick={() => setShowCompose(true)}
              className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/10"
            >
              <PenSquare className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="px-8 py-3 shrink-0 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                        : "bg-white text-slate-500 border border-slate-100 hover:border-slate-200 hover:text-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile: New Post button */}
            <button
              onClick={() => setShowCompose(true)}
              className="flex md:hidden items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
            >
              <PenSquare className="w-4 h-4" />
              Post
            </button>
          </div>

          {/* Roadmap search bar (only shown on roadmaps tab) */}
          {activeTab === "roadmaps" && (
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by career goal or name…"
                value={roadmapSearch}
                onChange={(e) => setRoadmapSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
              />
              {roadmapSearch && (
                <button
                  onClick={() => setRoadmapSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <AnimatePresence mode="wait">
            {/* FEED TAB */}
            {activeTab === "feed" && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 mt-2"
              >
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonPost key={i} />)
                ) : feed.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5">
                      <Users className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No posts yet</h3>
                    <p className="text-slate-400 text-sm max-w-xs">
                      Be the first to share a milestone, ask a question, or recommend a resource!
                    </p>
                    <button
                      onClick={() => setShowCompose(true)}
                      className="mt-5 flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
                    >
                      <PenSquare className="w-4 h-4" />
                      Write first post
                    </button>
                  </div>
                ) : (
                  feed.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onDelete={handleDelete}
                      onCommentAdded={handleCommentAdded}
                      likingId={likingId}
                    />
                  ))
                )}
              </motion.div>
            )}

            {/* LEADERBOARD TAB */}
            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2"
              >
                {loading ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-16 bg-white rounded-2xl border border-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <LeaderboardTable entries={leaderboard} />
                )}
              </motion.div>
            )}

            {/* SHARED ROADMAPS TAB */}
            {activeTab === "roadmaps" && (
              <motion.div
                key="roadmaps"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-2"
              >
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-56 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                  ))
                ) : filteredRoadmaps.length === 0 ? (
                  <div className="col-span-3 flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5">
                      <Map className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No roadmaps found</h3>
                    <p className="text-slate-400 text-sm max-w-xs">
                      {roadmapSearch
                        ? "Try a different search term."
                        : "Generate your roadmap to appear here!"}
                    </p>
                  </div>
                ) : (
                  filteredRoadmaps.map((rm, i) => (
                    <RoadmapCard key={rm.user_id} roadmap={rm} index={i} />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Compose Modal ── */}
      <AnimatePresence>
        {showCompose && (
          <ComposeModal
            onClose={() => setShowCompose(false)}
            onPost={handleNewPost}
            onToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* ── Toast Stack ── */}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
