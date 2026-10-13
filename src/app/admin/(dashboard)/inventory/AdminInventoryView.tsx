'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

type ProductImage = { id: string; url: string };
type Product = {
    id: string; name: string; description: string;
    price: number; stock: number; imageUrl: string | null;
    brickType: string | null; strength: string | null; dimensions: string | null;
    weight: string | null; color: string | null; category: string | null;
    createdAt: string; images: ProductImage[];
};

type FormState = {
    name: string; description: string;
    price: string; stock: string; images: string[];
    brickType: string; strength: string; dimensions: string;
    weight: string; color: string; category: string;
};

const emptyForm: FormState = { 
    name: '', description: '', price: '', stock: '', images: [],
    brickType: '', strength: '', dimensions: '', weight: '', color: '', category: ''
};

const BRICK_TYPES = ['Awwal (1st Class)', 'Doam (2nd Class)', 'Som (3rd Class)', 'Khanger', 'Gutkaa', 'Tile', 'Special'];
const CATEGORIES  = ['Standard', 'Premium', 'Face Brick', 'Handmade', 'Industrial'];

export default function AdminInventoryView({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts]   = useState(initialProducts);
    const [search, setSearch]       = useState('');
    const [showForm, setShowForm]   = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm]           = useState<FormState>(emptyForm);
    const [saving, setSaving]       = useState(false);
    const [uploading, setUploading] = useState(false);
    const [busy, setBusy]           = useState<string | null>(null);
    const [formError, setFormError] = useState('');
    const fileInputRef              = useRef<HTMLInputElement>(null);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brickType || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.category || '').toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => {
        setForm(emptyForm); setEditingId(null); setFormError(''); setShowForm(true);
    };

    const openEdit = (p: Product) => {
        setForm({
            name: p.name, description: p.description,
            price: p.price.toString(), stock: p.stock.toString(),
            images: p.images.map(i => i.url),
            brickType: p.brickType || '', strength: p.strength || '',
            dimensions: p.dimensions || '', weight: p.weight || '',
            color: p.color || '', category: p.category || ''
        });
        setEditingId(p.id); setFormError(''); setShowForm(true);
    };

    const handleImageUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        const uploaded: string[] = [];
        for (const file of Array.from(files)) {
            const fd = new FormData();
            fd.append('image', file);
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                const data = await res.json();
                if (data.url) uploaded.push(data.url);
                else console.error('Upload failed:', data.error);
            } catch (e) { console.error('Upload error', e); }
        }
        setForm(f => ({ ...f, images: [...f.images, ...uploaded] }));
        setUploading(false);
    };

    const removeImage = (idx: number) => setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));

    const handleSave = async () => {
        setFormError('');
        if (!form.name || !form.price || !form.stock) {
            setFormError('Name, price, and stock are required.'); return;
        }
        setSaving(true);
        try {
            const url    = editingId ? `/api/admin/inventory/${editingId}` : '/api/admin/inventory';
            const method = editingId ? 'PUT' : 'POST';
            const res    = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { 
                setFormError(data.details || data.error || 'Save failed'); 
                return; 
            }

            const saved: Product = { ...data.product, images: data.product.images || [] };
            if (editingId) {
                setProducts(ps => ps.map(p => p.id === editingId ? saved : p));
            } else {
                setProducts(ps => [saved, ...ps]);
            }
            setShowForm(false);
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Permanently delete "${name}"?`)) return;
        setBusy(id);
        const res = await fetch(`/api/admin/inventory/${id}`, { method: 'DELETE' });
        if (res.ok) setProducts(ps => ps.filter(p => p.id !== id));
        else alert('Failed to delete. Product may be linked to existing orders.');
        setBusy(null);
    };

    const th = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-[var(--border-primary)] text-[var(--text-secondary)] opacity-70';
    const td = 'px-4 py-3 text-sm border-b border-[var(--border-primary)] text-[var(--text-primary)]';
    const inputCls = 'w-full rounded-xl px-4 py-2.5 text-sm outline-none bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] shadow-sm transition';
    const labelCls = 'block text-xs font-black uppercase tracking-wide mb-1.5 text-[var(--text-secondary)]';

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Advanced Inventory</h1>
                    <p className="text-sm text-[var(--text-secondary)]">Manage brick specifications, quality grades, and stock levels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={openAdd}
                        suppressHydrationWarning
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-xl hover:-translate-y-0.5 transition-all"
                        style={{ background: 'var(--accent-primary)' }}
                    >
                        + Add New Product
                    </button>
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
                    <div
                        className="w-full max-w-2xl rounded-3xl shadow-2xl p-8 space-y-6 max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-300"
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between sticky top-0 bg-[var(--bg-primary)] pb-4 z-10">
                            <div>
                                <h2 className="text-xl font-black text-[var(--text-primary)]">
                                    {editingId ? '✏️ Edit Product Specifications' : '+ New Advanced Product'}
                                </h2>
                                <p className="text-xs text-[var(--text-secondary)]">Enter precise details for the construction marketplace.</p>
                            </div>
                            <button onClick={() => setShowForm(false)} suppressHydrationWarning className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition text-xl font-bold">✕</button>
                        </div>

                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl animate-bounce">⚠️ {formError}</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4 md:col-span-2">
                                <div>
                                    <label className={labelCls}>Product Name *</label>
                                    <input className={inputCls} suppressHydrationWarning value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Premium Awwal Red Bricks" />
                                </div>
                                <div>
                                    <label className={labelCls}>Detailed Description</label>
                                    <textarea className={inputCls + ' resize-none'} suppressHydrationWarning rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe quality, finish, and usage... (e.g. Best for high-strength load-bearing walls)" />
                                </div>
                            </div>

                            {/* Advanced Specs */}
                            <div>
                                <label className={labelCls}>Brick Type / Grade</label>
                                <select className={inputCls} suppressHydrationWarning value={form.brickType} onChange={e => setForm(f => ({ ...f, brickType: e.target.value }))}>
                                    <option value="">Select Type</option>
                                    {BRICK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Product Category</label>
                                <select className={inputCls} suppressHydrationWarning value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    <option value="">Select Category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={labelCls}>Strength (e.g. 2500 PSI)</label>
                                <input className={inputCls} suppressHydrationWarning value={form.strength} onChange={e => setForm(f => ({ ...f, strength: e.target.value }))} placeholder="PSI or Grade" />
                            </div>
                            <div>
                                <label className={labelCls}>Dimensions (L x W x H)</label>
                                <input className={inputCls} suppressHydrationWarning value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} placeholder="9 x 4.5 x 3 inches" />
                            </div>

                            <div>
                                <label className={labelCls}>Approx. Weight</label>
                                <input className={inputCls} suppressHydrationWarning value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="e.g. 3.2 kg" />
                            </div>
                            <div>
                                <label className={labelCls}>Natural Color</label>
                                <input className={inputCls} suppressHydrationWarning value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="e.g. Deep Red, Orange" />
                            </div>

                            {/* Pricing & Stock */}
                            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 md:col-span-2 grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls + ' text-amber-900'}>Price (PKR / 1000)</label>
                                    <input className={inputCls + ' border-amber-200'} suppressHydrationWarning type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="14000" />
                                </div>
                                <div>
                                    <label className={labelCls + ' text-amber-900'}>Stock (Total Bricks)</label>
                                    <input className={inputCls + ' border-amber-200'} suppressHydrationWarning type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="100000" />
                                </div>
                            </div>

                            {/* Images */}
                            <div className="md:col-span-2">
                                <label className={labelCls}>Product Media Gallery</label>
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    suppressHydrationWarning
                                    className="w-full border-2 border-dashed rounded-2xl py-8 flex flex-col items-center gap-2 transition hover:border-[var(--accent-primary)] hover:bg-orange-50 disabled:opacity-50"
                                    style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-secondary)' }}
                                >
                                    <span className="text-4xl">{uploading ? '⏳' : '📸'}</span>
                                    <span className="text-sm font-bold text-[var(--text-secondary)]">
                                        {uploading ? 'Processing Files...' : 'Drag or click to upload high-res photos'}
                                    </span>
                                </button>
                                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" suppressHydrationWarning onChange={e => handleImageUpload(e.target.files)} />

                                {form.images.length > 0 && (
                                    <div className="flex gap-3 flex-wrap mt-4">
                                        {form.images.map((url, i) => (
                                            <div key={i} className="relative group w-24 h-24 rounded-2xl overflow-hidden border border-[var(--border-primary)] shadow-sm hover:shadow-md transition">
                                                <img src={url} alt="" className="w-full h-full object-cover transition group-hover:scale-110" />
                                                <button onClick={() => removeImage(i)} suppressHydrationWarning className="absolute inset-0 bg-red-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xl font-bold transition">✕</button>
                                                {i === 0 && <div className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow">MAIN</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 sticky bottom-0 bg-[var(--bg-primary)]">
                            <button onClick={() => setShowForm(false)} suppressHydrationWarning className="flex-1 py-3.5 rounded-2xl text-sm font-bold border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={saving || uploading}
                                suppressHydrationWarning
                                className="flex-2 py-3.5 rounded-2xl text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-50 shadow-xl"
                                style={{ background: 'var(--accent-primary)', flex: 2 }}
                            >
                                {saving ? '⏳ Submitting...' : editingId ? '💾 Save Changes' : '📦 Publish Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product List UI */}
            <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-[var(--border-primary)] shadow-sm">
                    <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            suppressHydrationWarning
                            placeholder="Search by name, type, or category..."
                            className="w-full pl-10 pr-4 py-2 text-sm outline-none bg-gray-50 rounded-xl border border-transparent focus:border-amber-300 transition"
                        />
                    </div>
                </div>

                <div className="rounded-3xl overflow-hidden border border-[var(--border-primary)] bg-white shadow-sm overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className={th}>Identity</th>
                                <th className={th}>Specs</th>
                                <th className={th}>Stock & Price</th>
                                <th className={th}>Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-20 text-center opacity-40">
                                        <p className="text-5xl mb-4">🏠</p>
                                        <p className="font-bold">No matching products found.</p>
                                    </td>
                                </tr>
                            ) : filtered.map(p => (
                                <tr key={p.id} className="hover:bg-amber-50/10 transition-colors">
                                    <td className={td}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative shadow-inner">
                                                {p.images && p.images[0] ? (
                                                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover" sizes="64px" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl">🧱</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 leading-tight">{p.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-gray-900 text-white">{p.category || 'Standard'}</span>
                                                    <span className="text-[10px] font-bold text-amber-700">{p.brickType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                                            <p><span className="opacity-50">📏</span> {p.dimensions || '—'}</p>
                                            <p><span className="opacity-50">🏋️</span> {p.weight || '—'}</p>
                                            <p><span className="opacity-50">💪</span> {p.strength || '—'}</p>
                                            <p><span className="opacity-50">🎨</span> {p.color || '—'}</p>
                                        </div>
                                    </td>
                                    <td className={td}>
                                        <p className="font-black text-lg text-green-700 leading-none">PKR {p.price.toLocaleString()}</p>
                                        <p className={`text-[10px] font-bold mt-1.5 ${p.stock < 1000 ? 'text-red-500' : 'text-gray-400'}`}>
                                            {p.stock.toLocaleString()} units available
                                        </p>
                                    </td>
                                    <td className={td}>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(p)} suppressHydrationWarning className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-amber-700 hover:bg-amber-100 transition shadow-sm">✏️</button>
                                            <button onClick={() => handleDelete(p.id, p.name)} suppressHydrationWarning className="p-2 rounded-lg bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition shadow-sm">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
