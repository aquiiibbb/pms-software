import { useMemo, useState } from "react";
import "./wailking.css";
import { rooms, roomTypes, bookings as mockBookings } from "../../data/mockData";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addOneDay(iso) {
  const d = new Date(iso);
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 1;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 1;
}

const GUEST_COLORS = ["#3D6FD6", "#2E9E6D", "#C47A1F", "#8A4FD6", "#CF4444"];

function buildInitialState(initialRoomNo, initialDate, initialBooking) {
  if (initialBooking) {
    const bookedRoom = rooms.find((r) => r.no === initialBooking.room);
    return {
      fullName: initialBooking.guest || "",
      phoneNumber: initialBooking.phone || "",
      email: initialBooking.email || "",
      nationality: initialBooking.nationality || "India",
      idProofType: initialBooking.idType || "Aadhaar Card",
      idProofNumber: initialBooking.idNumber || "",
      address: initialBooking.address || "",
      checkInDate: initialBooking.checkIn || todayISO(),
      checkInTime: initialBooking.checkInTime || "14:00",
      checkOutDate: initialBooking.checkOut || addOneDay(initialBooking.checkIn || todayISO()),
      checkOutTime: initialBooking.checkOutTime || "11:00",
      adults: String(initialBooking.adults ?? 2),
      children: String(initialBooking.children ?? 0),
      roomType: initialBooking.roomType || bookedRoom?.type || (roomTypes[0]?.name || ""),
      roomNumber: initialBooking.room || "",
      paymentMethod: initialBooking.paymentMethod || "Cash",
      advanceAmount: initialBooking.advanceAmount != null ? String(initialBooking.advanceAmount) : "",
      taxPercent: initialBooking.taxPercent != null ? String(initialBooking.taxPercent) : "12",
      extraCharges: initialBooking.extraCharges != null ? String(initialBooking.extraCharges) : "0",
      notes: initialBooking.notes || "",
    };
  }
  const presetRoom = initialRoomNo ? rooms.find((r) => r.no === initialRoomNo) : null;
  const checkIn = initialDate || todayISO();
  return {
    fullName: "",
    phoneNumber: "",
    email: "",
    nationality: "India",
    idProofType: "Aadhaar Card",
    idProofNumber: "",
    address: "",
    checkInDate: checkIn,
    checkInTime: "14:00",
    checkOutDate: addOneDay(checkIn),
    checkOutTime: "11:00",
    adults: "2",
    children: "0",
    roomType: presetRoom ? presetRoom.type : (roomTypes[0]?.name || ""),
    roomNumber: presetRoom ? presetRoom.no : "",
    paymentMethod: "Cash",
    advanceAmount: "",
    taxPercent: "12",
    extraCharges: "0",
    notes: "",
  };
}

/**
 * WalkinGuest booking form.
 *
 * Works two ways:
 *  - Standalone page (Front Desk > Walk-in Guest route): no props needed.
 *  - Embedded inside a popup (Calendar cell click): pass initialRoomNo, initialDate,
 *    existingBookings (so it can block overlapping dates), onSubmit(bookingRecord) and onCancel().
 */
export default function WalkinGuest({
  embedded = false,
  initialRoomNo = "",
  initialDate = "",
  initialBooking = null,
  existingBookings = mockBookings,
  onSubmit,
  onCancel,
}) {
  const isEditing = Boolean(initialBooking);
  const [formData, setFormData] = useState(() => buildInitialState(initialRoomNo, initialDate, initialBooking));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Reset room number if the room type changes and the current room no longer matches.
      if (name === "roomType") {
        const stillValid = rooms.some((r) => r.no === prev.roomNumber && r.type === value);
        if (!stillValid) next.roomNumber = "";
      }
      // Keep check-out at least one day after check-in.
      if (name === "checkInDate") {
        const inD = new Date(value);
        const outD = new Date(next.checkOutDate);
        if (!next.checkOutDate || outD <= inD) {
          next.checkOutDate = addOneDay(value);
        }
      }
      return next;
    });
  };

  const handleReset = () => {
    setFormData(buildInitialState(initialRoomNo, initialDate, initialBooking));
    setError("");
    setSuccess("");
  };

  const roomsOfType = useMemo(
    () => rooms.filter((r) => r.type === formData.roomType),
    [formData.roomType]
  );

  const selectedRoomType = useMemo(
    () => roomTypes.find((t) => t.name === formData.roomType),
    [formData.roomType]
  );

  const ratePerNight = selectedRoomType?.price || 0;
  const nights = nightsBetween(formData.checkInDate, formData.checkOutDate);
  const subtotal = ratePerNight * nights;
  const taxPercentValue = Number(formData.taxPercent) || 0;
  const taxAmount = Math.round((subtotal * taxPercentValue) / 100);
  const extraChargesValue = Number(formData.extraCharges) || 0;
  const totalAmount = subtotal + taxAmount + extraChargesValue;
  const advanceValue = Number(formData.advanceAmount) || 0;
  const balanceDue = Math.max(totalAmount - advanceValue, 0);
  const paymentStatus = advanceValue <= 0 ? "Pending" : advanceValue >= totalAmount ? "Paid" : "Partial";

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.fullName.trim()) return setError("Guest name is required.");
    if (!formData.phoneNumber.trim()) return setError("Phone number is required.");
    if (!formData.idProofNumber.trim()) return setError("ID proof number is required.");
    if (!formData.roomNumber) return setError("Please select a room.");
    if (formData.checkOutDate <= formData.checkInDate) {
      return setError("Check-out date must be after check-in date.");
    }

    // Same-day turnover is allowed: a new stay that starts exactly on another
    // booking's checkout date does not conflict (room is free from checkout time
    // onward), so the check-in side of the range check is strictly-less-than.
    const conflict = existingBookings.some(
      (b) =>
        b.room === formData.roomNumber &&
        b.id !== initialBooking?.id &&
        formData.checkInDate < b.checkOut &&
        formData.checkOutDate > b.checkIn
    );
    if (conflict) {
      return setError(`Room ${formData.roomNumber} is already booked for an overlapping date range.`);
    }

    const bookingRecord = {
      id: initialBooking?.id || `walkin-${Date.now()}`,
      guest: formData.fullName.trim(),
      phone: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      idType: formData.idProofType,
      idNumber: formData.idProofNumber.trim(),
      address: formData.address.trim(),
      room: formData.roomNumber,
      roomType: formData.roomType,
      checkIn: formData.checkInDate,
      checkInTime: formData.checkInTime,
      checkOut: formData.checkOutDate,
      checkOutTime: formData.checkOutTime,
      adults: Number(formData.adults),
      children: Number(formData.children),
      ratePerNight,
      nights,
      subtotal,
      taxPercent: taxPercentValue,
      taxAmount,
      extraCharges: extraChargesValue,
      totalAmount,
      advanceAmount: advanceValue,
      balanceDue,
      paymentMethod: formData.paymentMethod,
      paymentStatus,
      notes: formData.notes.trim(),
      color: initialBooking?.color || GUEST_COLORS[Math.floor(Math.random() * GUEST_COLORS.length)],
      source: initialBooking?.source || "Walk-in",
    };

    if (onSubmit) {
      onSubmit(bookingRecord);
      return;
    }

    // Standalone page fallback: just confirm on screen and reset the form.
    setSuccess(
      isEditing
        ? `Booking updated for ${bookingRecord.guest} in Room ${bookingRecord.room}.`
        : `Booking confirmed for ${bookingRecord.guest} in Room ${bookingRecord.room}.`
    );
    if (!isEditing) setFormData(buildInitialState());
  };

  return (
    <div className={embedded ? "walkin-container walkin-embedded" : "walkin-container"}>
      {!embedded && (
        <header className="walkin-header">
          <div className="logo-section">
            <div className="key-logo">
              <span className="key-icon">🔑</span>
              <span className="brand-inn">Inn</span>
              <span className="brand-out">Out</span>
            </div>
          </div>
          <div className="header-title">
            <div className="title-top">
              <span className="walk-icon">🚶</span>
              <h1>{isEditing ? "Edit Guest Booking" : "Walk In Form"}</h1>
            </div>
            <p className="subtitle">{isEditing ? "Update this guest's stay details" : "Quick check-in for walk-in guests"}</p>
          </div>
        </header>
      )}

      <form onSubmit={handleSubmit} className="walkin-form">
        {/* Card 1: Guest Information */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon user-icon">👤</span>
            <h2>Guest Information</h2>
          </div>
          <div className="card-body grid-4">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" required />
            </div>
            <div className="form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email (optional)" />
            </div>
            <div className="form-group">
              <label>Nationality</label>
              <select name="nationality" value={formData.nationality} onChange={handleChange}>
                <option value="India">India</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>ID Proof Type <span className="required">*</span></label>
              <select name="idProofType" value={formData.idProofType} onChange={handleChange} required>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
                <option value="PAN Card">PAN Card</option>
              </select>
            </div>
            <div className="form-group">
              <label>ID Proof Number <span className="required">*</span></label>
              <input type="text" name="idProofNumber" value={formData.idProofNumber} onChange={handleChange} placeholder="Enter ID number" required />
            </div>
            <div className="form-group span-2">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter current address" />
            </div>
          </div>
        </div>

        {/* Card 2: Stay Details */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon calendar-icon">📅</span>
            <h2>Stay Details</h2>
          </div>
          <div className="card-body grid-5">
            <div className="form-group icon-input">
              <label>Check-in Date <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="input-icon">📅</span>
                <input type="date" name="checkInDate" value={formData.checkInDate} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Check-in Time <span className="required">*</span></label>
              <select name="checkInTime" value={formData.checkInTime} onChange={handleChange} required>
                <option value="10:00">🕒 10:00 AM</option>
                <option value="12:00">🕒 12:00 PM</option>
                <option value="14:00">🕒 02:00 PM</option>
                <option value="16:00">🕒 04:00 PM</option>
              </select>
            </div>
            <div className="form-group icon-input">
              <label>Check-out Date <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="input-icon">📅</span>
                <input type="date" name="checkOutDate" value={formData.checkOutDate} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Check-out Time <span className="required">*</span></label>
              <select name="checkOutTime" value={formData.checkOutTime} onChange={handleChange} required>
                <option value="09:00">🕒 09:00 AM</option>
                <option value="11:00">🕒 11:00 AM</option>
                <option value="13:00">🕒 01:00 PM</option>
              </select>
            </div>
            <div className="form-group">
              <label>No. of Guests <span className="required">*</span></label>
              <div className="guest-count-row">
                <select name="adults" value={formData.adults} onChange={handleChange} required>
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
                <select name="children" value={formData.children} onChange={handleChange}>
                  {[0, 1, 2, 3].map((n) => (
                    <option key={n} value={n}>{n} Child{n === 1 ? "" : "ren"}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <p className="stay-summary">
            {nights} night{nights > 1 ? "s" : ""} · {formData.checkInDate} to {formData.checkOutDate}
          </p>
        </div>

        {/* Card 3: Room Selection */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon room-icon">🛏️</span>
            <h2>Room Selection</h2>
          </div>
          <div className="card-body grid-5-room">
            <div className="form-group">
              <label>Room Type <span className="required">*</span></label>
              <select name="roomType" value={formData.roomType} onChange={handleChange} required>
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.name}>{t.name} (₹{t.price}/night)</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Room Number <span className="required">*</span></label>
              <select name="roomNumber" value={formData.roomNumber} onChange={handleChange} required>
                <option value="">Select a room</option>
                {roomsOfType.map((r) => (
                  <option key={r.no} value={r.no}>
                    {r.no} - {r.type} ({r.status === "available" ? "Available" : r.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group prefix-input disabled-field">
              <label>Rate (per night) <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="currency-prefix">₹</span>
                <input type="text" value={ratePerNight} readOnly />
              </div>
            </div>
            <div className="form-group disabled-field">
              <label>No. of Nights <span className="required">*</span></label>
              <input type="text" value={nights} readOnly />
            </div>
            <div className="form-group prefix-input disabled-field">
              <label>Subtotal</label>
              <div className="input-wrapper">
                <span className="currency-prefix">₹</span>
                <input type="text" value={subtotal} readOnly />
              </div>
            </div>
            <div className="form-group suffix-input">
              <label>Tax (GST %)</label>
              <div className="input-wrapper">
                <input type="number" name="taxPercent" min="0" max="100" step="0.01" value={formData.taxPercent} onChange={handleChange} placeholder="0" />
                <span className="currency-suffix">%</span>
              </div>
            </div>
            <div className="form-group prefix-input disabled-field">
              <label>Tax Amount</label>
              <div className="input-wrapper">
                <span className="currency-prefix">₹</span>
                <input type="text" value={taxAmount} readOnly />
              </div>
            </div>
            <div className="form-group prefix-input">
              <label>Extra Charges</label>
              <div className="input-wrapper">
                <span className="currency-prefix">₹</span>
                <input type="number" name="extraCharges" min="0" value={formData.extraCharges} onChange={handleChange} placeholder="0" />
              </div>
            </div>
            <div className="form-group prefix-input disabled-field total-field">
              <label>Total Amount</label>
              <div className="input-wrapper">
                <span className="currency-prefix">₹</span>
                <input type="text" value={totalAmount} readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Payment & Notes */}
        <div className="form-card">
          <div className="card-header">
            <span className="card-icon payment-icon">💳</span>
            <h2>Payment & Notes</h2>
          </div>
          <div className="card-body grid-4-payment">
            <div className="form-group">
              <label>Payment Method <span className="required">*</span></label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required>
                <option value="Cash">💵 Cash</option>
                <option value="Card">💳 Card</option>
                <option value="UPI">📱 UPI</option>
              </select>
            </div>
            <div className="form-group prefix-input">
              <label>Advance Amount <span className="required">*</span></label>
              <div className="input-wrapper">
                <span className="currency-prefix">₹</span>
                <input type="number" name="advanceAmount" min="0" max={totalAmount} value={formData.advanceAmount} onChange={handleChange} placeholder="0" required />
              </div>
            </div>
            <div className={`form-group status-select status-${paymentStatus.toLowerCase()}`}>
              <label>Payment Status</label>
              <div className="select-wrapper">
                <span className="status-dot"></span>
                <input type="text" value={`${paymentStatus} (₹${balanceDue} due)`} readOnly />
              </div>
            </div>
            <div className="form-group">
              <label>Notes (Optional)</label>
              <input type="text" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any special requests or notes..." />
            </div>
          </div>
        </div>

        {error && <p className="walkin-message walkin-error">{error}</p>}
        {success && <p className="walkin-message walkin-success">{success}</p>}

        {/* Form Action Buttons */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <span className="btn-icon">🔄</span> Reset
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <span className="btn-icon">❌</span> Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="btn-icon">✓</span> {isEditing ? "Save Changes" : "Complete Check-in"}
          </button>
        </div>
      </form>
    </div>
  );
}
