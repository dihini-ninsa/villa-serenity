import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import BookingForm from '../components/BookingForm';

const TIER_STYLES = {
  vip:          'bg-amber-100 text-amber-800',
  luxury:       'bg-rose-100 text-rose-800',
  'non-luxury': 'bg-stone-100 text-stone-700',
};

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    api.get(`/rooms/${id}`)
      .then(({ data }) => setRoom(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center">
      <div className="text-rose-400 text-center">
        <div className="text-4xl mb-3 animate-pulse">🏠</div>
        <p>Loading room details...</p>
      </div>
    </div>
  );

  if (!room) return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center text-rose-400">
      Room not found.
    </div>
  );

  return (
    <div className="bg-rose-50 min-h-screen">
      {/* Image gallery */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {room.images?.length > 0 ? (
            <div className="space-y-3">
              <div className="h-96 rounded-3xl overflow-hidden">
                <img src={room.images[activeImg]} alt={room.name} className="w-full h-full object-cover"/>
              </div>
              {room.images.length > 1 && (
                <div className="flex gap-3">
                  {room.images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImg(i)}
                      className={`h-20 w-28 rounded-xl overflow-hidden border-2 transition ${
                        activeImg === i ? 'border-rose-600' : 'border-transparent'
                      }`}>
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 rounded-3xl bg-rose-100 flex items-center justify-center text-8xl">🏠</div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">
        {/* Left: details */}
        <div className="md:col-span-2 space-y-8">
          {/* Badges + title */}
          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${TIER_STYLES[room.tier]}`}>
                {room.tier}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                room.hasAC ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {room.hasAC ? '❄️ Air Conditioned' : '🌿 Non-A/C'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-rose-900 mb-3" style={{fontFamily:'Playfair Display,serif'}}>{room.name}</h1>
            <p className="text-rose-500 leading-relaxed">{room.description}</p>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              ['👥','Max Guests', `Rs.${room.maxGuests} guests`],
              ['💰','Price',      `Rs.${room.pricePerNight} / night`],
              ['🏠','Room Type',  room.tier],
              ['❄️','Climate',    room.hasAC ? 'Air Conditioned' : 'Natural Ventilation'],
            ].map(([icon, label, val]) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-rose-100">
                <p className="text-xl mb-1">{icon}</p>
                <p className="text-xs text-rose-400 font-medium">{label}</p>
                <p className="text-rose-800 font-semibold capitalize">{val}</p>
              </div>
            ))}
          </div>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-rose-100">
              <h3 className="font-bold text-rose-900 mb-4" style={{fontFamily:'Playfair Display,serif'}}>Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map(a => (
                  <span key={a} className="text-sm bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-full">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: booking form */}
        <div>
          <div className="sticky top-24 bg-white rounded-3xl border border-rose-100 shadow-md p-6">
            <p className="text-3xl font-bold text-rose-700 mb-1" style={{fontFamily:'Playfair Display,serif'}}>
              Rs.{room.pricePerNight}
              <span className="text-base font-normal text-rose-400"> / night</span>
            </p>
            <p className="text-rose-400 text-xs mb-5">Taxes & fees included</p>
            <BookingForm room={room} />
          </div>
        </div>
      </div>
    </div>
  );
}