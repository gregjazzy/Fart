import { NextRequest, NextResponse } from 'next/server';

// Interface pour la structure des données que nous recevons
interface RequestData {
  parameter: string;
  value: string;
  context: {
    sound: string;
    place: string;
    duration: string;
    style: string;
    isLoud: boolean;
    isStinky: boolean;
    isSilent: boolean;
    dictionaryWord: string;
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
            content: `Tu es un humoriste expert en flatulences qui analyse des pets de manière scientifique mais totalement décalée et hilarante.
                      Ton style est drôle, un peu grossier mais intelligent, et utilise toujours des analogies inattendues.
                      Tu réponds TOUJOURS en français, et en UNE SEULE phrase courte et percutante qui se termine par un point d'exclamation.
                      N'utilise JAMAIS de formules d'introduction comme "Ah!" ou "Voici" ou "D'après mon analyse".
                      Commence directement par ta phrase humoristique.`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });
    
    const data = await mistralResponse.json();
    let interpretation = data.choices[0].message.content.trim();
    
    // Nettoyer la réponse si nécessaire (enlever les guillemets, etc.)
    interpretation = interpretation.replace(/^["']|["']$/g, '');
    
    // Si la phrase ne se termine pas par !, ajouter un !
    if (!interpretation.endsWith('!')) {
      interpretation += ' !';
    }
    
    // Inclure le mot du dictionnaire spécifié en gras
    if (requestData.context.dictionaryWord) {
      interpretation = interpretation.replace(
        new RegExp(`\\b${requestData.context.dictionaryWord}\\b`, 'gi'),
        `<strong>${requestData.context.dictionaryWord}</strong>`
      );
    }
    
    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Erreur lors de l\'appel à l\'API Mistral:', error);
    
    // En cas d'erreur, renvoyer une interprétation par défaut
    return NextResponse.json({ 
      interpretation: `Un classique qui ne se démode jamais, comme un bon vieux vinyle de pet !`,
      error: (error as Error).message 
    }, { status: 500 });
  }
}

// Fonction pour générer un prompt approprié selon le contexte
function generatePrompt(data: RequestData): string {
  const { parameter, value, context } = data;
  const { sound, place, duration, style, isLoud, isStinky, isSilent, dictionaryWord } = context;
  
  let basePrompt = `Interprète de façon humoristique ce paramètre d'analyse de pet : "${parameter}" avec la valeur "${value}".`;
  
  basePrompt += `\n\nContexte de ce pet :\n`;
  basePrompt += `- Bruit : ${sound}\n`;
  basePrompt += `- Lieu : ${place}\n`;
  basePrompt += `- Durée : ${duration}\n`;
  basePrompt += `- Style : ${style}\n`;
  basePrompt += `- Caractéristiques : ${isLoud ? 'Bruyant' : ''} ${isStinky ? 'Malodorant' : ''} ${isSilent ? 'Silencieux' : ''}\n`;
  
  if (dictionaryWord) {
    basePrompt += `\nUtilise le mot "${dictionaryWord}" dans ton interprétation humoristique.`;
  }
  
  basePrompt += `\n\nRéponds en une seule phrase courte, drôle et percutante, qui se termine par un point d'exclamation.`;
  
  return basePrompt;
} 