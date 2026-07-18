import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOutletContext } from "react-router-dom";
import { PageHeader } from "../../components/UI";
import { rooms, roomTypes, bookings as initialBookings } from "../../data/mockData";
import WalkinGuest from "./WalkinGuest";
import "./Calendar.css";

const INITIAL_WEEK = new Date(2026, 6, 4);
const DAY_MS = 24 * 60 * 60 * 1000;

const STATUS_META = {
  available: { label: "Clean", cls: "status-clean" },
  cleaning: { label: "Dirty", cls: "status-dirty" },
  occupied: { label: "Occupied", cls: "status-occupied" },
  maintenance: { label: "Maintenance", cls: "status-maintenance" },
};

const QUICK_STATUS_FILTERS = [
  { value: "available", label: "Available Rooms" },
  { value: "maintenance", label: "Blocked Rooms" },
  { value: "cleaning", label: "Dirty Rooms" },
  { value: "available-clean", label: "Clean Rooms" },
  { value: "occupied", label: "Occupied Rooms" },
];

function dateToKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function addDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}
function isSameDay(first, second) {
  return dateToKey(first) === dateToKey(second);
}
function dayOffset(fromKey, toKey) {
  return Math.round((new Date(toKey) - new Date(fromKey)) / DAY_MS);
}
function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
const AVATAR_PALETTE = ["#2E5C8A", "#7A4FB5", "#B5544F", "#3D8A6B", "#A5762F", "#5A5FC7"];
function avatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}

export default function Calendar() {
  const { searchTerm = "" } = useOutletContext() || {};
  const [weekStart, setWeekStart] = useState(INITIAL_WEEK);
  const [bookingsList, setBookingsList] = useState(initialBookings);
  const [activeCell, setActiveCell] = useState(null); // { roomNo, date, booking }
  const [toast, setToast] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
  const [navbarTarget, setNavbarTarget] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(() => new Set(roomTypes.map((t) => t.name)));
  const filterRef = useRef(null);

  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const dragGrabOffsetRef = useRef(0);

  const today = startOfDay(new Date());

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => {
      const date = addDays(weekStart, index);
      return {
        date: dateToKey(date),
        label: new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(date),
        dayNum: date.getDate(),
        isToday: isSameDay(date, today),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
      };
    }),
    [weekStart, today]
  );
  const weekStartKey = days[0].date;

  const rangeLabel = `${new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" }).format(weekStart)} – ${new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric", year: "numeric" }).format(addDays(weekStart, 6))}`;

  // Treat the checkout date as free for a NEW booking, so the same room can be
  // checked in again on its checkout day (same-day turnover). The gantt bar
  // still visually spans through the checkout day; this only affects whether
  // a day-cell is clickable to start a new reservation.
  const bookingFor = (roomNo, date) =>
    bookingsList.find((booking) => booking.room === roomNo && date >= booking.checkIn && date < booking.checkOut);

  const query = searchTerm.trim().toLowerCase();

  // Close the filter panel on outside click.
  useEffect(() => {
    if (!filterOpen) return;
    function onDocClick(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFilterOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [filterOpen]);

  useEffect(() => {
    setNavbarTarget(document.getElementById("calendar-navbar-controls"));
  }, []);

  const filteredRooms = useMemo(() => {
    const weekDates = days.map((d) => d.date);
    return rooms.filter((room) => {
      if (statusFilter === "available-clean" && room.status !== "available") return false;
      if (statusFilter && statusFilter !== "available-clean" && room.status !== statusFilter) return false;
      if (!typeFilter.has(room.type)) return false;
      if (!query) return true;
      if (room.no.toLowerCase().includes(query)) return true;
      if (room.type.toLowerCase().includes(query)) return true;
      return bookingsList.some(
        (b) =>
          b.room === room.no &&
          b.guest.toLowerCase().includes(query) &&
          weekDates.some((d) => d >= b.checkIn && d <= b.checkOut)
      );
    });
  }, [statusFilter, typeFilter, query, days, bookingsList]);

  const groupedRooms = useMemo(() => {
    const groups = new Map();
    filteredRooms.forEach((room) => {
      if (!groups.has(room.type)) groups.set(room.type, []);
      groups.get(room.type).push(room);
    });
    groups.forEach((list) => {
      list.sort((a, b) => a.no.localeCompare(b.no, undefined, { numeric: true }));
    });
    return Array.from(groups.entries());
  }, [filteredRooms]);

  function toggleGroup(type) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }

  function toggleTypeFilter(name) {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  const filterLabel = statusFilter
    ? QUICK_STATUS_FILTERS.find((f) => f.value === statusFilter)?.label
    : typeFilter.size === roomTypes.length
    ? "All Rooms"
    : typeFilter.size === 0
    ? "None Selected"
    : `${typeFilter.size} Room Types`;

  function openNewBooking(roomNo, date) {
    setActiveCell({ roomNo, date, booking: null });
  }
  function openExistingBooking(booking) {
    setActiveCell({ roomNo: booking.room, date: booking.checkIn, booking });
  }
  function closeModal() {
    setActiveCell(null);
  }

  function handleBookingSaved(bookingRecord) {
    setBookingsList((prev) => {
      const idx = prev.findIndex((b) => b.id === bookingRecord.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = bookingRecord;
        return next;
      }
      return [...prev, bookingRecord];
    });
    setToast(
      activeCell?.booking
        ? `Booking updated: ${bookingRecord.guest} · Room ${bookingRecord.room}`
        : `Walk-in saved: ${bookingRecord.guest} · Room ${bookingRecord.room}`
    );
    closeModal();
  }

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!activeCell) return;
    function onKeyDown(e) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeCell]);

  // --- Drag to move a booking to another room/date ---
  function handleBarDragStart(e, booking) {
    const barRect = e.currentTarget.getBoundingClientRect();
    dragGrabOffsetRef.current = e.clientX - barRect.left;
    e.dataTransfer.setData("text/plain", booking.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggingId(booking.id);
  }
  function handleBarDragEnd() {
    setDraggingId(null);
  }
  function handleTrackDrop(e, room) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const booking = bookingsList.find((b) => b.id === id);
    setDraggingId(null);
    if (!booking) return;

    const trackRect = e.currentTarget.getBoundingClientRect();
    const dayWidth = trackRect.width / 7;
    const dropLeftPx = e.clientX - trackRect.left - dragGrabOffsetRef.current;
    const nights = dayOffset(booking.checkIn, booking.checkOut);

    let newStartIdx = Math.round(dropLeftPx / dayWidth);
    newStartIdx = Math.max(0, Math.min(newStartIdx, 6 - nights));

    const newCheckInKey = dateToKey(addDays(new Date(weekStartKey), newStartIdx));
    const newCheckOutKey = dateToKey(addDays(new Date(weekStartKey), newStartIdx + nights));

    const conflict = bookingsList.some(
      (b) =>
        b.id !== booking.id &&
        b.room === room.no &&
        newCheckInKey < b.checkOut &&
        newCheckOutKey > b.checkIn
    );
    if (conflict) {
      setToast(`Can't move here — Room ${room.no} is already booked for those dates.`);
      return;
    }

    setBookingsList((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, room: room.no, checkIn: newCheckInKey, checkOut: newCheckOutKey } : b))
    );
    setToast(`Moved ${booking.guest} → Room ${room.no} (${newCheckInKey} to ${newCheckOutKey})`);
  }

  // --- Drag the right edge to extend/shrink the stay ---
  function handleResizeStart(e, booking, rawStartDay) {
    e.preventDefault();
    e.stopPropagation();
    const trackEl = e.currentTarget.closest(".calendar-room-track");
    if (!trackEl) return;
    const trackRect = trackEl.getBoundingClientRect();
    const dayWidth = trackRect.width / 7;
    const startClientX = e.clientX;
    const roomNo = booking.room;
    const bookingId = booking.id;
    const checkInKey = booking.checkIn;
    const originalEndIdx = rawStartDay + dayOffset(checkInKey, booking.checkOut);
    let lastAppliedCheckOutKey = booking.checkOut;

    setResizingId(bookingId);

    function onMouseMove(ev) {
      const deltaPx = ev.clientX - startClientX;
      const deltaDays = Math.round(deltaPx / dayWidth);
      let newEndIdx = originalEndIdx + deltaDays;
      newEndIdx = Math.max(rawStartDay, Math.min(newEndIdx, 6));
      const newCheckOutKey = dateToKey(addDays(new Date(weekStartKey), newEndIdx));
      if (newCheckOutKey === lastAppliedCheckOutKey) return;

      const conflict = bookingsList.some(
        (b) =>
          b.id !== bookingId &&
          b.room === roomNo &&
          checkInKey < b.checkOut &&
          newCheckOutKey > b.checkIn
      );
      if (conflict) return;

      lastAppliedCheckOutKey = newCheckOutKey;
      setBookingsList((prev) => prev.map((b) => (b.id === bookingId ? { ...b, checkOut: newCheckOutKey } : b)));
    }
    function onMouseUp() {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      setResizingId(null);
      setToast(`Updated stay length for ${booking.guest}`);
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  const activeRoom = activeCell ? rooms.find((r) => r.no === activeCell.roomNo) : null;

  return (
    <div>
      {navbarTarget && createPortal(
      <PageHeader
        title=""
        action={(
          <div className="calendar-controls" aria-label="Calendar navigation">
            <div className="filter-dropdown" ref={filterRef}>
              <button
                type="button"
                className="btn btn-outline btn-sm filter-toggle"
                onClick={() => setFilterOpen((o) => !o)}
                aria-expanded={filterOpen}
              >
                Filters: {filterLabel} <span className={`filter-caret ${filterOpen ? "open" : ""}`}>▾</span>
              </button>
              {filterOpen && (
                <div className="filter-panel">
                  <div className="filter-section">
                    {QUICK_STATUS_FILTERS.map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        className={`filter-option ${statusFilter === f.value ? "active" : ""}`}
                        onClick={() => setStatusFilter((prev) => (prev === f.value ? null : f.value))}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="filter-divider" />
                  <div className="filter-section filter-section-row">
                    <button type="button" className="filter-option" onClick={() => setTypeFilter(new Set(roomTypes.map((t) => t.name)))}>
                      All
                    </button>
                    <button type="button" className="filter-option" onClick={() => setTypeFilter(new Set())}>
                      Unselect
                    </button>
                  </div>
                  <div className="filter-divider" />
                  <div className="filter-section filter-scroll">
                    {roomTypes.map((t) => (
                      <label key={t.id} className="filter-checkbox-row">
                        <input
                          type="checkbox"
                          checked={typeFilter.has(t.name)}
                          onChange={() => toggleTypeFilter(t.name)}
                        />
                        {t.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-outline btn-sm" onClick={() => setWeekStart((date) => addDays(date, -7))} aria-label="Previous week">‹</button>
            <button className="btn btn-outline btn-sm" onClick={() => setWeekStart(today)}>Today</button>
            <button className="btn btn-outline btn-sm" onClick={() => setWeekStart((date) => addDays(date, 7))} aria-label="Next week">›</button>
          </div>
        )}
      />,
      navbarTarget
      )}

      {query && (
        <p className="calendar-search-hint">
          Showing {filteredRooms.length} of {rooms.length} rooms matching "{searchTerm.trim()}"
        </p>
      )}

      <div className="calendar-scroll" tabIndex="0" aria-label="Room booking calendar. Scroll to view all rooms and dates.">
        <div className="calendar-wrap">
          <div className="calendar-head calendar-room-head">Room</div>
          {days.map((day) => (
            <div key={day.date} className={`calendar-head ${day.isToday ? "is-today" : ""} ${day.isWeekend ? "is-weekend" : ""}`}>
              <span className="head-weekday">{day.label}</span>
              <span className="head-daynum">{day.dayNum}</span>
            </div>
          ))}

          {groupedRooms.length === 0 && (
            <div className="calendar-empty-row">No rooms match your filters.</div>
          )}

          {groupedRooms.map(([type, roomsInGroup]) => {
            const collapsed = collapsedGroups.has(type);
            return (
              <Fragment key={type}>
                <button
                  className="calendar-group-head"
                  onClick={() => toggleGroup(type)}
                  aria-expanded={!collapsed}
                >
                  <span className={`group-chevron ${collapsed ? "collapsed" : ""}`}>▾</span>
                  {type}
                  <span className="group-count">{roomsInGroup.length} room{roomsInGroup.length > 1 ? "s" : ""}</span>
                </button>

                {!collapsed && roomsInGroup.map((room) => {
                  const status = STATUS_META[room.status] || { label: room.status, cls: "" };
                  const roomBookings = bookingsList.filter((b) => {
                    if (b.room !== room.no) return false;
                    const startOffset = dayOffset(weekStartKey, b.checkIn);
                    const endOffset = dayOffset(weekStartKey, b.checkOut);
                    return endOffset >= 0 && startOffset <= 6;
                  });

                  return (
                    <Fragment key={room.no}>
                      <div className="calendar-room-label">
                        <span className="room-no-row">
                          Room {room.no}
                          <span className={`status-pill ${status.cls}`}>{status.label}</span>
                        </span>
                        <span className="calendar-room-type">{room.type}</span>
                      </div>

                      <div
                        className="calendar-room-track"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleTrackDrop(e, room)}
                      >
                        {days.map((day, dayIdx) => (
                          <div
                            key={day.date}
                            className={`track-daycell ${day.isToday ? "is-today" : ""}`}
                            style={{ left: `${(dayIdx / 7) * 100}%`, width: `${(1 / 7) * 100}%` }}
                            onClick={() => {
                              if (!bookingFor(room.no, day.date)) openNewBooking(room.no, day.date);
                            }}
                            role="button"
                            tabIndex={-1}
                            aria-hidden="true"
                          />
                        ))}

                        {roomBookings.map((booking) => {
                          const rawStart = dayOffset(weekStartKey, booking.checkIn);
                          const rawEnd = dayOffset(weekStartKey, booking.checkOut);
                          // A stay starts at check-in (second half of the day) and
                          // ends at check-out (first half of the day). This leaves
                          // the checkout-day afternoon free for a new check-in.
                          const startIdx = Math.max(rawStart + 0.5, 0);
                          const endIdx = Math.min(rawEnd + 0.5, 7);
                          if (endIdx <= startIdx) return null;
                          const left = (startIdx / 7) * 100;
                          const width = ((endIdx - startIdx) / 7) * 100;
                          const fullyVisible = rawStart >= 0 && rawEnd <= 6;

                          return (
                            <div
                              key={booking.id}
                              className={`gantt-bar ${draggingId === booking.id ? "is-dragging" : ""} ${!fullyVisible ? "is-locked" : ""}`}
                              style={{ left: `${left}%`, width: `${width}%`, background: booking.color }}
                              title={
                                fullyVisible
                                  ? `${booking.guest} · ${booking.checkIn} to ${booking.checkOut} (drag to move, click to edit)`
                                  : `${booking.guest} · ${booking.checkIn} to ${booking.checkOut} (click to edit)`
                              }
                              draggable={fullyVisible && resizingId !== booking.id}
                              onDragStart={(e) => handleBarDragStart(e, booking)}
                              onDragEnd={handleBarDragEnd}
                              onClick={(e) => {
                                e.stopPropagation();
                                openExistingBooking(booking);
                              }}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  openExistingBooking(booking);
                                }
                              }}
                            >
                              <span className="gantt-avatar" style={{ background: avatarColor(booking.guest) }}>
                                {initials(booking.guest)}
                              </span>
                              {booking.source && <span className="gantt-source">{booking.source}</span>}
                              <span className="gantt-name">{booking.guest}</span>
                              {fullyVisible && (
                                <span
                                  className="gantt-resize-handle"
                                  onMouseDown={(e) => handleResizeStart(e, booking, rawStart)}
                                  onClick={(e) => e.stopPropagation()}
                                  title="Drag to extend/shrink stay"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>

      <div className="calendar-legend">
        <span><i style={{ background: "#2E9E6D" }} /> Confirmed</span>
        <span><i style={{ background: "#3D6FD6" }} /> New booking</span>
        <span><i style={{ background: "#C47A1F" }} /> Long stay</span>
      </div>

      {toast && <div className="calendar-toast">{toast}</div>}

      {activeCell && (
        <div className="cal-modal-overlay" onClick={closeModal}>
          <div
            className="cal-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="walkin-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cal-modal-head">
              <div>
                <h3 id="walkin-modal-title">
                  {activeCell.booking ? "Edit Walk-in Guest" : "Add Walk-in Guest"}
                </h3>
                <p className="cal-modal-subtitle">
                  Room {activeCell.roomNo}{activeRoom ? ` · ${activeRoom.type}` : ""} · {activeCell.date}
                </p>
              </div>
              <button className="cal-modal-close" onClick={closeModal} aria-label="Close">✕</button>
            </div>
            <div className="cal-modal-body">
              <WalkinGuest
                key={`${activeCell.roomNo}-${activeCell.date}-${activeCell.booking?.id || "new"}`}
                embedded
                initialRoomNo={activeCell.roomNo}
                initialDate={activeCell.date}
                initialBooking={activeCell.booking}
                existingBookings={bookingsList}
                onSubmit={handleBookingSaved}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
