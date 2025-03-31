"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const CriticalSection: React.FC = () => {
  const searchParams = useSearchParams();
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
    
    generateCriticalAnalysis(style, place, sound, duration);
    
    // Marquer que l'appel API a été effectué
    apiCallMadeRef.current = true;
  }, [searchParams]);
  
  const generateCriticalAnalysis = async (style: string, place: string, sound: string, duration: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("CriticalSection - Envoi de la requête API pour l'analyse critique");
      
      // Appeler l'API Mistral pour générer l'analyse critique
      const response = await fetch('/api/mistral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'analyse-critique',
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
      console.log("CriticalSection - Réponse reçue de l'API Mistral");
      
      // Utiliser l'analyse générée par Mistral
      setAnalysisText(data.analysis);
    } catch (error) {
      console.error('Erreur lors de la génération de l\'analyse critique:', error);
      setError("Erreur lors de la génération de l'analyse");
      
      // Utiliser une analyse de secours en cas d'échec
      setAnalysisText("⭐ VERDICT ARTISTIQUE: Ce pet de ${duration}s à ${place} est une œuvre d'avant-garde ! Équilibre sonore déconcertant, texture inattendue et finale abrupt qui défie les conventions. Un chef-d'œuvre malodorant !");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-[1.01] transition-transform mb-8">
      <h2 className="text-2xl font-bold text-teal-800 mb-4 flex items-center">
        <span className="text-teal-600 mr-2">🎭</span> Critique Artistique
      </h2>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-teal-100 rounded w-3/4"></div>
          <div className="h-5 bg-teal-100 rounded"></div>
          <div className="h-5 bg-teal-100 rounded w-5/6"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="bg-gradient-to-br from-teal-50 to-emerald-50 p-5 rounded-lg border border-teal-200 shadow-inner">
          <div className="bg-white/80 p-4 rounded-lg shadow-sm border border-teal-100">
            <div className="text-lg font-medium text-teal-900 leading-relaxed">
              {analysisText}
            </div>
            <div className="mt-3 pt-3 border-t border-teal-100 flex justify-end">
              <div className="text-sm text-teal-600 font-semibold italic">
                — Critique par notre IA critique d'art flatulentiel
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriticalSection; 