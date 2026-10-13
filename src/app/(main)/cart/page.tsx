'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, totalAmount, itemCount } = useCart();

    const MIN_BRICKS = 1000;

    if (itemCount === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added any bricks to your order yet.</p>
                <Link href="/products" className="px-8 py-4 bg-amber-800 text-white rounded-2xl font-bold shadow-lg shadow-amber-900/10 hover:-translate-y-0.5 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fffbf7] pb-20 pt-10">
            <div className="max-w-5xl mx-auto px-6 lg:px-16">
                <h1 className="text-3xl font-black text-gray-900 mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.productId} className="bg-white rounded-3xl p-5 border border-amber-900/5 shadow-sm flex flex-col sm:flex-row gap-5">
                                {/* Product Image */}
                                <div className="relative w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                    {item.imageUrl ? (
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl">🧱</div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-extrabold text-gray-900 leading-tight">{item.name}</h3>
                                            <button 
                                                onClick={() => removeFromCart(item.productId)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <p className="text-xs font-bold text-amber-700 flex items-center gap-1 opacity-80">
                                            <span>🏠</span> {item.bhattaName}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity - 500)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm border border-gray-100 font-black hover:bg-gray-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-14 text-center font-black text-sm text-gray-900">
                                                {item.quantity.toLocaleString()}
                                            </span>
                                            <button 
                                                onClick={() => updateQuantity(item.productId, item.quantity + 500)}
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-900 shadow-sm border border-gray-100 font-black hover:bg-gray-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Subtotal</p>
                                            <p className="font-black text-amber-900 text-lg">
                                                PKR {((item.price * item.quantity) / 1000).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    {item.quantity < MIN_BRICKS && (
                                        <p className="text-[10px] text-red-500 font-bold mt-2">Minimum order is {MIN_BRICKS} bricks</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[40px] p-8 border border-amber-900/5 shadow-xl sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Items Count</span>
                                    <span className="text-gray-900 font-bold">{itemCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Platform Fee</span>
                                    <span className="text-green-600 font-bold">FREE</span>
                                </div>
                                <div className="border-t border-dashed border-gray-100 pt-4 mt-4 flex justify-between items-end">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#92400e] block mb-1">Total Amount</span>
                                        <span className="text-3xl font-black text-gray-900">PKR {totalAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <Link href="/checkout" className="block w-full py-5 bg-amber-800 text-white text-center rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-900/20 hover:-translate-y-1 transition-all active:scale-95">
                                Proceed to Checkout
                            </Link>
                            
                            <p className="mt-4 text-[10px] text-center text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                                Delivery charges will be calculated<br />at the next step based on distance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
