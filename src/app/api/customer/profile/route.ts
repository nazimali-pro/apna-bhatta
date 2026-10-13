import { NextResponse } from 'next/server';
import { getSession, encrypt } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'CUSTOMER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, phoneNumber, city, image } = await request.json();
        
        if (!name || !phoneNumber || !city) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: { name, phoneNumber, city, image: image || undefined } as any
        });

        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        const token = await encrypt({ userId: updatedUser.id, role: updatedUser.role, image: (updatedUser as any).image, expires });

        const response = NextResponse.json({ success: true, user: updatedUser });
        response.cookies.set('session', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires,
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'CUSTOMER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Delete user and cascade to orders/orderItems (handled at DB level with onDelete: Cascade)
        await prisma.user.delete({
            where: { id: session.userId }
        });

        const response = NextResponse.json({ success: true, message: 'Account deleted' });
        
        // Clear session cookie
        response.cookies.set('session', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(0),
            path: '/',
        });

        return response;
    } catch (error) {
        console.error('Delete account error:', error);
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }
}

