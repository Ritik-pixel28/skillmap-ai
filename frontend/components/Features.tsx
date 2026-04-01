"use client";

import { motion } from "framer-motion";

const features = [
    {
        image: "/images/feature_1_roadmap.png",
        title: "AI Roadmaps",
        description: "Personalized learning paths generated specifically for your career goals.",
        color: "from-blue-100 to-blue-50"
    },
    {
        image: "/images/feature_2_3d_code_1773912773346.png",
        title: "Project Labs",
        description: "Hands-on coding assignments that build real-world experience.",
        color: "from-purple-100 to-purple-50"
    },
    {
        image: "/images/feature_3_3d_chart_1773912926313.png",
        title: "Skill Tracking",
        description: "Monitor your growth with high-fidelity analytics and performance data.",
        color: "from-orange-100 to-orange-50"
    }
];

export default function Features() {
    return (
        <section id="features" className="py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-24 flex flex-col items-center text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-black leading-none tracking-tighter"
                    >
                        Smart Features
                    </motion.h2>
                    <p className="mt-8 text-xl text-gray-500 font-bold max-w-xl">
                        SkillMap AI uses advanced algorithms to accelerate your professional growth.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 100 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, type: "spring", stiffness: 40 }}
                            className={`relative p-12 bg-gradient-to-b ${feature.color} rounded-[60px] flex flex-col items-center overflow-hidden border border-gray-100 shadow-sm`}
                        >
                            <div className="h-64 flex items-center justify-center mb-12">
                                <motion.img
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                                    src={feature.image}
                                    alt={feature.title}
                                    className="h-full object-contain filter drop-shadow-2xl"
                                />
                            </div>

                            <div className="text-center">
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter uppercase">{feature.title}</h3>
                                <p className="text-xs font-black text-gray-600 uppercase leading-relaxed max-w-[200px] mx-auto">
                                    Tailored to your <br /> growth path
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
