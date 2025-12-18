'use client'; 

import React from 'react';
import Link from 'next/link'; 
import { usePathname } from 'next/navigation';
import { SignOutButton } from "@clerk/nextjs"; // Importeer Clerk SignOut
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Calendar, 
  Brain, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';

// Menu-items - De 'isActive' prop is hier verwijderd, deze wordt dynamisch bepaald.
const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Professionals', href: '/admin/professionals', icon: Users },
  { name: 'Klanten', href: '/admin/klanten', icon: User },
  { name: 'Afspraken', href: '/admin/afspraken', icon: Calendar },
  { name: 'AI Management', href: '/admin/ai', icon: Brain },
  { name: 'Betalingen', href: '/admin/betalingen', icon: CreditCard },
];

// Component voor één navigatielink
interface NavLinkProps {
    name: string;
    href: string;
    Icon: React.ElementType;
    isActive: boolean; // Wordt nu als prop doorgegeven
}

const NavLink: React.FC<NavLinkProps> = ({ name, href, Icon, isActive }) => {
  const activeClasses = isActive 
    ? "bg-[#ff7a2d] text-white" 
    : "text-gray-400 hover:bg-[#2c2c2c] hover:text-white";

  return (
    <Link 
      href={href} 
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeClasses}`}
    >
      <Icon size={20} className="mr-4" />
      <span className="text-sm font-medium">{name}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const pathname = usePathname(); // 🚨 Dit leest de huidige URL (/admin of /admin/professionals)
  const activeItem = pathname;

  return (
    <aside className="w-64 bg-[#1e1e1e] h-screen flex flex-col fixed top-0 left-0 z-10 shadow-xl">
      
      {/* 1. Header & Logo */}
      <div className="p-5 border-b border-[#333] flex items-center">
        <h1 className="text-xl font-bold text-white">SchedulAI</h1>
        <span className="ml-2 text-sm text-gray-500">Admin Panel</span>
      </div>

      {/* 2. Navigatie Links */}
      <nav className="p-5 space-y-2 flex-grow">
        {menuItems.map((item) => {
          // Logica om te bepalen of een link actief is:
          // De link is actief als de huidige 'pathname' exact overeenkomt met de 'href'.
          // Voor '/admin' (het dashboard) doen we een exacte match.
          // Voor andere routes (zoals /admin/professionals) gebruiken we includes() voor nested routes.
          const isLinkActive = item.href === pathname || 
                               (item.href !== '/admin' && pathname.startsWith(item.href));
                               
          return (
            <NavLink 
              key={item.name}
              name={item.name}
              href={item.href}
              Icon={item.icon}
              isActive={isLinkActive} 
            />
          );
        })}
      </nav>

      {/* 3. Footer Links (Instellingen en Uitloggen) */}
      <div className="p-5 space-y-2 border-t border-[#333] mt-auto">
        {/* Instellingen link */}
        <NavLink 
          name="Instellingen"
          href="/admin/instellingen"
          Icon={Settings}
          // Controleer of de huidige route begint met /admin/instellingen
          isActive={pathname.startsWith('/admin/instellingen')}
        />
        {/* Werkende Uitloggen knop via Clerk */}
        <SignOutButton redirectUrl="/">
          <button className="flex items-center w-full p-3 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-[#2c2c2c] hover:text-white group">
            <LogOut size={20} className="mr-4 text-gray-400 group-hover:text-white" />
            <span className="text-sm font-medium">Uitloggen</span>
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
};

export default Sidebar;