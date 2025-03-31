// Fichier d'index pour les variations d'analyses

// Importer toutes les variations
import compositionAnalyses from './compositionAnalyses';
import environmentalAnalyses from './environmentalAnalyses';
import expertAnalyses from './expertAnalyses';
import translationVariations from './translationVariations';
import personalityTipsVariations from './personalityTipsVariations';
import physicalTipsVariations from './physicalTipsVariations';
import smartTipsVariations from './smartTipsVariations';

// Fonction utilitaire pour obtenir des éléments aléatoires sans répétition
export function getRandomElements(array: any[], count: number): any[] {
  // Copier le tableau pour ne pas modifier l'original
  const shuffled = [...array];
  
  // Mélanger le tableau (algorithme de Fisher-Yates)
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Retourner le nombre d'éléments demandé
  return shuffled.slice(0, count);
}

// Alias de getRandomElements pour clarifier l'intention - s'assure que les éléments sont uniques
export function getRandomUniqueElements(array: any[], count: number): any[] {
  return getRandomElements(array, count);
}

// Fonction pour obtenir une analyse aléatoire sans répéter les mêmes
export function getRandomAnalysis(variations: any[], style: string = '', params: any = {}) {
  // Utiliser le style comme graine pour la sélection (permet de garder une cohérence par style)
  const seed = style.length > 0 ? style.charCodeAt(0) % variations.length : Math.floor(Math.random() * variations.length);
  
  // Ajouter un élément aléatoire pour éviter la répétition
  const randomOffset = Math.floor(Math.random() * (variations.length - 1)) + 1;
  
  // Calculer l'index final avec un modulo pour rester dans les limites du tableau
  const finalIndex = (seed + randomOffset) % variations.length;
  
  // Si c'est une fonction, l'appeler avec les paramètres, sinon retourner la valeur
  return typeof variations[finalIndex] === 'function' 
    ? variations[finalIndex](params) 
    : variations[finalIndex];
}

// Génération de scores de qualité variés
export function generateQualityScore(style: string, place: string = 'inconnu') {
  // Générer un score de base entre 65 et 95
  const baseScore = Math.floor(Math.random() * 30) + 65;
  
  // Ajustement en fonction du lieu (bonus ou malus léger)
  const placeBonus = place === 'bureau' ? -5 : place === 'maison' ? 5 : place === 'extérieur' ? 3 : 0;
  
  // Ajustement en fonction du style
  const styleBonus = style === 'sec' ? 3 : style === 'foireux' ? -2 : style === 'vibrant' ? 5 : 0;
  
  // Score ajusté (entre 50 et 100)
  const adjustedBaseScore = Math.max(50, Math.min(100, baseScore + placeBonus + styleBonus));
  
  // Générer des scores pour chaque catégorie avec une variation de ±10 points autour du score de base
  const generateCategoryScore = () => {
    const variation = Math.floor(Math.random() * 20) - 10;
    const score = Math.max(50, Math.min(100, adjustedBaseScore + variation));
    return score;
  };
  
  return {
    total: adjustedBaseScore,
    details: [
      { category: "Technique", score: generateCategoryScore() },
      { category: "Timing", score: generateCategoryScore() },
      { category: "Impact", score: generateCategoryScore() },
      { category: "Style", score: generateCategoryScore() }
    ]
  };
}

// Exporter toutes les variations
export {
  compositionAnalyses,
  environmentalAnalyses,
  expertAnalyses,
  translationVariations,
  personalityTipsVariations,
  physicalTipsVariations,
  smartTipsVariations
}; 