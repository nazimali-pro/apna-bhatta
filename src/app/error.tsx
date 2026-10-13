'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Handled Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fffbf7]">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Something went wrong</h1>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
                We encountered an unexpected error while loading this page. Our team has been notified.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <button 
                    onClick={() => reset()}
                    className="px-8 py-4 bg-amber-800 text-white rounded-2xl font-bold shadow-xl shadow-amber-900/20 hover:-translate-y-1 transition-all active:scale-95"
                >
                    Try Again
                </button>
                <Link href="/" className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                    Return Home
                </Link>
            </div>
            
            <p className="mt-12 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                Error ID: {error.digest || 'UNKNOWN'}
            </p>
        </div>
    );
}
