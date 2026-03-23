import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#0c0c0e] text-white pt-40 pb-16 rounded-t-[100px] mt-[-50px] relative z-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-12 gap-16 mb-32">
                    <div className="lg:col-span-6 space-y-12">
                        <h2 className="text-5xl font-black tracking-tighter">SkillMap AI</h2>
                        <p className="text-6xl md:text-7xl font-black leading-[0.9] tracking-tighter">
                            Level up <br /> your <span className="opacity-30">career</span>
                        </p>
                        <button className="bg-white text-black px-12 py-5 rounded-full text-lg font-black hover:scale-105 transition-transform shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                            Get started
                        </button>
                    </div>

                    <div className="lg:col-span-2 space-y-10">
                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-600">Platform</h4>
                        <ul className="space-y-6 text-sm font-bold opacity-60">
                            <li><Link href="#" className="hover:opacity-100">AI Roadmaps</Link></li>
                            <li><Link href="#" className="hover:opacity-100">Project Labs</Link></li>
                            <li><Link href="#" className="hover:opacity-100">Progress Tracker</Link></li>
                            <li><Link href="#" className="hover:opacity-100">Career Mentorship</Link></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-4 space-y-10">
                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-600">Resources</h4>
                        <div className="space-y-8">
                            <div className="flex items-center space-x-6 group cursor-pointer">
                                <div className="w-20 h-20 bg-blue-600 rounded-[24px] flex-shrink-0 group-hover:rotate-6 transition-transform overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                                </div>
                                <p className="text-sm font-black leading-snug group-hover:text-blue-400 transition-colors">How AI is changing <br /> the tech hiring landscape</p>
                            </div>
                            <div className="flex items-center space-x-6 group cursor-pointer">
                                <div className="w-20 h-20 bg-orange-600 rounded-[24px] flex-shrink-0 group-hover:-rotate-6 transition-transform overflow-hidden">
                                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                                </div>
                                <p className="text-sm font-black leading-snug group-hover:text-orange-400 transition-colors">Building a world-class <br /> portfolio as an engineer</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5">
                    <p className="text-[10px] font-bold text-gray-700 tracking-[0.2em] uppercase">Copyright © SkillMap AI. All rights reserved</p>
                    <div className="flex space-x-4 mt-8 md:mt-0">
                        {[Facebook, Twitter, Instagram].map((Icon, i) => (
                            <div key={i} className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-all cursor-pointer">
                                <Icon className="w-4 h-4" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
