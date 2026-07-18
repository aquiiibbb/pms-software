import { useState } from "react";
import { PageHeader, StatusBadge } from "../components/UI";
import { rooms } from "../data/mockData";
import "./Rooms.css";

const statusColor = {
  available: "#2e9e6d",
  occupied: "#cf4444",
  cleaning: "#c47a1f",
  maintenance: "#8b93a6",
};

export default function Rooms() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? rooms : rooms.filter((r) => r.status === filter);

  return (
    <div>

      <div className="tabs">
        {["all", "available", "occupied", "cleaning", "maintenance"].map((f) => (
          <button key={f} className={`tab-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All Rooms" : f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="room-grid">
        {filtered.map((r) => (
          <div key={r.no} className="room-tile" style={{ borderTop: `3px solid ${statusColor[r.status]}` }}>
            <div className="room-no">Room {r.no}</div>
            <div className="room-type">{r.type} · Floor {r.floor}</div>
            <StatusBadge status={r.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
