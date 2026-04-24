"use client";

import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { SettingsCard } from "../ui/SettingsCard";
import { SectionHeader } from "../ui/SectionHeader";
import { Shield, Key, Smartphone, LogOut, Terminal, Trash2, SmartphoneIcon, Monitor, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { ApiResponse } from "@/lib/types";

export const SecuritySection = () => {
  const { deleteAccount } = useSettingsStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await apiRequest<ApiResponse<any[]>>('/settings/sessions');
    if (res.success && res.data) setSessions(res.data);
  };

  const handleRevokeSession = async (id: string) => {
    await apiRequest(`/settings/sessions/${id}`, { method: 'DELETE' });
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handlePasswordChange = async () => {
     if (passwords.new !== passwords.confirm) {
        alert("Passwords do not match");
        return;
     }
     setIsLoading(true);
     try {
        await apiRequest('/settings/password', {
            method: 'PATCH',
            body: JSON.stringify({
                current_password: passwords.current,
                new_password: passwords.new
            })
        });
        alert("Password updated!");
        setPasswords({ current: "", new: "", confirm: "" });
     } finally {
        setIsLoading(false);
     }
  };

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
       alert("Please type DELETE to confirm");
       return;
    }
    if (confirm("Are you absolutely sure? This cannot be undone.")) {
       await deleteAccount();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader 
        title="Account & Security" 
        subtitle="Manage your credentials, 2FA, and active login sessions across devices." 
      />

      <SettingsCard>
        <div className="flex items-center justify-between mb-8">
           <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
            <Shield size={14} className="text-blue-500" />
            Authentication
          </h4>
        </div>

        <div className="space-y-6">
           <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Password</label>
                    <input 
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Password</label>
                    <input 
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Confirm New</label>
                    <input 
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="w-full px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm outline-none focus:border-blue-500"
                    />
                 </div>
              </div>
              <button 
                onClick={handlePasswordChange}
                disabled={isLoading}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={12} /> : <Key size={12} />}
                Update Password
              </button>
           </div>
        </div>
      </SettingsCard>

      <SettingsCard>
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-8 flex items-center gap-2">
          <Terminal size={14} className="text-blue-500" />
          Active Sessions
        </h4>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="p-5 rounded-2xl border border-slate-50 bg-white hover:border-slate-100 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-500 transition-colors">
                   {session.device.includes('iPhone') ? <SmartphoneIcon size={20} /> : <Monitor size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black text-slate-900 tracking-tight">{session.device} • {session.browser}</p>
                    {session.lastActive === 'Just now' && (
                       <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              <button 
                onClick={() => handleRevokeSession(session.id)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
              </button>
            </div>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard className="border-red-100 bg-red-50/10">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-red-600 mb-4">
               <AlertTriangle size={16} />
               <h4 className="text-xs font-black uppercase tracking-widest">Danger Zone</h4>
            </div>
            <p className="text-sm font-bold text-slate-900 tracking-tight mb-2">Delete Your Account</p>
            <p className="text-xs font-bold text-slate-400 max-w-sm mb-6 leading-relaxed">
              Once you delete your account, all your roadmaps, progress and personal data will be permanently wiped.
            </p>
            
            <div className="space-y-4">
               <input 
                 type="text"
                 placeholder="Type DELETE to confirm"
                 value={confirmText}
                 onChange={(e) => setConfirmText(e.target.value)}
                 className="px-4 py-2 bg-white border border-red-100 rounded-xl text-sm outline-none focus:border-red-500 w-full max-w-xs"
               />
               <button 
                 onClick={handleDelete}
                 className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg flex items-center gap-2"
               >
                  <Trash2 size={14} />
                  Permanently Delete Account
               </button>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
