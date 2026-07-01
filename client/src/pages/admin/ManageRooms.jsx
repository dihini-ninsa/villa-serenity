import { useEffect, useState } from 'react';
import api from '../../api/axios';
 
const EMPTY = {
  name: '', tier: 'non-luxury', hasAC: false,
  pricePerNight: '', maxGuests: 2, description: '',
  amenities: '', images: '',
};
 
const DEFAULT_IMAGES = {
  'non-luxury': [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
  ],
  vip: [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
  ],
};
 
const inputClass = [
  'w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition',
  'bg-[#1e1520] border-[#3d2040] text-white placeholder-[#6b5070]',
  'focus:ring-[#c084fc] focus:border-[#c084fc]',
].join(' ');
 
export default function ManageRooms() {
  const [rooms, setRooms]     = useState([]);
  const [form, setForm]       = useState(EMPTY);
  const [editId, setEditId]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg]         = useState({ text: '', type: '' });
 
  const fetchRooms = async () => {
    setFetching(true);
    try {
      const { data } = await api.get('/rooms');
      setRooms(data);
    } catch (err) {
      console.error('Fetch rooms error:', err.message);
    } finally {
      setFetching(false);
    }
  };
 
  useEffect(() => { fetchRooms(); }, []);
 
  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };
 
  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };
 
  const save = async () => {
    if (!form.name.trim())         return showMsg('Room name is required', 'error');
    if (!form.pricePerNight)       return showMsg('Price is required', 'error');
    if (!form.description.trim())  return showMsg('Description is required', 'error');
 
    setLoading(true);
    try {
      // Parse images — use defaults if empty
      const imageArr = form.images
        ? form.images.split('\n').map(s => s.trim()).filter(Boolean)
        : DEFAULT_IMAGES[form.tier] || [];
 
      const payload = {
        name:          form.name.trim(),
        tier:          form.tier,
        hasAC:         form.hasAC,
        pricePerNight: Number(form.pricePerNight),
        maxGuests:     Number(form.maxGuests) || 2,
        description:   form.description.trim(),
        amenities:     form.amenities
          ? form.amenities.split(',').map(a => a.trim()).filter(Boolean)
          : [],
        images:        imageArr,
        isAvailable:   true,
      };
 
      if (editId) {
        await api.put(`/rooms/${editId}`, payload);
        showMsg('✅ Room updated successfully!');
      } else {
        await api.post('/rooms', payload);
        showMsg('✅ Room created successfully!');
      }
 
      setForm(EMPTY);
      setEditId(null);
      fetchRooms();
    } catch (err) {
      console.error('Save room error:', err);
      showMsg('❌ ' + (err.response?.data?.message || 'Failed to save room. Make sure you are logged in as admin.'), 'error');
    } finally {
      setLoading(false);
    }
  };
 
  const deleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      showMsg('✅ Room deleted.');
      fetchRooms();
    } catch (err) {
      showMsg('❌ Failed to delete room.', 'error');
    }
  };
 
  const startEdit = (room) => {
    setForm({
      name:          room.name,
      tier:          room.tier,
      hasAC:         room.hasAC,
      pricePerNight: room.pricePerNight,
      maxGuests:     room.maxGuests,
      description:   room.description || '',
      amenities:     room.amenities?.join(', ') || '',
      images:        room.images?.join('\n') || '',
    });
    setEditId(room._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
 
  const cancelEdit = () => {
    setForm(EMPTY);
    setEditId(null);
  };
 
  const TIER_BADGE = {
    vip:          'bg-amber-900/40 text-amber-300 border border-amber-700',
    luxury:       'bg-purple-900/40 text-purple-300 border border-purple-700',
    'non-luxury': 'bg-gray-800 text-gray-300 border border-gray-600',
  };
 
  return (
    <div className="min-h-screen p-8" style={{ background: '#0d0a12' }}>
      <div className="max-w-5xl mx-auto">
 
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display,serif' }}>
              {editId ? 'Edit Room' : 'Add New Room'}
            </h1>
            <p className="text-purple-400 text-sm mt-1">Manage your villa rooms</p>
          </div>
        </div>
 
        {/* Message */}
        {msg.text && (
          <div
            className="px-4 py-3 rounded-xl mb-6 text-sm"
            style={{
              background: msg.type === 'error' ? 'rgba(127,29,29,0.3)' : 'rgba(5,150,105,0.2)',
              border: `1px solid ${msg.type === 'error' ? '#991b1b' : '#065f46'}`,
              color: msg.type === 'error' ? '#fca5a5' : '#6ee7b7',
            }}
          >
            {msg.text}
          </div>
        )}
 
        {/* Form */}
        <div
          className="rounded-2xl p-6 mb-10"
          style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}
        >
          <h2 className="text-lg font-semibold text-white mb-5">Room Details</h2>
 
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-[#d8b4fe] block mb-1">Room Name *</label>
              <input name="name" value={form.name} onChange={handle}
                placeholder="e.g. Garden Suite" className={inputClass}/>
            </div>
            <div>
              <label className="text-xs font-medium text-[#d8b4fe] block mb-1">Tier *</label>
              <select name="tier" value={form.tier} onChange={handle} className={inputClass}>
                <option value="non-luxury">Non-Luxury</option>
                <option value="luxury">Luxury</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-[#d8b4fe] block mb-1">Price per Night (Rs.) *</label>
              <input name="pricePerNight" type="number" value={form.pricePerNight}
                onChange={handle} placeholder="120" className={inputClass}/>
            </div>
            <div>
              <label className="text-xs font-medium text-[#d8b4fe] block mb-1">Max Guests</label>
              <input name="maxGuests" type="number" min="1" max="10"
                value={form.maxGuests} onChange={handle} className={inputClass}/>
            </div>
          </div>
 
          <div className="mb-4">
            <label className="text-xs font-medium text-[#d8b4fe] block mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handle}
              rows={3} placeholder="Describe the room..." className={inputClass}/>
          </div>
 
          <div className="mb-4">
            <label className="text-xs font-medium text-[#d8b4fe] block mb-1">
              Amenities <span className="text-purple-500">(comma separated)</span>
            </label>
            <input name="amenities" value={form.amenities} onChange={handle}
              placeholder="WiFi, Pool, Breakfast, Mini Bar, A/C" className={inputClass}/>
          </div>
 
          <div className="mb-5">
            <label className="text-xs font-medium text-[#d8b4fe] block mb-1">
              Image URLs <span className="text-purple-500">(one per line — leave empty to use defaults)</span>
            </label>
            <textarea name="images" value={form.images} onChange={handle}
              rows={3} className={inputClass}
              placeholder={'https://images.unsplash.com/photo-xxx?w=800\nhttps://images.unsplash.com/photo-yyy?w=800'}/>
            <p className="text-purple-600 text-xs mt-1">
              💡 Tip: Go to unsplash.com, find a room photo, copy its URL and paste here
            </p>
          </div>
 
          {/* AC toggle */}
          <label className="flex items-center gap-3 cursor-pointer mb-6">
            <div
              onClick={() => setForm(prev => ({ ...prev, hasAC: !prev.hasAC }))}
              className="w-11 h-6 rounded-full transition-colors relative"
              style={{ background: form.hasAC ? '#7c3aed' : '#3d2040' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                style={{ transform: form.hasAC ? 'translateX(22px)' : 'translateX(2px)' }}
              />
            </div>
            <span className="text-sm text-purple-200">
              {form.hasAC ? '❄️ Air Conditioning — ON' : '🌿 Air Conditioning — OFF'}
            </span>
          </label>
 
          {/* Note: VIP must have AC */}
          {form.tier === 'vip' && !form.hasAC && (
            <p className="text-amber-400 text-xs mb-4 p-2 rounded-lg" style={{ background: 'rgba(217,119,6,0.1)' }}>
              ⚠️ VIP rooms should have A/C. Please enable Air Conditioning for VIP tier.
            </p>
          )}
 
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={loading}
              className="text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
            >
              {loading ? 'Saving...' : editId ? '✏️ Update Room' : '➕ Add Room'}
            </button>
            {editId && (
              <button
                onClick={cancelEdit}
                className="px-6 py-2.5 rounded-xl text-sm border text-purple-300 hover:bg-purple-900/20 transition"
                style={{ borderColor: '#3d2040' }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
 
        {/* Room list */}
        <h2 className="text-xl font-bold text-white mb-4">
          All Rooms <span className="text-purple-500 text-base font-normal">({rooms.length})</span>
        </h2>
 
        {fetching ? (
          <div className="text-center py-16 text-purple-400">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}
          >
            <div className="text-4xl mb-3">🏠</div>
            <p className="text-purple-400">No rooms yet. Add your first room above.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {rooms.map(room => (
              <div
                key={room._id}
                className="rounded-2xl overflow-hidden flex"
                style={{ background: '#1a1025', border: '1px solid #2d1f3d' }}
              >
                {/* Thumbnail */}
                <div className="w-28 flex-shrink-0 bg-purple-900/20">
                  {room.images?.[0] ? (
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                  )}
                </div>
 
                {/* Info */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TIER_BADGE[room.tier]}`}>
                        {room.tier}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        room.hasAC
                          ? 'bg-blue-900/40 text-blue-300 border border-blue-700'
                          : 'bg-orange-900/40 text-orange-300 border border-orange-700'
                      }`}>
                        {room.hasAC ? '❄️ A/C' : '🌿 Non-A/C'}
                      </span>
                    </div>
                    <p className="font-semibold text-white text-sm">{room.name}</p>
                    <p className="text-purple-400 text-xs mt-0.5">
                      Rs.{room.pricePerNight}/night · {room.maxGuests} guests
                    </p>
                  </div>
                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => startEdit(room)}
                      className="text-xs font-medium text-purple-300 hover:text-white transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteRoom(room._id)}
                      className="text-xs font-medium text-red-400 hover:text-red-300 transition"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}