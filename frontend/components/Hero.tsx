"use client";

import { motion, Variants } from "framer-motion";
import { Apple, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 70,
                damping: 15,
            },
        },
    };


    return (
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-white">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-10%] w-[60%] h-[80%] bg-blue-400 blur-[150px] rounded-full -z-10"
            />

            <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col space-y-10"
                >
                    <motion.div variants={itemVariants}>
                        <span className="bg-[#fef3c7] text-[#92400e] px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] border border-[#fde68a]">
                            AI-Powered Career Transformation
                        </span>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-7xl md:text-[100px] font-black text-black leading-[0.85] tracking-[-0.04em]"
                    >
                        Map Your <br />
                        <span className="text-blue-600">Future</span> AI
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl text-gray-600 max-w-md leading-relaxed font-bold italic"
                    >
                        SkillMap AI helps you navigate the complex tech landscape with tailored roadmaps,
                        hands-on projects, and real-time progress tracking.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
                        <Link href="/auth/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-black text-white px-10 py-5 rounded-[24px] font-black flex items-center space-x-3 shadow-xl hover:bg-gray-800 transition-all border border-black w-full sm:w-auto"
                            >
                                <div className="text-left leading-none">
                                    <p className="text-lg">Get Started Free</p>
                                </div>
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white border-2 border-gray-200 text-black px-10 py-5 rounded-[24px] font-black flex items-center space-x-3 shadow-sm hover:border-black transition-all"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            <div className="text-left leading-none">
                                <p className="text-lg text-gray-900">Watch Demo</p>
                            </div>
                        </motion.button>
                    </motion.div>


                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: 100 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
                    className="relative group"
                >
                    <div className="relative w-full max-w-[650px] aspect-[4/5] rounded-[80px] overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 shadow-[0_80px_120px_-30px_rgba(37,99,235,0.4)]">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent)]" />

                        <motion.img
                            animate={{
                                y: [0, -30, 0],
                                rotate: [0, 1.5, 0],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            src="/images/hero_3d_career_objects_1773912663468.png"
                            alt="SkillMap AI Roadmap"
                            className="w-full h-full object-contain scale-110 p-12 drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)]"
                        />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="absolute top-[20%] -left-12 bg-white/90 backdrop-blur-xl p-6 rounded-[32px] border border-gray-200 shadow-2xl flex flex-col items-center justify-center space-y-2 min-w-[120px]"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-black">↑</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency</p>
                        <p className="text-2xl font-black text-black leading-none">95%</p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
