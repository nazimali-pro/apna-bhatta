'use client';

import { useState } from 'react';

type DriverDetail = {
    cnicNumber?: string | null; cnicFrontUrl?: string | null; cnicBackUrl?: string | null;
    licenseNumber?: string | null; licenseExpiry?: string | null; licenseImageUrl?: string | null;
    vehicleType?: string | null; vehicleModel?: string | null; registrationNo?: string | null;
    loadCapacity?: number | null; vehicleImageUrl?: string | null; registrationBook?: string | null;
    bankName?: string | null; accountTitle?: string | null; accountNumber?: string | null; easypaisaNumber?: string | null;
    isVerified: boolean;
};

type Driver = {
    id: string; name: string; email: string; role: string; createdAt: string; phoneNumber?: string | null; city?: string | null;
    driverDetail?: DriverDetail | null;
};

export default function DriversClient({ initialDrivers }: { initialDrivers: Driver[] }) {
    const [drivers, setDrivers] = useState(initialDrivers);
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [actionState, setActionState] = useState<Record<string, 'verified' | 'rejected'>>({});

    const verifyDriver = async (driverId: string, action: 'verify' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this driver?`)) return;
        setBusy(driverId);
        setError(null);
        try {
            const res = await fetch('/api/admin/drivers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ driverId, action }),
            });
            const data = await res.json();
            if (res.ok) {
                setActionState(prev => ({ ...prev, [driverId]: action === 'verify' ? 'verified' : 'rejected' }));
                setDrivers(d => d.map(x => x.id === driverId && x.driverDetail ? { ...x, driverDetail: { ...x.driverDetail, isVerified: action === 'verify' } } : x));
                alert(action === 'verify' ? 'Driver approved successfully!' : 'Driver rejected.');
            } else {
                alert(`Error: ${data.error || 'Failed to update driver status'}`);
            }
        } catch (err) {
            alert('A network error occurred. Please try again.');
            console.error(err);
        }
        setBusy(null);
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Delete this driver and their history?')) return;
        setBusy(id);
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) setDrivers(d => d.filter(x => x.id !== id));
        setBusy(null);
    };

    const filtered = drivers.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase()) || 
        (u.driverDetail?.vehicleType || '').toLowerCase().includes(search.toLowerCase())
    );

    const pendingCount = drivers.filter(u => u.driverDetail && !u.driverDetail.isVerified).length;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Drivers</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Verify driver licenses, vehicles, and manage logistics fleet.</p>
                </div>
                <div className="flex gap-3">
                    {pendingCount > 0 && (
                        <div className="text-sm font-bold bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg text-amber-700 shadow-sm">
                            {pendingCount} Pending Approval
                        </div>
                    )}
                    <div className="text-sm font-bold bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-3 py-1.5 rounded-lg text-blue-600 shadow-sm">
                        Total: {drivers.length}
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <input 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    suppressHydrationWarning
                    placeholder="Search by name, email or vehicle type…"
                    className="w-full max-w-sm rounded-lg px-4 py-2 text-sm outline-none bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-blue-500 shadow-sm"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="p-8 text-center text-[var(--text-secondary)] opacity-50 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl shadow-sm">No drivers found.</div>
            ) : (
                <div className="space-y-6">
                    {filtered.map(u => {
                        const d = u.driverDetail;
                        const actionDone = actionState[u.id];
                        const verified = actionDone === 'verified' || (d?.isVerified && !actionDone);
                        const rejected = actionDone === 'rejected';

                        return (
                            <div key={u.id} className="rounded-xl overflow-hidden transition-colors shadow-sm" 
                                style={{ border: `1px solid ${verified ? '#3b82f6' : rejected ? '#f87171' : 'var(--border-primary)'}`, backgroundColor: 'var(--bg-primary)' }}>
                                
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] gap-4">
                                    <div className="flex items-center gap-4 relative">
                                        <div className="w-10 h-10 rounded-full bg-[var(--bg-primary)] border border-[var(--border-primary)] flex items-center justify-center text-xl shadow-sm">
                                            🚚
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-[var(--text-primary)] text-lg">{u.name}</p>
                                            <p className="text-sm text-[var(--text-secondary)] opacity-70">{u.email} · {u.phoneNumber || 'No phone'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm ${
                                            verified ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                            rejected ? 'bg-red-50 text-red-600 border-red-200' : 
                                            'bg-amber-50 text-amber-700 border-amber-200'
                                        }`}>
                                            {verified ? '✅ Verified Driver' : rejected ? '❌ Rejected' : '⏳ Action Required'}
                                        </span>

                                        {!verified && !rejected && d && (
                                            <>
                                                <button onClick={() => verifyDriver(u.id, 'verify')} disabled={busy === u.id}
                                                    suppressHydrationWarning
                                                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-40 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 shadow-sm">
                                                    {busy === u.id ? '…' : 'Approve'}
                                                </button>
                                                <button onClick={() => verifyDriver(u.id, 'reject')} disabled={busy === u.id}
                                                    suppressHydrationWarning
                                                    className="px-4 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-40 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm">
                                                    {busy === u.id ? '…' : 'Reject'}
                                                </button>
                                            </>
                                        )}

                                        <button onClick={() => deleteUser(u.id)} disabled={busy === u.id}
                                            suppressHydrationWarning
                                            className="ml-4 text-xs hover:text-red-600 text-[var(--text-secondary)] transition disabled:opacity-40 opacity-50 hover:opacity-100" title="Delete Driver">
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                {d && (
                                    <div className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
                                        {[
                                            ['Vehicle', d.vehicleType || '—'],
                                            ['Model / Reg', `${d.vehicleModel || '—'} / ${d.registrationNo || '—'}`],
                                            ['Load Cap.', d.loadCapacity ? `${d.loadCapacity} Bricks` : '—'],
                                            ['License No.', d.licenseNumber || '—'],
                                            ['License Expiry', d.licenseExpiry ? new Date(d.licenseExpiry).toLocaleDateString() : '—'],
                                            ['Location', u.city || '—'],
                                            ['CNIC', d.cnicNumber || '—'],
                                            ['Phone', u.phoneNumber || '—'],
                                        ].map(([label, value]) => (
                                            <div key={label}>
                                                <p className="text-[var(--text-secondary)] opacity-50 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
                                                <p className="text-[var(--text-primary)] font-medium break-words">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Documents */}
                                {d && (d.cnicFrontUrl || d.cnicBackUrl || d.licenseImageUrl || d.vehicleImageUrl || d.registrationBook) && (
                                    <div className="px-5 py-4 bg-[var(--bg-primary)]">
                                        <p className="text-[var(--text-secondary)] opacity-50 text-[10px] font-bold uppercase tracking-wider mb-3">Verification Documents</p>
                                        <div className="flex gap-4 flex-wrap">
                                            {[
                                                { url: d.cnicFrontUrl, label: 'CNIC Front' },
                                                { url: d.cnicBackUrl, label: 'CNIC Back' },
                                                { url: d.licenseImageUrl, label: 'License Photo' },
                                                { url: d.vehicleImageUrl, label: 'Vehicle Photo' },
                                                { url: d.registrationBook, label: 'Reg Book' },
                                            ].filter(x => x.url).map(({ url, label }) => (
                                                <a key={label} href={url!} target="_blank" rel="noreferrer"
                                                    className="group relative block overflow-hidden rounded-lg border border-[var(--border-primary)] hover:border-blue-500 transition outline-none shadow-sm">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={url!} alt={label} className="w-24 h-16 object-cover opacity-80 group-hover:opacity-100 transition" />
                                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition flex items-end justify-center pb-1">
                                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider drop-shadow-md bg-black/40 px-1 py-0.5 rounded">{label}</span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
