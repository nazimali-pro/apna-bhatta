'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// --- ORDER STATUS ACTIONS (from OrderStatusActions.tsx) ---

const NEXT_STATUS: Record<string, string> = {
    PENDING: 'PROCESSING',
    PROCESSING: 'DISPATCHED',
    DISPATCHED: 'DELIVERED',
};

const LABELS: Record<string, string> = {
    PENDING: '▶ Mark as Processing',
    PROCESSING: '🚚 Mark as Dispatched',
    DISPATCHED: '✅ Mark as Delivered',
};

export function OrderStatusActions({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(currentStatus);
    const router = useRouter();

    const next = NEXT_STATUS[status];
    if (!next) return null;

    const advance = async () => {
        setLoading(true);
        const res = await fetch(`/api/admin/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: next }),
        });
        if (res.ok) {
            setStatus(next);
            router.refresh();
        } else {
            alert('Failed to update status');
        }
        setLoading(false);
    };

    return (
        <div className="mt-5 pt-4 border-t" style={{ borderColor: '#f0e8e0' }}>
            <button onClick={advance} disabled={loading}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#b06040,#7a3820)', boxShadow: '0 4px 16px rgba(176,96,64,0.3)' }}>
                {loading ? 'Updating...' : LABELS[status]}
            </button>
            <p className="text-xs mt-2" style={{ color: '#8a7a6c' }}>Current status: <strong>{status}</strong> → will become <strong>{next}</strong></p>
        </div>
    );
}

// --- ORDERS FILTER (from OrdersFilter.tsx) ---

type Order = {
    id: string; status: string; totalAmount: number; paymentMethod: string; createdAt: string;
    customer: { name: string };
    items: { quantity: number; product: { name: string } }[];
    driverName: string | null;
};

const TABS = ['ALL', 'PENDING', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];

export function OrdersFilter({ orders, statusColors }: {
    orders: Order[];
    statusColors: Record<string, { bg: string; text: string }>;
}) {
    const [active, setActive] = useState('ALL');
    const filtered = active === 'ALL' ? orders : orders.filter(o => o.status === active);

    return (
        <div>
            {/* Tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActive(tab)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold transition"
                        style={active === tab
                            ? { background: 'linear-gradient(135deg,#b06040,#7a3820)', color: '#fff' }
                            : { backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {tab} {tab !== 'ALL' && `(${orders.filter(o => o.status === tab).length})`}
                    </button>
                ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="py-16 text-center rounded-2xl" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                    <span className="text-4xl block mb-2">📦</span>
                    <p className="font-semibold text-[var(--text-secondary)]">No {active !== 'ALL' ? active.toLowerCase() : ''} orders</p>
                </div>
            ) : (
                <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                    <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
                        {filtered.map(order => {
                            const col = statusColors[order.status] ?? { bg: '#f0f0f0', text: '#666' };
                            const date = new Date(order.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: '2-digit' });
                            return (
                                <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-[var(--bg-secondary)] transition">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-xs font-bold text-[var(--text-primary)]">#{order.id.split('-')[0].toUpperCase()}</span>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: col.bg, color: col.text }}>{order.status}</span>
                                            <span className="text-xs text-[var(--text-secondary)] opacity-60">{date}</span>
                                        </div>
                                        <p className="text-sm font-semibold truncate text-[var(--text-primary)]">{order.customer.name}</p>
                                        <p className="text-xs truncate text-[var(--text-secondary)]">
                                            {order.items.map(i => `${i.quantity.toLocaleString()}× ${i.product.name}`).join(', ')}
                                        </p>
                                        {order.driverName && (
                                            <p className="text-xs mt-0.5" style={{ color: '#6f42c1' }}>🚚 {order.driverName}</p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0 space-y-1">
                                        <p className="font-extrabold text-sm text-[var(--accent-primary)]">PKR {order.totalAmount.toLocaleString()}</p>
                                        <p className="text-xs text-[var(--text-secondary)] opacity-60">{order.paymentMethod}</p>
                                        <Link href={`/admin/orders/${order.id}`}
                                            className="inline-block px-3 py-1 rounded-lg text-xs font-bold transition hover:opacity-80 border border-[var(--border-primary)]"
                                            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--accent-primary)' }}>
                                            Manage →
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}


