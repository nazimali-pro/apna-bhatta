'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';

type Customer = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    _count: { orders: number };
};

export default function CustomersClient({ initialCustomers }: { initialCustomers: Customer[] }) {
    const [customers, setCustomers] = useState(initialCustomers);
    const [search, setSearch] = useState('');
    const [busy, setBusy] = useState<string | null>(null);

    const deleteUser = async (id: string) => {
        if (!confirm('Delete this customer and all their data? This action cannot be undone.')) return;
        setBusy(id);
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) setCustomers(c => c.filter(x => x.id !== id));
        setBusy(null);
    };

    const changeRole = async (id: string, role: string) => {
        if (!confirm(`Change role to ${role}? They will misalign with their profile.`)) return;
        setBusy(id);
        const res = await fetch(`/api/admin/users/${id}`, { 
            method: 'PATCH', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ role }) 
        });
        if (res.ok) {
            const updated = await res.json();
            setCustomers(c => c.map(x => x.id === id ? { ...x, role: updated.role } : x));
        }
        setBusy(null);
    };

    const filtered = customers.filter(c => 
        c.name.toLowerCase().includes(search.toLowerCase()) || 
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const cell = 'px-4 py-3 text-sm border-b border-[var(--border-primary)] text-[var(--text-primary)]';
    const th = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-[var(--border-primary)] text-[var(--text-secondary)] opacity-70';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Customers</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Manage registered buyers on the platform.</p>
                </div>
                <div className="text-sm font-bold bg-[var(--bg-secondary)] border border-[var(--border-primary)] px-3 py-1.5 rounded-lg text-[var(--accent-primary)] shadow-sm">
                    Total: {customers.length}
                </div>
            </div>

            <div className="mb-4">
                <input 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="Search by name or email…"
                    className="w-full max-w-sm rounded-lg px-4 py-2 text-sm outline-none bg-[var(--bg-primary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] shadow-sm"
                />
            </div>

            <div className="rounded-xl overflow-hidden border border-[var(--border-primary)] bg-[var(--bg-primary)] shadow-sm">
                <table className="min-w-full">
                    <thead className="bg-[var(--bg-secondary)]">
                        <tr>
                            <th className={th}>Name</th>
                            <th className={th}>Email</th>
                            <th className={th}>Orders</th>
                            <th className={th}>Joined</th>
                            <th className={th}>Role Control</th>
                            <th className={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-secondary)] opacity-50 text-sm">No customers found.</td>
                            </tr>
                        ) : filtered.map(c => (
                            <tr key={c.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                <td className={cell}>
                                    <p className="font-bold text-[var(--text-primary)]">{c.name}</p>
                                </td>
                                <td className={cell}>
                                    <p className="text-[var(--text-secondary)]">{c.email}</p>
                                </td>
                                <td className={cell}>
                                    <span className="bg-[var(--bg-secondary)] text-[var(--accent-primary)] px-2 py-0.5 rounded text-xs font-bold border border-[var(--border-primary)]">
                                        {c._count.orders} total
                                    </span>
                                </td>
                                <td className={cell}>
                                    <span className="opacity-70">{formatDate(c.createdAt)}</span>
                                </td>
                                <td className={cell}>
                                    <select 
                                        value={c.role} 
                                        onChange={e => changeRole(c.id, e.target.value)} 
                                        disabled={busy === c.id}
                                        className="text-xs font-bold px-2 py-1 rounded bg-green-50 text-green-700 outline-none border border-green-200 cursor-pointer shadow-sm"
                                    >
                                        <option value="CUSTOMER">CUSTOMER</option>
                                        <option value="DRIVER">DRIVER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className={cell}>
                                    <button 
                                        onClick={() => deleteUser(c.id)} 
                                        disabled={busy === c.id}
                                        className="text-xs px-3 py-1.5 rounded font-bold transition disabled:opacity-40 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                                    >
                                        {busy === c.id ? '…' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
