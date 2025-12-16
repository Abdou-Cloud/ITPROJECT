// src/components/admin/StatCard.tsx

import { ArrowUp, User, Users, Calendar, MessageSquare } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  description: string; // <-- Hier wordt de prop gedefinieerd
  percentageChange: number; 
  icon: 'user' | 'users' | 'calendar' | 'message';
}

const iconMap = {
  user: User,
  users: Users,
  calendar: Calendar,
  message: MessageSquare,
};

const StatCard: React.FC<StatCardProps> = ({ title, value, description, percentageChange, icon }) => {
  const IconComponent = iconMap[icon];
  const isPositive = percentageChange >= 0;

  return (
    <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-[#333]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
        <div className="p-2 rounded-full bg-[#ff7a2d] text-white">
          <IconComponent size={20} />
        </div>
      </div>
      
      <div className="flex items-center mb-1">
        <span className="text-3xl font-bold text-white mr-3">{value}</span>
        
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <ArrowUp size={16} className={`mr-1 transform ${isPositive ? 'rotate-0' : 'rotate-180'}`} />
          {Math.abs(percentageChange)} %
        </div>
      </div>
      
      <p className="text-sm text-gray-500">{description}</p> 
      {/* Hier wordt de description gebruikt */}
    </div>
  );
};

export default StatCard;