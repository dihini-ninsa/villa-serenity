import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import RoomCard from '../components/RoomCard';

const TIERS = [
  { value:'all',        label:'All Rooms' },
  { value:'non-luxury', label:'Non-Luxury' },
  { value:'luxury',     label:'Luxury' },
  { value:'vip',        label:'VIP' },
];

export default function Rooms() {
  const [rooms, setRooms]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const tierParam = searchParams.get('tier') || 'all';
  const acParam   = searchParams.get('ac')   || 'all';

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const params = {};
        if (tierParam !== 'all') params.tier = tierParam;
        if (acParam   !== 'all') params.ac   = acParam;
        const { data } = await api.get('/rooms', { params });
        setRooms(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchRooms();
  }, [tierParam, acParam]);

  const setFilter = (key, val) => {
    const next = new URLSearchParams(searchParams);
    next.set(key, val);
    setSearchParams(next);
  };

  return (
    <div className="bg-rose-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-900 to-rose-700 text-white py-16 px-6 text-center">
        <span className="text-rose-300 text-xs uppercase tracking-widest">Accommodation</span>
        <h1 className="text-4xl font-bold mt-2" style={{fontFamily:'Playfair Display,serif'}}>Our Rooms & Suites</h1>
        <p className="text-rose-200 mt-3 max-w-xl mx-auto text-sm">
          From cozy garden rooms to exclusive VIP penthouses find your perfect stay.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 items-center">
          <span className="text-rose-500 text-sm font-medium mr-2">Tier:</span>
          {TIERS.map(t => (
            <button key={t.value} onClick={() => setFilter('tier', t.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                tierParam === t.value
                  ? 'bg-rose-700 text-white border-rose-700'
                  : 'bg-white text-rose-700 border-rose-200 hover:border-rose-400'
              }`}>
              {t.label}
            </button>
          ))}
          <span className="text-rose-300 mx-2">|</span>
          <span className="text-rose-500 text-sm font-medium mr-2">Climate:</span>
          {[['all','All'],['true','A/C'],['false','Non-A/C']].map(([val,label]) => (
            <button key={val} onClick={() => setFilter('ac', val)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                acParam === val
                  ? 'bg-rose-700 text-white border-rose-700'
                  : 'bg-white text-rose-700 border-rose-200 hover:border-rose-400'
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="rounded-2xl bg-rose-100 animate-pulse h-80"/>
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-32 text-rose-400">
            <div className="text-5xl mb-4">🏠</div>
            <p>No rooms found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rooms.map(room => <RoomCard key={room._id} room={room} />)}
          </div>
        )}
      </div>
    </div>
  );
}