import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Initialiser le client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur de signature Stripe';
    console.error(`Erreur webhook: ${errorMessage}`);
    return NextResponse.json(
      { error: `Erreur webhook: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Traiter l'événement
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Vérifier que le paiement a bien été effectué
    if (session.payment_status === 'paid') {
      console.log('Paiement réussi pour la session:', session.id);
      
      // Récupérer l'email client depuis la session
      const customerEmail = session.customer_details?.email;
      
      // Tenter de trouver l'utilisateur par email
      if (customerEmail) {
        const { data: users } = await supabase
          .from('users')
          .select('*')
          .eq('email', customerEmail);
        
        if (users && users.length > 0) {
          const userId = users[0].id;
          
          // Mettre à jour le statut premium de l'utilisateur
          await supabase
            .from('users')
            .update({ 
              is_premium: true,
              premium_tokens: 3,
              premium_expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
            .eq('id', userId);
            
          console.log(`Statut premium activé pour l'utilisateur ${userId}`);
          
          // Journaliser la transaction
          await supabase.from('premium_transactions').insert({
            user_id: userId,
            email: customerEmail,
            amount: session.amount_total ? session.amount_total / 100 : 1, // Convertir de centimes en euros
            stripe_session_id: session.id,
            tokens: 3,
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          });
        } else {
          // Enregistrer la transaction même si l'utilisateur n'est pas trouvé
          // (l'utilisateur pourra réclamer ses jetons plus tard)
          await supabase.from('premium_transactions').insert({
            email: customerEmail,
            amount: session.amount_total ? session.amount_total / 100 : 1,
            stripe_session_id: session.id,
            tokens: 3,
            expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            claimed: false
          });
          
          console.log(`Transaction enregistrée pour l'email ${customerEmail} (utilisateur non trouvé)`);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
} 