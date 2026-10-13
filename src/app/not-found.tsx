import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6"
            style={{ background: 'linear-gradient(135deg, #1a0c05 0%, #2e1508 50%, #1a0c05 100%)' }}>
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none opacity-15"
                style={{ background: 'radial-gradient(circle,#b06040,transparent)', transform: 'translate(-40%,-40%)' }} />

            <div className="relative text-center max-w-md">
                <div className="text-8xl font-black mb-4" style={{ color: '#b06040' }}>404</div>
                <div className="text-5xl mb-6">🧱</div>
                <h1 className="text-2xl font-extrabold text-white mb-3">Page Not Found</h1>
                <p className="text-sm mb-8" style={{ color: '#c8a88a' }}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                    <Link href="/"
                        className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transition hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #b06040, #d07050)' }}>
                        ← Back to Home
                    </Link>
                    <Link href="/products"
                        className="px-6 py-3 rounded-xl font-bold transition"
                        style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#c8a88a' }}>
                        Browse Bricks
                    </Link>
                </div>
            </div>
        </div>
    );
}
