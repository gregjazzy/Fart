'use client';

import { useState } from 'react';
import { useTokens } from '../TokenProvider';

// Types pour les différents états d'analyse
type AnalysisStatus = 'idle' | 'checking' | 'needsPremium' | 'processing' | 'completed' | 'error';

// Hook pour gérer une analyse premium
export default function usePremiumAnalysis() {
  const { tokensRemaining, isPremiumActive, consumeToken } = useTokens();
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour démarrer une analyse premium
  const runPremiumAnalysis = async (analysisFunction: () => Promise<any>) => {
    setStatus('checking');
    setError(null);
    
    // Vérifier si l'utilisateur a des tokens premium
    if (!isPremiumActive || tokensRemaining <= 0) {
      setStatus('needsPremium');
      setError('Vous devez activer le mode premium pour effectuer cette analyse');
      return null;
    }
    
    // Consommer un token
    const tokenConsumed = consumeToken();
    if (!tokenConsumed) {
      setStatus('needsPremium');
      setError('Impossible de consommer un token premium');
      return null;
    }
    
    try {
      // Exécuter l'analyse
      setStatus('processing');
      const analysisResult = await analysisFunction();
      
      // Mettre à jour l'état avec le résultat
      setResult(analysisResult);
      setStatus('completed');
      return analysisResult;
    } catch (err) {
      console.error('Erreur lors de l\'analyse premium:', err);
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'analyse');
      return null;
    }
  };

  return {
    runPremiumAnalysis,
    status,
    result,
    error,
    isChecking: status === 'checking',
    isProcessing: status === 'processing',
    isCompleted: status === 'completed',
    isError: status === 'error',
    needsPremium: status === 'needsPremium'
  };
} 