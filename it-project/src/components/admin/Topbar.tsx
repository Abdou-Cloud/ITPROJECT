"use client";

import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { UserButton, useUser } from "@clerk/nextjs";

interface TopbarProps {
  isDbConnected: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ isDbConnected }) => {
  const { user } = useUser();

  return (
    <header className="flex justify-between items-center bg-[#0b0f1a]/80 backdrop-blur-md p-4 border-b border-white/5 sticky top-0 z-30 px-8">
      
      {/* Linkerkant: Branding/Systeem info */}
      <div className="flex items-center space-x-4">
        <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20">
          <ShieldCheck size={20} className="text-[#ff7a2d]" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight uppercase">Admin Console</h2>
          <p className="text-[10px] text-gray-500 font-medium">SchedulAI</p>
        </div>
      </div>

      {/* Rechterkant: Status & Clerk User */}
      <div className="flex items-center space-x-8">
        
        {/* Systeem Status Badge - NU DYNAMISCH */}
        <div className={`hidden lg:flex items-center space-x-4 px-4 py-2 rounded-xl border shadow-inner transition-all duration-300 ${
          isDbConnected ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/5 border-red-500/10'
        }`}>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">Database</span>
            <span className={`text-[11px] font-bold mt-1 ${isDbConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isDbConnected ? 'OPERATIONAL' : 'OFFLINE'}
            </span>
          </div>
          <div className="relative flex items-center justify-center">
            {isDbConnected ? (
              <>
                <span className="absolute w-3 h-3 rounded-full bg-green-500/20 animate-ping"></span>
                <Activity size={16} className="text-green-500 relative" />
              </>
            ) : (
              <Activity size={16} className="text-red-500 relative opacity-50" />
            )}
          </div>
        </div>

        {/* Gebruikersprofiel Sectie */}
        <div className="flex items-center space-x-4 pl-8 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-100 leading-none">
              {user?.fullName || "Admin User"}
            </p>
          </div>
          
          <div className="flex items-center">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-11 h-11 border-2 border-[#ff7a2d]/40 hover:border-[#ff7a2d] transition-all shadow-lg",
                  userButtonPopoverCard: "bg-[#11161d] border border-gray-800 text-white shadow-2xl",
                  userButtonPopoverActionButtonText: "text-gray-300",
                }
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;