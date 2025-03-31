"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateDefaultAnalysisContent } from './utils/contentGeneration';
import LoadingScreen from './components/LoadingScreen';
import ScientificReportSection from './components/ScientificReportSection';
import PersonalitySection from './components/PersonalitySection';
import MistralAnalysisSection from './components/MistralAnalysisSection';
import IntroSection from './components/IntroSection';
import AudioVisualizationSection from './components/AudioVisualizationSection';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AnalysisContent } from './utils/contentGeneration';
import { useTokens } from '../TokenProvider';
import 'jspdf-autotable';

const AnalyseDeluxePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { tokensRemaining, expiryTime, isPremiumActive, consumeToken } = useTokens();
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState(generateDefaultAnalysisContent());
  const [showMistralSection, setShowMistralSection] = useState(false);
  const [showScientificReport, setShowScientificReport] = useState(false);
  const [showChemicalAnalysis, setShowChemicalAnalysis] = useState(false);
  const [showDataVisualization, setShowDataVisualization] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [showPdfMessage, setShowPdfMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [certificateNumber, setCertificateNumber] = useState("");
  const [checkingPremium, setCheckingPremium] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [tokens, setTokens] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Messages humoristiques à afficher pendant la génération du PDF
  const humoristicMessages = [
    "Analyse quantique en cours...",
    "Détection des particules éthérées...",
    "Calibration des capteurs olfactifs...",
    "Déploiement des sondes subatomiques...",
    "Consultation des oracles intestinaux...",
    "Intégration des données flatulentielles...",
    "Synchronisation des flux gazeux...",
    "Calcul des trajectoires moléculaires...",
    "Optimisation des paramètres aromatiques...",
    "Finalisation du rapport scientifique divin..."
  ];
  
  // Fonction pour faire défiler les messages humoristiques
  const startRotatingMessages = () => {
    let currentIndex = 0;
    
    // Définir le premier message
    setLoadingMessage(humoristicMessages[0]);
    
    // Créer un intervalle pour changer le message toutes les 800ms
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % humoristicMessages.length;
      setLoadingMessage(humoristicMessages[currentIndex]);
      
      // Si nous avons affiché tous les messages, arrêter l'intervalle
      if (!showPdfMessage) {
        clearInterval(interval);
      }
    }, 800);
    
    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  };

  // Charger les données premium au chargement de la page
  useEffect(() => {
    const loadPremiumData = async () => {
      if (isRedirecting) return; // Éviter les appels multiples si déjà en redirection
      
      console.log("Page analyse deluxe - chargement des données premium");
      setTokens(tokensRemaining);
      setCheckingPremium(false);
      console.log("Page analyse deluxe - données premium chargées:", { tokens: tokensRemaining });
      
      // Ajout d'informations de débogage
      console.log("DEBUG - État des jetons:", {
        tokensRemaining,
        expiryTime,
        isPremiumActive,
        hasTokens: tokensRemaining > 0
      });
      
      // Vérifier l'accès une seule fois après chargement
      if (!isPremiumActive && !isRedirecting) {
        console.log("Accès refusé - redirection vers la page premium");
        setIsRedirecting(true);
        alert("Vous n'avez pas de jetons premium disponibles. Veuillez acheter des jetons pour accéder à l'analyse détaillée.");
        router.push("/premium");
      }
    };

    loadPremiumData();
  }, [isRedirecting, tokensRemaining, isPremiumActive, router]);

  const handleAnalysisComplete = async () => {
    // Éviter les appels multiples
    if (showMistralSection || isRedirecting) return;
    
    // Consommer un jeton dès le début de l'analyse
    console.log("Début de l'analyse - consommation d'un jeton premium");
    
    // Vérifier à nouveau si l'utilisateur a des jetons premium
    if (!isPremiumActive || tokens <= 0) {
      console.error("Pas de jetons premium disponibles pour démarrer l'analyse");
      setIsRedirecting(true);
      alert("Vous n'avez plus de jetons premium disponibles. Veuillez acheter plus de jetons.");
      router.push("/premium");
      return;
    }
    
    try {
      // Consommer un jeton premium avant de démarrer l'analyse
      console.log("Tentative de consommation d'un jeton premium");
      const success = await consumeToken();
      
      if (!success) {
        console.error("Erreur lors de la consommation du jeton premium");
        alert("Une erreur s'est produite lors de la consommation de votre jeton premium. Veuillez réessayer.");
        router.push("/premium");
        return;
      }
      
      // Mettre à jour l'état local immédiatement
      setTokens(tokensRemaining);
      console.log("Jeton premium consommé avec succès - Jetons restants:", tokensRemaining);
      
      // Génération d'un numéro de certificat aléatoire
      const randomCertificate = Math.floor(Math.random() * 900000) + 100000;
      setCertificateNumber(randomCertificate.toString());
      
      // Simuler une analyse progressive
      setTimeout(() => {
        setShowMistralSection(true);
        setTimeout(() => {
          setShowScientificReport(true);
          setTimeout(() => {
            setShowChemicalAnalysis(true);
            setTimeout(() => {
              setShowDataVisualization(true);
              setIsLoading(false);
            }, 800);
          }, 700);
        }, 600);
      }, 500);
    } catch (error) {
      console.error("Exception lors de la consommation du jeton premium:", error);
      alert("Une erreur s'est produite lors de la consommation de votre jeton premium. Veuillez réessayer.");
    }
  };

  useEffect(() => {
    // Ne lancer l'analyse que si l'utilisateur a des jetons et n'est pas en cours de redirection
    // et seulement si la vérification des tokens est terminée
    if (!checkingPremium && !isRedirecting && isLoading && isPremiumActive && !showMistralSection) {
      // Pas de validation des paramètres - permettre toute analyse
      console.log("Lancement de l'analyse après vérification des jetons");
      const timer = setTimeout(() => {
        handleAnalysisComplete();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [checkingPremium, isPremiumActive, isRedirecting, isLoading, showMistralSection]);

  // Rotation des messages pendant la génération du PDF
  useEffect(() => {
    if (showPdfMessage && currentMessage < humoristicMessages.length - 1) {
      const timer = setTimeout(() => {
        setCurrentMessage(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showPdfMessage, currentMessage, humoristicMessages.length]);

  const generatePDF = async () => {
    // Vérifier que l'utilisateur a des jetons premium
    setTokens(tokensRemaining);
    
    if (!isPremiumActive && !isRedirecting) {
      console.error("Pas de jetons premium disponibles");
      setIsRedirecting(true);
      alert(`Vous n'avez plus de jetons premium disponibles. Vous avez actuellement ${tokensRemaining} jetons. Veuillez acheter plus de jetons.`);
      router.push("/premium");
      return;
    }
    
    if (!reportRef.current) return;
    
    try {
      setIsPdfGenerating(true);
      setShowPdfMessage(true);
      
      // Attendre un moment pour l'animation et commencer à montrer les messages
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Commencer à afficher les messages humoristiques
      startRotatingMessages();
      
      // Attendre un moment pour donner l'impression que nous faisons quelque chose de complexe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Capturer le contenu du rapport en image
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Créer un nouveau document PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Ajouter l'image au PDF
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Télécharger le PDF
      pdf.save(`Analyse-Pet-O-Matic-${certificateNumber}.pdf`);
      
      // Pas besoin de consommer un jeton ici, car nous en avons déjà consommé un au début de l'analyse
      alert(`Votre PDF a été généré avec succès! Il vous reste ${tokensRemaining} jetons premium.`);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert("Une erreur s'est produite lors de la génération du PDF. Veuillez réessayer.");
    } finally {
      setIsPdfGenerating(false);
      setShowPdfMessage(false);
    }
  };

  // Afficher un état de chargement pendant la vérification du statut premium
  if (checkingPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50">
        <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center max-w-md w-full">
          <div className="mb-6 text-indigo-600">
            <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-indigo-800 text-center">Vérification de votre accès premium...</h3>
          <p className="mt-4 text-center text-indigo-600">
            Un instant, nous préparons votre analyse détaillée...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {isPdfGenerating && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-indigo-900/70 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl flex flex-col items-center max-w-md w-full">
            <div className="mb-6 text-indigo-600 w-16 h-16 flex items-center justify-center">
              <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-indigo-800 text-center">Génération du PDF...</h3>
            
            <div className="h-20 flex items-center justify-center mt-4 mb-2 w-full">
              <p className="text-indigo-600 text-center font-medium transition-opacity duration-700 ease-in-out">
                {loadingMessage || "Initialisation de l'analyse..."}
              </p>
            </div>
            
            <div className="mt-2 w-full bg-indigo-100 rounded-full h-1.5">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full animate-pulse"></div>
            </div>
            
            <p className="text-indigo-400 mt-4 text-sm text-center italic">
              Nos experts analysent minutieusement vos données...
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingScreen onComplete={handleAnalysisComplete} />
      ) : (
        <>
          <nav className="flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-md border-b border-indigo-100 shadow-sm sticky top-0 z-50 transition-all duration-300 hover:shadow-md">
            <Link href="/" className="flex items-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 hover:from-indigo-600 hover:to-purple-500 font-medium transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Retour à l'accueil
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-indigo-700 font-medium">
                <span className="text-amber-500">🪙</span>
                <span>{tokensRemaining} jeton{tokensRemaining !== 1 ? 's' : ''} restant{tokensRemaining !== 1 ? 's' : ''}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-indigo-700">Rapport <span className="bg-indigo-100 px-2 py-1 rounded-md text-indigo-700">#PET-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span></div>
                <div className="text-xs text-indigo-500 mt-1">{new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
          </nav>

          <main className="container mx-auto px-4 py-6 pt-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 mb-3 inline-block drop-shadow-sm">
                  Analyse Deluxe
                </h1>
                <p className="text-indigo-700 max-w-2xl font-medium">
                  Une analyse complète et détaillée de votre flatulence, assistée par intelligence artificielle et expertise humaine.
                </p>
              </div>
              
              <button
                onClick={generatePDF}
                disabled={isPdfGenerating}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-md 
                  hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[0px] transition-all duration-300 
                  disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm250.2-143.7c-12.2-12-47-8.7-64.4-6.5-17.2-10.5-28.7-25-36.8-46.3 3.9-16.1 10.1-40.6 5.4-56-4.2-26.2-37.8-23.6-42.6-5.9-4.4 16.1-.4 38.5 7 67.1-10 23.9-24.9 56-35.4 74.4-20 10.3-47 26.2-51 46.2-3.3 15.8 26 55.2 76.1-31.2 22.4-7.4 46.8-16.5 68.4-20.1 18.9 10.2 41 17 55.8 17 25.5 0 28-28.2 17.5-38.7zm-198.1 77.8c5.1-13.7 24.5-29.5 30.4-35-19 30.3-30.4 35.7-30.4 35zm81.6-190.6c7.4 0 6.7 32.1 1.8 40.8-4.4-13.9-4.3-40.8-1.8-40.8zm-24.4 136.6c9.7-16.9 18-37 24.7-54.7 8.3 15.1 18.9 27.2 30.1 35.5-20.8 4.3-38.9 13.1-54.8 19.2zm131.6-5s-5 6-37.3-7.8c35.1-2.6 40.9 5.4 37.3 7.8z"/>
                </svg>
                {isPdfGenerating ? 'Génération...' : 'Télécharger PDF'}
              </button>
            </div>
            
            <div ref={reportRef} className="max-w-4xl mx-auto space-y-12">
              <IntroSection />
              <AudioVisualizationSection />
              <ScientificReportSection analysis={analysis} />
              <PersonalitySection analysis={analysis} />
              <MistralAnalysisSection />
              
              <div className="mt-20 mb-8 bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-10 text-center transform hover:scale-[1.01] transition-transform border border-indigo-100">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-4">Analyse Complète!</h2>
                <p className="text-indigo-600 mb-8 max-w-md mx-auto">
                  Merci d'avoir utilisé notre service d'analyse premium. Votre flatulence a été méticuleusement étudiée par nos algorithmes avancés.
                </p>
                <Link 
                  href="/"
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-10 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>

            <footer className="text-center text-indigo-600 text-sm mt-24 mb-8 py-8 border-t border-indigo-100">
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto mb-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <p className="font-semibold">© {new Date().getFullYear()} Institut de Pétologie Avancée</p>
                  <p className="text-xs">Tous droits réservés</p>
                </div>
                <p className="mt-2 text-xs text-indigo-500/80 bg-indigo-50 py-2 px-4 rounded-lg inline-block">
                  Les analyses fournies sont générées à des fins humoristiques et ne constituent en aucun cas un avis médical.
                </p>
                <div className="mt-6 flex justify-center space-x-6">
                  <a href="#" className="text-indigo-500 hover:text-indigo-700 transition-colors flex items-center">
                    <span className="w-1 h-1 bg-indigo-400 rounded-full mr-1.5"></span>
                    Mentions légales
                  </a>
                  <a href="#" className="text-indigo-500 hover:text-indigo-700 transition-colors flex items-center">
                    <span className="w-1 h-1 bg-indigo-400 rounded-full mr-1.5"></span>
                    Confidentialité
                  </a>
                  <a href="#" className="text-indigo-500 hover:text-indigo-700 transition-colors flex items-center">
                    <span className="w-1 h-1 bg-indigo-400 rounded-full mr-1.5"></span>
                    Contact
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </>
      )}
    </div>
  );
};

export default AnalyseDeluxePage; 