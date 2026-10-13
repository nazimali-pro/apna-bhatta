'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type OrderCardProps = {
    order: any;
};

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { bg: string, text: string, icon: string }> = {
        PENDING: { bg: '#fffbeb', text: '#b45309', icon: '⏳' },
        PROCESSING: { bg: '#eff6ff', text: '#1d4ed8', icon: '⚙️' },
        DISPATCHED: { bg: '#f5f3ff', text: '#6d28d9', icon: '🚚' },
        DELIVERED: { bg: '#f0fdf4', text: '#15803d', icon: '✅' },
        CANCELLED: { bg: '#fef2f2', text: '#b91c1c', icon: '❌' }
    };
    const config = configs[status] || configs.PENDING;
    return (
        <span className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-sm border border-black/5"
            style={{ backgroundColor: config.bg, color: config.text }}>
            <span>{config.icon}</span> {status}
        </span>
    );
}

export default function OrderCard({ order }: OrderCardProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to request cancellation for this order?')) return;
        
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/customer/orders/${order.id}/cancel`, {
                method: 'PATCH',
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to cancel order');
            
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl overflow-hidden bg-white border border-amber-900/5 shadow-sm hover:shadow-md transition-shadow">
            {/* Order Header */}
            <div className="p-6 flex flex-wrap justify-between items-center gap-6 border-b border-gray-50 bg-gray-50/30">
                <div className="flex gap-8">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#92400e] opacity-40 mb-1">Order ID</p>
                        <p className="text-xs font-mono font-bold text-[var(--text-primary)]">#{order.id.split('-')[0].toUpperCase()}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#92400e] opacity-40 mb-1">Placed On</p>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{formatDate(order.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#92400e] opacity-40 mb-1">Total Amount</p>
                        <p className="text-sm font-black text-[#92400e]">PKR {order.totalAmount.toLocaleString()}</p>
                    </div>
                </div>
                <StatusBadge status={order.status} />
            </div>

            {/* Order Items */}
            <div className="p-8">
                <div className="space-y-6 mb-8">
                    {order.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-xl shadow-inner border border-amber-900/5">🧱</div>
                                <div>
                                    <p className="text-sm font-black text-[var(--text-primary)]">{item.product.name}</p>
                                    <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-50 uppercase tracking-tighter">Bhatta: {order.admin.bhattaDetail?.bhattaName || 'Official Bhatta'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-[var(--text-primary)]">{item.quantity.toLocaleString()} pcs</p>
                                <p className="text-[10px] font-bold text-[var(--text-secondary)] opacity-50 uppercase tracking-tighter">PKR {item.price.toLocaleString()} / unit</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-50 items-center justify-between">
                    <div className="flex gap-3">
                        {order.status !== 'CANCELLED' && (
                            <Link href={`/customer/track/${order.id}`} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 shadow-sm shadow-blue-900/5">
                                <span>📍</span> {['DISPATCHED', 'DELIVERED'].includes(order.status) ? 'Live Tracking' : 'View Status'}
                            </Link>
                        )}
                    </div>
                    
                    {order.status === 'PENDING' && (
                        <button 
                            onClick={handleCancel}
                            disabled={loading}
                            className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:underline px-2 py-1 disabled:opacity-50"
                        >
                            {loading ? 'Cancelling...' : 'Request Cancellation'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
