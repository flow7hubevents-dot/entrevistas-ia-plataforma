import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Configuración de webhook incompleta' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed.', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    const supabase = await createClient();

    // DASHBOARD DE EVENTOS
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan;

            if (userId && plan) {
                // En Supabase, actualizamos el plan en la tabla 'profiles'
                // (Asumimos que existe esta tabla y el trigger para crear perfiles)
                const { error } = await supabase
                    .from('profiles')
                    .update({ plan: plan, stripe_customer_id: session.customer as string })
                    .eq('id', userId);

                if (error) console.error('Error updating profile in Supabase:', error);
            }
            break;
        }

        case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            // Obtener el plan basado en el price ID de Stripe
            // Esto es simplificado; en realidad deberías mapear price IDs a planes
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('stripe_customer_id', customerId)
                .single();

            if (profile) {
                // Lógica para determinar el nuevo plan basado en el ID del producto/precio
                // Por ahora lo dejamos como actualización genérica
                console.log(`Suscripción actualizada para el cliente: ${customerId}`);
            }
            break;
        }

        case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            const { error } = await supabase
                .from('profiles')
                .update({ plan: 'free' })
                .eq('stripe_customer_id', customerId);

            if (error) console.error('Error canceling subscription in Supabase:', error);
            break;
        }

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
