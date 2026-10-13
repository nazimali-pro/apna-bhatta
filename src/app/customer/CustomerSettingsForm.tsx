'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CustomerSettingsProps = {
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
        city: string | null;
        image: string | null;
    }
};

type PasswordInputProps = {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    required?: boolean;
    className: string;
};

const PasswordInput = ({ label, value, onChange, placeholder, required, className }: PasswordInputProps) => {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-[#92400e] opacity-60">{label}</label>
            <div className="relative">
                <input
                    required={required}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    suppressHydrationWarning
                    className={className}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    suppressHydrationWarning
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92400e] opacity-40 hover:opacity-100 transition-opacity p-2"
                >
                    {show ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                </button>
            </div>
        </div>
    );
};

export default function CustomerSettingsForm({ user }: CustomerSettingsProps) {
    const router = useRouter();
    
    // Profile State
    const [name, setName] = useState(user.name);
    const [phone, setPhone] = useState(user.phoneNumber || '');
    const [city, setCity] = useState(user.city || '');
    const [imageUrl, setImageUrl] = useState(user.image || '');
    const [uploading, setUploading] = useState(false);
    
    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Common UI State
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) setImageUrl(data.url);
            else throw new Error(data.error);
        } catch (err: any) {
            setMsg({ type: 'error', text: 'Image upload failed: ' + err.message });
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setMsg({ type: '', text: '' });
        try {
            const res = await fetch('/api/customer/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phoneNumber: phone, city, image: imageUrl })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMsg({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => window.location.reload(), 1000);
        } catch (err: any) {
            setMsg({ type: 'error', text: err.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return setMsg({ type: 'error', text: 'New passwords do not match' });
        }
        setLoading(true); setMsg({ type: '', text: '' });
        try {
            const res = await fetch('/api/customer/settings/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setMsg({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err: any) {
            setMsg({ type: 'error', text: err.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/customer/profile', { method: 'DELETE' });
            if (res.ok) {
                router.push('/login/customer');
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete account');
            }
        } catch (err: any) {
            setMsg({ type: 'error', text: err.message });
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const inputSt = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#92400e]/20 border border-amber-900/5 bg-gray-50/50 transition-all font-medium text-[var(--text-primary)]";

    return (
        <div className="space-y-8 pb-20 animate-fade-in relative">
            {msg.text && (
                <div className="fixed top-20 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-right duration-300"
                    style={{
                        backgroundColor: msg.type === 'success' ? '#f0fdf4' : '#fef2f2',
                        borderColor: msg.type === 'success' ? '#bbf7d0' : '#fecaca',
                        color: msg.type === 'success' ? '#16a34a' : '#dc2626'
                    }}>
                    <p className="text-sm font-black flex items-center gap-2">
                        {msg.type === 'success' ? '✅ Success' : '❌ Error'}: {msg.text}
                    </p>
                </div>
            )}

            {/* Profile Editing Section */}
            <div className="bg-white rounded-3xl border border-amber-900/5 shadow-sm p-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#92400e] mb-8">Personal Details</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-50">
                        <div className="relative group shrink-0">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-900/10 shadow-lg bg-[var(--bg-secondary)]">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl opacity-10">👤</div>
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-[#92400e] text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition-all">
                                📷
                                <input type="file" className="hidden" accept="image/*" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                            </label>
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 space-y-1 text-center md:text-left">
                            <h4 className="text-lg font-black text-[var(--text-primary)]">Profile Photo</h4>
                            <p className="text-xs text-[var(--text-secondary)] opacity-60">Update your photo to be recognized in delivery updates.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#92400e] opacity-60">Full Name</label>
                            <input required type="text" value={name} onChange={e => setName(e.target.value)} suppressHydrationWarning className={inputSt} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#92400e] opacity-60">Registered Email</label>
                            <input disabled type="email" value={user.email} suppressHydrationWarning className={`${inputSt} opacity-40 bg-gray-100 cursor-not-allowed`} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#92400e] opacity-60">Mobile Number</label>
                            <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} suppressHydrationWarning className={inputSt} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 text-[#92400e] opacity-60">City</label>
                            <input required type="text" value={city} onChange={e => setCity(e.target.value)} suppressHydrationWarning className={inputSt} />
                        </div>
                    </div>

                    <button disabled={loading || uploading} type="submit" 
                        className="px-10 py-3.5 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-900/10 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                        {loading ? 'Updating...' : 'Save Profile Changes'}
                    </button>
                </form>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-3xl border border-amber-900/5 shadow-sm p-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#92400e] mb-8">Access & Security</h3>
                <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                    <PasswordInput 
                        label="Current Password" 
                        value={currentPassword} 
                        onChange={setCurrentPassword} 
                        className={inputSt} 
                        required 
                    />
                    <div className="grid grid-cols-1 gap-6">
                        <PasswordInput 
                            label="New Password" 
                            value={newPassword} 
                            onChange={setNewPassword} 
                            className={inputSt} 
                            required 
                        />
                        <PasswordInput 
                            label="Confirm New Password" 
                            value={confirmPassword} 
                            onChange={setConfirmPassword} 
                            className={inputSt} 
                            required 
                        />
                    </div>
                    <button disabled={loading} type="submit"
                        className="px-8 py-3 rounded-xl border border-amber-900/10 text-amber-900 font-black text-xs uppercase tracking-widest transition-all hover:bg-amber-50 active:scale-95 disabled:opacity-50">
                        Change Password
                    </button>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50/20 border border-red-200 rounded-3xl p-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700/60 mb-8 font-medium">Permanently delete your account and all associated order data. This action is irreversible.</p>
                
                {showDeleteConfirm ? (
                    <div className="flex items-center gap-4 animate-in fade-in zoom-in duration-200">
                        <button onClick={handleDeleteAccount} disabled={loading}
                            className="px-8 py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/20 hover:bg-red-700 transition-all">
                            Confirm Permanent Deletion
                        </button>
                        <button onClick={() => setShowDeleteConfirm(false)}
                            className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors">
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setShowDeleteConfirm(true)}
                        className="px-8 py-3 rounded-xl border-2 border-red-200 text-red-600 font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                        Delete My Account
                    </button>
                )}
            </div>
        </div>
    );
}
