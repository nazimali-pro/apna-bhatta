import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { Prisma } from '@prisma/client';
import { AddToCartButton } from '@/components/product-components';
import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Browse Premium Bricks — Apna Bhatta',
    description: 'Explore our collection of premium quality bricks with transparent pricing and fast delivery across Pakistan.',
};

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
    const session = await getSession();

    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            admin: {
                select: {
                    name: true,
                    bhattaDetail: { select: { bhattaName: true, address: true } }
                }
            },
            images: { take: 1 }, // Optimized: Only fetch primary image for listing
            _count: { select: { images: true } }
        }
    });

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { font-family: 'Inter', system-ui, sans-serif; }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .product-card { transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
                .product-card:hover { transform: translateY(-8px); box-shadow: 0 32px 64px rgba(146,64,14,0.18); }
                .product-card:hover .card-img { transform: scale(1.08); }
                .card-img { transition: transform 0.5s ease; }
                .fade-up { animation: fadeUp 0.6s ease both; }
                .badge-gradient { background: linear-gradient(135deg, #a16207, #92400e); }
                .hero-bg { background: linear-gradient(135deg, #1a0a00 0%, #3d1a00 40%, #5c2700 100%); }
            `}</style>

            <div style={{ background: '#faf7f4', minHeight: '100vh', color: '#1a0a00' }}>

                {/* ─── HERO BANNER ─── */}
                <section className="hero-bg relative overflow-hidden" style={{ paddingTop: 80, paddingBottom: 80 }}>
                    {/* Texture */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }} />
                    {/* Glow orbs */}
                    <div className="absolute pointer-events-none" style={{ width: 500, height: 500, top: '-20%', right: '-5%', background: 'radial-gradient(circle, rgba(212,169,106,0.15) 0%, transparent 65%)', borderRadius: '50%' }} />
                    <div className="absolute pointer-events-none" style={{ width: 300, height: 300, bottom: '-10%', left: '5%', background: 'radial-gradient(circle, rgba(180,80,20,0.12) 0%, transparent 65%)', borderRadius: '50%' }} />

                    <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-16">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="fade-up" style={{ animationDelay: '0.1s' }}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                    {products.length} Products In Stock
                                </div>
                                <h1 className="font-black text-white leading-none mb-4" style={{ fontSize: 'clamp(36px, 5vw, 64px)', letterSpacing: '-0.03em' }}>
                                    Premium Quality<br />
                                    <span style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        Bricks
                                    </span>
                                </h1>
                                <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 440 }}>
                                    Sourced directly from our certified bhatta. Kiln-fired, quality-tested, and delivered to your construction site.
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    {[
                                        { icon: '✅', label: 'Quality Certified' },
                                        { icon: '🚚', label: 'Fast Delivery' },
                                        { icon: '💰', label: 'Factory Pricing' },
                                    ].map(b => (
                                        <div key={b.label} className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>
                                            <span>{b.icon}</span> {b.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hero stat card */}
                            <div className="fade-up flex-shrink-0" style={{ animationDelay: '0.25s' }}>
                                <div className="rounded-3xl p-8 text-center" style={{
                                    background: 'rgba(255,255,255,0.07)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    backdropFilter: 'blur(8px)',
                                    minWidth: 220
                                }}>
                                    <p className="text-5xl font-black text-white mb-1">{products.length}</p>
                                    <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                        Available Products
                                    </p>
                                    <div className="mt-5 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
                                    <p className="text-xs mt-4 font-semibold" style={{ color: 'rgba(212,169,106,0.9)' }}>🧱 Apna Bhatta Official Store</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── PRODUCTS GRID ─── */}
                <section style={{ padding: '60px 0 80px' }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-16">

                        {/* Section header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#92400e' }}>Our Collection</p>
                                <h2 className="text-3xl font-black" style={{ letterSpacing: '-0.02em' }}>All Brick Products</h2>
                            </div>
                            {!session && (
                                <Link href="/login/customer"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg hover:-translate-y-0.5 transition-all"
                                    style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                                    Sign In to Order
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            )}
                        </div>

                        {products.length === 0 ? (
                            <div className="rounded-3xl p-20 text-center" style={{ background: '#fff', border: '1px solid rgba(146,64,14,0.08)' }}>
                                <span className="text-7xl block mb-5">🧱</span>
                                <h3 className="text-2xl font-bold mb-3">No products yet</h3>
                                <p style={{ color: '#9a6040' }}>Check back soon — we&apos;re adding new inventory.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.map((product: any, i) => {
                                    const mainImg = product.images[0]?.url || product.imageUrl;
                                    const inStock = product.stock > 0;

                                    return (
                                        <div key={product.id} className="fade-up" style={{ animationDelay: `${0.05 * i}s` }}>
                                            <div className="product-card group rounded-3xl overflow-hidden" style={{ background: '#fff', border: '1px solid rgba(146,64,14,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>

                                                {/* Image */}
                                                <Link href={`/products/${product.id}`} className="block relative overflow-hidden" style={{ height: 220, background: `linear-gradient(135deg, #fff7f0, #ffe8cc)` }}>
                                                    {mainImg ? (
                                                        <img src={mainImg} alt={product.name} className="card-img w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="card-img w-full h-full flex items-center justify-center text-7xl opacity-20">🧱</div>
                                                    )}
                                                    {/* Price badge */}
                                                    <div className="absolute top-4 left-4 badge-gradient px-3 py-1.5 rounded-xl text-white text-xs font-black shadow-lg z-10">
                                                        PKR {product.price.toLocaleString()}
                                                        <span className="opacity-70 font-normal"> /1000</span>
                                                    </div>
                                                    {/* Stock badge */}
                                                    <div className={`absolute top-4 right-4 px-2.5 py-1 rounded-lg text-[10px] font-bold z-10 ${inStock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                                                        {inStock ? `${product.stock.toLocaleString()} left` : 'Out of stock'}
                                                    </div>
                                                    {/* Image count */}
                                                    {product._count.images > 1 && (
                                                        <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm z-10">
                                                            +{product._count.images} photos
                                                        </div>
                                                    )}
                                                </Link>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <Link href={`/products/${product.id}`}>
                                                        <h3 className="font-extrabold text-base mb-1 group-hover:text-amber-800 transition-colors leading-tight truncate" style={{ color: '#1a0a00' }}>{product.name}</h3>
                                                        <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: '#9a6040' }}>{product.description || 'Premium quality bricks for all construction needs.'}</p>
                                                    </Link>

                                                    <div className="flex items-center justify-between" style={{ borderTop: '1px solid rgba(146,64,14,0.06)', paddingTop: 14 }}>
                                                        <Link href={`/products/${product.id}`}
                                                            className="text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
                                                            style={{ color: '#92400e' }}>
                                                            View Details
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                                        </Link>
                                                        <AddToCartButton product={product} bhattaName="Apna Bhatta" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── TRUST SECTION ─── */}
                <section style={{ background: 'linear-gradient(135deg, #1a0a00, #3d1a00)', padding: '60px 0' }}>
                    <div className="max-w-5xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                            {[
                                { icon: '🏆', value: '15+', label: 'Years Experience' },
                                { icon: '🧱', value: '1L+', label: 'Bricks Delivered' },
                                { icon: '🤝', value: '200+', label: 'Happy Clients' },
                                { icon: '🚚', value: '48hr', label: 'Avg Delivery' },
                            ].map(s => (
                                <div key={s.label}>
                                    <span className="text-3xl block mb-2 opacity-80">{s.icon}</span>
                                    <p className="text-3xl font-black mb-1">{s.value}</p>
                                    <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
