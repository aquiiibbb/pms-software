// Central mock data store for the frontend-only build.
// Once the backend is ready, these exports will be replaced with API calls.

export const hotelInfo = {
  name: "The Bhopal Grand",
  tagline: "Comfort at the heart of the city",
  address: "MP Nagar Zone 1, Bhopal, Madhya Pradesh, India",
  phone: "+91 98765 43210",
  email: "frontdesk@bhopalgrand.com",
  website: "www.bhopalgrand.com",
  checkInTime: "12:00 PM",
  checkOutTime: "11:00 AM",
  totalRooms: 42,
  starRating: 4,
  gstNumber: "23AAAAA0000A1Z5",
  description:
    "The Bhopal Grand is a modern city hotel offering 42 well-appointed rooms across four categories, a multi-cuisine restaurant, banquet hall, and rooftop lounge — built for both business travellers and families.",
};

export const roomTypes = [
  { id: "rt1", name: "Standard", price: 2500, occupancy: 2, totalRooms: 16, amenities: ["AC", "TV", "WiFi"] },
  { id: "rt2", name: "Deluxe", price: 3800, occupancy: 2, totalRooms: 14, amenities: ["AC", "TV", "WiFi", "Mini Fridge"] },
  { id: "rt3", name: "Executive Suite", price: 5600, occupancy: 3, totalRooms: 8, amenities: ["AC", "TV", "WiFi", "Mini Fridge", "Balcony"] },
  { id: "rt4", name: "Presidential Suite", price: 9500, occupancy: 4, totalRooms: 4, amenities: ["AC", "TV", "WiFi", "Mini Fridge", "Balcony", "Jacuzzi"] },
];

export const rooms = [
  { no: "101", type: "Standard", floor: 1, status: "occupied" },
  { no: "102", type: "Standard", floor: 1, status: "available" },
  { no: "103", type: "Standard", floor: 1, status: "cleaning" },
  { no: "104", type: "Standard", floor: 1, status: "available" },
  { no: "201", type: "Deluxe", floor: 2, status: "occupied" },
  { no: "202", type: "Deluxe", floor: 2, status: "available" },
  { no: "203", type: "Deluxe", floor: 2, status: "maintenance" },
  { no: "204", type: "Deluxe", floor: 2, status: "occupied" },
  { no: "301", type: "Executive Suite", floor: 3, status: "available" },
  { no: "302", type: "Executive Suite", floor: 3, status: "occupied" },
  { no: "303", type: "Executive Suite", floor: 3, status: "available" },
  { no: "401", type: "Presidential Suite", floor: 4, status: "occupied" },
];

export const staff = [
  { id: "s1", name: "Rohit Sharma", role: "Front Desk Manager", shift: "Morning", phone: "+91 90000 11111", status: "active" },
  { id: "s2", name: "Anjali Verma", role: "Receptionist", shift: "Morning", phone: "+91 90000 22222", status: "active" },
  { id: "s3", name: "Suresh Yadav", role: "Housekeeping Head", shift: "Morning", phone: "+91 90000 33333", status: "active" },
  { id: "s4", name: "Priya Malhotra", role: "Receptionist", shift: "Night", phone: "+91 90000 44444", status: "on-leave" },
  { id: "s5", name: "Deepak Chauhan", role: "Security", shift: "Night", phone: "+91 90000 55555", status: "active" },
  { id: "s6", name: "Neha Joshi", role: "Housekeeping", shift: "Evening", phone: "+91 90000 66666", status: "active" },
];

export const galleryImages = [
  { id: "g1", url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400", caption: "Lobby" },
  { id: "g2", url: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400", caption: "Deluxe Room" },
  { id: "g3", url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400", caption: "Executive Suite" },
  { id: "g4", url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400", caption: "Restaurant" },
  { id: "g5", url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400", caption: "Banquet Hall" },
  { id: "g6", url: "https://images.unsplash.com/photo-1611048268330-53de574cae3b?w=400", caption: "Rooftop Lounge" },
  { id: "g7", url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400", caption: "Swimming Pool" },
  { id: "g8", url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400", caption: "Presidential Suite" },
];

export const policies = [
  { id: "p1", title: "Check-in / Check-out", body: "Check-in from 12:00 PM, check-out by 11:00 AM. Early check-in and late check-out are subject to availability and may incur charges." },
  { id: "p2", title: "Cancellation Policy", body: "Free cancellation up to 24 hours before check-in. Cancellations within 24 hours are charged one night's stay." },
  { id: "p3", title: "ID Proof", body: "Valid government-issued photo ID is mandatory for all guests at check-in. Local IDs may require an additional address proof." },
  { id: "p4", title: "Pet Policy", body: "Pets are not allowed in the hotel premises, except registered service animals." },
  { id: "p5", title: "Payment Policy", body: "We accept cash, all major credit/debit cards, and UPI. A valid card is required to guarantee a booking." },
  { id: "p6", title: "Smoking Policy", body: "The hotel is entirely non-smoking. Smoking in rooms attracts a deep-cleaning fee of ₹2,500." },
];

export const guests = [
  { id: "gs1", name: "Amit Kulkarni", phone: "+91 98111 22333", email: "amit.k@example.com", idType: "Aadhaar", idNumber: "XXXX-XXXX-4521", room: "201", checkIn: "2026-07-02", checkOut: "2026-07-06", status: "checked-in", balance: 0 },
  { id: "gs2", name: "Sara Khan", phone: "+91 98222 33444", email: "sara.khan@example.com", idType: "Passport", idNumber: "P1234567", room: "302", checkIn: "2026-07-03", checkOut: "2026-07-05", status: "checked-in", balance: 1800 },
  { id: "gs3", name: "Vikram Singh", phone: "+91 98333 44555", email: "vikram.s@example.com", idType: "Driving License", idNumber: "MP04-2020-0012345", room: "401", checkIn: "2026-06-29", checkOut: "2026-07-04", status: "checked-out", balance: 0 },
  { id: "gs4", name: "Neha Agarwal", phone: "+91 98444 55666", email: "neha.a@example.com", idType: "Aadhaar", idNumber: "XXXX-XXXX-7789", room: "101", checkIn: "2026-07-04", checkOut: "2026-07-04", status: "checked-in", balance: 0 },
  { id: "gs5", name: "Rahul Deshmukh", phone: "+91 98555 66777", email: "rahul.d@example.com", idType: "Voter ID", idNumber: "ABC1234567", room: "204", checkIn: "2026-07-01", checkOut: "2026-07-07", status: "checked-in", balance: 3200 },
];

export const bookings = [
  { id: "bk1", guest: "Amit Kulkarni", room: "201", checkIn: "2026-07-02", checkOut: "2026-07-06", color: "#2E9E6D", source: "Airbnb" },
  { id: "bk2", guest: "Sara Khan", room: "302", checkIn: "2026-07-03", checkOut: "2026-07-05", color: "#3D6FD6", source: "Website" },
  { id: "bk3", guest: "Rahul Deshmukh", room: "204", checkIn: "2026-07-01", checkOut: "2026-07-07", color: "#C47A1F", source: "Corporate" },
  { id: "bk4", guest: "Neha Agarwal", room: "101", checkIn: "2026-07-04", checkOut: "2026-07-04", color: "#CF4444", source: "Direct" },
];

export const payments = [
  { id: "pay1", guest: "Amit Kulkarni", room: "201", amount: 15200, mode: "UPI", status: "paid", date: "2026-07-02" },
  { id: "pay2", guest: "Sara Khan", room: "302", amount: 5600, mode: "Card", status: "partial", date: "2026-07-03" },
  { id: "pay3", guest: "Vikram Singh", room: "401", amount: 47500, mode: "Cash", status: "paid", date: "2026-06-29" },
  { id: "pay4", guest: "Rahul Deshmukh", room: "204", amount: 12800, mode: "Card", status: "partial", date: "2026-07-01" },
  { id: "pay5", guest: "Neha Agarwal", room: "101", amount: 2500, mode: "UPI", status: "pending", date: "2026-07-04" },
];

export const dashboardStats = {
  totalRooms: 42,
  occupiedRooms: 27,
  availableRooms: 11,
  todayArrivals: 6,
  todayDepartures: 4,
  todayRevenue: 68400,
  occupancyRate: 64,
};

export const revenueTrend = [
  { day: "Mon", value: 42000 },
  { day: "Tue", value: 51000 },
  { day: "Wed", value: 47500 },
  { day: "Thu", value: 60200 },
  { day: "Fri", value: 58000 },
  { day: "Sat", value: 71500 },
  { day: "Sun", value: 68400 },
];
