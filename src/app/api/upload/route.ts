import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('image') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate File Size (5MB limit)
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'File too large. Max 5MB allowed.' }, { status: 400 });
        }

        // Validate File Type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Unsupported file type. Use JPG, PNG, or WEBP.' },
                { status: 400 }
            );
        }

        // Convert file to buffer, then base64 for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            folder: 'apna-bhatta/products',   // organized folder in Cloudinary
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' }, // max size cap
                { quality: 'auto:good' },                      // auto compress
                { fetch_format: 'auto' },                      // auto WebP/AVIF
            ],
        });

        console.log(`[CLOUDINARY_UPLOAD] Uploaded: ${result.secure_url}`);

        return NextResponse.json({
            success: true,
            url: result.secure_url,    // e.g. https://res.cloudinary.com/dzrykdm2u/image/upload/...
            public_id: result.public_id,
        });

    } catch (error: any) {
        console.error('[UPLOAD_ERROR]', error);
        return NextResponse.json({
            error: 'Upload Failed. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        }, { status: 500 });
    }
}
