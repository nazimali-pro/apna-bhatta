'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const PLACEHOLDER = '/placeholder-brick.svg';

// --- PRODUCT GALLERY (from ProductGallery.tsx) ---

interface ProductGalleryProps {
    mainImage: string | null;
    sideImages: string[];
}

export function ProductGallery({ mainImage, sideImages }: ProductGalleryProps) {
    const allImages = [
        ...(mainImage ? [mainImage] : []),
        ...sideImages.filter(img => img !== mainImage)
    ];

    const [activeImage, setActiveImage] = useState(allImages[0] || null);
    const [imgError, setImgError] = useState(false);

    if (!activeImage) {
        return (
            <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-amber-50 rounded-2xl">
                <img src={PLACEHOLDER} alt="No image" className="w-48 h-48 opacity-60" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Main Image Display */}
            <div className="relative flex-1 min-h-[350px] rounded-2xl overflow-hidden shadow-inner bg-white border border-gray-100 flex items-center justify-center">
                <img 
                    src={imgError ? PLACEHOLDER : activeImage} 
                    alt="Product" 
                    onError={() => setImgError(true)}
                    className="w-full h-full object-contain p-4"
                />
            </div>

            {/* Thumbnails Row */}
            {allImages.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setActiveImage(img); setImgError(false); }}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                                activeImage === img 
                                ? 'border-orange-600 ring-2 ring-orange-100 scale-95' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                        >
                            <img 
                                src={img} 
                                alt={`Thumbnail ${idx + 1}`} 
                                onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                                className="w-full h-full object-cover" 
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- PRODUCT HOVER GALLERY (from ProductHoverGallery.tsx) ---

export function ProductHoverGallery({ mainImage, sideImages }: ProductGalleryProps) {
    const allImages = [
        ...(mainImage ? [mainImage] : []),
        ...sideImages.filter(img => img !== mainImage)
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovering && allImages.length > 1) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % allImages.length);
                setImgError(false);
            }, 1000);
        } else {
            setCurrentIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovering, allImages.length]);

    if (allImages.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-amber-50">
                <img src={PLACEHOLDER} alt="No image" className="w-24 h-24 opacity-50" />
            </div>
        );
    }

    const displaySrc = imgError ? PLACEHOLDER : allImages[currentIndex];

    return (
        <div 
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <img 
                src={displaySrc} 
                alt="Product Preview" 
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Progress indicators on hover */}
            {isHovering && allImages.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1 px-4">
                    {allImages.map((_, i) => (
                        <div 
                            key={i} 
                            className={`h-1 flex-1 rounded-full transition-all ${
                                i === currentIndex ? 'bg-orange-600' : 'bg-white/40'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// InventoryActions component removed as it is superseded by AdminInventoryView internal logic.

export function AddToCartButton({ 
    product, 
    bhattaName,
    variant = 'listing'
}: { 
    product: any, 
    bhattaName: string,
    variant?: 'listing' | 'detail'
}) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1000, // Default to 1000 bricks
            sellerId: product.sellerId,
            bhattaName: bhattaName,
            imageUrl: product.imageUrl
        });

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (variant === 'detail') {
        return (
            <button 
                onClick={handleAdd}
                className="flex-1 py-4 rounded-xl text-center font-bold tracking-wide transition shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
                style={{ backgroundColor: isAdded ? '#10b981' : '#f3f4f6', color: isAdded ? 'white' : '#111827' }}
            >
                {isAdded ? (
                    <>✓ Added to Cart</>
                ) : (
                    <>🛒 Add to Cart</>
                )}
            </button>
        );
    }

    return (
        <button 
            onClick={handleAdd}
            className="p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm border"
            style={{ 
                background: isAdded ? '#10b981' : 'white', 
                color: isAdded ? 'white' : '#92400e',
                borderColor: isAdded ? '#10b981' : 'rgba(146,64,14,0.1)'
            }}
            title="Add to cart"
        >
            {isAdded ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            )}
        </button>
    );
}
