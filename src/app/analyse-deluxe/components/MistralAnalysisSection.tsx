"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const MistralAnalysisSection: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysisTitle, setAnalysisTitle] = useState<string>("");
  const [analysisText, setAnalysisText] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiCallMadeRef = useRef(false);
  
  useEffect(() => {
    // Éviter les appels multiples à l'API
    if (apiCallMadeRef.current) return;
    
    // Récupérer les paramètres de l'URL pour enrichir l'analyse
    const style = searchParams.get('style') || 'classique';
    const place = searchParams.get('place') || 'inconnu';
    const sound = searchParams.get('sound') || '';
    const duration = searchParams.get('duration') || '1';
    
    generateAdvancedAnalysisWithMistral(style, place, sound, duration);
    
    // Marquer que l'appel API a été effectué
    apiCallMadeRef.current = true;
  }, [searchParams]);
  
  const generateAdvancedAnalysisWithMistral = async (style: string, place: string, sound: string, duration: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("MistralAnalysisSection - Envoi de la requête API");
      
      // Appeler l'API Mistral pour générer l'analyse scientifique avancée
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'traduction-personnalite',
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
          console.log("MistralAnalysisSection - Accès premium requis, redirection vers:", errorData.redirectTo);
          router.push(errorData.redirectTo);
          return;
        }
        
        throw new Error(`Erreur API: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("MistralAnalysisSection - Réponse reçue");
      
      // Diviser le texte en paragraphes
      const paragraphs = data.analysis.split(/\n\n+/).filter((p: string) => p.trim().length > 0);
      
      // Le premier paragraphe est le titre
      if (paragraphs.length > 0) {
        setAnalysisTitle(paragraphs[0]);
        setAnalysisText(paragraphs.slice(1));
      } else {
        setAnalysisTitle("Traduction de votre pet en traits de personnalité");
        setAnalysisText(["Aucune analyse disponible."]);
      }
    } catch (error) {
      console.error('Erreur lors de la génération de la traduction de personnalité:', error);
      setError("Erreur lors de la génération de l'analyse. Veuillez réessayer.");
      // Utiliser des données de secours en cas d'erreur
      setAnalysisTitle("Traduction de votre pet en traits de personnalité");
      setAnalysisText([
        "TRAIT PRINCIPAL: Perfectionniste excentrique avec tendances anarchistes gastronomiques.",
        
        "TRAIT SECONDAIRE: Communicateur subversif utilisant des canaux non-conventionnels d'expression corporelle.",
        
        "CONSEIL: Assumez votre art sonore en public pour devenir une légende urbaine!"
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-300 mb-8 border border-purple-100 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      
      <div className="relative">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 mb-5 flex items-center">
          <span className="text-purple-600 mr-3 bg-purple-100 p-1.5 rounded-lg shadow-sm">🧠</span> 
          Analyse de Personnalité Avancée
        </h2>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200 shadow-inner">
          <div className="bg-white/80 p-6 rounded-xl shadow-sm border border-indigo-100">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-7 bg-purple-100 rounded-lg w-3/4 mx-auto mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-purple-100/80 rounded w-full"></div>
                  <div className="h-4 bg-purple-100/80 rounded w-11/12"></div>
                  <div className="h-4 bg-purple-100/80 rounded w-full"></div>
                  <div className="h-4 bg-purple-100/80 rounded w-10/12"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">
                {error}
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-500 mb-6">
                  {analysisTitle}
                </h3>
                <div className="text-base text-purple-900 leading-relaxed space-y-6">
                  {analysisText.map((paragraph, index) => (
                    <p key={index} className="first-letter:text-xl first-letter:font-serif first-letter:font-bold first-letter:text-purple-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            )}
            <div className="mt-6 pt-3 border-t border-purple-100 flex justify-end">
              <div className="text-sm text-indigo-600 font-semibold italic">
                — Analyse réalisée par notre collectif d'experts en traduction de flatulences
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MistralAnalysisSection; 