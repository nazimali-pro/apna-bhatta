import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSession } from '@/lib/auth-utils';

// All public pages (/, /about, /contact, /products) get Navbar + Footer
// EXCEPT for customers, who get the Portal Sidebar
export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    return (
        <>
            <Navbar initialSession={session} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
}
