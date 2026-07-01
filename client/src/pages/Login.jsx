import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Login() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate(data.user.role === 'admin' ? '/admin' : '/rooms');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = [
    'w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition',
    'bg-[#1e1520] border-[#3d2040] text-white placeholder-[#6b5070]',
    'focus:ring-[#c084fc] focus:border-[#c084fc]',
  ].join(' ');

  return (
    <div className="min-h-screen flex" style={{ background: '#0d0a12' }}>

      {/* Left — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8" style={{ background: '#0d0a12' }}>
        <div className="w-full max-w-md">

          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>VS</div>
            <span className="font-bold text-white">Villa Serenity</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display,serif' }}>
            Welcome Back
          </h1>
          <p className="text-sm mb-8 text-purple-300">Sign in to your Villa Serenity account</p>

          {error && (
            <div className="text-red-400 text-sm px-4 py-3 rounded-xl mb-5 border border-red-800"
              style={{ background: 'rgba(127,29,29,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium block mb-1 text-[#d8b4fe]">Email Address</label>
              <input name="email" type="email" placeholder="john@email.com"
                value={form.email} onChange={handleChange} required
                className={inputClass}/>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1 text-[#d8b4fe]">Password</label>
              <input name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required
                className={inputClass}/>
            </div>
            <button type="submit" disabled={loading}
              className="text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 mt-2 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-purple-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-purple-300 hover:text-white transition">
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* Right — villa image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900"
          alt="Sri Lanka Villa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top left,rgba(13,10,18,0.9),rgba(88,28,135,0.35))' }}/>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <span className="text-purple-300 text-xs uppercase tracking-widest mb-4">Sri Lanka's Finest</span>
          <h2 className="text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display,serif' }}>
            A World of Luxury<br/>
            <span className="text-purple-300" style={{ fontStyle: 'italic' }}>Awaits You</span>
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed mb-8">
            Sri Lanka, the Pearl of the Indian Ocean, is home to breathtaking landscapes.
            Villa Serenity places you at the heart of this paradise surrounded by tropical
            gardens, ancient culture, and unmatched natural beauty.
          </p>
          <div className="space-y-3">
            {[
              'Luxury rooms with A/C and Non-A/C options',
              'Exclusive VIP suites with private amenities',
              'Stunning garden views and serene surroundings',
              'Personalized service and concierge assistance',
              'Easy online booking and secure payment',
            ].map(t => (
              <div key={t} className="flex items-center gap-3 text-sm text-purple-200">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ background: 'rgba(139,92,246,0.3)' }}>✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}