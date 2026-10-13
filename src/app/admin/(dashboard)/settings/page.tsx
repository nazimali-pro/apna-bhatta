'use client';

import { useState, useEffect } from 'react';

type Settings = {
    platformName: string; contactEmail: string; contactPhone: string;
    commissionRate: string | number; minOrderQty: string | number;
    deliveryBaseCharge: string | number; deliveryPerKmRate: string | number;
    maintenanceMode: boolean; allowNewRegistrations: boolean;
    requireDriverApproval: boolean;
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetch('/api/admin/settings')
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setLoading(false);
            })
            .catch(err => console.error('Failed to load settings:', err));
    }, []);

    const update = (key: keyof Settings, value: string | boolean) => {
        if (!settings) return;
        setSettings({ ...settings, [key]: value });
        setSaved(false);
    };

    const saveSettings = async () => {
        if (!settings) return;
        setSaving(true);
        const res = await fetch('/api/admin/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (res.ok) setSaved(true);
        setSaving(false);
    };

    if (loading || !settings) return (
        <div className="flex h-64 items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b06040]"></div>
        </div>
    );

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <div className="rounded-[2.5rem] border border-[#f0e8e0] bg-white overflow-hidden mb-10 shadow-sm">
            <div className="px-8 py-6 bg-[#fdfaf8] border-b border-[#f0e8e0]">
                <h2 className="font-black text-[#2a1409] text-lg tracking-tight">{title}</h2>
            </div>
            <div className="p-8 space-y-8">{children}</div>
        </div>
    );

    const Field = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div>
                <p className="font-black text-[#2a1409] text-sm tracking-tight">{label}</p>
                {hint && <p className="text-[10px] text-[#8a7a6c] font-bold mt-1 leading-relaxed uppercase tracking-widest">{hint}</p>}
            </div>
            <div className="md:col-span-2">{children}</div>
        </div>
    );

    const textInput = (key: keyof Settings, placeholder?: string) => (
        <input
            value={settings[key] as string}
            onChange={e => update(key, e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-2xl px-5 py-4 text-sm outline-none bg-[#fdfaf8] border border-[#f0e8e0] text-[#2a1409] focus:border-[#b06040] shadow-sm"
        />
    );

    const toggle = (key: keyof Settings) => (
        <button
            onClick={() => update(key, !settings[key])}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-inner ${settings[key] ? 'bg-[#b06040]' : 'bg-[#e0d6cd]'}`}
        >
            <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${settings[key] ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="max-w-4xl pb-10">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-[#2a1409] tracking-tight">Platform Configuration</h1>
                <p className="text-sm text-[#8a7a6c] mt-2 font-medium">Manage platform labels, commission rates, and access controls permanently.</p>
            </div>

            <Section title="⚙️ Identity & Contacts">
                <Field label="Platform Branding">
                    {textInput('platformName', 'Official platform name')}
                </Field>
                <Field label="Administrative Email">
                    {textInput('contactEmail', 'admin@apnabhatta.com')}
                </Field>
                <Field label="Support Hotline">
                    {textInput('contactPhone', '+92 300 0000000')}
                </Field>
            </Section>

            <Section title="💰 Economics & Logistics">
                <Field label="Network Fee (%)" hint="Platform commission deducted from each successful sale automatically">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">{textInput('commissionRate', '5')}</div>
                        <span className="text-[#8a7a6c] font-black text-xl">%</span>
                    </div>
                </Field>
                <Field label="Base Delivery Fee (PKR)" hint="Flat handling fee applied to every fleet delivery">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">{textInput('deliveryBaseCharge', '500')}</div>
                        <span className="text-[#8a7a6c] font-black text-xs uppercase tracking-widest">PKR</span>
                    </div>
                </Field>
                <Field label="Logistics Rate (PKR/KM)" hint="Variable distance-based charge for transport services">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">{textInput('deliveryPerKmRate', '50')}</div>
                        <span className="text-[#8a7a6c] font-black text-xs uppercase tracking-widest">PKR/KM</span>
                    </div>
                </Field>
                <Field label="Threshold Quantity" hint="Minimum allowed order size for brick deliveries">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">{textInput('minOrderQty', '500')}</div>
                        <span className="text-[#8a7a6c] font-black text-xs uppercase tracking-widest">Bricks</span>
                    </div>
                </Field>
            </Section>

            <Section title="🔐 Security & Access Governance">
                <Field label="Emergency Maintenance" hint="Instantly lock the platform for all non-admin users">
                    <div className="flex items-center gap-4">
                        {toggle('maintenanceMode')}
                        <span className={`text-[10px] font-black tracking-[0.1em] px-3 py-1.5 rounded-full border ${settings.maintenanceMode ? 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]' : 'bg-[#f0fdf4] text-[#15803d] border-[#bbf7d0]'}`}>
                            {settings.maintenanceMode ? '🚨 SYSTEM SUSPENDED' : '🟢 LIVE OPERATION'}
                        </span>
                    </div>
                </Field>
                <Field label="Registration Gateway" hint="Enable or disable the ability for new users to join the network">
                    <div className="flex items-center gap-4">
                        {toggle('allowNewRegistrations')}
                        <span className="text-[10px] font-black text-[#8a7a6c] tracking-widest uppercase">{settings.allowNewRegistrations ? 'Gateway Open' : 'Gateway Closed'}</span>
                    </div>
                </Field>
                <Field label="Driver Verification" hint="Force document verification for all fleet applicants before dispatch">
                    <div className="flex items-center gap-4">
                        {toggle('requireDriverApproval')}
                        <span className="text-[10px] font-black text-[#8a7a6c] tracking-widest uppercase">{settings.requireDriverApproval ? 'Strict Vetting' : 'Auto-Authorize'}</span>
                    </div>
                </Field>
            </Section>

            {saved && (
                <div className="text-xs font-black tracking-widest text-[#15803d] bg-[#f0fdf4] border border-[#bbf7d0] px-8 py-5 rounded-3xl mb-10 shadow-sm">
                    ✅ PLATFORM CONFIGURATION SYNCHRONIZED SUCCESSFULLY
                </div>
            )}

            <button
                onClick={saveSettings}
                disabled={saving}
                className="w-full py-6 rounded-[2rem] font-black text-lg tracking-[0.2em] shadow-lg transition transform active:scale-[0.98] disabled:opacity-40 bg-[#2a1409] text-white hover:bg-[#b06040]"
            >
                {saving ? '⏳ SYNCHRONIZING...' : '💾 PERSIST ALL SETTINGS'}
            </button>
        </div>
    );
}
