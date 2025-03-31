"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const PersonalitySection: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [analysisText, setAnalysisText] = useState<string>("");
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
    
    generateAnalysisWithMistral(style, place, sound, duration);
    
    // Marquer que l'appel API a été effectué
    apiCallMadeRef.current = true;
  }, [searchParams]);
  
  const generateAnalysisWithMistral = async (style: string, place: string, sound: string, duration: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("PersonalitySection - Envoi de la requête API pour l'analyse de situation");
      
      // Appeler l'API Mistral pour générer l'analyse psychologique
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'analyse-situation',
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
        throw new Error(`Erreur API: ${response.status} - ${errorData.error || 'Erreur inconnue'}`);
      }
      
      const data = await response.json();
      console.log("PersonalitySection - Réponse reçue de l'API Mistral");
      
      // Utiliser l'analyse générée par Mistral
      setAnalysisText(data.analysis);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'analyse de situation:', error);
      setError("Erreur lors de la génération de l'analyse");
      
      // Utiliser une analyse de secours en cas d'échec
      setAnalysisText("🌋 RUPTURE SPATIO-TEMPORELLE EN COURS ! Ce pet a créé une distorsion dans ${place} qui terrorise les physiciens quantiques. Total chaos acoustique de ${duration}s ! Les particules subatomiques se sont rebellées, créant une faille dans le continuum espace-temps. Les objets lévitent, les mots prononcés se transforment en bulles iridescentes, et trois scientifiques du CERN viennent d'appeler pour demander vos conseils en matière de fusion froide intestinale.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-[1.01] transition-transform mb-8">
      <h2 className="text-2xl font-bold text-amber-800 mb-4 flex items-center">
        <span className="text-amber-600 mr-2">🧐</span> Analyse de Situation
      </h2>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-amber-100 rounded w-3/4"></div>
          <div className="h-5 bg-amber-100 rounded"></div>
          <div className="h-5 bg-amber-100 rounded w-5/6"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-lg border border-amber-200 shadow-inner">
          <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-amber-100">
            <div className="text-lg font-medium text-amber-900 leading-relaxed">
              {analysisText}
            </div>
            <div className="mt-3 pt-3 border-t border-amber-100 flex justify-end">
              <div className="text-sm text-amber-600 font-semibold italic">
                — Analyse de situation par notre collectif d'humoristes délirants
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalitySection; 