"use client";

import Link from "next/link";

export default function PremiumCancelPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Image de fond */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/premium-background.jpg")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-amber-900/30"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white rounded-full p-3">
                <svg className="h-12 w-12 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm1-9a1 1 0 00-1 1v4a1 1 0 102 0V5a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Paiement annulé</h1>
            <p className="text-center mt-2 text-orange-100">Aucun prélèvement n'a été effectué</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Vous avez annulé votre achat</h2>
              <p className="text-gray-600">
                Pas de problème ! Vous pouvez revenir quand vous voulez.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-orange-800 mb-2 flex items-center">
                <span className="mr-2">🤔</span> Pourquoi essayer Premium ?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">•</span> Accès à toutes les fonctionnalités du site
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">•</span> Contenu exclusif et approfondi
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">•</span> Analyses premium détaillées
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">•</span> Seulement 1€ pour 24h d'accès complet
                </li>
              </ul>
            </div>
            
            <div className="text-center space-y-3">
              <Link 
                href="/"
                className="block w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all"
              >
                Retour à l'accueil
              </Link>
              <Link 
                href="/premium"
                className="block w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all"
              >
                Réessayer Premium
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-white">
          <p className="font-bold">© 2024 Pétomane Studio</p>
          <p className="text-sm mt-1 text-amber-200">
            Vous pouvez toujours profiter des fonctionnalités gratuites !
          </p>
        </div>
      </div>
    </div>
  );
} 