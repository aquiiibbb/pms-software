# Hotel PMS — Frontend (MERN Stack, React part)

Simple, clean frontend for a Hotel Property Management System, built with **React + Vite + React Router**.
Currently uses **mock/dummy data** (`src/data/mockData.js`) so the UI works standalone.
The backend (Node + Express + MongoDB) will be connected next — mock data will be swapped for real API calls.

## Pages included

**Main**
- Dashboard
- Hotel Info
- Room Type
- Rooms
- Staff
- Gallery
- Policies

**Front Desk**
- Calendar
- Check In
- Check Out
- Walk-in Guest
- Room Availability
- Guest Details
- Payment

## Run locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Project structure

```
src/
  components/     -> Layout, Sidebar, shared UI (badges, cards), icons
  pages/           -> Main section pages
  pages/frontdesk/ -> Front Desk sub-pages
  data/            -> mockData.js (dummy data — replace with API calls later)
  index.css        -> Global design tokens & all component styles
```

## Next step (Backend)

Once you're happy with the UI, I'll build the Express + MongoDB backend
with REST APIs for rooms, room types, staff, gallery, policies, bookings,
guests, and payments, and wire this frontend up to it (replacing `mockData.js`
with `fetch`/`axios` calls).
