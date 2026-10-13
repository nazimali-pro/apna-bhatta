'use client';

import { useState } from 'react';

type SentNotification = { title: string; message: string; targetRole: string; sentAt: string; };

export default function NotificationsPage() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [targetRole, setTargetRole] = useState('ALL');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState<SentNotification[]>([]);
    const [error, setError] = useState('');

    const sendNotification = async () => {
        if (!title.trim() || !message.trim()) {
            setError('Title and message are required.');
            return;
        }
        setError('');
        setSending(true);
        const res = await fetch('/api/admin/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, message, targetRole })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            setSent(prev => [data.meta, ...prev]);
            setTitle('');
            setMessage('');
        } else {
            setError(data.error || 'Failed to send notification.');
        }
        setSending(false);
    };

    return (
        <div className="max-w-2xl space-y-10">
            <div className="mb-2">
                <h1 className="text-2xl font-black text-[#2a1409]">Broadcast Notifications</h1>
                <p className="text-sm text-[#8a7a6c]">Send platform-wide alerts or role-targeted messages to users instantly.</p>
            </div>

            {/* Compose Panel */}
            <div className="rounded-[2.5rem] border border-[#f0e8e0] bg-white overflow-hidden shadow-sm">
                <div className="px-8 py-6 bg-[#fdfaf8] border-b border-[#f0e8e0]">
                    <h2 className="font-black text-[#2a1409] text-lg tracking-tight">📣 Compose Notification</h2>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#8a7a6c] mb-2">Target Audience</label>
                        <select
                            value={targetRole}
                            onChange={e => setTargetRole(e.target.value)}
                            className="w-full rounded-2xl px-5 py-4 text-sm outline-none bg-[#fdfaf8] border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm cursor-pointer appearance-none"
                        >
                            <option value="ALL">🌐 All Network Users</option>
                            <option value="CUSTOMER">🛒 Customers Only</option>
                            <option value="DRIVER">🚚 Drivers Only</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#8a7a6c] mb-2">Notification Title</label>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., New Feature Released, Important Update…"
                            maxLength={100}
                            className="w-full rounded-2xl px-5 py-4 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm"
                        />
                        <p className="text-[9px] font-black text-[#8a7a6c] mt-2 text-right tracking-widest">{title.length}/100 CHARS</p>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[#8a7a6c] mb-2">Message Body</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={5}
                            placeholder="Write the full notification content here…"
                            maxLength={500}
                            className="w-full rounded-2xl px-5 py-4 text-sm outline-none bg-white border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm resize-none"
                        />
                        <p className="text-[9px] font-black text-[#8a7a6c] mt-2 text-right tracking-widest">{message.length}/500 CHARS</p>
                    </div>

                    {error && (
                        <div className="text-xs font-black tracking-widest text-[#b91c1c] bg-[#fef2f2] border border-[#fecaca] px-5 py-4 rounded-xl">
                            ⚠️ {error.toUpperCase()}
                        </div>
                    )}

                    <button
                        onClick={sendNotification}
                        disabled={sending}
                        className="w-full py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition disabled:opacity-40 shadow-md transform active:scale-95 bg-[#2a1409] text-white hover:bg-[#b06040]"
                    >
                        {sending ? 'BROADCASTING…' : 'SEND BROADCAST TO ' + (targetRole === 'ALL' ? 'ALL USERS' : targetRole + 'S')}
                    </button>
                </div>
            </div>

            {/* Sent Log */}
            {sent.length > 0 && (
                <div className="rounded-[2.5rem] border border-[#f0e8e0] bg-white overflow-hidden shadow-sm">
                    <div className="px-8 py-6 bg-[#fdfaf8] border-b border-[#f0e8e0]">
                        <h2 className="font-black text-[#2a1409] text-lg tracking-tight">✅ Sent This Session ({sent.length})</h2>
                    </div>
                    <div className="divide-y divide-[#f0e8e0]">
                        {sent.map((n, i) => (
                            <div key={i} className="px-8 py-5 hover:bg-[#fdfaf8] transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-black text-[#2a1409] text-base">{n.title}</p>
                                        <p className="text-sm text-[#8a7a6c] font-medium leading-relaxed">{n.message}</p>
                                    </div>
                                    <div className="text-right ml-6 flex-shrink-0">
                                        <p className="text-[9px] font-black tracking-widest text-[#15803d] bg-[#f0fdf4] px-2.5 py-1 rounded-full border border-[#bbf7d0]">
                                            {n.targetRole}
                                        </p>
                                        <p className="text-[9px] font-black tracking-widest text-[#8a7a6c] mt-2">{new Date(n.sentAt).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {sent.length === 0 && (
                <div className="text-center py-10 bg-white border border-dashed border-[#f0e8e0] rounded-[2.5rem]">
                    <p className="text-sm text-[#8a7a6c] font-bold tracking-widest uppercase">No notifications broadcasted yet.</p>
                </div>
            )}
        </div>
    );
}
