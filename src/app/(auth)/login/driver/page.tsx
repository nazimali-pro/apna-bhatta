'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthPage, AuthInput, AuthButton, AuthError, AuthLinks } from '@/components/auth-components';

export default function DriverLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Login failed');
            if (data.user.role !== 'DRIVER') throw new Error(`This account is registered as ${data.user.role}. Please use the correct login page.`);
            router.push('/driver');
        } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Login failed'); }
        finally { setLoading(false); }
    };

    return (
        <AuthPage title="Driver Login" subtitle="Driver Portal">
            <form onSubmit={handleLogin} className="space-y-4">
                <AuthInput label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="driver@example.com" />
                <AuthInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                <AuthError message={error} />
                <AuthButton loading={loading} label="Sign In as Driver" />
            </form>
            <div className="border-t pt-4 space-y-2 border-[var(--border-primary)]">
                <AuthLinks links={[{ label: "No driver account? Register", href: '/register/driver' }]} />
                <AuthLinks links={[{ label: 'Customer Login', href: '/login/customer' }]} />
            </div>
        </AuthPage>
    );
}
