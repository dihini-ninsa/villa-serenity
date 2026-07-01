import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{ background: '#0d0a12', borderBottom: '1px solid #2d1f3d' }} className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>VS</div>
          <div>
            <p className="font-semibold text-white text-sm leading-none">Villa Serenity</p>
            <p className="text-purple-400 text-xs">Sri Lanka</p>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/"          className="text-purple-200 hover:text-white transition font-medium">Home</Link>
          <Link to="/rooms"     className="text-purple-200 hover:text-white transition font-medium">Rooms</Link>

          {!user ? (
            <>
              <Link to="/login"    className="text-purple-200 hover:text-white transition font-medium">Login</Link>
              <Link to="/register"
                className="text-white px-5 py-2 rounded-full text-sm font-medium transition"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === 'admin'
                ? <Link to="/admin"       className="text-purple-200 hover:text-white transition font-medium">Dashboard</Link>
                : <Link to="/my-bookings" className="text-purple-200 hover:text-white transition font-medium">My Bookings</Link>
              }
              <span className="text-purple-500 text-xs">{user.fullName}</span>
              <button onClick={handleLogout} className="text-sm text-purple-400 hover:text-red-400 transition">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}