'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverActionButtons({
    deliveryId,
    currentStatus,
    customerAddress,
    customerLat,
    customerLng
}: {
    deliveryId: string,
    currentStatus: string,
    customerAddress: string,
    customerLat?: number | null,
    customerLng?: number | null
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const updateStatus = async (status: string, withLocation: boolean = false) => {
        setLoading(true);
        let payload: any = { deliveryId, status };

        if (withLocation && navigator.geolocation) {
            try {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });
                payload.latitude = position.coords.latitude;
                payload.longitude = position.coords.longitude;
            } catch (err) {
                console.warn("Could not get location:", err);
            }
        }

        const res = await fetch('/api/driver/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            router.refresh();
        } else {
            alert('Failed to update status');
        }
        setLoading(false);
    };

    useEffect(() => {
        // If the delivery is currently active, always simulate real-time GPS updates every 30 seconds
        let interval: NodeJS.Timeout;
        if (currentStatus === 'DISPATCHED' && navigator.geolocation) {
            // Push initially
            navigator.geolocation.getCurrentPosition((position) => {
                fetch('/api/driver/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        deliveryId,
                        status: currentStatus,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }),
                }).catch(console.error);
            });

            // Then interval
            interval = setInterval(() => {
                navigator.geolocation.getCurrentPosition((position) => {
                    fetch('/api/driver/update', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            deliveryId,
                            status: currentStatus,
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        }),
                    }).catch(console.error);
                });
            }, 30000); // 30 seconds
        }
        return () => clearInterval(interval);
    }, [currentStatus, deliveryId]);

    if (currentStatus === 'DELIVERED') {
        return (
            <button disabled className="w-full bg-green-100 text-green-800 font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                Order Completed
            </button>
        );
    }

    return (
        <div className="space-y-3">
            {currentStatus === 'PENDING' && (
                <button
                    onClick={() => updateStatus('DISPATCHED', true)}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading ? 'Processing...' : 'Start Delivery'}
                </button>
            )}

            {currentStatus === 'DISPATCHED' && (
                <div className="space-y-3 border-t border-gray-100 pt-3">
                    <button
                        onClick={() => updateStatus('DELIVERED', true)}
                        disabled={loading}
                        className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition"
                    >
                        {loading ? 'Processing...' : 'Mark as Delivered'}
                    </button>

                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(customerAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-orange-100 text-orange-900 border border-orange-200 font-bold py-3 px-4 rounded-lg flex items-center justify-center hover:bg-orange-200 transition"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Navigate to Dropoff
                    </a>

                    <div className="bg-blue-50 p-3 flex items-start rounded-lg border border-blue-100 mt-2">
                        <svg className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-xs text-blue-800 leading-tight">
                            Live tracking is active. The customer is currently viewing your location on the map.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
