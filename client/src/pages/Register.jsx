import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
 
function Field({ name, label, type, placeholder, value, onChange, error, hint }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1 text-[#d8b4fe]">{label}</label>
      <input
        name={name}
        type={type || 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className={[
          'w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition',
          'bg-[#1e1520] text-white placeholder-[#6b5070]',
          error
            ? 'border-red-500 focus:ring-red-400'
            : 'border-[#3d2040] focus:ring-[#c084fc] focus:border-[#c084fc]',
        ].join(' ')}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-purple-500 text-xs mt-1">{hint}</p>}
    </div>
  );
}
 
export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
 
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors]           = useState({});
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState('');
 
  const validate = () => {
    const e = {};
    if (!form.fullName.trim())
      e.fullName = 'Full name is required';
    if (!form.email.trim())
      e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address';
    if (!/^\d{10}$/.test(form.phone))
      e.phone = 'Phone must be exactly 10 digits';
    const nic = form.nic.trim();
    if (!/^\d{12}$/.test(nic) && !/^\d{9}[Vv]$/.test(nic))
      e.nic = 'Enter 12 digits for new NIC, or 9 digits + V for old NIC';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword)
      e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    return e;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };
 
  const handlePhone = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm(prev => ({ ...prev, phone: val }));
    setErrors(prev => ({ ...prev, phone: '' }));
  };
 
  const handleNic = (e) => {
    const raw = e.target.value;
 
    // If user typed V anywhere treat as old NIC: 9 digits + V only
    if (/[Vv]/.test(raw)) {
      const digits = raw.replace(/[^0-9]/g, '');
      if (digits.length > 9) return; // block typing more than 9 digits before V
      const val = digits + 'V';
      setForm(prev => ({ ...prev, nic: val }));
      setErrors(prev => ({ ...prev, nic: '' }));
      return;
    }
 
    // Pure digits — max 12
    const digits = raw.replace(/\D/g, '');
    if (digits.length > 12) return; // hard block at 12
    setForm(prev => ({ ...prev, nic: digits }));
    setErrors(prev => ({ ...prev, nic: '' }));
  };
 
  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      const { data } = await api.post('/auth/register', {
        fullName: form.fullName,
        email:    form.email,
        phone:    form.phone,
        nic:      form.nic,
        password: form.password,
      });
      login(data.user, data.token);
      navigate('/login');
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex" style={{ background: '#0d0a12' }}>
 
      {/* Left image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=900"
          alt="Luxury Villa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom right,rgba(13,10,18,0.88),rgba(88,28,135,0.45))' }}
        />
        <div className="relative z-10 flex flex-col justify-end p-12 text-white">
          <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display,serif' }}>
            Begin Your Luxury Journey
          </h2>
          <p className="text-purple-200 text-sm leading-relaxed mb-6">
            Join thousands of guests who have experienced the finest hospitality
            Sri Lanka has to offer. Create your account to unlock exclusive rates
            and personalised AI-powered recommendations.
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[['50+', 'Rooms'], ['5000+', 'Guests'], ['10+', 'Years']].map(([n, l]) => (
              <div
                key={l}
                className="rounded-xl p-3"
                style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}
              >
                <p className="font-bold text-lg">{n}</p>
                <p className="text-purple-300 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* Right form */}
      <div
        className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto"
        style={{ background: '#0d0a12' }}
      >
        <div className="w-full max-w-md py-8">
 
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
            >
              VS
            </div>
            <span className="font-bold text-white">Villa Serenity</span>
          </Link>
 
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Playfair Display,serif' }}>
            Create Account
          </h1>
          <p className="text-sm mb-6 text-purple-300">Fill in your details to get started</p>
 
          {serverError && (
            <div
              className="text-red-400 text-sm px-4 py-3 rounded-xl mb-5 border border-red-800"
              style={{ background: 'rgba(127,29,29,0.2)' }}
            >
              {serverError}
            </div>
          )}
 
          <form onSubmit={submit} className="flex flex-col gap-4">
 
            <Field
              name="fullName" label="Full Name"
              placeholder="John Fernando"
              value={form.fullName} onChange={handleChange} error={errors.fullName}
            />
 
            <Field
              name="email" label="Email Address" type="email"
              placeholder="john@email.com"
              value={form.email} onChange={handleChange} error={errors.email}
            />
 
            {/* Phone */}
            <div>
              <label className="text-xs font-medium block mb-1 text-[#d8b4fe]">Phone Number</label>
              <input
                name="phone"
                type="tel"
                placeholder="0771234567"
                value={form.phone}
                onChange={handlePhone}
                maxLength={10}
                autoComplete="off"
                className={[
                  'w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition',
                  'bg-[#1e1520] text-white placeholder-[#6b5070]',
                  errors.phone
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-[#3d2040] focus:ring-[#c084fc] focus:border-[#c084fc]',
                ].join(' ')}
              />
              {errors.phone
                ? <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                : <p className="text-purple-500 text-xs mt-1">Must be exactly 10 digits</p>}
            </div>
 
            {/* NIC */}
            <div>
              <label className="text-xs font-medium block mb-1 text-[#d8b4fe]">NIC Number</label>
              <input
                name="nic"
                type="text"
                placeholder="200012345678  or  991234567V"
                value={form.nic}
                onChange={handleNic}
                maxLength={13}
                autoComplete="off"
                className={[
                  'w-full rounded-xl px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition',
                  'bg-[#1e1520] text-white placeholder-[#6b5070]',
                  errors.nic
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-[#3d2040] focus:ring-[#c084fc] focus:border-[#c084fc]',
                ].join(' ')}
              />
              {errors.nic
                ? <p className="text-red-400 text-xs mt-1">{errors.nic}</p>
                : <p className="text-purple-500 text-xs mt-1">
                    New NIC: 12 digits &nbsp;|&nbsp; Old NIC: 9 digits + V &nbsp;(e.g. 991234567V)
                  </p>}
            </div>
 
            <Field
              name="password" label="Password" type="password"
              placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange} error={errors.password}
              hint="At least 6 characters"
            />
 
            <Field
              name="confirmPassword" label="Confirm Password" type="password"
              placeholder="Repeat your password"
              value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
            />
 
            <button
              type="submit"
              disabled={loading}
              className="text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 mt-2 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
 
          </form>
 
          <p className="text-center text-sm mt-6 text-purple-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-purple-300 hover:text-white transition">
              Sign in
            </Link>
          </p>
 
        </div>
      </div>
    </div>
  );
}