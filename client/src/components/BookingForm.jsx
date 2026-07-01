import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const STEPS = ['Select Dates', 'Confirm Details', 'Payment'];

export default function BookingForm({ room }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState({ checkIn:'', checkOut:'', guests:1 });
  const [card, setCard]     = useState({ name:'', number:'', expiry:'', cvv:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [done, setDone]     = useState(false);

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000))
    : 0;
  const total = nights * room.pricePerNight;

  const nextStep = () => {
    if (!user) return navigate('/login');
    if (!form.checkIn || !form.checkOut) return setError('Please select check-in and check-out dates.');
    if (nights < 1) return setError('Check-out must be after check-in.');
    setError('');
    setStep(s => s + 1);
  };

  const confirmBooking = async () => {
    if (!card.name || !card.number || !card.expiry || !card.cvv)
      return setError('Please fill in all payment details.');
    setLoading(true);
    setError('');
    try {
      await api.post('/bookings', {
        roomId: room._id,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests,
      });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally { setLoading(false); }
  };

  const btnStyle = { background:'#6b2d2d', color:'white' };

  if (done) return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{background:'#f5e6d8'}}>✅</div>
      <h3 className="font-bold text-[#3d1a1a] text-lg mb-2">Booking Confirmed!</h3>
      <p className="text-[#8b6060] text-sm mb-2">{room.name}</p>
      <p className="text-[#8b6060] text-xs mb-4">{form.checkIn} → {form.checkOut} · {nights} nights · Rs.{total}</p>
      <p className="text-xs text-[#8b6060] mb-4">A confirmation email has been sent to {user?.email}</p>
      <button onClick={() => navigate('/my-bookings')}
        className="text-sm font-medium px-5 py-2 rounded-xl text-white" style={btnStyle}>
        View My Bookings
      </button>
    </div>
  );

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold transition
              ${i <= step ? 'text-white' : 'text-[#8b6060] bg-[#f5e6d8]'}`}
              style={i <= step ? btnStyle : {}}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-[#3d1a1a] font-medium' : 'text-[#8b9090]'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-[#e8d5c4] mx-1"/>}
          </div>
        ))}
      </div>

      {error && <p className="text-red-500 text-xs mb-3 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      {/* Step 0: dates */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[#6b2d2d] block mb-1">Check-in Date</label>
            <input type="date" min={new Date().toISOString().split('T')[0]}
              value={form.checkIn}
              onChange={e => setForm({...form, checkIn: e.target.value})}
              className="w-full border border-[#e8d5c4] bg-[#fdf8f5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a882]"/>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b2d2d] block mb-1">Check-out Date</label>
            <input type="date" min={form.checkIn || new Date().toISOString().split('T')[0]}
              value={form.checkOut}
              onChange={e => setForm({...form, checkOut: e.target.value})}
              className="w-full border border-[#e8d5c4] bg-[#fdf8f5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a882]"/>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b2d2d] block mb-1">Number of Guests</label>
            <input type="number" min={1} max={room.maxGuests}
              value={form.guests}
              onChange={e => setForm({...form, guests: Number(e.target.value)})}
              className="w-full border border-[#e8d5c4] bg-[#fdf8f5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a882]"/>
          </div>
          {nights > 0 && (
            <div className="rounded-xl p-4 text-sm" style={{background:'#f5e6d8'}}>
              <div className="flex justify-between text-[#6b4040]">
                <span>Rs.{room.pricePerNight} × {nights} nights</span>
                <span>Rs.{total}</span>
              </div>
              <div className="flex justify-between font-bold text-[#3d1a1a] mt-1 pt-1 border-t border-[#e8c4a0]">
                <span>Total</span><span>Rs.{total}</span>
              </div>
            </div>
          )}
          <button onClick={nextStep}
            className="w-full py-3 rounded-xl font-semibold text-sm transition" style={btnStyle}>
            {user ? 'Continue to Confirmation' : 'Login to Book'}
          </button>
        </div>
      )}

      {/* Step 1: confirm */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 border border-[#e8d5c4]" style={{background:'#fdf8f5'}}>
            <h4 className="font-semibold text-[#3d1a1a] mb-3">Booking Summary</h4>
            {[
              ['Room', room.name],
              ['Tier', room.tier],
              ['Check-in', form.checkIn],
              ['Check-out', form.checkOut],
              ['Guests', form.guests],
              ['Nights', nights],
              ['Total', `Rs.${total}`],
            ].map(([k,v]) => (
              <div key={k} className="flex justify-between text-sm py-1.5 border-b border-[#f0e0d0] last:border-0">
                <span className="text-[#8b6060]">{k}</span>
                <span className="font-medium text-[#3d1a1a] capitalize">{v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4 border border-[#e8d5c4]" style={{background:'#fdf8f5'}}>
            <h4 className="font-semibold text-[#3d1a1a] mb-2 text-sm">Guest Details</h4>
            <p className="text-sm text-[#6b4040]">{user?.fullName}</p>
            <p className="text-xs text-[#8b6060]">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(0)}
              className="flex-1 py-3 rounded-xl text-sm border border-[#e8d5c4] text-[#6b4040] hover:bg-[#fdf0e8] transition">
              Back
            </button>
            <button onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition text-white" style={btnStyle}>
              Proceed to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 2: payment */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="rounded-xl p-4 text-sm font-medium text-center text-white mb-2"
            style={{background:'linear-gradient(135deg,#3d1a1a,#6b2d2d)'}}>
            <p className="text-[#e8c4a0] text-xs mb-1">Total Amount Due</p>
            <p className="text-2xl font-bold">Rs.{total}</p>
            <p className="text-xs text-[#d4a8a8] mt-1">{nights} nights · {room.name}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-[#6b2d2d] block mb-1">Name on Card</label>
            <input placeholder="John Fernando" value={card.name}
              onChange={e => setCard({...card, name: e.target.value})}
              className="w-full border border-[#e8d5c4] bg-[#fdf8f5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a882]"/>
          </div>
          <div>
            <label className="text-xs font-medium text-[#6b2d2d] block mb-1">Card Number</label>
            <input placeholder="1234 5678 9012 3456" maxLength={19} value={card.number}
              onChange={e => setCard({...card, number: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim()})}
              className="w-full border border-[#e8d5c4] bg-[#fdf8f5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a882] tracking-widest"/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#6b2d2d] block mb-1">Expiry Date</label>
              <input placeholder="MM/YY" maxLength={5} value={card.expiry}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g,'');
                  if (v.length >= 2) v = v.slice(0,2) + '/' + v.slice(2,4);
                  setCard({...card, expiry: v});
                }}
                className="w-full border border-[#e8d5c4] bg-[#fdf8f5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a882]"/>
            </div>
            <div>
              <label className="text-xs font-medium text-[#6b2d2d] block mb-1">CVV</label>
              <input placeholder="123" maxLength={3} type="password" value={card.cvv}
                onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,'')})}
                className="w-full border border-[#e8d5c4] bg-[#fdf8f5] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a882]"/>
            </div>
          </div>

          <p className="text-xs text-center text-[#8b9090]">🔒 Your payment is secure and encrypted</p>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl text-sm border border-[#e8d5c4] text-[#6b4040] hover:bg-[#fdf0e8] transition">
              Back
            </button>
            <button onClick={confirmBooking} disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold text-sm transition text-white disabled:opacity-50" style={btnStyle}>
              {loading ? 'Processing...' : `Pay Rs.${total}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}