export default function StatCard({ label, value, icon, color, sub }) {
  const colors = {
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-100",
    green:  "bg-green-50  text-green-700  border-green-100",
    pink:   "bg-pink-50   text-pink-700   border-pink-100",
    blue:   "bg-blue-50   text-blue-700   border-blue-100",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colors[color] || colors.purple}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-black mb-1">{value}</p>
      <p className="text-sm font-semibold opacity-80">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
    </div>
  );
}