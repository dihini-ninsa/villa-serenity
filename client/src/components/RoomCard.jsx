import { Link } from 'react-router-dom';

const TIER_STYLES = {
  vip:          { badge:'bg-amber-100 text-amber-800',  label:'VIP' },
  luxury:       { badge:'bg-rose-100 text-rose-800',    label:'Luxury' },
  'non-luxury': { badge:'bg-stone-100 text-stone-700',  label:'Non-Luxury' },
};

export default function RoomCard({ room }) {
  const tier = TIER_STYLES[room.tier] || TIER_STYLES['non-luxury'];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-rose-100 overflow-hidden hover:shadow-xl transition duration-300 group">
      {/* Image */}
      <div className="h-52 bg-rose-100 overflow-hidden relative">
        {room.images?.[0]
          ? <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
          : <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
        }
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${tier.badge}`}>{tier.label}</span>
          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
            room.hasAC ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
          }`}>{room.hasAC ? '❄️ A/C' : '🌿 Non-A/C'}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-rose-900 text-lg mb-1" style={{fontFamily:'Playfair Display,serif'}}>{room.name}</h3>
        <p className="text-rose-400 text-sm mb-4 line-clamp-2">{room.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-rose-700">Rs.{room.pricePerNight}</span>
            <span className="text-rose-400 text-xs"> / night</span>
          </div>
          <Link to={`/rooms/${room._id}`}
            className="bg-rose-700 text-white text-sm px-5 py-2 rounded-full hover:bg-rose-800 transition font-medium">
            View Room
          </Link>
        </div>
      </div>
    </div>
  );
}