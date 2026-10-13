import { getSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (session) {
        redirect(`/${session.role.toLowerCase()}`);
    }
    return <>{children}</>;
}
