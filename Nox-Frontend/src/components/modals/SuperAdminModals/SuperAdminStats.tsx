interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface SuperAdminStatsProps {
  stats: StatItem[];
}

export function SuperAdminStats({ stats }: SuperAdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-slate-200 px-6 py-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow hover:border-slate-300"
        >
          <div className="flex-shrink-0 p-2 bg-slate-50 rounded-lg">{stat.icon}</div>
          <div>
            <div className="text-sm font-medium text-slate-600 leading-tight">
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-slate-800">
              {stat.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}