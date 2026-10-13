'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const inputSt = { backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' };

export default function CustomerRegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) setImageUrl(data.url);
            else setError('Failed to upload image');
        } catch (err) {
            setError('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    // Agreements
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone || !city || !password || !confirm) {
            setError('Please fill in all required fields.'); return;
        }
        if (password !== confirm) {
            setError("Passwords don't match."); return;
        }
        if (!acceptTerms || !acceptPrivacy) {
            setError("You must accept the Terms and Privacy Policy to continue."); return;
        }

        setLoading(true); setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'CUSTOMER',
                    phoneNumber: phone,
                    city,
                    profilePhotoUrl: imageUrl // Add the profile photo URL
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            // Redirect straight to products page after successful signup
            router.push('/products');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-secondary)] relative overflow-hidden">

            {/* Glows */}
            {/* Subtle decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-5" style={{ background: 'radial-gradient(circle,var(--accent-primary),transparent)', transform: 'translate(-40%,-40%)' }} />
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-5" style={{ background: 'radial-gradient(circle,var(--accent-primary),transparent)', transform: 'translate(40%,40%)' }} />

            <div className="relative w-full max-w-xl">
                {/* Logo */}
                <Link href="/" className="inline-flex items-center gap-2 mb-10 group">
                    <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
                        <rect width="32" height="32" rx="8" fill="#b06040" />
                        <rect x="4" y="8" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                        <rect x="16" y="8" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                        <rect x="4" y="15" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                        <rect x="18" y="15" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                        <rect x="4" y="22" width="8" height="5" rx="1" fill="#fff" fillOpacity="0.5" />
                        <rect x="14" y="22" width="14" height="5" rx="1" fill="#fff" fillOpacity="0.8" />
                    </svg>
                    <span className="text-xl font-black text-[var(--text-primary)] tracking-tight">Apna <span className="text-[var(--accent-primary)]">Bhatta</span></span>
                </Link>

                {/* Form Card */}
                <div className="rounded-3xl p-8 bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-2xl" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.05)' }}>
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight mb-2">Create Customer Account</h1>
                        <p className="text-sm font-medium text-[var(--text-secondary)]">Join us to quickly explore and order bricks directly to your construction sites.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl text-xs font-bold flex items-start gap-3 bg-red-50 border border-red-200 text-red-600 shadow-sm animate-shake">
                            <span className="text-lg leading-none mt-0.5">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Profile Picture Upload */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-inner mb-3">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">👤</div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <label className="cursor-pointer px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:bg-[var(--border-primary)] transition-colors">
                                {imageUrl ? 'Change Photo' : 'Upload Profile Photo'}
                                <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Full Name *</label>
                                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ring-1 ring-[var(--border-primary)] transition-all" style={inputSt} placeholder="e.g. Ali Ahmed" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Mobile Number *</label>
                                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ring-1 ring-[var(--border-primary)] transition-all" style={inputSt} placeholder="03XXXXXXXXX" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ring-1 ring-[var(--border-primary)] transition-all" style={inputSt} placeholder="ali@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">City *</label>
                                <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ring-1 ring-[var(--border-primary)] transition-all" style={inputSt} placeholder="e.g. Lahore" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Password *</label>
                                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ring-1 ring-[var(--border-primary)] transition-all" style={inputSt} placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Confirm Password *</label>
                                <input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] ring-1 ring-[var(--border-primary)] transition-all" style={inputSt} placeholder="••••••••" />
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded border mt-0.5 transition-colors" style={{ borderColor: acceptTerms ? 'var(--accent-primary)' : 'var(--border-primary)', backgroundColor: acceptTerms ? 'var(--accent-primary)' : 'transparent' }}>
                                    <input type="checkbox" className="sr-only" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} />
                                    {acceptTerms && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                                <span className="text-sm select-none font-medium text-[var(--text-secondary)]">I agree to the <a href="#" className="font-bold text-[var(--text-primary)] hover:underline">Terms & Conditions</a></span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded border mt-0.5 transition-colors" style={{ borderColor: acceptPrivacy ? 'var(--accent-primary)' : 'var(--border-primary)', backgroundColor: acceptPrivacy ? 'var(--accent-primary)' : 'transparent' }}>
                                    <input type="checkbox" className="sr-only" checked={acceptPrivacy} onChange={e => setAcceptPrivacy(e.target.checked)} />
                                    {acceptPrivacy && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                                <span className="text-sm select-none font-medium text-[var(--text-secondary)]">I accept the <a href="#" className="font-bold text-[var(--text-primary)] hover:underline">Privacy Policy</a></span>
                            </label>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-xl text-white font-bold tracking-wide transition relative overflow-hidden group disabled:opacity-50 shadow-md"
                                style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 12px rgba(176,96,64,0.2)' }}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Create Customer Account'
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>

                     <div className="mt-8 pt-6 border-t font-bold text-sm text-center border-[var(--border-primary)] text-[var(--text-secondary)]">
                        Already have an account?{' '}
                        <Link href="/login/customer" className="text-[var(--accent-primary)] hover:underline ml-1">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Bottom Links */}
                 <div className="mt-8 text-center text-xs font-bold space-x-6 text-[var(--text-secondary)] opacity-80">
                    <Link href="/register/driver" className="hover:text-[var(--accent-primary)] transition">Register as Driver</Link>
                </div>
            </div>
        </div>
    );
}
