import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
console.log('Clé Stripe utilisée (masquée):', stripeKey ? `${stripeKey.substring(0, 5)}...` : 'NON DÉFINIE');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16', // Version correcte de l'API Stripe
});

export async function POST(req: Request) {
  try {
    console.log('API Stripe appelée');
    const data = await req.json();
    const { email } = data;
    
    console.log('Email reçu:', email || 'Non fourni');
    
    // Récupérer dynamiquement l'URL de base
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    console.log('URL de base utilisée:', baseUrl);
    
    // Créer une session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Pack Premium - 3 jetons',
              description: 'Débloquez 3 jetons pour des analyses détaillées de vos flatulences'
            },
            unit_amount: 100, // 1€ (en centimes)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/premium-cancel`,
      customer_email: email || undefined,
      metadata: {
        // Métadonnées pour le webhook
        premium: 'true',
        tokens: '3',
        duration: '24h'
      },
    });

    console.log('Session créée avec succès, ID:', session.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erreur Stripe détaillée:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la création de la session de paiement',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 