// src/components/admin/Sidebar.tsx
import Link from "next/link";

const menu = [
  { label: "Dashboard", href: "/admin" },
  { label: "Professionals", href: "/admin/professionals" },
  { label: "Klanten", href: "/admin/klanten" },
  { label: "Afspraken", href: "/admin/afspraken" },
  { label: "AI Management", href: "/admin/ai" },
  { label: "Betalingen", href: "/admin/betalingen" },
  { label: "Instellingen", href: "/admin/instellingen" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#070B14] border-r border-white/10 p-4">
      <h1 className="text-xl font-bold mb-8">SchedulAI</h1>

      <nav className="space-y-2">
        {menu.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-4 py-2 text-sm text-white/80 hover:bg-orange-500 hover:text-white transition"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
