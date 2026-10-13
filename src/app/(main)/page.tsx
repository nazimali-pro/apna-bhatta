import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import BrickCalculator from '@/components/BrickCalculator';
import { ProductHoverGallery } from '@/components/product-components';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await getSession();

  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { orderItems: { _count: 'desc' } },
    include: { 
      admin: { select: { name: true } },
      images: { take: 5 } // Optimized: Fetch first 5 images directly
    },
  });

  const fallbackProducts = [
    { id: 'f1', name: 'Awwal Bricks', price: 22, description: 'First-grade premium bricks for high-strength walls and load-bearing structures.', imageUrl: null, images: [] },
    { id: 'f2', name: 'Doam Bricks', price: 16, description: 'Second-grade reliable bricks — cost-effective for general construction.', imageUrl: null, images: [] },
    { id: 'f3', name: 'Som Bricks', price: 11, description: 'Third-grade bricks ideal for boundary walls and non-load-bearing partitions.', imageUrl: null, images: [] },
  ];

  const displayProducts = (products.length > 0 ? products : fallbackProducts).map(p => ({
    ...p,
    // Flatten images for the gallery component
    allImages: [
      ...(p.imageUrl ? [p.imageUrl] : []),
      ...((p as any).images?.map((img: any) => img.url) || [])
    ]
  }));

  const stats = [
    { value: '15+', label: 'Years Experience', icon: '🏆' },
    { value: '200+', label: 'Happy Clients', icon: '🤝' },
    { value: '1L+', label: 'Bricks Sold', icon: '🧱' },
    { value: '24/7', label: 'Support', icon: '🛡️' },
    { value: '100%', label: 'Verified', icon: '✅' },
    { value: '48hr', label: 'Delivery', icon: '🚀' },
  ];

  return (
    <>
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #fff7f0 0%, #fff0e0 40%, #ffe8cc 100%);
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes float-mid {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-lift {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
        }
        .card-lift:hover {
          transform: translateY(-10px) scale(1.015);
          box-shadow: 0 24px 60px rgba(233,88,26,0.18);
        }
        .btn-primary {
          background: linear-gradient(135deg, #a16207 0%, #92400e 100%);
          box-shadow: 0 8px 24px rgba(146,64,14,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 32px rgba(146,64,14,0.45);
        }
        .section-fade { animation: fade-up 0.6s ease both; }
        .tag-pill {
          background: linear-gradient(135deg, rgba(161,98,7,0.12) 0%, rgba(146,64,14,0.08) 100%);
          border: 1px solid rgba(161,98,7,0.25);
          color: #92400e;
        }
      `}</style>

      <div className="bg-[#fffbf7] text-[#1a0a00]">

        {/* ──────────────────────────────────────── 
            HERO
           ──────────────────────────────────────── */}
        <section style={{ 
          position: 'relative', 
          width: '100%', 
          overflow: 'hidden',
          height: 'calc(100vh - 64px)',
          minHeight: '600px',
          maxHeight: '900px',
          backgroundColor: '#fffbf7'
        }}>
          {/* Full-width background image */}
          <img 
            src="/bg-home-new-2.jpg" 
            alt="Building background" 
            style={{ 
              position: 'absolute', inset: 0,
              width: '100%', height: '100%', 
              objectFit: 'cover', objectPosition: 'center',
              filter: 'brightness(0.65)'
            }}
          />

          {/* Semi-transparent overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(105deg, rgba(255,251,247,0.97) 0%, rgba(255,244,234,0.90) 40%, rgba(255,240,220,0.50) 65%, transparent 100%)'
          }} />

          {/* Hero text content */}
          <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', alignItems: 'center' }}>
            <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
              <div style={{ maxWidth: '60%' }}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-8 tag-pill uppercase tracking-widest shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-700 animate-pulse" />
                  Pakistan&apos;s #1 Brick Marketplace
                </span>

                <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 76px)', lineHeight: '1.08', letterSpacing: '-0.04em', color: '#1a0a00', fontWeight: 900, marginBottom: '1.5rem' }}>
                  Build Your<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #a16207 0%, #92400e 60%, #7c2d12 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>Dream</span><br />
                  With Quality Bricks
                </h1>

                <p style={{ fontSize: '1.125rem', lineHeight: '1.7', color: '#5a3010', fontWeight: 500, maxWidth: '36rem', marginBottom: '2.5rem' }}>
                  Pakistan&apos;s first digital brick marketplace — buy directly from verified official stores with transparent pricing and real-time delivery tracking.
                </p>

                <div className="flex flex-wrap gap-5">
                  <Link href={session?.role === 'CUSTOMER' ? '/customer' : '/login/customer'}
                    className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold text-white shadow-xl">
                    🛒 {session?.role === 'CUSTOMER' ? 'My Dashboard' : 'Shop Bricks Now'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                  <Link href="/products"
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-bold transition-all shadow-md"
                    style={{ border: '2px solid rgba(146,64,14,0.35)', color: '#92400e', background: 'rgba(255,255,255,0.7)' }}>
                    🧱 Browse Catalog
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-10 mt-12">
                  {[{ icon: '✅', text: 'Verified Store' }, { icon: '🔒', text: 'Secure Payments' }, { icon: '🚚', text: 'Fast Delivery with Live GPS Tracking' }].map(b => (
                    <div key={b.text} className="flex items-center gap-2.5 text-xs font-black uppercase tracking-wider" style={{ color: '#9a6040' }}>
                      <span className="text-xl">{b.icon}</span> {b.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────── 
            BRICK CALCULATOR
           ──────────────────────────────────────── */}
        <section style={{ background: '#fffbf7', padding: '80px 0' }}>
          <BrickCalculator />
        </section>

        {/* ──────────────────────────────────────── 
            STATS BAND
           ──────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #92400e 0%, #7c2d12 100%)', padding: '36px 0' }}>
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-8 text-center text-white">
              {stats.map((s) => (
                <div key={s.label}>
                  <span className="text-xl sm:text-2xl block mb-1 opacity-90">{s.icon}</span>
                  <p className="text-2xl sm:text-3xl font-black leading-none mb-0.5">{s.value}</p>
                  <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest opacity-70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────── 
            PRODUCTS
           ──────────────────────────────────────── */}
        <section style={{ background: '#fff4ea', padding: '80px 0' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>What We Offer</span>
                <h2 className="text-3xl sm:text-4xl font-black" style={{ letterSpacing: '-0.02em', color: '#1a0a00' }}>Our Brick Products</h2>
                <p className="text-sm mt-2" style={{ color: '#6b4a30' }}>
                  Explore high-quality bricks from verified Bhatta owners — ready to order.
                </p>
              </div>
              <Link href="/products"
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white">
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product: any, i) => (
                <Link key={product.id}
                  href={`/products/${product.id}`}
                  className="card-lift group block rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                  style={{ background: '#fff', border: '1px solid rgba(146,64,14,0.08)' }}>
                  <div className="relative h-56 overflow-hidden" style={{
                    background: `linear-gradient(135deg, ${i % 3 === 0 ? '#fff4ea' : i % 3 === 1 ? '#fef3e8' : '#ffeeda'} 0%, #ffe0c0 100%)`
                  }}>
                    <ProductHoverGallery 
                      mainImage={product.imageUrl} 
                      sideImages={product.allImages} 
                    />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-black text-white shadow-lg z-10"
                      style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                      PKR {product.price.toLocaleString()}/brick
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-extrabold text-base mb-1 group-hover:text-amber-800 transition-colors" style={{ color: '#1a0a00' }}>{product.name}</h3>
                    <p className="text-xs mb-2 flex items-center gap-1 font-semibold" style={{ color: '#92400e' }}>
                      🏠 Apna Bhatta
                    </p>
                    <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#9a6040' }}>{product.description}</p>
                    <div className="flex items-center justify-end pt-3" style={{ borderTop: '1px solid rgba(146,64,14,0.08)' }}>
                      <span className="text-xs font-extrabold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: '#92400e' }}>
                        Order Now <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────── 
            WHY CHOOSE US
           ──────────────────────────────────────── */}
        <section style={{ background: '#fffbf7', padding: '80px 0' }}>
          <div className="max-w-7xl mx-auto px-6 lg:px-16">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>Our Promise</span>
              <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ letterSpacing: '-0.02em', color: '#1a0a00' }}>Why Builders Choose Us</h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: '#6b4a30' }}>
                Quality craftsmanship, transparent pricing, and seamless delivery — all in one platform.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {[
                { icon: '🏗️', title: 'Durable & Strong', desc: 'Kiln-fired and tested for max compressive strength.' },
                { icon: '💰', title: 'Best Prices', desc: 'Direct from Bhatta — no middlemen, factory prices.' },
                { icon: '🚚', title: 'Fast Delivery', desc: 'Real-time GPS tracking on every delivery.' },
                { icon: '🌱', title: 'Eco-Friendly', desc: 'Fuel-efficient kilns and minimal waste.' },
              ].map((item, i) => (
                <div key={item.title}
                  className="card-lift group text-center rounded-3xl p-6"
                  style={{
                    background: i % 2 === 0
                      ? 'linear-gradient(145deg, #fffbf7, #fff4ea)'
                      : '#ffffff',
                    border: '1px solid rgba(146,64,14,0.1)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                  }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                    style={{ background: 'linear-gradient(135deg, #fff4ea, #ffe8cc)', border: '1.5px solid rgba(146,64,14,0.2)' }}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="font-extrabold text-sm mb-2" style={{ color: '#1a0a00' }}>{item.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: '#9a6040' }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/about"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white">
                Learn More About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────── 
            CTA BANNER
           ──────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #d4a96a 0%, #a16207 40%, #92400e 100%)',
          padding: '80px 0'
        }}>
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          <div className="absolute rounded-full" style={{
            width: 400, height: 400, top: '-30%', right: '-10%',
            background: 'rgba(255,255,255,0.07)', animation: 'float-slow 8s ease-in-out infinite'
          }} />
          <div className="relative z-10 text-center max-w-xl mx-auto px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
              Ready to Build?
            </h2>
            <p className="text-sm mb-8 text-white/75">
              Join thousands of builders who trust Apna Bhatta for quality bricks and reliable delivery.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/login/customer"
                className="px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-xl"
                style={{ background: '#fff', color: '#92400e', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                🛒 Start Shopping
              </Link>
              <Link href="/products"
                className="px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{ border: '2px solid rgba(255,255,255,0.5)', color: '#fff', background: 'rgba(255,255,255,0.1)' }}>
                🧱 View All Products
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
