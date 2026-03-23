"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTA() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 rounded-[50px] p-12 md:p-24 text-center relative"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <div className="w-32 h-32 border-4 border-black rounded-full" />
                    </div>

                    <h2 className="text-4xl md:text-6xl font-extrabold text-black mb-8">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
                        Join thousands of learners who have transformed their careers with SkillMap AI.
                        No credit card required.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-black text-white px-10 py-5 rounded-2xl font-bold flex items-center justify-center space-x-2 mx-auto shadow-[0_20px_40px_rgba(0,0,0,0.1)] group"
                    >
                        <span>Create Your Free Roadmap</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>

                    <p className="mt-8 text-sm text-gray-400 font-medium tracking-wide">
                        Start learning in 5 minutes
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
