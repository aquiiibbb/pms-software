import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Layout.css";
import {
  IconDashboard, IconHotel, IconBed, IconDoor, IconUsers, IconImage, IconShield,
  IconFrontDesk, IconCalendar, IconCheckIn, IconCheckOut, IconWalkIn, IconRoomAvail,
  IconGuestDetails, IconPayment, IconChevronRight, IconSearch, IconSetup, IconLock,
} from "./Icons";

// Password required to open the Setup group. In a real app this would be
// validated against the backend, not hardcoded on the frontend.
const SETUP_PASSWORD = "setup123";

const dashboardLink = { to: "/", label: "Dashboard", icon: IconDashboard, end: true };

const setupLinks = [
  { to: "/hotel-info", label: "Hotel Info", icon: IconHotel },
  { to: "/room-type", label: "Room Type", icon: IconBed },
  { to: "/tax", label: "Tax", icon: IconDoor },
  { to: "/rooms", label: "Rooms", icon: IconDoor },
  { to: "/staff", label: "User", icon: IconUsers },
  { to: "/gallery", label: "Gallery", icon: IconImage },
  { to: "/policies", label: "Policies", icon: IconShield },
];

const frontDeskLinks = [
  { to: "/front-desk/calendar", label: "Calendar", icon: IconCalendar },
  { to: "/front-desk/room-availability", label: "Room Availability", icon: IconRoomAvail },
  { to: "/front-desk/guest-details", label: "Guest Details", icon: IconGuestDetails },
  { to: "/front-desk/payment", label: "Payment", icon: IconPayment },
];

const pageTitles = {
  "/": ["Dashboard", "Overview of today's hotel activity"],
  "/hotel-info": ["Hotel Info", "Manage your property's core details"],
  "/room-type": ["Room Type", "Manage room categories and pricing"],
  "/rooms": ["Rooms", "All rooms and their current status"],
  "/staff": ["Staff", "Manage employees and shifts"],
  "/gallery": ["Gallery", "Photos used on your booking pages"],
  "/policies": ["Policies", "Rules guests see before booking"],
  "/front-desk/calendar": ["Calendar", "Bookings across all rooms this week"],
  "/front-desk/check-in": ["Check In", "Check in a guest with an existing booking"],
  "/front-desk/check-out": ["Check Out", "Close out a guest's stay and settle dues"],
  "/front-desk/walk-in-guest": ["Walk-in Guest", "Register a guest arriving without a booking"],
  "/front-desk/room-availability": ["Room Availability", "Live status of every room"],
  "/front-desk/guest-details": ["Guest Details", "Search and view guest records"],
  "/front-desk/payment": ["Payment", "Track and record guest payments"],
};

function Sidebar({ mobileOpen, closeMobile }) {
  const location = useLocation();
  const isFrontDeskRoute = location.pathname.startsWith("/front-desk");
  const isSetupRoute = setupLinks.some((l) => l.to === location.pathname);
  const [fdOpen, setFdOpen] = useState(true);

  const [setupUnlocked, setSetupUnlocked] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleSetupToggleClick() {
    if (setupUnlocked) {
      setSetupOpen((v) => !v);
      return;
    }
    setPasswordInput("");
    setPasswordError("");
    setShowPasswordPrompt(true);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (passwordInput === SETUP_PASSWORD) {
      setSetupUnlocked(true);
      setSetupOpen(true);
      setShowPasswordPrompt(false);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Incorrect password. Please try again.");
    }
  }

  function handlePasswordCancel() {
    setShowPasswordPrompt(false);
    setPasswordInput("");
    setPasswordError("");
  }

  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="brand">
        <img className="brand-logo" src={logo} alt="Bhopal Grand" />
      </div>

      <div className="nav-section-label">Overview</div>
      <ul className="nav-list">
        <li>
          <NavLink
            to={dashboardLink.to}
            end={dashboardLink.end}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={closeMobile}
          >
            <dashboardLink.icon />
            {dashboardLink.label}
          </NavLink>
        </li>
      </ul>

      <div className="nav-section-label">Operations</div>
      <ul className="nav-list">
        <li>
          <button className={`nav-group-toggle ${fdOpen ? "open" : ""} ${isFrontDeskRoute ? "active" : ""}`} onClick={() => setFdOpen((v) => !v)}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IconFrontDesk />
              Front Desk
            </span>
            <IconChevronRight />
          </button>
          {fdOpen && (
            <ul className="nav-sublist">
              {frontDeskLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeMobile}>
                    <Icon />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>

      <div className="nav-section-label">Configuration</div>
      <ul className="nav-list">
        <li>
          <button
            className={`nav-group-toggle ${setupOpen && setupUnlocked ? "open" : ""} ${isSetupRoute ? "active" : ""}`}
            onClick={handleSetupToggleClick}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IconSetup />
              Setup
            </span>
            {setupUnlocked ? <IconChevronRight /> : <IconLock width={13} height={13} />}
          </button>
          {setupOpen && setupUnlocked && (
            <ul className="nav-sublist">
              {setupLinks.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeMobile}>
                    <Icon />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </li>
      </ul>

      <div className="sidebar-footer">MERN Hotel PMS · v0.1 (Frontend)</div>

      {showPasswordPrompt && (
        <div className="setup-lock-overlay" onClick={handlePasswordCancel}>
          <div className="setup-lock-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Setup is locked</h3>
            <p>Enter the password to access hotel configuration.</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Password"
              />
              {passwordError && <p className="setup-lock-error">{passwordError}</p>}
              <div className="setup-lock-actions">
                <button type="button" className="btn btn-outline btn-sm" onClick={handlePasswordCancel}>Cancel</button>
                <button type="submit" className="btn btn-gold btn-sm">Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, crumb] = pageTitles[location.pathname] || ["Hotel PMS", ""];

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} closeMobile={() => setMobileOpen(false)} />
      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            <div className="topbar-crumb">{crumb}</div>
          </div>
          <div className="topbar-right">
            <div id="calendar-navbar-controls" />
            <div className="search-box">
              <IconSearch />
              <input
                type="text"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search guest, room..."
                aria-label="Search guest or room"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="avatar">RS</div>
          </div>
        </header>
        <div className="page-content">
          <Outlet context={{ searchTerm }} />
        </div>
      </div>
    </div>
  );
}
