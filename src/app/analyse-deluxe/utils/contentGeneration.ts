import { getRandomValue, getRandomElements } from './audioProcessing';

// Interface pour le contenu d'analyse
export interface AnalysisContent {
  parameters: { 
    name: string; 
    value: string; 
    interpretation: string;
    unit?: string;
  }[];
  translation: string;
  tips: string[];
  graphData: { 
    frequencies: number[]; 
    amplitudes: number[]; 
    timestamps: number[] 
  };
  audioFrequency?: number;
  audioAmplitude?: number;
  audioDuration?: number;
  chemicals: {
    name: string;
    percentage: number;
    effect?: string;
  }[];
  chemicalAnalysis?: {
    name: string;
    percentage: string;
    effect: string;
  }[];
  personality?: {
    title: string;
    description: string;
  };
  interpretation: string;
  funFact?: string;
  poemsText?: string;
  conclusion?: string;
  style?: string;
}

// Textes d'interprétation pour la signature acoustique
const signatureAcoustiqueInterpretations = [
  "Votre pet possède une sonorité unique qui pourrait être brevetée. Nos experts suggèrent de l'enregistrer pour la postérité.",
  "Cette signature sonore est comparable aux plus grands solos de jazz improvisés. Miles Davis aurait apprécié cette tonalité distinctive.",
  "Un timbre remarquable qui place votre flatulence dans le top 5% de notre base de données. Une véritable empreinte sonore rare.",
  "La signature acoustique de votre émission révèle un caractère bien trempé. Impossible de vous confondre dans une foule de flatuleurs.",
  "Une tonalité qui évoque les grands crus, avec des notes de fond complexes et une finale surprenante. Un véritable millésime gazeux.",
  "Cette fréquence fondamentale s'apparente à celle des baleines bleues en période de sérénade. La nature est décidément pleine de surprises.",
  "Votre signature sonore possède une qualité ASMR indéniable. Des millions d'auditeurs pourraient se détendre en l'écoutant en boucle.",
  "Une fréquence qui, selon nos experts, pourrait éloigner certains rongeurs nuisibles. Un répulsif naturel à exploiter.",
  "Cette tonalité résonne exactement à la fréquence d'oscillation des verres en cristal. Évitez les dîners de gala trop silencieux.",
  "Une signature dont la complexité rappelle les œuvres tardives de Beethoven - profonde, mystérieuse et légèrement chaotique.",
  "La richesse de cette signature acoustique suggère une alimentation variée et équilibrée. Vos intestins chantent leur bonheur.",
  "Un timbre comparable aux instruments à vent les plus rares. Les facteurs d'instruments bavarois seraient fascinés par cette sonorité.",
  "Cette empreinte acoustique unique pourrait servir de signature biométrique. Plus sécurisé qu'une empreinte digitale!",
  "Une signature sonore si distinctive qu'elle pourrait servir à l'identification vocale. Le 'petprint' est né!",
  "Cette fréquence fondamentale est si précise qu'elle pourrait servir à calibrer des instruments de musique. Un diapason naturel."
];

// Textes d'interprétation pour la résonance harmonique
const resonanceHarmoniqueInterpretations = [
  "Une résonance parfaitement équilibrée qui ferait pâlir d'envie un philharmonique. Beethoven aurait été fier.",
  "Cette harmonique évoque les grands temples tibétains, où les moines passent des années à perfectionner leurs résonances corporelles.",
  "Une résonance si parfaite qu'elle pourrait faire vibrer par sympathie les structures cristallines à proximité. Attention aux verres à pied!",
  "Les micro-oscillations de cette résonance suggèrent une maîtrise exceptionnelle de la musculature abdominale. Un véritable virtuose.",
  "Ce coefficient harmonique rivalise avec celui des instruments à vent de prestige. Stradivarius aurait sans doute étudié votre technique.",
  "La résonance obtenue illustre parfaitement le théorème de Fourrier sur les harmoniques complexes. Un cas d'étude pour nos acousticiens.",
  "Ce rapport harmonique est exactement celui que recherchent les luthiers pour leurs instruments les plus précieux. Un accord parfait.",
  "Une structure résonante digne des cathédrales gothiques, avec des harmoniques qui se répondent en cascade. L'architecture sonore incarnée.",
  "Cette résonance produit des micro-vibrations capables de stimuler la croissance des plantes d'intérieur. Un engrais sonore naturel.",
  "Un équilibre entre fondamentale et harmoniques qui suggère une excellente élasticité des tissus intestinaux. Une jeunesse physiologique enviable.",
  "Cette résonance harmonique créerait, selon nos calculs, un effet de lévitation acoustique sur des particules fines. La science de demain!",
  "Une résonance qui évoque les grands crus de Bourgogne par sa complexité et ses notes multiples. Un véritable Romanée-Conti intestinal.",
  "Le ratio entre fréquences fondamentales et harmoniques correspond exactement au nombre d'or. Une perfection mathématique rare.",
  "Cette signature harmonique possède des qualités thérapeutiques selon nos études préliminaires. Un nouveau domaine pour la médecine alternative?",
  "Une résonance qui pourrait servir à accorder les instruments d'un orchestre entier. Le chef d'orchestre de vos intestins mérite une ovation."
];

// Textes d'interprétation pour la modulation de fréquence
const modulationFrequenceInterpretations = [
  "Votre système digestif module les fréquences avec une précision digne des meilleurs studios d'enregistrement. Un véritable artiste!",
  "Cette modulation rappelle les techniques utilisées par les plus grands compositeurs électroniques. Jarre et Vangelis prendraient des notes.",
  "La variation dynamique de fréquence suggère une excellente élasticité du côlon. Un atout majeur pour la longévité intestinale.",
  "Une modulation comparable à celle des chants d'oiseaux tropicaux les plus sophistiqués. La nature s'exprime à travers vous.",
  "Cette variation fréquentielle témoigne d'un contrôle musculaire digne des meilleurs yogis. Le pranayama intestinal à son apogée.",
  "La courbe de modulation observée correspond exactement à celle des radiotélescopes captant les pulsars lointains. Cosmique!",
  "Un profil de modulation qui évoque les plus grands solos de guitare électrique. Hendrix lui-même aurait apprécié cette maîtrise du pitch.",
  "Cette variation contrôlée rappelle les techniques vocales des chanteurs de gorge mongols. Une tradition millénaire réinventée par vos intestins.",
  "La modulation précise des fréquences suggère une connexion neuronale exceptionnelle entre cerveau et système digestif. Un deuxième cerveau affûté!",
  "Ce type de variation fréquentielle est recherché par les compositeurs de musique concrète. Pierre Schaeffer vous aurait engagé comme consultant.",
  "Une modulation qui reproduit exactement la courbe des cycles lunaires. Votre système digestif est synchronisé avec les astres!",
  "Cette signature fréquentielle pourrait servir de base pour un nouveau genre musical. Le 'flatulectro' va révolutionner les clubs.",
  "La précision de cette modulation pourrait servir à calibrer des équipements médicaux de haute précision. Une référence naturelle.",
  "Un contrôle fréquentiel qui témoigne d'une conscience corporelle exceptionnelle. Les maîtres zen mettraient des années à atteindre ce niveau.",
  "Cette variation dynamique suggère une microbiote intestinale d'une diversité exceptionnelle. Un écosystème vibrant et harmonieux."
];

// Textes d'interprétation pour le temps de montée
const tempsMonteeInterpretations = [
  "La vitesse initiale de votre émission révèle une remarquable maîtrise du sphincter, comparable aux meilleurs athlètes de la discipline.",
  "Ce temps d'attaque ferait rougir les meilleurs joueurs de trompette classique. Une explosion contrôlée digne des conservatoires.",
  "Une courbe d'attaque qui suggère des années d'entraînement inconscient. Votre corps a perfectionné cet art à votre insu.",
  "Ce profil temporel est identique à celui des fusées spatiales lors du décollage. La NASA pourrait s'inspirer de cette efficacité.",
  "Un temps de montée qui optimise parfaitement le ratio énergie/discrétion. L'équilibre parfait entre expression et retenue.",
  "Cette vitesse initiale correspond exactement à celle des grands félins bondissant sur leur proie. La nature est parfaitement calibrée.",
  "Un démarrage dont la précision évoque les meilleurs chronographes suisses. La mécanique de précision à l'état naturel.",
  "Ce profil d'accélération sonore est comparable à celui des violonistes virtuoses attaquant un staccato parfait. Paganini serait jaloux.",
  "Une courbe initiale qui optimise la dispersion des particules odorantes. L'évolution a perfectionné ce mécanisme sur des millénaires.",
  "Ce temps de montée suggère une excellente santé cardiovasculaire. Le système vasculaire du côlon fonctionne avec une pression idéale.",
  "Une attaque sonore qui rappelle les percussionnistes japonais de taiko. Puissance et précision dans un équilibre parfait.",
  "Cette signature temporelle est si précise qu'elle pourrait servir à mesurer le temps en cas de panne de votre montre.",
  "Un temps de montée optimal qui minimise la friction tissulaire. Votre corps a développé un système anti-usure remarquable.",
  "Cette courbe initiale évoque le décollage des colibris, capable de passer de 0 à 100 km/h en une fraction de seconde. L'efficacité incarnée.",
  "Un profil d'attaque qui témoigne d'une synchronisation parfaite entre système nerveux et musculature involontaire. Une coordination enviable."
];

// Textes d'interprétation pour le méthane
const methaneInterpretations = [
  "Principal responsable de l'odeur caractéristique, votre taux de méthane indique une digestion particulièrement efficace des fibres.",
  "Ce niveau de méthane suggère une flore intestinale d'une richesse exceptionnelle. Votre microbiote est une forêt amazonienne interne.",
  "Votre production de CH₄ pourrait alimenter une petite flamme de cuisinière pendant plusieurs secondes. Une source d'énergie renouvelable personnelle.",
  "Ce taux de méthane est l'indicateur d'une excellente fermentation intestinale. Vous pourriez produire un kombucha interne de qualité supérieure.",
  "La concentration méthanique détectée suggère une digestion optimale des légumineuses. Votre système est une usine biochimique parfaitement calibrée.",
  "Cette signature moléculaire de CH₄ est comparable à celle des marais les plus productifs. Un écosystème interne bouillonnant d'activité.",
  "Votre taux de méthane indique une capacité exceptionnelle à extraire l'énergie des aliments récalcitrants. Un talent métabolique rare.",
  "Ce niveau de production suggère que vos bactéries intestinales travaillent en parfaite harmonie. Une société microbienne exemplaire.",
  "La concentration de méthane détectée est un indicateur fiable d'une alimentation variée et riche en nutriments complexes. Un gourmet intestinal.",
  "Ce profil méthanique pourrait servir de modèle pour les digesteurs industriels. Votre efficacité énergétique intéresse plusieurs laboratoires.",
  "Votre production de CH₄ est si pure qu'elle pourrait servir d'étalon pour calibrer des instruments d'analyse chimique.",
  "Ce taux suggère une capacité rare à décomposer les structures cellulosiques complexes. Vos bactéries sont de véritables petits bûcherons.",
  "La signature méthanique détectée évoque les meilleurs terroirs viticoles. Un 'cru' intestinal d'exception avec notes de fond complexes.",
  "Ce profil chimique est si stable qu'il pourrait servir de référence pour l'industrie pétrochimique. Une pureté enviable.",
  "Votre production méthanique témoigne d'une symbiose parfaite avec votre alimentation. Le cycle de la vie optimisé."
];

// Textes d'interprétation pour l'hydrogène
const hydrogeneInterpretations = [
  "Contribue à la légèreté et à la flottabilité de votre création gazeuse. Une vraie montgolfière intestinale!",
  "Ce taux d'hydrogène confère à votre émission une légèreté comparable aux ballons de haute altitude. Une performance aérostatique remarquable.",
  "Votre production d'H₂ témoigne d'une fermentation intestinale particulièrement dynamique. Vos bactéries sont des ouvrières infatigables.",
  "Cette concentration d'hydrogène permettrait théoriquement de faire flotter un petit objet. La lévitation intestinale n'est pas qu'un mythe.",
  "Le ratio hydrogène/méthane détecté est comparable à celui des mélanges utilisés en aérospatiale. Une propulsion naturelle de haute efficacité.",
  "Ce niveau d'H₂ suggère une capacité exceptionnelle à fermenter les sucres complexes. Votre intestin est une brasserie artisanale de précision.",
  "La proportion d'hydrogène détectée est idéale pour maintenir l'équilibre de votre écosystème intestinal. Un régulateur naturel parfait.",
  "Cette signature hydrogénique est recherchée par les laboratoires étudiant les énergies alternatives. Votre contribution à la science est précieuse.",
  "Votre taux d'H₂ est si parfaitement calibré qu'il pourrait servir de référence pour les piles à combustible de nouvelle génération.",
  "Ce profil indique une capacité rare à synthétiser l'hydrogène à partir de substrats difficiles. Une alchimie intestinale fascinante.",
  "La production d'hydrogène détectée suggère une activité enzymatique optimale. Vos catalyseurs biologiques fonctionnent à plein régime.",
  "Ce taux est comparable à celui observé chez les yogis pratiquant des régimes spécifiques. Une discipline alimentaire intuitive remarquable.",
  "Votre signature hydrogénique est si stable qu'elle pourrait servir à calibrer des chromatographes en phase gazeuse. Une référence analytique naturelle.",
  "Ce niveau d'H₂ témoigne d'une flore intestinale particulièrement diversifiée. Un véritable jardin de microorganismes en parfaite harmonie.",
  "La proportion d'hydrogène dans votre mélange gazeux est idéale pour maintenir l'élasticité des tissus intestinaux. Une fontaine de jouvence interne."
];

// Textes d'interprétation pour l'azote
const azoteInterpretations = [
  "L'azote, gaz neutre par excellence, sert de véhicule aux autres composants, comme un chauffeur de limousine pour vos émanations.",
  "Cette concentration d'azote confère à votre émission une stabilité remarquable. Le N₂ est le diplomate de votre cocktail gazeux.",
  "Votre taux d'azote joue un rôle crucial de diluant, modulant parfaitement l'intensité des autres composés. Un chef d'orchestre moléculaire.",
  "Ce niveau de N₂ est comparable à l'atmosphère des grands crus de vin lors de leur maturation. Un facteur de qualité déterminant.",
  "La proportion d'azote détectée témoigne d'une excellente oxygénation de votre système digestif. Une aération intestinale optimale.",
  "Ce taux d'azote contribue à une diffusion parfaitement équilibrée des molécules odorantes. Un vaporisateur de parfum haute précision.",
  "Votre signature azotée est comparable à celle utilisée dans la conservation des aliments fins. Un agent de préservation naturel.",
  "Ce profil de N₂ est idéal pour maintenir l'équilibre redox de votre écosystème intestinal. Un régulateur biochimique de précision.",
  "La concentration d'azote détectée correspond exactement à celle recherchée par les sommeliers pour la conservation des grands vins.",
  "Ce taux de N₂ témoigne d'une excellente absorption des protéines alimentaires. Un métabolisme azoté particulièrement efficace.",
  "Votre signature azotée suggère une flore intestinale experte en cycles biochimiques complexes. Des micro-organismes diplômés en chimie.",
  "Ce niveau d'azote contribue idéalement à la dispersion aérienne des composés volatils. Un système de diffusion atmosphérique sophistiqué.",
  "La proportion de N₂ dans votre mélange est précisément celle utilisée par les parfumeurs pour leurs créations les plus subtiles.",
  "Ce profil azoté est si stable qu'il pourrait servir de référence pour l'industrie des gaz médicaux. Une pureté clinique naturelle.",
  "Votre taux d'azote révèle une capacité exceptionnelle à maintenir l'homéostasie gazeuse. Un équilibriste moléculaire né."
];

// Textes d'interprétation pour les composés sulfurés
const composeSulfuresInterpretations = [
  "Même en quantité infime, ces molécules donnent à votre pet sa signature olfactive distinctive. Un parfum que même Chanel n'oserait pas commercialiser.",
  "Ces composés sulfurés confèrent à votre création une présence olfactive inoubliable. L'équivalent d'une signature parfumée personnelle.",
  "Votre profil sulfuré témoigne d'une consommation équilibrée de protéines riches en acides aminés soufrés. Un métabolisme sophistiqué.",
  "Cette empreinte sulfurée est comparable aux eaux thermales les plus prestigieuses. Des propriétés potentiellement thérapeutiques.",
  "Le bouquet de composés soufrés détecté évoque les grands fromages affinés. Une complexité aromatique digne des meilleures caves d'affinage.",
  "Ces molécules sulfurées créent une empreinte olfactive aussi unique qu'une empreinte digitale. Une identification chimique infaillible.",
  "Votre signature sulfurée suggère une capacité exceptionnelle à métaboliser des composés complexes. Un foie et des reins de champion.",
  "Ce profil de composés soufrés est recherché par les parfumeurs pour ses notes de fond persistantes. La base parfaite pour un parfum durable.",
  "La concentration de thiols détectée est comparable à celle des grands vins de Sauternes. Des notes subtiles qui évoquent les meilleurs millésimes.",
  "Ces composés sulfurés jouent un rôle crucial d'agent de conservation naturel. Une protection antimicrobienne évoluée.",
  "Votre empreinte sulfurée témoigne d'un métabolisme expert dans la gestion des acides aminés essentiels. Une alchimie protéique remarquable.",
  "Ce bouquet sulfuré possède des notes complexes comparables aux whiskys tourbés d'Islay. Un terroir intestinal unique au monde.",
  "La composition en thiols et mercaptans détectée est parfaitement équilibrée. Un orchestre moléculaire jouant en parfaite harmonie.",
  "Ces composés soufrés créent une barrière olfactive qui témoigne d'un système immunitaire intestinal particulièrement vigilant.",
  "Votre signature sulfurée est si distinctive qu'elle pourrait servir à authentifier votre identité. Plus fiable que la reconnaissance faciale!"
];

// Fonction pour générer le contenu d'analyse par défaut
export const generateDefaultAnalysisContent = (
  style: string = 'standard',
  intensity: string = 'moyenne',
  duration: number = 2
): AnalysisContent => {
  
  // Générer les paramètres d'analyse avec commentaires humoristiques variés
  const parameters = [
    {
      name: "Signature acoustique",
      value: `${getRandomValue(20, 50).toFixed(1)}`,
      unit: "Hz",
      interpretation: signatureAcoustiqueInterpretations[Math.floor(Math.random() * signatureAcoustiqueInterpretations.length)]
    },
    {
      name: "Résonance harmonique",
      value: `${getRandomValue(0.2, 0.9).toFixed(1)}`,
      unit: "",
      interpretation: resonanceHarmoniqueInterpretations[Math.floor(Math.random() * resonanceHarmoniqueInterpretations.length)]
    },
    {
      name: "Modulation de fréquence",
      value: `${getRandomValue(2, 8).toFixed(1)}`,
      unit: "kHz/s",
      interpretation: modulationFrequenceInterpretations[Math.floor(Math.random() * modulationFrequenceInterpretations.length)]
    },
    {
      name: "Temps de montée",
      value: `${getRandomValue(0.1, 0.5).toFixed(1)}`,
      unit: "sec",
      interpretation: tempsMonteeInterpretations[Math.floor(Math.random() * tempsMonteeInterpretations.length)]
    }
  ];
  
  // Analyse chimique fictive avec humour varié
  const chemicalAnalysis = [
    {
      name: "Méthane (CH₄)",
      percentage: `${getRandomValue(10, 40).toFixed(1)}%`,
      effect: methaneInterpretations[Math.floor(Math.random() * methaneInterpretations.length)]
    },
    {
      name: "Hydrogène (H₂)",
      percentage: `${getRandomValue(5, 20).toFixed(1)}%`,
      effect: hydrogeneInterpretations[Math.floor(Math.random() * hydrogeneInterpretations.length)]
    },
    {
      name: "Azote (N₂)",
      percentage: `${getRandomValue(20, 50).toFixed(1)}%`,
      effect: azoteInterpretations[Math.floor(Math.random() * azoteInterpretations.length)]
    },
    {
      name: "Composés sulfurés",
      percentage: `${getRandomValue(0.1, 5).toFixed(1)}%`,
      effect: composeSulfuresInterpretations[Math.floor(Math.random() * composeSulfuresInterpretations.length)]
    }
  ];

  // Convertir les données de l'analyse chimique pour le component ScientificReportSection
  const chemicals = chemicalAnalysis.map(item => ({
    name: item.name,
    percentage: parseFloat(item.percentage.replace('%', '')),
    effect: item.effect
  }));

  // Conseils personnalisés
  const tips = [
    "Pour maximiser le potentiel acoustique de vos pets, adoptez une position légèrement inclinée (15-20°) qui optimise la caisse de résonance naturelle.",
    "Évitez les surfaces en cuir ou en vinyle pendant l'émission: elles créent une amplification parfois embarrassante en milieu social.",
    "Votre alimentation riche en protéines contribue à la richesse aromatique de vos flatulences. Pour des concerts plus discrets, réduisez légèrement votre consommation de légumineuses.",
    "La pratique régulière d'exercices de contraction du plancher pelvien peut vous donner un contrôle plus précis sur le timing et l'amplitude de vos performances."
  ];

  // Analyse de la personnalité basée sur le pet
  const personalities = [
    {
      title: "L'Innovateur Intestinal",
      description: "Vous êtes créatif jusque dans vos flatulences! Votre approche non-conventionnelle de la digestion révèle une personnalité qui refuse les contraintes et pense littéralement outside the box."
    },
    {
      title: "Le Stratège Sphinctérien",
      description: "Votre contrôle remarquable montre une personnalité méthodique et calculatrice. Vous savez exactement quand retenir et quand libérer, tant dans votre vie sociale que digestive."
    },
    {
      title: "L'Aventurier Gazeux",
      description: "Votre pet audacieux révèle une personnalité qui n'a pas peur de prendre des risques. Vous êtes prêt à explorer des territoires sonores où peu osent s'aventurer."
    },
    {
      title: "Le Diplomate Digestif",
      description: "La discrétion et la subtilité de vos émissions révèlent une personne considérée qui pense aux autres même dans les moments les plus intimes."
    }
  ];

  const selectedPersonality = personalities[Math.floor(Math.random() * personalities.length)];

  // Interprétation globale
  const interpretation = "Votre flatulence révèle une personnalité complexe et nuancée. Les harmoniques de basse fréquence suggèrent une confiance en soi remarquable, tandis que les notes plus aigües trahissent une sensibilité artistique insoupçonnée. Le rythme de l'émission indique une approche méthodique de la vie, avec des moments d'improvisation qui enrichissent votre quotidien.";

  return {
    parameters,
    translation: "La traduction précise de votre pet sera générée par notre système d'analyse avancé, qui interprète les subtilités acoustiques et chimiques pour révéler ce que votre corps essaie vraiment de communiquer.",
    tips,
    graphData: {
      frequencies: Array.from({ length: 100 }, () => getRandomValue(100, 800)),
      amplitudes: Array.from({ length: 100 }, () => getRandomValue(0, 100)),
      timestamps: Array.from({ length: 100 }, (_, i) => i * (duration / 100))
    },
    audioFrequency: getRandomValue(180, 500),
    audioAmplitude: getRandomValue(60, 90),
    audioDuration: duration,
    chemicalAnalysis,
    chemicals,
    personality: selectedPersonality,
    interpretation,
    funFact: "Saviez-vous que la vitesse moyenne d'émission d'un pet est de 10 km/h? Votre performance de " + 
      `${getRandomValue(8, 25).toFixed(1)} km/h se place donc ${Math.random() > 0.5 ? "au-dessus" : "légèrement en dessous"} de la moyenne mondiale.`
  };
}; 