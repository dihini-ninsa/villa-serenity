import { Link } from 'react-router-dom';

const villas = [
  { img: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=600', label: 'Ocean View Villa' },
  { img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', label: 'Garden Suite' },
  { img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600', label: 'VIP Penthouse' },
  { img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', label: 'Luxury Pool Room' },
];

const features = [
  { icon: '🌿', title: 'Nature & Serenity',  desc: 'Surrounded by lush tropical gardens and the sound of nature.' },
  { icon: '👑', title: 'VIP Experience',      desc: 'Exclusive VIP suites with personal butler and private amenities.' },
  { icon: '❄️', title: 'Comfort & Climate',   desc: 'Choose between air conditioned or naturally ventilated rooms.' },
  { icon: '🍽️', title: 'Fine Dining',         desc: 'On-site restaurant serving authentic Sri Lankan and international cuisine.' },
];

export default function Home() {
  return (
    <div className="bg-[#fdf6f0] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{background:'linear-gradient(135deg,#3d1a1a 0%,#6b2d2d 40%,#8b4a4a 100%)'}}>
        <div className="absolute inset-0 opacity-25"
          style={{backgroundImage:"url('https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=1400')",backgroundSize:'cover',backgroundPosition:'center'}}/>
        <div className="relative max-w-6xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#e8c4a0] text-xs uppercase tracking-widest font-medium">Welcome to Villa Serenity</span>
            <h1 className="text-5xl md:text-6xl font-bold mt-3 mb-6 leading-tight text-white">
              Experience <br/>
              <span className="text-[#e8c4a0]" style={{fontStyle:'italic'}}>Luxury Living</span><br/>
              in Sri Lanka
            </h1>
            <p className="text-[#d4a8a8] text-lg mb-8 leading-relaxed">
              Nestled in the heart of Sri Lanka, Villa Serenity offers an unmatched blend of
              traditional elegance and modern comfort from cozy garden rooms to exclusive VIP suites.
            </p>
            <div className="flex gap-4 flex-wrap">
  <Link to="/rooms"
    className="bg-[#e8c4a0] text-[#3d1a1a] font-semibold px-7 py-3 rounded-full hover:bg-[#d4a882] transition shadow-lg">
    Explore Rooms
  </Link>
</div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3">
            <div className="col-span-2 h-48 rounded-2xl overflow-hidden shadow-2xl">
              <img src={villas[0].img} alt={villas[0].label} className="w-full h-full object-cover hover:scale-105 transition duration-500"/>
            </div>
            {villas.slice(1,3).map((v,i) => (
              <div key={i} className="h-36 rounded-2xl overflow-hidden shadow-xl">
                <img src={v.img} alt={v.label} className="w-full h-full object-cover hover:scale-105 transition duration-500"/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#8b4a4a] text-xs uppercase tracking-widest font-semibold">About Us</span>
            <h2 className="text-4xl font-bold text-[#3d1a1a] mt-2 mb-6">
              A Sanctuary of <span className="text-[#8b4a4a]" style={{fontStyle:'italic'}}>Elegance</span>
            </h2>
            <p className="text-[#6b4040] leading-relaxed mb-4">
              Villa Serenity is a premier luxury villa resort located in the cultural heartland of Sri Lanka.
              Established with a vision to offer world class hospitality, we combine the warmth of Sri Lankan
              tradition with the finest modern amenities.
            </p>
            <p className="text-[#6b4040] leading-relaxed mb-8">
              Whether you seek a peaceful retreat, a family vacation, or a romantic escape, our handpicked
              range of rooms from Non Luxury to VIP suites ensures every guest finds their perfect haven.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[['50+','Rooms'],['5000+','Happy Guests'],['10+','Years of Excellence']].map(([n,l]) => (
                <div key={l} className="bg-[#f5e6d8] rounded-2xl p-4">
                  <p className="text-2xl font-bold text-[#3d1a1a]">{n}</p>
                  <p className="text-[#8b4a4a] text-xs mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {villas.map((v,i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 h-44">
                <img src={v.img} alt={v.label} className="w-full h-full object-cover hover:scale-105 transition duration-500"/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                  <p className="text-white text-xs font-medium">{v.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROOM TIERS ── */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#8b4a4a] text-xs uppercase tracking-widest font-semibold">Accommodation</span>
            <h2 className="text-4xl font-bold text-[#3d1a1a] mt-2">Choose Your Experience</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tier:'non-luxury', icon:'🏡', label:'Non-Luxury', bg:'#f5f0eb', border:'#d4c4b0', price:'From Rs.10,000/night', badgeBg:'#ede8e0', badgeText:'#6b5a40', desc:'Comfortable and affordable rooms ideal for budget-conscious travellers.', options:['AC Room','Non AC Room'] },
              { tier:'luxury',     icon:'🌿', label:'Luxury',     bg:'#fdf0f0', border:'#d4a8a8', price:'From Rs.30,000/night', badgeBg:'#f5e0e0', badgeText:'#6b2d2d', desc:'Premium furnishings, stunning garden views, and refined comfort.', options:['AC Room','Non AC Room'] },
              { tier:'vip',        icon:'👑', label:'VIP',        bg:'#fdf8ee', border:'#d4b870', price:'From Rs.220,000/night', badgeBg:'#f5ecc8', badgeText:'#6b4d10', desc:'Exclusive suites with the highest level of luxury and personalised service.', options:['AC Room only'] },
            ].map(t => (
              <div key={t.tier} className="rounded-3xl border p-8 hover:shadow-xl transition duration-300"
                style={{background:t.bg, borderColor:t.border}}>
                <div className="text-4xl mb-4">{t.icon}</div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <h3 className="text-xl font-bold text-[#3d1a1a]">{t.label}</h3>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{background:t.badgeBg, color:t.badgeText}}>{t.price}</span>
                </div>
                <p className="text-[#6b4040] text-sm mb-5 leading-relaxed">{t.desc}</p>
                <div className="flex flex-col gap-2 mb-6">
                  {t.options.map(o => (
                    <div key={o} className="flex items-center gap-2 text-sm text-[#6b4040]">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs text-white" style={{background:'#8b4a4a'}}>✓</span>
                      {o}
                    </div>
                  ))}
                </div>
                <Link to={`/rooms?tier=${t.tier}`}
                  className="block text-center text-white py-2.5 rounded-full text-sm font-medium transition hover:opacity-90"
                  style={{background:'#6b2d2d'}}>
                  View Rooms
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="text-[#8b4a4a] text-xs uppercase tracking-widest font-semibold">Why Choose Us</span>
          <h2 className="text-4xl font-bold text-[#3d1a1a] mt-2">The Villa Serenity Difference</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {features.map(f => (
            <div key={f.title} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition border border-[#ede0d4]">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h4 className="font-semibold text-[#3d1a1a] mb-2">{f.title}</h4>
              <p className="text-[#8b6060] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="text-[#d4b8a8] py-12 px-6" style={{background:'#2a1010'}}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xl font-bold text-white mb-2">Villa Serenity</p>
          <p className="text-[#a88080] text-sm mb-4">Sri Lanka's finest luxury villa experience</p>
          <p className="text-[#6b4040] text-xs">© 2026 Villa Serenity. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}