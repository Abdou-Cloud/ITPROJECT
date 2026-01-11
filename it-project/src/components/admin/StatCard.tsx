// src/components/admin/StatCard.tsx

import { User, Users, Calendar, MessageSquare } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  description: string; // <-- Hier wordt de prop gedefinieerd
  // percentageChange verwijderd
  icon: 'user' | 'users' | 'calendar' | 'message';
}

const iconMap = {
  user: User,
  users: Users,
  calendar: Calendar,
  message: MessageSquare,
};

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon }) => {
  const IconComponent = iconMap[icon];
  // isPositive check verwijderd

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
        
        {/* Percentage en ArrowUp sectie is hier verwijderd */}
      </div>
      
      <p className="text-sm text-gray-500">{description}</p> 
      {/* Hier wordt de description gebruikt */}
    </div>
  );
};

export default StatCard;