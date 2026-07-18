import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import HotelInfo from "./pages/HotelInfo";
import RoomType from "./pages/RoomType";
import Rooms from "./pages/Rooms";
import Tax from "./pages/tax";
import Extra from "./pages/extra";
import Staff from "./pages/Staff";
import Gallery from "./pages/Gallery";
import Policies from "./pages/Policies";
import Calendar from "./pages/frontdesk/Calendar";
import WalkinGuest from "./pages/frontdesk/WalkinGuest";
import RoomAvailability from "./pages/frontdesk/RoomAvailability";
import GuestDetails from "./pages/frontdesk/GuestDetails";
import Payment from "./pages/frontdesk/Payment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="hotel-info" element={<HotelInfo />} />
          <Route path="room-type" element={<RoomType />} />
          <Route path="rooms" element={<Rooms />} />
           <Route path="tax" element={<Tax />} />
            <Route path="extra" element={<Extra />} />
          <Route path="staff" element={<Staff />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="policies" element={<Policies />} />
          <Route path="front-desk/calendar" element={<Calendar />} />
         
          <Route path="front-desk/walk-in-guest" element={<WalkinGuest />} />
          <Route path="front-desk/room-availability" element={<RoomAvailability />} />
          <Route path="front-desk/guest-details" element={<GuestDetails />} />
          <Route path="front-desk/payment" element={<Payment />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
