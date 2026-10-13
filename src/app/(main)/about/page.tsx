import Link from 'next/link';
import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function AboutPage() {
  const session = await getSession();
  const services = [
    { icon: '🏗️', title: 'Official Storefront', desc: 'Direct access to official Apna Bhatta inventory. Get verified grades, real prices, and instant availability.' },
    { icon: '📦', title: 'Order & Checkout', desc: 'Place orders directly. Pay via Stripe or Cash on Delivery — fully flexible and secure.' },
    { icon: '📍', title: 'Live Delivery Tracking', desc: 'Track your driver in real-time on GPS from dispatch to doorstep. Full visibility.' },
    { icon: '🧮', title: 'Brick Estimator Tool', desc: 'Our smart calculator helps you budget exactly how many bricks your project needs.' },
    { icon: '🚀', title: 'Advanced Logistics', desc: 'Optimized delivery routes ensure your construction material arrives faster than ever.' },
    { icon: '🛡️', title: 'Secure & Reliable', desc: 'Enterprise-grade security ensures every transaction and delivery is safe.' },
  ];

  const stats = [
    { value: '40+', label: 'Years in Business', icon: '🏆' },
    { value: '200+', label: 'Happy Clients', icon: '🤝' },
    { value: '1L+', label: 'Bricks Delivered', icon: '🧱' },
    { value: '48hr', label: 'Avg Delivery', icon: '🚀' },
  ];

  const team = [
    { name: 'Nazim Ali', role: 'Founder & CEO', emoji: '👨‍💼' },
    { name: 'Tech Team', role: 'Engineering', emoji: '👩‍💻' },
    { name: 'Field Ops', role: 'Delivery & Logistics', emoji: '🚚' },
  ];

  return (
    <>
      <style>{`
        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .card-lift { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease; }
        .card-lift:hover { transform: translateY(-8px) scale(1.015); box-shadow: 0 20px 50px rgba(146,64,14,0.15); }
        .btn-primary { background: linear-gradient(135deg, #a16207, #92400e); box-shadow: 0 8px 20px rgba(146,64,14,0.3); transition: transform 0.2s, box-shadow 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(146,64,14,0.4); }
      `}</style>

      <div style={{ background: '#fffbf7', color: '#1a0a00', fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* HERO */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fff7f0 0%, #fff0e0 50%, #ffe8cc 100%)', minHeight: 420 }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(146,64,14,0.1) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }} />
          <div className="absolute rounded-full pointer-events-none" style={{
            width: 450, height: 450, top: '-15%', right: '-8%',
            background: 'radial-gradient(circle, rgba(212,169,106,0.4) 0%, transparent 70%)',
            animation: 'float-slow 9s ease-in-out infinite'
          }} />
          <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-16 flex items-center" style={{ minHeight: 420 }}>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
                style={{ background: 'rgba(161,98,7,0.1)', border: '1px solid rgba(146,64,14,0.2)', color: '#92400e' }}>
                <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
                About Us
              </span>
              <h1 className="font-black leading-none mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.03em', color: '#1a0a00' }}>
                Driven by Quality,<br />
                <span style={{ background: 'linear-gradient(135deg, #a16207, #92400e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Built on Trust
                </span>
              </h1>
              <p className="text-base max-w-xl leading-relaxed" style={{ color: '#6b4a30' }}>
                At Apna Bhatta, we are revolutionizing the brick industry in Pakistan by connecting builders directly with verified kiln owners — eliminating middlemen and building trust.
              </p>
            </div>
          </div>
        </section>

        {/* WHO WE ARE */}
        <section style={{ background: '#fffbf7', padding: '80px 0' }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>Who We Are</span>
              <h2 className="text-3xl font-black mb-4 leading-tight" style={{ letterSpacing: '-0.02em', color: '#1a0a00' }}>
                Connecting Kilns<br />with Builders
              </h2>
              <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b4a30' }}>
                Apna Bhatta is a digital platform built to modernize Pakistan&apos;s brick supply chain. We eliminate middlemen and put kiln owners in direct contact with customers who need quality bricks delivered on time.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#9a6040' }}>
                Whether you&apos;re building a home or a commercial complex — Apna Bhatta ensures the right material, right price, and real-time delivery tracking at your fingertips.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden relative shadow-2xl" style={{ height: 320 }}>
              <div className="absolute inset-0 bg-cover bg-center" style={{
                backgroundImage: "url('/bg-home-new-2.jpg')", filter: 'brightness(0.85)'
              }} />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to top, rgba(26,10,0,0.6) 0%, transparent 60%)'
              }} />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#d97706' }}>Apna Bhatta</p>
                <p className="text-base font-extrabold text-white">Making Construction Transparent</p>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={{ background: 'linear-gradient(135deg, #92400e, #7c2d12)', padding: '40px 0' }}>
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="text-3xl block mb-2">{s.icon}</span>
                  <p className="text-3xl font-black leading-none mb-1">{s.value}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section style={{ background: '#fff4ea', padding: '80px 0' }}>
          <div className="max-w-6xl mx-auto px-6 lg:px-16">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>What We Offer</span>
              <h2 className="text-3xl font-black" style={{ letterSpacing: '-0.02em', color: '#1a0a00' }}>Our Services</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => (
                <div key={s.title}
                  className="card-lift rounded-3xl p-6"
                  style={{
                    background: i % 2 === 0 ? '#fff' : '#fffbf7',
                    border: '1px solid rgba(146,64,14,0.09)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                  }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, #fff4ea, #ffe8cc)', border: '1.5px solid rgba(146,64,14,0.2)' }}>
                    <span className="text-xl">{s.icon}</span>
                  </div>
                  <h3 className="font-extrabold text-sm mb-1.5" style={{ color: '#1a0a00' }}>{s.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9a6040' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #d4a96a 0%, #a16207 50%, #92400e 100%)',
          padding: '80px 0'
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          <div className="relative z-10 text-center max-w-xl mx-auto px-6">
            <h2 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Join Apna Bhatta Today</h2>
            <p className="text-sm text-white/75 mb-8">Start building smarter with high-quality materials.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/login/customer"
                className="px-7 py-3.5 rounded-2xl font-bold text-sm hover:-translate-y-0.5 hover:shadow-xl transition-all"
                style={{ background: '#fff', color: '#92400e', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                🛒 Get Started
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
