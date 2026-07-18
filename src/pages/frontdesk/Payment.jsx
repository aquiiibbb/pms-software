import { useState } from "react";
import { PageHeader, StatusBadge } from "../../components/UI";
import { payments } from "../../data/mockData";
import { IconPlus } from "../../components/Icons";

export default function Payment() {
  const [showForm, setShowForm] = useState(false);
  const total = payments.reduce((sum, p) => sum + p.amount, 0);
  const pending = payments.filter((p) => p.status !== "paid").length;

  return (
    <div>
      <PageHeader
       
        action={<button className="btn btn-gold" onClick={() => setShowForm((v) => !v)}><IconPlus /> Record Payment</button>}
      />

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card"><div className="stat-value">₹{total.toLocaleString("en-IN")}</div><div className="stat-label">Total Collected</div></div>
        <div className="stat-card"><div className="stat-value">{payments.length}</div><div className="stat-label">Transactions</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: "var(--warn)" }}>{pending}</div><div className="stat-label">Pending / Partial</div></div>
      </div>

      {showForm && (
        <form className="card card-pad" style={{ marginBottom: 18 }} onSubmit={(e) => { e.preventDefault(); setShowForm(false); }}>
          <div className="form-grid">
            <div className="form-field">
              <label>Guest Name</label>
              <input placeholder="Guest name" />
            </div>
            <div className="form-field">
              <label>Room</label>
              <input placeholder="Room no." />
            </div>
            <div className="form-field">
              <label>Amount (₹)</label>
              <input type="number" placeholder="0" />
            </div>
            <div className="form-field">
              <label>Payment Mode</label>
              <select defaultValue="cash">
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Save Payment</button>
            <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.guest}</td>
                  <td>{p.room}</td>
                  <td>₹{p.amount.toLocaleString("en-IN")}</td>
                  <td>{p.mode}</td>
                  <td>{p.date}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
