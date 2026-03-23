"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out px-6 pt-6`}
        >
            <div className={`max-w-7xl mx-auto flex justify-between items-center py-5 px-8 transition-all duration-500 rounded-[32px] ${scrolled ? "bg-white/80 backdrop-blur-2xl shadow-xl border border-white/20" : "bg-transparent"
                }`}>
                <Link href="/" className="flex items-center">
                    <span className="font-black text-2xl tracking-tighter text-black">SkillMap AI</span>
                </Link>

                <div className="hidden md:flex items-center space-x-12">
                    {["Home", "Roadmaps", "Practice", "Login"].map((name) => (
                        <Link
                            key={name}
                            href="#"
                            className="text-[13px] font-black uppercase tracking-widest text-black hover:opacity-40 transition-opacity"
                        >
                            {name}
                        </Link>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-black text-white px-8 py-3 rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all"
                    >
                        Get Started
                    </motion.button>
                </div>

                <button className="md:hidden text-black" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden absolute top-32 left-6 right-6 bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-10 space-y-8 text-center">
                            {["Home", "Roadmaps", "Practice", "Login"].map((item) => (
                                <Link key={item} href="#" className="text-2xl font-black tracking-tighter" onClick={() => setIsOpen(false)}>
                                    {item}
                                </Link>
                            ))}
                            <Link
                                href="#"
                                className="bg-black text-white py-6 rounded-[32px] text-center font-black text-xl"
                                onClick={() => setIsOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
