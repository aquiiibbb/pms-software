import { useState } from "react";
import { PageHeader } from "../components/UI";
import { roomTypes as initialTypes } from "../data/mockData";
import { IconPlus } from "../components/Icons";

export default function RoomType() {
  const [types, setTypes] = useState(initialTypes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", occupancy: "", totalRooms: "", amenities: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setTypes([
      ...types,
      {
        id: `rt${types.length + 1}`,
        name: form.name,
        price: Number(form.price),
        occupancy: Number(form.occupancy) || 1,
        totalRooms: Number(form.totalRooms) || 0,
        amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      },
    ]);
    setForm({ name: "", price: "", occupancy: "", totalRooms: "", amenities: "" });
    setShowForm(false);
  };

  return (
    <div>
      <PageHeader
        title=""
        desc=""
        action={
          <button className="btn btn-gold" onClick={() => setShowForm((v) => !v)}>
            <IconPlus /> Add Room Type
          </button>
        }
      />

      {showForm && (
        <form className="card card-pad" style={{ marginBottom: 18 }} onSubmit={handleAdd}>
          <div className="form-grid">
            <div className="form-field">
              <label>Type Name</label>
              <input placeholder="e.g. Deluxe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Price / Night (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Max Occupancy</label>
              <input type="number" value={form.occupancy} onChange={(e) => setForm({ ...form, occupancy: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Total Rooms in Category</label>
              <input type="number" value={form.totalRooms} onChange={(e) => setForm({ ...form, totalRooms: e.target.value })} />
            </div>
            <div className="form-field full">
              <label>Amenities (comma separated)</label>
              <input placeholder="AC, TV, WiFi" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Add Type</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Price / Night</th>
                <th>Max Occupancy</th>
                <th>Total Rooms</th>
                <th>Amenities</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.name}</td>
                  <td>₹{t.price.toLocaleString("en-IN")}</td>
                  <td>{t.occupancy} guests</td>
                  <td>{t.totalRooms} rooms</td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {t.amenities.map((a) => (
                        <span key={a} className="badge badge-neutral">{a}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
