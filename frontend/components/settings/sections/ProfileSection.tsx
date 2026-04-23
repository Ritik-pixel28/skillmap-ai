"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useProfileStore } from "@/lib/store/useProfileStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { User as UserIcon, MapPin, Globe, Briefcase, Camera as CameraIcon } from "lucide-react";
import Image from "next/image";

export const ProfileSection = () => {
  const { 
    name, username, bio, avatar, role, location, website, timezone,
    setAvatar, setName, setUsername, setBio, updateProfile,
    setRole, setLocation, setTimezone, setWebsite
  } = useProfileStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    await updateProfile({
      name, username, bio, avatar, role, location, website, timezone
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatar(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Profile Settings" 
        subtitle="Manage your public identity and how others see you on SkillMap AI." 
      />

      <SettingsCard>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden relative flex items-center justify-center">
              {avatar ? (
                <Image src={avatar} alt={name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <UserIcon size={48} />
                </div>
              )}
            </div>
            <motion.button 
              type="button"
              onClick={handleAvatarClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-1 right-1 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer z-10"
            >
              <CameraIcon size={18} />
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 font-black text-sm">@</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Bio</label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 160))}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-end">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{bio.length}/160</span>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingsCard>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
            <Briefcase size={14} className="text-blue-500" />
            Professional
          </h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Current Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all appearance-none"
              >
                <option>Student</option>
                <option>Developer</option>
                <option>Designer</option>
                <option>Product Manager</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Timezone</label>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all appearance-none"
              >
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (London)</option>
                <option>UTC+1 (Paris)</option>
                <option>UTC+5:30 (India)</option>
              </select>
            </div>
          </div>
        </SettingsCard>

        <SettingsCard>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-2">
            <MapPin size={14} className="text-blue-500" />
            Social & Location
          </h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Location</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                placeholder="City, Country"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Website / Portfolio</label>
              <div className="relative">
                <Globe className="absolute left-4 top-3.5 text-slate-300" size={16} />
                <input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500 transition-all"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>
        </SettingsCard>
      </div>
      <div className="flex justify-end mt-4">
        <button 
          onClick={handleSave}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
        >
          Save Profile Changes
        </button>
      </div>
    </div>
  );
};
