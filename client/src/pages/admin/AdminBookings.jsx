import { useEffect, useState } from 'react';
import api from '../../api/axios';

const STATUS_STYLE = {
  confirmed: { bg: 'rgba(5,150,105,0.15)',  border: '#065f46', text: '#6ee7b7', label: 'Confirmed' },
  pending:   { bg: 'rgba(217,119,6,0.15)',  border: '#92400e', text: '#fcd34d', label: 'Pending'   },
  cancelled: { bg: 'rgba(127,29,29,0.15)',  border: '#991b1b', text: '#fca5a5', label: 'Cancelled' },
};

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [msg, setMsg]           = useState({ text: '', type: '' });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings/all');
      setBookings(data);
    } catch (err) {
      console.error('Bookings fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const confirmBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/confirm`);
      showMsg('✅ Booking confirmed!', 'success');
      fetchBookings();
    } catch (err) {
      showMsg('❌ Failed to confirm: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      showMsg('Booking cancelled.', 'success');
      fetchBookings();
    } catch (err) {
      showMsg('❌ Failed to cancel: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const filtered = filter === 'all'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const totals = {
    all:       bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="min-h-screen p-8" style={{ background: '#0d0a12' }}>
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display,serif' }}>
            All Bookings
          </h1>
          <p className="text-purple-400 text-sm mt-1">
            {bookings.length} total bookings · Rs.{totalRevenue} confirmed revenue
          </p>
        </div>

        {msg.text && (
          <div className="px-4 py-3 rounded-xl mb-4 text-sm"
            style={{
              background: msg.type === 'error' ? 'rgba(127,29,29,0.3)' : 'rgba(5,150,105,0.2)',
              border: `1px solid ${msg.type === 'error' ? '#991b1b' : '#065f46'}`,
              color: msg.type === 'error' ? '#fca5a5' : '#6ee7b7',
            }}>
            {msg.text}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'confirmed', 'pending', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition capitalize"
              style={{
                background: filter === s ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#1a1025',
                border: `1px solid ${filter === s ? '#7c3aed' : '#2d1f3d'}`,
                color: filter === s ? 'white' : '#a78bfa',
              }}>
              {s} ({totals[s]})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-purple-400">Loading bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 rounded-2xl"
            style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}>
            <div className="text-4xl mb-3">📋</div>
            <p className="text-purple-400">No {filter === 'all' ? '' : filter} bookings found.</p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}>

            {/* Header */}
            <div className="grid gap-4 px-6 py-3 text-xs font-medium uppercase tracking-wider"
              style={{
                background: '#130e1c',
                color: '#7c3aed',
                gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 0.8fr 1.5fr',
              }}>
              <div>Guest</div>
              <div>Room</div>
              <div>Check-in</div>
              <div>Check-out</div>
              <div>Total</div>
              <div>Actions</div>
            </div>

            {/* Rows */}
            {filtered.map((b, i) => {
              const style = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
              return (
                <div key={b._id}
                  className="grid gap-4 px-6 py-4 items-center text-sm transition hover:bg-white/5"
                  style={{
                    gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 0.8fr 1.5fr',
                    borderTop: i > 0 ? '1px solid #1e1530' : 'none',
                  }}>

                  {/* Guest */}
                  <div>
                    <p className="text-white font-medium">{b.user?.fullName || 'Guest'}</p>
                    <p className="text-purple-500 text-xs truncate">{b.user?.email || ''}</p>
                  </div>

                  {/* Room */}
                  <div>
                    <p className="text-white">{b.room?.name || 'N/A'}</p>
                    <p className="text-purple-500 text-xs capitalize">{b.room?.tier || ''}</p>
                  </div>

                  {/* Dates */}
                  <div className="text-purple-300">
                    {b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '—'}
                  </div>
                  <div className="text-purple-300">
                    {b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '—'}
                  </div>

                  {/* Total */}
                  <div className="font-semibold text-white">Rs.{b.totalPrice || 0}</div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status badge */}
                    <span className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text }}>
                      {style.label}
                    </span>

                    {/* Confirm button — only for pending */}
                    {b.status === 'pending' && (
                      <button
                        onClick={() => confirmBooking(b._id)}
                        className="text-xs px-2 py-1 rounded-lg font-medium transition hover:opacity-80"
                        style={{ background: 'rgba(5,150,105,0.2)', border: '1px solid #065f46', color: '#6ee7b7' }}>
                        ✓ Confirm
                      </button>
                    )}

                    {/* Cancel button — only for non-cancelled */}
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelBooking(b._id)}
                        className="text-xs px-2 py-1 rounded-lg font-medium transition hover:opacity-80"
                        style={{ background: 'rgba(127,29,29,0.2)', border: '1px solid #991b1b', color: '#fca5a5' }}>
                        ✕ Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}