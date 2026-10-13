'use client';

import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// --- AUTH UI COMPONENTS (from AuthUI.tsx) ---

export const Logo = () => (
    <Link href="/" className="flex items-center gap-2 mb-8">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#b06040" />
            <rect x="4" y="8" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
            <rect x="16" y="8" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
            <rect x="4" y="15" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
            <rect x="18" y="15" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
            <rect x="4" y="22" width="8" height="5" rx="1" fill="#fff" fillOpacity="0.5" />
            <rect x="14" y="22" width="14" height="5" rx="1" fill="#fff" fillOpacity="0.8" />
        </svg>
        <span className="text-xl font-black text-[var(--text-primary)] tracking-tight">
            Apna <span className="text-[var(--accent-primary)]">Bhatta</span>
        </span>
    </Link>
);

export function AuthInput({
    label, type, value, onChange, placeholder, required = true,
}: {
    label: string; type: string; value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string; required?: boolean;
}) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (show ? 'text' : 'password') : type;

    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-wide mb-1.5 text-[var(--text-secondary)]">{label}</label>
            <div className="relative">
                <input
                    type={inputType} value={value} onChange={onChange}
                    placeholder={placeholder} required={required}
                    suppressHydrationWarning
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50 ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] shadow-sm"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow(!show)}
                        suppressHydrationWarning
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors p-1"
                        tabIndex={-1}
                    >
                        {show ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

export function AuthPage({
    title, subtitle, children,
}: {
    title: string; subtitle: string; children: ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-secondary)] relative overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-5"
                style={{ background: 'radial-gradient(circle, var(--accent-primary), transparent)', transform: 'translate(-40%,-40%)' }} />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none opacity-5"
                style={{ background: 'radial-gradient(circle, var(--accent-primary), transparent)', transform: 'translate(40%,40%)' }} />

            <div className="relative z-10 w-full max-w-md mx-auto py-12">
                <div className="flex justify-center"><Logo /></div>
                <div className="text-center mb-8">
                    <p className="text-xs font-bold uppercase tracking-widest mb-1 text-[var(--accent-primary)]">{subtitle}</p>
                    <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">{title}</h1>
                </div>

                <div className="rounded-3xl p-8 space-y-6 bg-[var(--bg-primary)] shadow-2xl"
                    style={{
                        boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                    }}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export function AuthButton({ loading, label }: { loading: boolean; label: string }) {
    return (
        <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 shadow-md"
            style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 12px rgba(176,96,64,0.2)' }}>
            {loading ? (
                <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                </div>
            ) : label}
        </button>
    );
}

export function AuthError({ message }: { message: string }) {
    return message ? (
        <div className="text-xs font-bold px-4 py-3 rounded-xl border flex items-center gap-2 bg-red-50 border-red-200 text-red-600 shadow-sm animate-shake">
            <span>⚠️</span> {message}
        </div>
    ) : null;
}

export function AuthLinks({ links }: { links: { label: string; href: string }[] }) {
    return (
        <div className="text-center text-xs pt-2 text-[var(--text-secondary)]">
            {links.map((l, i) => (
                <span key={l.href}>
                    {i > 0 && <span className="mx-2 opacity-50">·</span>}
                    <Link href={l.href} className="hover:text-[var(--accent-primary)] transition-colors font-bold text-[var(--accent-primary)]">
                        {l.label}
                    </Link>
                </span>
            ))}
        </div>
    );
}

// --- LOGOUT BUTTON (from LogoutButton.tsx) ---

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
        >
            Sign out
        </button>
    );
}

// --- SESSION AUTH GUARD (from SessionAuthGuard.tsx) ---

type GuardProps = {
    /** The role required to stay on this page (e.g. 'SELLER', 'CUSTOMER', 'DRIVER') */
    requiredRole: string;
    /** Where to redirect if not authenticated / wrong role */
    loginPath: string;
};

/**
 * SessionAuthGuard — drop into any authenticated layout or page.
 * On every mount (including back-button restore from browser cache),
 * it checks the live session and redirects to loginPath if invalid.
 * Renders nothing — pure side-effect component.
 */
export function SessionAuthGuard({ requiredRole, loginPath }: GuardProps) {
    const router = useRouter();

    useEffect(() => {
        fetch('/api/auth/verify', { credentials: 'same-origin' })
            .then(res => {
                if (!res.ok) {
                    router.replace(loginPath);
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data && data.role !== requiredRole) {
                    router.replace(loginPath);
                }
            })
            .catch(() => {
                router.replace(loginPath);
            });
    }, [router, requiredRole, loginPath]);

    return null;
}
