"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { generateRoadmap } from "@/services/roadmapService";
import { CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const result = await generateRoadmap();
        if (result.success) {
          setRoadmap(result.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
           className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-green-100 mb-6"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Roadmap Generated</span>
          </motion.div>
          <h1 className="text-6xl font-black tracking-tighter text-black mb-4">Your Career <br /> <span className="text-blue-600 underline decoration-blue-200 underline-offset-8">Blueprint</span></h1>
          <p className="text-gray-500 font-bold italic text-xl">4 Weeks to Mastery</p>
        </header>

        <div className="space-y-12">
          {roadmap && Object.entries(roadmap).map(([week, content]: [string, any], index) => (
            <motion.div
              key={week}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-12 border-l-4 border-gray-100 hover:border-blue-200 transition-colors group"
            >
              <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-white border-4 border-gray-200 group-hover:border-blue-500 transition-all flex items-center justify-center">
                <Circle className="w-2 h-2 text-blue-500 fill-current opacity-0 group-hover:opacity-100" />
              </div>
              
              <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 group-hover:bg-white group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                    Week {index + 1}
                  </span>
                  <div className="flex items-center space-x-2 text-gray-400">
                     <Clock className="w-4 h-4" />
                     <span className="text-xs font-bold">7 days</span>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black group-hover:text-blue-600 transition-colors">
                  {content}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="mt-20 p-12 rounded-[56px] bg-black text-white text-center relative overflow-hidden"
        >
           <div className="relative z-10">
             <h2 className="text-3xl font-black mb-6">Ready to start week 1?</h2>
             <button className="bg-white text-black px-10 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-transform shadow-2xl">
               Begin First Assignment
             </button>
           </div>
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </motion.div>
      </div>
    </div>
  );
}
