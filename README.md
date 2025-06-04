# 🧁 Bakery Crew Hub — Frontend

A mobile-friendly web app for a bakery team.  
Team members can view their shift, apply for overtime, contribute to donations, send messages, and see upcoming events.

---

## 🚀 Tech Stack

- Vite + React + TypeScript
- Clean CSS (no Tailwind, Bootstrap, or other frameworks)
- React Router
- Axios

---

## 📦 Installed Dependencies

```bash
npm install axios react-router-dom classnames
npm install --save-dev @types/react-router-dom
```

---

## 📁 Project Structure

```
src/
├── api/              # API requests to backend
├── components/       # Reusable UI components (e.g. BottomNav)
├── context/          # Global user state (UserContext)
├── pages/            # Pages (Login, Register, Home, Events...)
├── routes/           # Protected routes
├── styles/           # Main CSS file
├── App.tsx
├── main.tsx
```

---

## ✅ Features Implemented

### 🔐 Authentication
- JWT stored in `sessionStorage`
- Token auto-attached via Axios interceptor (configured in `api/axios.ts`)
- Auto-login attempt on refresh
- Role & shift handling
- Global auth state via `UserContext`
- Protected routes via `ProtectedRoute.tsx`
- Visual error alerts with `AxiosError` handling

### 👤 User Flow
- Login & Register pages fully working
- Protected routes via `ProtectedRoute.tsx`
- User context persists session info
- Alerts shown on login/register failure
- Token persisted & auto-applied for all requests

### 🏠 Home Page
- Displays logged-in user's shift and role
- Dynamically fetches:
  - All events (`/api/events`)
  - Active donations (`/api/donations/active`)
- Safe rendering with `Array.isArray()` checks
- Placeholder calendar section
- Fully styled mobile-friendly layout
- Dynamic bottom navigation bar

### 📱 Navigation
- BottomNav component with four routes:
  - `/` — Home
  - `/events` — Overtime event list (in progress)
  - `/donations` — Active donations (in progress)
  - `/messages` — Messaging (in progress)

---

## 🧪 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/Lilu-B/bch-FE.git
cd bch-FE

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at:  
📱 http://localhost:5173

---

## 🔐 Authentication

- ✅ JWT token is saved to `sessionStorage` on login
- 🔐 Axios interceptor (in `api/axios.ts`) automatically attaches the token
- 🔁 `UserContext.tsx` attempts auto-auth on refresh using `/api/protected`
- 🧠 Normalized user profile is saved to context
- 🔁 On page refresh, auto-login is attempted if token exists
- 🔒 Errors (e.g. expired session) are caught with `AxiosError` and shown via `alert`
- 🔐 Manual logout clears token and resets context

---

## 🔗 Backend Integration

Connected to:  
🔗 https://github.com/Lilu-B/bakery-crew-BE

- Axios uses `/api` with proxy to `localhost:3001`
- Tested endpoints:
  - `POST /api/login`
  - `POST /api/register`
  - `GET /api/protected`
  - `GET /api/events`
  - `GET /api/donations/active`

---

## 🛠️ Work Done So Far

- Project initialized using `Vite + React + TypeScript`
- Clean folder structure set up
- `axios.ts` configured with interceptor
- `vite.config.ts` set with dev proxy
- `UserContext.tsx` created to manage auth state, auto-auth on refresh, and logout on token failure
- `ProtectedRoute.tsx` guards private routes
- Login and Register pages implemented with error feedback
- All login/logout/token logic completed and tested
- Dynamic data fetching using `useEffect` with error handling
- Normalized backend responses to support camelCase props
- Home page fully working with live data (events & donations)
- Real-time test users and data created in PostgreSQL backend
- Admin login and role-specific routing/debugging implemented
- Fallback handling added for empty events/donations
- Error messages using `AxiosError` for both login/register
- README maintained throughout

---

## 📌 Upcoming Features

- Events: Apply, cancel, manager-only creation
- Donations: Payment flow, optional participation
- Messages: Direct messaging + manager approvals
- Calendar sync with Google API
- Accessibility (a11y) optimization

---

## 🔗 Backend

This project connects to the backend repository:  
https://github.com/Lilu-B/bakery-crew-BE
