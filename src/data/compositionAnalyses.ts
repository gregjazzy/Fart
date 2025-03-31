// Variations pour les analyses de composition (50 variations)
export const compositionAnalyses = [
  (params: any) => `Analyse de la composition gazeuse: Votre flatulence contient une combinaison fascinante de gaz! Avec ${params.methane}% de méthane, c'est un échantillon particulièrement riche, témoignant d'une flore intestinale active et diversifiée. Le taux d'hydrogène à ${params.hydrogene}% suggère une fermentation efficace des fibres alimentaires.`,
  
  (params: any) => `Composition chimique remarquable: Ce pet présente un profil gazeux intéressant avec ${params.methane}% de méthane dominant la composition. Cette proportion élevée indique une digestion optimale des glucides complexes. Les ${params.h2s}% de sulfure d'hydrogène ajoutent cette signature olfactive si caractéristique.`,
  
  (params: any) => `Bilan gazeux détaillé: L'analyse spectroscopique révèle une teneur en méthane de ${params.methane}%, typique d'un microbiote intestinal en excellente santé. Le ratio méthane/hydrogène (${params.methane}/${params.hydrogene}) se situe dans la fourchette idéale pour un pet de style "${params.style}".`,
  
  (params: any) => `Portrait biochimique: Cette émission présente une composition élaborée avec ${params.methane}% de CH₄, suggérant une fermentation méthanogénique efficace. La présence de ${params.h2s}% d'H₂S explique les notes aromatiques distinctives, tandis que les ${params.co2}% de CO₂ contribuent à la pression interne optimale.`,
  
  (params: any) => `Analyse moléculaire: Composition exceptionnelle présentant ${params.methane}% de méthane, probablement due à une consommation récente de fibres végétales. La proportion de ${params.hydrogene}% d'hydrogène témoigne d'une activité bactérienne particulièrement dynamique dans le côlon.`,
  
  (params: any) => `Profil gazeux complet: Avec ${params.methane}% de méthane et ${params.hydrogene}% d'hydrogène, cette émission révèle une excellente capacité de fermentation des polysaccharides. Les composés soufrés à ${params.h2s}% ajoutent une dimension olfactive caractéristique d'une alimentation variée.`,
  
  (params: any) => `Décomposition chimique: Cette flatulence se distingue par sa teneur élevée en méthane (${params.methane}%), indiquant une digestion complète des fibres. Le rapport azote/dioxyde de carbone suggère un écosystème intestinal particulièrement riche en bactéries méthanogènes.`,
  
  (params: any) => `Signature moléculaire: Un remarquable équilibre entre méthane (${params.methane}%) et hydrogène (${params.hydrogene}%) caractérise ce spécimen. La concentration de ${params.h2s}% en composés soufrés témoigne d'une consommation récente d'aliments riches en protéines.`,
  
  (params: any) => `Empreinte biochimique: Cet échantillon présente ${params.methane}% de méthane, signature d'une flore méthanogène abondante. Les ${params.h2s}% de composés soufrés traduisent une présence notable de bactéries sulfato-réductrices, typiques d'un régime omnivore équilibré.`,
  
  (params: any) => `Analyse chromatographique: La composition révèle ${params.methane}% de méthane et ${params.hydrogene}% d'hydrogène, ratio optimal pour un pet de style "${params.style}". Les traces d'indole et de scatole contribuent aux notes aromatiques complexes.`,
  
  (params: any) => `Spectre gazeux détaillé: Avec ${params.methane}% de méthane biogénique, cette émission témoigne d'une digestion anaérobie parfaitement équilibrée. La présence de ${params.co2}% de CO₂ indique une activité fermentaire intense dans les segments distaux du côlon.`,
  
  (params: any) => `Relevé biogéochimique: Cette flatulence contient ${params.methane}% de méthane, ${params.hydrogene}% d'hydrogène et ${params.h2s}% de composés soufrés, formant une symphonie moléculaire caractéristique d'un microbiome diversifié et robuste.`,
  
  (params: any) => `Cartographie gazeuse: L'échantillon analysé contient principalement du méthane (${params.methane}%) et de l'hydrogène (${params.hydrogene}%), avec des traces de gaz nobles qui suggèrent une respiration particulièrement profonde avant l'émission.`,
  
  (params: any) => `Profil biogénique: Cette flatulence de style "${params.style}" présente une composition riche en méthane (${params.methane}%) typique d'un processus de fermentation optimisé. Les métabolites secondaires détectés suggèrent une consommation récente de légumineuses.`,
  
  (params: any) => `Analyse de composition: Un ratio méthane/hydrogène de ${params.methane}/${params.hydrogene} place cette émission dans le percentile supérieur des échantillons étudiés. Les composés aromatiques à l'état de traces révèlent une digestion équilibrée des fibres alimentaires.`,
  
  (params: any) => `Signature chimique: Avec ${params.methane}% de méthane biogénique, cette flatulence reflète l'efficacité remarquable des archées méthanogènes de votre microbiote. Les concentrations en hydrogène sulfuré (${params.h2s}%) ajoutent une dimension olfactive caractéristique.`,
  
  (params: any) => `Tableau périodique flatulent: Cette émission contient principalement du méthane (${params.methane}%) et du dioxyde de carbone (${params.co2}%), témoignant d'une fermentation intestinale efficace. Les proportions correspondent parfaitement au style "${params.style}" recherché.`,
  
  (params: any) => `Bilan chimique: Cet échantillon présente un profil riche en méthane (${params.methane}%) et relativement pauvre en composés soufrés (${params.h2s}%), indiquant un microbiote intestinal particulièrement efficient dans la dégradation des glucides complexes.`,
  
  (params: any) => `Profil métabolique: La composition, dominée par ${params.methane}% de méthane, reflète l'activité intense des bactéries anaérobies strictes. La faible concentration d'ammoniac suggère une digestion protéique optimale avec peu de putréfaction.`,
  
  (params: any) => `Empreinte moléculaire: Cette flatulence de type "${params.style}" présente une concentration de ${params.methane}% de méthane et ${params.h2s}% de composés soufrés, révélant un équilibre parfait entre fermentation et dégradation protéique.`,
  
  (params: any) => `Analyse qualitative: Cet échantillon se distingue par sa richesse en méthane (${params.methane}%) et sa teneur modérée en composés soufrés (${params.h2s}%), créant un bouquet aromatique complexe typique du style "${params.style}".`,
  
  (params: any) => `Décomposition isotopique: L'analyse révèle une signature isotopique du carbone caractéristique d'une production de méthane (${params.methane}%) par voie acétoclastique, témoignant d'un microbiote intestinal parfaitement adapté.`,
  
  (params: any) => `Profil gazométrique: Cette émission contient ${params.methane}% de méthane et ${params.hydrogene}% d'hydrogène, un ratio qui la place dans le percentile supérieur des flatulences de style "${params.style}" répertoriées.`,
  
  (params: any) => `Analyse par spectrométrie de masse: La composition révèle ${params.methane}% de méthane, avec des traces d'esters et de composés aromatiques qui enrichissent le profil olfactif. Les ${params.h2s}% de composés soufrés ajoutent une signature distinctive.`,
  
  (params: any) => `Caractérisation biochimique: Cet échantillon présente un équilibre remarquable entre méthane (${params.methane}%) et hydrogène (${params.hydrogene}%), témoignant d'une activité métabolique intestinale particulièrement efficiente.`,
  
  (params: any) => `Bilan fermentaire: La prédominance du méthane (${params.methane}%) indique une excellente capacité de vos bactéries intestinales à convertir l'hydrogène, optimisant ainsi la récupération d'énergie lors de la digestion des fibres.`,
  
  (params: any) => `Étude gaschromatographique: Cette flatulence se distingue par un profil riche en méthane (${params.methane}%) et pauvre en sulfures (${params.h2s}%), suggérant un régime alimentaire équilibré avec une consommation modérée de protéines animales.`,
  
  (params: any) => `Empreinte organique volatile: La composition de cet échantillon, avec ${params.methane}% de méthane et des traces de composés aromatiques, témoigne d'un microbiome diversifié et d'une excellente santé digestive globale.`,
  
  (params: any) => `Analyse des métabolites gazeux: Cette émission contient principalement du méthane (${params.methane}%) et de l'hydrogène (${params.hydrogene}%), reflet d'une fermentation colique particulièrement efficace des polysaccharides alimentaires.`,
  
  (params: any) => `Profil fermentatif: Avec ${params.methane}% de méthane biogénique, cette flatulence témoigne de l'activité intense des archées méthanogènes de votre microbiote. Les notes aromatiques secondaires suggèrent une alimentation diversifiée.`,
  
  (params: any) => `Caractérisation des volatils: Cet échantillon présente un profil dominé par le méthane (${params.methane}%) et enrichi de composés soufrés (${params.h2s}%), créant une signature chimique complexe propre au style "${params.style}".`,
  
  (params: any) => `Bilan des gaz fermentaires: Cette flatulence, avec ${params.methane}% de méthane et ${params.h2s}% de composés soufrés, reflète un équilibre optimal entre les différentes voies métaboliques microbiennes intestinales.`,
  
  (params: any) => `Signature métabolomique: L'analyse révèle une prédominance de méthane (${params.methane}%) et une concentration modérée de composés soufrés (${params.h2s}%), typiques d'un microbiote intestinal mature et diversifié.`,
  
  (params: any) => `Profil biochimique détaillé: Cet échantillon présente une teneur élevée en méthane (${params.methane}%), indiquant une excellente capacité à convertir l'hydrogène intestinal et à réduire les ballonnements post-prandiaux.`,
  
  (params: any) => `Analyse des biomarqueurs gazeux: La composition, avec ${params.methane}% de méthane et des traces de composés indoliques, suggère un équilibre parfait entre fermentation des fibres et métabolisme protéique.`,
  
  (params: any) => `Bilan métabolique intestinal: Cette émission, caractérisée par ${params.methane}% de méthane et ${params.hydrogene}% d'hydrogène, reflète l'activité complémentaire de différentes populations microbiennes de votre côlon.`,
  
  (params: any) => `Analyse des volatils organiques: L'échantillon contient principalement du méthane (${params.methane}%) et du dioxyde de carbone (${params.co2}%), avec un profil aromatique enrichi par des traces de composés phénoliques fermentaires.`,
  
  (params: any) => `Caractérisation par GC-MS: Cette flatulence présente un profil dominé par le méthane (${params.methane}%) et l'hydrogène (${params.hydrogene}%), avec une empreinte moléculaire caractéristique d'une alimentation riche en fibres fermentescibles.`,
  
  (params: any) => `Bilan de la fermentation colique: Cet échantillon, avec ${params.methane}% de méthane et ${params.h2s}% de composés soufrés, témoigne d'une excellente capacité de fermentation des sucres complexes par votre microbiome.`,
  
  (params: any) => `Profil gazeux analytique: Cette émission se distingue par sa teneur élevée en méthane (${params.methane}%) et sa faible concentration en ammoniac, suggérant une fermentation optimale des glucides avec peu de putréfaction protéique.`,
  
  (params: any) => `Caractérisation des métabolites volatils: L'analyse révèle un profil dominé par le méthane (${params.methane}%) et enrichi de traces d'esters, créant une signature olfactive complexe et nuancée typique du style "${params.style}".`,
  
  (params: any) => `Bilan des composés organiques volatils: Cette flatulence contient principalement du méthane (${params.methane}%) et de l'hydrogène (${params.hydrogene}%), reflet d'une activité fermentaire intestinale particulièrement efficace.`,
  
  (params: any) => `Analyse chimique intégrée: L'échantillon présente un profil riche en méthane (${params.methane}%) et modéré en composés soufrés (${params.h2s}%), indiquant un équilibre optimal entre les différentes populations microbiennes intestinales.`,
  
  (params: any) => `Signature gazeuse détaillée: Cette émission, avec ${params.methane}% de méthane et des traces de composés aromatiques, reflète la diversité et l'efficacité métabolique remarquable de votre écosystème intestinal.`,
  
  (params: any) => `Profil métabolique intestinal: Cet échantillon se caractérise par sa teneur élevée en méthane (${params.methane}%) et modérée en hydrogène (${params.hydrogene}%), témoignant d'une conversion efficace des substrats fermentescibles.`,
  
  (params: any) => `Analyse des marqueurs fermentaires: Cette flatulence, dominée par le méthane (${params.methane}%) et le dioxyde de carbone (${params.co2}%), révèle une activité intense des bactéries saccharolytiques de votre microbiote.`,
  
  (params: any) => `Empreinte biochimique intestinale: L'échantillon présente un ratio méthane/hydrogène de ${params.methane}/${params.hydrogene}, caractéristique d'un microbiome mature avec une prédominance d'archées méthanogènes efficientes.`,
  
  (params: any) => `Bilan des produits de fermentation: Cette émission contient ${params.methane}% de méthane biogénique et ${params.h2s}% de composés soufrés, témoignant d'un équilibre parfait entre les différentes voies métaboliques microbiennes.`,
  
  (params: any) => `Analyse métabolomique gazeuse: Cet échantillon se distingue par sa richesse en méthane (${params.methane}%) et sa faible teneur en composés azotés volatils, suggérant une fermentation optimale des fibres avec peu de dégradation protéique.`,
  
  (params: any) => `Signature biochimique flatulente: Cette émission de style "${params.style}" présente un profil dominé par le méthane (${params.methane}%) et enrichi de composés aromatiques à l'état de traces, reflet d'un microbiome intestinal particulièrement diversifié.`,
  
  (params: any) => `Caractérisation des flux métaboliques: L'analyse révèle une production importante de méthane (${params.methane}%) et modérée d'hydrogène sulfuré (${params.h2s}%), témoignant d'un équilibre optimal entre les différentes communautés microbiennes intestinales.`,
  
  (params: any) => `Profil des gaz intestinaux: Cette flatulence contient principalement du méthane (${params.methane}%) et du dioxyde de carbone (${params.co2}%), composés principaux résultant d'une fermentation efficace des fibres alimentaires par votre microbiome.`
];

export default compositionAnalyses; 