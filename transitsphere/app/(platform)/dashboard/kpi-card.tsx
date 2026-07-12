// src/components/dashboard/kpi-card.tsx

type KpiCardProps = {
  label: string;
  value: string | number;
  icon?: string;
  trend?: string;
  trendUp?: boolean;
};

export function KpiCard({ label, value, icon, trend, trendUp }: KpiCardProps) {
  return (
    <div className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="mt-1.5 flex items-center gap-1">
              <span
                className={`text-xs font-medium ${
                  trendUp ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {trend}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-80 transition-opacity group-hover:opacity-100">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}