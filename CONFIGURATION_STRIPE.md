# Configuration de Stripe pour le Traducteur de Pets

Ce guide vous explique comment configurer Stripe pour activer les paiements premium dans l'application.

## 1. Créer un compte Stripe

Si ce n'est pas déjà fait, créez un compte sur [Stripe](https://dashboard.stripe.com/register).

## 2. Obtenir vos clés API

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com/)
2. Allez dans **Développeurs** > **Clés API**
3. Vous verrez deux clés :
   - **Clé publique** (`pk_test_...`) - À utiliser côté client
   - **Clé secrète** (`sk_test_...`) - À utiliser côté serveur

## 3. Configurer votre environnement

Modifiez le fichier `.env.local` à la racine du projet :

```
# Clés Stripe
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE_ICI
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_ICI
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # URL de base (à changer en production)
```

## 4. Configurer le webhook Stripe (pour les notifications de paiement)

### En développement local :

1. Installez [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Connectez-vous avec `stripe login`
3. Lancez l'écoute des webhooks : 
   ```
   stripe listen --forward-to http://localhost:3000/api/stripe/webhook
   ```
4. Copiez la clé webhook affichée et mettez-la dans `.env.local` comme `STRIPE_WEBHOOK_SECRET`

### En production :

1. Dans le dashboard Stripe, allez dans **Développeurs** > **Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL : `https://votre-domaine.com/api/stripe/webhook`
4. Sélectionnez l'événement `checkout.session.completed`
5. Copiez la clé secrète de signature et mettez-la dans `.env.local` comme `STRIPE_WEBHOOK_SECRET`

## 5. Tester le paiement

1. Lancez l'application : `npm run dev`
2. Accédez à la page premium : http://localhost:3000/premium
3. Utilisez une carte de test Stripe :
   - **Succès** : 4242 4242 4242 4242
   - **Échec** : 4000 0000 0000 0002
   - Date d'expiration : n'importe quelle date future
   - CVC : n'importe quels 3 chiffres
   - Code postal : n'importe quels 5 chiffres

## 6. Structure de la base de données

Assurez-vous d'avoir créé la table `premium_transactions` dans Supabase :

```sql
CREATE TABLE IF NOT EXISTS "premium_transactions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID REFERENCES users(id),
  "email" TEXT NOT NULL,
  "amount" DECIMAL(10,2) NOT NULL,
  "stripe_session_id" TEXT NOT NULL,
  "tokens" INTEGER NOT NULL,
  "expiry" TIMESTAMP WITH TIME ZONE NOT NULL,
  "claimed" BOOLEAN DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ajoutez ces colonnes à votre table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_tokens INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_expiry TIMESTAMP WITH TIME ZONE;
```

## Dépannage

- **Erreur 500 lors de l'appel à l'API Stripe** : Vérifiez que votre clé secrète est correcte
- **Webhook non reçu** : Vérifiez que Stripe CLI est en cours d'exécution ou que votre webhook est correctement configuré
- **Utilisateur pas mis à jour** : Vérifiez les logs du webhook et la connexion à Supabase 