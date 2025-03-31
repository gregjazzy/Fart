"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTokens } from "../TokenProvider";

export default function Dictionary() {
  const { isPremiumActive } = useTokens();
  const [isPremium, setIsPremium] = useState(false);

  // Définition des interfaces pour les types de pets
  interface FartDictionaryEntry {
    name: string;
    description: string;
    style: string;
    place?: string;
  }

  interface FartEntry {
    sound: string;
    place: string;
    duration: string;
    style: string;
    translation: string;
  }

  useEffect(() => {
    // Utiliser isPremiumActive du contexte de tokens
    setIsPremium(isPremiumActive);
  }, [isPremiumActive]);

  const freeFarts = [
    { sound: "Pfrrrt", place: "métro", duration: "3 sec", style: "sec", translation: "J'ai dévoré des haricots rouges !" },
    { sound: "Bloup", place: "piscine", duration: "2 sec", style: "mouillé", translation: "J'ai avalé trop de soupe aux choux !" },
    { sound: "Bzzzzt", place: "réunion professionnelle", duration: "4 sec", style: "vibrant", translation: "J'ai englouti des tacos épicés !" },
    { sound: "Floutch", place: "ascenseur", duration: "1 sec", style: "foireux", translation: "J'ai abusé des pruneaux !" },
    { sound: "Pschitt", place: "bibliothèque", duration: "2 sec", style: "silencieux", translation: "J'ai grignoté des radis !" },
    { sound: "Boum", place: "salle de cinéma", duration: "3 sec", style: "explosif", translation: "J'ai englouti un chili con carne !" },
    { sound: "Vrouf", place: "lit", duration: "5 sec", style: "long", translation: "J'ai dévoré des lentilles mal cuites !" },
    { sound: "Plop", place: "salle d'attente", duration: "1 sec", style: "sec", translation: "J'ai croqué trop de carottes crues !" },
    { sound: "Swiiiish", place: "restaurant chic", duration: "2 sec", style: "discret", translation: "J'ai savouré du chou-fleur gratiné !" },
    { sound: "Kablam", place: "avion", duration: "4 sec", style: "explosif", translation: "J'ai englouti du cassoulet !" },
    { sound: "Fiou", place: "cabinet médical", duration: "2 sec", style: "sifflant", translation: "J'ai mangé trop d'oignons !" },
    { sound: "Pok", place: "voiture", duration: "1 sec", style: "sec", translation: "J'ai grignoté des chips au fromage !" },
    { sound: "Flouuup", place: "open space", duration: "3 sec", style: "mouillé", translation: "J'ai bu trop de jus de pruneaux !" },
    { sound: "Trrr", place: "vestiaire", duration: "2 sec", style: "vibrant", translation: "J'ai avalé du poivron cru !" },
    { sound: "Sploutch", place: "plage", duration: "3 sec", style: "foireux", translation: "J'ai dévoré trop de pastèque !" },
    { sound: "Wizz", place: "église", duration: "1 sec", style: "silencieux", translation: "J'ai mangé des petits pois !" },
    { sound: "Kaboom", place: "salle de sport", duration: "4 sec", style: "explosif", translation: "J'ai englouti des protéines en poudre !" },
    { sound: "Fluip", place: "supermarché", duration: "2 sec", style: "discret", translation: "J'ai grignoté des légumes verts !" },
    { sound: "Prout", place: "jardin public", duration: "3 sec", style: "classique", translation: "J'ai avalé trop de maïs !" },
    { sound: "Floc", place: "bureau de poste", duration: "1 sec", style: "mouillé", translation: "J'ai dévoré des abricots trop mûrs !" },
  ];

  const premiumFarts = [
    { sound: "Braoum", place: "mariage", duration: "5 sec", style: "explosif", translation: "J'ai englouti tout le buffet de fèves !" },
    { sound: "Floutchik", place: "concert", duration: "2 sec", style: "foireux", translation: "J'ai avalé trop de pop-corn caramélisé !" },
    { sound: "Pssssst", place: "musée", duration: "3 sec", style: "silencieux", translation: "J'ai grignoté des artichauts !" },
    { sound: "Vloup", place: "centre commercial", duration: "1 sec", style: "mouillé", translation: "J'ai bu un smoothie aux légumes !" },
    { sound: "Tuk", place: "entretien d'embauche", duration: "1 sec", style: "sec", translation: "J'ai croqué des noix de cajou !" },
    { sound: "Brouf", place: "bus bondé", duration: "4 sec", style: "explosif", translation: "J'ai dévoré des kebabs épicés !" },
    { sound: "Whisp", place: "salle de classe", duration: "2 sec", style: "discret", translation: "J'ai mangé trop de brocolis !" },
    { sound: "Froump", place: "file d'attente", duration: "3 sec", style: "vibrant", translation: "J'ai englouti des pois chiches !" },
    { sound: "Splash", place: "bateau", duration: "2 sec", style: "mouillé", translation: "J'ai avalé des fruits de mer douteux !" },
    { sound: "Criik", place: "dîner romantique", duration: "1 sec", style: "sec", translation: "J'ai grignoté du pain complet !" },
    { sound: "Blam", place: "hôpital", duration: "4 sec", style: "explosif", translation: "J'ai dévoré des plats de la cantine !" },
    { sound: "Fiiit", place: "théâtre", duration: "2 sec", style: "sifflant", translation: "J'ai mangé des asperges !" },
    { sound: "Plof", place: "taxi", duration: "1 sec", style: "sec", translation: "J'ai avalé des cacahuètes salées !" },
    { sound: "Blourch", place: "coiffeur", duration: "3 sec", style: "foireux", translation: "J'ai englouti des pêches trop mûres !" },
    { sound: "Zip", place: "funérailles", duration: "1 sec", style: "silencieux", translation: "J'ai grignoté des crackers au sésame !" },
    { sound: "Brrr", place: "train", duration: "4 sec", style: "vibrant", translation: "J'ai dévoré des lentilles corail !" },
    { sound: "Flish", place: "hammam", duration: "2 sec", style: "mouillé", translation: "J'ai avalé trop de soupe à l'oignon !" },
    { sound: "Poc", place: "télécabine", duration: "1 sec", style: "sec", translation: "J'ai mangé des amandes grillées !" },
    { sound: "Kaploof", place: "boîte de nuit", duration: "3 sec", style: "explosif", translation: "J'ai englouti des nachos au fromage !" },
    { sound: "Pschi", place: "station-service", duration: "2 sec", style: "silencieux", translation: "J'ai grignoté des chips à l'oignon !" },
    { sound: "Vroum", place: "sauna", duration: "4 sec", style: "vibrant", translation: "J'ai dévoré trop de saucisses !" },
    { sound: "Flick", place: "conférence", duration: "1 sec", style: "sec", translation: "J'ai avalé des graines de tournesol !" },
    { sound: "Platch", place: "piscine municipale", duration: "3 sec", style: "mouillé", translation: "J'ai mangé des melons trop mûrs !" },
    { sound: "Bzzzt", place: "métro bondé", duration: "2 sec", style: "vibrant", translation: "J'ai englouti du chili !" },
    { sound: "Frouitch", place: "banque", duration: "2 sec", style: "foireux", translation: "J'ai grignoté trop de figues !" },
    { sound: "Pif", place: "salon de thé", duration: "1 sec", style: "sec", translation: "J'ai avalé des biscuits au son d'avoine !" },
    { sound: "Drooosh", place: "réunion familiale", duration: "5 sec", style: "explosif", translation: "J'ai dévoré des haricots blancs !" },
    { sound: "Fluit", place: "bibliothèque silencieuse", duration: "2 sec", style: "sifflant", translation: "J'ai mangé des navets !" },
    { sound: "Bloup", place: "piscine à vagues", duration: "1 sec", style: "mouillé", translation: "J'ai englouti trop de pastèque !" },
    { sound: "Tap", place: "cérémonie officielle", duration: "1 sec", style: "sec", translation: "J'ai grignoté des pistaches !" },
    { sound: "Fiouuuu", place: "cours de yoga", duration: "3 sec", style: "long", translation: "J'ai avalé un smoothie aux épinards !" },
    { sound: "Klang", place: "salle d'opération", duration: "2 sec", style: "métallique", translation: "J'ai dévoré des conserves de flageolets !" },
    { sound: "Pfiiou", place: "salle d'examen", duration: "2 sec", style: "sifflant", translation: "J'ai mangé trop de chou rouge !" },
    { sound: "Crac", place: "défilé de mode", duration: "1 sec", style: "sec", translation: "J'ai grignoté des crackers au blé complet !" },
    { sound: "Flblblb", place: "hammam", duration: "4 sec", style: "mouillé", translation: "J'ai englouti de la ratatouille !" },
    { sound: "Tchak", place: "premier rendez-vous", duration: "1 sec", style: "sec", translation: "J'ai avalé des graines de chia !" },
    { sound: "Bouf", place: "réunion de travail", duration: "3 sec", style: "explosif", translation: "J'ai dévoré un burrito aux haricots !" },
    { sound: "Sssst", place: "opéra", duration: "2 sec", style: "silencieux", translation: "J'ai mangé des endives braisées !" },
    { sound: "Plourp", place: "jacuzzi", duration: "1 sec", style: "mouillé", translation: "J'ai grignoté des fruits exotiques !" },
    { sound: "Tchoup", place: "ascenseur bondé", duration: "2 sec", style: "sec", translation: "J'ai avalé trop de noix du Brésil !" },
    { sound: "Vroom", place: "cérémonie de remise des prix", duration: "4 sec", style: "vibrant", translation: "J'ai englouti un plat de choucroute !" },
    { sound: "Psit", place: "musée de cire", duration: "1 sec", style: "silencieux", translation: "J'ai dévoré des dattes séchées !" },
    { sound: "Fluc", place: "spa", duration: "2 sec", style: "mouillé", translation: "J'ai mangé des concombres !" },
    { sound: "Trrrk", place: "entretien annuel", duration: "3 sec", style: "vibrant", translation: "J'ai grignoté des edamame !" },
    { sound: "Blam", place: "salle d'attente bondée", duration: "2 sec", style: "explosif", translation: "J'ai avalé un plat de couscous !" },
    { sound: "Flip", place: "soirée mondaine", duration: "1 sec", style: "sec", translation: "J'ai dévoré des toasts à l'avocat !" },
    { sound: "Plourf", place: "piscine olympique", duration: "3 sec", style: "mouillé", translation: "J'ai englouti trop de jus de betterave !" },
    { sound: "Tiiiz", place: "réunion du conseil", duration: "2 sec", style: "sifflant", translation: "J'ai mangé des poireaux vinaigrette !" },
    { sound: "Cloc", place: "salle de conférence", duration: "1 sec", style: "sec", translation: "J'ai grignoté des graines de lin !" },
    { sound: "Braouf", place: "visite guidée", duration: "4 sec", style: "explosif", translation: "J'ai avalé un curry de pois chiches !" },
    { sound: "Pschitt", place: "vernissage", duration: "2 sec", style: "silencieux", translation: "J'ai dévoré des radis noir !" },
    { sound: "Shlouf", place: "bassin thermal", duration: "3 sec", style: "mouillé", translation: "J'ai mangé trop de soupe miso !" },
    { sound: "Toc", place: "dîner d'affaires", duration: "1 sec", style: "sec", translation: "J'ai englouti des noisettes grillées !" },
    { sound: "Vroush", place: "avion en plein vol", duration: "5 sec", style: "puissant", translation: "J'ai grignoté des fèves au cumin !" },
    { sound: "Psss", place: "galerie d'art", duration: "2 sec", style: "silencieux", translation: "J'ai avalé des feuilles de céleri !" },
    { sound: "Flioup", place: "source thermale", duration: "1 sec", style: "mouillé", translation: "J'ai dévoré une salade de chou !" },
    { sound: "Krik", place: "présentation commerciale", duration: "1 sec", style: "sec", translation: "J'ai mangé des biscottes complètes !" },
    { sound: "Badaboum", place: "salle de spectacle", duration: "4 sec", style: "explosif", translation: "J'ai englouti un cassoulet entier !" },
    { sound: "Fiii", place: "aquarium", duration: "3 sec", style: "sifflant", translation: "J'ai grignoté des algues déshydratées !" },
    { sound: "Plouf", place: "bain à remous", duration: "2 sec", style: "mouillé", translation: "J'ai avalé trop de compote de pommes !" },
    { sound: "Tik", place: "remise de diplôme", duration: "1 sec", style: "sec", translation: "J'ai dévoré des baies de goji !" },
    { sound: "Blurp", place: "salle de bal", duration: "3 sec", style: "vibrant", translation: "J'ai mangé un risotto aux champignons !" },
    { sound: "Wisssh", place: "exposition", duration: "2 sec", style: "silencieux", translation: "J'ai englouti des graines germées !" },
    { sound: "Flopsch", place: "pédalo", duration: "3 sec", style: "mouillé", translation: "J'ai grignoté des raisins trop mûrs !" },
    { sound: "Clac", place: "soutenance de thèse", duration: "1 sec", style: "sec", translation: "J'ai avalé des noix de pécan !" },
    { sound: "Broudoum", place: "réception de mariage", duration: "5 sec", style: "explosif", translation: "J'ai dévoré un plat de garbanzos !" },
    { sound: "Fsst", place: "concert de musique classique", duration: "2 sec", style: "silencieux", translation: "J'ai mangé des feuilles de roquette !" },
    { sound: "Gouik", place: "canot pneumatique", duration: "1 sec", style: "mouillé", translation: "J'ai englouti trop de melon d'eau !" },
    { sound: "Tack", place: "entretien d'embauche", duration: "1 sec", style: "sec", translation: "J'ai grignoté des graines de sésame !" },
    { sound: "Vroumm", place: "conférence internationale", duration: "4 sec", style: "vibrant", translation: "J'ai avalé un chili végétarien !" },
    { sound: "Piu", place: "bibliothèque nationale", duration: "1 sec", style: "silencieux", translation: "J'ai dévoré des pousses de bambou !" },
    { sound: "Splush", place: "bain nordique", duration: "3 sec", style: "mouillé", translation: "J'ai mangé trop de soupe de potiron !" },
    { sound: "Crik", place: "dégustation de vin", duration: "1 sec", style: "sec", translation: "J'ai englouti des crackers au seigle !" },
    { sound: "Kapow", place: "cinéma en plein air", duration: "3 sec", style: "explosif", translation: "J'ai grignoté un plat de fajitas !" },
    { sound: "Fiiish", place: "concert symphonique", duration: "2 sec", style: "sifflant", translation: "J'ai avalé des asperges blanches !" },
    { sound: "Blurb", place: "fontaine publique", duration: "1 sec", style: "mouillé", translation: "J'ai dévoré des myrtilles fraîches !" },
    { sound: "Klok", place: "remise des oscars", duration: "1 sec", style: "sec", translation: "J'ai mangé des amandes effilées !" },
    { sound: "Broum", place: "salle du trône", duration: "5 sec", style: "royal", translation: "J'ai englouti un ragoût de légumineuses !" },
    { sound: "Pshutt", place: "musée du silence", duration: "2 sec", style: "silencieux", translation: "J'ai grignoté des feuilles de basilic !" },
    { sound: "Ploush", place: "bassin de nage", duration: "2 sec", style: "mouillé", translation: "J'ai avalé trop de minestrone !" },
    { sound: "Crac", place: "investiture présidentielle", duration: "1 sec", style: "sec", translation: "J'ai dévoré des noix de macadamia !" },
    { sound: "Blaff", place: "carnaval", duration: "3 sec", style: "festif", translation: "J'ai mangé un plat de feijoada !" },
    { sound: "Swish", place: "cérémonie des césars", duration: "2 sec", style: "élégant", translation: "J'ai englouti des truffes noires !" },
    { sound: "Pluff", place: "lac artificiel", duration: "1 sec", style: "mouillé", translation: "J'ai grignoté des grenades trop juteuses !" },
  ];

  // Définir le dictionnaire de flatulences
  const fartDictionary: FartDictionaryEntry[] = [
    // A
    { name: "Aaaha", description: "Pet d'extase pure, expression sonore d'un plaisir intestinal intense qui monte en crescendo.", style: "extatique" },
    { name: "Aboyeur", description: "Pet bruyant qui aboie comme un chien enragé, annonçant fièrement son arrivée imminente.", style: "bruyant" },
    { name: "Aigrelet", description: "Petit pet acide, odeur de citron pourri qui pique les narines sournoisement.", style: "acide" },
    { name: "Anarchiste", description: "Sort sans prévenir, défiant toute convenance, un rebelle des intestins en furie.", style: "rebelle" },
    { name: "Artilleur", description: "Explosif comme un coup de canon, il déchire l'air avec arrogance.", style: "explosif" },
    { name: "Assassin", description: "Silencieux, discret, mais son odeur mortelle tue l'ambiance en un instant.", style: "silencieux" },

    { name: "Baam", description: "Pet explosif et théâtral, comme une onomatopée de bande dessinée qui prend vie en sortant.", style: "explosif" },
    { name: "Bafouilleur", description: "Pet hésitant qui sort par petits bouts, comme un discours mal préparé.", style: "hésitant" },
    { name: "Baroudeur", description: "Gros pet voyageur, explore la pièce, laissant une traînée olfactive douteuse.", style: "voyageur" },
    { name: "Baveur", description: "Pet mouillé et gluant, gargouille comme un marais, risque de dérapage.", style: "mouillé" },
    { name: "Bouffon", description: "Bruyant et ridicule, il fait rire tout le monde malgré la honte.", style: "comique" },
    { name: "Brontosaure", description: "Long, grave, un pet préhistorique qui résonne dans les âges anciens.", style: "profond" },

    { name: "Cacophone", description: "Bruit discordant et criard, un pet qui chante faux sans gêne.", style: "discordant" },
    { name: "Camouflard", description: "Se planque dans un bruit de chaise, rusé comme un renard.", style: "discret" },
    { name: "Canaille", description: "Pet vicieux qui adore gêner les autres, un vrai petit salopard.", style: "vicieux" },
    { name: "Charognard", description: "Puanteur de viande avariée, il transforme l'air en cimetière nauséabond.", style: "nauséabond" },
    { name: "Claque-fesse", description: "Sec et sonore, comme une fessée surprise qui claque dans le silence.", style: "sec" },

    { name: "Déchireur", description: "Pet si puissant qu'on dirait qu'il déchire un tissu en sortant.", style: "puissant" },
    { name: "Délégué", description: "Représente ton repas d'hier, fier ambassadeur des excès alimentaires.", style: "représentatif" },
    { name: "Démon", description: "Sombre et toxique, un pet infernal qui évoque les flammes sulfureuses.", style: "toxique" },
    { name: "Discretos", description: "Petit pet timide, presque poli, il s'excuse en passant furtivement.", style: "timide" },
    { name: "Dynamiteur", description: "Explosif et brutal, il fait trembler les murs comme une bombe.", style: "explosif" },

    { name: "Éclaireur", description: "Premier d'une série, il teste le terrain avant l'assaut principal.", style: "précurseur" },
    { name: "Égorgeur", description: "Odeur si agressive qu'elle te prend à la gorge sans pitié.", style: "agressif" },
    { name: "Énigmatique", description: "Mystérieux et insaisissable, personne ne sait d'où vient ce pet étrange.", style: "mystérieux" },
    { name: "Épiceur", description: "Parfumé au curry ou tacos, un pet exotique qui sent le voyage.", style: "épicé" },
    { name: "Éternueur", description: "Pet qui te fait dire \"à tes souhaits\" tellement il surprend.", style: "surprenant" },

    { name: "Fantasque", description: "Imprévisible et excentrique, ce pet fait ce qu'il veut, quand il veut.", style: "imprévisible" },
    { name: "Fêtard", description: "Bruyant et joyeux, il anime les soirées comme un DJ déchaîné.", style: "festif" },
    { name: "Fielleux", description: "Odeur douce au début, puis une vague agressive qui te trahit.", style: "traître" },
    { name: "Foudroyant", description: "Rapide et puissant, un éclair de gaz qui frappe sans prévenir.", style: "rapide" },
    { name: "Fugueur", description: "Pet qui s'échappe malgré tes efforts pour le retenir, un évadé.", style: "incontrôlable" },

    { name: "Gangster", description: "Pet dur et menaçant, impose son règne olfactif avec un air mauvais.", style: "menaçant" },
    { name: "Gargouilleur", description: "Bruit de glouglou humide, un pet qui semble venir des égouts.", style: "humide" },
    { name: "Géant", description: "Gros et imposant, un titan des flatulences qui domine tout.", style: "imposant" },
    { name: "Glisseur", description: "Pet lisse et fluide, il sort sans effort, presque élégant.", style: "fluide" },
    { name: "Grondeur", description: "Râle comme un ours mal luné, un pet de mauvaise humeur.", style: "grognon" },

    { name: "Hargneux", description: "Pet colérique qui semble en vouloir au monde entier en sortant.", style: "colérique" },
    { name: "Hautain", description: "Se prend pour un parfum de luxe malgré son odeur douteuse.", style: "prétentieux" },
    { name: "Héros", description: "Sauve une situation gênante avec son audace, un pet courageux.", style: "courageux" },
    { name: "Honteux", description: "Pet qui te fait rougir en public, un traître sournois.", style: "embarrassant" },
    { name: "Hurleur", description: "Strident et aigu, il appelle l'attention comme une sirène hystérique.", style: "strident" },

    { name: "Imposteur", description: "Pet qu'on attribue à un autre, maître du faux coupable parfait.", style: "trompeur" },
    { name: "Increvable", description: "Long et tenace, il refuse de s'arrêter malgré tes prières.", style: "persistant" },
    { name: "Inodore", description: "Pet rare et décevant, presque un mirage olfactif inutile.", style: "inodore" },
    { name: "Insidieux", description: "S'installe doucement dans l'air, puis frappe fort par surprise.", style: "sournois" },
    { name: "Irrévérencieux", description: "Sort dans un silence solennel, moquant toute forme de respect.", style: "irrespectueux" },

    { name: "Jaloux", description: "Pet qui vole la vedette à un autre bruit, un rival sonore.", style: "compétitif" },
    { name: "Joueur", description: "Rythmique et taquin, il suit presque la musique comme un danseur.", style: "rythmique" },
    { name: "Jovial", description: "Pet léger et amical, met de bonne humeur malgré son odeur.", style: "joyeux" },
    { name: "Jubilatoire", description: "Tellement drôle qu'on l'applaudit, un pet star de la soirée.", style: "hilarant" },
    { name: "Justicier", description: "Punition gazeuse pour les emmerdeurs, un pet vengeur et fier.", style: "vengeur" },

    { name: "Kamikaze", description: "Pet suicidaire qui sort au pire moment, sacrifiant ta dignité.", style: "suicidaire" },
    { name: "Kermesse", description: "Bruyant et festif, un pet de foire qui aime la foule.", style: "festif" },
    { name: "Ketchup", description: "Sent le fast-food rance, un pet qui rappelle le burger d'hier.", style: "rance" },
    { name: "Killer", description: "Odeur si intense qu'elle terrasse tout le monde sans exception.", style: "mortel" },
    { name: "Klaxonneur", description: "Fort et aigu, comme une corne de brume dans le brouillard.", style: "assourdissant" },

    { name: "Lâcheur", description: "Pet qui te trahit en public, un Judas des intestins.", style: "traître" },
    { name: "Légendaire", description: "Épique et mémorable, on en parlera encore dans dix ans.", style: "épique" },
    { name: "Léger", description: "Petit pet aérien, presque mignon, il flotte sans faire de vagues.", style: "léger" },
    { name: "Loupé", description: "Pet raté, juste un bruit pathétique sans vraie substance.", style: "raté" },
    { name: "Lutin", description: "Pet espiègle qui taquine les narines, un farceur miniature.", style: "espiègle" },

    { name: "Marathonien", description: "Long et persistant, il te suit partout comme un stalker.", style: "persistant" },
    { name: "Maraudeur", description: "Rôde dans l'air, prêt à frapper les narines au pire moment.", style: "rôdeur" },
    { name: "Mélomane", description: "Pet musical et varié, presque une symphonie de flatulences.", style: "musical" },
    { name: "Merdeux", description: "Pet humide et risqué, un désastre potentiel dans le slip.", style: "risqué" },
    { name: "Monstre", description: "Gros et effrayant, un pet de cauchemar qui hante les lieux.", style: "effrayant" },

    { name: "Narquois", description: "Pet qui se moque de ta gêne avec un ricanement sonore.", style: "moqueur" },
    { name: "Nécroseur", description: "Odeur de mort vivante, un pet zombie qui pourrit l'air.", style: "putride" },
    { name: "Nerveux", description: "Rapide et agité, il panique en sortant comme un fuyard.", style: "agité" },
    { name: "Noceur", description: "Pet festif après trop de bière, un habitué des nuits folles.", style: "festif" },
    { name: "Nomade", description: "Pet qui voyage loin, colonisant l'espace avec son odeur errante.", style: "voyageur" },

    { name: "Obstiné", description: "Pet qui insiste pour sortir malgré tes efforts désespérés de retenue.", style: "insistant" },
    { name: "Odeuriste", description: "Spécialiste des arômes douteux, un pet artiste du nez bouché.", style: "aromatique" },
    { name: "Opportuniste", description: "Sort pile quand quelqu'un parle, volant la scène sans vergogne.", style: "opportun" },
    { name: "Orageux", description: "Bruyant et grondant, un pet tempétueux qui annonce le chaos.", style: "tumultueux" },
    { name: "Outsider", description: "Pet inattendu, personne ne l'a vu venir, un intrus surprise.", style: "surprenant" },

    { name: "Parachutiste", description: "Léger et flottant, il descend doucement avant d'atterrir sournoisement.", style: "flottant" },
    { name: "Pestilentiel", description: "Puanteur record, un pet champion qui mérite une médaille d'horreur.", style: "pestilentiel" },
    { name: "Philosophe", description: "Lent et pensif, un pet méditatif qui semble réfléchir à l'existence.", style: "méditatif" },
    { name: "Poussiéreux", description: "Sec et vieux, comme un pet échappé d'un grimoire oublié.", style: "sec" },
    { name: "Prétentieux", description: "Pet qui se croit supérieur, une flatulence avec un ego surdimensionné.", style: "arrogant" },

    { name: "Querelleur", description: "Pet qui déclenche des disputes, accusant tout le monde autour.", style: "conflictuel" },
    { name: "Queue-de-poisson", description: "Pet qui finit en couac inattendu, un final décevant.", style: "décevant" },
    { name: "Quickie", description: "Rapide et efficace, un pet éclair qui ne traîne pas.", style: "rapide" },
    { name: "Quintuple", description: "Série de cinq pets en rafale, un combo impressionnant.", style: "multiple" },
    { name: "Quotidien", description: "Pet banal, compagnon fidèle de tes journées ordinaires.", style: "banal" },

    { name: "Râleur", description: "Gronde comme un vieux ronchon, un pet de mauvaise humeur.", style: "grognon" },
    { name: "Rebelle", description: "Sort contre ta volonté, un anarchiste qui défie ton contrôle.", style: "insoumis" },
    { name: "Ricaneur", description: "Pet qui te fait rire malgré toi, un clown sonore.", style: "ricanant" },
    { name: "Rôdeur", description: "Reste dans l'air, te suit comme un fantôme puant.", style: "persistant" },
    { name: "Royal", description: "Pet majestueux, digne d'un trône, il règne en maître.", style: "majestueux" },

    { name: "Satyre", description: "Pet moqueur qui ridiculise tout, un critique olfactif acéré.", style: "satirique" },
    { name: "Siffleur", description: "Aigu et strident, un pet qui appelle les oiseaux curieux.", style: "sifflant" },
    { name: "Sournois", description: "Discret mais dévastateur, il frappe à retardement sans prévenir.", style: "sournois" },
    { name: "Sprint", description: "Court et vif, un pet de coureur qui file rapido.", style: "rapide" },
    { name: "Symphoniste", description: "Long et varié, une œuvre d'art flatulente à écouter.", style: "mélodieux" },

    { name: "Tacticien", description: "Pet qui choisit le pire moment, un stratège du malaise.", style: "stratégique" },
    { name: "Tonnerre", description: "Bruyant et grondant, un pet divin qui fait trembler les cieux.", style: "tonitruant" },
    { name: "Toxico", description: "Odeur chimique, un pet d'usine qui sent le danger.", style: "toxique" },
    { name: "Traître", description: "Pet qui te met dans la merde, un Judas gazéifié.", style: "traître" },
    { name: "Turbulent", description: "Agité et bruyant, il secoue tout sur son passage chaotique.", style: "chaotique" },

    { name: "Uuuuh", description: "Gémissement long, pet qui sort comme un cri de désespoir fatigué.", style: "gémissant" },
    { name: "Usurpateur", description: "Pet qui vole la gloire d'un autre, imposteur olfactif audacieux.", style: "imposteur" },
    { name: "Utopiste", description: "Pet rêveur, semble promettre un monde meilleur mais pue quand même.", style: "rêveur" },
    { name: "Ultrafort", description: "Pet si puissant qu'il dépasse les limites humaines, un titan sonore.", style: "surpuissant" },
    { name: "Unificateur", description: "Pet qui rassemble tout le monde dans un dégoût commun hilarant.", style: "rassembleur" },

    { name: "Vrrr", description: "Vibration rapide, pet qui tremble comme un moteur prêt à exploser.", style: "vibrant" },
    { name: "Vagabond", description: "Pet errant, voyage sans but, laissant des traces olfactives partout.", style: "errant" },
    { name: "Vengeur", description: "Pet rancunier, punit ceux qui t'ont énervé avec une odeur féroce.", style: "vengeur" },
    { name: "Vétéran", description: "Pet ancien, sent le vécu, un survivant des repas épiques.", style: "vieux" },
    { name: "Vortex", description: "Pet tourbillonnant, aspire l'air frais pour le remplacer par son chaos.", style: "tourbillonnant" }
  ];
  
  // Calculer combien d'entrées premium montrer aux utilisateurs non-premium (30%)
  const premiumPreviewCount = Math.floor(premiumFarts.length * 0.3);
  
  // Entrées du dictionnaire à afficher en fonction du statut premium
  const displayedFartDict = isPremium 
    ? fartDictionary 
    : fartDictionary.slice(0, Math.floor(fartDictionary.length * 0.3));

  // Combinaison de tous les pets en une seule collection
  const allFarts: FartDictionaryEntry[] = [
    // Farts alphabétiques d'abord (gratuits pour les 20 premiers)
    ...fartDictionary,
    
    // Puis les freeFarts originaux (tous maintenant premium)
    ...freeFarts.map(fart => ({
      name: fart.sound,
      description: `${fart.translation} (Durée: ${fart.duration})`,
      style: fart.style,
      place: fart.place
    })),
    
    // Puis les premiumFarts (tous premium)
    ...premiumFarts.map(fart => ({
      name: fart.sound,
      description: `${fart.translation} (Durée: ${fart.duration})`,
      style: fart.style,
      place: fart.place
    }))
  ];
  
  // Fonction pour déterminer si une entrée est premium (masquée pour les non-premium)
  const isEntryPremium = (index: number) => {
    return index >= 30; // Les entrées après l'index 30 sont premium
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Image de fond */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/dictionary.png")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
      
      {/* Menu de navigation */}
      <nav className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 relative z-10">
        <div className="flex flex-wrap gap-2 mb-4 md:mb-0 justify-center">
          <Link
            href="/"
            className="bg-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-purple-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">🏠</span> Accueil
          </Link>
          <Link
            href="/dictionary"
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">📚</span> Dictionnaire
          </Link>
          <Link
            href="/forum"
            className="bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-yellow-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">💬</span> Forum
          </Link>
          <Link
            href="/foods"
            className="bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-700 transition duration-300 transform hover:scale-110 flex items-center justify-center shadow-lg text-sm sm:text-base"
          >
            <span className="mr-1">🍲</span> Aliments
          </Link>
        </div>
        <select
          className="p-2 border-2 border-orange-400 rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 transform hover:scale-105 transition-transform"
        >
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </nav>

      <div className="relative z-10">
        <h1 className="text-center mb-6 sm:mb-10 drop-shadow-lg">
          <span className="block text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-2">
            📚 Dictionnaire
          </span>
          <span className="block text-5xl sm:text-7xl md:text-8xl font-extrabold text-yellow-300 drop-shadow-xl">
            des Pets 💨
          </span>
        </h1>
      </div>
      
      <div className="w-full max-w-4xl bg-white bg-opacity-90 p-4 sm:p-8 rounded-xl shadow-2xl z-10 mb-6 sm:mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 text-center">Guide Complet des Flatulences</h2>
          
          {!isPremium && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-3 py-1 rounded-lg text-sm">
              <span className="font-medium flex items-center">
                <span className="mr-1">🔒</span> Mode limité - <Link href="/premium" className="underline">Passer en Premium</Link>
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {displayedFartDict.map((entry, index) => {
            const isPremiumEntry = isEntryPremium(index);
            
            if (!isPremiumEntry || isPremium) {
              return (
                <div key={index} className={`bg-${entry.style}-100 p-4 sm:p-6 rounded-lg shadow-md`}>
                  <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-2 sm:mb-3">
                    {entry.name}
                    {isPremiumEntry && (
                      <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1 py-0.5 rounded-full">
                        PREMIUM
                      </span>
                    )}
                  </h3>
                  <p className="text-sm sm:text-base text-orange-600">{entry.description}</p>
                </div>
              );
            }
            
            return (
              <div key={index} className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md opacity-50 grayscale">
                <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-2 sm:mb-3 flex items-center">
                  {entry.name}
                  <span className="ml-2 text-xs bg-red-200 text-red-800 px-1 py-0.5 rounded-full">
                    🔒 PREMIUM
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-orange-600">(Accès Premium requis)</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 