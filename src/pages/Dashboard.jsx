import { PageHeader, StatCard, StatusBadge } from "../components/UI";
import { dashboardStats, revenueTrend, bookings, guests } from "../data/mockData";
import { IconBed, IconDoor, IconCheckIn, IconCheckOut } from "../components/Icons";

export default function Dashboard() {
  const s = dashboardStats;
  const maxVal = Math.max(...revenueTrend.map((d) => d.value));
  const todayArrivalsList = guests.filter((g) => g.checkIn === "2026-07-04");

  return (
    <div>
      <PageHeader title="Good afternoon, Rohit" desc="Here's what's happening at your property today." />

      <div className="stat-grid">
        <StatCard label="Total Rooms" value={s.totalRooms} icon={<IconDoor width={18} height={18} />} iconBg="#e9eefb" iconColor="#3d6fd6" />
        <StatCard label="Occupied Rooms" value={s.occupiedRooms} trend={`${s.occupancyRate}% occupancy`} icon={<IconBed width={18} height={18} />} iconBg="#fbe9e9" iconColor="#cf4444" />
        <StatCard label="Today's Arrivals" value={s.todayArrivals} icon={<IconCheckIn width={18} height={18} />} iconBg="#e7f6ef" iconColor="#2e9e6d" />
        <StatCard label="Today's Departures" value={s.todayDepartures} icon={<IconCheckOut width={18} height={18} />} iconBg="#fbf0de" iconColor="#c47a1f" />
      </div>

      <div className="content-grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="section-title">Revenue — Last 7 Days</div>
              <p style={{ fontSize: 12, color: "var(--text-400)" }}>Today: ₹{s.todayRevenue.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="card-pad">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 160 }}>
              {revenueTrend.map((d) => (
                <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div
                    title={`₹${d.value.toLocaleString("en-IN")}`}
                    style={{
                      width: "100%",
                      maxWidth: 34,
                      height: `${(d.value / maxVal) * 120}px`,
                      borderRadius: "6px 6px 3px 3px",
                      background: d.day === "Sun" ? "linear-gradient(180deg, var(--gold-400), var(--gold-500))" : "var(--navy-700)",
                    }}
                  />
                  <span style={{ fontSize: 11.5, color: "var(--text-400)" }}>{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="section-title">Today's Arrivals</div>
          </div>
          {todayArrivalsList.length === 0 ? (
            <div className="empty-state">No arrivals scheduled for today.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <tbody>
                  {todayArrivalsList.map((g) => (
                    <tr key={g.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{g.name}</div>
                        <div style={{ fontSize: 11.5, color: "var(--text-400)" }}>Room {g.room}</div>
                      </td>
                      <td><StatusBadge status={g.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <div className="section-title">Current Bookings</div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.guest}</td>
                  <td>{b.room}</td>
                  <td>{b.checkIn}</td>
                  <td>{b.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
