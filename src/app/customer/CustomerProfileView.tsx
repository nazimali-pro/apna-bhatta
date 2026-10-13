'use client';

import React from 'react';
import Link from 'next/link';

type UserProfile = {
    name: string;
    email: string;
    phoneNumber: string | null;
    city: string | null;
    image: string | null;
    createdAt: Date;
    _count?: {
        orders: number;
    }
};

export default function CustomerProfileView({ user }: { user: UserProfile }) {
    const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const infoItem = (label: string, value: string | null, icon: string) => (
        <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-amber-50/10 transition-colors px-2 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-lg shrink-0 border border-amber-100/50">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#92400e] opacity-40 mb-0.5">{label}</p>
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">
                    {value || <span className="text-gray-300 italic font-medium">Not provided</span>}
                </p>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-8">
            {/* Profile Header Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-amber-900/5 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8 group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/30 rounded-bl-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>

                <div className="relative z-10 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-[var(--bg-secondary)] shrink-0 transition-transform hover:scale-105 duration-500">
                    {user.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl opacity-10 font-bold select-none">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="relative z-10 flex-1 text-center md:text-left space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-[#92400e] text-[9px] font-black uppercase tracking-widest border border-amber-100">
                        ✨ Verified Customer
                    </div>
                    <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">{user.name}</h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-[var(--text-secondary)] opacity-60">
                        <span className="flex items-center gap-1.5">
                            📅 Joined {joinDate}
                        </span>
                        {user._count && (
                            <span className="flex items-center gap-1.5">
                                📦 {user._count.orders} Orders Placed
                            </span>
                        )}
                    </div>
                </div>

                <div className="relative z-10 shrink-0">
                    <Link 
                        href="/customer/settings"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all bg-white border border-amber-900/10 hover:border-[#92400e] text-[#92400e] shadow-sm hover:translate-y-[-2px]"
                    >
                        ⚙️ Edit in Settings
                    </Link>
                </div>
            </div>

            {/* Profile Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-amber-900/5 shadow-sm p-8 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#92400e] mb-6 flex items-center gap-2">
                        📞 Contact Information
                    </h3>
                    {infoItem("Primary Email Address", user.email, "✉️")}
                    {infoItem("Mobile Phone Number", user.phoneNumber, "📱")}
                </div>

                <div className="bg-white rounded-3xl border border-amber-900/5 shadow-sm p-8 space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#92400e] mb-6 flex items-center gap-2">
                        📍 Location Details
                    </h3>
                    {infoItem("Primary Delivery City", user.city, "🏢")}
                    {infoItem("Default Territory", "Apna Bhatta Network", "🚜")}
                </div>
            </div>
        </div>
    );
}
