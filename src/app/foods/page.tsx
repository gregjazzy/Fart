"use client";

import Link from "next/link";
import { useTokens } from "../TokenProvider";

export default function Foods() {
  const { hasFullAccess } = useTokens();
  const isPremium = hasFullAccess;

  // Définition des catégories d'aliments
  const foodCategories = [
    {
      title: "Aliments Propulseurs",
      color: "yellow",
      emoji: "🚀",
      foods: [
        { name: "Haricots rouges", effect: "Son puissant, longue durée", emoji: "🫘" },
        { name: "Choux de Bruxelles", effect: "Arôme persistant", emoji: "🥬" },
        { name: "Oignons crus", effect: "Effets secondaires surprenants", emoji: "🧅" },
        { name: "Brocoli", effect: "Puissance modérée, haute intensité", emoji: "🥦" },
        { name: "Pois chiches", effect: "Durée impressionnante", emoji: "🫘" },
        { name: "Topinambours", effect: "Puissance maximale garantie", emoji: "🌰", premium: true },
        { name: "Artichauts", effect: "Expérience olfactive unique", emoji: "🌱", premium: true },
        { name: "Poivrons", effect: "Effet retardé mais puissant", emoji: "🫑", premium: true }
      ]
    },
    {
      title: "Aliments Musicaux",
      color: "green",
      emoji: "🎵",
      foods: [
        { name: "Lentilles", effect: "Notes variées et surprenantes", emoji: "🫘" },
        { name: "Œufs durs", effect: "Tonalité unique", emoji: "🥚" },
        { name: "Maïs soufflé", effect: "Rythme staccato", emoji: "🍿" },
        { name: "Chou-fleur", effect: "Mélodies complexes", emoji: "🥦" },
        { name: "Produits laitiers", effect: "Pour ceux avec intolérance", emoji: "🧀" },
        { name: "Patates douces", effect: "Harmonies sophistiquées", emoji: "🍠", premium: true },
        { name: "Noix de cajou", effect: "Cadence régulière et mesurée", emoji: "🌰", premium: true },
        { name: "Pruneaux", effect: "Vibrations basses fréquences", emoji: "🍑", premium: true }
      ]
    },
    {
      title: "Aliments Explosifs",
      color: "orange",
      emoji: "💣",
      foods: [
        { name: "Choux", effect: "Puissance maximale garantie", emoji: "🥬" },
        { name: "Bière", effect: "Carbonatation naturelle", emoji: "🍺" },
        { name: "Sodas", effect: "Effets rapides et bruyants", emoji: "🥤" },
        { name: "Épices fortes", effect: "Parfum mémorable", emoji: "🌶️" },
        { name: "Légumineuses", effect: "Longévité impressionnante", emoji: "🌱" },
        { name: "Champignons", effect: "Détonation différée", emoji: "🍄", premium: true },
        { name: "Tempeh fermenté", effect: "Explosion à retardement", emoji: "🍲", premium: true },
        { name: "Ail noir", effect: "Dévastation olfactive", emoji: "🧄", premium: true }
      ]
    },
    {
      title: "Aliments Discrets",
      color: "blue",
      emoji: "🥷",
      foods: [
        { name: "Riz blanc", effect: "Parfait pour les réunions", emoji: "🍚" },
        { name: "Pain blanc", effect: "Option silencieuse", emoji: "🍞" },
        { name: "Bananes", effect: "Douceur digestive", emoji: "🍌" },
        { name: "Poisson grillé", effect: "Sans surprises désagréables", emoji: "🐟" },
        { name: "Eau plate", effect: "Neutralité garantie", emoji: "💧" },
        { name: "Yaourt nature", effect: "La discrétion absolue", emoji: "🥛", premium: true },
        { name: "Concombre", effect: "Passe inaperçu en toute occasion", emoji: "🥒", premium: true },
        { name: "Tofu", effect: "L'art de la neutralité", emoji: "🧊", premium: true }
      ]
    },
  ];

  // Fonction pour déterminer si un aliment est accessible
  const isFoodAccessible = (food: { premium?: boolean }) => {
    return !food.premium || isPremium;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Image de fond */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/foods.png")' }}></div>
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
            🍲 Aliments
          </span>
          <span className="block text-5xl sm:text-7xl md:text-8xl font-extrabold text-yellow-300 drop-shadow-xl">
            pour Pets 💨
          </span>
        </h1>
      </div>
      
      <div className="w-full max-w-4xl bg-white bg-opacity-90 p-4 sm:p-8 rounded-xl shadow-2xl z-10 mb-6 sm:mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 text-center">Guide Nutritionnel pour Pétomanes</h2>
          
          {!isPremium && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-3 py-1 rounded-lg text-sm">
              <span className="font-medium flex items-center">
                <span className="mr-1">🔒</span> Mode limité - <Link href="/premium" className="underline">Passer en Premium</Link>
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {foodCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className={`bg-${category.color}-100 p-4 sm:p-6 rounded-lg shadow-md`}>
              <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-2 sm:mb-3 flex items-center">
                <span className="text-xl sm:text-2xl mr-2">{category.emoji}</span> {category.title}
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                {category.foods.map((food, foodIndex) => {
                  // Afficher l'élément normalement s'il est accessible
                  if (isFoodAccessible(food)) {
                    return (
                      <li key={foodIndex} className="flex items-center">
                        <span className="text-lg sm:text-xl mr-2">{food.emoji}</span>
                        <div>
                          <span className="font-medium text-orange-800 text-sm sm:text-base">
                            {food.name}
                            {food.premium && (
                              <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-1 py-0.5 rounded-full">
                                PREMIUM
                              </span>
                            )}
                          </span>
                          <span className="text-xs sm:text-sm ml-1 sm:ml-2 text-orange-600 block sm:inline-block">
                            ({food.effect})
                          </span>
                        </div>
                      </li>
                    );
                  }
                  
                  // Afficher une version grisée pour les éléments premium non accessibles
                  return (
                    <li key={foodIndex} className="flex items-center opacity-50 grayscale">
                      <span className="text-lg sm:text-xl mr-2">{food.emoji}</span>
                      <div>
                        <span className="font-medium text-orange-800 text-sm sm:text-base flex items-center">
                          {food.name}
                          <span className="ml-2 text-xs bg-red-200 text-red-800 px-1 py-0.5 rounded-full">
                            🔒 PREMIUM
                          </span>
                        </span>
                        <span className="text-xs sm:text-sm ml-1 sm:ml-2 text-orange-600 block sm:inline-block">
                          (Accès Premium requis)
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="bg-purple-100 p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">🧪</span> Recettes Expérimentales
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-bold text-orange-800">La Symphonie des Haricots</h4>
              <p className="text-sm text-orange-700 mb-2">Durée: 6-8 heures après ingestion</p>
              <p className="text-orange-600">Mélange de trois types de haricots, oignons rouges et poivrons. Effets garantis pendant une soirée entière.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-bold text-orange-800">Le Cocktail du Désespoir</h4>
              <p className="text-sm text-orange-700 mb-2">Durée: 2-4 heures après ingestion</p>
              <p className="text-orange-600">Bière, choux de Bruxelles et œufs. À consommer uniquement quand vous êtes sûr de rester seul.</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-bold text-orange-800">L'Arme Secrète</h4>
              <p className="text-sm text-orange-700 mb-2">Durée: 12-24 heures après ingestion</p>
              <p className="text-orange-600">Chili con carne ultra-épicé avec extra haricots rouges. Solution nucléaire pour les vengeances personnelles.</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-lg shadow-lg text-center">
          <h3 className="text-xl font-bold text-white mb-3">🚨 Avertissement Pétomane 🚨</h3>
          <p className="text-white">Ces informations sont fournies uniquement à des fins éducatives. L'équipe de Pétomane Studio décline toute responsabilité en cas de ruptures sociales, divorces ou pertes d'emploi suite à l'application de ces conseils nutritionnels.</p>
        </div>
      </div>
      
      <div className="mt-12 w-full max-w-lg text-center relative z-10 bg-white bg-opacity-10 backdrop-blur-md p-4 rounded-2xl">
        <p className="text-white font-bold">
          © 2024 Pétomane Studio - 100% sans filtres à charbon
        </p>
        <p className="text-yellow-200 text-sm mt-1">
          La science flatulente au service de l'humanité !
        </p>
      </div>
    </div>
  );
} 