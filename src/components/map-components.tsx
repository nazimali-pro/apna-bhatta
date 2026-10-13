'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ReactNode } from 'react';

// --- LOADING COMPONENT ---

const MapLoading = () => (
    <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
        <div className="flex flex-col items-center text-gray-400">
            <svg className="w-8 h-8 mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">Loading Interactive Map...</span>
        </div>
    </div>
);

import type { MapViewerInternal, LocationPickerMapInternal, NavigationMapInternal } from '@/components/map-components-internal';

// --- DYNAMIC COMPONENTS (SSR Disabled) ---

export const MapViewer = dynamic<React.ComponentProps<typeof MapViewerInternal>>(
    () => import('@/components/map-components-internal').then(mod => mod.MapViewerInternal),
    { ssr: false, loading: MapLoading }
);

export const ClientLocationPicker = dynamic<React.ComponentProps<typeof LocationPickerMapInternal>>(
    () => import('@/components/map-components-internal').then(mod => mod.LocationPickerMapInternal),
    { ssr: false, loading: MapLoading }
);

export const NavigationMap = dynamic<React.ComponentProps<typeof NavigationMapInternal>>(
    () => import('@/components/map-components-internal').then(mod => mod.NavigationMapInternal),
    { ssr: false, loading: MapLoading }
);
