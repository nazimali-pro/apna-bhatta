import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth-utils';

export async function POST(request: Request) {
    try {
        const { 
            name, email, password, role, phoneNumber, city, 
            cnic, license, licenseExpiry, 
            vehicleType, vehicleModel, registrationNo, loadCapacity,
            easypaisaNumber, cnicFrontUrl, cnicBackUrl, 
            licenseImageUrl, vehicleImageUrl, registrationBook,
            profilePhotoUrl 
        } = await request.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (role === 'CUSTOMER' && !phoneNumber) {
            return NextResponse.json({ error: 'Phone number is required for customers' }, { status: 400 });
        }

        if (role === 'DRIVER') {
            const requiredDocs = [
                cnicFrontUrl, cnicBackUrl, licenseImageUrl, 
                vehicleImageUrl, registrationBook, profilePhotoUrl
            ];
            if (requiredDocs.some(doc => !doc)) {
                return NextResponse.json({ error: 'All verification documents and profile photo are required for drivers' }, { status: 400 });
            }
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                phoneNumber: phoneNumber || null,
                city: city || null,
                image: profilePhotoUrl || null,
            },
        });

        if (role === 'DRIVER') {
            await prisma.driverDetail.create({
                data: {
                    driverId: user.id,
                    cnicNumber: cnic || null,
                    cnicFrontUrl: cnicFrontUrl || null,
                    cnicBackUrl: cnicBackUrl || null,
                    licenseNumber: license || null,
                    licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
                    licenseImageUrl: licenseImageUrl || null,
                    vehicleType: vehicleType || null,
                    vehicleModel: vehicleModel || null,
                    registrationNo: registrationNo || null,
                    registrationBook: registrationBook || null,
                    loadCapacity: loadCapacity ? parseInt(loadCapacity as string) : null,
                    vehicleImageUrl: vehicleImageUrl || null,
                    profilePhotoUrl: profilePhotoUrl || null,
                    easypaisaNumber: easypaisaNumber || null,
                    isVerified: false // Explicitly false for new drivers
                }
            });
        }

        // Set session cookie directly on the response (reliable in Next.js 15+)
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const token = await encrypt({ userId: user.id, role: user.role, image: user.image, expires });

        const response = NextResponse.json({
            user: { id: user.id, email: user.email, name: user.name, role: user.role }
        }, { status: 201 });

        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
