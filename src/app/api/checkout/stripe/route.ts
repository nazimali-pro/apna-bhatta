import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth-utils';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2023-10-16' as any,
});

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== 'CUSTOMER') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, totalPrice, productName } = await request.json();

        if (!orderId || !totalPrice) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // Fallback: If Stripe credentials are not configured in the environment,
        // we provide a simulated success path to allow for platform demonstration.
        if (!process.env.STRIPE_SECRET_KEY) {
            console.info("Info: STRIPE_SECRET_KEY not found. Proceeding with simulated checkout.");
            return NextResponse.json({ url: `/customer?success=simulated_${orderId}` });
        }

        // If Stripe keys ARE provided, create an actual secure Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'pkr',
                        product_data: {
                            name: productName,
                            description: `Order ID: ${orderId}`,
                        },
                        unit_amount: Math.round(totalPrice * 100), // Stripe expects amounts in cents/paisa
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/customer?success=stripe_${orderId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/customer?cancel=1`,
            client_reference_id: orderId,
        });

        return NextResponse.json({ url: checkoutSession.url });

    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
    }
}
