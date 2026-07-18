import { useState } from "react";
import { PageHeader, StatusBadge } from "../../components/UI";
import { rooms, roomTypes } from "../../data/mockData";

export default function RoomAvailability() {
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = typeFilter === "all" ? rooms : rooms.filter((r) => r.type === typeFilter);
  const counts = {
    available: rooms.filter((r) => r.status === "available").length,
    occupied: rooms.filter((r) => r.status === "occupied").length,
    cleaning: rooms.filter((r) => r.status === "cleaning").length,
    maintenance: rooms.filter((r) => r.status === "maintenance").length,
  };

  return (
    <div>
      

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--success)" }}>{counts.available}</div><div className="stat-label">Available</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--danger)" }}>{counts.occupied}</div><div className="stat-label">Occupied</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--warn)" }}>{counts.cleaning}</div><div className="stat-label">Cleaning</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--text-400)" }}>{counts.maintenance}</div><div className="stat-label">Maintenance</div></div>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${typeFilter === "all" ? "active" : ""}`} onClick={() => setTypeFilter("all")}>All Types</button>
        {roomTypes.map((t) => (
          <button key={t.id} className={`tab-btn ${typeFilter === t.name ? "active" : ""}`} onClick={() => setTypeFilter(t.name)}>{t.name}</button>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.no}>
                  <td style={{ fontWeight: 600 }}>{r.no}</td>
                  <td>{r.type}</td>
                  <td>{r.floor}</td>
                  <td><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
