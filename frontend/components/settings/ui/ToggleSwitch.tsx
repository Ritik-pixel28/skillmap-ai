"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const ToggleSwitch = ({ isOn, onToggle, disabled = false }: ToggleSwitchProps) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 outline-none focus:ring-2 focus:ring-blue-100 ${
        isOn ? "bg-blue-600" : "bg-slate-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      aria-pressed={isOn}
    >
      <motion.div
        animate={{ x: isOn ? 26 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
};
