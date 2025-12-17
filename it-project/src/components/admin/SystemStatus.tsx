const systems = [
  { name: "Database", status: "Operational", ok: true },
  { name: "AI LLM (OpenAI)", status: "Operational", ok: true },
  { name: "Email Service", status: "Operational", ok: true },
  { name: "Voice API", status: "Operational", ok: true },
  { name: "Calendar Sync", status: "Degraded", ok: false },
];

export default function SystemStatus() {
  return (
    <div className="bg-[#070B14] border border-white/10 rounded-xl p-4">
      <h3 className="text-sm text-white/60 mb-4">Systeem Status</h3>

      <ul className="space-y-2">
        {systems.map(s => (
          <li
            key={s.name}
            className="flex justify-between text-sm"
          >
            <span>{s.name}</span>
            <span className={s.ok ? "text-green-400" : "text-yellow-400"}>
              {s.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
