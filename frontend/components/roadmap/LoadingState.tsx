"use client";

import { motion } from "framer-motion";

export const LoadingState = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 border-4 border-blue-500/20 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 border-4 border-t-blue-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
          </motion.div>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black tracking-tight text-slate-900"
        >
          Generating your roadmap...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 mt-2 font-medium"
        >
          Analyzing your skills and goals
        </motion.p>
      </div>
    </div>
  );
};
