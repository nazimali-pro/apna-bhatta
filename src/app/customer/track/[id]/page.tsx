import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { MapViewer as ClientMapLoader } from '@/components/map-components';
import AutoRefresh from '@/components/AutoRefresh';

export const dynamic = 'force-dynamic';

function getTimeAgo(date: Date) {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
}

export default async function CustomerTrackPage({ params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    const { id } = await params;

    if (!session || session.role !== 'CUSTOMER') redirect('/login/customer');

    const order = await prisma.order.findUnique({
        where: { id, customerId: session.userId },
        include: {
            delivery: {
                include: {
                    driver: {
                        include: { driverDetail: true }
                    }
                }
            },
            admin: {
                include: { bhattaDetail: true }
            }
        }
    });

    if (!order) notFound();

    const stages = ['PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED'];
    const progressMap: Record<string, number> = { PENDING: 10, PROCESSING: 30, DISPATCHED: 70, DELIVERED: 100 };
    const progress = progressMap[order.status] ?? 0;

    const driver = order.delivery?.driver;
    const driverDetail = driver?.driverDetail;
    const bhattaName = order.admin.bhattaDetail?.bhattaName || order.admin.name;

    // Customer's pin location from checkout
    const customerLat = order.latitude;
    const customerLng = order.longitude;
    const mapsLink = customerLat && customerLng
        ? `https://www.google.com/maps?q=${customerLat},${customerLng}`
        : null;

    let etaMins = null;
    if (order.status === 'DISPATCHED' && order.delivery?.latitude && order.delivery?.longitude && customerLat && customerLng) {
        try {
            const drLat = order.delivery.latitude;
            const drLng = order.delivery.longitude;
            const routeRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${drLng},${drLat};${customerLng},${customerLat}?overview=false`);
            const routeData = await routeRes.json();
            if (routeData.routes && routeData.routes[0]) {
                etaMins = Math.ceil(routeData.routes[0].duration / 60);
            }
        } catch (e) {
            console.error('Failed to fetch ETA', e);
        }
    }

    return (
        <div className="min-h-screen pb-16" style={{ background: '#fdfaf8' }}>
            {/* Ambient glow */}
            <div className="fixed top-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-5 blur-[80px]"
                style={{ background: 'radial-gradient(circle, #b06040, transparent 70%)' }} />

            <div className="max-w-3xl mx-auto px-4 pt-10 relative z-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/customer" className="text-sm font-bold px-3 py-1.5 rounded-lg transition"
                        style={{ backgroundColor: 'white', color: '#b06040', border: '1px solid #eee', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                        ← Back
                    </Link>
                    {order.status === 'DISPATCHED' && <AutoRefresh interval={15000} />}
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1a0c05]">Live Tracking</h1>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#b06040' }}>Order #{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="rounded-2xl p-6 mb-6 shadow-sm" style={{ background: 'white', border: '1px solid #eee' }}>
                    <div className="flex justify-between mb-3">
                        {stages.map((s, i) => {
                            const done = stages.indexOf(order.status) >= i;
                            return (
                                <div key={s} className="flex flex-col items-center gap-1 flex-1">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${done ? 'text-white' : 'text-gray-400'}`}
                                        style={{ background: done ? 'linear-gradient(135deg,#b06040,#d07050)' : '#f8f8f8', border: done ? 'none' : '1px solid #eee' }}>
                                        {done ? '✓' : i + 1}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-center hidden sm:block" style={{ color: done ? '#b06040' : '#a1a1a1' }}>{s}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: '#f0f0f0' }}>
                        <div className="h-full rounded-full transition-all duration-1000"
                            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #b06040, #d07050)' }} />
                    </div>
                    <p className="text-center text-xs font-bold uppercase tracking-widest mt-3" style={{ color: '#b06040' }}>{order.status}</p>
                </div>

                {/* Map */}
                <div className="rounded-2xl overflow-hidden mb-6 shadow-sm relative" style={{ height: '300px', border: '1px solid #eee', backgroundColor: 'white' }}>
                    {order.status === 'DISPATCHED' ? (
                        <>
                            {order.delivery?.latitude && order.delivery?.longitude ? (
                                <>
                                    <ClientMapLoader
                                        lat={order.delivery.latitude}
                                        lng={order.delivery.longitude}
                                        driverName={driver?.name}
                                        updatedAt={order.delivery.updatedAt}
                                    />
                                    <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 scale-90 sm:scale-100 origin-top-right">
                                        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border shadow-lg">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#b06040]">
                                                Last Seen: {getTimeAgo(new Date(order.delivery.updatedAt))} ago
                                            </p>
                                        </div>
                                        {etaMins !== null && (
                                            <div className="px-3 py-2 rounded-2xl bg-white shadow-xl border border-orange-100 flex flex-col items-center">
                                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Est. Arrival</span>
                                                <span className="text-lg font-black text-gray-900">{etaMins} mins</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                                    <span className="text-4xl mb-3 animate-pulse">📡</span>
                                    <p className="font-bold text-gray-900">Waiting for Driver GPS...</p>
                                    <p className="text-xs mt-1 text-gray-500">Driver has started but location not acquired yet</p>
                                </div>
                            )}
                        </>
                    ) : order.status === 'DELIVERED' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: '#f0fdf4' }}>
                            <span className="text-5xl mb-3">🎉</span>
                            <p className="font-extrabold text-xl text-green-600">Order Delivered!</p>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                            <span className="text-4xl mb-3 opacity-30">🗺️</span>
                            <p className="font-medium text-gray-500">Live tracking starts when dispatched</p>
                        </div>
                    )}
                </div>

                {/* Driver Details */}
                <div className="rounded-2xl p-6 mb-6 shadow-sm" style={{ background: 'white', border: '1px solid #eee' }}>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#b06040' }}>🚛 Driver Details</h2>
                    {driver ? (
                        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                            {driverDetail?.profilePhotoUrl && (
                                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-gray-50 shadow-sm shrink-0 bg-gray-100 flex items-center justify-center">
                                    <img src={driverDetail.profilePhotoUrl} alt={driver.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 w-full">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider mb-0.5 text-gray-400">Name</p>
                                        <p className="font-bold text-gray-900 text-lg">{driver.name}</p>
                                    </div>
                                    {driver.phoneNumber && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wider mb-0.5 text-gray-400">Phone</p>
                                            <a href={`tel:${driver.phoneNumber}`}
                                                className="flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-xl transition w-fit"
                                                style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #dcfce7' }}>
                                                📞 {driver.phoneNumber}
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    {driverDetail?.vehicleType && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wider mb-0.5 text-gray-400">Vehicle</p>
                                            <p className="font-bold text-gray-900">🚚 {driverDetail.vehicleType}</p>
                                        </div>
                                    )}
                                    {driverDetail?.vehicleModel && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wider mb-0.5 text-gray-400">Model</p>
                                            <p className="font-bold text-gray-900">{driverDetail.vehicleModel}</p>
                                        </div>
                                    )}
                                    {driverDetail?.registrationNo && (
                                        <div>
                                            <p className="text-xs uppercase tracking-wider mb-0.5 text-gray-400">Registration</p>
                                            <p className="font-bold text-gray-900 font-mono tracking-tighter">{driverDetail.registrationNo}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <span className="text-4xl opacity-30 block mb-2">🚗</span>
                            <p className="text-sm font-medium text-gray-500">No driver assigned yet</p>
                            <p className="text-xs mt-1 text-gray-400">Driver will be assigned once your order is processed</p>
                        </div>
                    )}
                </div>

                {/* Delivery Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {/* Seller / From */}
                    <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #eee' }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-[#b06040]">🏭 Pickup (Bhatta)</h3>
                        <p className="font-bold text-gray-900">{bhattaName}</p>
                        {order.admin.bhattaDetail?.address && (
                            <p className="text-xs mt-1 text-gray-500 leading-snug">{order.admin.bhattaDetail.address}</p>
                        )}
                        {order.admin.bhattaDetail?.phoneNumber && (
                            <a href={`tel:${order.admin.bhattaDetail.phoneNumber}`}
                                className="inline-flex items-center gap-1 mt-2 text-xs font-bold px-2 py-1 rounded-lg transition"
                                style={{ background: 'rgba(176,96,64,0.05)', color: '#b06040', border: '1px solid rgba(176,96,64,0.1)' }}>
                                📞 {order.admin.bhattaDetail.phoneNumber}
                            </a>
                        )}
                    </div>

                    {/* Customer Pin / Dropoff */}
                    <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #eee' }}>
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-600">📍 Your Delivery Location</h3>
                        <p className="text-sm font-medium text-gray-900 leading-snug">{order.address}</p>
                        {mapsLink && (
                            <a href={mapsLink} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold px-3 py-1.5 rounded-xl transition"
                                style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe' }}>
                                🗺️ View on Google Maps
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
