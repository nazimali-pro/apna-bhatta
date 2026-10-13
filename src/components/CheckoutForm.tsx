import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClientLocationPicker } from '@/components/map-components';
import { useCart } from '@/context/CartContext';

export default function CheckoutForm({
    productId,
    pricePer1000,
    maxStock,
    isLoggedIn,
    userId,
    items: initialItems
}: {
    productId?: string,
    pricePer1000?: number,
    maxStock?: number,
    isLoggedIn: boolean,
    userId?: string,
    items?: { productId: string, quantity: number, name: string, price: number }[]
}) {
    const { clearCart } = useCart();
    const [quantity, setQuantity] = useState<number>(1000); // For single buy
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const isCartCheckout = !!initialItems && initialItems.length > 0;

    // Calculate total price
    let totalPrice = 0;
    if (isCartCheckout) {
        totalPrice = initialItems.reduce((sum, item) => sum + (item.price * item.quantity / 1000), 0);
    } else {
        const currentQuantity = isNaN(quantity) ? 0 : quantity;
        totalPrice = (currentQuantity / 1000) * (pricePer1000 || 0);
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoggedIn) {
            router.push(`/login/customer?redirect=/checkout${productId ? `?productId=${productId}` : ''}`);
            return;
        }

        const checkoutItems = isCartCheckout 
            ? initialItems.map(i => ({ productId: i.productId, quantity: i.quantity }))
            : [{ productId: productId!, quantity }];

        if (!isCartCheckout) {
            if (quantity < 1000) {
                alert('Minimum order is 1000 bricks');
                return;
            }
            if (quantity > (maxStock || 0)) {
                alert(`Cannot order more than available stock (${maxStock})`);
                return;
            }
        }

        if (!latitude || !longitude) {
            alert('Please drop a pin on the map to provide your exact delivery location.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: checkoutItems,
                    address,
                    latitude,
                    longitude,
                    paymentMethod,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Checkout failed');
            }

            // Success! Clear cart if it was a cart checkout
            if (isCartCheckout) clearCart();

            // If online payment, redirect to Stripe session (Stripe logic updated to handle first order for now)
            if (paymentMethod === 'ONLINE') {
                const firstOrder = data.orders[0];
                const stripeRes = await fetch('/api/checkout/stripe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: firstOrder.id,
                        totalPrice,
                        productName: isCartCheckout ? 'Multiple Products order' : 'Bricks Delivery',
                    }),
                });

                const stripeData = await stripeRes.json();
                if (stripeData.url) {
                    window.location.href = stripeData.url;
                    return;
                } else {
                    throw new Error('Could not initialize payment gateway.');
                }
            }

            router.push('/customer?success=1');
            router.refresh();

        } catch (err: any) {
            alert(err.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleCheckout} className="space-y-6">
            {!isCartCheckout ? (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Number of Bricks)</label>
                    <input
                        type="number"
                        required
                        min="1000"
                        step="500"
                        max={maxStock}
                        value={isNaN(quantity) ? '' : quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Min: 1000.  Max: {maxStock}</p>
                </div>
            ) : (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Order Items</p>
                    <div className="space-y-2">
                        {initialItems.map(item => (
                            <div key={item.productId} className="flex justify-between text-sm">
                                <span className="text-gray-900 font-bold">{item.name}</span>
                                <span className="text-gray-500">{item.quantity.toLocaleString()} bricks</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--accent-primary)] focus:outline-none mb-4 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                    placeholder="Where should we deliver the bricks? (Building number, street, city)"
                ></textarea>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exact Map Location
                    <span className="text-xs text-gray-500 font-normal ml-2">(Required for driver navigation)</span>
                </label>
                <ClientLocationPicker
                    onLocationSelect={(lat: number, lng: number) => {
                        setLatitude(lat);
                        setLongitude(lng);
                    }}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                    <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center transition ${paymentMethod === 'COD' ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] ring-2 ring-[var(--accent-primary)]' : 'border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]'}`}>
                        <input type="radio" className="hidden" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                        <span className="font-semibold text-[var(--text-primary)]">Cash on Delivery</span>
                        <span className="text-xs text-[var(--text-secondary)] mt-1 opacity-70">Pay when truck arrives</span>
                    </label>
                    <label className={`border rounded-lg p-4 cursor-pointer flex flex-col items-center justify-center transition ${paymentMethod === 'ONLINE' ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)] ring-2 ring-[var(--accent-primary)]' : 'border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]'}`}>
                        <input type="radio" className="hidden" name="payment" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} />
                        <span className="font-semibold text-[var(--text-primary)]">Online Payment</span>
                        <span className="text-xs text-[var(--text-secondary)] mt-1 opacity-70">Pay via Credit Card</span>
                    </label>
                </div>
            </div>

            <div className="border-t border-[var(--border-primary)] pt-6">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-lg text-[var(--text-secondary)]">Total Amount:</span>
                    <span className="text-2xl font-extrabold text-[var(--text-primary)]">PKR {totalPrice.toLocaleString()}</span>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--accent-primary)] text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition shadow-lg shadow-[rgba(176,96,64,0.2)] disabled:opacity-50"
                >
                    {loading ? 'Processing Order...' : paymentMethod === 'ONLINE' ? 'Confirm & Process Payment' : 'Confirm Order'}
                </button>
            </div>
        </form>
    );
}
