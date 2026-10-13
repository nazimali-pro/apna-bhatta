'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DriverRegisterPage() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    
    // New Driver Specific Fields
    const [city, setCity] = useState('');
    const [cnic, setCnic] = useState('');
    const [license, setLicense] = useState('');
    const [licenseExpiry, setLicenseExpiry] = useState('');
    const [vehicleType, setVehicleType] = useState('Tractor Trolley');
    const [vehicleModel, setVehicleModel] = useState('');
    const [registrationNo, setRegistrationNo] = useState('');
    const [loadCapacity, setLoadCapacity] = useState('');
    const [easypaisaNumber, setEasypaisaNumber] = useState('');
    
    // New Driver Specific Documents
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [cnicFront, setCnicFront] = useState<File | null>(null);
    const [cnicBack, setCnicBack] = useState<File | null>(null);
    const [licenseImg, setLicenseImg] = useState<File | null>(null);
    const [vehicleImg, setVehicleImg] = useState<File | null>(null);
    const [regBook, setRegBook] = useState<File | null>(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptPrivacy, setAcceptPrivacy] = useState(false);

    const router = useRouter();

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to upload image');
        return data.url;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError("Passwords don't match");
            return;
        }

        if (!acceptTerms || !acceptPrivacy) {
            setError("You must accept the Terms & Conditions and Privacy Policy");
            return;
        }

        if (!profilePic || !cnicFront || !cnicBack || !licenseImg || !vehicleImg || !regBook) {
            setError("All verification documents and a profile photo are required.");
            return;
        }

        setLoading(true);

        try {
            // 1. Upload all documents first
            const [
                profilePhotoUrl,
                cnicFrontUrl,
                cnicBackUrl,
                licenseImageUrl,
                vehicleImageUrl,
                registrationBook
            ] = await Promise.all([
                uploadFile(profilePic),
                uploadFile(cnicFront),
                uploadFile(cnicBack),
                uploadFile(licenseImg),
                uploadFile(vehicleImg),
                uploadFile(regBook)
            ]);

            // 2. Register with the uploaded URLs
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'DRIVER',
                    phoneNumber: phone,
                    city,
                    cnic,
                    license,
                    licenseExpiry,
                    vehicleType,
                    vehicleModel,
                    registrationNo,
                    loadCapacity: parseInt(loadCapacity) || 0,
                    easypaisaNumber,
                    cnicFrontUrl,
                    cnicBackUrl,
                    licenseImageUrl,
                    vehicleImageUrl,
                    registrationBook,
                    profilePhotoUrl
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');

            router.push('/driver');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-secondary)] relative overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-5 blur-[120px]" style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}></div>
                <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full opacity-5 blur-[100px]" style={{ background: 'radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)' }}></div>
            </div>

            <div className="w-full max-w-xl relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
                            <rect width="32" height="32" rx="8" fill="#b06040" />
                            <rect x="4" y="8" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                            <rect x="16" y="8" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                            <rect x="4" y="15" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                            <rect x="18" y="15" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                            <rect x="4" y="22" width="8" height="5" rx="1" fill="#fff" fillOpacity="0.5" />
                            <rect x="14" y="22" width="14" height="5" rx="1" fill="#fff" fillOpacity="0.8" />
                        </svg>
                        <span className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                            Apna <span className="text-[var(--accent-primary)]">Bhatta</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2 tracking-tight">Drive with Us</h1>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">Register as a delivery partner and start earning today.</p>
                </div>

                {/* Form Card */}
                <div className="rounded-[2.5rem] p-8 sm:p-10 bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-2xl relative" style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.06)' }}>
                    
                    {error && (
                        <div className="mb-6 p-4 rounded-xl flex items-start gap-3 text-xs font-bold bg-red-50 border border-red-200 text-red-600 shadow-sm animate-shake">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest pb-2 border-b border-[var(--border-primary)] text-[var(--accent-primary)]">
                                Driver Information
                            </h3>

                            {/* Profile Photo Upload */}
                            <div className="flex flex-col items-center justify-center py-4 gap-3 bg-[var(--bg-secondary)] rounded-3xl border-2 border-dashed border-[var(--border-primary)] mb-6">
                                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center border-4 border-white group">
                                    {profilePic ? (
                                        <img src={URL.createObjectURL(profilePic)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl">👤</span>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <input type="file" accept="image/*" className="hidden" onChange={e => setProfilePic(e.target.files?.[0] || null)} />
                                    </label>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-primary)] mb-1">Upload Profile Photo *</p>
                                    <p className="text-[9px] font-medium text-[var(--text-secondary)]">Required for identification</p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Full Name *</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                    placeholder="Ali Raza" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Mobile Number *</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="0300 1234567" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Email (Optional)</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="driver@example.com" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">City *</label>
                                    <input type="text" value={city} onChange={e => setCity(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="e.g. Lahore" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">CNIC Number *</label>
                                    <input type="text" value={cnic} onChange={e => setCnic(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="35201-XXXXXXX-X" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Driving License Number *</label>
                                    <input type="text" value={license} onChange={e => setLicense(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="LHR-12345" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">License Expiry *</label>
                                    <input type="date" value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)]" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Vehicle Type *</label>
                                    <select value={vehicleType} onChange={e => setVehicleType(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)]">
                                        <option value="Tractor Trolley">Tractor Trolley</option>
                                        <option value="Truck">Truck</option>
                                        <option value="Mazda">Mazda</option>
                                        <option value="Pickup">Pickup</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Vehicle Number *</label>
                                    <input type="text" value={registrationNo} onChange={e => setRegistrationNo(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="e.g. LEC-1234" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Vehicle Model *</label>
                                    <input type="text" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="e.g. 2022 Hino" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Load Capacity (Bricks) *</label>
                                    <input type="number" value={loadCapacity} onChange={e => setLoadCapacity(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="e.g. 3000" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Easypaisa/JazzCash Number *</label>
                                <input type="tel" value={easypaisaNumber} onChange={e => setEasypaisaNumber(e.target.value)} required
                                    className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                    placeholder="03XX XXXXXXX" />
                            </div>
                        </div>

                        {/* Identity Verification Section */}
                        <div className="space-y-4 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest pb-2 border-b border-[var(--border-primary)] text-[var(--accent-primary)]">
                                Verification Documents (Photo Uploads)
                            </h3>
                            <p className="text-[10px] text-[var(--text-secondary)] font-medium italic opacity-70 mt-[-10px]">Please upload clear photos of your original documents. All fields are mandatory.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[var(--text-secondary)] tracking-widest">CNIC Front Photo *</label>
                                    <input type="file" accept="image/*" onChange={e => setCnicFront(e.target.files?.[0] || null)} required
                                        className="w-full px-3 py-2 rounded-lg text-[11px] ring-1 ring-[var(--border-primary)] bg-[var(--bg-secondary)] file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[var(--accent-primary)] file:text-white hover:file:opacity-90 cursor-pointer" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[var(--text-secondary)] tracking-widest">CNIC Back Photo *</label>
                                    <input type="file" accept="image/*" onChange={e => setCnicBack(e.target.files?.[0] || null)} required
                                        className="w-full px-3 py-2 rounded-lg text-[11px] ring-1 ring-[var(--border-primary)] bg-[var(--bg-secondary)] file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[var(--accent-primary)] file:text-white hover:file:opacity-90 cursor-pointer" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[var(--text-secondary)] tracking-widest">License Photo *</label>
                                    <input type="file" accept="image/*" onChange={e => setLicenseImg(e.target.files?.[0] || null)} required
                                        className="w-full px-3 py-2 rounded-lg text-[11px] ring-1 ring-[var(--border-primary)] bg-[var(--bg-secondary)] file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[var(--accent-primary)] file:text-white hover:file:opacity-90 cursor-pointer" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[var(--text-secondary)] tracking-widest">Vehicle Photo *</label>
                                    <input type="file" accept="image/*" onChange={e => setVehicleImg(e.target.files?.[0] || null)} required
                                        className="w-full px-3 py-2 rounded-lg text-[11px] ring-1 ring-[var(--border-primary)] bg-[var(--bg-secondary)] file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[var(--accent-primary)] file:text-white hover:file:opacity-90 cursor-pointer" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider mb-1 text-[var(--text-secondary)] tracking-widest">Reg Book Photo *</label>
                                <input type="file" accept="image/*" onChange={e => setRegBook(e.target.files?.[0] || null)} required
                                    className="w-full px-3 py-2 rounded-lg text-[11px] ring-1 ring-[var(--border-primary)] bg-[var(--bg-secondary)] file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[var(--accent-primary)] file:text-white hover:file:opacity-90 cursor-pointer" />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest pb-2 border-b border-[var(--border-primary)] text-[var(--accent-primary)]">
                                Account Security
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Password *</label>
                                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[var(--text-secondary)]">Confirm Password *</label>
                                    <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                                        className="w-full px-4 py-3 rounded-xl text-sm transition-all ring-1 ring-[var(--border-primary)] focus:ring-2 focus:ring-[var(--accent-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-50"
                                        placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                             <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded border transition-colors" style={{ borderColor: acceptTerms ? 'var(--accent-primary)' : 'var(--border-primary)', backgroundColor: acceptTerms ? 'var(--accent-primary)' : 'transparent' }}>
                                    <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                                    {acceptTerms && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className="text-sm font-bold text-[var(--text-secondary)]">I agree to the <Link href="/terms" className="text-[var(--text-primary)] hover:underline decoration-[var(--accent-primary)] underline-offset-4">Terms & Conditions</Link></span>
                            </label>
                            
                             <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5 rounded border transition-colors" style={{ borderColor: acceptPrivacy ? 'var(--accent-primary)' : 'var(--border-primary)', backgroundColor: acceptPrivacy ? 'var(--accent-primary)' : 'transparent' }}>
                                    <input type="checkbox" className="absolute opacity-0 w-full h-full cursor-pointer" checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} />
                                    {acceptPrivacy && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <span className="text-sm font-bold text-[var(--text-secondary)]">I have read the <Link href="/privacy" className="text-[var(--text-primary)] hover:underline decoration-[var(--accent-primary)] underline-offset-4">Privacy Policy</Link></span>
                            </label>
                        </div>

                        <button type="submit" disabled={loading}
                            className="w-full py-4 px-6 rounded-xl font-bold text-white tracking-wide transition-all shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                            style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 12px rgba(176,96,64,0.2)' }}>
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? 'Creating Account...' : 'Continue to Dashboard'}
                                {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                            </span>
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center space-y-4 pb-10">
                    <p className="text-sm font-bold text-[var(--text-secondary)]">
                        Already a driver? <Link href="/login/driver" className="text-[var(--accent-primary)] hover:underline decoration-[var(--accent-primary)] underline-offset-4 transition">Sign In</Link>
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest pt-6 border-t border-[var(--border-primary)] text-[var(--text-secondary)] opacity-80">
                        <Link href="/register/customer" className="hover:text-[var(--accent-primary)] transition">Register as Customer</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
