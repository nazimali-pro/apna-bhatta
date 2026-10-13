'use client';

type Report = {
    id: string; name: string; email: string; type: string; subject: string;
    message: string; status: string; adminNote?: string | null; createdAt: string;
};

type Stats = { totalUsers: number; totalProducts: number; totalDrivers: number; totalCustomers: number; totalOrders: number; totalRevenue: number };

export default function AdminDashboardClient({ stats, initialReports }: {
    stats: Stats; initialReports: Report[];
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: '👥', sub: `${stats.totalCustomers} customers` },
                    { label: 'Products', value: stats.totalProducts, icon: '🧱', sub: 'In catalog' },
                    { label: 'Drivers', value: stats.totalDrivers, icon: '🚚', sub: 'Delivery drivers' },
                    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', sub: 'All time' },
                ].map(s => (
                    <div key={s.label} className="rounded-xl p-5 shadow-sm" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                        <span className="text-2xl block mb-2">{s.icon}</span>
                        <p className="text-3xl font-extrabold text-[var(--text-primary)]">{s.value}</p>
                        <p className="text-xs font-bold mt-1 text-[var(--accent-primary)]">{s.label}</p>
                        <p className="text-xs mt-0.5 text-[var(--text-secondary)] opacity-70">{s.sub}</p>
                    </div>
                ))}
            </div>
            
            <div className="rounded-xl p-6 flex items-center justify-between shadow-sm" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-[var(--accent-primary)]">Total Revenue (Delivered & Paid)</p>
                    <p className="text-4xl font-black text-[var(--text-primary)]">PKR {stats.totalRevenue.toLocaleString()}</p>
                </div>
                <span className="text-5xl opacity-10">💰</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Open Reports', value: initialReports.filter(r => r.status === 'OPEN').length, color: '#ef4444' },
                    { label: 'In Progress', value: initialReports.filter(r => r.status === 'IN_PROGRESS').length, color: '#3b82f6' },
                    { label: 'Resolved Reports', value: initialReports.filter(r => r.status === 'RESOLVED').length, color: '#22c55e' },
                ].map(s => (
                    <div key={s.label} className="rounded-xl p-5 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                        <p className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-sm mt-1 text-[var(--text-secondary)]">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
