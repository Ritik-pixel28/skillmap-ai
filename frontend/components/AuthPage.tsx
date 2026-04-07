"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { login, register } from "@/services/authService";
import { Mail, Lock, User, Loader2, CheckCircle, UserPlus, Eye, EyeOff } from "lucide-react";

type AuthView = "signin" | "signup" | "success";

// ── Slide transition variants ─────────────────────────────────────────
const formVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

const illustrationVariants = {
  enter: { opacity: 0, scale: 0.95 },
  center: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.05 },
};

export default function AuthPage() {
  const [view, setView] = useState<AuthView>("signin");
  const [direction, setDirection] = useState(0); // 1 = forward, -1 = backward

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const router = useRouter();
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────
  const switchTo = (target: AuthView) => {
    setError("");
    setDirection(target === "signup" ? 1 : -1);
    setView(target);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/profile-setup");
      } else {
        setError(result.message || "Invalid credentials");
        if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        errorTimerRef.current = setTimeout(() => setError(""), 5000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await register(name, email, password);
      if (result.success) {
        setRegisteredEmail(email);
        setDirection(1);
        setView("success");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    setEmail("");
    setPassword("");
    setName("");
    setDirection(-1);
    setView("signin");
  };

  // ── Illustration data ───────────────────────────────────────────────
  const illustrationData = {
    signin: {
      src: "/auth/signin-illustration.png",
      title: "Start Your Journey.",
      subtitle: "Login to access your personalized AI-powered learning roadmaps.",
    },
    signup: {
      src: "/auth/signup-illustration.png",
      title: "Sign Up Now.",
      subtitle: "Join SkillMap AI and unlock your tech career potential.",
    },
    success: {
      src: "/auth/success-illustration.png",
      title: "Success!",
      subtitle: "",
    },
  };

  const currentIll = illustrationData[view];

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100 p-4">
      {/* ── Outer card ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl shadow-black/8 flex overflow-hidden relative"
        style={{ minHeight: 640 }}
      >
        {/* ── Left sidebar nav ─────────────────────────────────────── */}
        {view !== "success" && (
          <div className="hidden md:flex flex-col items-center justify-center w-[72px] bg-[#1e2235] py-8 gap-6 z-20">
            {/* App logo */}
            <div className="mb-auto mt-4">
              <div className="w-6 h-6 relative">
                <div className="w-5 h-5 bg-[#4A6CF7] rotate-45 rounded-sm" />
              </div>
            </div>
            {/* Sign In tab */}
            <button
              onClick={() => switchTo("signin")}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 ${
                view === "signin"
                  ? "text-white bg-white/10"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <CheckCircle size={20} />
              <span className="text-[10px] font-bold tracking-wider uppercase">Sign In</span>
            </button>
            {/* Sign Up tab */}
            <button
              onClick={() => switchTo("signup")}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 ${
                view === "signup"
                  ? "text-white bg-white/10"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <UserPlus size={20} />
              <span className="text-[10px] font-bold tracking-wider uppercase">Sign Up</span>
            </button>
            <div className="mt-auto" />
          </div>
        )}

        {/* ── Blue illustration panel ─────────────────────────────── */}
        <div
          className={`hidden md:flex flex-col items-center justify-center relative overflow-hidden ${
            view === "success" ? "w-full" : "w-[45%]"
          }`}
          style={{ background: "linear-gradient(145deg, #4A6CF7 0%, #3B5DE7 50%, #2F4BD9 100%)" }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={view}
              custom={direction}
              variants={illustrationVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center px-10 py-12 text-center relative z-10"
            >
              {/* Title */}
              <h2 className="text-white text-3xl font-black mb-2 tracking-tight">
                {currentIll.title}
              </h2>
              {currentIll.subtitle && (
                <p className="text-white/70 text-sm mb-8 max-w-[280px] leading-relaxed">
                  {currentIll.subtitle}
                </p>
              )}
              {/* Illustration */}
              <div className="relative w-[320px] h-[270px]">
                <Image
                  src={currentIll.src}
                  alt={currentIll.title}
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>

              {/* Success-specific content */}
              {view === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex flex-col items-center"
                >
                  <p className="text-white/80 text-sm mb-1">
                    We have sent you an email verification to
                  </p>
                  <p className="text-white font-bold text-sm mb-6">
                    {registeredEmail}
                  </p>
                  <button
                    onClick={handleProceed}
                    className="bg-[#1e2235] text-white px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2a3048] transition-colors"
                  >
                    Proceed
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Decorative floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 right-8 w-3 h-3 bg-white/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-12 left-8 w-2 h-2 bg-white/15 rounded-sm rotate-45"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 left-6 w-1.5 h-1.5 bg-white/10 rounded-full"
          />
        </div>

        {/* ── Right form panel ────────────────────────────────────── */}
        {view !== "success" && (
          <div className="flex-1 flex items-center justify-center p-10 sm:p-14 relative">
            <div className="w-full max-w-[380px]">
              <AnimatePresence mode="wait" custom={direction}>
                {view === "signin" ? (
                  <motion.div
                    key="signin-form"
                    custom={direction}
                    variants={formVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {/* Header */}
                    <div className="mb-8">
                      <p className="text-sm text-gray-400 mb-6 text-right">
                        Don&apos;t have an account?{" "}
                        <button
                          onClick={() => switchTo("signup")}
                          className="text-[#4A6CF7] font-bold hover:underline"
                        >
                          Sign Up.
                        </button>
                      </p>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl mb-5"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Sign In Form */}
                    <form onSubmit={handleSignIn} className="space-y-6">
                      {/* Email */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          E-Mail
                        </label>
                        <div className="relative mt-1">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 pr-10 text-sm outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 transition-all"
                            placeholder="your@email.com"
                          />
                          <Mail className="absolute right-3 top-3.5 text-gray-300" size={16} />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Password
                        </label>
                        <div className="relative mt-1">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 transition-all"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-300 hover:text-gray-500 transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        disabled={loading}
                        className="w-full bg-[#1e2235] text-white py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#2a3048] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-60"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "SIGN IN"
                        )}
                      </button>
                    </form>

                    {/* Terms */}
                    <p className="text-[10px] text-gray-400 mt-6 leading-relaxed text-center">
                      By clicking the Sign In button, you therefore agree to the Privacy Policy
                      for more information, please contact here.
                    </p>

                    {/* Mobile toggle */}
                    <div className="md:hidden mt-8 text-center">
                      <p className="text-xs text-gray-400">
                        Don&apos;t have an account?{" "}
                        <button
                          onClick={() => switchTo("signup")}
                          className="text-[#4A6CF7] font-bold"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup-form"
                    custom={direction}
                    variants={formVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    {/* Header */}
                    <div className="mb-8">
                      <p className="text-sm text-gray-400 mb-6 text-right">
                        Already have an account?{" "}
                        <button
                          onClick={() => switchTo("signin")}
                          className="text-[#4A6CF7] font-bold hover:underline"
                        >
                          Sign In.
                        </button>
                      </p>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl mb-5"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Sign Up Form */}
                    <form onSubmit={handleSignUp} className="space-y-6">
                      {/* Username */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Username
                        </label>
                        <div className="relative mt-1">
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 transition-all"
                            placeholder="myusername"
                          />
                          <User className="absolute right-3 top-3.5 text-gray-300" size={16} />
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          E-Mail
                        </label>
                        <div className="relative mt-1">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 transition-all"
                            placeholder="your@email.com"
                          />
                          <Mail className="absolute right-3 top-3.5 text-gray-300" size={16} />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                          Password
                        </label>
                        <div className="relative mt-1">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-[#4A6CF7] focus:ring-2 focus:ring-[#4A6CF7]/10 transition-all"
                            placeholder="••••••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3.5 text-gray-300 hover:text-gray-500 transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        disabled={loading}
                        className="w-full bg-[#1e2235] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2a3048] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-60"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "SIGN UP"
                        )}
                      </button>
                    </form>

                    {/* Mobile toggle */}
                    <div className="md:hidden mt-8 text-center">
                      <p className="text-xs text-gray-400">
                        Already have an account?{" "}
                        <button
                          onClick={() => switchTo("signin")}
                          className="text-[#4A6CF7] font-bold"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── Mobile success view ──────────────────────────────────── */}
        {view === "success" && (
          <div
            className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center"
            style={{ background: "linear-gradient(145deg, #4A6CF7 0%, #3B5DE7 50%, #2F4BD9 100%)" }}
          >
            <h2 className="text-white text-2xl font-black mb-4">Success!</h2>
            <div className="relative w-[200px] h-[180px] mb-6">
              <Image
                src="/auth/success-illustration.png"
                alt="Success"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-white/80 text-sm mb-1">
              We have sent you an email verification to
            </p>
            <p className="text-white font-bold text-sm mb-6">{registeredEmail}</p>
            <button
              onClick={handleProceed}
              className="bg-[#1e2235] text-white px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest"
            >
              Proceed
            </button>
          </div>
        )}
      </motion.div>
    </main>
  );
}
