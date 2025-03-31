import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AnalysisContent } from '../utils/contentGeneration';

interface IntroductionSectionProps {
  analysisContent: AnalysisContent;
}

const IntroductionSection: React.FC<IntroductionSectionProps> = ({ analysisContent }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [introduction, setIntroduction] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer les paramètres de l'URL pour enrichir l'introduction
    const style = searchParams.get('style') || 'classique';
    const place = searchParams.get('place') || 'inconnu';
    const sound = searchParams.get('sound') || '';
    const duration = searchParams.get('duration') || '1';
    generateIntroWithMistral(style, place, sound, duration);
  }, [searchParams]);

  const generateIntroWithMistral = async (style: string, place: string, sound: string, duration: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Appeler l'API Mistral pour générer l'introduction
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'introduction',
          params: {
            style,
            place,
            sound,
            duration
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Si l'erreur est un accès premium requis, rediriger vers la page premium
        if (response.status === 403 && errorData.redirectTo) {
          alert("Vous n'avez pas de jetons premium disponibles. Veuillez acheter des jetons pour accéder à l'analyse détaillée.");
          router.push(errorData.redirectTo);
          return;
        }
        
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      
      // Diviser le texte en paragraphes
      const paragraphs = data.introduction.split(/\n\n+/).filter((p: string) => p.trim().length > 0);
      setIntroduction(paragraphs);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'introduction:', error);
      setError("Erreur lors de la génération de l'introduction. Veuillez réessayer.");
      // Utiliser les données par défaut en cas d'erreur
      setIntroduction([
        "Bienvenue dans votre analyse de flatulence de luxe. Notre équipe d'experts a minutieusement examiné votre échantillon sonore pour en extraire les informations les plus pertinentes.",
        "Ce rapport détaillé vous offre un aperçu profond de ce que votre expression gastrointestinale révèle sur votre alimentation, votre santé et même votre personnalité."
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-300 mb-8 border border-blue-100 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-5 flex items-center">
          <span className="text-blue-600 mr-3 bg-blue-100 p-1.5 rounded-lg shadow-sm">📊</span> 
          Rapport d'Analyse Deluxe
        </h2>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-inner">
          <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-indigo-100">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-4 bg-blue-100/80 rounded w-3/4"></div>
                <div className="h-4 bg-blue-100/80 rounded w-full"></div>
                <div className="h-4 bg-blue-100/80 rounded w-5/6"></div>
                <div className="h-4 bg-blue-100/80 rounded w-3/4"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">
                {error}
              </div>
            ) : (
              <div className="text-base text-gray-700 leading-relaxed space-y-4">
                {introduction.map((paragraph, index) => (
                  <p key={index} className="first-letter:text-xl first-letter:font-serif first-letter:font-bold first-letter:text-blue-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroductionSection; 