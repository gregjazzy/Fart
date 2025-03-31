"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const IntroSection: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [intro, setIntro] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiCallMadeRef = useRef(false);
  
  useEffect(() => {
    // Éviter d'appeler l'API plusieurs fois
    if (apiCallMadeRef.current) return;
    
    // Récupérer les paramètres de l'URL
    const sound = searchParams.get('sound') || 'prrrt';
    const place = searchParams.get('place') || 'inconnu';
    const duration = searchParams.get('duration') || '1';
    const style = searchParams.get('style') || 'classique';
    
    // Générer une introduction avec Mistral
    generateIntroWithMistral(sound, place, style, duration);
    
    // Marquer que l'appel API a été fait
    apiCallMadeRef.current = true;
  }, [searchParams]);
  
  const generateIntroWithMistral = async (sound: string, place: string, style: string, duration: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("IntroSection - Envoi de la requête à l'API Mistral pour l'introduction");
      
      // Appeler l'API Mistral pour générer l'introduction
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'introduction',
          params: {
            sound,
            place,
            style,
            duration
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur API: ${response.status} - ${errorData.error || 'Erreur inconnue'}`);
      }
      
      const data = await response.json();
      console.log("IntroSection - Réponse reçue de l'API Mistral");
      
      // Utiliser l'analyse générée par Mistral
      setIntro(data.analysis);
      return data.analysis;
    } catch (error) {
      console.error('Erreur lors de la génération de l\'introduction:', error);
      setError("Erreur lors de la génération de l'introduction");
      
      // Utiliser une intro de secours ultra-courte en cas d'échec
      const fallbackText = `🚨 ALERTE SONORE "${sound}" : ${duration}s de pur chaos ${style} dans ${place} ! Vos intestins parlent la langue des dieux... et ils sont FURIEUX ! 🌪️`;
      setIntro(fallbackText);
      return fallbackText;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-[1.01] transition-transform mb-8">
      <h2 className="text-2xl font-bold text-indigo-800 mb-4 flex items-center">
        <span className="text-indigo-600 mr-2">✨</span> Introduction Personnalisée
      </h2>
      
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200 shadow-inner">
        <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-indigo-100">
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-indigo-100 rounded w-3/4"></div>
              <div className="h-4 bg-indigo-100 rounded"></div>
              <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
              <div className="h-4 bg-indigo-100 rounded w-2/3"></div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div className="text-lg font-medium text-indigo-800 leading-relaxed">
              <p>{intro}</p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <div className="text-sm text-indigo-600 font-semibold">
              — Rédigé par notre collectif d'humoristes experts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroSection; 