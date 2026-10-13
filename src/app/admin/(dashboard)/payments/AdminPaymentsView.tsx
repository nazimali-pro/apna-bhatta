'use client';

import { useState, useMemo } from 'react';

type FinancialOrder = {
    id: string; totalAmount: number; createdAt: string; isPaid: boolean;
    admin: {
        name: string;
        bhattaDetail?: { bankName?: string | null; accountNumber?: string | null; easypaisaNumber?: string | null } | null
    };
    delivery?: {
        deliveryCharges: number;
        driver?: {
            name: string;
            driverDetail?: { bankName?: string | null; accountNumber?: string | null; easypaisaNumber?: string | null } | null;
        } | null;
    } | null;
};

export default function PaymentsClient({ initialOrders }: { initialOrders: FinancialOrder[] }) {
    const [search, setSearch] = useState('');

    const filtered = initialOrders.filter(o =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        (o.delivery?.driver?.name || '').toLowerCase().includes(search.toLowerCase())
    );

    const stats = useMemo(() => {
        let grossVolume = 0;
        let storeRevenue = 0;
        let driverPayouts = 0;

        initialOrders.forEach(o => {
            grossVolume += o.totalAmount;
            storeRevenue += o.totalAmount;
            if (o.delivery) {
                driverPayouts += o.delivery.deliveryCharges;
            }
        });

        return { grossVolume, storeRevenue, driverPayouts };
    }, [initialOrders]);

    const cell = 'px-4 py-4 text-sm border-b border-[#f0e8e0] align-top text-[#2a1409]';
    const th = 'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-[#f0e8e0] text-[#8a7a6c] bg-[#fdfaf8]';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-black text-[#2a1409]">Financial Ledger</h1>
                    <p className="text-sm text-[#8a7a6c]">Track total revenue, store earnings, and driver payouts.</p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl p-6 bg-white border border-[#f0e8e0] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7a6c] mb-1">Gross Revenue</p>
                    <p className="text-2xl font-black text-[#2a1409]">PKR {stats.grossVolume.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl p-6 relative overflow-hidden bg-[#f0fdf4] border border-[#bbf7d0] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#15803d] mb-1 relative z-10">Store Earnings</p>
                    <p className="text-2xl font-black text-[#15803d] relative z-10">PKR {stats.storeRevenue.toLocaleString()}</p>
                    <span className="text-6xl absolute -right-2 -bottom-4 opacity-10 grayscale">💰</span>
                </div>
                <div className="rounded-2xl p-6 bg-white border border-[#f0e8e0] shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] mb-1">Driver Payouts</p>
                    <p className="text-2xl font-black text-[#2a1409]">PKR {stats.driverPayouts.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search ledger by order ID or driver..."
                    className="flex-1 max-w-sm rounded-xl px-4 py-2.5 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm"
                />
            </div>

            <div className="rounded-[2rem] overflow-hidden border border-[#f0e8e0] bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className={th}>Order & Date</th>
                                <th className={th}>Order Total</th>
                                <th className={th}>Logistics / Driver Fee</th>
                                <th className={th}>Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0e8e0]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center text-[#8a7a6c] italic">No settled transactions found.</td>
                                </tr>
                            ) : filtered.map(o => {
                                const driverBank = o.delivery?.driver?.driverDetail;

                                return (
                                    <tr key={o.id} className="hover:bg-[#fdfaf8] transition-colors">
                                        <td className={cell}>
                                            <p className="font-black text-[#2a1409] font-mono text-xs mb-1">ORD-{o.id.split('-')[0].toUpperCase()}</p>
                                            <p className="text-xs text-[#8a7a6c] font-medium">{new Date(o.createdAt).toLocaleDateString()}</p>
                                        </td>

                                        <td className={cell}>
                                            <p className="font-black text-[#2a1409] text-base mb-1">PKR {o.totalAmount.toLocaleString()}</p>
                                            <p className="text-xs text-[#8a7a6c] font-bold">Apna Bhatta Store</p>
                                        </td>

                                        <td className={cell}>
                                            {o.delivery && o.delivery.driver ? (
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="font-black text-[#2563eb] text-sm">PKR {o.delivery.deliveryCharges.toLocaleString()}</p>
                                                        <p className="text-[10px] text-[#8a7a6c] font-bold">Driver: {o.delivery.driver.name}</p>
                                                    </div>
                                                    {driverBank && (
                                                        <div className="p-2 rounded-lg bg-[#fdfaf8] border border-[#f0e8e0] text-[9px] text-[#8a7a6c] font-medium leading-relaxed">
                                                            {driverBank.bankName ? (
                                                                <>{'\uD83C\uDFDB\uFE0F'} {driverBank.bankName}<br />{'💳'} {driverBank.accountNumber}</>
                                                            ) : (driverBank.easypaisaNumber ? (
                                                                <>{'📱'} Easypaisa: {driverBank.easypaisaNumber}</>
                                                            ) : '⚠️ No bank details')}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-[#8a7a6c] opacity-50 italic">No logistics attached</span>
                                            )}
                                        </td>

                                        <td className={cell}>
                                            <div className="flex flex-col gap-1.5 align-start">
                                                <span className="text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full bg-[#f0fdf4] text-[#15803d] border border-[#bbf7d0] w-max">
                                                    ✅ SETTLED
                                                </span>
                                                {!o.isPaid && (
                                                    <span className="text-[9px] font-black tracking-widest px-2.5 py-1 rounded-full bg-[#fef2f2] text-[#b91c1c] border border-[#fecaca] w-max uppercase">
                                                        ⚠️ Unpaid
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
