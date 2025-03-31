'use client';

import { useState } from 'react';
import { useTokens } from '@/app/TokenProvider';

export default function PremiumButton() {
  const { tokensRemaining, expiryTime, isPremiumActive, activatePremium } = useTokens();
  const [isLoading, setIsLoading] = useState(false);

  const handleActivatePremium = () => {
    setIsLoading(true);
    
    // Simuler un appel API (paiement Stripe par exemple)
    setTimeout(() => {
      activatePremium();
      setIsLoading(false);
    }, 1000);
  };

  // Formater la date d'expiration
  const formatExpiryDate = () => {
    if (!expiryTime) return null;
    return new Date(expiryTime).toLocaleString();
  };

  // Calculer le temps restant
  const getTimeRemaining = () => {
    if (!expiryTime) return null;
    
    const remaining = expiryTime - Date.now();
    if (remaining <= 0) return 'Expiré';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isPremiumActive ? (
        <div className="bg-orange-100 border-2 border-orange-300 rounded-lg p-4 w-full max-w-sm">
          <h3 className="text-xl font-bold text-orange-800 mb-2">Mode Premium Actif 🌟</h3>
          <p className="text-sm text-orange-700 mb-2">
            <span className="font-semibold">Tokens restants:</span> {tokensRemaining}/3
          </p>
          <p className="text-sm text-orange-700">
            <span className="font-semibold">Expire dans:</span> {getTimeRemaining()}
          </p>
          <p className="text-xs text-orange-600 mt-2">
            (Expire le {formatExpiryDate()})
          </p>
        </div>
      ) : (
        <button
          onClick={handleActivatePremium}
          disabled={isLoading}
          className={`
            px-6 py-3 rounded-lg font-semibold text-white
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-orange-500 hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl'}
            transform hover:-translate-y-0.5 transition-transform
          `}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Activation...
            </span>
          ) : (
            <>Activer Mode Premium (3 tokens - 24h)</>
          )}
        </button>
      )}
    </div>
  );
} 