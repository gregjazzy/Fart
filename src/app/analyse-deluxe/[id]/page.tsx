import React from 'react';
import { notFound } from 'next/navigation';
import IntroSection from '../components/IntroSection';
import ScientificReportSection from '../components/ScientificReportSection';
import PersonalitySection from '../components/PersonalitySection';
import CriticalSection from '../components/CriticalSection';
import MistralAnalysisSection from '../components/MistralAnalysisSection';
import { AnalysisContent, generateDefaultAnalysisContent } from '../utils/contentGeneration';

export default function AnalyseDeluxePage({ params }: { params: { id: string }}) {
  // Générer le contenu d'analyse par défaut
  const content: AnalysisContent = generateDefaultAnalysisContent();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-amber-50 pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-amber-800 mb-3 drop-shadow-sm">
            Analyse Deluxe
          </h1>
          <p className="text-amber-700/80 text-xl font-medium">
            L'analyse ultra-complète de votre performance
          </p>
        </header>
        
        <div className="space-y-8">
          {/* Introduction générée avec les paramètres de l'URL */}
          <IntroSection />
          
          {/* Section personnalité avec analyse Mistral */}
          <PersonalitySection />
          
          {/* Section critique artistique avec analyse Mistral */}
          <CriticalSection />
          
          {/* Section rapport scientifique générée avec paramètres */}
          <ScientificReportSection analysis={content} />
          
          {/* Section d'analyse avancée avec Mistral Medium */}
          <MistralAnalysisSection />
        </div>
      </div>
    </div>
  );
} 