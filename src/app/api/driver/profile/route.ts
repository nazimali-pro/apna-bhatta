import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';

export async function PATCH(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'DRIVER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { name, phoneNumber } = await request.json();

        if (!name || !phoneNumber) {
            return NextResponse.json({ error: 'Name and phone number are required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: {
                name,
                phoneNumber
            }
        });

        return NextResponse.json({ 
            success: true, 
            user: { name: updatedUser.name, phoneNumber: updatedUser.phoneNumber } 
        });

    } catch (error: any) {
        console.error('Error updating driver profile:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
