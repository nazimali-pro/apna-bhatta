'use client';

import { useState } from 'react';
import AdminCustomersList from './AdminCustomersList';
import AdminDriversList from './AdminDriversList';

export default function AdminUsersView({ 
    initialCustomers, 
    initialDrivers 
}: { 
    initialCustomers: any[]; 
    initialDrivers: any[]; 
}) {
    const [activeTab, setActiveTab] = useState<'customers' | 'drivers'>('customers');

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-[var(--border-primary)] pb-4">
                <button 
                    onClick={() => setActiveTab('customers')}
                    className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'customers' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] border border-[var(--border-primary)] shadow-sm' : 'text-[var(--text-secondary)] opacity-70 hover:opacity-100'}`}
                >
                    Customers
                </button>
                <button 
                    onClick={() => setActiveTab('drivers')}
                    className={`px-4 py-2 font-bold rounded-lg transition-colors ${activeTab === 'drivers' ? 'bg-[var(--bg-secondary)] text-[var(--accent-primary)] border border-[var(--border-primary)] shadow-sm' : 'text-[var(--text-secondary)] opacity-70 hover:opacity-100'}`}
                >
                    Delivery Fleet
                </button>
            </div>

            <div className="mt-6">
                {activeTab === 'customers' && <AdminCustomersList initialCustomers={initialCustomers} />}
                {activeTab === 'drivers' && <AdminDriversList initialDrivers={initialDrivers} />}
            </div>
        </div>
    );
}
