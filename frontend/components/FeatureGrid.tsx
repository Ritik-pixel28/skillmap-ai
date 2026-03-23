"use client";

import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";

export default function FeatureGrid() {
    return (
        <section className="py-32 bg-white flex flex-col items-center">
            <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.h2
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="text-6xl md:text-8xl font-black text-black leading-none tracking-tighter"
                    >
                        Build Real. <br />
                        <span className="text-blue-600">Learn Fast.</span>
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="bg-blue-50 rounded-[60px] p-12 flex flex-col items-center justify-between min-h-[500px] group overflow-hidden"
                    >
                        <motion.div
                            whileHover={{ rotate: 5, scale: 1.1 }}
                            className="relative h-64"
                        >
                            <div className="absolute inset-0 bg-blue-400 opacity-20 blur-3xl" />
                            <img
                                src="/images/hero_3d_career_objects_1773912663468.png"
                                alt="AI Learning"
                                className="h-full object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                        <div className="text-center mt-8">
                            <h3 className="text-2xl font-black mb-6">Interactive Roadmaps</h3>
                            <p className="text-gray-500 font-bold max-w-[200px] mx-auto mb-8 uppercase text-[10px]">Step by step guidance for every skill</p>
                            <button className="bg-white px-10 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-transform">
                                Explore Paths
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100 }}
                        className="bg-[#18181b] rounded-[60px] p-12 flex flex-col items-center justify-between min-h-[500px] group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-50" />
                        <motion.div
                            whileHover={{ rotate: -5, scale: 1.1 }}
                            className="relative h-64 z-10"
                        >
                            <div className="absolute inset-0 bg-purple-500 opacity-40 blur-3xl" />
                            <img
                                src="/images/feature_1_3d_brain_1773912715228.png"
                                alt="AI Progress"
                                className="h-full object-contain brightness-125 saturate-150 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                            />
                        </motion.div>
                        <div className="text-center mt-8 z-10">
                            <h3 className="text-2xl font-black text-white mb-6">AI Evaluation</h3>
                            <p className="text-gray-400 font-bold max-w-[200px] mx-auto mb-8 uppercase text-[10px]">Automated assessment of your work</p>
                            <button className="bg-white px-10 py-4 rounded-full font-black shadow-xl hover:scale-105 transition-transform">
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
