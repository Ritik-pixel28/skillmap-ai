"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/api";
import {
  Search, Filter, BookOpen, Video, GraduationCap, Layers,
  Sparkles, Bookmark, Library, X, CheckCircle2, AlertCircle
} from "lucide-react";
import { Sidebar } from "@/components/roadmap/Sidebar";
import ResourceCard from "@/components/library/ResourceCard";
import ResourceModal from "@/components/library/ResourceModal";
import {
  Resource,
  getAllResources,
  getRecommendedResources,
  getSavedResources,
  saveResource,
  unsaveResource,
} from "@/services/libraryService";
import { getRoadmap } from "@/lib/api";

// ─────────────────────────────────────────────────────────────
//  Tab definitions
// ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "recommended", label: "Recommended", icon: Sparkles },
  { id: "saved",       label: "Saved",        icon: Bookmark },
  { id: "all",         label: "All Resources", icon: Layers },
] as const;

type Tab = (typeof TABS)[number]["id"];

const TYPE_FILTERS = [
  { value: "",        label: "All Types" },
  { value: "article", label: "Articles",  icon: BookOpen },
  { value: "video",   label: "Videos",    icon: Video },
  { value: "course",  label: "Courses",   icon: GraduationCap },
];

const DIFFICULTY_FILTERS = [
  { value: "",             label: "All Levels" },
  { value: "beginner",     label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced",     label: "Advanced" },
];

// ─────────────────────────────────────────────────────────────
//  Toast component
// ─────────────────────────────────────────────────────────────
interface Toast { id: number; msg: string; type: "success" | "error" }

function ToastStack({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 items-end">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.8 }}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-lg text-sm font-semibold text-white ${
              t.type === "success" ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            {t.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
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
//  Skeleton loader
// ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4 animate-pulse">
      <div className="flex justify-between">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
        <div className="w-8 h-8 bg-slate-100 rounded-xl" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-1/2" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 bg-slate-100 rounded-full" />
        <div className="h-3 bg-slate-100 rounded-full w-4/5" />
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-50">
        <div className="h-3 w-20 bg-slate-100 rounded-full" />
        <div className="h-3 w-12 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Main page
// ─────────────────────────────────────────────────────────────
export default function LibraryPage() {
  const router = useRouter();

  // Data
  const [recommended, setRecommended] = useState<Resource[]>([]);
  const [saved, setSaved]             = useState<Resource[]>([]);
  const [all, setAll]                 = useState<Resource[]>([]);
  const [roadmapWeeks, setRoadmapWeeks] = useState<{ week: number; title: string }[]>([]);

  // UI state
  const [activeTab, setActiveTab] = useState<Tab>("recommended");
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter]         = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [loading, setLoading]     = useState(true);
  const [savingId, setSavingId]   = useState<number | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [toasts, setToasts]       = useState<Toast[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  // ── Auth guard ──
  useEffect(() => {
    if (!getAuthToken()) router.push("/auth/login");
  }, [router]);

  // ── Load data ──
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [rec, sav, roadmapData] = await Promise.all([
          getRecommendedResources(),
          getSavedResources(),
          getRoadmap().catch(() => null),
        ]);
        setRecommended(rec);
        setSaved(sav);

        if (roadmapData?.data?.weeks) {
          setRoadmapWeeks(
            roadmapData.data.weeks.map((w: any) => ({ week: w.week, title: w.title }))
          );
        }
      } catch (e) {
        addToast("Failed to load library data", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Load "All" tab with debounce on filters ──
  useEffect(() => {
    if (activeTab !== "all") return;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await getAllResources({
          search: search || undefined,
          type: typeFilter || undefined,
          difficulty: difficultyFilter || undefined,
        });
        setAll(data);
      } catch {
        addToast("Failed to load resources", "error");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, search, typeFilter, difficultyFilter]);

  // ── Toast helper ──
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type }]);
    setToastCounter((c) => c + 1);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Save / Unsave ──
  const handleSave = useCallback(async (id: number) => {
    setSavingId(id);
    try {
      const ok = await saveResource(id);
      if (ok) {
        const toggle = (r: Resource) => r.id === id ? { ...r, is_saved: true } : r;
        setRecommended((prev) => prev.map(toggle));
        setAll((prev) => prev.map(toggle));
        const saved_resource = [...recommended, ...all].find((r) => r.id === id);
        if (saved_resource) setSaved((prev) => [...prev, { ...saved_resource, is_saved: true }]);
        if (selectedResource?.id === id) setSelectedResource((r) => r ? { ...r, is_saved: true } : r);
        addToast("Resource saved!");
      } else {
        addToast("Already saved", "error");
      }
    } catch {
      addToast("Save failed", "error");
    } finally {
      setSavingId(null);
    }
  }, [recommended, all, selectedResource, addToast]);

  const handleUnsave = useCallback(async (id: number) => {
    setSavingId(id);
    try {
      const ok = await unsaveResource(id);
      if (ok) {
        const toggle = (r: Resource) => r.id === id ? { ...r, is_saved: false } : r;
        setRecommended((prev) => prev.map(toggle));
        setAll((prev) => prev.map(toggle));
        setSaved((prev) => prev.filter((r) => r.id !== id));
        if (selectedResource?.id === id) setSelectedResource((r) => r ? { ...r, is_saved: false } : r);
        addToast("Removed from saved");
      }
    } catch {
      addToast("Remove failed", "error");
    } finally {
      setSavingId(null);
    }
  }, [selectedResource, addToast]);

  // ── Client-side search for recommended/saved tabs ──
  const filteredRecommended = useMemo(() => {
    let list = recommended;
    if (search) list = list.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || (r.tags ?? "").toLowerCase().includes(search.toLowerCase()));
    if (typeFilter) list = list.filter((r) => r.type === typeFilter);
    if (difficultyFilter) list = list.filter((r) => r.difficulty === difficultyFilter);
    return list;
  }, [recommended, search, typeFilter, difficultyFilter]);

  const filteredSaved = useMemo(() => {
    let list = saved;
    if (search) list = list.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()) || (r.tags ?? "").toLowerCase().includes(search.toLowerCase()));
    if (typeFilter) list = list.filter((r) => r.type === typeFilter);
    if (difficultyFilter) list = list.filter((r) => r.difficulty === difficultyFilter);
    return list;
  }, [saved, search, typeFilter, difficultyFilter]);

  const currentList = activeTab === "recommended" ? filteredRecommended : activeTab === "saved" ? filteredSaved : all;

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-blue-50 to-white overflow-hidden font-sans antialiased text-slate-900">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Library className="w-5 h-5 text-blue-600" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Library</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 leading-tight">Resource Hub</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Curated resources matched to your learning path</p>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-black text-blue-600">{recommended.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Recommended</p>
            </div>
            <div className="text-center px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-2xl font-black text-slate-900">{saved.length}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Saved</p>
            </div>
          </div>
        </div>

        {/* ── Tabs + Search/Filter Bar ── */}
        <div className="px-8 py-3 shrink-0 flex flex-col gap-4">
          {/* Tabs */}
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
                  {tab.id === "saved" && saved.length > 0 && (
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>
                      {saved.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search + Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-2xl px-3 py-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-sm font-semibold text-slate-600 bg-transparent border-none outline-none cursor-pointer"
              >
                {TYPE_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Difficulty filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-2xl px-3 py-2">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="text-sm font-semibold text-slate-600 bg-transparent border-none outline-none cursor-pointer"
              >
                {DIFFICULTY_FILTERS.map((f) => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Clear filters */}
            {(search || typeFilter || difficultyFilter) && (
              <button
                onClick={() => { setSearch(""); setTypeFilter(""); setDifficultyFilter(""); }}
                className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Content Grid ── */}
        <PageTransition className="flex-1 overflow-y-auto px-8 pb-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-2">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : currentList.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center animate-[fadeIn_0.3s_ease-out]"
            >
              {activeTab === "saved" ? (
                <>
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-5">
                    <Bookmark className="w-10 h-10 text-blue-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No saved resources yet</h3>
                  <p className="text-slate-400 text-sm max-w-xs">Browse the Recommended or All Resources tab and bookmark resources you want to revisit.</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-5">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">No resources found</h3>
                  <p className="text-slate-400 text-sm max-w-xs">Try adjusting your search or filters to find what you're looking for.</p>
                </>
              )}
            </div>
          ) : (
            <div
              key={activeTab}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-2 animate-[fadeIn_0.3s_ease-out]"
            >
                {currentList.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onSave={handleSave}
                    onUnsave={handleUnsave}
                    onClick={setSelectedResource}
                    savingId={savingId}
                  />
                ))}
            </div>
          )}
        </PageTransition>
      </div>

      {/* ── Resource Detail Modal ── */}
      <AnimatePresence>
        {selectedResource && (
          <ResourceModal
            resource={selectedResource}
            onClose={() => setSelectedResource(null)}
            onSave={handleSave}
            onUnsave={handleUnsave}
            roadmapWeeks={roadmapWeeks}
            onToast={addToast}
          />
        )}
      </AnimatePresence>

      {/* ── Toast Stack ── */}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
