"use client";

import { useProfileStore } from '@/lib/store/useProfileStore';
import { motion } from 'framer-motion';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

export function UserAvatar({ 
  size = 'md', 
  showBadge = false, 
  className = '' 
}: UserAvatarProps) {
  const { avatar, name } = useProfileStore();

  return (
    <div className={`relative shrink-0 ${sizeMap[size].split(' ')[0]} ${sizeMap[size].split(' ')[1]} ${className}`}>
      <div className={`w-full h-full rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center`}>
        {avatar ? (
          <img 
            src={avatar} 
            alt={name || 'User'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-black">
            {name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
        )}
      </div>

      {showBadge && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" 
        />
      )}
    </div>
  );
}
