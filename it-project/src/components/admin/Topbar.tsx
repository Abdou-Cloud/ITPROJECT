"use client";

export default function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-[#0B0F1A]">
      <input
        type="text"
        placeholder="Zoek in het systeem..."
        className="bg-[#070B14] text-sm px-4 py-2 rounded-lg w-96 outline-none"
      />

      <div className="flex items-center gap-4">
        <span className="text-green-400 text-sm">● System Online</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold">
            AD
          </div>
          <div className="text-sm">
            <div>Admin User</div>
            <div className="text-white/50 text-xs">admin@schedulai.nl</div>
          </div>
        </div>
      </div>
    </header>
  );
}
