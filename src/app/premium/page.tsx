"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTokens } from "../TokenProvider";

export default function PremiumPage() {
  const router = useRouter();
  const { tokensRemaining, expiryTime, isPremiumActive } = useTokens();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Formatage du temps restant
  const formatTimeLeft = () => {
    if (!expiryTime) return "Aucun accès premium";
    
    const now = Date.now();
    if (now >= expiryTime) return "Expiré";
    
    const timeLeftMs = expiryTime - now;
    const hours = Math.floor(timeLeftMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  };
  
  // Gestion du paiement avec Stripe
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log("[Premium] Demande de création de session de paiement");
      
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création de la session de paiement");
      }
      
      const data = await response.json();
      console.log("[Premium] Session créée, URL:", data.url);
      
      // Rediriger vers l'URL de paiement Stripe
      if (data.url) {
        router.push(data.url);
      } else {
        throw new Error("L'URL de paiement n'a pas été reçue");
      }
    } catch (error) {
      console.error("[Premium] Erreur de paiement:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue lors du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Fond avec dégradé */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-75" style={{ backgroundImage: 'url("/images/premium-background.jpg")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-indigo-900/90 to-blue-900/90"></div>
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
      </nav>

      {/* Section Premium */}
      <div className="max-w-4xl w-full relative z-10 mt-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-200 mb-4 drop-shadow-lg">
            Mode Premium
          </h1>
          <p className="text-xl text-white max-w-xl mx-auto">
            Débloquez l'accès complet à toutes les fonctionnalités de notre application !
          </p>
        </div>

        {/* Affichage du statut premium */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">⭐</span> Votre statut premium
          </h2>
          
          <div className="text-white">
            {isPremiumActive ? (
              <div className="bg-green-200 p-4 rounded-xl mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">✅</span>
                  <span className="font-bold text-green-800">Accès Premium Actif</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-800 mb-1">Jetons restants:</p>
                    <p className="font-bold text-xl text-green-800">{tokensRemaining} jetons</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-800 mb-1">Temps restant:</p>
                    <p className="font-bold text-xl text-green-800">{formatTimeLeft()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-4 rounded-xl mb-4">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-2">❌</span>
                  <span className="font-bold">Aucun accès premium</span>
                </div>
                <p className="text-white/80">
                  Vous n'avez pas encore activé le mode premium. Achetez un pack pour profiter de toutes les fonctionnalités.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Offre Premium */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <span className="mr-2">💎</span> Pack Premium
          </h2>
          
          <div className="bg-gradient-to-br from-indigo-600/40 to-purple-600/40 rounded-xl p-4 mb-6 border border-indigo-400/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Pack Premium - 2 jetons</h3>
              <span className="text-2xl font-bold text-yellow-300">1€</span>
            </div>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-green-400 mr-2 text-lg">✓</span>
                <span className="text-white">2 jetons pour des analyses avancées</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2 text-lg">✓</span>
                <span className="text-white">Accès à toutes les entrées du dictionnaire</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2 text-lg">✓</span>
                <span className="text-white">Accès à tous les sujets du forum</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2 text-lg">✓</span>
                <span className="text-white">Valable 24 heures</span>
              </li>
            </ul>
            
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg transform transition duration-300 ${
                isLoading 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 hover:scale-105'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement en cours...
                </span>
              ) : (
                'Acheter maintenant'
              )}
            </button>
            
            {error && (
              <p className="mt-4 text-red-400 text-center bg-red-900/30 p-2 rounded">
                {error}
              </p>
            )}
          </div>
          
          <p className="text-sm text-white/60 text-center">
            Paiement sécurisé via Stripe. Aucun abonnement récurrent.
          </p>
        </div>
      </div>
    </div>
  );
} 