'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const BRICK_TYPES = ['Awwal Bricks', 'Doam Bricks', 'Som Bricks', 'Khangar Bricks', 'Tiles'];

function FormInput({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: '#6e6055' }}>{label}</label>
            {children}
        </div>
    );
}

const inputStyle = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-orange-400" as const;
const inputProps = { style: { border: '1.5px solid #e8ddd4', backgroundColor: '#fdf8f5', color: '#2a1409' } };

export default function EditProductForm({ product }: {
    product: { 
        id: string; 
        name: string; 
        description: string; 
        price: number; 
        stock: number; 
        imageUrl: string | null;
        // @ts-ignore
        images: { url: string }[] 
    }
}) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock));
    
    // Combined list of images (existing URLs + new Files with previews)
    const [images, setImages] = useState<{ url: string; file?: File }[]>(
        product.images?.map(img => ({ url: img.url })) || []
    );
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newEntries = files.map(file => ({
                url: URL.createObjectURL(file),
                file
            }));
            setImages(prev => [...prev, ...newEntries]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const finalImageUrls: string[] = [];

        try {
            // Process images: keep existing URLs, upload new Files
            for (const img of images) {
                if (img.file) {
                    const formData = new FormData();
                    formData.append('image', img.file);
                    const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
                    if (uploadRes.ok) {
                        const data = await uploadRes.json();
                        finalImageUrls.push(data.url);
                    }
                } else {
                    finalImageUrls.push(img.url);
                }
            }

            const res = await fetch(`/api/admin/inventory/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    description, 
                    price, 
                    stock, 
                    images: finalImageUrls 
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => { router.push('/admin/inventory'); router.refresh(); }, 1000);
            } else { 
                alert('Failed to update product'); 
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred while saving');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl rounded-2xl p-8" style={{ backgroundColor: '#fff', border: '1px solid #e8ddd4', boxShadow: '0 8px 40px rgba(42,20,9,0.08)' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Images management */}
                <FormInput label="Product Images">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[#e8ddd4] group">
                                <Image src={img.url} alt="Product image" fill className="object-cover" />
                                <button 
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
                                >
                                    ✕
                                </button>
                                {img.file && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-orange-600 text-white text-[8px] font-bold text-center py-0.5">
                                        NEW
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Add Button */}
                        <button 
                            type="button"
                            onClick={() => document.getElementById('edit-image')?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-[#e8ddd4] bg-[#fdf8f5] flex flex-col items-center justify-center gap-2 text-[#8a7a6c] hover:border-orange-400 hover:text-orange-500 transition"
                        >
                            <span className="text-2xl">➕</span>
                            <span className="text-[10px] font-bold">Add Image</span>
                        </button>
                    </div>
                    <input id="edit-image" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
                    <p className="text-[10px] text-[#8a7a6c] font-medium">Manage product gallery. The first image will be the main thumbnail.</p>
                </FormInput>

                <FormInput label="Product Type">
                    <select required value={name} onChange={e => setName(e.target.value)} className={inputStyle} {...inputProps}>
                        <option value="" disabled>Select Brick Type</option>
                        {BRICK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </FormInput>

                <FormInput label="Description">
                    <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)}
                        className={inputStyle} {...inputProps} placeholder="Quality, dimensions, usage..." />
                </FormInput>

                <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Price / 1000 Bricks (PKR)">
                        <input type="number" required min="0" value={price} onChange={e => setPrice(e.target.value)}
                            className={inputStyle} {...inputProps} placeholder="e.g. 14000" />
                    </FormInput>
                    <FormInput label="Stock (Units)">
                        <input type="number" required min="0" value={stock} onChange={e => setStock(e.target.value)}
                            className={inputStyle} {...inputProps} placeholder="e.g. 50000" />
                    </FormInput>
                </div>

                <div className="pt-2 flex gap-3">
                    <button type="submit" disabled={loading || success}
                        className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg,#b06040,#7a3820)', boxShadow: '0 4px 16px rgba(176,96,64,0.3)' }}>
                        {success ? '✅ Saved!' : loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => router.back()}
                        className="px-5 py-3 rounded-xl text-sm font-bold transition hover:opacity-80"
                        style={{ backgroundColor: '#f0e8e0', color: '#6e6055' }}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
