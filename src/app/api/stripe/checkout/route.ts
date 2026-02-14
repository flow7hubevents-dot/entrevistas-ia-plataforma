import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';

export async function POST(req: Request) {
    try {
        const { userId, planId, userEmail } = await req.json();

        if (!userId || !planId) {
            return NextResponse.json({ error: 'Faltan datos requeridos (userId, planId)' }, { status: 400 });
        }

        // Definir precios por plan (esto debería estar en variables de entorno en producción)
        const plans: Record<string, string> = {
            'pro': process.env.STRIPE_PRO_PRICE_ID || 'price_pro_example',
            'premium': process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium_example',
        };

        const priceId = plans[planId];
        if (!priceId) {
            return NextResponse.json({ error: 'Plan no válido' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cuenta/suscripcion?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade?canceled=true`,
            customer_email: userEmail,
            metadata: {
                userId: userId,
                plan: planId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Error in Stripe Checkout:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
