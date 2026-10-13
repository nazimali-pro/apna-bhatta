import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-bricks-bhatta-2026';
const key = new TextEncoder().encode(secretKey);

const ADMIN_SECRET = new TextEncoder().encode(
    process.env.ADMIN_SECRET || 'bhatta-admin-jwt-secret-2025'
);

// --- USER AUTH ---

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch (error) {
        return null;
    }
}

// --- ADMIN AUTH ---

export async function verifyAdminToken(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        if (!token) return false;
        await jwtVerify(token, ADMIN_SECRET);
        return true;
    } catch {
        return false;
    }
}
