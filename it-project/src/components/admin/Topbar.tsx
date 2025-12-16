// src/components/admin/Topbar.tsx

import React from 'react';
import { Search, User, Zap } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="flex justify-between items-center bg-[#1e1e1e] p-4 border-b border-[#333] sticky top-0 z-20">
      
      {/* Zoekbalk */}
      <div className="flex items-center bg-[#2c2c2c] rounded-lg p-2 w-full max-w-xl">
        <Search size={20} className="text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Zoek in het systeem..." 
          className="bg-transparent text-white w-full focus:outline-none"
        />
      </div>

      {/* Systeem Status & Gebruikersinfo */}
      <div className="flex items-center space-x-6 flex-shrink-0">
        
        {/* Systeem Status */}
        <div className="flex items-center text-sm text-white">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          <span className="font-medium">Systeem Online</span>
        </div>

        {/* Gebruikersinfo */}
        <div className="flex items-center space-x-3">
          <div className="text-right text-sm">
            <p className="font-semibold text-white">Admin User</p>
            <p className="text-gray-400 text-xs">admin@schedulai.be</p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 bg-[#ff7a2d] rounded-full flex items-center justify-center text-white font-bold">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;