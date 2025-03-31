// 30 courbes acoustiques prédéfinies pour l'analyse
// Chaque courbe a des caractéristiques différentes pour s'adapter aux différents types d'enregistrements

export interface AcousticCurve {
  id: number;
  name: string;
  characteristics: {
    soundTrend: 'montant' | 'descendant' | 'stable' | 'montant-descendant' | 'descendant-montant' | 'fluctuant';
    intensityTrend: 'forte' | 'faible' | 'moyenne' | 'croissante' | 'décroissante' | 'variable';
    duration: 'courte' | 'moyenne' | 'longue';
    complexity: 'simple' | 'complexe' | 'très complexe';
  };
  data: {
    frequencies: number[];
    amplitudes: number[];
    timestamps: number[];
  };
}

// Fonction utilitaire pour générer des courbes
const generateCurveData = (
  points: number = 144, // 12 points par seconde pendant 12 secondes
  baseFrequency: number = 200,
  baseAmplitude: number = 50,
  frequencyVariation: number = 150,
  amplitudeVariation: number = 40,
  pattern: (i: number, points: number) => { freqMod: number, ampMod: number }
) => {
  const frequencies: number[] = [];
  const amplitudes: number[] = [];
  const timestamps: number[] = [];

  for (let i = 0; i < points; i++) {
    const { freqMod, ampMod } = pattern(i, points);
    
    // Ajouter une variation aléatoire mineure pour rendre la courbe plus naturelle
    const randomFreq = (Math.random() - 0.5) * 30;
    const randomAmp = (Math.random() - 0.5) * 15;
    
    frequencies.push(Math.max(20, Math.min(1000, baseFrequency + frequencyVariation * freqMod + randomFreq)));
    amplitudes.push(Math.max(5, Math.min(100, baseAmplitude + amplitudeVariation * ampMod + randomAmp)));
    timestamps.push(i * (12 / points));
  }

  return { frequencies, amplitudes, timestamps };
};

// 30 courbes prédéfinies avec différentes caractéristiques
export const predefinedCurves: AcousticCurve[] = [
  // 1. Courbe montante forte
  {
    id: 1,
    name: "Crescendo Puissant",
    characteristics: {
      soundTrend: 'montant',
      intensityTrend: 'forte',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 150, 30, 300, 60, (i, points) => ({
      freqMod: Math.pow(i / points, 1.5),
      ampMod: Math.pow(i / points, 1.8)
    }))
  },
  
  // 2. Courbe descendante forte
  {
    id: 2,
    name: "Explosion Diminuante",
    characteristics: {
      soundTrend: 'descendant',
      intensityTrend: 'forte',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 450, 90, 250, 50, (i, points) => ({
      freqMod: 1 - Math.pow(i / points, 1.2),
      ampMod: 1 - Math.pow(i / points, 1.5)
    }))
  },
  
  // 3. Courbe stable moyenne
  {
    id: 3,
    name: "Stable Continu",
    characteristics: {
      soundTrend: 'stable',
      intensityTrend: 'moyenne',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 250, 50, 50, 20, (i, points) => ({
      freqMod: 0.5 + Math.sin(i / 10) * 0.1,
      ampMod: 0.5 + Math.sin(i / 12) * 0.1
    }))
  },
  
  // 4. Courbe en cloche (montant-descendant)
  {
    id: 4,
    name: "Cloche Classique",
    characteristics: {
      soundTrend: 'montant-descendant',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 200, 40, 200, 50, (i, points) => {
      const x = i / points * 2 - 1; // -1 à 1
      return {
        freqMod: 0.5 + 0.5 * Math.exp(-4 * x * x),
        ampMod: 0.5 + 0.5 * Math.exp(-3 * x * x)
      };
    })
  },
  
  // 5. Courbe avec double pic
  {
    id: 5,
    name: "Double Explosion",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 200, 40, 250, 55, (i, points) => {
      const x1 = (i / points) * 4 - 1; // centré à 25%
      const x2 = (i / points) * 4 - 3; // centré à 75%
      return {
        freqMod: 0.3 + 0.7 * (Math.exp(-4 * x1 * x1) + Math.exp(-4 * x2 * x2)),
        ampMod: 0.2 + 0.8 * (Math.exp(-3 * x1 * x1) + Math.exp(-3 * x2 * x2))
      };
    })
  },
  
  // 6. Courbe courte intense
  {
    id: 6,
    name: "Explosion Brève",
    characteristics: {
      soundTrend: 'montant-descendant',
      intensityTrend: 'forte',
      duration: 'courte',
      complexity: 'simple'
    },
    data: generateCurveData(144, 300, 70, 200, 30, (i, points) => {
      const ratio = i / points;
      return {
        freqMod: ratio < 0.2 ? ratio * 5 : 1 - ((ratio - 0.2) / 0.8),
        ampMod: ratio < 0.15 ? ratio * 6.67 : 1 - ((ratio - 0.15) / 0.85)
      };
    })
  },
  
  // 7. Courbe longue progressive
  {
    id: 7,
    name: "Crescendo Prolongé",
    characteristics: {
      soundTrend: 'montant',
      intensityTrend: 'croissante',
      duration: 'longue',
      complexity: 'simple'
    },
    data: generateCurveData(144, 150, 20, 350, 70, (i, points) => ({
      freqMod: Math.min(1, Math.pow(i / points, 0.7) * 1.2),
      ampMod: Math.pow(i / points, 0.6)
    }))
  },
  
  // 8. Courbe avec fluctuations rythmiques
  {
    id: 8,
    name: "Rythmique Ondulant",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 220, 45, 180, 35, (i, points) => {
      const base = i / points; // Tendance de base croissante
      const sine = Math.sin(i / 10) * 0.3; // Ondulation
      return {
        freqMod: 0.2 + base * 0.6 + sine,
        ampMod: 0.3 + base * 0.5 + Math.sin(i / 8) * 0.25
      };
    })
  },
  
  // 9. Courbe faible puis explosion
  {
    id: 9,
    name: "Surprise Finale",
    characteristics: {
      soundTrend: 'descendant-montant',
      intensityTrend: 'croissante',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 180, 30, 320, 60, (i, points) => {
      const ratio = i / points;
      return {
        freqMod: ratio < 0.7 ? 0.3 + ratio * 0.2 : 0.5 + (ratio - 0.7) * 1.5,
        ampMod: ratio < 0.75 ? 0.2 + ratio * 0.1 : 0.3 + (ratio - 0.75) * 2.8
      };
    })
  },
  
  // 10. Courbe en cascade (plusieurs pics descendants)
  {
    id: 10,
    name: "Cascade Décroissante",
    characteristics: {
      soundTrend: 'descendant',
      intensityTrend: 'décroissante',
      duration: 'longue',
      complexity: 'très complexe'
    },
    data: generateCurveData(144, 400, 80, 250, 40, (i, points) => {
      const ratio = i / points;
      // Ajout de plusieurs pics qui diminuent progressivement
      const wave = Math.sin(i / 5) * (1 - ratio) * 0.5;
      return {
        freqMod: 0.9 - ratio * 0.7 + wave,
        ampMod: 0.95 - ratio * 0.8 + wave * 0.7
      };
    })
  },
  
  // 11. Courbe avec vibrato constant
  {
    id: 11,
    name: "Vibrato Continu",
    characteristics: {
      soundTrend: 'stable',
      intensityTrend: 'moyenne',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 220, 55, 100, 25, (i, points) => {
      const baseFreq = 0.5 + (i / points) * 0.1;
      const baseAmp = 0.6 - (i / points) * 0.2;
      return {
        freqMod: baseFreq + Math.sin(i / 3) * 0.2,
        ampMod: baseAmp + Math.sin(i / 2.5) * 0.15
      };
    })
  },
  
  // 12. Courbe intense avec chute brutale
  {
    id: 12,
    name: "Descente Brutale",
    characteristics: {
      soundTrend: 'descendant',
      intensityTrend: 'forte',
      duration: 'courte',
      complexity: 'simple'
    },
    data: generateCurveData(144, 450, 90, 300, 50, (i, points) => {
      const ratio = i / points;
      const cutoff = 0.3; // Point de chute brutale
      return {
        freqMod: ratio < cutoff ? 0.9 - ratio * 0.5 : 0.75 - (ratio - cutoff) * 1.5,
        ampMod: ratio < cutoff ? 1 - ratio * 0.1 : 0.9 - (ratio - cutoff) * 2
      };
    })
  },
  
  // 13. Courbe avec montée progressive puis plateau
  {
    id: 13,
    name: "Montée puis Stabilisation",
    characteristics: {
      soundTrend: 'montant',
      intensityTrend: 'croissante',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 180, 30, 270, 50, (i, points) => {
      const ratio = i / points;
      const plateauPoint = 0.6;
      return {
        freqMod: ratio < plateauPoint ? ratio / plateauPoint : 1,
        ampMod: ratio < plateauPoint ? 0.3 + 0.7 * (ratio / plateauPoint) : 1
      };
    })
  },
  
  // 14. Courbe avec plusieurs mini-explosions
  {
    id: 14,
    name: "Rafale Multiple",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'variable',
      duration: 'longue',
      complexity: 'très complexe'
    },
    data: generateCurveData(144, 250, 50, 200, 40, (i, points) => {
      const base = 0.4 - (i / points) * 0.1;
      // Génération de 4 mini-explosions
      let explosions = 0;
      for (let j = 1; j <= 4; j++) {
        const center = j / 5; // Centres à 20%, 40%, 60%, 80%
        const dist = Math.abs(i / points - center);
        if (dist < 0.08) { // Largeur de l'explosion
          explosions += 0.8 * (1 - dist / 0.08);
        }
      }
      return {
        freqMod: base + explosions * 0.6,
        ampMod: base + explosions * 0.7
      };
    })
  },
  
  // 15. Courbe faible et stable
  {
    id: 15,
    name: "Discret et Constant",
    characteristics: {
      soundTrend: 'stable',
      intensityTrend: 'faible',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 100, 20, 50, 15, (i, points) => ({
      freqMod: 0.3 + Math.sin(i / 15) * 0.1,
      ampMod: 0.25 + Math.sin(i / 20) * 0.05
    }))
  },
  
  // 16. Courbe avec montée en deux temps
  {
    id: 16,
    name: "Double Crescendo",
    characteristics: {
      soundTrend: 'montant',
      intensityTrend: 'croissante',
      duration: 'longue',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 150, 30, 300, 60, (i, points) => {
      const ratio = i / points;
      const firstHalf = ratio < 0.5;
      // Première moitié: montée modérée, seconde moitié: montée plus forte
      return {
        freqMod: firstHalf 
          ? 0.2 + ratio * 0.6 
          : 0.5 + (ratio - 0.5) * 1,
        ampMod: firstHalf 
          ? 0.2 + ratio * 0.4 
          : 0.4 + (ratio - 0.5) * 1.2
      };
    })
  },
  
  // 17. Courbe avec trémolo (variation rapide d'amplitude)
  {
    id: 17,
    name: "Trémolo Expressif",
    characteristics: {
      soundTrend: 'stable',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 220, 50, 120, 40, (i, points) => {
      const baseFreq = 0.5 + (i / points) * 0.2;
      // Trémolo: variation rapide d'amplitude
      return {
        freqMod: baseFreq + Math.sin(i / 10) * 0.1,
        ampMod: 0.6 + Math.sin(i * 0.8) * 0.35
      };
    })
  },
  
  // 18. Courbe explosive avec réverbération
  {
    id: 18,
    name: "Explosion avec Écho",
    characteristics: {
      soundTrend: 'montant-descendant',
      intensityTrend: 'forte',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 350, 80, 250, 40, (i, points) => {
      const ratio = i / points;
      const explosion = Math.exp(-10 * Math.pow(ratio - 0.2, 2)); // Pic à 20%
      // Ajout de réverbérations après l'explosion principale
      const reverb = ratio > 0.3 ? 0.3 * Math.exp(-2 * (ratio - 0.3)) * Math.sin(i / 3) : 0;
      return {
        freqMod: 0.3 + explosion * 0.7 + reverb * 0.2,
        ampMod: 0.2 + explosion * 0.8 + reverb * 0.15
      };
    })
  },
  
  // 19. Courbe en escalier descendant
  {
    id: 19,
    name: "Escalier Descendant",
    characteristics: {
      soundTrend: 'descendant',
      intensityTrend: 'décroissante',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 400, 85, 300, 50, (i, points) => {
      const ratio = i / points;
      // Création de 4 marches d'escalier
      const step = Math.floor(ratio * 4) / 4;
      return {
        freqMod: 0.9 - step * 0.8,
        ampMod: 0.95 - step * 0.9
      };
    })
  },
  
  // 20. Courbe ondulante avec tendance croissante
  {
    id: 20,
    name: "Vague Ascendante",
    characteristics: {
      soundTrend: 'montant',
      intensityTrend: 'croissante',
      duration: 'longue',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 180, 35, 220, 45, (i, points) => {
      const ratio = i / points;
      // Tendance générale croissante avec ondulations
      return {
        freqMod: 0.3 + ratio * 0.6 + Math.sin(i / 8) * 0.15,
        ampMod: 0.2 + ratio * 0.7 + Math.sin(i / 7) * 0.1
      };
    })
  },
  
  // 21. Courbe en forme de W
  {
    id: 21,
    name: "Double Vallée",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 250, 50, 200, 40, (i, points) => {
      const ratio = i / points;
      // Forme en W (haut-bas-haut-bas-haut)
      const w = Math.abs(Math.sin(ratio * Math.PI * 2));
      return {
        freqMod: 0.3 + w * 0.7,
        ampMod: 0.4 + w * 0.6
      };
    })
  },
  
  // 22. Courbe avec plateau central
  {
    id: 22,
    name: "Plateau Soutenu",
    characteristics: {
      soundTrend: 'montant-descendant',
      intensityTrend: 'moyenne',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 280, 60, 150, 30, (i, points) => {
      const ratio = i / points;
      // Montée rapide, plateau, descente rapide
      if (ratio < 0.2) {
        return { freqMod: ratio * 4, ampMod: ratio * 5 };
      } else if (ratio > 0.8) {
        return { freqMod: 1 - (ratio - 0.8) * 5, ampMod: 1 - (ratio - 0.8) * 5 };
      } else {
        return { freqMod: 0.8 + Math.sin(ratio * 10) * 0.05, ampMod: 1 };
      }
    })
  },
  
  // 23. Courbe en forme de sinus amorti
  {
    id: 23,
    name: "Oscillation Amortie",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'décroissante',
      duration: 'longue',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 300, 70, 200, 40, (i, points) => {
      const ratio = i / points;
      // Sinus dont l'amplitude diminue progressivement
      const decay = Math.exp(-ratio * 3);
      return {
        freqMod: 0.5 + decay * Math.sin(i / 5) * 0.5,
        ampMod: 0.6 + decay * Math.sin(i / 4) * 0.4
      };
    })
  },
  
  // 24. Courbe avec montée exponentielle
  {
    id: 24,
    name: "Accélération Exponentielle",
    characteristics: {
      soundTrend: 'montant',
      intensityTrend: 'croissante',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 120, 20, 380, 70, (i, points) => {
      const ratio = i / points;
      // Croissance exponentielle
      return {
        freqMod: Math.pow(ratio, 2.5),
        ampMod: Math.pow(ratio, 2.2)
      };
    })
  },
  
  // 25. Courbe avec trois pics équidistants
  {
    id: 25,
    name: "Triple Pic",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 250, 50, 200, 40, (i, points) => {
      const ratio = i / points;
      // Trois pics à 25%, 50% et 75%
      const pic1 = Math.exp(-25 * Math.pow(ratio - 0.25, 2));
      const pic2 = Math.exp(-25 * Math.pow(ratio - 0.5, 2));
      const pic3 = Math.exp(-25 * Math.pow(ratio - 0.75, 2));
      return {
        freqMod: 0.3 + 0.7 * Math.max(pic1, pic2, pic3),
        ampMod: 0.2 + 0.8 * Math.max(pic1, pic2, pic3)
      };
    })
  },
  
  // 26. Courbe avec modulation variable (accélère puis ralentit)
  {
    id: 26,
    name: "Modulation Variable",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'très complexe'
    },
    data: generateCurveData(144, 200, 45, 150, 35, (i, points) => {
      const ratio = i / points;
      // Fréquence de modulation qui varie
      const modFreq = 20 - 15 * Math.abs(ratio - 0.5);
      return {
        freqMod: 0.5 + 0.3 * Math.sin(i / modFreq),
        ampMod: 0.5 + 0.3 * Math.cos(i / (modFreq * 1.3))
      };
    })
  },
  
  // 27. Courbe pulsante avec enveloppe croissante
  {
    id: 27,
    name: "Pulsation Croissante",
    characteristics: {
      soundTrend: 'montant',
      intensityTrend: 'croissante',
      duration: 'longue',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 180, 30, 250, 60, (i, points) => {
      const ratio = i / points;
      // Enveloppe croissante avec pulsations
      const envelope = 0.3 + ratio * 0.7;
      const pulse = Math.sin(i / 4) * 0.2;
      return {
        freqMod: envelope + pulse * ratio,
        ampMod: envelope + pulse * Math.sqrt(ratio)
      };
    })
  },
  
  // 28. Courbe avec forte attaque et longue résonance
  {
    id: 28,
    name: "Attaque et Résonance",
    characteristics: {
      soundTrend: 'montant-descendant',
      intensityTrend: 'forte',
      duration: 'longue',
      complexity: 'complexe'
    },
    data: generateCurveData(144, 300, 75, 250, 45, (i, points) => {
      const ratio = i / points;
      // Attaque rapide au début puis longue décroissance avec oscillations
      const attack = ratio < 0.15 ? ratio / 0.15 : 1;
      const decay = Math.exp(-3 * (ratio - 0.15));
      const resonance = ratio > 0.15 ? Math.sin(i / 6) * 0.2 * Math.exp(-2 * (ratio - 0.15)) : 0;
      return {
        freqMod: 0.3 + attack * decay * 0.7 + resonance,
        ampMod: 0.2 + attack * decay * 0.8 + resonance * 0.5
      };
    })
  },
  
  // 29. Courbe avec glissando descendant
  {
    id: 29,
    name: "Glissando Descendant",
    characteristics: {
      soundTrend: 'descendant',
      intensityTrend: 'décroissante',
      duration: 'moyenne',
      complexity: 'simple'
    },
    data: generateCurveData(144, 500, 85, 400, 35, (i, points) => {
      const ratio = i / points;
      // Descente fréquentielle progressive avec oscillations légères
      return {
        freqMod: 1 - Math.pow(ratio, 0.7) + Math.sin(i / 10) * 0.05,
        ampMod: 0.9 - ratio * 0.7 + Math.sin(i / 12) * 0.03
      };
    })
  },
  
  // 30. Courbe chaotique imprévisible
  {
    id: 30,
    name: "Chaos Imprévisible",
    characteristics: {
      soundTrend: 'fluctuant',
      intensityTrend: 'variable',
      duration: 'moyenne',
      complexity: 'très complexe'
    },
    data: generateCurveData(144, 300, 60, 250, 50, (i, points) => {
      // Utilisation de plusieurs fonctions trigonométriques avec périodes différentes
      // pour créer un motif chaotique mais déterministe
      return {
        freqMod: 0.5 + 0.2 * Math.sin(i / 4) + 0.15 * Math.sin(i / 7.3) + 0.15 * Math.sin(i / 11.9),
        ampMod: 0.5 + 0.25 * Math.cos(i / 5.2) + 0.2 * Math.cos(i / 8.7) + 0.1 * Math.cos(i / 13.5)
      };
    })
  }
];

/**
 * Sélectionne une courbe acoustique en fonction des caractéristiques de l'enregistrement
 * 
 * @param characteristics - Les caractéristiques de l'enregistrement
 * @param useFallbackSimulation - Si true, utilisera une simulation au lieu de chercher une correspondance exacte
 * @returns La courbe acoustique sélectionnée
 */
export const selectAcousticCurve = (
  characteristics: Partial<AcousticCurve['characteristics']> = {}, 
  useFallbackSimulation: boolean = false
): AcousticCurve => {
  // Si on demande explicitement une simulation ou si aucune caractéristique n'est spécifiée
  if (useFallbackSimulation || Object.keys(characteristics).length === 0) {
    // Choisir une courbe au hasard et la marquer comme simulation
    const randomCurve = { ...predefinedCurves[Math.floor(Math.random() * predefinedCurves.length)] };
    randomCurve.name = "Simulation: " + randomCurve.name;
    return randomCurve;
  }
  
  // Sinon, chercher une correspondance par rapport aux caractéristiques demandées
  let bestMatch = predefinedCurves[0];
  let bestMatchScore = 0;
  
  for (const curve of predefinedCurves) {
    let matchScore = 0;
    
    // Évaluer la correspondance pour chaque caractéristique spécifiée
    if (characteristics.soundTrend && curve.characteristics.soundTrend === characteristics.soundTrend) {
      matchScore += 3; // Priorité plus élevée pour la tendance sonore
    }
    
    if (characteristics.intensityTrend && curve.characteristics.intensityTrend === characteristics.intensityTrend) {
      matchScore += 2.5;
    }
    
    if (characteristics.duration && curve.characteristics.duration === characteristics.duration) {
      matchScore += 1;
    }
    
    if (characteristics.complexity && curve.characteristics.complexity === characteristics.complexity) {
      matchScore += 0.5;
    }
    
    // Mettre à jour la meilleure correspondance si nécessaire
    if (matchScore > bestMatchScore) {
      bestMatchScore = matchScore;
      bestMatch = curve;
    }
  }
  
  return bestMatch;
};

/**
 * Évalue les caractéristiques d'un enregistrement audio pour sélectionner la courbe appropriée
 * 
 * @param audioBuffer - Buffer audio à analyser
 * @returns Les caractéristiques détectées
 */
export const detectAudioCharacteristics = (audioBuffer: AudioBuffer): Partial<AcousticCurve['characteristics']> => {
  // Version simple de détection pour exemple
  // Dans un cas réel, cette fonction analyserait le buffer audio avec des algorithmes DSP
  
  const characteristics: Partial<AcousticCurve['characteristics']> = {};
  
  // Extraire les données pour l'analyse
  const channel = audioBuffer.getChannelData(0);
  const bufferLength = channel.length;
  
  // Si le buffer est vide ou trop court, retourner un objet vide
  if (bufferLength < 1000) {
    return characteristics;
  }
  
  // Diviser le buffer en segments pour analyser la tendance
  const segments = 5;
  const segmentSize = Math.floor(bufferLength / segments);
  const segmentEnergies: number[] = [];
  
  // Calculer l'énergie de chaque segment
  for (let i = 0; i < segments; i++) {
    let energy = 0;
    for (let j = 0; j < segmentSize; j++) {
      const idx = i * segmentSize + j;
      if (idx < bufferLength) {
        energy += channel[idx] * channel[idx];
      }
    }
    segmentEnergies.push(energy / segmentSize);
  }
  
  // Analyser la tendance sonore
  const firstEnergy = segmentEnergies[0];
  const lastEnergy = segmentEnergies[segments - 1];
  const maxEnergy = Math.max(...segmentEnergies);
  const avgEnergy = segmentEnergies.reduce((sum, e) => sum + e, 0) / segments;
  
  // Déterminer la tendance du son
  if (lastEnergy > firstEnergy * 1.5) {
    characteristics.soundTrend = 'montant';
  } else if (firstEnergy > lastEnergy * 1.5) {
    characteristics.soundTrend = 'descendant';
  } else if (maxEnergy > avgEnergy * 2.5) {
    // Si il y a un pic significatif au milieu
    characteristics.soundTrend = maxEnergy === segmentEnergies[Math.floor(segments/2)] 
      ? 'montant-descendant' 
      : 'fluctuant';
  } else {
    characteristics.soundTrend = 'stable';
  }
  
  // Déterminer l'intensité
  if (maxEnergy > 0.7) {
    characteristics.intensityTrend = 'forte';
  } else if (maxEnergy < 0.3) {
    characteristics.intensityTrend = 'faible';
  } else {
    characteristics.intensityTrend = 'moyenne';
  }
  
  // Déterminer la durée basée sur le temps total (assumant un taux d'échantillonnage standard)
  const durationInSeconds = bufferLength / audioBuffer.sampleRate;
  if (durationInSeconds < 1.5) {
    characteristics.duration = 'courte';
  } else if (durationInSeconds > 5) {
    characteristics.duration = 'longue';
  } else {
    characteristics.duration = 'moyenne';
  }
  
  // Déterminer la complexité basée sur les variations d'amplitude
  let variations = 0;
  let prevDirection = 0;
  
  for (let i = 1; i < segmentEnergies.length; i++) {
    const direction = Math.sign(segmentEnergies[i] - segmentEnergies[i-1]);
    if (direction !== 0 && direction !== prevDirection) {
      variations++;
      prevDirection = direction;
    }
  }
  
  if (variations > 3) {
    characteristics.complexity = 'très complexe';
  } else if (variations > 1) {
    characteristics.complexity = 'complexe';
  } else {
    characteristics.complexity = 'simple';
  }
  
  return characteristics;
};

// Export une fonction pour obtenir toutes les courbes disponibles (utile pour une interface utilisateur)
export const getAllAcousticCurves = () => predefinedCurves; 