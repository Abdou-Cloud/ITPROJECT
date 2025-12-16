type Props = {
  title: string;
  value: string | number;
  delta?: string;
};

export default function StatCard({ title, value, delta }: Props) {
  return (
    <div className="bg-[#070B14] border border-white/10 rounded-xl p-4">
      <div className="text-sm text-white/60">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {delta && (
        <div className="text-green-400 text-xs mt-1">{delta}</div>
      )}
    </div>
  );
}
