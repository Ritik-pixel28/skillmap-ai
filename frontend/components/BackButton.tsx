"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide on homepage
  if (pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`
        fixed top-5 left-5 z-50
        flex items-center gap-2
        px-3 py-2 sm:px-4 sm:py-2
        bg-white/80 backdrop-blur-md
        border border-gray-200
        rounded-full
        shadow-md
        text-sm font-medium text-gray-700
        hover:bg-gray-100 hover:text-black hover:shadow-lg hover:scale-105
        active:scale-95
        transition-all duration-200 ease-in-out
        cursor-pointer
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
      style={{ transition: "opacity 0.4s ease, transform 0.4s ease, background 0.2s, box-shadow 0.2s, scale 0.15s" }}
      aria-label="Go back"
    >
      <ArrowLeft size={18} strokeWidth={2.2} />
      <span className="hidden sm:inline">Back</span>
    </button>
  );
}
