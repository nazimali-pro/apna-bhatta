'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminId, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Authentication failed');
            router.push('/admin');
            router.refresh();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center overflow-hidden bg-[var(--bg-secondary)]"
            style={{ height: 'calc(100vh - 64px)' }}
        >
            <div className="w-full max-w-sm">
                {/* Admin badge */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-sm">
                        <span className="text-3xl text-[var(--accent-primary)]">🔐</span>
                    </div>
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Admin Access</h1>
                    <p className="text-sm mt-1 text-[var(--text-secondary)]">Bricks Bhatta Control Panel</p>
                </div>

                {/* Warning */}
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl mb-6 text-xs font-bold bg-amber-50 border border-amber-200 text-amber-700 shadow-sm">
                    <span>⚠️</span>
                    <span>Restricted area. Authorised personnel only.</span>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide mb-1.5 text-[var(--text-secondary)]">Admin ID</label>
                        <input
                            type="text"
                            required
                            value={adminId}
                            onChange={e => setAdminId(e.target.value)}
                            placeholder="admin"
                            autoComplete="off"
                            suppressHydrationWarning
                            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wide mb-1.5 text-[var(--text-secondary)]">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                autoComplete="current-password"
                                suppressHydrationWarning
                                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                suppressHydrationWarning
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-1"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-red-50 border border-red-200 text-red-600 shadow-sm animate-shake">
                            <span>✕</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        suppressHydrationWarning
                        className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 mt-2 shadow-md"
                        style={{ backgroundColor: 'var(--accent-primary)', boxShadow: '0 4px 12px rgba(176,96,64,0.2)' }}
                    >
                        {loading ? 'Authenticating...' : 'Access Admin Panel'}
                    </button>
                </form>

                <p className="text-center text-xs mt-8 font-medium text-[var(--text-secondary)]">
                    Session expires after 8 hours
                </p>
            </div>
        </div>
    );
}
