"use client";

import { motion } from "framer-motion";

const steps = [
    {
        number: "1",
        title: "Define Your Goal",
        description: "Tell us the tech role or skill you want to master."
    },
    {
        number: "2",
        title: "AI Generates Roadmap",
        description: "Get a personalized weekly path with curated resources."
    },
    {
        number: "3",
        title: "Complete Assignments",
        description: "Build a portfolio with hands-on, real-world projects."
    }
];

export default function HowItWorks() {
    return (
        <section className="py-40 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-10">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-6xl md:text-8xl font-black text-black leading-[0.85] tracking-tighter max-w-2xl"
                    >
                        How it <br /> <span className="text-blue-600">Works</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-xl text-gray-500 font-bold uppercase tracking-widest max-w-xs text-right"
                    >
                        Transform your <br /> career in 3 steps
                    </motion.p>
                </div>

                <div className="relative flex flex-col md:flex-row gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, type: "spring", stiffness: 60 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex-1 p-12 bg-gray-50 rounded-[60px] relative group hover:bg-black transition-colors duration-500 border border-gray-100"
                        >
                            <div className="text-[120px] font-black text-black/10 absolute top-0 right-10 group-hover:text-white/10 transition-colors">
                                {step.number}
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center text-2xl font-black text-black group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-colors shadow-sm">
                                    {step.number}
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 group-hover:text-white transition-colors tracking-tighter">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 font-bold group-hover:text-white/70 transition-colors leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
