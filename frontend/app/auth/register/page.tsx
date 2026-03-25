"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { register } from "@/services/authService";
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await register(name, email, password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-[#F3F4F6]">
      <div className="flex w-full max-w-[1200px] mx-auto overflow-hidden">
        
        {/* LEFT SIDE: Decorative (Similar to Login) */}
        <div className="hidden md:flex w-1/2 bg-black items-center justify-center p-12 relative overflow-hidden">
          <div className="relative z-10 text-white text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black mb-6 tracking-tighter"
            >
              Start Your <br /> <span className="text-[#7C3AED]">Growth</span> Journey
            </motion.h1>
            <p className="text-gray-400 font-medium max-w-xs mx-auto">
              Join SkillMap AI and get personalized roadmaps in seconds.
            </p>
          </div>
          {/* Animated Background Elements */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#7C3AED]/20 blur-[100px] rounded-full" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-[#FB923C]/20 blur-[120px] rounded-full" 
          />
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 sm:p-16">
          <div className="w-full max-w-sm">
            <div className="mb-8 flex justify-center">
              <Link href="/">
                <div className="relative cursor-pointer hover:scale-110 transition-transform">
                  <div className="w-8 h-8 bg-black rotate-45 rounded-[2px]" />
                  <div className="absolute top-0 left-0 w-8 h-8 bg-black rotate-[-45deg] rounded-[2px]" />
                </div>
              </Link>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-black mb-2">Create account</h2>
              <p className="text-gray-500 text-sm">Join the SkillMap AI community</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-medium text-center mb-6 bg-red-50 p-2 rounded"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-green-600 text-xs font-bold text-center mb-6 bg-green-50 p-2 rounded"
                >
                  Account created! Redirecting to login...
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="space-y-6">
               <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-0 top-2.5 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-gray-200 py-2 pl-7 outline-none focus:border-black transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-0 top-2.5 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-b border-gray-200 py-2 pl-7 outline-none focus:border-black transition-colors"
                    placeholder="hello@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1 relative">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-0 top-2.5 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-b border-gray-200 py-2 pl-7 outline-none focus:border-black transition-colors pr-8"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-2.5 text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                disabled={loading || success}
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-sm hover:translate-y-[-2px] hover:shadow-xl active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center uppercase tracking-widest"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up Now"}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs font-semibold text-gray-500 tracking-tight">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-black underline underline-offset-4 decoration-2 decoration-[#7C3AED]">Log In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
