'use client';

import { useState } from 'react';
import { formatDateTime } from '@/lib/utils';

type Report = {
    id: string; name: string; email: string; type: string; subject: string;
    message: string; status: string; adminNote: string | null; createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
    OPEN: 'bg-[#fffdec] text-[#856404] border-[#fde68a]',
    IN_PROGRESS: 'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
    RESOLVED: 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]',
    CLOSED: 'bg-gray-100 text-gray-700 border-gray-200',
};

const TYPE_ICONS: Record<string, string> = {
    general: '💬', bug: '🐛', order: '📦', delivery: '🚚', payment: '💳', other: '📝'
};

export default function SupportClient({ initialReports }: { initialReports: Report[] }) {
    const [reports, setReports] = useState(initialReports);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [busy, setBusy] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [notes, setNotes] = useState<Record<string, string>>({});

    const updateReport = async (id: string, status?: string, adminNote?: string) => {
        setBusy(id);
        const body: any = {};
        if (status) body.status = status;
        if (adminNote !== undefined) body.adminNote = adminNote;

        const res = await fetch(`/api/admin/support/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            setReports(r => r.map(x => x.id === id ? { ...x, ...body } : x));
        }
        setBusy(null);
    };

    const deleteReport = async (id: string) => {
        if (!confirm('Delete this support report permanently?')) return;
        setBusy(id);
        const res = await fetch(`/api/admin/support/${id}`, { method: 'DELETE' });
        if (res.ok) setReports(r => r.filter(x => x.id !== id));
        setBusy(null);
    };

    const filtered = reports.filter(r => {
        const matchesSearch = r.subject.toLowerCase().includes(search.toLowerCase()) ||
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const openCount = reports.filter(r => r.status === 'OPEN').length;
    const inProgressCount = reports.filter(r => r.status === 'IN_PROGRESS').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-black text-[#2a1409]">Support Inbox</h1>
                    <p className="text-sm text-[#8a7a6c]">Manage and resolve user contact reports and platform issues.</p>
                </div>
                <div className="flex gap-3">
                    {openCount > 0 && (
                        <div className="text-[10px] font-black tracking-widest bg-[#fffdec] border border-[#fde68a] px-3 py-1.5 rounded-xl text-[#856404]">
                            {openCount} OPEN
                        </div>
                    )}
                    {inProgressCount > 0 && (
                        <div className="text-[10px] font-black tracking-widest bg-[#eff6ff] border border-[#bfdbfe] px-3 py-1.5 rounded-xl text-[#1d4ed8]">
                            {inProgressCount} IN PROGRESS
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by subject, name, or email…"
                    className="flex-1 max-w-sm rounded-xl px-4 py-2.5 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="rounded-xl px-4 py-2.5 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm cursor-pointer"
                >
                    <option value="ALL">All Statuses</option>
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="CLOSED">CLOSED</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="p-16 text-center bg-white border border-[#f0e8e0] rounded-[2rem] shadow-sm">
                    <p className="text-5xl mb-4">✨</p>
                    <p className="font-black text-[#2a1409] text-lg">All clear! No support reports found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map(r => {
                        const isExpanded = expanded === r.id;
                        return (
                            <div key={r.id} className="rounded-[2rem] border border-[#f0e8e0] bg-white overflow-hidden shadow-sm">
                                {/* Header Row */}
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-5 gap-4 cursor-pointer hover:bg-[#fdfaf8] transition-colors"
                                    onClick={() => setExpanded(isExpanded ? null : r.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl filter grayscale">{TYPE_ICONS[r.type] || '📝'}</span>
                                        <div>
                                            <p className="font-black text-[#2a1409] text-base">{r.subject}</p>
                                            <p className="text-xs text-[#8a7a6c] font-bold mt-0.5">{r.name} · {r.email} · {formatDateTime(r.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full border ${STATUS_COLORS[r.status] || STATUS_COLORS.CLOSED}`}>
                                            {r.status}
                                        </span>
                                        <span className="text-[#8a7a6c] text-sm transform transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                                    </div>
                                </div>

                                {/* Expanded Detail */}
                                {isExpanded && (
                                    <div className="border-t border-[#f0e8e0] px-6 py-6 bg-[#fdfaf8] space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7a6c] mb-2">Message Content</p>
                                            <p className="text-[#2a1409] text-sm leading-relaxed p-5 bg-white rounded-2xl border border-[#f0e8e0] shadow-sm whitespace-pre-wrap">{r.message}</p>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#8a7a6c] mb-2">Resolution Note (Internal)</p>
                                            <textarea
                                                rows={3}
                                                value={notes[r.id] ?? (r.adminNote || '')}
                                                onChange={e => setNotes(n => ({ ...n, [r.id]: e.target.value }))}
                                                placeholder="Document the resolution steps or internal notes here…"
                                                className="w-full rounded-2xl p-4 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm resize-none"
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-[#8a7a6c] uppercase">Status:</span>
                                                <select
                                                    value={r.status}
                                                    onChange={e => updateReport(r.id, e.target.value)}
                                                    disabled={busy === r.id}
                                                    className="text-xs font-black px-4 py-2 rounded-xl border border-[#f0e8e0] bg-white text-[#2a1409] outline-none cursor-pointer hover:border-[#b06040] transition-colors"
                                                >
                                                    <option value="OPEN">OPEN</option>
                                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                    <option value="RESOLVED">RESOLVED</option>
                                                    <option value="CLOSED">CLOSED</option>
                                                </select>
                                            </div>
                                            
                                            <button
                                                onClick={() => updateReport(r.id, undefined, notes[r.id] ?? r.adminNote ?? '')}
                                                disabled={busy === r.id}
                                                className="text-xs px-6 py-2 rounded-xl font-black tracking-widest bg-[#2a1409] text-white hover:bg-[#b06040] transition disabled:opacity-40 shadow-sm"
                                            >
                                                {busy === r.id ? 'PENDING...' : 'SAVE NOTE'}
                                            </button>
                                            
                                            <button
                                                onClick={() => deleteReport(r.id)}
                                                disabled={busy === r.id}
                                                className="text-xs px-6 py-2 rounded-xl font-black tracking-widest text-[#b91c1c] border border-[#fecaca] bg-[#fef2f2] hover:bg-[#fee2e2] transition disabled:opacity-40 ml-auto shadow-sm"
                                            >
                                                🗑️ DELETE PERMANENTLY
                                            </button>
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
