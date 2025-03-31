"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "../../auth/AuthProvider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Définition des articles avec leur contenu
const articles = {
  climate: {
    title: "Flatulences et Réchauffement Climatique : Une Étude Surprenante",
    date: "12 janvier 2024",
    author: "Pr. Jean-Michel Gazeux",
    isPremium: false,
    content: `<h3>Un impact insoupçonné sur notre planète</h3>
    <p>Selon une récente étude menée par l'Institut International de Pétologie, les flatulences humaines contribueraient à hauteur de 0,014% aux émissions mondiales de méthane. Si ce chiffre peut sembler dérisoire, il représente néanmoins l'équivalent des émissions annuelles d'une ville de taille moyenne !</p>
    <h3>Des différences significatives selon l'alimentation</h3>
    <p>L'étude révèle également que les personnes suivant un régime riche en légumineuses produisent en moyenne <strong>3 fois plus</strong> de méthane que les autres. "C'est comme si chaque amateur de cassoulet possédait sa propre micro-vache en termes d'impact climatique", explique le Dr. Flatula, principal auteur de l'étude.</p>
    <h3>Des solutions à l'horizon</h3>
    <p>Les chercheurs explorent actuellement plusieurs pistes pour réduire cette empreinte carbone insoupçonnée :</p>
    <ul>
      <li>Des filtres à charbon nouvelle génération intégrés aux sous-vêtements</li>
      <li>Des probiotiques spécialisés modifiant la flore intestinale</li>
      <li>Un régime "bas-méthane" qui pourrait être promu lors des prochaines COP</li>
    </ul>
    <p>Alors, la prochaine fois que vous êtes sur le point de libérer une flatulence, pensez à notre planète... ou investissez dans un bon filtre à charbon !</p>`
  },
  contest: {
    title: "Le Concours International du Pet le Plus Long : Les Résultats Qui Décoiffent !",
    date: "5 février 2024",
    author: "Sophie Decibel",
    isPremium: true,
    content: `
      <p>Attention pétomanes du monde entier ! Le prestigieux concours annuel du pet le plus long ouvre officiellement ses inscriptions.</p>
      
      <h3>Un événement qui se fait attendre</h3>
      <p>Pour sa 7ème édition, ce concours international promet d'être encore plus retentissant que les années précédentes. Le tenant du titre, Jean-Michel Bruit du Toulousain, avait établi l'an dernier un record impressionnant de 16,7 secondes ininterrompues.</p>
      
      <h3>Modalités de participation</h3>
      <p>Les candidats devront soumettre une vidéo (avec son) de leur performance. Un jury composé d'experts en acoustique et en physiologie analysera minutieusement chaque candidature selon les critères suivants :</p>
      <ul>
        <li>Durée totale du pet (facteur principal)</li>
        <li>Régularité du son (les fluctuations sont pénalisées)</li>
        <li>Volume sonore (un bonus pour l'audibilité à distance)</li>
        <li>Originalité de la tonalité (les variations mélodieuses sont appréciées)</li>
      </ul>
      
      <h3>Préparation recommandée</h3>
      <p>Les experts conseillent un régime riche en fibres dans les jours précédant la tentative : légumineuses, choux, oignons et boissons gazeuses sont vos alliés !</p>
      
      <p>Les inscriptions se clôturent le 30 avril. La grande finale sera retransmise en direct sur notre chaîne YouTube pour le plus grand plaisir des amateurs d'art sonore corporel.</p>
      
      <p>Que le meilleur pétomane gagne !</p>
    `,
  },
  diet: {
    title: "Comment Modifier Votre Alimentation Pour Des Flatulences Discrètes",
    date: "18 janvier 2024",
    author: "Diététicienne Camille Ventoux",
    isPremium: false,
    content: `
      <p>Vous en avez assez de ces moments gênants où votre corps vous trahit par un bruit intempestif ? Découvrez comment maîtriser l'art du pet silencieux grâce à mon régime révolutionnaire !</p>
      
      <h3>La science derrière les flatulences sonores</h3>
      <p>Avant toute chose, comprenons pourquoi certains pets sont plus bruyants que d'autres. Le son provient principalement de la vibration des tissus du sphincter au passage du gaz sous pression. Plus la pression est forte et le passage étroit, plus le bruit sera prononcé. De plus, la composition du gaz influence également sa sonorité.</p>
      
      <h3>Les aliments à éviter absolument</h3>
      <p>Certains aliments sont de véritables orchestres symphoniques pour votre système digestif :</p>
      <ul>
        <li>Les légumineuses (haricots, lentilles, pois chiches) - champions toutes catégories</li>
        <li>La famille des choux (brocoli, chou-fleur, chou de Bruxelles)</li>
        <li>Les oignons et l'ail (particulièrement crus)</li>
        <li>Les boissons gazeuses et la bière</li>
        <li>Les aliments riches en fructose (certains fruits et le sirop de maïs)</li>
      </ul>
      
      <h3>Mon régime "Silence Intestinal" en 3 phases</h3>
      <p>Après des années d'expérimentation personnelle et des centaines de témoignages, j'ai développé cette méthode infaillible :</p>
      
      <p><strong>Phase 1 (jours 1-3) : Détoxification</strong><br>
      Éliminez complètement les aliments problématiques mentionnés ci-dessus. Privilégiez le riz blanc, les bananes mûres, les yaourts nature, le pain blanc et les protéines maigres comme le poulet et le poisson.</p>
      
      <p><strong>Phase 2 (jours 4-10) : Réintroduction contrôlée</strong><br>
      Ajoutez progressivement des fibres solubles (avoine, patates douces) qui fermentent plus lentement et produisent moins de gaz. Introduisez des probiotiques de qualité pour équilibrer votre flore intestinale.</p>
      
      <p><strong>Phase 3 (maintenance) : Équilibre durable</strong><br>
      Créez votre régime personnalisé en fonction de vos tolérances individuelles, que vous aurez identifiées lors des phases précédentes. N'oubliez pas de bien mâcher et de manger lentement !</p>
      
      <p>Les résultats sont spectaculaires : 87% de mes clients rapportent une réduction significative du volume sonore de leurs flatulences en moins de deux semaines !</p>
      
      <p>Bien entendu, n'oubliez pas que l'élimination des gaz est un processus naturel et nécessaire. L'objectif n'est pas de l'empêcher, mais de le rendre socialement plus discret. Votre système digestif vous remerciera de ne pas retenir ces gaz, qui doivent être évacués pour votre bien-être.</p>
      
      <p>Pour des conseils personnalisés, n'hésitez pas à consulter mon programme complet de coaching "Péter en silence comme un ninja" !</p>
    `,
  },
  history: {
    title: "Histoire des Flatulences : De l'Antiquité à Nos Jours",
    date: "22 décembre 2023",
    author: "Historien Gabriel Bruit",
    isPremium: false,
    content: `
      <p>Aussi surprenant que cela puisse paraître, les flatulences ont joué un rôle significatif dans l'histoire de l'humanité, oscillant entre tabou, art et science selon les époques et les cultures.</p>
      
      <h3>L'Antiquité : quand péter était un honneur</h3>
      <p>Dans l'Égypte ancienne, les flatulences étaient associées au dieu du vent Shu et considérées comme une manifestation divine. Les papyrus médicaux de l'époque décrivent même des remèdes pour favoriser l'émission de gaz afin de plaire aux dieux !</p>
      
      <p>En Grèce et à Rome, la situation était plus nuancée. Hippocrate lui-même écrivait que "passer des vents est nécessaire à la santé", tandis que l'empereur Claude promulguait un édit autorisant les pets durant les banquets pour éviter les "accidents corporels plus graves" liés à la rétention.</p>
      
      <h3>Le Moyen Âge et la Renaissance : l'âge d'or des flatulences</h3>
      <p>Contrairement aux idées reçues, la période médiévale était relativement tolérante envers les pets. Dans les tavernes et les fêtes populaires, les concours de pets n'étaient pas rares. Les troubadours incluaient parfois des blagues flatulentes dans leurs récits pour divertir la noblesse.</p>
      
      <p>L'apogée de cet art survint à la cour de Louis XIV, où péter était paradoxalement à la fois interdit en public mais apprécié dans l'intimité comme signe de bonne digestion et donc de richesse alimentaire. Des chroniques rapportent que certains courtisans développaient des techniques pour émettre des flatulences musicales, créant une forme primitive de "pétomanie artistique".</p>
      
      <h3>L'ère victorienne : la grande répression</h3>
      <p>C'est véritablement au XIXe siècle que les flatulences devinrent un sujet totalement tabou dans la bonne société occidentale. L'étiquette victorienne imposait un contrôle absolu des fonctions corporelles. Des manuels entiers étaient consacrés à l'art de réprimer ou masquer ces manifestations jugées vulgaires.</p>
      
      <p>Ironiquement, c'est également à cette époque que Joseph Pujol, dit "Le Pétomane", connut un succès phénoménal au Moulin Rouge avec ses spectacles de flatulences contrôlées, capable de reproduire des mélodies et d'éteindre des bougies à distance !</p>
      
      <h3>L'époque moderne : entre tabou et libération</h3>
      <p>Au XXe siècle, les flatulences sont devenues un sujet d'étude scientifique sérieux, notamment en gastroentérologie. Parallèlement, la culture populaire (films, bandes dessinées, émissions comiques) a réintroduit progressivement l'humour flatulent dans l'espace public.</p>
      
      <p>Aujourd'hui, nous vivons une époque paradoxale où les flatulences restent socialement réprouvées mais sont omniprésentes dans la culture populaire et les réseaux sociaux. Des applications de simulation de pets comptent des millions de téléchargements, tandis que les dîners mondains exigent toujours la plus grande discrétion.</p>
      
      <p>Cette histoire fascinante nous rappelle que les attitudes culturelles envers les fonctions corporelles naturelles sont en constante évolution. Qui sait ce que l'avenir nous réserve dans ce domaine ? Peut-être un retour de l'art pétomane dans les salles de spectacle les plus prestigieuses ?</p>
    `,
  },
  app: {
    title: "Notre Application FARRT : Une Révolution Pour Vos Flatulences",
    date: "30 janvier 2024",
    author: "L'équipe de développement FARRT",
    isPremium: true,
    content: `
      <p>Après deux ans de développement intensif, je suis fier d'annoncer le lancement de la phase bêta de "PetScan", la première application mobile capable d'analyser et de classifier vos flatulences avec une précision scientifique !</p>
      
      <h3>De l'idée à la réalité</h3>
      <p>Tout a commencé lors d'un dîner entre amis. Une discussion animée sur la capacité à reconnaître "l'auteur" d'un pet dans une pièce m'a fait réaliser une chose : chaque flatulence possède une signature acoustique unique, comme une empreinte digitale sonore. En tant qu'ingénieur en intelligence artificielle spécialisé dans le traitement du signal, j'ai immédiatement entrevu le potentiel technologique.</p>
      
      <h3>Comment fonctionne PetScan ?</h3>
      <p>L'application utilise une combinaison de technologies de pointe :</p>
      <ul>
        <li>Analyse spectrale avancée du son pour identifier les fréquences caractéristiques</li>
        <li>Algorithmes de machine learning entraînés sur plus de 10 000 échantillons sonores (merci à tous les volontaires anonymes !)</li>
        <li>Système de classification en temps réel capable d'identifier 5 types principaux de pets : sec, humide, prolongé, explosif et le redoutable "siffleur"</li>
        <li>Modèle prédictif pour estimer la composition chimique probable des gaz (avec une marge d'erreur de seulement 12%)</li>
      </ul>
      
      <h3>Résultats préliminaires impressionnants</h3>
      <p>Les tests internes montrent des performances remarquables :</p>
      <ul>
        <li>98,2% de précision pour les pets de type "prouut" et "paf"</li>
        <li>94,7% pour les "fsss" discrets</li>
        <li>91,3% pour les pets complexes à multiples phases sonores</li>
        <li>89,5% de précision dans l'identification de l'individu dans un groupe de 5 personnes enregistrées</li>
      </ul>
      
      <h3>Applications concrètes</h3>
      <p>Au-delà de l'aspect ludique évident, PetScan offre plusieurs utilisations pratiques :</p>
      <ul>
        <li>Suivi de santé digestive par l'analyse des tendances sur le temps</li>
        <li>Conseils nutritionnels personnalisés basés sur les signatures acoustiques détectées</li>
        <li>Mode "Détective" pour identifier l'origine d'un pet dans une pièce (idéal pour les colocations)</li>
        <li>Fonction "Alibi" générant automatiquement des excuses crédibles en cas de flatulence en public</li>
      </ul>
      
      <h3>Rejoignez notre programme bêta</h3>
      <p>Nous recherchons 500 bêta-testeurs motivés pour la phase finale de développement. En échange de votre participation et des données collectées (anonymisées, bien sûr), vous recevrez :</p>
      <ul>
        <li>Un accès gratuit à vie à la version premium de l'application</li>
        <li>Un t-shirt exclusif "J'ai contribué à la science des pets"</li>
        <li>La possibilité de nommer une des signatures acoustiques de notre base de données</li>
      </ul>
      
      <p>Les candidatures sont ouvertes jusqu'au 15 avril. N'attendez plus pour participer à cette révolution technologique qui changera à jamais notre rapport aux flatulences !</p>
      
      <p>P.S. : Nous travaillons déjà sur la version 2.0 qui intégrera un capteur d'odeur à connecter à votre smartphone. L'avenir est en marche !</p>
    `,
  },
  survey: {
    title: "Enquête sur les préférences de pets selon les pays",
    date: "22 mars 2024",
    author: "Équipe de Recherche Internationale",
    content: `
      <p>Une étude interculturelle révolutionnaire vient d'être publiée sur les préférences en matière de flatulences à travers le monde.</p>
      
      <h3>Méthodologie inédite</h3>
      <p>Cette enquête, menée auprès de 5000 participants dans 28 pays, est la première du genre à explorer les attitudes culturelles envers les pets. Les participants ont répondu à des questions sur leurs préférences, tabous et habitudes liées aux flatulences.</p>
      
      <h3>Résultats surprenants</h3>
      <p>Les découvertes sont fascinantes :</p>
      <ul>
        <li><strong>France</strong> : Préférence pour les pets discrets mais aromatiques, souvent comparés à des fromages affinés.</li>
        <li><strong>Japon</strong> : Culture du pet silencieux absolument impératif en public, mais tolérance dans le cadre familial.</li>
        <li><strong>Brésil</strong> : Appréciation des pets rythmiques, parfois incorporés dans les danses traditionnelles.</li>
        <li><strong>Scandinavie</strong> : Vision pragmatique du pet comme phénomène naturel, sans tabou particulier.</li>
        <li><strong>Inde</strong> : Distinction claire entre les pets acceptables selon le contexte social et la hiérarchie.</li>
      </ul>
      
      <h3>Applications pratiques</h3>
      <p>Ces données seront utilisées pour développer des guides de voyage culturels et des applications mobiles de traduction de flatulences, aidant les voyageurs à éviter les faux pas culturels lors de leurs déplacements internationaux.</p>
      
      <p>L'étude complète peut être consultée dans le Journal International de Gastroentérologie Sociale.</p>
    `,
  },
  dogs: {
    title: "Mon chien a l'air dégoûté quand je pète, est-ce normal ?",
    date: "20 mars 2024",
    author: "Dr. Wouf, vétérinaire comportementaliste",
    content: `
      <p>Une question qui préoccupe de nombreux propriétaires d'animaux : pourquoi nos compagnons canins semblent-ils si offensés par nos flatulences ?</p>
      
      <h3>Une sensibilité olfactive exceptionnelle</h3>
      <p>Il faut d'abord comprendre que l'odorat d'un chien est environ 10 000 à 100 000 fois plus sensible que celui d'un humain. Ce qui nous semble être une odeur modérément désagréable est pour eux une explosion sensorielle d'une intensité difficile à imaginer.</p>
      
      <h3>Le langage corporel canin</h3>
      <p>Les signes typiques de dégoût chez le chien incluent :</p>
      <ul>
        <li>Recul brusque ou fuite de la pièce</li>
        <li>Plissement du museau</li>
        <li>Éternuements répétés</li>
        <li>Regard accusateur (oui, ils savent que c'est vous !)</li>
      </ul>
      
      <h3>Aspect relationnel</h3>
      <p>Curieusement, les chiens sont généralement plus tolérants envers leurs propres flatulences qu'envers les nôtres. Cela pourrait s'expliquer par la notion de territoire olfactif - votre pet est perçu comme une intrusion dans leur espace sensoriel.</p>
      
      <p>Certains chiens développent même des comportements d'évitement anticipatoire, quittant la pièce dès qu'ils détectent les signes avant-coureurs d'une flatulence imminente chez leur maître.</p>
      
      <p>Alors oui, c'est parfaitement normal que votre chien soit dégoûté. Considérez cela comme un témoignage de l'honnêteté brutale de nos amis à quatre pattes, qui ne sont pas tenus aux mêmes conventions sociales que nous !</p>
    `,
  },
  support: {
    title: "Péteurs anonymes : groupe de soutien virtuel",
    date: "18 mars 2024",
    author: "Fondateur du groupe",
    content: `
      <p>Face à la stigmatisation sociale persistante autour des flatulences, un nouveau groupe de soutien en ligne connaît un succès fulgurant.</p>
      
      <h3>Un espace sécurisé pour partager</h3>
      <p>Les "Péteurs Anonymes" offrent un forum bienveillant où les personnes souffrant d'excès de gaz peuvent échanger sans jugement. Créé il y a seulement trois mois, le groupe compte déjà plus de 15 000 membres actifs.</p>
      
      <h3>Témoignages touchants</h3>
      <p>Les histoires partagées sont aussi diverses qu'émouvantes :</p>
      <ul>
        <li>"J'ai dû quitter une réunion importante après un curry de la veille. Ce groupe m'a aidé à surmonter le traumatisme." - Antoine, 34 ans</li>
        <li>"Mes flatulences ont ruiné mon premier rendez-vous galant. Grâce aux conseils du groupe, j'ai maintenant des stratégies pour gérer ces situations." - Sophie, 27 ans</li>
        <li>"Je pensais être seul avec mon syndrome du pet matinal chronique. Ici, j'ai trouvé une communauté." - Raymond, 63 ans</li>
      </ul>
      
      <h3>Au-delà du soutien moral</h3>
      <p>Le groupe propose également des webinaires sur la nutrition, des exercices de renforcement du plancher pelvien, et des techniques de méditation pour gérer l'anxiété liée aux situations sociales à risque.</p>
      
      <p>Un psychologue intervient régulièrement pour aborder la dimension émotionnelle et l'impact sur l'estime de soi que peuvent avoir les troubles flatulents chroniques.</p>
      
      <p>Pour rejoindre ce havre de paix intestinale, il suffit de s'inscrire sur leur site avec un pseudonyme. Comme le rappelle leur slogan : "Libérez vos gaz, libérez votre esprit !"</p>
    `,
  },
  partner: {
    title: "Comment Aborder le Sujet des Flatulences avec votre Partenaire",
    date: "14 février 2024",
    author: "Conseillère Relationnelle Marine Dupont",
    isPremium: true,
    content: `
      <p>L'intimité d'un couple repose sur une communication ouverte et sincère, même sur les sujets les plus embarrassants. Cet article vous guidera à travers les différentes étapes pour aborder sereinement le sujet des flatulences avec votre partenaire.</p>
      
      <h3>Les trois phases de la relation flatulente</h3>
      <p>Selon mes 15 années d'expérience en conseil conjugal, j'ai identifié trois phases distinctes dans l'évolution du couple face aux flatulences :</p>
      
      <p><strong>Phase 1 : Le déni (0-3 mois)</strong><br>
      Durant cette période, la plupart des couples maintiennent l'illusion d'une digestion parfaite. On quitte la pièce pour évacuer discrètement, on fait couler l'eau du robinet pour couvrir les bruits potentiels, ou on prétend que "ce n'était pas moi" en cas d'accident.</p>
      
      <p><strong>Phase 2 : La transition (3-12 mois)</strong><br>
      La routine s'installe et les premiers "accidents" surviennent. C'est souvent une période de tension où l'un des partenaires peut se sentir jugé tandis que l'autre découvre une facette moins glamour de la vie à deux.</p>
      
      <p><strong>Phase 3 : L'acceptation (après 12 mois)</strong><br>
      La maturité relationnelle permet d'atteindre cette phase où les flatulences sont intégrées comme une réalité physiologique normale, parfois même source d'humour complice.</p>
      
      <h3>Stratégies de communication efficaces</h3>
      <p>Voici quelques approches qui ont fait leurs preuves auprès de mes clients :</p>
      <ul>
        <li><strong>L'humour léger</strong> : Une remarque amusante sans moquerie peut désamorcer la gêne</li>
        <li><strong>La normalisation</strong> : "C'est une fonction corporelle normale, tout le monde passe par là"</li>
        <li><strong>Les règles communes</strong> : Établir ensemble des "protocoles" acceptables pour tous les deux</li>
        <li><strong>L'approche scientifique</strong> : Partager des informations sur le processus digestif peut dédramatiser</li>
      </ul>
      
      <h3>Quand les flatulences deviennent un problème de couple</h3>
      <p>Dans certains cas, ce sujet peut révéler des dynamiques relationnelles plus profondes :</p>
      <ul>
        <li>Utilisation provocatrice des flatulences pour marquer un territoire ou exprimer une forme de pouvoir</li>
        <li>Moqueries systématiques créant un sentiment de honte chez l'autre</li>
        <li>Anxiété excessive liée à la peur du jugement</li>
      </ul>
      
      <p>Si vous reconnaissez ces schémas, une consultation avec un thérapeute de couple peut s'avérer bénéfique.</p>
      
      <h3>Les moments clés pour aborder le sujet</h3>
      <p>Choisissez un moment détendu, loin des repas et des situations intimes. Un trajet en voiture peut être idéal : vous êtes côte à côte (plutôt que face à face, ce qui réduit la gêne) et occupés par la route, ce qui allège la charge émotionnelle de la conversation.</p>
      
      <p>N'oubliez pas que votre capacité à communiquer sur ce sujet banal mais délicat reflète souvent la solidité de votre relation. Comme me l'a dit un client récemment : "Le jour où nous avons réussi à rire ensemble de nos flatulences, j'ai su que notre mariage était fait pour durer !"</p>
    `,
  },
  yoga: {
    title: "Le Yoga des Gaz : Postures pour un Système Digestif Harmonieux",
    date: "10 janvier 2024",
    author: "Maître Yogiste Pierre Vent",
    isPremium: false,
    content: `
      <p>Namaste ! Dans la tradition millénaire du yoga, le contrôle du Prana (l'énergie vitale) inclut également la maîtrise d'Apana Vayu, l'énergie d'élimination descendante. Découvrez comment les postures ancestrales peuvent harmoniser votre système digestif et gérer efficacement vos flatulences.</p>
      
      <h3>Les fondements philosophiques</h3>
      <p>Contrairement aux tabous occidentaux, la tradition yogique considère les gaz intestinaux comme une manifestation naturelle de l'énergie corporelle. Le Hatha Yoga Pradipika, texte fondateur du 15ème siècle, mentionne plusieurs techniques de purification incluant la gestion des vents corporels.</p>
      
      <p>Dans cette perspective, une flatulence n'est pas un accident embarrassant mais un indicateur de l'équilibre interne et un moyen de libérer les toxines accumulées.</p>
      
      <h3>Les asanas (postures) régulatrices de gaz</h3>
      <p>Pratiquez régulièrement ces postures pour améliorer votre digestion et réduire l'inconfort lié aux flatulences :</p>
      
      <ul>
        <li><strong>Pawanmuktasana</strong> (Posture de libération des vents) : Allongé sur le dos, ramenez un genou vers la poitrine tout en maintenant l'autre jambe au sol. Maintenez 30 secondes puis alternez. Cette posture est explicitement conçue pour libérer les gaz emprisonnés.</li>
        
        <li><strong>Supta Matsyendrasana</strong> (Torsion allongée) : Allongé sur le dos, amenez vos genoux d'un côté tout en tournant la tête de l'autre côté. Cette torsion masse les organes digestifs et stimule l'élimination.</li>
        
        <li><strong>Balasana</strong> (Posture de l'enfant) : À genoux, asseyez-vous sur vos talons et penchez-vous en avant, front au sol et bras le long du corps. Cette position apaise le système nerveux et détend l'abdomen.</li>
        
        <li><strong>Adho Mukha Svanasana</strong> (Chien tête en bas) : Attention cependant, cette posture peut favoriser la libération spontanée de gaz en raison de la position inversée du corps. Pratiquez-la d'abord dans l'intimité !</li>
      </ul>
      
      <h3>Pranayama spécifique</h3>
      <p>Le contrôle du souffle joue également un rôle crucial :</p>
      
      <ul>
        <li><strong>Kapalabhati</strong> (Respiration du crâne brillant) : Cette technique d'expiration forcée renforce les muscles abdominaux et améliore le transit intestinal.</li>
        
        <li><strong>Anulom Vilom</strong> (Respiration alternée) : Équilibre les énergies et calme le système nerveux, réduisant ainsi les spasmes intestinaux souvent responsables des flatulences.</li>
      </ul>
      
      <h3>Alimentation yogique et flatulences</h3>
      <p>La tradition yogique recommande un régime sattvique (pur) qui limite naturellement la production de gaz :</p>
      
      <ul>
        <li>Intégrez le gingembre et le cumin dans votre alimentation</li>
        <li>Privilégiez les repas légers en soirée</li>
        <li>Mangez dans un état d'esprit calme et conscient</li>
        <li>Évitez les combinaisons alimentaires complexes</li>
      </ul>
      
      <p>Souvenez-vous que dans la perspective du yoga, une flatulence n'est pas un échec mais un message du corps. Écoutez ce message avec bienveillance et ajustez votre pratique en conséquence.</p>
      
      <p>Om Shanti (Paix) à votre système digestif !</p>
    `,
  },
  office: {
    title: "Stratégies de Bureau : Gérer ses Flatulences en Milieu Professionnel",
    date: "28 février 2024",
    author: "Coach en Développement Professionnel Julie Discret",
    isPremium: true,
    content: `
      <p>Le milieu professionnel est peut-être l'environnement le plus délicat pour gérer ses flatulences. Entre réunions interminables, open spaces sans échappatoire et déjeuners d'affaires, les situations à risque sont nombreuses. Voici un guide complet pour préserver votre dignité professionnelle.</p>
      
      <h3>L'art de la discrétion stratégique</h3>
      <p>Après avoir interrogé plus de 200 professionnels, j'ai identifié les techniques les plus efficaces pour gérer les situations délicates :</p>
      
      <ul>
        <li><strong>La technique du "glissement progressif"</strong> : Libérez très lentement la pression pour minimiser le bruit, tout en déplaçant légèrement votre poids sur votre chaise pour atténuer les vibrations.</li>
        
        <li><strong>La diversion sonore</strong> : Faites tomber "accidentellement" un objet, toussez de manière convaincante, ou lancez une question pertinente au moment critique.</li>
        
        <li><strong>L'attribution stratégique</strong> : Positionnez-vous près de collègues notoirement suspectés dans ce domaine. La psychologie de groupe fera naturellement le reste.</li>
        
        <li><strong>L'évacuation préventive</strong> : Apprenez à reconnaître les signes avant-coureurs et excusez-vous poliment avant que la situation ne devienne critique.</li>
      </ul>
      
      <h3>Cartographie des zones de sécurité</h3>
      <p>Tout environnement de travail comporte des refuges stratégiques :</p>
      
      <ul>
        <li><strong>Toilettes aux étages éloignés</strong> : Identifiez les sanitaires les moins fréquentés, idéalement à un étage différent du vôtre.</li>
        
        <li><strong>Escaliers de secours</strong> : Souvent déserts et bien ventilés.</li>
        
        <li><strong>Parkings souterrains</strong> : Prétextez un appel important ou la vérification de votre véhicule.</li>
        
        <li><strong>Salles de réunion inoccupées</strong> : Consultez le planning des réservations pour identifier les créneaux disponibles.</li>
      </ul>
      
      <h3>La gestion de crise en cas d'incident</h3>
      <p>Si malgré toutes vos précautions, l'incident survient :</p>
      
      <ul>
        <li><strong>Le déni plausible</strong> : Maintenez une expression neutre et continuez votre activité comme si de rien n'était.</li>
        
        <li><strong>L'humour préemptif</strong> : Pour les personnalités plus extraverties, une remarque légère comme "Ah, ces chaises en cuir..." peut désamorcer la situation.</li>
        
        <li><strong>La fuite en avant</strong> : Proposez soudainement d'aller chercher des documents importants ou un café pour tous.</li>
      </ul>
      
      <h3>Adaptations alimentaires pour le professionnel</h3>
      <p>Votre alimentation les jours de travail peut faire toute la différence :</p>
      
      <ul>
        <li>Évitez les plats riches en fibres et légumineuses la veille des présentations importantes</li>
        <li>Limitez les boissons gazeuses et les chewing-gums qui font avaler de l'air</li>
        <li>Intégrez du charbon végétal activé avant les repas à risque</li>
        <li>Privilégiez plusieurs petits repas plutôt qu'un seul repas copieux</li>
      </ul>
      
      <h3>Le télétravail : allié ou fausse sécurité ?</h3>
      <p>Si le télétravail semble offrir une liberté totale, méfiez-vous des pièges des vidéoconférences : micros qui s'activent automatiquement, casques haute sensibilité qui captent les sons environnants, ou postures qui compriment l'abdomen et favorisent les incidents sonores.</p>
      
      <p>Rappelez-vous que la confiance professionnelle se construit sur de nombreux facteurs, et qu'une gestion efficace de ces situations quotidiennes peut réellement influencer votre image au bureau. Comme me l'a confié un CEO récemment : "On ne peut pas toujours contrôler son corps, mais on peut toujours contrôler la façon dont on gère les situations embarrassantes."</p>
    `,
  },
  wedding: {
    title: "Mariages & Flatulences : Le Guide de Survie pour le Jour J",
    date: "17 mars 2024",
    author: "Organisatrice de Mariages Élise Prudence",
    isPremium: true,
    content: `
      <p>Après avoir organisé plus de 200 mariages, je peux vous affirmer qu'il existe un sujet dont personne ne parle mais qui préoccupe secrètement de nombreux futurs mariés : comment gérer les flatulences lors du plus beau jour de votre vie ?</p>
      
      <h3>Le stress : ennemi invisible de votre système digestif</h3>
      <p>L'anxiété du grand jour affecte directement votre transit intestinal. Le stress libère des hormones qui accélèrent la motilité intestinale et peuvent provoquer des gaz. À cela s'ajoutent souvent :</p>
      <ul>
        <li>Un changement d'alimentation les jours précédents</li>
        <li>La consommation accrue de champagne et autres boissons gazeuses</li>
        <li>Les vêtements serrés (robes de mariée à corset, costumes ajustés) qui compriment l'abdomen</li>
      </ul>
      
      <h3>Préparation stratégique avant le jour J</h3>
      <p>Une préparation minutieuse est votre meilleure alliée :</p>
      
      <ul>
        <li><strong>J-7</strong> : Commencez un régime "anti-flatulences" en évitant les aliments fermentescibles</li>
        <li><strong>J-3</strong> : Intégrez des probiotiques spécifiques pour équilibrer votre flore intestinale</li>
        <li><strong>J-1</strong> : Évitez absolument les légumineuses, choux, oignons crus et aliments épicés</li>
        <li><strong>Jour J (matin)</strong> : Prenez un repas léger et familier, sans expérimentation culinaire</li>
      </ul>
      
      <h3>Solutions d'urgence pendant la cérémonie</h3>
      <p>La cérémonie représente le moment le plus critique : silence solennel, proximité des invités, et souvent position statique prolongée. Voici mes recommandations :</p>
      
      <ul>
        <li><strong>Pour la mariée</strong> : Les robes volumineuses sont vos alliées - elles créent un espace d'évacuation discrète et atténuent les sons potentiels. Demandez à votre témoin d'avoir des pastilles de charbon végétal dans son sac d'urgence.</li>
        
        <li><strong>Pour le marié</strong> : Évitez les pantalons trop ajustés. Une légère contraction des muscles abdominaux peut aider à contrôler temporairement la situation. En cas d'urgence absolue, un léger déplacement suivi d'un ajustement de veste peut offrir une échappatoire.</li>
      </ul>
      
      <h3>Incidents mémorables et leurs solutions</h3>
      <p>Voici quelques situations réelles vécues lors des mariages que j'ai organisés :</p>
      
      <p><strong>Cas #1 : L'incident de la première danse</strong><br>
      Un marié, après un repas copieux et plusieurs coupes de champagne, a connu un "accident sonore" lors de la première danse. Sa solution géniale ? Il a immédiatement incorporé un mouvement tournoyant et a lancé à la cantonade : "Et maintenant, tout le monde sur la piste !", transformant ce moment potentiellement embarrassant en une explosion de joie collective.</p>
      
      <p><strong>Cas #2 : Le discours interrompu</strong><br>
      Une mariée sentant une crise imminente pendant son discours a subtilement fait signe à l'orchestre, qui a lancé un roulement de tambour pour une "annonce importante". Cette diversion sonore lui a permis de gérer la situation sans que personne ne s'en aperçoive.</p>
      
      <h3>Une touche d'humour pour dédramatiser</h3>
      <p>Parfois, l'acceptation et l'humour restent vos meilleures options. Un couple particulièrement décomplexé avait même inclus dans son menu des jeux de mots sur le thème : "Velouté qui ne vous fera pas pété" ou "Légumes sélectionnés pour votre tranquillité digestive". Cette approche avait non seulement détendu l'atmosphère mais aussi rassuré secrètement de nombreux invités !</p>
      
      <p>Rappelez-vous que malgré l'importance symbolique de ce jour, vous restez des êtres humains avec des fonctions physiologiques normales. Et comme me l'a confié une mariée soulagée : "Tout le monde était tellement concentré sur nos vœux et nos regards amoureux que personne n'a remarqué mes petits moments d'humanité !"</p>
    `,
  },
  science: {
    title: "La Science des Flatulences : Ce que Votre Corps Essaie de Vous Dire",
    date: "5 janvier 2024",
    author: "Dr. François Gastro, Gastroentérologue",
    isPremium: false,
    content: `
      <p>Derrière ce sujet souvent source d'embarras se cache une fascinante science et d'importants indicateurs de santé. Plongeons dans les profondeurs de la gastroentérologie pour comprendre ce phénomène naturel.</p>
      
      <h3>Composition chimique : une signature personnelle</h3>
      <p>Les flatulences sont composées principalement de :</p>
      <ul>
        <li><strong>Azote</strong> : 20-90% (provenant principalement de l'air avalé)</li>
        <li><strong>Hydrogène</strong> : 0-50% (produit par les bactéries intestinales)</li>
        <li><strong>Dioxyde de carbone</strong> : 10-30% (produit par la digestion)</li>
        <li><strong>Méthane</strong> : 0-10% (produit par certaines bactéries méthanogènes)</li>
        <li><strong>Composés sulfurés</strong> : moins de 1% (responsables de l'odeur caractéristique)</li>
      </ul>
      
      <p>Fait surprenant : seul un tiers de la population possède les bactéries méthanogènes qui produisent du méthane. Cette caractéristique est généralement héréditaire.</p>
      
      <h3>Fréquence normale : mythes et réalités</h3>
      <p>Les études scientifiques révèlent que l'être humain moyen produit entre 10 et 23 flatulences par jour, avec un volume total pouvant atteindre 1,5 litre. Cette production varie considérablement en fonction de :</p>
      <ul>
        <li>L'alimentation (particulièrement les fibres et les FODMAPs)</li>
        <li>Le microbiote intestinal unique à chaque individu</li>
        <li>L'activité physique et la posture</li>
        <li>Les facteurs hormonaux (expliquant les variations cycliques chez les femmes)</li>
      </ul>
      
      <h3>Le microbiote intestinal : l'orchestre invisible</h3>
      <p>Votre intestin abrite plus de 100 000 milliards de bactéries appartenant à environ 1 000 espèces différentes. Cette composition unique détermine :</p>
      <ul>
        <li>Le volume de gaz produit pendant la fermentation des aliments</li>
        <li>L'odeur des flatulences (selon les composés soufrés produits)</li>
        <li>La capacité à digérer certains aliments sans production excessive de gaz</li>
      </ul>
      
      <p>Les recherches récentes en métagénomique nous permettent désormais d'analyser la composition du microbiote et potentiellement de la modifier pour réduire les problèmes de flatulences excessives.</p>
      
      <h3>Quand s'inquiéter ? Les signaux d'alarme</h3>
      <p>Si les flatulences sont généralement bénignes, certains signes doivent vous alerter :</p>
      <ul>
        <li>Augmentation soudaine et inexpliquée de la fréquence ou du volume</li>
        <li>Changement drastique de l'odeur (particulièrement une odeur extrêmement fétide)</li>
        <li>Flatulences accompagnées de douleurs abdominales intenses</li>
        <li>Association avec des changements de transit (diarrhée ou constipation)</li>
        <li>Présence de mucus ou de sang dans les selles</li>
      </ul>
      
      <p>Ces symptômes peuvent indiquer des conditions comme le syndrome de l'intestin irritable, la maladie cœliaque, une intolérance alimentaire ou une dysbiose intestinale.</p>
      
      <h3>Avancées technologiques dans l'étude des flatulences</h3>
      <p>La recherche moderne utilise des outils fascinants pour étudier ce phénomène :</p>
      <ul>
        <li><strong>Capsules électroniques ingérables</strong> qui mesurent les gaz et la pression dans différentes sections du tube digestif</li>
        <li><strong>Spectrométrie de masse</strong> pour analyser précisément la composition chimique des gaz</li>
        <li><strong>Intelligence artificielle</strong> pour établir des corrélations entre alimentation, microbiote et production de gaz</li>
      </ul>
      
      <p>Ces innovations nous permettent d'avancer vers une médecine personnalisée des troubles digestifs, avec des recommandations nutritionnelles adaptées à chaque profil intestinal.</p>
      
      <p>Alors la prochaine fois que votre corps produit ce phénomène physiologique, rappelez-vous qu'il s'agit d'un processus complexe, fascinant et porteur d'informations précieuses sur votre santé digestive !</p>
    `,
  },
  celebrities: {
    title: "Célébrités et flatulences : les témoignages exclusifs",
    date: "25 mars 2024",
    author: "PaparazziGazeux",
    isPremium: true,
    content: `
      <p>Dans le monde feutré des stars, certains sujets restent tabous. Notre équipe d'investigation a recueilli des témoignages exclusifs sur les incidents flatulents les plus mémorables d'Hollywood et d'ailleurs.</p>
      
      <h3>Accidents en direct : quand le direct ne pardonne pas</h3>
      <p>Le présentateur météo Jean-Michel Venteux pensait que le bruit des vents qu'il annonçait couvrirait son indiscrétion intestinale. Malheureusement, le micro-cravate ultra-sensible a capté avec une précision chirurgicale ce que les téléspectateurs ont immédiatement baptisé "la dépression du golfe de Gascogne". "J'ai fait semblant de déplacer des papiers bruyamment, mais le mal était fait", nous confie-t-il aujourd'hui avec autodérision.</p>
      
      <p>Plus spectaculaire encore, l'incident survenu lors de la remise d'un prix prestigieux à l'actrice Céleste Étoile. En se penchant pour récupérer sa statuette dans sa robe fourreau, un son distinctif a retenti dans l'auditorium silencieux. "Le pire, c'est que j'avais un micro juste à côté", raconte-t-elle. "J'ai immédiatement blâmé les enceintes défectueuses, et miraculeusement, tout le monde a prétendu me croire."</p>
      
      <h3>Les méthodes des stars pour gérer l'urgence</h3>
      <p>Le danseur étoile Mikhail Pirouetski a développé une technique particulière pour les représentations de ballet : "J'ai intégré dans mes chorégraphies des moments stratégiques où je m'éloigne des autres danseurs avec un grand saut. La hauteur et la distance me permettent de libérer discrètement la pression."</p>
      
      <p>La chanteuse d'opéra Aria Soprano utilise quant à elle la puissance de ses vocalises : "Pendant les notes tenues les plus fortes, personne ne remarque rien. C'est l'avantage d'être une soprano dramatique - mon la aigu peut couvrir n'importe quelle indiscrétion."</p>
      
      <h3>Clauses contractuelles secrètes</h3>
      <p>Nos sources au sein des plus grandes agences de production révèlent que certaines célébrités incluent désormais des clauses spécifiques dans leurs contrats :</p>
      <ul>
        <li>Un acteur de films d'action exige une distance minimale de 2 mètres avec les autres acteurs lors des scènes de dialogue prolongées</li>
        <li>Une star internationale du rock impose un régime spécial sans légumineuses pour toute son équipe 48h avant les concerts (ainsi, impossible de l'accuser si un incident survient)</li>
        <li>Un présentateur de télé-réalité a négocié un montage spécial avec possibilité de coupes durant les séquences statiques</li>
      </ul>
      
      <h3>La fois où tout a basculé pour le célèbre acteur J.R.</h3>
      <p>L'incident le plus marquant reste celui survenu lors du tournage d'une scène romantique pour une superproduction. L'acteur principal, que nous nommerons J.R. pour préserver son anonymat (même si les initiales sont authentiques), devait porter sa partenaire dans ses bras pour une scène intense.</p>
      
      <p>"Au moment de la soulever, l'effort a provoqué un bruit retentissant", témoigne un technicien présent ce jour-là. "Toute l'équipe a fait mine de ne rien entendre, mais sa partenaire, suspendue dans ses bras, n'avait nulle part où fuir. Le réalisateur a hurlé 'Coupez!' et a prétendu qu'un problème d'éclairage nécessitait une pause."</p>
      
      <p>La scène a finalement été réécrite pour que les personnages restent assis sur un banc.</p>
      
      <h3>Quand les réseaux sociaux s'emparent du sujet</h3>
      <p>La démocratisation des smartphones et des réseaux sociaux rend ces incidents plus difficiles à dissimuler. Un hashtag dédié a même émergé, réunissant des compilations de moments suspicieux captés lors d'émissions en direct.</p>
      
      <p>Une spécialiste en gestion de crise nous explique : "Nous conseillons désormais à nos clients célébrités d'adopter une attitude décontractée sur le sujet. Nier catégoriquement attire plus l'attention qu'une réponse humoristique qui désamorce la situation."</p>
      
      <p>Cette stratégie a été brillamment illustrée par une star internationale qui, après un incident sonore lors d'une interview, a simplement regardé la caméra et déclaré : "Voilà une opinion que je partage sur le dernier album de mon ex !"</p>
      
      <p>Dans un monde où l'image est tout, ces moments d'humanité rappellent que sous les paillettes et le glamour, les stars restent soumises aux mêmes lois de la physiologie que le commun des mortels. Une réalité qui, paradoxalement, les rend plus attachantes aux yeux de leurs fans.</p>
    `,
  },
  competition: {
    title: "Techniques avancées pour les compétitions de pets professionnelles",
    date: "17 mars 2024",
    author: "ChampionMondial",
    isPremium: true,
    content: `
      <p>En tant que quintuple médaillé d'or aux championnats internationaux de flatulences artistiques et détenteur du record du monde dans la catégorie "Marathon Sonore" (17 minutes 42 secondes de production continue), je partage pour la première fois les secrets ultra-confidentiels que seule l'élite mondiale de notre discipline connaît. Ces techniques ne sont pas destinées aux amateurs et nécessitent un dévouement quasi-monastique.</p>
      
      <h3>La préparation physique d'un champion d'élite</h3>
      <p>Contrairement aux idées reçues, la compétition de haut niveau exige une condition physique comparable à celle d'un athlète olympique. Mon programme d'entraînement quotidien, développé avec d'anciens préparateurs physiques des forces spéciales, comprend :</p>
      <ul>
        <li><strong>Renforcement hyper-spécialisé du plancher pelvien</strong> : 45 minutes d'exercices progressifs utilisant des poids suspendus pour développer un contrôle sphinctérien d'une précision chirurgicale (technique interdite aux débutants)</li>
        <li><strong>Yoga postural inversé méthode Bangalore</strong> : positions spécifiques maintenues jusqu'à 20 minutes pour développer la capacité à comprimer puis libérer les poches gazeuses avec une précision millimétrique</li>
        <li><strong>Respiration diaphragmatique synchronisée</strong> : technique empruntée aux chanteurs d'opéra permettant de moduler la pression abdominale avec une finesse inouïe</li>
        <li><strong>Stretching intestinal avancé</strong> : méthode controversée mais redoutablement efficace développée en URSS dans les années 70, augmentant la capacité de stockage de 140% et la résonance interne</li>
        <li><strong>Massage abdominal Tui Na</strong> : technique ancestrale chinoise modifiée pour stimuler la production et la circulation des gaz le long du côlon</li>
      </ul>
      
      <h3>Nutrition stratégique périodisée de niveau olympique</h3>
      <p>Une alimentation scientifiquement optimisée est le véritable secret des champions. Mon équipe composée d'un gastro-entérologue sportif, d'un biochimiste et d'un chef moléculaire a développé un programme en quatre phases méticuleusement calibrées :</p>
      
      <p><strong>Phase 1 : Hyperproduction (J-9 à J-5)</strong><br>
      Objectif : maximiser le volume et la diversité biochimique des gaz intestinaux.
      <ul>
        <li>Matin : Smoothie fermenté aux figues noires, graines de lin activées, son d'avoine et protéine de pois germés (ratio précis 3:2:4:1)</li>
        <li>10h : Infusion de racine de chicorée et poudre de topinambour (200ml exactement)</li>
        <li>Midi : Quintuple légumineuses (haricots rouges, pois chiches, lentilles corail, fèves, haricots mungo) avec oignons crus fermentés et artichauts sauvages</li>
        <li>16h : Boisson probiotique de petit-lait et extrait d'aloès</li>
        <li>Soir : Chou lacto-fermenté 72h, patate douce violette et algues kombu</li>
        <li>Supplémentation : Complexe prébiotique/enzymatique développé en laboratoire suisse sous code FRT-7</li>
      </ul>
      </p>
      
      <p><strong>Phase 2 : Modulation chimique (J-4 à J-2)</strong><br>
      Objectif : affiner la composition chimique pour optimiser son, odeur et durabilité des composés.
      <ul>
        <li>Réduction progressive des fibres insolubles selon courbe logarithmique</li>
        <li>Introduction calculée d'aliments sulfurés (œufs de caille, fromages affinés 36 mois, ail noir fermenté)</li>
        <li>Hydratation contrôlée avec eaux minérales riches en soufre (Châteldon, specific gravity 1.003)</li>
        <li>Micro-dosage d'huiles essentielles de cumin noir et fenouil sauvage</li>
        <li>Chocolat cru 95% et baies de goji (catalyseurs métaboliques)</li>
      </ul>
      </p>
      
      <p><strong>Phase 3 : Stabilisation (J-1)</strong><br>
      Objectif : stabiliser la flore intestinale et optimiser la rétention.
      <ul>
        <li>Trois repas identiques à base de riz basmati, pois cassés jaunes et ghee clarifié</li>
        <li>Jeûne hydrique de 4 heures avant le coucher</li>
        <li>Application d'huile de ricin chauffée sur l'abdomen (technique ancestrale indienne)</li>
        <li>Consommation de charbon végétal activé calibré (dosage précis selon poids corporel)</li>
      </ul>
      </p>
      
      <p><strong>Phase 4 : Performance (Jour J)</strong><br>
      Objectif : contrôle absolu et timing parfait.
      <ul>
        <li>Repas pré-compétition 4h15 avant l'épreuve (composition secrète, ingrédient-clé importé du Bhoutan)</li>
        <li>Chewing-gum enzymatique spécial contenant 17 exhausteurs de gaz (formule brevetée TM4421)</li>
        <li>Aucune consommation de liquides froids 47 minutes avant l'épreuve</li>
        <li>Tisane tiède de graines de carvi 30 minutes avant le passage</li>
        <li>Micro-dose de poudre de gingembre sous la langue 5 minutes avant la performance</li>
      </ul>
      </p>
      
      <h3>Les techniques secrètes de modulation sonore de classe mondiale</h3>
      <p>Dans la catégorie reine "Freestyle acoustique professionnel", la maîtrise des différentes tonalités et timbres est ce qui sépare les champions des simples participants. Voici quelques techniques que j'ai perfectionnées après 15 ans de pratique quotidienne :</p>
      <ul>
        <li><strong>Le vibrato contrôlé multi-octave</strong> : contraction rythmique programmée des muscles abdominaux profonds pendant l'émission, créant jusqu'à 7 variations tonales par seconde</li>
        <li><strong>La technique du crescendo-decrescendo</strong> : libération avec modulation dynamique de la pression suivant une courbe en cloche parfaite (37 niveaux distincts)</li>
        <li><strong>Le staccato fortissimo</strong> : série de 12-15 contractions ultra-rapides du sphincter pour créer un effet percussif imitant un roulement de caisse claire</li>
        <li><strong>Le sustain harmonique</strong> : la technique la plus difficile au monde, permettant de maintenir une note fondamentale pendant plus de 11 secondes tout en générant des harmoniques audibles</li>
        <li><strong>Le glissando chromatic</strong> : variation continue et régulière de la tonalité sur une octave et demie (technique brevetée)</li>
        <li><strong>Le tremolo profundo</strong> : micro-variations rapides entre deux notes distantes d'une tierce mineure</li>
        <li><strong>Le pizzicato sphinctérien</strong> : technique explosive produisant des sons courts mais d'une puissance incomparable</li>
      </ul>
      
      <h3>L'aspect mental : la dimension psychologique critique</h3>
      <p>Le stress peut anéantir instantanément des années de préparation. Ma routine pré-compétition, développée avec un ancien psychologue des Navy SEALs, inclut :</p>
      <ul>
        <li>Méditation intestinale focalisée (protocole MIF-7, 24 minutes précisément)</li>
        <li>Visualisation positive holographique des performances passées (avec induction alpha-thêta)</li>
        <li>Techniques de respiration 4-7-8 adaptées de la sophrologie avancée</li>
        <li>Isolation sensorielle dans une chambre anéchoïque 26 minutes avant le passage</li>
        <li>Autosuggestion personnalisée (mantras spécifiques enregistrés en état hypnagogique)</li>
        <li>Scan corporel progressif avec focalisation sur l'axe viscéral</li>
        <li>Utilisation de l'ancrage neurolinguistique (technique secrète des champions)</li>
      </ul>
      
      <h3>Équipement et innovations technologiques de pointe</h3>
      <p>L'évolution du matériel ultra-spécialisé a révolutionné notre discipline :</p>
      <ul>
        <li>Sous-vêtements acoustiques amplificateurs à géométrie variable (tissu technique développé pour la NASA, 12 micro-couches)</li>
        <li>Pantalons à résonance optimisée avec chambres d'écho nanotechnologiques intégrées et contrôle thermique</li>
        <li>Capteurs de pression abdominale MEMS reliés à une application de monitoring en temps réel (précision 0.001 PSI)</li>
        <li>Analyse spectrographique multi-bande avec retour haptique pour l'entraînement quotidien</li>
        <li>Gilet de compression modulaire avec zones de pression différenciées (7 zones distinctes)</li>
        <li>Algorithmes d'intelligence artificielle prédictive calculant les conditions optimales</li>
        <li>Scanner intestinal portable permettant une visualisation 3D du potentiel gazeux en temps réel</li>
      </ul>
      
      <h3>L'avenir de la discipline olympique</h3>
      <p>Avec les avancées scientifiques et la reconnaissance croissante de notre art comme discipline sportive légitime, j'entrevois un futur révolutionnaire. La prochaine génération de champions pourrait bénéficier de :</p>
      <ul>
        <li>Microbiome intestinal personnalisé par édition génétique CRISPR-Cas9</li>
        <li>Implants de contrôle neural non-invasifs pour une précision au niveau moléculaire</li>
        <li>Simulation ultra-réaliste assistée par intelligence artificielle quantique</li>
        <li>Combinaisons intégrales à conductivité acoustique programmable</li>
        <li>Régimes alimentaires synthétisés sur mesure selon le génome individuel</li>
        <li>Entraînement en réalité virtuelle immersive avec déclencheurs olfactifs</li>
        <li>Reconnaissance officielle aux Jeux Olympiques (dossier en cours depuis 2028)</li>
      </ul>
      
      <h3>Témoignages exclusifs de l'élite mondiale</h3>
      
      <p><em>"Après avoir essayé le programme d'entraînement de ChampionMondial pendant seulement 3 mois, j'ai augmenté mon amplitude sonore de 34dB et ma durée maximum de 73%. C'est tout simplement révolutionnaire."</em> — Toshiro K., médaillé d'argent, Championnats d'Asie</p>
      
      <p><em>"Sa technique du 'sustain harmonique' a changé ma carrière. Avant, j'étais un amateur qui faisait rire ses amis. Aujourd'hui, je signe des contrats publicitaires à six chiffres."</em> — Hans G., Champion d'Europe, catégorie Acoustique Libre</p>
      
      <p><em>"L'approche nutritionnelle périodisée est la véritable innovation de ces vingt dernières années. Sans elle, nous en serions encore à l'âge de pierre de notre discipline."</em> — Dr. Martinez, Directeur de l'Institut International de Gastro-Acoustique</p>
      
      <p>Souvenez-vous que derrière chaque performance d'exception se cachent des années de dévouement total, de sacrifices personnels et d'innovation constante. Comme je le dis toujours à mes étudiants d'élite : "Le talent fait du bruit, mais c'est la discipline quotidienne qui crée les champions légendaires."</p>
      
      <p>Et n'oubliez jamais ma devise qui m'a mené au sommet mondial : "Contrôle, Puissance, Précision — la trinité sacrée du flatuliste d'exception."</p>
    `,
  },
  soundlibrary: {
    title: "Bibliothèque sonore exclusive : 100+ enregistrements HD",
    date: "20 mars 2024",
    author: "IngénieurDuSon",
    isPremium: true,
    content: `
      <p>Après trois ans de collecte, d'enregistrement et de post-production méticuleuse, je suis fier de présenter la première bibliothèque sonore professionnelle dédiée aux flatulences. Chaque échantillon a été capturé avec un équipement d'exception pour garantir une fidélité acoustique sans précédent.</p>
      
      <h3>Méthodologie d'enregistrement</h3>
      <p>Pour atteindre une qualité audiophile, notre équipe a développé un protocole rigoureux :</p>
      <ul>
        <li><strong>Microphones</strong> : Configurations multiples incluant des Neumann U87, des DPA 4060 (microphones miniatures) et des hydrophones spéciaux pour les versions subaquatiques</li>
        <li><strong>Chambre anéchoïque</strong> : Enregistrements réalisés dans un environnement à réflexion zéro pour capturer le son pur</li>
        <li><strong>Échantillonnage</strong> : 192kHz/24bit pour préserver les harmoniques les plus subtiles</li>
        <li><strong>Multi-pistes</strong> : Captation simultanée à diverses distances pour obtenir une perspective spatiale complète</li>
      </ul>
      
      <h3>Catégorisation acoustique</h3>
      <p>Notre bibliothèque est organisée selon une taxonomie sonore précise :</p>
      
      <p><strong>Série Alpha : Les Classiques (31 échantillons)</strong><br>
      Des sons traditionnels avec différentes intensités et durées. Parfaits pour les besoins quotidiens de production.
      <ul>
        <li>A1-A7 : Brefs et discrets</li>
        <li>A8-A15 : Intensité moyenne avec résonance naturelle</li>
        <li>A16-A24 : Puissants et autoritaires</li>
        <li>A25-A31 : Les légendaires "longue durée" avec évolution tonale</li>
      </ul>
      </p>
      
      <p><strong>Série Beta : Variations Texturales (28 échantillons)</strong><br>
      Exploration des différentes textures sonores possibles.
      <ul>
        <li>B1-B9 : Vibrato naturel</li>
        <li>B10-B17 : Texture granulaire avec micro-variations</li>
        <li>B18-B28 : Les "bulleux" avec modulation d'amplitude unique</li>
      </ul>
      </p>
      
      <p><strong>Série Gamma : Environnements (24 échantillons)</strong><br>
      L'influence de l'acoustique environnementale sur le son.
      <ul>
        <li>G1-G8 : Salle de bain (réverbération carrelée)</li>
        <li>G9-G16 : Espaces caverneux (cathédrale, grotte)</li>
        <li>G17-G24 : Extérieurs (parc, plage, forêt)</li>
      </ul>
      </p>
      
      <p><strong>Série Delta : Expérimentaux (18 échantillons)</strong><br>
      Pour les designers sonores en quête d'innovation.
      <ul>
        <li>D1-D6 : Sous-marins (enregistrés en immersion)</li>
        <li>D7-D12 : À travers différents médiums (tissus, coussin, etc.)</li>
        <li>D13-D18 : Les "impossible physics" (manipulations en post-production)</li>
      </ul>
      </p>
      
      <h3>Applications professionnelles</h3>
      <p>Ces échantillons trouvent leur utilité dans de nombreux domaines :</p>
      <ul>
        <li><strong>Production cinématographique</strong> : Effets sonores réalistes pour comédies et films d'animation</li>
        <li><strong>Développement de jeux vidéo</strong> : Réactions des personnages et interactions environnementales</li>
        <li><strong>Théâtre contemporain</strong> : Éléments sonores pour pièces expérimentales</li>
        <li><strong>Musique électronique</strong> : Échantillons uniques pour productions avant-gardistes</li>
        <li><strong>Applications médicales</strong> : Formation du personnel soignant à reconnaître les signaux digestifs anormaux</li>
      </ul>
      
      <h3>Témoignages de professionnels</h3>
      <p><em>"Ces échantillons ont sauvé notre séquence comique. La qualité est tellement supérieure aux bibliothèques génériques que l'audience a immédiatement réagi. L'Oscar du meilleur montage son nous tend les bras !"</em> - Martin S., Monteur son, Hollywood</p>
      
      <p><em>"J'ai utilisé la série Delta pour créer les sons aliens de notre dernier jeu. Personne n'a identifié la source originale, mais l'inquiétante étrangeté fonctionne parfaitement."</em> - Akira T., Designer sonore, Tokyo</p>
      
      <h3>Accès à la bibliothèque</h3>
      <p>Les abonnés premium peuvent accéder à notre audiothèque via l'application dédiée. Chaque échantillon est disponible en plusieurs formats :</p>
      <ul>
        <li>WAV non compressé (pour les puristes)</li>
        <li>MP3 320kbps (pour une utilisation standard)</li>
        <li>Versions coupées et bouclables (pour les producteurs musicaux)</li>
        <li>Versions étirées temporellement (pour les effets atmosphériques)</li>
      </ul>
      
      <p>Un travail d'orfèvre acoustique qui, je l'espère, contribuera à élever ce son universel au rang d'expression artistique à part entière. Comme l'a si bien dit le compositeur Pierre Henry : "Tout son peut devenir musique s'il est écouté avec intention."</p>
    `,
  },
  monks: {
    title: "Techniques ancestrales de contrôle flatulent des moines tibétains",
    date: "15 février 2024",
    author: "Lama Venteux",
    isPremium: true,
    content: `
      <p>Après sept années passées dans un monastère reculé des hauts plateaux tibétains, je partage pour la première fois les enseignements ésotériques sur la maîtrise des vents internes, une discipline millénaire appelée "Lung-Gom-Pa" (la voie du contrôle des souffles).</p>
      
      <h3>Les origines mystiques de cette tradition</h3>
      <p>Selon les textes anciens conservés à Lhassa, cette pratique remonterait au 8ème siècle, lorsque le maître Padmasambhava introduisit le bouddhisme tantrique au Tibet. La légende raconte qu'après 49 jours de méditation dans une grotte glaciale, il développa la capacité de réguler sa chaleur corporelle et tous ses "vents internes" (prāṇa).</p>
      
      <p>Cette maîtrise n'était pas considérée comme anecdotique mais comme le signe d'une avancée spirituelle majeure, permettant de transcender les contraintes du corps pour atteindre des états de conscience supérieurs.</p>
      
      <h3>Les cinq niveaux de maîtrise</h3>
      <p>L'apprentissage traditionnel se divise en cinq étapes progressives :</p>
      
      <p><strong>Niveau 1 : Conscience du souffle interne (Lung-Shes-Pa)</strong><br>
      Le pratiquant développe une perception aiguë de la formation et du mouvement des gaz dans son système digestif. Cette phase initiale peut prendre plusieurs mois et implique de longues méditations centrées sur les sensations abdominales.</p>
      
      <p><strong>Niveau 2 : Redirection des vents (Lung-Gyur-Wa)</strong><br>
      L'adepte apprend à déplacer consciemment les gaz à l'intérieur du corps, évitant ainsi leur libération inopportune. Les moines peuvent maintenir cette rétention pendant des cérémonies de plusieurs heures.</p>
      
      <p><strong>Niveau 3 : Transformation alchimique (Lung-'Gyur-Ba)</strong><br>
      Technique avancée permettant de modifier la composition chimique des gaz intestinaux grâce à des exercices respiratoires spécifiques combinés à des visualisations tantriques.</p>
      
      <p><strong>Niveau 4 : Libération silencieuse (Lung-'Grol-Ba)</strong><br>
      Maîtrise totale du sphincter permettant une évacuation parfaitement silencieuse et contrôlée, indétectable même par les autres moines assis à proximité immédiate.</p>
      
      <p><strong>Niveau 5 : Sublimation éthérique (Lung-'Phel-Ba)</strong><br>
      État de réalisation ultime où les gaz intestinaux sont convertis en énergie subtile (kundalini) qui remonte le long des canaux énergétiques (nadis) jusqu'au sommet du crâne, nourrissant l'illumination spirituelle.</p>
      
      <h3>Les exercices préliminaires accessibles aux débutants</h3>
      <p>Bien que la maîtrise complète nécessite des années d'étude auprès d'un Lama qualifié, voici quelques pratiques initiales que vous pouvez intégrer à votre quotidien :</p>
      
      <ul>
        <li><strong>Méditation Tummo de la chaleur intérieure</strong> : Asseyez-vous en position du lotus, visualisez une flamme à trois doigts sous le nombril. Pratiquez 108 respirations profondes en imaginant que chaque inspiration alimente cette flamme.</li>
        
        <li><strong>Les Neuf Purifications de Vāyu</strong> : Allongé sur le dos, genoux repliés, effectuez neuf rotations du bassin dans le sens des aiguilles d'une montre, puis neuf dans le sens inverse, en synchronisant le mouvement avec votre respiration.</li>
        
        <li><strong>Ashvini Mudra</strong> (contraction de l'étoile) : Contractez et relâchez rapidement les muscles du sphincter 27 fois, trois fois par jour. Cet exercice renforce le contrôle neuromusculaire de la région.</li>
      </ul>
      
      <h3>Aspects spirituels et énergétiques</h3>
      <p>Dans la philosophie bouddhiste tibétaine, les flatulences ne sont pas considérées comme honteuses mais comme des manifestations du prana (énergie vitale) qu'il convient d'harmoniser plutôt que de réprimer.</p>
      
      <p>Le grand maître Milarepa écrivait au 11ème siècle : "Celui qui maîtrise les vents inférieurs ouvre la porte aux vents supérieurs. Les souffles du corps sont l'échelle vers les souffles de l'esprit."</p>
      
      <h3>Applications dans la vie moderne</h3>
      <p>Ces techniques ancestrales trouvent une pertinence renouvelée dans notre société contemporaine :</p>
      <ul>
        <li>Réduction du stress et de l'anxiété sociale liée aux situations potentiellement embarrassantes</li>
        <li>Amélioration de la santé digestive par une meilleure circulation des énergies internes</li>
        <li>Développement d'une conscience corporelle raffinée et d'une présence mindful</li>
      </ul>
      
      <h3>Un enseignement en voie de disparition</h3>
      <p>Malheureusement, ces pratiques sont menacées d'extinction. Seuls quelques monastères perpétuent encore cet aspect du dharma tibétain. J'ai obtenu une autorisation spéciale de mon maître pour partager ces connaissances avec le monde occidental, dans l'espoir de préserver ce patrimoine spirituel unique.</p>
      
      <p>Comme le disait mon vénérable guide spirituel : "Dans chaque manifestation du corps réside une opportunité d'éveil. Même le plus humble des vents peut devenir le souffle de la sagesse."</p>
    `,
  }
};

// Définition du type pour un article
type ArticleType = {
  title: string;
  date: string;
  author: string;
  isPremium: boolean;
  content: string;
};

export default function Article() {
  const params = useParams();
  const articleId = params.id as string;
  const article = articles[articleId as keyof typeof articles] as ArticleType;
  const [user, setUser] = useState<any>(null);
  const { isPremiumActive } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        setUser(userData);
      }
    };
    fetchUser();
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-400 to-red-600">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Article introuvable</h1>
          <p className="text-gray-700 mb-6">Désolé, cet article n'existe pas ou a été supprimé.</p>
          <Link href="/forum" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition duration-300 inline-block">
            Retour au forum
          </Link>
        </div>
      </div>
    );
  }
  
  // Vérifier si l'article est premium et si l'utilisateur n'a pas d'accès premium
  if (article.isPremium && !isPremiumActive()) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <Link href="/forum" className="text-blue-500 hover:underline">
            &larr; Retour au forum
          </Link>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
            Article Premium
          </span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
        <div className="text-gray-600 mb-2">
          <span>{article.date}</span> • <span>{article.author}</span>
        </div>
        
        <div className="mt-8 p-8 border-2 border-orange-300 rounded-lg bg-orange-50 text-center">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Contenu Premium</h2>
          <p className="mb-4">Cet article est réservé aux membres premium.</p>
          <Link href="/analyse-deluxe" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
            Devenir Premium
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Image de fond */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/forum-bg.png")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/60"></div>
      </div>
      
      <nav className="w-full max-w-4xl flex justify-between items-center mb-6 relative z-10">
        <Link
          href="/forum"
          className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-purple-700 transition duration-300 flex items-center shadow-lg"
        >
          <span className="mr-2">←</span> Retour au forum
        </Link>
      </nav>

      <div className="relative z-10 w-full max-w-4xl bg-white bg-opacity-98 rounded-xl shadow-xl overflow-hidden mb-8 border border-orange-300">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">{article.title}</h1>
          <div className="flex flex-wrap items-center mt-2 text-orange-100 text-sm">
            <span className="mr-4">📅 {article.date}</span>
            <span>✍️ {article.author}</span>
          </div>
        </div>
        
        <div className="p-4 sm:p-8">
          <style jsx global>{`
            .article-content h3 {
              color: #c2410c;
              font-size: 1.5rem;
              font-weight: 700;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
              border-bottom: 2px solid #fdba74;
              padding-bottom: 0.5rem;
            }
            
            .article-content p {
              margin-bottom: 1rem;
              line-height: 1.7;
              font-size: 1.1rem;
              color: #1f2937;
            }
            
            .article-content ul {
              list-style-type: disc;
              margin-left: 1.5rem;
              margin-bottom: 1rem;
            }
            
            .article-content li {
              margin-bottom: 0.5rem;
              line-height: 1.6;
              font-size: 1.05rem;
              color: #1f2937;
            }
            
            .article-content strong {
              color: #9a3412;
              font-weight: 700;
            }
          `}</style>
          
          <div className="article-content max-w-none text-black" dangerouslySetInnerHTML={{ __html: article.content }}>
          </div>
          
          <div className="mt-8 pt-6 border-t border-orange-200">
            <h3 className="text-lg font-bold text-orange-800 mb-4">Commentaires ({
              articleId === 'climate' ? '8' :
              articleId === 'contest' ? '12' :
              articleId === 'diet' ? '7' :
              articleId === 'history' ? '11' :
              articleId === 'app' ? '9' :
              articleId === 'science' ? '6' :
              articleId === 'partner' ? '10' :
              articleId === 'yoga' ? '8' :
              articleId === 'survey' ? '6' :
              articleId === 'dogs' ? '9' :
              articleId === 'office' ? '11' :
              articleId === 'wedding' ? '12' :
              '7'
            })</h3>
            
            <div className="space-y-4">
              {articleId === 'climate' && (
                <>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">EcoWarrior</span>
                      <span className="text-xs text-gray-500 ml-2">Hier</span>
                    </div>
                    <p className="text-gray-700 font-medium">Enfin un article qui parle de ce sujet tabou ! Il est temps que la science s'empare de cette question environnementale majeure.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">ClimatoDouteux</span>
                      <span className="text-xs text-gray-500 ml-2">3 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Encore une théorie sans fondement ! Mes pets n'ont jamais fait fondre de glacier, je peux vous l'assurer.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">Dr.Sciences</span>
                      <span className="text-xs text-gray-500 ml-2">5 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">L'analyse chimique présentée est remarquablement précise. Je suggérerais cependant de différencier les impacts selon le régime alimentaire.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">VeganFighter</span>
                      <span className="text-xs text-gray-500 ml-2">2 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Je trouve injuste d'accuser les végétariens de produire plus de méthane ! Notre empreinte carbone globale reste bien inférieure à celle des carnivores !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">CharcoalSeller</span>
                      <span className="text-xs text-gray-500 ml-2">1 jour</span>
                    </div>
                    <p className="text-gray-700 font-medium">Je commercialise justement des filtres à charbon intégrés aux sous-vêtements. Contactez-moi pour un échantillon gratuit !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">EnvironmentMinister</span>
                      <span className="text-xs text-gray-500 ml-2">4 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Nous prenons ces résultats très au sérieux. Un groupe de travail ministériel a été constitué pour étudier la taxation des aliments causant des flatulences excessives.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">NormalGuy28</span>
                      <span className="text-xs text-gray-500 ml-2">Aujourd'hui</span>
                    </div>
                    <p className="text-gray-700 font-medium">J'imagine déjà le slogan des prochaines COP : "Pétez moins pour sauver la planète" 😂</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">MéthaneExpert</span>
                      <span className="text-xs text-gray-500 ml-2">6 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Le méthane humain a une signature isotopique différente de celui des ruminants. Nous pourrions théoriquement le capturer et l'utiliser comme source d'énergie renouvelable.</p>
                  </div>
                </>
              )}
              
              {articleId === 'contest' && (
                <>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">Champion2023</span>
                      <span className="text-xs text-gray-500 ml-2">2 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Je m'entraîne depuis 3 mois avec un régime spécial haricots-choux. Cette année, le titre est à moi !</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">JuryOfficiel</span>
                      <span className="text-xs text-gray-500 ml-2">Aujourd'hui</span>
                    </div>
                    <p className="text-gray-700 font-medium">En tant que membre du jury, je tiens à préciser que les vidéos doivent être non modifiées. Les participants de l'an dernier avaient tenté des montages audio peu convaincants.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">Spectateur_Curieux</span>
                      <span className="text-xs text-gray-500 ml-2">1 jour</span>
                    </div>
                    <p className="text-gray-700 font-medium">Est-ce que les billets pour la finale sont déjà en vente ? J'aimerais réserver des places au premier rang (ou peut-être au dernier finalement...).</p>
                  </div>
                </>
              )}
              
              {articleId === 'diet' && (
                <>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">GastroSceptique</span>
                      <span className="text-xs text-gray-500 ml-2">4 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">J'ai essayé cette méthode pendant deux semaines. Résultat : je pète toujours, mais maintenant ça sent la rose... ou presque.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">NutritionisteAmateure</span>
                      <span className="text-xs text-gray-500 ml-2">Hier</span>
                    </div>
                    <p className="text-gray-700 font-medium">Attention cependant aux carences avec ce régime. Les légumineuses sont d'excellentes sources de protéines végétales qu'il ne faut pas bannir complètement !</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">MarieRéunion</span>
                      <span className="text-xs text-gray-500 ml-2">3 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Je vais tester ça avant ma prochaine réunion de travail. La dernière fois a été... catastrophique.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">BioHacker42</span>
                      <span className="text-xs text-gray-500 ml-2">5 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">J'ai optimisé cette méthode en ajoutant un supplément de charbon activé aux repas. Mes flatulences sont maintenant indétectables même par les chiens renifleurs !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">RandonneurSolitaire</span>
                      <span className="text-xs text-gray-500 ml-2">1 jour</span>
                    </div>
                    <p className="text-gray-700 font-medium">Depuis que je suis ce régime, je peux enfin partager ma tente lors des treks sans craindre d'asphyxier mes compagnons de voyage.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">IntoléranceNinja</span>
                      <span className="text-xs text-gray-500 ml-2">2 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Ce qui fonctionnerait mieux c'est de faire un test d'intolérances alimentaires. J'ai découvert que le lactose était mon ennemi juré !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">ProgrammeurGazeux</span>
                      <span className="text-xs text-gray-500 ml-2">Aujourd'hui</span>
                    </div>
                    <p className="text-gray-700 font-medium">Quand je code, je ne sors pas de mon bureau pendant des heures. Ce régime a littéralement sauvé ma relation avec mes collègues d'open space !</p>
                  </div>
                </>
              )}
              
              {articleId === 'history' && (
                <>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">HistorienAmateurGazeux</span>
                      <span className="text-xs text-gray-500 ml-2">5 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Fascinant ! Je ne savais pas que Louis XIV avait cette approche libérale des flatulences. Notre époque est vraiment bien plus puritaine.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">AntiqueScholar</span>
                      <span className="text-xs text-gray-500 ml-2">3 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Vos sources sur l'Égypte ancienne sont-elles vérifiables ? J'ai fait des recherches extensives sur le dieu Shu et cette association me paraît douteuse.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">LouisXIVfan</span>
                      <span className="text-xs text-gray-500 ml-2">Hier</span>
                    </div>
                    <p className="text-gray-700 font-medium">Le Roi Soleil aurait donc aussi été le Roi des Pets ? Voilà qui jette un nouvel éclairage sur la cour de Versailles !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">PétomaneFanclub</span>
                      <span className="text-xs text-gray-500 ml-2">2 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Joseph Pujol était un génie incompris ! J'ai créé une association pour faire revivre son art et demander la réouverture de sa salle au Moulin Rouge. Qui me suit ?</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">MédiévalistePro</span>
                      <span className="text-xs text-gray-500 ml-2">4 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Dans les récits de Chaucer, notamment Les Contes de Canterbury, les flatulences sont un ressort comique récurrent. C'était vraiment l'âge d'or de l'humour flatulent !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">AnthropologieEtGaz</span>
                      <span className="text-xs text-gray-500 ml-2">1 jour</span>
                    </div>
                    <p className="text-gray-700 font-medium">J'ai étudié les rites de passage dans certaines tribus de Papouasie où les flatulences jouent un rôle central dans l'accession au statut d'adulte. Fascinant !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">AncienProf</span>
                      <span className="text-xs text-gray-500 ml-2">6 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Je me souviens d'un manuel d'étiquette victorien qui consacrait 15 pages aux techniques pour dissimuler les bruits corporels en société. Je regrette de l'avoir perdu lors d'un déménagement.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">EtudiantHistoire</span>
                      <span className="text-xs text-gray-500 ml-2">3 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Je vais faire mon mémoire sur ce sujet ! "Évolution des perceptions sociales des flatulences du Moyen Âge à nos jours" - Ça marquera les esprits à la soutenance...</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">ArchéoGaseux</span>
                      <span className="text-xs text-gray-500 ml-2">Aujourd'hui</span>
                    </div>
                    <p className="text-gray-700 font-medium">Les archéologues peuvent-ils détecter les habitudes flatulentes des civilisations anciennes à travers leurs régimes alimentaires ? Voilà un axe de recherche inexploré !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">NotreDameDePet</span>
                      <span className="text-xs text-gray-500 ml-2">7 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Dans certaines cathédrales médiévales, les sculptures de gargouilles représentaient des personnages flatulents. L'Église utilisait ces images comme avertissement contre la gourmandise !</p>
                  </div>
                </>
              )}
              
              {articleId === 'dogs' && (
                <>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">DogsLover</span>
                      <span className="text-xs text-gray-500 ml-2">2 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Mon labrador quitte systématiquement la pièce quand je pète. C'est vraiment humiliant d'être jugé par son propre chien !</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">VétérinaireCool</span>
                      <span className="text-xs text-gray-500 ml-2">Hier</span>
                    </div>
                    <p className="text-gray-700 font-medium">Les chiens ont un odorat 40 fois plus sensible que le nôtre. Imaginez percevoir une flatulence avec une telle intensité ! Un peu de compassion pour nos amis canins.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">PitbullMaster</span>
                      <span className="text-xs text-gray-500 ml-2">5 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Mon chien n'est pas du tout dégoûté, il aime renifler mes pets. Devrais-je m'inquiéter de ses goûts douteux ?</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">ChatGang</span>
                      <span className="text-xs text-gray-500 ml-2">3 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Et les chats alors ? Le mien me fixe avec mépris quand je pète, puis fait exactement la même chose dans sa litière sans aucune honte. Deux poids, deux mesures !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">DresseuseCanine</span>
                      <span className="text-xs text-gray-500 ml-2">1 jour</span>
                    </div>
                    <p className="text-gray-700 font-medium">J'utilise cette réaction pour entraîner des chiens détecteurs de flatulences dans les maisons de retraite. Ils alertent discrètement le personnel pour éviter les situations gênantes.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">TerrierOwner</span>
                      <span className="text-xs text-gray-500 ml-2">4 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Mon Jack Russell a l'audace de me regarder avec dégoût alors que ses propres pets sont bien pires que les miens ! L'hypocrisie canine n'a pas de limites...</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">ScienceGeek</span>
                      <span className="text-xs text-gray-500 ml-2">Aujourd'hui</span>
                    </div>
                    <p className="text-gray-700 font-medium">Les chiens peuvent détecter certaines maladies par l'odeur. Peut-être que votre chien n'est pas dégoûté mais inquiet pour votre santé digestive !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">BulldogFrançais</span>
                      <span className="text-xs text-gray-500 ml-2">2 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Mon bouledogue français est le roi des pets. On fait des concours tous les soirs. Pour l'instant, il gagne.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">PsyCanin</span>
                      <span className="text-xs text-gray-500 ml-2">6 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">La réaction de dégoût de votre chien pourrait être une forme de communication sociale. Il vous signale peut-être qu'en meute, ce comportement attirerait les prédateurs !</p>
                  </div>
                </>
              )}
              
              {articleId === 'support' && (
                <>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">AnonymousFarter23</span>
                      <span className="text-xs text-gray-500 ml-2">1 jour</span>
                    </div>
                    <p className="text-gray-700 font-medium">Merci pour ce groupe. C'est la première fois que je me sens accepté avec mon "problème". La séance de méditation flatulente a changé ma vie.</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">ThérapeuteFlatulences</span>
                      <span className="text-xs text-gray-500 ml-2">3 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Je suis psychologue et je constate que la honte liée aux flatulences cause plus de traumatismes qu'on ne le pense. Bravo pour cette initiative salutaire !</p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">ProfesseurYoga</span>
                      <span className="text-xs text-gray-500 ml-2">4 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">En yoga, nous avons des postures spécifiques pour libérer les gaz de manière contrôlée. Je propose d'animer un atelier lors de votre prochaine réunion.</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">MèreDeFamille</span>
                      <span className="text-xs text-gray-500 ml-2">Hier</span>
                    </div>
                    <p className="text-gray-700 font-medium">Depuis que j'ai rejoint ce groupe, j'ai enfin pu parler ouvertement à mes enfants. Nous avons maintenant des fous rires plutôt que des moments de gêne !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">PéteurRéformé</span>
                      <span className="text-xs text-gray-500 ml-2">5 jours</span>
                    </div>
                    <p className="text-gray-700 font-medium">Témoignage : après 30 ans à retenir mes gaz en public, j'ai enfin accepté ma nature. Mon colon vous remerciera pour cette libération !</p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <span className="font-bold text-orange-800">NouveauMembre</span>
                      <span className="text-xs text-gray-500 ml-2">Aujourd'hui</span>
                    </div>
                    <p className="text-gray-700 font-medium">Bonjour à tous, c'est ma première participation. Comment gérez-vous les situations professionnelles ? Mon open space devient un véritable champ de bataille...</p>
                  </div>
                </>
              )}
            </div>
            
            <form className="mt-6">
              <textarea 
                className="w-full p-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
                placeholder="Ajouter un commentaire..."
              ></textarea>
              <button
                type="submit"
                className="mt-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Commenter
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 w-full max-w-4xl flex flex-wrap gap-4 justify-center mb-8">
        <Link href={`/article/climate`} className={`px-5 py-3 bg-white bg-opacity-98 rounded-lg shadow-lg hover:bg-orange-100 transition font-semibold text-orange-900 ${articleId === 'climate' ? 'border-2 border-orange-500 ring-2 ring-orange-300' : 'border border-orange-300'}`}>
          Réchauffement climatique
        </Link>
        <Link href={`/article/contest`} className={`px-5 py-3 bg-white bg-opacity-98 rounded-lg shadow-lg hover:bg-orange-100 transition font-semibold text-orange-900 ${articleId === 'contest' ? 'border-2 border-orange-500 ring-2 ring-orange-300' : 'border border-orange-300'}`}>
          Concours
        </Link>
        <Link href={`/article/survey`} className={`px-5 py-3 bg-white bg-opacity-98 rounded-lg shadow-lg hover:bg-orange-100 transition font-semibold text-orange-900 ${articleId === 'survey' ? 'border-2 border-orange-500 ring-2 ring-orange-300' : 'border border-orange-300'}`}>
          Enquête
        </Link>
        <Link href={`/article/dogs`} className={`px-5 py-3 bg-white bg-opacity-98 rounded-lg shadow-lg hover:bg-orange-100 transition font-semibold text-orange-900 ${articleId === 'dogs' ? 'border-2 border-orange-500 ring-2 ring-orange-300' : 'border border-orange-300'}`}>
          Chiens
        </Link>
        <Link href={`/article/support`} className={`px-5 py-3 bg-white bg-opacity-98 rounded-lg shadow-lg hover:bg-orange-100 transition font-semibold text-orange-900 ${articleId === 'support' ? 'border-2 border-orange-500 ring-2 ring-orange-300' : 'border border-orange-300'}`}>
          Groupe de soutien
        </Link>
      </div>

      <div className="mt-8 sm:mt-12 w-full max-w-lg text-center relative z-10 bg-white bg-opacity-60 backdrop-blur-md p-4 rounded-2xl border border-orange-200">
        <p className="text-orange-900 font-bold">
          © 2024 Pétomane Studio - Articles scientifiquement prouvés
        </p>
        <p className="text-orange-700 text-sm mt-1">
          La référence en matière de flatulences depuis 2024
        </p>
      </div>
    </div>
  );
} 