import "./UI.css";

export function StatusBadge({ status }) {
  const map = {
    available: { cls: "badge-success", label: "Available" },
    occupied: { cls: "badge-danger", label: "Occupied" },
    cleaning: { cls: "badge-warn", label: "Cleaning" },
    maintenance: { cls: "badge-neutral", label: "Maintenance" },
    "checked-in": { cls: "badge-success", label: "Checked In" },
    "checked-out": { cls: "badge-neutral", label: "Checked Out" },
    active: { cls: "badge-success", label: "Active" },
    "on-leave": { cls: "badge-warn", label: "On Leave" },
    paid: { cls: "badge-success", label: "Paid" },
    partial: { cls: "badge-warn", label: "Partial" },
    pending: { cls: "badge-danger", label: "Pending" },
  };
  const item = map[status] || { cls: "badge-neutral", label: status };
  return (
    <span className={`badge ${item.cls}`}>
      <span className="badge-dot" style={{ background: "currentColor" }} />
      {item.label}
    </span>
  );
}

export function PageHeader({ title, desc, action }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {desc && <p className="desc">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, trend, trendDir, icon, iconBg, iconColor }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
        {trend && <span className={`stat-trend ${trendDir === "down" ? "trend-down" : "trend-up"}`}>{trend}</span>}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}
