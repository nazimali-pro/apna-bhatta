import { redirect, notFound } from 'next/navigation';
import { getSession } from '@/lib/auth-utils';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import CheckoutClient from '@/components/CheckoutClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Secure Checkout',
    description: 'Finalize your brick order and arrange delivery.',
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
    searchParams,
}: {
    searchParams: Promise<{ productId?: string }>;
}) {
    const session = await getSession();
    const { productId } = await searchParams;

    // Must be logged in as a customer
    if (!session || session.role !== 'CUSTOMER') {
        const redir = `/checkout${productId ? `?productId=${productId}` : ''}`;
        redirect(`/login/customer?redirect=${encodeURIComponent(redir)}`);
    }

    let directProduct = null;

    if (productId) {
        directProduct = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                admin: {
                    select: {
                        name: true,
                        bhattaDetail: { select: { bhattaName: true, address: true, phoneNumber: true } }
                    }
                }
            }
        });
        if (!directProduct) notFound();
    }

    return (
        <div className="min-h-screen pt-12 pb-24 bg-[#fffbf7]">
            <div className="max-w-4xl mx-auto px-6 lg:px-16">

                {/* Breadcrumb */}
                <div className="mb-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#92400e] opacity-60">
                    <Link href="/products" className="hover:opacity-100 transition">Products</Link>
                    <span className="opacity-30">/</span>
                    {directProduct ? (
                         <>
                            <Link href={`/products/${directProduct.id}`} className="hover:opacity-100 transition truncate max-w-[150px]">
                                {directProduct.name}
                            </Link>
                            <span className="opacity-30">/</span>
                         </>
                    ) : (
                        <>
                            <Link href="/cart" className="hover:opacity-100 transition">Cart</Link>
                            <span className="opacity-30">/</span>
                        </>
                    )}
                    <span className="text-gray-900 opacity-100">Checkout</span>
                </div>

                <CheckoutClient 
                    directProduct={directProduct} 
                    isLoggedIn={true} 
                    userId={session.userId} 
                />
            </div>
        </div>
    );
}
