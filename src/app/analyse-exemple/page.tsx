'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import usePremiumAnalysis from '../hooks/usePremiumAnalysis';

// Type pour les recommandations
type AnalysisResult = {
  title: string;
  score: number;
  mood: string;
  details: string;
  recommendations: string[];
};

export default function AnalyseExemplePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const { 
    runPremiumAnalysis, 
    status, 
    result, 
    error,
    isProcessing, 
    needsPremium 
  } = usePremiumAnalysis();

  // Fonction qui simule une analyse premium
  const performAnalysis = async (): Promise<AnalysisResult> => {
    // Cette fonction sera exécutée seulement si l'utilisateur a des tokens premium
    return new Promise((resolve) => {
      // Simuler une analyse qui prend du temps
      setTimeout(() => {
        resolve({
          title: "Analyse premium complète",
          score: Math.floor(Math.random() * 100),
          mood: ["Joyeux", "Énergique", "Intense"][Math.floor(Math.random() * 3)],
          details: "Cette analyse détaillée est générée grâce à un token premium. Elle contient des informations avancées sur la texture, l'intensité et les caractéristiques sonores de votre pet.",
          recommendations: [
            "Ajoutez plus de fibres à votre alimentation",
            "Buvez plus d'eau pour améliorer la sonorité",
            "Évitez les aliments gazeux avant les rencontres importantes"
          ]
        });
      }, 2000);
    });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Vérifie et consomme un token premium si disponible
    const analysisResult = await runPremiumAnalysis(performAnalysis);
    console.log("Résultat de l'analyse:", analysisResult);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-5">
          <h1 className="text-2xl font-bold text-white">Analyse Premium</h1>
          <p className="text-amber-100">Cette analyse consomme un token premium</p>
        </div>
        
        <div className="p-6">
          {needsPremium ? (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-bold text-amber-800 mb-2">Mode Premium Requis ✨</h3>
              <p className="text-amber-700 mb-4">
                Vous devez activer le mode premium et avoir au moins un token disponible pour effectuer cette analyse.
              </p>
              <Link 
                href="/premium" 
                className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Obtenir des tokens premium
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Décrivez votre pet (exemple)
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 min-h-[100px]"
                  placeholder="Par exemple: Un pet sonore et long après avoir mangé des haricots..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isProcessing}
                className={`
                  w-full py-3 rounded-lg text-white font-bold 
                  ${isProcessing 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md hover:shadow-lg'}
                  transition-all
                `}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyse en cours...
                  </span>
                ) : (
                  'Lancer l\'analyse premium (utilise 1 token)'
                )}
              </button>
            </form>
          )}
          
          {/* Affichage des résultats */}
          {result && (
            <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-5">
              <h3 className="text-xl font-bold text-green-800 mb-3">{result.title}</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-2xl font-bold text-amber-600">{result.score}/100</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="text-sm text-gray-500">Humeur</p>
                  <p className="text-xl font-bold text-purple-600">{result.mood}</p>
                </div>
              </div>
              
              <p className="mb-4 text-gray-700">{result.details}</p>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Recommandations</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {result.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-blue-700">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Lien de retour */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-orange-600 hover:text-orange-800 font-medium">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 