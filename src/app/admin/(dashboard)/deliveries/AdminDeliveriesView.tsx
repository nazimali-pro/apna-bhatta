'use client';

import { useState } from 'react';

type DriverInfo = { id: string; name: string; driverDetail?: { vehicleType?: string | null } | null; };
type Delivery = {
    id: string; orderId: string; driverId: string | null; status: string;
    pickupLocation: string; dropoffLocation: string;
    deliveryCharges: number; estimatedDeliveryDate: string; createdAt: string;
    driver?: { name: string; phoneNumber: string | null; city: string | null } | null;
    order: {
        id: string; address: string; totalAmount: number; status: string;
        customer: { name: string; phoneNumber: string | null };
        admin: { name: string; bhattaDetail?: { bhattaName: string; address: string } | null };
    };
};

export default function DeliveriesClient({ initialDeliveries, availableDrivers }: { initialDeliveries: Delivery[], availableDrivers: DriverInfo[] }) {
    const [deliveries, setDeliveries] = useState(initialDeliveries);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [busy, setBusy] = useState<string | null>(null);

    const updateDeliveryDriver = async (id: string, newDriverId: string) => {
        setBusy(id);
        const res = await fetch(`/api/admin/deliveries/${id}`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ driverId: newDriverId || null }) 
        });
        if (res.ok) {
            const driver = availableDrivers.find(d => d.id === newDriverId);
            setDeliveries(dels => dels.map(d => d.id === id ? { 
                ...d, 
                driverId: newDriverId || null,
                driver: driver ? { name: driver.name, phoneNumber: null, city: null } : null
            } : d));
        }
        setBusy(null);
    };

    const updateDeliveryStatus = async (id: string, status: string) => {
        setBusy(id);
        const res = await fetch(`/api/admin/deliveries/${id}`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ status }) 
        });
        if (res.ok) {
            setDeliveries(dels => dels.map(d => d.id === id ? { ...d, status } : d));
        }
        setBusy(null);
    };

    const filtered = deliveries.filter(d => {
        const matchesSearch = 
            d.id.toLowerCase().includes(search.toLowerCase()) || 
            d.order.id.toLowerCase().includes(search.toLowerCase()) ||
            (d.driver?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            d.order.customer.name.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        const m: Record<string, string> = { 
            PENDING: 'bg-[#fffdec] text-[#856404] border-[#fde68a]', 
            ACCEPTED: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]', 
            PICKED_UP: 'bg-[#faf5ff] text-[#7e22ce] border-[#e9d5ff]',
            IN_TRANSIT: 'bg-[#ecfeff] text-[#0e7490] border-[#cffafe]', 
            DELIVERED: 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]', 
        };
        return m[status] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    const cell = 'px-4 py-4 text-sm border-b border-[#f0e8e0] align-top text-[#2a1409]';
    const th = 'px-4 py-3 text-left text-xs font-bold uppercase tracking-wider border-b border-[#f0e8e0] text-[#8a7a6c] bg-[#fdfaf8]';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-black text-[#2a1409]">Logistics & Deliveries</h1>
                    <p className="text-sm text-[#8a7a6c]">Track delivery progress, manage charges, and assign fleet drivers manually.</p>
                </div>
                <div className="text-sm font-bold bg-[#fdfaf8] border border-[#f0e8e0] px-3 py-1.5 rounded-xl text-[#b06040]">
                    Active Log: {deliveries.length}
                </div>
            </div>

            <div className="flex gap-4">
                <input 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="Search logistics by order, driver, or customer…"
                    className="flex-1 max-w-sm rounded-xl px-4 py-2.5 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm"
                />
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    className="rounded-xl px-4 py-2.5 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm cursor-pointer"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="PENDING">PENDING</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="PICKED_UP">PICKED_UP</option>
                    <option value="IN_TRANSIT">IN_TRANSIT</option>
                    <option value="DELIVERED">DELIVERED</option>
                </select>
            </div>

            <div className="rounded-[2rem] overflow-hidden border border-[#f0e8e0] bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className={th}>Order & Route</th>
                                <th className={th}>Timeline</th>
                                <th className={th}>Charges (PKR)</th>
                                <th className={th}>Driver Assigned</th>
                                <th className={th}>Status & Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f0e8e0]">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} suppressHydrationWarning className="px-4 py-12 text-center text-[#8a7a6c] italic">
                                        No delivery logs found matching the criteria.
                                    </td>
                                </tr>
                            ) : filtered.map(d => (
                                <tr key={d.id} className="hover:bg-[#fdfaf8] transition-colors">
                                    <td className={cell}>
                                        <div className="flex flex-col gap-1">
                                            <p className="font-black text-[#2a1409]">ORD-{d.order.id.split('-')[0].toUpperCase()}</p>
                                            <div className="p-2 rounded-lg bg-[#fdfaf8] border border-[#f0e8e0] text-[10px] space-y-1">
                                                <p><span className="font-bold text-[#b06040]">FROM:</span> {d.order.admin.bhattaDetail?.bhattaName || d.order.admin.name}</p>
                                                <p><span className="font-bold text-[#b06040]">TO:</span> {d.order.customer.name} ({d.order.address})</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={cell}>
                                        <p className="font-bold">{new Date(d.createdAt).toLocaleDateString()}</p>
                                        <p className="text-xs text-[#8a7a6c]">{new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className={cell}>
                                        <p className="font-black text-lg text-[#b06040]">PKR {(d.deliveryCharges || 0).toLocaleString()}</p>
                                        <p className="text-[10px] uppercase font-bold text-[#8a7a6c]">Total: PKR {(d.order.totalAmount || 0).toLocaleString()}</p>
                                    </td>
                                    <td className={cell}>
                                        <select 
                                            value={d.driverId || ''} 
                                            onChange={e => updateDeliveryDriver(d.id, e.target.value)}
                                            disabled={busy === d.id}
                                            className="w-full text-xs font-bold p-2 rounded-lg bg-[#fdfaf8] border border-[#f0e8e0] text-[#2a1409] outline-none focus:border-[#b06040] disabled:opacity-50"
                                        >
                                            <option value="">Unassigned</option>
                                            {availableDrivers.map(dr => (
                                                <option key={dr.id} value={dr.id}>{dr.name} ({dr.driverDetail?.vehicleType || 'No Vehicle Info'})</option>
                                            ))}
                                        </select>
                                        {d.driver && (
                                            <p className="mt-2 text-[10px] font-bold text-[#b06040] uppercase">✅ Assigned</p>
                                        )}
                                    </td>
                                    <td className={cell}>
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-widest border text-center ${getStatusColor(d.status)}`}>
                                                {d.status}
                                            </span>
                                            <select 
                                                value={d.status} 
                                                onChange={e => updateDeliveryStatus(d.id, e.target.value)}
                                                disabled={busy === d.id}
                                                className="text-[10px] font-black p-1.5 rounded-lg bg-white border border-[#f0e8e0] text-[#2a1409] outline-none focus:border-[#b06040] cursor-pointer"
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="ACCEPTED">ACCEPTED</option>
                                                <option value="PICKED_UP">PICKED_UP</option>
                                                <option value="IN_TRANSIT">IN_TRANSIT</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
