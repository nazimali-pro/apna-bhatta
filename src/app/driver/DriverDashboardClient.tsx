'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationMap } from '@/components/map-components';

type DeliveryItem = {
    id: string;
    orderId: string;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    bhattaName: string;
    pickupAddress: string;
    pickupPhone: string;
    customerName: string;
    dropoffAddress: string;
    customerPhone: string;
    customerLat?: number | null;
    customerLng?: number | null;
};

type DriverDashboardClientProps = {
    driver: {
        id: string;
        name: string;
        phoneNumber: string | null;
        email: string;
        driverDetail?: {
            isVerified: boolean;
        } | null;
    };
    availableDeliveries: DeliveryItem[];
    activeDeliveries: DeliveryItem[];
    historicalDeliveries: DeliveryItem[];
};

export default function DriverDashboardClient({
    driver,
    availableDeliveries,
    activeDeliveries,
    historicalDeliveries
}: DriverDashboardClientProps) {
    const isVerified = driver.driverDetail?.isVerified || false;
    const [activeTab, setActiveTab] = useState<'AVAILABLE' | 'ACTIVE' | 'HISTORY' | 'PROFILE'>(isVerified ? 'AVAILABLE' : 'PROFILE');
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    // Profile State
    const [name, setName] = useState(driver.name);
    const [phoneNumber, setPhoneNumber] = useState(driver.phoneNumber || '');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [navDelivery, setNavDelivery] = useState<DeliveryItem | null>(null);
    const [currentPos, setCurrentPos] = useState<{lat: number, lng: number} | null>(null);

    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.replace('/login/driver');
    };

    const handleAcceptDelivery = async (deliveryId: string) => {
        if (!isVerified) {
            setError("Your account is pending verification. You cannot accept orders yet.");
            return;
        }
        setLoadingId(deliveryId);
        setError(null);
        try {
            const res = await fetch(`/api/driver/deliveries/${deliveryId}/accept`, {
                method: 'POST'
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to accept delivery');
            router.refresh();
            setActiveTab('ACTIVE');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingId(null);
        }
    };

    const handleUpdateStatus = async (deliveryId: string, newStatus: string) => {
        setLoadingId(deliveryId);
        setError(null);
        try {
            const res = await fetch(`/api/driver/deliveries/${deliveryId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to update status');
            router.refresh();
            if (newStatus === 'DELIVERED') {
                setActiveTab('HISTORY');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingId(null);
        }
    };
    
    // Live Location Tracking
    useEffect(() => {
        if (!isVerified || activeDeliveries.length === 0) return;
        
        let lastUpdate = 0;
        const INTERVAL = 30000;

        const watchId = navigator.geolocation.watchPosition(
            async (pos) => {
                const now = Date.now();
                const { latitude, longitude } = pos.coords;
                setCurrentPos({ lat: latitude, lng: longitude });
                if (now - lastUpdate < INTERVAL) return;
                lastUpdate = now;
                for (const d of activeDeliveries) {
                    try {
                        await fetch(`/api/driver/deliveries/${d.id}/location`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ latitude, longitude })
                        });
                    } catch (e) {
                        console.error('Location update failed', e);
                    }
                }
            },
            (err) => console.error('Geo error', err),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, [isVerified, activeDeliveries]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileSuccess('');
        setError(null);
        try {
            const res = await fetch('/api/driver/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phoneNumber })
            });
            if (!res.ok) throw new Error('Failed to update profile');
            setProfileSuccess('Profile updated successfully!');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        }
    };

    // Calculate totals for stats
    const totalEarned = historicalDeliveries.reduce((sum, d) => sum + (d.paymentMethod === 'COD' ? d.totalAmount : 0), 0); // Simplified calculation

    const renderDeliveryCard = (delivery: DeliveryItem, type: 'AVAILABLE' | 'ACTIVE' | 'HISTORY') => (
        <div key={delivery.id} className="rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 relative"
             style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
            
            {/* Gradient Top Border */}
            <div className="h-1 w-full" style={{ background: type === 'AVAILABLE' ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : type === 'ACTIVE' ? 'linear-gradient(90deg, #b06040, #d07050)' : 'linear-gradient(90deg, #10b981, #34d399)' }} />

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-primary)] uppercase tracking-widest">
                            Order {delivery.orderId.split('-')[0]}
                        </span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-[#b06040]">To Collect (COD)</p>
                        <p className="font-black text-xl text-[var(--text-primary)]">
                            {delivery.paymentMethod === 'COD' ? `PKR ${delivery.totalAmount.toLocaleString()}` : 'PAID ONLINE'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[50%] left-6 right-6 h-0.5 bg-gradient-to-r" style={{ backgroundImage: 'linear-gradient(to right, var(--border-primary) 50%, transparent 50%)', backgroundSize: '10px 2px', zIndex: 0 }} />
                    
                    {/* Pickup */}
                    <div className="flex-1 bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-primary)] relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">🏭</span>
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#f0a070' }}>Pickup</span>
                        </div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-1">{delivery.bhattaName}</h4>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{delivery.pickupAddress}</p>
                        <a href={`tel:${delivery.pickupPhone}`} className="text-xs font-medium px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-primary)] transition inline-flex items-center gap-1">
                            📞 {delivery.pickupPhone}
                        </a>
                    </div>
                    
                    {/* Dropoff */}
                    <div className="flex-1 bg-[var(--bg-primary)] p-4 rounded-xl border border-[var(--border-primary)] relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📍</span>
                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#60a5fa' }}>Dropoff</span>
                        </div>
                        <h4 className="font-bold text-[var(--text-primary)] mb-1">{delivery.customerName}</h4>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">{delivery.dropoffAddress}</p>
                        <a href={`tel:${delivery.customerPhone}`} className="text-xs font-medium px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-primary)] hover:bg-[var(--bg-primary)] transition inline-flex items-center gap-1">
                            📞 {delivery.customerPhone}
                        </a>
                    </div>
                </div>

                {type === 'AVAILABLE' && (
                    <button 
                        onClick={() => handleAcceptDelivery(delivery.id)}
                        disabled={loadingId === delivery.id || !isVerified}
                        className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50 ${!isVerified ? 'cursor-not-allowed bg-gray-400' : 'shadow-blue-500/20 hover:shadow-blue-500/30'}`}
                        style={{ background: isVerified ? 'linear-gradient(135deg, #2563eb, #3b82f6)' : undefined }}>
                        {loadingId === delivery.id ? 'Accepting...' : !isVerified ? 'Accept Restricted (Pending Verification)' : 'Accept Delivery'}
                    </button>
                )}

                {type === 'ACTIVE' && (
                    <div className="flex gap-3">
                        {delivery.customerLat && delivery.customerLng && (
                            <button 
                                onClick={() => setNavDelivery(delivery)}
                                className="flex-1 py-3 text-center rounded-xl font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition flex items-center justify-center gap-2">
                                🗺️ In-Site Nav
                            </button>
                        )}
                        <button 
                            onClick={() => handleUpdateStatus(delivery.id, 'DELIVERED')}
                            disabled={loadingId === delivery.id}
                            className="flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all disabled:opacity-50"
                            style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                            {loadingId === delivery.id ? 'Updating...' : 'Mark Delivered'}
                        </button>
                    </div>
                )}

                {type === 'HISTORY' && (
                    <div className="w-full py-3 text-center rounded-xl font-bold text-green-700 bg-green-50 border border-green-200">
                        Completed successfully
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-300 bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Ambient Background */}
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none opacity-10 blur-[100px]" style={{ background: 'radial-gradient(circle, #b06040, transparent 70%)' }} />
            
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">Driver Board</h1>
                        <p className="text-sm text-[var(--text-secondary)]">Find loads, deliver bricks, and track your earnings.</p>
                    </div>
                    {/* Stats + Logout */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="px-5 py-3 rounded-2xl backdrop-blur-md border bg-white shadow-sm border-gray-100 min-w-[120px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Active</p>
                                <p className="font-black text-2xl text-gray-900">{activeDeliveries.length}</p>
                            </div>
                            <div className="px-5 py-3 rounded-2xl backdrop-blur-md border bg-white shadow-sm border-gray-100 min-w-[120px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-0.5">Completed</p>
                                <p className="font-black text-2xl text-gray-900">{historicalDeliveries.length}</p>
                            </div>
                            <div className="px-5 py-3 rounded-2xl backdrop-blur-md border bg-[#fdfaf8] shadow-sm border-[#f0e0d0] min-w-[140px]">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#b06040] mb-0.5">Total Earned</p>
                                <p className="font-black text-2xl text-[#b06040]">PKR {totalEarned.toLocaleString()}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout}
                            className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition shadow-sm hover:shadow-md active:scale-95"
                            style={{ backgroundColor: 'white', color: '#d03030', border: '1px solid #fee2e2' }}>
                            🚪 Logout
                        </button>
                    </div>
                </div>

                {!isVerified && (
                    <div className="mb-10 p-6 rounded-[2rem] border-2 border-amber-200 bg-amber-50/50 backdrop-blur-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <span className="text-6xl">⏳</span>
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-xl font-black text-amber-800 mb-2 flex items-center gap-2">
                                Verification Pending
                            </h2>
                            <p className="text-sm font-bold text-amber-700/80 max-w-2xl leading-relaxed">
                                Welcome to the team! Our administrators are currently reviewing your documents and vehicle details. 
                                You will be able to start accepting deliveries as soon as your account is verified.
                            </p>
                            <div className="mt-4 flex gap-3">
                                <div className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest border border-amber-200">
                                    CNIC & License Reviewing
                                </div>
                                <div className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest border border-amber-200">
                                    Vehicle Inspection Pending
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border" style={{ backgroundColor: 'rgb(254, 242, 242)', borderColor: 'rgb(254, 202, 202)', color: 'rgb(185, 28, 28)' }}>
                        <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-[var(--bg-secondary)] p-1.5 rounded-xl border border-[var(--border-primary)] inline-flex">
                    {[
                        { id: 'AVAILABLE', label: `Available (${availableDeliveries.length})` },
                        { id: 'ACTIVE', label: `Active (${activeDeliveries.length})` },
                        { id: 'HISTORY', label: 'History' },
                        { id: 'PROFILE', label: 'Profile' }
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm border border-[var(--border-primary)]' 
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
                            }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Contents */}
                <div className="space-y-6">
                    {activeTab === 'AVAILABLE' && (
                        availableDeliveries.length === 0 ? (
                            <div className="text-center py-20 rounded-2xl border border-[var(--border-primary)]" style={{ background: 'var(--bg-secondary)' }}>
                                <span className="text-5xl opacity-40 block mb-4">🛣️</span>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No loads available</h3>
                                <p style={{ color: '#8a7a6c' }}>Waiting for new customer orders. Check back soon!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {availableDeliveries.map(d => renderDeliveryCard(d, 'AVAILABLE'))}
                            </div>
                        )
                    )}

                    {activeTab === 'ACTIVE' && (
                        activeDeliveries.length === 0 ? (
                            <div className="text-center py-20 rounded-2xl border border-[var(--border-primary)]" style={{ background: 'var(--bg-secondary)' }}>
                                <span className="text-5xl opacity-40 block mb-4">🚚</span>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No active deliveries</h3>
                                <p style={{ color: '#8a7a6c' }}>Head over to the Available tab to accept a load.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                {activeDeliveries.map(d => renderDeliveryCard(d, 'ACTIVE'))}
                            </div>
                        )
                    )}

                    {activeTab === 'HISTORY' && (
                        historicalDeliveries.length === 0 ? (
                            <div className="text-center py-20 rounded-2xl border border-[var(--border-primary)]" style={{ background: 'var(--bg-secondary)' }}>
                                <span className="text-5xl opacity-40 block mb-4">📜</span>
                                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No history</h3>
                                <p style={{ color: '#8a7a6c' }}>You haven't completed any deliveries yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {historicalDeliveries.map(d => renderDeliveryCard(d, 'HISTORY'))}
                            </div>
                        )
                    )}

                    {activeTab === 'PROFILE' && (
                        <div className="max-w-xl mx-auto backdrop-blur-xl p-8 rounded-2xl border bg-[var(--bg-secondary)] border-[var(--border-primary)]">
                            <h2 className="text-2xl font-extrabold text-[var(--text-primary)] mb-6">Driver Profile</h2>
                            
                            {profileSuccess && (
                                <div className="mb-6 p-4 rounded-xl flex items-start gap-3 text-sm font-medium border bg-green-50 border-green-200 text-green-700">
                                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    {profileSuccess}
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Email</label>
                                    <input type="text" value={driver.email} disabled className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border-primary)] cursor-not-allowed" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Full Name</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-primary)] outline-none focus:ring-2 focus:ring-[#b06040] transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">Mobile Number (Customer Contact)</label>
                                    <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-primary)] outline-none focus:ring-2 focus:ring-[#b06040] transition-all" />
                                </div>
                                <div className="pt-4 border-t border-white/10 mt-6">
                                    <button type="submit" className="w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                                        style={{ background: 'linear-gradient(135deg, #b06040, #d07050)' }}>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Overlay */}
            {navDelivery && (
                <div className="fixed inset-0 z-[100] flex flex-col bg-white">
                    <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
                        <div>
                            <h3 className="font-black text-gray-900">Navigating to {navDelivery.customerName}</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{navDelivery.dropoffAddress}</p>
                        </div>
                        <button 
                            onClick={() => setNavDelivery(null)}
                            className="p-2 rounded-full hover:bg-gray-100 text-gray-900 transition font-bold"
                        >
                            ✕ Close
                        </button>
                    </div>
                    <div className="flex-1 relative">
                        {currentPos ? (
                           <NavigationMap 
                               driverLat={currentPos.lat}
                               driverLng={currentPos.lng}
                               destLat={navDelivery.customerLat!}
                               destLng={navDelivery.customerLng!}
                               bhattaName={navDelivery.bhattaName}
                               customerName={navDelivery.customerName}
                           />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 flex-col gap-4">
                                <span className="text-4xl animate-bounce">🛰️</span>
                                <p className="font-black uppercase tracking-widest text-xs">Acquiring your position...</p>
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-white border-t flex gap-4">
                        <a href={`tel:${navDelivery.customerPhone}`} className="flex-1 py-4 text-center rounded-2xl font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-200">
                            📞 Call Customer
                        </a>
                        <button 
                            onClick={() => {
                                if(confirm('Mark as delivered?')) {
                                    handleUpdateStatus(navDelivery.id, 'DELIVERED');
                                    setNavDelivery(null);
                                }
                            }}
                            className="flex-1 py-4 text-center rounded-2xl font-black uppercase tracking-widest text-white shadow-xl"
                            style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}
                        >
                            Mark Delivered
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
