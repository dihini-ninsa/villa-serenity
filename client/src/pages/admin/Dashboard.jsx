import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
 
export default function Dashboard() {
  const [stats, setStats] = useState({
    rooms:     0,
    bookings:  0,
    confirmed: 0,
    revenue:   0,
  });
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          api.get('/rooms'),
          api.get('/bookings/all'),
        ]);
        const bookings = bookingsRes.data;
        const revenue  = bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
 
        setStats({
          rooms:     roomsRes.data.length,
          bookings:  bookings.length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          revenue,
        });
      } catch (err) {
        console.error('Stats error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
 
  const statCards = [
    { label: 'Total Rooms',    value: stats.rooms,         icon: '🏠' },
    { label: 'Total Bookings', value: stats.bookings,      icon: '📅' },
    { label: 'Confirmed',      value: stats.confirmed,     icon: '✅' },
    { label: 'Revenue',        value: `Rs.${stats.revenue}`, icon: '💰' },
  ];
 
  const navCards = [
    { to: '/admin/rooms',    icon: '🏠', label: 'Manage Rooms', desc: 'Add, edit, delete rooms'  },
    { to: '/admin/bookings', icon: '📋', label: 'All Bookings', desc: 'View and manage bookings' },
    { to: '/rooms',          icon: '👁️', label: 'View Site',    desc: 'See the guest-facing site' },
  ];
 
  return (
    <div className="min-h-screen p-8" style={{ background: '#0d0a12' }}>
      <div className="max-w-6xl mx-auto">
 
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-white"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Admin Dashboard
          </h1>
          <p className="text-purple-400 text-sm mt-1">Welcome back, Admin</p>
        </div>
 
        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="rounded-2xl p-5 animate-pulse h-28"
                style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map(s => (
              <div
                key={s.label}
                className="rounded-2xl p-5"
                style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}
              >
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className="text-2xl font-bold text-white">{s.value ?? 0}</p>
                <p className="text-purple-400 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}
 
        {/* Quick nav */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {navCards.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-2xl p-6 hover:opacity-80 transition text-center"
              style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}
            >
              <div className="text-3xl mb-3">{n.icon}</div>
              <p className="font-semibold text-white">{n.label}</p>
              <p className="text-purple-400 text-xs mt-1">{n.desc}</p>
            </Link>
          ))}
        </div>
 
        {/* Booking overview */}
        <div
          className="rounded-2xl p-6"
          style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Booking Overview</h2>
            <Link
              to="/admin/bookings"
              className="text-xs text-purple-400 hover:text-purple-200 transition"
            >
              View all →
            </Link>
          </div>
 
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Pending',   value: stats.bookings - stats.confirmed, color: '#fcd34d', bg: 'rgba(217,119,6,0.1)',  border: '#92400e' },
              { label: 'Confirmed', value: stats.confirmed,                  color: '#6ee7b7', bg: 'rgba(5,150,105,0.1)',  border: '#065f46' },
              { label: 'Revenue',   value: `Rs.${stats.revenue}`,              color: '#c084fc', bg: 'rgba(124,58,237,0.1)', border: '#5b21b6' },
            ].map(item => (
              <div
                key={item.label}
                className="rounded-xl p-4 text-center"
                style={{ background: item.bg, border: `1px solid ${item.border}` }}
              >
                <p className="text-2xl font-bold" style={{ color: item.color }}>
                  {item.value}
                </p>
                <p className="text-xs mt-1" style={{ color: item.color, opacity: 0.7 }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
 
      </div>
    </div>
  );
}