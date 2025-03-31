'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Constantes pour les cookies
const TOKENS_COOKIE = 'premium_tokens';
const EXPIRY_COOKIE = 'premium_expiry';

type TokenContextType = {
  tokensRemaining: number;
  expiryTime: number | null;
  isPremiumActive: boolean;
  activatePremium: () => Promise<boolean>;
  consumeToken: () => Promise<boolean>;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: ReactNode }) {
  const [tokensRemaining, setTokensRemaining] = useState<number>(0);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [isPremiumActive, setIsPremiumActive] = useState<boolean>(false);

  useEffect(() => {
    // Charger les tokens depuis les cookies
    const storedTokens = Cookies.get(TOKENS_COOKIE);
    const storedExpiry = Cookies.get(EXPIRY_COOKIE);

    console.log('[TokenProvider] Cookies chargés:', { 
      tokens: storedTokens || 'non défini', 
      expiry: storedExpiry || 'non défini' 
    });

    if (storedTokens) {
      setTokensRemaining(parseInt(storedTokens, 10));
    }

    if (storedExpiry) {
      const expiry = parseInt(storedExpiry, 10);
      if (expiry > Date.now()) {
        setExpiryTime(expiry);
        setIsPremiumActive(true);
        console.log('[TokenProvider] Premium actif, expire le:', new Date(expiry).toLocaleString());
      } else {
        // Si expiré, réinitialiser
        console.log('[TokenProvider] Premium expiré, nettoyage des cookies');
        Cookies.remove(TOKENS_COOKIE);
        Cookies.remove(EXPIRY_COOKIE);
      }
    }
  }, []);

  // Mettre à jour isPremiumActive quand expiryTime change
  useEffect(() => {
    if (!expiryTime) {
      setIsPremiumActive(false);
      return;
    }
    
    const isActive = Date.now() < expiryTime;
    setIsPremiumActive(isActive);
    
    console.log('[TokenProvider] Statut premium mis à jour:', { 
      isActive,
      tokensRemaining,
      expiryTime: expiryTime ? new Date(expiryTime).toLocaleString() : 'non défini'
    });
  }, [expiryTime, tokensRemaining]);

  const activatePremium = async () => {
    try {
      // Définir 3 tokens et une durée de 24h
      const tokens = 3;
      const expiry = Date.now() + (24 * 60 * 60 * 1000);

      console.log('[TokenProvider] Activation premium avec:', {
        tokens,
        expiry: new Date(expiry).toLocaleString()
      });

      // Sauvegarder dans les cookies
      Cookies.set(TOKENS_COOKIE, tokens.toString(), { expires: 1 }); // Expire dans 1 jour
      Cookies.set(EXPIRY_COOKIE, expiry.toString(), { expires: 1 }); // Expire dans 1 jour

      setTokensRemaining(tokens);
      setExpiryTime(expiry);
      setIsPremiumActive(true);

      return true;
    } catch (error) {
      console.error('[TokenProvider] Erreur lors de l\'activation du premium:', error);
      return false;
    }
  };

  const consumeToken = async () => {
    if (tokensRemaining <= 0) return false;

    const newTokens = tokensRemaining - 1;
    console.log('[TokenProvider] Consommation d\'un jeton, restants:', newTokens);
    
    setTokensRemaining(newTokens);
    Cookies.set(TOKENS_COOKIE, newTokens.toString(), { expires: 1 });

    return true;
  };

  return (
    <TokenContext.Provider value={{
      tokensRemaining,
      expiryTime,
      isPremiumActive,
      activatePremium,
      consumeToken
    }}>
      {children}
    </TokenContext.Provider>
  );
}

export const useTokens = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useTokens must be used within a TokenProvider');
  }
  return context;
}; 