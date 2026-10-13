'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with webpack/Next.js
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
}

// --- MAP UPDATER HELPER ---

function MapUpdater({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
}

// --- MAP VIEWER INTERNAL ---

export function MapViewerInternal({ lat, lng, driverName, updatedAt }: { lat: number; lng: number, driverName?: string, updatedAt: Date }) {
    const position: [number, number] = [lat, lng];

    return (
        <div className="w-full h-full relative z-0" style={{ minHeight: '300px' }}>
            <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%', minHeight: '300px' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="text-sm font-medium">
                            <p className="font-bold border-b pb-1 mb-1">{driverName || 'Delivery Truck'}</p>
                            <p className="text-gray-600">Last updated: {new Date(updatedAt).toLocaleTimeString()}</p>
                        </div>
                    </Popup>
                </Marker>
                <MapUpdater lat={lat} lng={lng} />
            </MapContainer>
        </div>
    );
}

// --- LOCATION PICKER MAP INTERNAL ---

function LocationMarker({ position, setPosition, onLocationSelect }: any) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

export function LocationPickerMapInternal({ onLocationSelect, initialLat, initialLng }: any) {
    const [position, setPosition] = useState<L.LatLng | null>(
        initialLat && initialLng ? new L.LatLng(initialLat, initialLng) : null
    );

    // Default to Lahore default
    const [mapCenter, setMapCenter] = useState<[number, number]>(
        initialLat && initialLng ? [initialLat, initialLng] : [31.5204, 74.3587]
    );

    useEffect(() => {
        if (!initialLat && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                },
                () => {
                    // Ignore errors, use default
                },
                { timeout: 5000 }
            );
        }
    }, [initialLat]);

    return (
        <MapContainer
            center={mapCenter}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: '300px', width: '100%', zIndex: 10 }}
            className="rounded-lg border border-gray-300 shadow-sm"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} />
        </MapContainer>
    );
}
// --- DRIVER NAVIGATION MAP INTERNAL ---

export function NavigationMapInternal({ driverLat, driverLng, destLat, destLng, bhattaName, customerName }: {
    driverLat: number;
    driverLng: number;
    destLat: number;
    destLng: number;
    bhattaName: string;
    customerName: string;
}) {
    const [route, setRoute] = useState<[number, number][]>([]);
    const [stats, setStats] = useState<{distance: string, time: string} | null>(null);

    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${driverLng},${driverLat};${destLng},${destLat}?overview=full&geometries=geojson`);
                const data = await res.json();
                if (data.routes && data.routes[0]) {
                    const r = data.routes[0];
                    setRoute(r.geometry.coordinates.map((c: any) => [c[1], c[0]]));
                    
                    const distKm = (r.distance / 1000).toFixed(1);
                    const timeMins = Math.ceil(r.duration / 60);
                    setStats({ distance: `${distKm} km`, time: `${timeMins} mins` });
                }
            } catch (e) {
                console.error('Failed to fetch route', e);
            }
        };
        fetchRoute();
    }, [driverLat, driverLng, destLat, destLng]);

    const bounds = L.latLngBounds([[driverLat, driverLng], [destLat, destLng]]);

    const truckIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">🚚</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    const houseIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="font-size: 24px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">📍</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24]
    });

    return (
        <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
            <MapContainer
                bounds={bounds}
                zoom={13}
                style={{ height: '100%', width: '100%', minHeight: '400px' }}
                className="rounded-2xl"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Driver Marker */}
                <Marker position={[driverLat, driverLng]} icon={truckIcon}>
                    <Popup>
                        <div className="text-xs font-bold uppercase tracking-widest text-blue-600">Your Current Position</div>
                    </Popup>
                </Marker>

                {/* Destination Marker */}
                <Marker position={[destLat, destLng]} icon={houseIcon}>
                    <Popup>
                        <div className="text-xs font-bold uppercase tracking-widest text-[#b06040]">Destination: {customerName}</div>
                    </Popup>
                </Marker>

                {/* Route Line */}
                {route.length > 0 && (
                    <Polyline
                        positions={route}
                        pathOptions={{
                            color: '#2563eb',
                            weight: 5,
                            opacity: 0.6,
                        }}
                    />
                )}
                
                <MapUpdater lat={driverLat} lng={driverLng} />
            </MapContainer>

            {/* Navigation Stats Overlay */}
            {stats && (
                <div className="absolute bottom-6 left-6 right-6 z-[1000] flex gap-3 pointer-events-none">
                    <div className="flex-1 bg-white/95 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Estimated Time</span>
                        <span className="text-2xl font-black text-gray-900">{stats.time}</span>
                    </div>
                    <div className="flex-1 bg-white/95 backdrop-blur-sm p-4 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#b06040] mb-1">Distance Left</span>
                        <span className="text-2xl font-black text-[#b06040]">{stats.distance}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Map updater that doesn't force re-centering if user is interacting, but this is simple version.
function DirectionsMapUpdater({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        // Only update if we are far away? No, for nav we usually want to follow.
        // map.panTo([lat, lng]);
    }, [lat, lng, map]);
    return null;
}
