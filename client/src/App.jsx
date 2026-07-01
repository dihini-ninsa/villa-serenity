import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

import Home          from './pages/Home';
import Rooms         from './pages/Rooms';
import RoomDetail    from './pages/RoomDetail';
import MyBookings    from './pages/MyBookings';
import Login         from './pages/Login';
import Register      from './pages/Register';
import Dashboard     from './pages/admin/Dashboard';
import ManageRooms   from './pages/admin/ManageRooms';
import AdminBookings from './pages/admin/AdminBookings';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/rooms"       element={<Rooms />} />
          <Route path="/rooms/:id"   element={<RoomDetail />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<Register />} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/admin"              element={<ProtectedRoute admin><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/rooms"        element={<ProtectedRoute admin><ManageRooms /></ProtectedRoute>} />
          <Route path="/admin/bookings"     element={<ProtectedRoute admin><AdminBookings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}