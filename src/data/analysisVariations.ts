// Variations pour les analyses de composition
export const compositionAnalyses = [
  (params: any) => `Analyse de la composition gazeuse: Votre flatulence contient une combinaison fascinante de gaz! Avec ${params.methane}% de méthane, c'est un échantillon particulièrement riche, témoignant d'une flore intestinale active et diversifiée. Le taux d'hydrogène à ${params.hydrogene}% suggère une fermentation efficace des fibres alimentaires.`,
  
  (params: any) => `Composition chimique remarquable: Ce pet présente un profil gazeux intéressant avec ${params.methane}% de méthane dominant la composition. Cette proportion élevée indique une digestion optimale des glucides complexes. Les ${params.h2s}% de sulfure d'hydrogène ajoutent cette signature olfactive si caractéristique.`,
  
  (params: any) => `Bilan gazeux détaillé: L'analyse spectroscopique révèle une teneur en méthane de ${params.methane}%, typique d'un microbiote intestinal en excellente santé. Le ratio méthane/hydrogène (${params.methane}/${params.hydrogene}) se situe dans la fourchette idéale pour un pet de style "${params.style}".`,
  
  (params: any) => `Portrait biochimique: Cette émission présente une composition élaborée avec ${params.methane}% de CH₄, suggérant une fermentation méthanogénique efficace. La présence de ${params.h2s}% d'H₂S explique les notes aromatiques distinctives, tandis que les ${params.co2}% de CO₂ contribuent à la pression interne optimale.`,
  
  (params: any) => `Analyse moléculaire: Composition exceptionnelle présentant ${params.methane}% de méthane, probablement due à une consommation récente de fibres végétales. La proportion de ${params.hydrogene}% d'hydrogène témoigne d'une activité bactérienne particulièrement dynamique dans le côlon.`
];

// Variations pour les analyses environnementales
export const environmentalAnalyses = [
  (params: any) => `Impact environnemental: Cette émission gazeuse génère l'équivalent de ${params.co2}kg de CO2, soit approximativement l'empreinte carbone d'un trajet en trottinette électrique de 500 mètres. Le niveau sonore de ${params.db}dB est comparable à celui d'un chuchotement enthousiaste dans une bibliothèque.`,
  
  (params: any) => `Bilan écologique: Avec une émission de ${params.co2}kg équivalent CO2, votre flatulence a un impact environnemental modéré. Son empreinte acoustique de ${params.db}dB reste dans les normes acceptables pour un environnement social comme "${params.place}".`,
  
  (params: any) => `Étude d'impact: Cette flatulence de style "${params.style}" produit ${params.co2}kg équivalent CO2, contribuant de façon négligeable au réchauffement climatique. Sa propagation sonore de ${params.db}dB pourrait toutefois perturber temporairement la faune dans un rayon de ${params.radius}m.`,
  
  (params: any) => `Évaluation environnementale: L'analyse révèle une empreinte carbone de ${params.co2}kg, équivalente à celle d'un smartphone en veille pendant 2 heures. La signature acoustique de ${params.db}dB reste discrète, tout en assurant une présence notable dans un rayon de ${params.radius}m.`,
  
  (params: any) => `Rapport écologique: Cette émission de style "${params.style}" présente un impact carbone de ${params.co2}kg, valeur comparable à la consommation d'une ampoule LED pendant 30 minutes. La pollution sonore limitée à ${params.db}dB garantit une perturbation minimale de l'environnement immédiat.`
];

// Variations pour les analyses d'experts
export const expertAnalyses = [
  (params: any) => `Analyse experte: Votre flatulence de style "${params.style}" exécutée en ${params.place} pendant ${params.duration} présente des caractéristiques acoustiques remarquables. Les harmoniques dans les moyennes fréquences suggèrent une excellente maîtrise de la pression abdominale.`,
  
  (params: any) => `Évaluation professionnelle: Ce pet de type "${params.style}" d'une durée de ${params.duration} démontre une maîtrise technique impressionnante. L'exécution en ${params.place} révèle une compréhension intuitive de l'acoustique spatiale et une excellente coordination musculaire.`,
  
  (params: any) => `Critique spécialisée: Cette flatulence exécutée en ${params.place} pendant ${params.duration} présente un équilibre tonal caractéristique du style "${params.style}". La distribution fréquentielle et l'enveloppe dynamique témoignent d'une technique sphinctérienne avancée.`,
  
  (params: any) => `Analyse technique: Le spécimen de style "${params.style}" étudié présente une durée de ${params.duration}, optimale pour ce type d'émission. La réalisation en ${params.place} exploite parfaitement les propriétés acoustiques de cet environnement, avec un contrôle précis de la dynamique.`,
  
  (params: any) => `Évaluation pétologique: Cette performance de ${params.duration} en style "${params.style}" démontre une excellente connaissance des fondamentaux. L'exécution en ${params.place} révèle une adaptation contextuelle remarquable et une gestion efficace de la pression interne.`
];

// Variations pour les traductions de pets
export const translationVariations = [
  (style: string, place: string, words: string[]) => `Ce pet de type "${style}" émis en ${place} est caractéristique d'un ${words[0]} avec des notes subtiles de ${words[1]} et une finition ${words[2]}. Sa signature sonore révèle un caractère expressif et résolument assumé.`,
  
  (style: string, place: string, words: string[]) => `Cette flatulence "${style}" produite en ${place} s'apparente à un ${words[0]} majestueux. On y détecte des influences de ${words[1]} et une conclusion évoquant un ${words[2]} distingué.`,
  
  (style: string, place: string, words: string[]) => `L'émission de style "${style}" en ${place} peut être interprétée comme un ${words[0]} éloquent, avec un développement rappelant un ${words[1]} et une cadence finale typique d'un ${words[2]}.`,
  
  (style: string, place: string, words: string[]) => `Ce spécimen flatulent "${style}" observé en ${place} s'exprime tel un ${words[0]} passionné, dévoilant progressivement des qualités de ${words[1]} avant de conclure comme un ${words[2]} satisfait.`,
  
  (style: string, place: string, words: string[]) => `L'analyse linguistique de ce pet "${style}" en ${place} le classe comme un ${words[0]} de grande éloquence, présentant des inflexions de ${words[1]} et un final rappelant un ${words[2]} triomphant.`
];

// Variations pour les conseils sur la personnalité
export const personalityTipsVariations = [
  "Révèle une personnalité audacieuse et confiante",
  "Indique un esprit libre, réfractaire aux conventions sociales",
  "Signe d'un tempérament joueur et facétieux",
  "Témoigne d'un caractère authentique qui refuse la dissimulation",
  "Suggère une personnalité créative aux multiples facettes",
  "Reflète une âme rebelle qui défie les attentes",
  "Indique un esprit analytique qui comprend la biochimie intestinale",
  "Révèle un tempérament artistique qui s'exprime par tous les moyens",
  "Démontre une personnalité qui valorise l'honnêteté corporelle",
  "Signe d'un caractère pragmatique qui reconnaît les nécessités biologiques"
];

// Variations pour les conseils sur l'état physique
export const physicalTipsVariations = [
  "Reflète un bon système digestif en pleine activité",
  "Suggère un état détendu et sans stress",
  "Indique une alimentation riche en fibres et légumineuses",
  "Témoigne d'un microbiote intestinal florissant",
  "Révèle une excellente motilité intestinale",
  "Suggère un métabolisme efficace des glucides complexes",
  "Indique un bon équilibre de la flore bactérienne intestinale",
  "Signe d'une bonne oxygénation du système digestif",
  "Reflète un transit intestinal efficace et régulier",
  "Témoigne d'une bonne hydratation générale du corps"
];

// Variations pour les conseils pour péter malin
export const smartTipsVariations = [
  {
    title: "Timing parfait",
    description: "Choisissez le moment idéal en fonction du contexte social et des conditions acoustiques du lieu",
    icon: "⏱️"
  },
  {
    title: "Position optimale",
    description: "Adoptez une posture qui maximise la projection sonore tout en minimisant la détection par les personnes à proximité",
    icon: "🧘"
  },
  {
    title: "Contrôle respiratoire",
    description: "Maîtrisez votre respiration abdominale pour une libération contrôlée et une modulation sonore précise",
    icon: "🌬️"
  },
  {
    title: "Diversion tactique",
    description: "Créez une distraction au moment opportun pour masquer le son ou détourner l'attention des personnes présentes",
    icon: "🎭"
  },
  {
    title: "Acoustique environnementale",
    description: "Exploitez les propriétés acoustiques de l'environnement pour optimiser ou atténuer la résonance selon votre objectif",
    icon: "🔊"
  },
  {
    title: "Alimentation stratégique",
    description: "Consommez certains aliments pour moduler la composition chimique et les propriétés sonores de vos flatulences",
    icon: "🥦"
  },
  {
    title: "Camouflage olfactif",
    description: "Préparez votre environnement avec des contremesures aromatiques pour neutraliser les effets odorants indésirables",
    icon: "🌸"
  },
  {
    title: "Gestion du stress",
    description: "Maintenez un état détendu pour éviter les contractions musculaires involontaires qui peuvent compromettre le contrôle",
    icon: "😌"
  },
  {
    title: "Analyse du public",
    description: "Évaluez votre audience pour déterminer le moment optimal et l'approche la plus appropriée à la situation sociale",
    icon: "👥"
  },
  {
    title: "Choix vestimentaire",
    description: "Optez pour des vêtements qui favorisent l'atténuation acoustique et la diffusion discrète des émissions gazeuses",
    icon: "👖"
  }
];

// Génération de scores de qualité variés
export function generateQualityScore(style: string) {
  // Générer un score de base entre 65 et 95
  const baseScore = Math.floor(Math.random() * 30) + 65;
  
  // Générer des scores pour chaque catégorie avec une variation de ±10 points autour du score de base
  const generateCategoryScore = () => {
    const variation = Math.floor(Math.random() * 20) - 10;
    const score = Math.max(50, Math.min(100, baseScore + variation));
    return score;
  };
  
  return {
    total: baseScore,
    details: [
      { category: "Technique", score: generateCategoryScore() },
      { category: "Timing", score: generateCategoryScore() },
      { category: "Impact", score: generateCategoryScore() },
      { category: "Style", score: generateCategoryScore() }
    ]
  };
}

// Fonction utilitaire pour obtenir une analyse aléatoire sans répéter les mêmes
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