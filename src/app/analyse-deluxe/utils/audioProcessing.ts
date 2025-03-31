// Fonction pour générer une valeur aléatoire dans une plage
export const getRandomValue = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

// Fonction pour sélectionner aléatoirement des éléments dans un tableau
export const getRandomElements = <T,>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Interface pour les données de visualisation
export interface VisualizationData {
  frequencies: number[];
  amplitudes: number[];
  timestamps: number[];
  avgFrequency?: number;
  avgAmplitude?: number;
}

// Fonction pour générer les données de visualisation
export const generateVisualizationData = (
  style: string, 
  duration: number, 
  isRealRecording: boolean = false
): VisualizationData => {
  console.log("Génération des données de visualisation pour style:", style, "durée:", duration);
  
  // Valeurs de base selon le style
  let baseFreq = 0;
  let baseAmp = 0;
  let variance = 0;
  
  if (style === 'bruyant' || style === 'explosif') {
    baseFreq = 400;
    baseAmp = 80;
    variance = 0.4;
  } else if (style === 'humide') {
    baseFreq = 250;
    baseAmp = 65;
    variance = 0.6;
  } else if (style === 'foireux') {
    baseFreq = 320;
    baseAmp = 70;
    variance = 0.8;
  } else { // sec ou standard
    baseFreq = 350;
    baseAmp = 60;
    variance = 0.3;
  }
  
  // Générer des données pour le graphique
  const frequencies: number[] = [];
  const amplitudes: number[] = [];
  const timestamps: number[] = [];
  
  // Nombre d'échantillons (100 points pour une visualisation fluide)
  const numSamples = 100;
  
  for (let i = 0; i < numSamples; i++) {
    // Créer une variation sinusoïdale avec du bruit pour simuler un pet réaliste
    const progress = i / numSamples; // 0 à 1
    
    // Facteur de forme: monte rapidement, descend plus lentement
    let shapeFactor;
    if (progress < 0.2) {
      shapeFactor = progress * 5; // Montée rapide
    } else {
      shapeFactor = 1 - (progress - 0.2) * 1.25; // Descente plus lente
    }
    
    // Ajouter du "bruit" pour rendre cela plus naturel
    const noise = Math.random() * variance;
    
    // Calculer la fréquence actuelle
    let freq;
    if (isRealRecording) {
      // Pour les enregistrements réels, utiliser des données moins prévisibles
      freq = baseFreq * (0.8 + Math.random() * 0.4) * (1 + Math.sin(progress * Math.PI * 2) * 0.2);
    } else {
      // Pour les simulations, utiliser une courbe plus régulière
      freq = baseFreq * (1 - 0.5 * Math.sin(progress * Math.PI)) * (1 + noise);
    }
    
    // Calculer l'amplitude (en forme de cloche)
    const amp = baseAmp * shapeFactor * (1 + noise);
    
    // Timestamp (en secondes)
    const time = progress * duration;
    
    frequencies.push(freq);
    amplitudes.push(amp);
    timestamps.push(time);
  }
  
  // Calculer les moyennes pour les statistiques
  const avgFrequency = parseFloat((frequencies.reduce((sum, val) => sum + val, 0) / frequencies.length).toFixed(1));
  const avgAmplitude = parseFloat((amplitudes.reduce((sum, val) => sum + val, 0) / amplitudes.length).toFixed(1));
  
  return {
    frequencies,
    amplitudes,
    timestamps,
    avgFrequency,
    avgAmplitude
  };
};

// Fonction pour générer un texte d'analyse audio
export const generateAudioAnalysisText = (
  frequency: number | null, 
  amplitude: number | null, 
  duration: number | null
): string => {
  console.log("Génération du texte d'analyse audio:", { frequency, amplitude, duration });
  
  if (!frequency || !amplitude || !duration) {
    const defaultText = "Aucun enregistrement fourni, mais ton pet a quand même du caractère !";
    console.log("Paramètres manquants, utilisation du texte par défaut:", defaultText);
    return defaultText;
  }
  
  let description = "";
  
  // Analyse de la fréquence
  if (frequency < 150) {
    description += "Un grondement grave, digne d'un Tonnerre ! ";
  } else if (frequency < 500) {
    description += "Un pet profond et résonnant, du style 'Je m'impose dans la pièce'. ";
  } else {
    description += "Une tonalité aiguë qui surprendrait même les chauves-souris ! ";
  }
  
  // Analyse de l'amplitude
  if (amplitude > 0.2) {
    description += "Un pet tonitruant, un vrai Kaaaboom ! ";
  } else if (amplitude > 0.05) {
    description += "Volume modéré mais assez pour faire tourner quelques têtes. ";
  } else {
    description += "Discret mais néanmoins présent, le ninja des flatulences. ";
  }
  
  // Analyse de la durée
  if (duration > 2) {
    description += "Un Marathonien, il prend son temps pour tout envahir !";
  } else if (duration > 0.8) {
    description += "Durée respectable, de quoi être fier !";
  } else {
    description += "Court mais efficace, comme une bonne blague !";
  }
  
  console.log("Texte d'analyse généré:", description);
  
  // Toujours retourner le texte généré
  return description;
};

// Simuler l'analyse audio d'un fichier
export const analyzeAudio = (
  durationSeconds: number = 2, 
  intensity: number = 0.7
): {
  frequency: number;
  amplitude: number;
  duration: number;
  frequencyData: number[];
  amplitudeData: number[];
} => {
  // Nombre d'échantillons à générer
  const sampleCount = Math.floor(durationSeconds * 100);
  
  // Fréquence de base et amplitude (simulées)
  const baseFrequency = getRandomValue(80, 500);
  const baseAmplitude = intensity * getRandomValue(0.5, 1.0);
  
  // Générer des données simulées
  const frequencyData: number[] = [];
  const amplitudeData: number[] = [];
  
  for (let i = 0; i < sampleCount; i++) {
    // Simuler des variations naturelles dans la fréquence et l'amplitude
    const timeProgress = i / sampleCount; // 0 à 1
    const frequencyVariation = getRandomValue(-50, 50);
    const amplitudeVariation = getRandomValue(-0.2, 0.2) * intensity;
    
    // Créer une courbe d'amplitude naturelle (montée, plateau, descente)
    let amplitudeMultiplier = 0;
    
    if (timeProgress < 0.2) {
      // Phase de montée
      amplitudeMultiplier = timeProgress * 5; // Montée rapide
    } else if (timeProgress > 0.7) {
      // Phase de descente
      amplitudeMultiplier = (1 - timeProgress) * 3.33; // Descente graduelle
    } else {
      // Plateau
      amplitudeMultiplier = 1;
    }
    
    // Ajouter des variations aléatoires pour plus de réalisme
    const currentFrequency = baseFrequency + frequencyVariation * (1 - timeProgress * 0.5);
    const currentAmplitude = baseAmplitude * amplitudeMultiplier + amplitudeVariation;
    
    frequencyData.push(Math.max(20, currentFrequency)); // Garantir une fréquence minimale
    amplitudeData.push(Math.max(0, Math.min(1, currentAmplitude))); // Limiter l'amplitude entre 0 et 1
  }
  
  return {
    frequency: baseFrequency,
    amplitude: baseAmplitude,
    duration: durationSeconds,
    frequencyData,
    amplitudeData
  };
}; 