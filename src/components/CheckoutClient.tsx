'use client';

import React from 'react';
import Link from 'next/link';
import CheckoutForm from './CheckoutForm';
import { useCart } from '@/context/CartContext';

export default function CheckoutClient({ 
    directProduct,
    isLoggedIn,
    userId
}: { 
    directProduct?: any,
    isLoggedIn: boolean,
    userId?: string
}) {
    const { cart } = useCart();
    
    // Determine context
    const isDirectBuy = !!directProduct;
    const checkoutItems = isDirectBuy ? [] : cart;

    if (!isDirectBuy && checkoutItems.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="text-5xl mb-4">🛒</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">You have nothing to checkout.</p>
                <Link href="/products" className="px-6 py-3 bg-amber-800 text-white rounded-xl font-bold transition">
                    Go to Products
                </Link>
            </div>
        );
    }

    const bhattaName = directProduct?.admin?.bhattaDetail?.bhattaName || 'Apna Bhatta Official';

    return (
        <div className="bg-[var(--bg-primary)] rounded-3xl shadow-xl border border-[var(--border-primary)] overflow-hidden">
            {/* Order Summary Header */}
            <div className="p-8 border-b border-[var(--border-primary)] bg-gradient-to-br from-[#fffbf7] to-white">
                <h1 className="text-2xl font-black text-gray-900 mb-6">Finalize Your Order</h1>
                
                {isDirectBuy ? (
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                        <div>
                            <p className="font-black text-gray-900 text-xl mb-1">{directProduct.name}</p>
                            <p className="text-sm text-amber-700 font-bold flex items-center gap-1.5">
                                <span>🏭</span> {bhattaName}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Price per 1,000</p>
                            <p className="text-3xl font-black text-gray-900">PKR {directProduct.price.toLocaleString()}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Cart Summary ({checkoutItems.length} Products)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {checkoutItems.map(item => (
                                <div key={item.productId} className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0 relative">
                                        {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">{item.quantity.toLocaleString()} bricks</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Form */}
            <div className="p-8 lg:p-10">
                {isDirectBuy && directProduct.stock <= 0 ? (
                    <div className="text-center py-8">
                        <h2 className="text-xl font-bold text-red-500 mb-2">Out of Stock</h2>
                        <Link href="/products" className="text-amber-800 font-bold underline">Choose another product</Link>
                    </div>
                ) : (
                    <CheckoutForm
                        productId={directProduct?.id}
                        pricePer1000={directProduct?.price}
                        maxStock={directProduct?.stock}
                        isLoggedIn={isLoggedIn}
                        userId={userId}
                        items={isDirectBuy ? undefined : checkoutItems}
                    />
                )}
            </div>
        </div>
    );
}
