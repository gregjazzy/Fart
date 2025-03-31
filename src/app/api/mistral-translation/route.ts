import { NextRequest, NextResponse } from 'next/server';

// Interface pour la structure des données que nous recevons
interface RequestData {
  context: {
    sound: string;
    place: string;
    duration: string;
    style: string;
    isLoud: boolean;
    isStinky: boolean;
    isSilent: boolean;
    words: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const requestData: RequestData = await request.json();
    
    // Construire un prompt pour Mistral en fonction des paramètres
    const prompt = generatePrompt(requestData);
    
    // Appeler l'API Mistral
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    
    if (!mistralApiKey) {
      throw new Error("La clé API Mistral n'est pas configurée.");
    }
    
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-medium-latest', // Utiliser le modèle medium pour des réponses plus créatives
        messages: [
          {
            role: 'system',
            content: `Tu es un humoriste expert en flatulences qui traduit le "langage des pets" en français.
                      Tu dois traduire un pet de façon créative, drôle et décalée, en parlant à la première personne comme si tu étais le pet.
                      Tu es drôle, un peu grossier mais intelligent, et tu utilises toujours des analogies inattendues.
                      Tu réponds TOUJOURS en français, avec EXACTEMENT entre 20 et 25 mots, pas plus ni moins.
                      Ne commence pas par 'Je suis', mais par une onomatopée ou une exclamation adaptée au type de pet.
                      Utilise obligatoirement au moins un des mots fournis dans la liste.`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    const data = await mistralResponse.json();
    let translation = data.choices[0].message.content.trim();
    
    // Nettoyer la réponse si nécessaire (enlever les guillemets, etc.)
    translation = translation.replace(/^["']|["']$/g, '');
    
    // Si la phrase ne se termine pas par !, ajouter un !
    if (!translation.endsWith('!') && !translation.endsWith('.')) {
      translation += ' !';
    }
    
    // Vérifier le nombre de mots et ajuster si nécessaire
    const wordCount = translation.split(/\s+/).length;
    if (wordCount < 20) {
      // Si trop court, ajouter une phrase d'extension
      const extensions = [
        "Un vrai chef-d'œuvre flatulent !",
        "Une signature olfactive inimitable !",
        "Vous n'êtes pas prêts pour ma puissance !"
      ];
      translation += ' ' + extensions[Math.floor(Math.random() * extensions.length)];
    } else if (wordCount > 25) {
      // Si trop long, couper à 25 mots et ajouter un point d'exclamation
      const words = translation.split(/\s+/).slice(0, 25);
      translation = words.join(' ');
      if (!translation.endsWith('!') && !translation.endsWith('.')) {
        translation += ' !';
      }
    }
    
    // Mettre en gras les mots du dictionnaire qui apparaissent dans la traduction
    requestData.context.words.forEach(word => {
      translation = translation.replace(
        new RegExp(`\\b${word}\\b`, 'gi'),
        `<strong>${word}</strong>`
      );
    });
    
    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Mistral:', error);
    
    // En cas d'erreur, renvoyer une traduction par défaut générique
    return NextResponse.json({ 
      translation: `PROUT ! Je suis un pet mystérieux qui s'échappe dans un lieu inconnu. Préparez-vous à l'impact !`,
      error: (error as Error).message 
    }, { status: 500 });
  }
}

// Fonction pour générer un prompt approprié selon le contexte
function generatePrompt(data: RequestData): string {
  const { context } = data;
  const { sound, place, duration, style, isLoud, isStinky, isSilent, words } = context;
  
  let basePrompt = `Traduis ce pet d'une manière humoristique en parlant à la première personne comme si tu étais le pet.`;
  
  basePrompt += `\n\nContexte de ce pet :\n`;
  basePrompt += `- Bruit : ${sound}\n`;
  basePrompt += `- Lieu : ${place}\n`;
  basePrompt += `- Durée : ${duration}\n`;
  basePrompt += `- Style : ${style}\n`;
  basePrompt += `- Caractéristiques : ${isLoud ? 'Bruyant' : ''} ${isStinky ? 'Malodorant' : ''} ${isSilent ? 'Silencieux' : ''}\n`;
  
  basePrompt += `\nUtilise au moins un de ces mots dans ta traduction : ${words.join(', ')}`;
  basePrompt += `\n\nRéponds en utilisant EXACTEMENT entre 20 et 25 mots, avec une onomatopée ou une exclamation adaptée au type de pet.`;
  
  return basePrompt;
} 