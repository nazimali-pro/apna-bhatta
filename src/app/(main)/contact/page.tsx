import Link from 'next/link';
import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import ContactForm from '@/components/ContactForm';

const BR = {
  accent: '#92400e',
  accentMid: '#a16207',
  btn: 'linear-gradient(135deg, #a16207 0%, #92400e 100%)',
  tag: 'rgba(146,64,14,0.1)',
  tagBorder: 'rgba(146,64,14,0.25)',
  infoBg: '#fef9f0',
  infoBorder: 'rgba(146,64,14,0.12)',
  inputBorder: 'rgba(146,64,14,0.2)',
};

export default async function ContactPage() {
  const session = await getSession();

  const contactItems = [
    { icon: '📧', label: 'Email', value: 'support@apnabhatta.pk' },
    { icon: '📞', label: 'Phone', value: '+92 300 1234567' },
    { icon: '📍', label: 'Address', value: 'Shahkot, Nankana Sahib, Punjab, Pakistan' },
    { icon: '🕐', label: 'Support Hours', value: 'Mon – Sat, 9 AM – 6 PM' },
  ];

  return (
    <>
      <style>{`
        @keyframes float-slow { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        .btn-brown { background: linear-gradient(135deg, #a16207, #92400e); box-shadow: 0 8px 20px rgba(146,64,14,0.3); transition: transform 0.2s, box-shadow 0.2s; }
        .btn-brown:hover { transform: translateY(-2px); box-shadow: 0 14px 28px rgba(146,64,14,0.4); }
        .card-lift { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .card-lift:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(146,64,14,0.12); }
      `}</style>

      <div style={{ background: '#fffbf7', color: '#1a0a00', fontFamily: "'Inter', system-ui, sans-serif" }}>

        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #fff7f0 0%, #ffedd5 50%, #fde8c8 100%)', minHeight: 380
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(146,64,14,0.1) 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }} />
          <div className="absolute rounded-full pointer-events-none" style={{
            width: 440, height: 440, top: '-15%', right: '-8%',
            background: 'radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)',
            animation: 'float-slow 9s ease-in-out infinite'
          }} />
          <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-16 flex items-center" style={{ minHeight: 380 }}>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 uppercase tracking-widest"
                style={{ background: BR.tag, border: `1px solid ${BR.tagBorder}`, color: BR.accent }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: BR.accent }} />
                Support
              </span>
              <h1 className="font-black leading-none mb-4" style={{ fontSize: 'clamp(36px, 5vw, 60px)', letterSpacing: '-0.03em', color: '#1a0a00' }}>
                We&apos;d Love to<br />
                <span style={{ background: 'linear-gradient(135deg, #a16207, #92400e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Hear From You
                </span>
              </h1>
              <p className="text-base max-w-lg leading-relaxed" style={{ color: '#6b4a30' }}>
                Have a question, issue, or feedback? Our team is here to help — usually within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* ─── MAIN GRID ─── */}
        <section className="py-16 max-w-6xl mx-auto px-6 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12">

            {/* Left — info */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: BR.accent }}>Get In Touch</p>
              <h2 className="text-2xl font-black mb-3 leading-tight" style={{ letterSpacing: '-0.02em' }}>Contact Details</h2>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#6b4a30' }}>
                Whether you&apos;ve encountered a bug, need help with an order, or just have a question — fill in the form and we&apos;ll get back to you within 24 hours.
              </p>

              <div className="space-y-3 mb-8">
                {contactItems.map((info) => (
                  <div key={info.label}
                    className="card-lift flex items-start gap-4 p-4 rounded-2xl"
                    style={{ background: BR.infoBg, border: `1px solid ${BR.infoBorder}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #fff7f0, #fde8c8)', border: `1px solid ${BR.tagBorder}` }}>
                      <span className="text-lg">{info.icon}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: BR.accent }}>{info.label}</p>
                      <p className="text-sm font-semibold" style={{ color: '#1a0a00' }}>{info.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl" style={{ background: BR.infoBg, border: `1px solid ${BR.infoBorder}` }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BR.accent }}>Quick Links</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Browse Products', href: '/products' },
                    { label: 'About Us', href: '/about' },
                    { label: 'Customer Login', href: '/login/customer' },
                  ].map(l => (
                    <Link key={l.label} href={l.href}
                      className="text-xs px-3 py-1.5 rounded-lg font-semibold hover:opacity-80 transition"
                      style={{ border: `1.5px solid ${BR.tagBorder}`, color: BR.accent, background: '#fff' }}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="rounded-3xl p-8" style={{
              background: '#fff',
              border: '1.5px solid rgba(146,64,14,0.1)',
              boxShadow: '0 8px 40px rgba(146,64,14,0.08)'
            }}>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* ─── CTA BANNER ─── */}
        <section className="relative overflow-hidden py-16" style={{
          background: 'linear-gradient(135deg, #d4a96a 0%, #a16207 40%, #92400e 100%)',
          padding: '80px 0'
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          <div className="relative z-10 text-center max-w-xl mx-auto px-6">
            <h2 className="text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
              Ready to Get Building?
            </h2>
            <p className="text-sm text-white/75 mb-8">Browse premium quality bricks for your project.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/products"
                className="px-7 py-3.5 rounded-2xl font-bold text-sm transition hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: '#fff', color: '#92400e', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                🧱 Browse Products
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
