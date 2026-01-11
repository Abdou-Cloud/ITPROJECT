interface SystemItem {
  name: string;
  status: string;
  ok: boolean;
}

interface SystemStatusProps {
  systems: SystemItem[];
}

export default function SystemStatus({ systems }: SystemStatusProps) {
  return (
    <div className="bg-[#070B14] border border-white/10 rounded-xl p-4">
      <h3 className="text-sm text-white/60 mb-4">Systeem Status</h3>

      <ul className="space-y-2">
        {systems.map(s => (
          <li
            key={s.name}
            className="flex justify-between text-sm"
          >
            <span className="text-gray-400">{s.name}</span>
            <span className={s.ok ? "text-green-400" : "text-red-500 font-medium"}>
              {s.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}