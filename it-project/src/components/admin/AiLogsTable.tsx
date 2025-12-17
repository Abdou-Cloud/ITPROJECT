"use client";

import React from 'react';
import { Eye } from 'lucide-react';

const logs = [
  { id: 1, date: "2024-12-04 14:23", name: "Sarah Bakker", target: "Dental Clinic Amsterdam", duration: "2:34", tokens: "1247", status: "Afspraak" },
  { id: 2, date: "2024-12-04 13:45", name: "Tom Peters", target: "Tandarts De Vries", duration: "1:52", tokens: "892", status: "Afspraak" },
  { id: 3, date: "2024-12-04 12:30", name: "Anna de Jong", target: "Rotterdam Dental Care", duration: "0:45", tokens: "421", status: "Info" },
  { id: 4, date: "2024-12-04 11:15", name: "Unknown", target: "Dental Clinic Amsterdam", duration: "0:22", tokens: "156", status: "Mislukt" },
];

const AiLogsTable = () => {
  return (
    <div className="space-y-2">
      {logs.map((log) => (
        <div 
          key={log.id} 
          className="flex items-center justify-between p-3 px-6 bg-transparent border border-gray-800/40 rounded-lg hover:bg-[#161b22]/40 transition-colors group"
        >
          {/* Linker kant: Datum en Naam */}
          <div className="flex items-center gap-12 flex-1">
            <span className="text-[12px] text-gray-500 font-mono w-32">{log.date}</span>
            <span className="text-[14px] font-medium text-gray-300 w-40">{log.name}</span>
            <span className="text-[12px] text-gray-500 italic">
               → {log.target}
            </span>
          </div>

          {/* Rechter kant: Stats en Status */}
          <div className="flex items-center gap-8">
            <span className="text-[12px] text-gray-500">{log.duration}</span>
            <span className="text-[12px] text-gray-500 w-20">{log.tokens} tokens</span>
            
            <span className={`
              text-[10px] px-3 py-1 rounded font-bold border uppercase tracking-tighter w-20 text-center
              ${log.status === 'Afspraak' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                log.status === 'Info' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                'bg-red-500/10 text-red-500 border-red-500/20'}
            `}>
              {log.status}
            </span>

            <button className="text-gray-600 hover:text-white transition-colors">
              <Eye size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AiLogsTable;