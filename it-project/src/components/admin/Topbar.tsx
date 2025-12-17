"use client";

import React from 'react';
import { Search } from 'lucide-react';
import { UserButton, useUser } from "@clerk/nextjs";

const Topbar: React.FC = () => {
  const { user } = useUser();

  return (
    <header className="flex justify-between items-center bg-[#0b0e14] p-4 border-b border-gray-800 sticky top-0 z-20">
      
      {/* Zoekbalk */}
      <div className="flex items-center bg-[#11161d] border border-gray-800 rounded-lg px-3 py-2 w-full max-w-xl transition-focus-within focus-within:border-orange-500/50">
        <Search size={18} className="text-gray-500 mr-3" />
        <input 
          type="text" 
          placeholder="Zoek in het systeem..." 
          className="bg-transparent text-sm text-white w-full focus:outline-none placeholder:text-gray-600"
        />
      </div>

      {/* Rechterkant: Status & Clerk User */}
      <div className="flex items-center space-x-6 flex-shrink-0">
        
        {/* Systeem Status Badge */}
        <div className="hidden md:flex items-center bg-green-500/5 border border-green-500/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
          <span className="text-[11px] font-medium text-green-500 uppercase tracking-wider">Systeem Online</span>
        </div>

        {/* Gebruikersinfo & Clerk Button */}
        <div className="flex items-center space-x-4 pl-6 border-l border-gray-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-white">
              {user?.fullName || "Admin User"}
            </p>
            <p className="text-[10px] text-gray-500 font-mono">
              {user?.primaryEmailAddress?.emailAddress || "admin@schedulai.be"}
            </p>
          </div>
          
          {/* De Clerk UserButton vervangt de statische "AD" div */}
          <div className="flex items-center justify-center">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 border border-orange-500/30 hover:scale-105 transition-transform",
                  userButtonPopoverCard: "bg-[#11161d] border border-gray-800 text-white",
                  userButtonPopoverActionButtonText: "text-gray-300",
                  userButtonPopoverFooter: "hidden" // Verbergt de "Secured by Clerk" als je dat wilt
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