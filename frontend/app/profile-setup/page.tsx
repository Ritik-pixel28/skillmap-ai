"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { 
  GraduationCap, 
  Target, 
  Zap, 
  Clock, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Brain,
  Rocket,
  ChevronRight,
  Loader2
} from "lucide-react";
import { saveProfile } from "@/services/profileService";
import { generateRoadmap } from "@/services/roadmapService";

const LOTTIE_PROFILE_ANIM = "https://lottie.host/d4bb46e1-29e5-4465-9f8d-d3fcd146f1fc/Jgl1H4ntGn.json"; 
const LOTTIE_BG_ANIM = "https://lottie.host/80e77d70-7b24-4f93-b09b-ae7f8a7c2936/kS4095r5O6.json";

const educationLevels = [
  "High School",
  "Bachelor's Degree",
  "Master's Degree",
  "Ph.D.",
  "Self-Taught / Bootcamp"
];

const careerGoals = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "Data Scientist",
  "Product Manager",
  "DevOps Engineer",
  "Mobile Developer",
  "UI/UX Designer"
];

const skillLevels = [
  { id: "beginner", label: "Beginner", icon: Brain, description: "Just starting my journey. Need the basics.", color: "from-blue-500 to-cyan-400" },
  { id: "intermediate", label: "Intermediate", icon: Zap, description: "Have some experience. Want to specialize.", color: "from-purple-500 to-indigo-400" },
  { id: "advanced", label: "Advanced", icon: Rocket, description: "Skilled professional. Looking for mastery.", color: "from-orange-500 to-pink-500" }
];

export default function ProfileSetup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [bgData, setBgData] = useState(null);

  const [formData, setFormData] = useState({
    education: "",
    career_goal: "",
    skill_level: "beginner",
    weekly_hours: 15,
    timeline: 6
  });

  useEffect(() => {
    fetch(LOTTIE_PROFILE_ANIM)
      .then(res => res.json())
      .then(data => setAnimationData(data));
      
    fetch(LOTTIE_BG_ANIM)
      .then(res => res.json())
      .then(data => setBgData(data));
  }, []);

  const totalHours = formData.weekly_hours * formData.timeline;
  
  const getIntensity = () => {
    const hours = formData.weekly_hours;
    const weeks = formData.timeline;

    if (hours >= 35 && weeks <= 4) {
      return { label: "Extreme 🔥", color: "text-rose-600 bg-rose-50", icon: Target };
    }
    if (hours >= 30 && weeks <= 5) {
      return { label: "High ⚡", color: "text-orange-600 bg-orange-50", icon: Rocket };
    }
    if (hours <= 10 && weeks >= 6) {
      return { label: "Light 🌱", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 };
    }
    if (hours <= 20 && weeks > 5) {
      return { label: "Balanced ⚖️", color: "text-blue-600 bg-blue-50", icon: TrendingUp };
    }
    
    return { label: "Medium ⚖️", color: "text-amber-600 bg-amber-50", icon: Zap };
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        await saveProfile(formData);
        await generateRoadmap();
        router.push("/roadmap");
      } catch (error) {
        console.error("Profile setup failed", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const intensity = getIntensity();

  return (
    <main className="min-h-screen w-full relative flex items-center justify-center p-4 md:p-8 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {bgData && (
          <Lottie 
            animationData={bgData}
            loop={true}
            style={{ width: '100%', height: '100%', scale: '1.2' }}
          />
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-white/40 z-0 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-5xl bg-white/90 backdrop-blur-3xl border border-white/50 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] rounded-[3rem] overflow-hidden flex flex-col md:flex-row min-h-[650px]"
      >
        <div className="w-full md:w-2/5 bg-slate-50/20 p-10 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100">
          <div className="w-full mb-10">
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? "w-10 bg-blue-600" : "w-4 bg-slate-200"}`}
                />
              ))}
            </div>
            
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-black text-slate-900 leading-tight">
                {step === 1 && "Create Your Path"}
                {step === 2 && "Skill Mastery"}
                {step === 3 && "Time Commitment"}
              </h2>
              <p className="text-slate-500 text-base font-medium px-4">
                {step === 1 && "Start your journey with a personalized curriculum."}
                {step === 2 && "Select your current expertise level."}
                {step === 3 && "Set your weekly hours and goal timeline."}
              </p>
            </motion.div>
          </div>

          <div className="flex-1 flex items-center justify-center w-full">
            {animationData && (
              <Lottie 
                animationData={animationData} 
                className="w-full h-80 drop-shadow-2xl scale-125 transition-transform duration-700 hover:scale-110" 
              />
            )}
          </div>

          <div className="mt-8 w-full bg-white/60 p-5 rounded-3xl border border-white shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">AI-Powered</span>
              <p className="text-sm text-slate-700 font-bold">Dynamic Roadmaps</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-10 md:p-16 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Education Level</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-slate-50 rounded-xl group-focus-within:bg-blue-600 group-focus-within:text-white transition-all duration-300">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <select 
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                      className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-600/30 outline-none transition-all appearance-none font-bold text-slate-800 text-lg shadow-inner"
                    >
                      <option value="">Select Level</option>
                      {educationLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Career Goal</label>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 p-2 bg-slate-50 rounded-xl group-focus-within:bg-blue-600 group-focus-within:text-white transition-all duration-300">
                      <Target className="w-6 h-6" />
                    </div>
                    <select 
                      value={formData.career_goal}
                      onChange={(e) => setFormData({...formData, career_goal: e.target.value})}
                      className="w-full pl-16 pr-6 py-6 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-blue-600/30 outline-none transition-all appearance-none font-bold text-slate-800 text-lg shadow-inner"
                    >
                      <option value="">Select Role</option>
                      {careerGoals.map(goal => <option key={goal} value={goal}>{goal}</option>)}
                    </select>
                    <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="grid gap-6"
              >
                {skillLevels.map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setFormData({...formData, skill_level: lvl.id})}
                    className={`flex items-center text-left p-7 rounded-[2.5rem] border-2 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${
                      formData.skill_level === lvl.id 
                        ? "border-blue-600 bg-blue-50/60 shadow-2xl shadow-blue-500/15" 
                        : "border-slate-50 bg-slate-50/30 hover:border-blue-500/20 hover:bg-blue-50/10 hover:shadow-xl"
                    }`}
                  >
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${lvl.color} text-white mr-6 shadow-lg shadow-blue-500/15`}>
                      <lvl.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{lvl.label}</h3>
                      <p className="text-sm text-slate-500 font-medium">{lvl.description}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-14"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-black text-slate-900 tracking-tight">WEEKLY COMMITMENT</label>
                    <span className="text-4xl font-black text-blue-600">{formData.weekly_hours}h</span>
                  </div>
                  <input 
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={formData.weekly_hours}
                    onChange={(e) => setFormData({...formData, weekly_hours: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-transparent 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 
                      [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-lg 
                      [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400">
                    <span>5 HR</span>
                    <span>20 HR</span>
                    <span>40 HR</span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <label className="text-sm font-black text-slate-900 tracking-tight block">LEARNING DURATION</label>
                      <span className="text-xs font-bold text-slate-400">
                        {formData.timeline <= 4 && "Fast Track 🚀"}
                        {formData.timeline > 4 && formData.timeline <= 6 && "Balanced ⚖️"}
                        {formData.timeline > 6 && "Deep Focus 🧠"}
                      </span>
                    </div>
                    <span className="text-4xl font-black text-purple-600">{formData.timeline} weeks</span>
                  </div>
                  <input 
                    type="range"
                    min="3"
                    max="8"
                    step="1"
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-transparent 
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 
                      [&::-webkit-slider-thumb]:border-purple-600 [&::-webkit-slider-thumb]:shadow-lg 
                      [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400">
                    <span>3 WEEKS</span>
                    <span>5 WEEKS</span>
                    <span>8 WEEKS</span>
                  </div>
                </div>

                <div className={`p-8 rounded-[2.5rem] border-2 transition-all duration-700 flex items-center gap-6 ${intensity.color.split(' ')[1]} ${intensity.color.split(' ')[0].replace('text-', 'border-').replace('600', '200')}`}>
                  <div className={`p-4 rounded-2xl bg-white shadow-sm ${intensity.color.split(' ')[0]}`}>
                    <intensity.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Intensity Mode</p>
                    <p className="text-2xl font-black text-slate-900">{intensity.label} Intensity</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-16 flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-slate-400 hover:text-slate-900 font-bold transition-colors uppercase tracking-widest text-[10px]"
                disabled={loading}
              >
                Go Back
              </button>
            ) : <div />}
            
            <button
              onClick={handleNext}
              disabled={loading || (step === 1 && (!formData.education || !formData.career_goal))}
              className={`px-12 py-5 rounded-[1.5rem] flex items-center gap-4 font-black transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                step === 3 
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/25" 
                  : "bg-slate-900 text-white shadow-xl"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  GENERATING...
                </>
              ) : (
                <>
                  {step === 3 ? "LAUNCH ROADMAP" : "NEXT PHASE"}
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
