import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth-utils';
import { ProductGallery, AddToCartButton } from '@/components/product-components';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return { title: 'Product Not Found' };
    return {
        title: `${product.name} | Apna Bhatta`,
        description: product.description,
    };
}

export default async function ProductDetailPage({ 
    params 
}: { 
    params: Promise<{ id: string }> 
}) {
    const session = await getSession();
    const { id: productId } = await params;

    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            admin: {
                select: {
                    name: true,
                    bhattaDetail: { select: { bhattaName: true, address: true, phoneNumber: true } }
                }
            },
            images: true
        }
    });

    if (!product) notFound();

    const checkoutUrl = `/checkout?productId=${product.id}`;
    const inStock = product.stock > 0;

    // Spec array for clean rendering
    const specs = [
        { label: 'Brick Type', value: product.brickType, icon: '🧱' },
        { label: 'Category', value: product.category, icon: '🏷️' },
        { label: 'Dimensions', value: product.dimensions, icon: '📏' },
        { label: 'Strength', value: product.strength, icon: '💪' },
        { label: 'Weight', value: product.weight, icon: '⚖️' },
        { label: 'Natural Color', value: product.color, icon: '🎨' },
    ].filter(s => s.value);

    return (
        <div className="min-h-screen pb-24" style={{ backgroundColor: '#faf7f4', fontFamily: "'Inter', sans-serif" }}>
            
            {/* ─── BREADCRUMBS & TOP BAR ─── */}
            <div className="max-w-7xl mx-auto px-6 pt-12 mb-10">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-amber-900/60">
                    <Link href="/products" className="hover:text-amber-700 transition">Marketplace</Link>
                    <span className="opacity-30">/</span>
                    {product.category && (
                        <>
                            <span className="text-gray-400">{product.category}</span>
                            <span className="opacity-30">/</span>
                        </>
                    )}
                    <span className="text-gray-900 opacity-100">{product.name}</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    
                    {/* ─── LEFT: MEDIA GALLERY (7 cols) ─── */}
                    <div className="lg:col-span-7">
                        <div className="sticky top-12">
                            <ProductGallery 
                                mainImage={product.imageUrl} 
                                sideImages={product.images.map(img => img.url)} 
                            />
                            
                            {/* Trust Badge Grid below images */}
                            <div className="grid grid-cols-3 gap-4 mt-12">
                                {[
                                    { icon: '🛡️', title: 'Quality Assured', desc: 'Kiln-fired & Tested' },
                                    { icon: '🚚', title: 'Site Delivery', desc: '48hr Availability' },
                                    { icon: '💳', title: 'Secure Buying', desc: 'Verified Direct' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 text-center shadow-sm">
                                        <p className="text-2xl mb-1">{item.icon}</p>
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-tighter mb-0.5">{item.title}</p>
                                        <p className="text-[9px] text-gray-500 font-medium">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ─── RIGHT: PRODUCT INFO (5 cols) ─── */}
                    <div className="lg:col-span-5 flex flex-col">
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 bg-amber-100 text-amber-900 border border-amber-200">
                                {product.brickType || 'Classic Brick'}
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-none tracking-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    {inStock ? `${product.stock.toLocaleString()} units ready` : 'Out of Stock'}
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">SKU: BRK-{product.id.slice(0,6).toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10 mt-6 prose prose-amber">
                            <p className="text-gray-600 leading-relaxed text-base italic">
                                &ldquo;{product.description || 'Premium grade construction material optimized for durability and structural integrity.'}&rdquo;
                            </p>
                        </div>

                        {/* Pricing section */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl mb-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <span className="text-8xl">🧱</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Direct Factory Price</p>
                                <p className="text-5xl font-black text-gray-900">
                                    <span className="text-xl align-top mr-1 font-bold">PKR</span>
                                    {product.price.toLocaleString()}
                                    <span className="text-sm font-medium text-gray-500"> /1k bricks</span>
                                </p>
                                <p className="text-[10px] text-gray-400 mt-2 font-medium">* Price excludes loading/unloading where applicable.</p>
                                
                                <div className="mt-8 flex flex-col gap-3">
                                    {!session ? (
                                        <Link href={`/login/customer?redirect=${encodeURIComponent(checkoutUrl)}`}
                                            className="w-full py-4.5 rounded-2xl text-center text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                                            style={{ background: 'linear-gradient(135deg, #1a1a1a, #333)' }}>
                                            Sign In to Order
                                        </Link>
                                    ) : session.role !== 'CUSTOMER' ? (
                                        <div className="w-full py-4.5 rounded-2xl text-center text-gray-400 font-black text-sm uppercase tracking-widest bg-gray-100 border border-gray-200 cursor-not-allowed">
                                             For Customers Only
                                        </div>
                                    ) : (
                                        <>
                                            <Link href={checkoutUrl}
                                                className="w-full py-4.5 rounded-2xl text-center text-white font-black text-sm uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                                                style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                                                Order Now
                                            </Link>
                                            <AddToCartButton product={product} bhattaName="Apna Bhatta" variant="detail" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Specs Grid */}
                        <div className="mt-2">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 px-1 flex items-center gap-2">
                                <span className="w-8 h-1 bg-amber-500 rounded-full" />
                                Specifications
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {specs.map((s, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 shadow-sm hover:shadow-md transition-all">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl shadow-inner">{s.icon}</div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">{s.label}</p>
                                            <p className="text-xs font-black text-gray-800 uppercase">{s.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Store Info */}
                        <div className="mt-12 p-6 rounded-3xl bg-gray-100 border border-gray-200 flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">🏭</div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Fulfilled By</p>
                                <p className="text-sm font-black text-gray-900 uppercase tracking-tight">Apna Bhatta Official</p>
                                <p className="text-xs text-gray-500 font-medium">Standard Industrial Park, Lahore, PK</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
