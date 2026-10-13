'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogoutButton } from './auth-components';
import { useCart } from '@/context/CartContext';

export default function Navbar({ initialSession }: { initialSession: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const session = initialSession;
    const { itemCount } = useCart();

    const navLinks = [
        { href: '/', label: 'Home' },
        ...(session?.role === 'DRIVER' ? [{ href: '/driver', label: 'Deliveries' }] : []),
        { href: '/products', label: 'Products' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <nav className="sticky top-0 z-50"
            style={{
                background: 'rgba(255,251,247,0.92)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(146,64,14,0.08)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.05)'
            }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transition-transform group-hover:scale-110"
                            style={{ background: 'linear-gradient(135deg, #a16207 0%, #92400e 100%)' }}>
                            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                                <rect x="4" y="8" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                                <rect x="16" y="8" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                                <rect x="4" y="15" width="12" height="5" rx="1" fill="#fff" fillOpacity="0.7" />
                                <rect x="18" y="15" width="10" height="5" rx="1" fill="#fff" fillOpacity="0.95" />
                                <rect x="4" y="22" width="8" height="5" rx="1" fill="#fff" fillOpacity="0.5" />
                                <rect x="14" y="22" width="14" height="5" rx="1" fill="#fff" fillOpacity="0.8" />
                            </svg>
                        </div>
                        <span className="text-base font-extrabold tracking-tight" style={{ color: '#1a0a00' }}>
                            Apna{' '}
                            <span style={{
                                background: 'linear-gradient(135deg, #a16207, #92400e)',
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                            }}>Bhatta</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href}
                                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-amber-50"
                                style={{ color: '#5a3010' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#92400e'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#5a3010'; }}>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Auth & Hamburger */}
                    <div className="flex items-center gap-3">
                        {/* Cart Icon */}
                        <Link href="/cart" className="relative p-2 rounded-xl transition-all hover:bg-amber-100/50 mr-1" style={{ color: '#92400e' }}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-[10px] font-black pointer-events-none" style={{ color: 'white', border: '2px solid rgba(255,251,247,1)' }}>
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        <div className="hidden md:flex items-center gap-3 relative">
                            {session ? (
                                <>
                                    {session.role === 'CUSTOMER' ? (
                                        <div className="relative">
                                            <button 
                                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                className="flex items-center justify-center w-10 h-10 rounded-full shadow-md transition-transform hover:scale-105 overflow-hidden border-2 border-white"
                                                style={{ background: 'linear-gradient(135deg, #a16207, #92400e)', color: 'white', fontWeight: 'bold' }}
                                            >
                                                {session.image ? (
                                                    <img src={session.image} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span>{session.name ? session.name.charAt(0).toUpperCase() : 'C'}</span>
                                                )}
                                            </button>
                                            
                                            {isDropdownOpen && (
                                                <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in zoom-in duration-200"
                                                    style={{ background: '#fff', border: '1px solid rgba(146,64,14,0.1)' }}>
                                                    <div className="px-4 pb-2 mb-2 border-b" style={{ borderColor: 'rgba(146,64,14,0.05)' }}>
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#92400e] opacity-60">Signed in as</p>
                                                        <p className="text-sm font-bold truncate" style={{ color: '#1a0a00' }}>{session.name || 'Customer'}</p>
                                                    </div>
                                                    <Link href="/customer" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#92400e] transition-colors">
                                                        🏠 Dashboard
                                                    </Link>
                                                    <Link href="/customer/orders" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#92400e] transition-colors">
                                                        📦 My Orders
                                                    </Link>
                                                    <Link href="/customer/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#92400e] transition-colors">
                                                        👤 My Profile
                                                    </Link>
                                                    <Link href="/customer/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-amber-50 hover:text-[#92400e] transition-colors">
                                                        ⚙️ Account Settings
                                                    </Link>
                                                    <div className="border-t my-1" style={{ borderColor: 'rgba(146,64,14,0.1)' }}></div>
                                                    <div className="px-4 py-1" onClick={() => setIsDropdownOpen(false)}>
                                                        <LogoutButton />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                                                style={{ background: 'rgba(161,98,7,0.1)', color: '#92400e', border: '1px solid rgba(146,64,14,0.2)' }}>
                                                {session.role}
                                            </span>
                                            <LogoutButton />
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link href="/login/customer"
                                        className="px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                                        style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-amber-50 transition-colors"
                            style={{ color: '#5a3010' }}>
                            {isOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div style={{ background: '#fffbf7', borderTop: '1px solid rgba(146,64,14,0.08)' }}>
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        {navLinks.map(link => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-all"
                                style={{ color: '#5a3010' }}>
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 mt-2" style={{ borderTop: '1px solid rgba(146,64,14,0.08)' }}>
                            {session ? (
                                <div className="flex flex-col gap-3 px-3">
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#92400e' }}>{session.role === 'CUSTOMER' ? 'MY ACCOUNT' : `${session.role} PORTAL`}</span>
                                    {session.role === 'CUSTOMER' && (
                                        <>
                                            <Link href="/customer" onClick={() => setIsOpen(false)} className="py-2 text-sm font-semibold hover:text-amber-800">Dashboard</Link>
                                            <Link href="/customer/orders" onClick={() => setIsOpen(false)} className="py-2 text-sm font-semibold hover:text-amber-800">My Orders</Link>
                                            <Link href="/customer/profile" onClick={() => setIsOpen(false)} className="py-2 text-sm font-semibold hover:text-amber-800">My Profile</Link>
                                            <Link href="/customer/settings" onClick={() => setIsOpen(false)} className="py-2 text-sm font-semibold hover:text-amber-800">Account Settings</Link>
                                        </>
                                    )}
                                    <LogoutButton />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3 px-3">
                                    <Link href="/login/customer" onClick={() => setIsOpen(false)}
                                        className="py-3 text-center rounded-xl text-sm font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg, #a16207, #92400e)' }}>
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
