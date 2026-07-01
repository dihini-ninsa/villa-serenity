# 🏡 Villa Serenity — Luxury Villa Booking Website

A full-stack luxury villa booking website built with the **MERN Stack** (MongoDB, Express.js, React, Node.js).

---

## ✨ Features

- 🏠 **3 Room Tiers** — Non-Luxury, Luxury, and VIP
- ❄️ **A/C & Non-A/C** options for each tier
- 👑 **VIP rooms** — A/C only, exclusive suites
- 🔐 **JWT Authentication** — Register & Login
- 🛡️ **Admin Dashboard** — Manage rooms and bookings
- 📅 **Booking System** — Date selection with conflict check
- 💳 **Payment Flow** — 3-step booking process
- 📋 **My Bookings** — Users can view and cancel bookings
- ✅ **Admin Confirm/Cancel** — Manage all bookings
- 📱 **Responsive Design** — Works on all screen sizes

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React, Vite, Tailwind CSS         |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB, Mongoose                 |
| Auth      | JWT, bcryptjs                     |
| Routing   | React Router v6                   |
| HTTP      | Axios                             |

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB Compass installed
- Git installed

### 1. Clone the repository
\```bash
git clone https://github.com/YOUR_USERNAME/villa-serenity.git
cd villa-serenity
\```

### 2. Setup the backend
\```bash
cd server
npm install
\```

Create a `.env` file inside `/server`:
\```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/villadb
JWT_SECRET=supersecretkey123
\```

Start the server:
\```bash
npm run dev
\```

### 3. Seed the database with rooms
\```bash
node seed.js
\```

### 4. Setup the frontend
\```bash
cd ../client
npm install
npm run dev
\```

### 5. Open the app
\```
http://localhost:5173
\```

---

## 👤 Admin Access

| Field    | Value              |
|----------|--------------------|
| Email    | admin@villa.com    |
| Password | Admin@1234         |

---

## 📁 Project Structure

\```
villa-app/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/       # JWT protection
│   ├── seed.js          # Database seeder
│   └── index.js         # Server entry point
│
└── client/
    └── src/
        ├── pages/       # All page components
        ├── components/  # Reusable components
        ├── context/     # Auth context
        └── api/         # Axios config
\```

---

## 🏨 Room Types

| Tier        | A/C | Non-A/C |
|-------------|-----|---------|
| Non-Luxury  | ✅  | ✅      |
| Luxury      | ✅  | ✅      |
| VIP         | ✅  | ❌      |

---

## 📄 License

This project is for educational purposes.

---

> Built with ❤️ for Villa Serenity, Sri Lanka
