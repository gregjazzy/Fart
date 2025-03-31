// Test de la configuration Stripe
require('dotenv').config({ path: '.env.local' });
const Stripe = require('stripe');

const stripeKey = process.env.STRIPE_SECRET_KEY || '';
console.log('Clé Stripe (masquée):', stripeKey ? `${stripeKey.substring(0, 5)}...` : 'NON DÉFINIE');

async function testStripe() {
  try {
    if (!stripeKey) {
      console.error('❌ ERREUR: La clé Stripe n\'est pas définie dans .env.local');
      process.exit(1);
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    console.log('🔍 Test de connexion à Stripe...');
    const balance = await stripe.balance.retrieve();
    console.log('✅ Connexion à Stripe réussie!');

    // Créer une session de test
    console.log('🔍 Création d\'une session de test...');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Produit de test',
              description: 'Description du produit de test'
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    console.log('✅ Session créée avec succès!');
    console.log('URL de la session:', session.url);
    
    console.log('\n🎉 La configuration Stripe est correcte!');
  } catch (error) {
    console.error('❌ ERREUR Stripe:', error);
    process.exit(1);
  }
}

testStripe(); 