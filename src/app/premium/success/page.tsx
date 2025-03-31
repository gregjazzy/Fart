"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTokens } from '../../TokenProvider';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { activatePremium } = useTokens();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Activer le mode premium
      activatePremium();
    }
  }, [sessionId, activatePremium]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white bg-opacity-95 rounded-2xl shadow-2xl p-8 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Paiement réussi !
          </h1>
          <p className="text-gray-600">
            Votre accès premium a été activé avec succès.
          </p>
        </div>

        <div className="bg-amber-50 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-bold text-amber-800 mb-4">
            Ce que vous avez obtenu :
          </h2>
          <ul className="text-left space-y-3">
            <li className="flex items-center">
              <span className="mr-2">✨</span>
              <span>3 analyses premium gratuites</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🌟</span>
              <span>Accès complet au site pendant 24h</span>
            </li>
            <li className="flex items-center">
              <span className="mr-2">💫</span>
              <span>Forum, dictionnaire et liste des aliments débloqués</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/analyse-deluxe"
            className="block w-full py-3 px-6 bg-white border-2 border-amber-500 text-amber-700 font-bold rounded-lg hover:bg-amber-50 transition-all"
          >
            Faire une analyse premium
          </Link>
        </div>
      </div>
    </div>
  );
} 