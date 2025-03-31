import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Constantes pour Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://apbkobhfnmcqqzqeeqss.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtwd2V6YnFhdnhpdXNkdmhzZ3dzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNDEwOTM5MywiZXhwIjoyMDE5Njg1MzkzfQ.tZNF0h2jvlqAdH8xHFk7nzFRFwsCEqVT9tqQz2mK6tw';

// Log pour debugging
console.log('[API] Initialisation de Supabase avec URL:', supabaseUrl);
console.log('[API] Clé Supabase Service (5 premiers caractères):', supabaseServiceKey.substring(0, 5) + '...');

// Constante pour Mistral API
const mistralApiKey = process.env.MISTRAL_API_KEY || '';

// Initialiser le client Supabase une seule fois
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Vérification des jetons premium
async function verifyPremiumTokens(request: NextRequest) {
  try {
    // Vérifier le cookie des jetons
    const cookieStore = request.cookies;
    const tokensCookie = cookieStore.get('premium_tokens');
    const expiryCookie = cookieStore.get('premium_expiry');
    
    if (!tokensCookie || !expiryCookie) {
      console.log('Accès à l\'API Mistral: Cookies de jetons manquants');
      return false;
    }
    
    const tokens = parseInt(tokensCookie.value);
    const expiry = parseInt(expiryCookie.value);
    
    // Vérifier si l'utilisateur a des jetons et si son abonnement n'est pas expiré
    const hasTokens = tokens > 0;
    const isValid = expiry > Date.now();
    
    console.log('Vérification des jetons premium pour API Mistral:', {
      tokens,
      expiry: new Date(expiry).toISOString(),
      hasTokens,
      isValid,
      currentTime: new Date().toISOString()
    });
    
    return hasTokens && isValid;
  } catch (e) {
    console.error("Exception lors de la vérification des jetons premium:", e);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obtenir les données de la requête
    const body = await request.json();
    const { type, params = {} } = body;
    
    if (!type) {
      return NextResponse.json({ error: "Type de requête manquant" }, { status: 400 });
    }
    
    // Vérifier les jetons premium uniquement pour les analyses avancées
    if (type !== 'basic-analysis') {
      const hasValidTokens = await verifyPremiumTokens(request);
      
      if (!hasValidTokens) {
        console.log('Accès API Mistral refusé: pas de jetons premium valides');
        return NextResponse.json({ 
          error: "Accès refusé: pas de jetons premium valides", 
          redirectTo: "/premium" 
        }, { status: 403 });
      }
    }
    
    // Aucune validation des paramètres - tout accepter
    // Extraire les paramètres avec des valeurs par défaut pour éviter les erreurs
    const sound = params.sound || 'standard';
    const place = params.place || 'inconnu';
    const style = params.style || 'classique';
    const duration = params.duration || '1';
    
    // Préparer le prompt
    let prompt = '';
    
    switch (type) {
      case 'basic-analysis':
        prompt = buildBasicAnalysisPrompt(params);
        break;
      case 'introduction':
        prompt = buildIntroductionPrompt(params);
        break;
      case 'analyse-situation':
        prompt = buildAnalyseSituationPrompt(params);
        break;
      case 'analyse-critique':
        prompt = buildAnalyseCritiquePrompt(params);
        break;
      case 'traduction-personnalite':
        prompt = buildTraductionPersonnalitePrompt(params);
        break;
      case 'analyse-scientifique-avancee':
        prompt = buildScientificAnalysisPrompt(params);
        break;
      case 'translate':
        prompt = buildTranslationPrompt(params);
        break;
      default:
        return NextResponse.json({ error: "Type de requête non pris en charge" }, { status: 400 });
    }
    
    // Appeler l'API Mistral
    console.log(`Appel API Mistral (modèle: mistral-medium) pour type: ${type}`);
    
    try {
      // Appel direct avec fetch (sans utiliser le client SDK)
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mistralApiKey}`
        },
        body: JSON.stringify({
          model: "mistral-medium",
          messages: [
            { 
              role: "system", 
              content: "Tu es un collectif d'experts en flatulologie avec plus de 20 ans d'expérience dans l'analyse sonore et environnementale des flatulences. Le collectif d'experts utilise un style très humoristique et raffiné, créatif, avec des jeux de mots intelligents, des références culturelles et des métaphores ingénieuses. Notre collectif privilégie l'esprit et la finesse. Une légère vulgarité est acceptable si elle sert l'humour et reste spirituelle - jamais gratuite ou grossière. IMPORTANT: Ne jamais mentionner d'intelligence artificielle ou indiquer que ce texte est généré par une IA. Les analyses doivent paraître comme rédigées par un véritable groupe d'experts en flatulologie."
            },
            { 
              role: "user", 
              content: prompt 
            }
          ],
          temperature: 0.9,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur API Mistral (${response.status}): ${errorText}`);
        return NextResponse.json({ 
          error: "Erreur lors de l'appel à l'API Mistral", 
          details: `Statut: ${response.status}, Message: ${errorText}`
        }, { status: 500 });
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      console.log(`Réponse brute de Mistral pour ${type}: ${content.substring(0, 100)}...`);
      
      // Formater la réponse en fonction du type
      let responseData;
      switch (type) {
        case 'basic-analysis':
        case 'introduction':
        case 'analyse-situation':
        case 'analyse-critique':
        case 'traduction-personnalite':
        case 'analyse-scientifique-avancee':
          responseData = { analysis: content };
          break;
        default:
          responseData = { content };
      }
      
      return NextResponse.json(responseData);
    } catch (apiError) {
      console.error("Erreur lors de l'appel à l'API Mistral:", apiError);
      return NextResponse.json({ 
        error: "Erreur lors de l'appel à l'API Mistral", 
        details: apiError instanceof Error ? apiError.message : "Erreur inconnue" 
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Erreur lors du traitement de la requête API Mistral:", error);
    return NextResponse.json({ 
      error: "Erreur lors du traitement de votre demande",
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

// Consommer un jeton premium
async function consumePremiumToken(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('premium_tokens')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error("Erreur lors de la récupération des jetons premium:", error);
      return;
    }
    
    if (!data) {
      console.error("Aucune donnée de jetons trouvée pour l'utilisateur:", userId);
      return;
    }
    
    const currentTokens = data.premium_tokens;
    
    if (currentTokens <= 0) {
      console.log(`Aucun jeton à consommer pour l'utilisateur ${userId} (tokens actuels: ${currentTokens})`);
      return;
    }
    
    // Décrémenter un jeton
    const newTokenCount = currentTokens - 1;
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({ premium_tokens: newTokenCount })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Erreur lors de la consommation du jeton:", updateError);
      return;
    }
    
    console.log(`Un jeton premium consommé pour l'utilisateur ${userId}. Jetons restants: ${newTokenCount}`);
  } catch (e) {
    console.error("Exception lors de la consommation du jeton premium:", e);
  }
}

// Fonctions pour construire les prompts
function buildIntroductionPrompt(params: any) {
  const introStyle = params.style || 'sophistiqué';
  const introPlace = params.place || 'inconnu';
  const introSound = params.sound || 'standard';
  const introDuration = params.duration || '1';
  
  return `En tant qu'expert en flatulologie ULTRA-DÉJANTÉ avec un style ${introStyle}, écris une introduction COURTE, HILARANTE et COMPLÈTEMENT FOLLE pour l'analyse d'un pet.
  Ce pet a été produit dans "${introPlace}", avec un son de type "${introSound}" et une durée d'environ ${introDuration} seconde(s).
  MAXIMUM 40 MOTS !! Sois disruptif, fou, et utilise des métaphores complètement décalées.
  Écris UN SEUL paragraphe court et HYPER percutant, SANS conclusion ni formule de politesse.`;
}

const buildAnalyseSituationPrompt = (params: any): string => {
  const { style, place, sound, duration } = params;
  
  return `En tant que collectif d'humoristes délirants spécialisés dans l'analyse situationnelle des flatulences, nous avons étudié ce pet avec les caractéristiques suivantes:
- Style: ${style || "classique"}
- Lieu: ${place || "inconnu"}
- Son: ${sound || "pfffrrt"}
- Durée: ${duration || "1"} secondes

IMPORTANT: Vous devez analyser la situation créée par ce pet de façon extrêmement loufoque et absurde.
Votre réponse doit:
1. Contenir environ 117 mots (entre 110 et 125 mots)
2. Être totalement délirante et invraisemblable
3. Suggérer des conséquences catastrophiques ou surréalistes du pet sur le lieu et l'environnement
4. Inclure au moins trois références absurdes (culturelles, historiques ou scientifiques)
5. Utiliser un ton apocalyptique mais comique
6. Mentionner au moins deux effets sur les personnes présentes dans le lieu
7. Décrire comment certains objets du lieu réagissent de façon surréaliste
8. Suggérer un paradoxe temporel ou une distorsion de la réalité

EXEMPLE: "ALERTE NIVEAU 5! Ce pet de 3s a déformé l'espace-temps! Les livres parlent maintenant le Latin et trois physiciens ont démissionné. La NASA enquête sur cette anomalie liée au Manuscrit de Voynich. Deux étudiants communiquent avec les mollusques, le bibliothécaire flotte à 10cm du sol. Les plantes poussent à l'envers, et Einstein serait revenu en hologramme pour réviser sa théorie de la relativité."

Générez uniquement le contenu de l'analyse de situation, sans introduction ni conclusion.`;
};

const buildAnalyseCritiquePrompt = (params: any): string => {
  const { style, place, sound, duration } = params;
  
  return `Tu es un critique d'art prétentieux et excentrique, spécialisé dans l'analyse de flatulences comme forme d'expression artistique. On t'a décrit un pet avec les caractéristiques suivantes:
- Style: ${style || "classique"}
- Lieu: ${place || "inconnu"}
- Son: ${sound || "pfffrrt"}
- Durée: ${duration || "1"} secondes

IMPORTANT: Tu dois critiquer ce pet comme s'il s'agissait d'une œuvre d'art contemporaine révolutionnaire.
Ta critique doit:
1. Faire maximum 50 mots
2. Utiliser un vocabulaire artistique absurdement prétentieux
3. Comparer ce pet à une œuvre d'art connue ou un mouvement artistique
4. Inventer des termes techniques bidons mais convaincants
5. Donner une note artistique sur 5 étoiles avec une justification dérisoire

EXEMPLE: "⭐⭐⭐⭐ Le 'pfffrrrt' de 2s au supermarché transcende le néo-flatulisme post-moderne. Sa rythmique désynchronisée et sa palette olfactive crue évoque Picasso dans sa période bleue. Un chef-d'œuvre de transsonorité métaphysique!"

Génère uniquement le contenu de la critique, sans introduction ni conclusion.`;
};

function buildTraductionPersonnalitePrompt(params: any): string {
  const { style, place, sound, duration } = params;
  
  return `En tant que collectif de psychologues excentriques spécialisés dans l'analyse psychologique des flatulences, nous avons analysé ce pet avec:
- Style: ${style || "classique"}
- Lieu: ${place || "inconnu"}
- Son: ${sound || "pfffrrt"}
- Durée: ${duration || "1"} secondes

IMPORTANT: Vous devez traduire ce pet en un profil de personnalité avancé, détaillé mais crédible.
Votre analyse doit:
1. Faire environ 105 mots (entre 95 et 115 mots)
2. NE PAS commencer par "ANALYSE DE PERSONNALITÉ AVANCÉE" (car ce titre est déjà présent dans l'interface)
3. Lister 4-5 traits de personnalité inhabituels mais plausibles avec des pourcentages et indicateurs techniques
4. Inclure un ou deux talents cachés improbables révélés par ce pet
5. Suggérer un animal totem associé à ce profil avec une courte justification
6. Conclure par un conseil de développement personnel légèrement absurde mais utile
7. Utiliser un vocabulaire technique crédible sans être trop extravagant
8. Établir des connexions crédibles entre les caractéristiques du pet et les traits de personnalité

EXEMPLE: "Tendance à l'organisation méticuleuse des espaces (indice de spécificité 87%). Sensibilité exacerbée aux environnements sonores (score psychoacoustique 43.2). Talent caché pour la mémorisation de détails insignifiants, particulièrement efficace sous pression. Capacité insoupçonnée à percevoir les changements atmosphériques subtils. Votre signature sonore révèle une affinité particulière avec les structures narratives non-linéaires. Animal totem: le renard observateur, en raison d'une concordance harmonique entre vos fréquences expressives. CONSEIL: Intégrez des moments de silence intentionnel dans votre routine quotidienne pour amplifier votre créativité naturelle."

Générez uniquement le contenu de l'analyse de personnalité avancée, sans introduction ni conclusion, ni titre.`;
}

function buildScientificAnalysisPrompt(params: any) {
  const sciStyle = params.style || 'académique';
  const sciPlace = params.place || 'un lieu inconnu';
  const sciSound = params.sound || 'standard';
  const sciDuration = params.duration || '1';
  
  return `En tant que collectif de SCIENTIFIQUES spécialistes en acoustique flatulente, analysez ces paramètres acoustiques de façon approfondie et décalée:
  Pet produit: "${sciPlace}", son "${sciSound}", style "${sciStyle}", durée ${sciDuration}s.
  
  LISTEZ EXACTEMENT 4 PARAMÈTRES ACOUSTIQUES UNIQUES avec leurs valeurs mesurées et explications:
  1. [Signature acoustique complexe] : explication technique et surprenante avec des valeurs en décibels et hertz (25-30 mots)
  2. [Résonance harmonique] : explication sur les ondes et leur propagation avec données mesurées (25-30 mots)
  3. [Coefficient d'impact environnemental] : explication sur l'interaction avec l'environnement, données techniques (25-30 mots)
  4. [Indice de complexité vibratoire] : explication sur la structure temporelle et spatiale du son (25-30 mots)
  
  Utilisez un vocabulaire technique crédible avec des termes d'acoustique réels mélangés à des termes inventés. Incluez des mesures précises, des unités scientifiques (Hz, dB, ms, etc.) et des références à des équipements d'analyse sophistiqués.`;
}

// Fonction pour construire le prompt d'analyse basique
function buildBasicAnalysisPrompt(params: any) {
  const { sound = 'standard', place = 'inconnu', style = 'classique', duration = '1' } = params;
  
  return `En tant que collectif d'experts en flatulologie, rédigez une analyse TRÈS humoristique, intelligente et raffinée de ce pet.
  Ce pet a été produit dans "${place}", avec un son de type "${sound}", un style "${style}" et une durée d'environ ${duration} seconde(s).
  
  IMPORTANT: Votre réponse DOIT contenir ENTRE 70 ET 88 MOTS EXACTEMENT, ni plus ni moins.
  
  L'analyse doit être concise (1-2 paragraphes maximum), TRÈS amusante et spirituelle.
  Privilégiez l'humour intelligent, les jeux de mots fins, et les références culturelles subtiles.
  Une légère vulgarité ou des mots crus sont acceptables s'ils servent l'humour et restent élégants - jamais de vulgarité gratuite.
  Imaginez un expert cultivé qui sait être drôle même sur des sujets tabous, sans jamais tomber dans la facilité.
  
  RAPPEL: Votre réponse DOIT faire ENTRE 70 ET 88 MOTS EXACTEMENT.`;
}

// Fonction pour construire le prompt de traduction
function buildTranslationPrompt(params: any) {
  const { sound = 'standard', place = 'inconnu', style = 'classique', duration = '1' } = params;
  
  return `En tant que TRADUCTEUR DÉLIRANT de flatulences, traduis ce pet ("${sound}", "${place}", "${style}", ${duration}s) en 4 LANGUES DIFFÉRENTES.
  
  POUR CHAQUE LANGUE (limite de 40 mots au total!):
  - Nom inventé du pet (MAX 5 MOTS)
  - Ce qu'il exprime VRAIMENT (MAX 5 MOTS)
  
  SOIS ABSURDEMENT CRÉATIF ! Invente des mots qui SEMBLENT appartenir à chaque langue.
  Inclus au moins UNE LANGUE IMAGINAIRE complètement inventée !`;
} 