import { useEffect, useState } from 'react';
import api from '../api/axios';

const STATUS_COLORS = {
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-500',
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);

  const fetchBookings = () => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBookings(); }, []);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel.');
    }
  };

  if (loading) return <div className="text-center py-32 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-5xl mb-4">📋</div>
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map(b => (
            <div key={b._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{b.room?.name}</h3>
                  <p className="text-gray-400 text-sm capitalize">{b.room?.tier}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[b.status]}`}>
                  {b.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Check-in</p>
                  <p>{new Date(b.checkIn).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Check-out</p>
                  <p>{new Date(b.checkOut).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-semibold text-green-700">Rs.{b.totalPrice}</p>
                </div>
              </div>

              {b.status !== 'cancelled' && (
                <button onClick={() => cancel(b._id)}
                  className="text-sm text-red-500 hover:text-red-700 transition">
                  Cancel booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}