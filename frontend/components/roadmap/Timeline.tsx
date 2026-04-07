"use client";

import { motion } from "framer-motion";

interface TimelineProps {
  itemsCount: number;
}

export const Timeline = ({ itemsCount }: TimelineProps) => {
  return (
    <div className="fixed left-0 top-0 h-screen w-20 flex-col items-center justify-center gap-12 z-10 hidden xl:flex">
      <div className="flex flex-col items-center gap-8 relative shrink-0">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="w-full bg-blue-600 rounded-full"
            initial={{ height: 0 }}
            animate={{ height: "15%" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>

        {Array.from({ length: itemsCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            className={`w-10 h-10 rounded-full border-4 flex items-center justify-center font-black text-xs transition-all relative z-10 
              ${i === 0 
                ? "bg-blue-600 border-white text-white shadow-xl shadow-blue-500/30" 
                : "bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500"
              }`}
          >
            {i + 1}
            {i === 0 && (
              <motion.div 
                className="absolute inset-0 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="absolute bottom-10 flex flex-col items-center gap-4">
         <span className="text-[10px] font-black text-slate-400 rotate-90 origin-center whitespace-nowrap tracking-widest uppercase">
           Your Journey
         </span>
         <div className="w-[1px] h-20 bg-slate-100" />
      </div>
    </div>
  );
};
