"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTokens } from "../TokenProvider";

export default function PremiumSuccessPage() {
  const { activatePremium } = useTokens();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activationStatus, setActivationStatus] = useState("pending");
  const [timeLeft, setTimeLeft] = useState(5);
  
  useEffect(() => {
    const handleActivation = async () => {
      // Vérifier d'abord si le paiement a bien été effectué (présence du session_id)
      const sessionId = searchParams.get('session_id');
      console.log("[Premium Success] Session ID reçu:", sessionId);
      
      if (!sessionId) {
        // Rediriger vers la page premium en cas d'accès direct
        console.log("[Premium Success] Pas de session ID, redirection vers /premium");
        router.push('/premium');
        return;
      }
      
      // Utiliser localStorage pour éviter d'activer le premium plusieurs fois pour la même session
      const sessionActivated = localStorage.getItem(`premium_session_${sessionId}`);
      
      if (!sessionActivated) {
        try {
          console.log("[Premium Success] Activation du premium...");
          
          // Activer le mode premium
          const success = await activatePremium();
          
          console.log("[Premium Success] Résultat de l'activation:", success);
          
          if (success) {
            console.log("[Premium Success] Mode premium activé avec succès");
            // Marquer cette session comme déjà activée
            localStorage.setItem(`premium_session_${sessionId}`, 'true');
            setActivationStatus("success");
          } else {
            console.error("[Premium Success] Échec de l'activation du premium");
            setActivationStatus("error");
          }
        } catch (error) {
          console.error("[Premium Success] Erreur lors de l'activation du premium:", error);
          setActivationStatus("error");
        }
      } else {
        console.log("[Premium Success] Session déjà activée, pas de nouvelle activation");
        setActivationStatus("already_active");
      }
    };
    
    handleActivation();
  }, [searchParams, activatePremium, router]);
  
  // Compte à rebours pour la redirection
  useEffect(() => {
    if (activationStatus === "success" || activationStatus === "already_active") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [activationStatus, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Image de fond */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/premium-background.jpg")' }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-amber-900/30"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white bg-opacity-95 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white rounded-full p-3">
                <svg className="h-12 w-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center">Paiement réussi !</h1>
            <p className="text-center mt-2 text-green-100">Votre compte est maintenant Premium</p>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">Merci pour votre achat !</h2>
              <p className="text-gray-600">
                Votre accès Premium est maintenant actif pour les prochaines 24 heures.
              </p>
              <div className="mt-3 p-2 bg-yellow-100 rounded-md text-sm text-yellow-800">
                Vous avez maintenant 3 jetons pour des analyses premium.
              </div>
              
              {(activationStatus === "success" || activationStatus === "already_active") && (
                <div className="mt-3 p-2 bg-green-100 rounded-md text-sm text-green-800">
                  Redirection automatique dans {timeLeft} secondes...
                </div>
              )}
              
              {activationStatus === "error" && (
                <div className="mt-3 p-2 bg-red-100 rounded-md text-sm text-red-800">
                  Un problème est survenu, mais vos jetons ont été ajoutés localement.
                </div>
              )}
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-orange-800 mb-2 flex items-center">
                <span className="mr-2">🎁</span> Ce que vous avez débloqué :
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Accès complet au dictionnaire
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Tous les sujets du forum
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> Catalogue d'aliments complet
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span> 3 jetons pour analyses premium
                </li>
              </ul>
            </div>
            
            <div className="text-center space-y-3">
              <Link 
                href="/"
                className="block w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all"
                onClick={() => {
                  // Forcer le rechargement de la page pour s'assurer que les jetons sont visibles
                  localStorage.setItem('force_refresh', 'true');
                }}
              >
                Retour à l'accueil
              </Link>
              <Link 
                href="/analyse-deluxe"
                className="block w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all"
              >
                Essayer l'analyse premium
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-white">
          <p className="font-bold">© 2024 Pétomane Studio</p>
          <p className="text-sm mt-1 text-amber-200">
            Une question ? Contactez nous à <a href="mailto:support@traducteurdepets.com" className="underline">support@traducteurdepets.com</a>
          </p>
        </div>
      </div>
    </div>
  );
} 