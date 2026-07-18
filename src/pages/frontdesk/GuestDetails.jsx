import { useState } from "react";
import { PageHeader, StatusBadge } from "../../components/UI";
import { guests } from "../../data/mockData";
import { IconSearch } from "../../components/Icons";

export default function GuestDetails() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(guests[0]);

  const filtered = guests.filter(
    (g) => g.name.toLowerCase().includes(query.toLowerCase()) || g.room.includes(query) || g.phone.includes(query)
  );

  return (
    <div>
      

      <div className="content-grid-2">
        <div className="card">
          <div className="card-header">
            <div className="search-box" style={{ width: "100%" }}>
              <IconSearch />
              <input
                style={{ border: "none", background: "none", outline: "none", width: "100%", fontSize: 13 }}
                placeholder="Search guests..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id} style={{ cursor: "pointer", background: selected?.id === g.id ? "#fafbfd" : "" }} onClick={() => setSelected(g)}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{g.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-400)" }}>Room {g.room} · {g.phone}</div>
                    </td>
                    <td><StatusBadge status={g.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={2}><div className="empty-state">No guests match your search.</div></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-pad">
          {selected ? (
            <>
              <div className="section-title" style={{ fontSize: 17, marginBottom: 14 }}>{selected.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
                <Row label="Phone" value={selected.phone} />
                <Row label="Email" value={selected.email} />
                <Row label="ID Type" value={selected.idType} />
                <Row label="ID Number" value={selected.idNumber} />
                <Row label="Room" value={selected.room} />
                <Row label="Check In" value={selected.checkIn} />
                <Row label="Check Out" value={selected.checkOut} />
                <Row label="Balance" value={`₹${selected.balance.toLocaleString("en-IN")}`} />
                <Row label="Status" value={<StatusBadge status={selected.status} />} />
              </div>
            </>
          ) : (
            <div className="empty-state">Select a guest to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 8 }}>
      <span style={{ color: "var(--text-400)" }}>{label}</span>
      <span style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}
