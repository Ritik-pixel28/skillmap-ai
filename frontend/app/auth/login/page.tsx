"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { login } from "@/services/authService";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push("/roadmap");
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-[#F3F4F6]">
      {/* Container */}
      <div className="flex w-full max-w-[1200px] mx-auto overflow-hidden">
        
        {/* LEFT SIDE: Playful Characters */}
        <div className="hidden md:flex w-1/2 bg-[#E5E7EB] items-center justify-center p-12">
          <div className="relative w-full max-w-sm aspect-square flex items-end justify-center">
            {/* Purple Rectangle */}
            <div className="absolute left-[10%] bottom-[35%] w-[35%] h-[50%] bg-[#7C3AED] rounded-sm flex flex-col items-center justify-center space-y-2">
                <div className="flex space-x-4">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <div className="w-0.5 h-4 bg-black" />
            </div>

            {/* Black Rectangle */}
            <div className="absolute left-[40%] bottom-[20%] w-[25%] h-[40%] bg-black rounded-sm z-10 flex items-start justify-center pt-8">
               <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <div className="w-2 h-2 bg-white rounded-full" />
                </div>
            </div>

            {/* Orange Half-Circle */}
            <div className="absolute left-0 bottom-0 w-[60%] h-[35%] bg-[#FB923C] rounded-t-[100px] flex flex-col items-center justify-center pt-4">
                <div className="flex space-x-6">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <div className="w-2 h-2 bg-black rounded-full" />
                </div>
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2" />
            </div>

            {/* Yellow Tall Character */}
            <div className="absolute right-[10%] bottom-0 w-[25%] h-[50%] bg-[#FACC15] rounded-t-full flex flex-col items-center justify-start pt-16">
                <div className="flex space-x-2 mb-2">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <div className="w-6 h-1 bg-black rounded-full" />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Form */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 sm:p-16">
          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="mb-12 flex justify-center">
              <div className="relative">
                <div className="w-8 h-8 bg-black rotate-45 rounded-[2px]" />
                <div className="absolute top-0 left-0 w-8 h-8 bg-black rotate-[-45deg] rounded-[2px]" />
              </div>
            </div>

            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-black mb-2">Welcome back!</h1>
              <p className="text-gray-500 text-sm">Please enter your details</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-medium text-center mb-6"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors"
                  placeholder="anna@gmail.com"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-[11px] font-semibold text-gray-700">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-gray-300 py-2 outline-none focus:border-black transition-colors pr-8"
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

              <div className="flex items-center justify-between text-[11px] font-medium pt-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input type="checkbox" className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-black accent-black" />
                  <span className="text-gray-600 group-hover:text-black transition-colors">Remember for 30 days</span>
                </label>
                <Link href="#" className="text-gray-600 hover:text-black transition-colors">Forgot password?</Link>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  disabled={loading}
                  className="w-full bg-[#1A1A1A] text-white py-3 rounded-full font-bold text-sm hover:bg-black transition-colors flex items-center justify-center"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
                </button>

                <button
                  type="button"
                  className="w-full bg-white border border-gray-200 text-black py-3 rounded-full font-bold text-sm flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                     <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                     <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                     <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                     <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Log in with Google</span>
                </button>
              </div>
            </form>

            <div className="mt-10 text-center">
              <p className="text-xs font-semibold text-gray-500">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-black underline underline-offset-4">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
