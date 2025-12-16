export default function RevenueChart() {
  return (
    <div className="col-span-2 bg-[#070B14] border border-white/10 rounded-xl p-4">
      <h3 className="text-sm text-white/60 mb-4">Maandelijkse Omzet</h3>

      <div className="flex items-end gap-2 h-40">
        {[30, 40, 35, 50, 45, 60, 70].map((v, i) => (
          <div
            key={i}
            style={{ height: `${v}%` }}
            className="w-6 bg-orange-500 rounded-md"
          />
        ))}
      </div>

      <div className="text-xs text-white/40 mt-4">
        €49 · +€1.247 vs vorige maand
      </div>
    </div>
  );
}
