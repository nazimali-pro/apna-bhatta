'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthPage, AuthInput, AuthButton, AuthError, AuthLinks } from '@/components/auth-components';

function CustomerLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/products';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            if (data.user.role !== 'CUSTOMER') throw new Error(`This account is registered as ${data.user.role}. Please use the correct login page.`);
            router.push(redirect);
        } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Login failed'); }
        finally { setLoading(false); }
    };

    return (
        <AuthPage title="Customer Login" subtitle="Customer Portal">
            <form onSubmit={handleLogin} className="space-y-4">
                <AuthInput label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                <AuthInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                <AuthError message={error} />
                <AuthButton loading={loading} label="Sign In as Customer" />
            </form>
            <div className="border-t pt-4 space-y-2 border-[var(--border-primary)]">
                <AuthLinks links={[{ label: "Don't have an account? Register", href: '/register/customer' }]} />
                <AuthLinks links={[{ label: 'Driver Login', href: '/login/driver' }]} />
            </div>
        </AuthPage>
    );
}

export default function CustomerLoginPage() {
    return <Suspense fallback={null}><CustomerLoginForm /></Suspense>;
}
