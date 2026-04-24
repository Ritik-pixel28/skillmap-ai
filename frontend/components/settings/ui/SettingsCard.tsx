"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SettingsCardProps {
  children: ReactNode;
  className?: string;
}

export const SettingsCard = ({ children, className = "" }: SettingsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 sm:p-8 ${className}`}
    >
      {children}
    </motion.div>
  );
};
