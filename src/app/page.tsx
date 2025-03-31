"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTokens } from "./TokenProvider";
import { useRouter, useSearchParams } from "next/navigation";
import './premium-animations.css'; // Importation du fichier CSS externe

// Exemple de sons de pets légendaires
const legendaryFarts = [
  { title: "Le Crescendo", description: "Un chef-d'œuvre auditif en plusieurs mouvements symphoniques.", emoji: "🎼" },
  { title: "Le Silencieux mais Mortel", description: "Feu d'artifice olfactif sans avertissement sonore.", emoji: "💣" },
  { title: "Le Freestyle Rappeur", description: "Improvise un rythme capricieux qui défie les lois du beatboxing.", emoji: "🎙️" },
  { title: "L'Écho Profond", description: "Plongez dans les abysses fétides de votre intestin grondeur.", emoji: "🌊" },
  { title: "Le Sous-marin Périscope", description: "Émerge discrètement puis disparaît sans laisser de trace.", emoji: "👻" },
  { title: "Les Chaussons Dansants", description: "Tapissez le sol d'une mélodie flatulente fascinante.", emoji: "💃" },
  { title: "Le Décompte Lunaire", description: "Un compte à rebours gazeux annonçant l'atterrissage sur la Lune.", emoji: "🚀" },
  { title: "Le Tourbillon Vortex", description: "Entraîne tout sur son passage dans une spirale infernale.", emoji: "🌀" }
];

export default function Home() {
  const [sound, setSound] = useState("");
  const [place, setPlace] = useState("");
  const [duration, setDuration] = useState("");
  const [lang, setLang] = useState("fr");
  const [style, setStyle] = useState("sec");
  const [smell, setSmell] = useState("");
  const [result, setResult] = useState("");
  const [wavFile, setWavFile] = useState<File | null>(null);
  const [translations, setTranslations] = useState<any[]>([]);
  const [audioError, setAudioError] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState<number | null>(null);
  const [expandedFart, setExpandedFart] = useState<number | null>(null);
  
  // États pour le système de premium
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // États pour l'enregistrement audio
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("Prêt à capturer ton pet légendaire !");
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [email, setEmail] = useState("");
  const [shouldShowPremiumBanner, setShouldShowPremiumBanner] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const { tokensRemaining, expiryTime, isPremiumActive, activatePremium } = useTokens();
  
  // Valeurs dérivées pour l'interface utilisateur premium
  const premiumActive = isPremiumActive;
  
  // Calculer le temps restant pour l'abonnement premium
  const [premiumTimeLeft, setPremiumTimeLeft] = useState<string>("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    // Forcer audioError à false pour afficher les contrôles audio
    setAudioError(false);
    
    // Ajout de l'écouteur pour fermer le menu quand on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setAuthMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Mettre à jour le décompte de temps restant pour l'abonnement premium
    if (expiryTime) {
      const updateTimeLeft = () => {
        const now = Date.now();
        const diff = expiryTime - now;
        
        if (diff <= 0) {
          setPremiumTimeLeft("Expiré");
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setPremiumTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      };
      
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [expiryTime]);

  const translateFart = async (isDeluxe: boolean) => {
    if (!style) {
      setResult("Choisis au moins comment était ton pet, feignasse !");
      return;
    }

    // Désactiver explicitement le bandeau premium pendant la traduction
    setShouldShowPremiumBanner(false);
    setIsTranslating(true);
    setResult("Ça traduit, attends, péteur !");

    try {
      // Construire l'URL avec les paramètres
      const params = new URLSearchParams({
        sound: sound || 'prrrt',
        place: place || 'inconnu',
        duration: duration || '1',
        style: style || 'classique'
      });

      if (isDeluxe) {
        // Option Premium - Redirection vers analyse-deluxe
        // Sauvegarder l'audio si disponible
        if (audioChunks.length > 0) {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            localStorage.setItem('recordedAudio', base64data);
            router.push(`/analyse-deluxe?${params.toString()}`);
          };
        } else if (wavFile) {
          const reader = new FileReader();
          reader.readAsDataURL(wavFile);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            localStorage.setItem('recordedAudio', base64data);
            router.push(`/analyse-deluxe?${params.toString()}`);
          };
        } else {
          router.push(`/analyse-deluxe?${params.toString()}`);
        }
      } else {
        // Analyse gratuite - Appel à l'API Mistral pour une analyse simple
        // Affichage du résultat directement sur la page
        const response = await fetch('/api/mistral', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'basic-analysis',
            params: {
              sound: sound || 'prrrt',
              place: place || 'inconnu',
              duration: duration || '1',
              style: style,
              smell: smell || ''
            },
          }),
        });
        
        if (!response.ok) {
          throw new Error("Erreur lors de l'analyse");
        }
        
        const data = await response.json();
        
        // Réduire le texte de 50% pour la version gratuite
        let shortenedAnalysis = data.analysis;
        if (shortenedAnalysis && shortenedAnalysis.length > 0) {
          // Diviser le texte en phrases
          const sentences = shortenedAnalysis.match(/[^\.!\?]+[\.!\?]+/g) || [shortenedAnalysis];
          
          // Prendre 60% des phrases au lieu de 50% (arrondies au supérieur) pour un texte 10% plus long
          const selectedLength = Math.ceil(sentences.length * 0.6);
          const selectedSentences = sentences.slice(0, selectedLength);
          
          // Reconstruire le texte avec les phrases sélectionnées - sans ajouter de message promotionnel
          shortenedAnalysis = selectedSentences.join(' ');
        }
        
        // Animation de frappe de texte - VERSION SANS ANIMATION
        const text = shortenedAnalysis;
        
        // Afficher tout le texte immédiatement sans animation
        setResult(text);
        
        // Activer le bandeau premium après l'affichage du résultat
        setTimeout(() => {
          setShouldShowPremiumBanner(true);
        }, 500);
        
        setIsTranslating(false);
      }
    } catch (error) {
      console.error("Erreur lors de la traduction:", error);
      setResult("Oups, ton pet a provoqué une erreur ! Réessaie !");
      setIsTranslating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setWavFile(file);
      
      // Convertir le fichier en base64 pour le stockage
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result as string;
        localStorage.setItem('recordedAudio', base64data);
        
        // Créer une URL pour la prévisualisation
        const audioUrl = URL.createObjectURL(file);
        setAudioURL(audioUrl);
      };
    }
  };

  const handleAudioError = () => {
    setAudioError(true);
  };

  const getLanguageText = () => {
    return lang === "fr" ? "Français" : lang === "en" ? "English" : "Deutsch";
  };
  
  const getRandomEmoji = () => {
    const emojis = ["💨", "💭", "🌪️", "💥", "🔊", "🌬️", "🧪", "✨", "🌟", "💫"];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  // Fonctions pour l'enregistrement audio
  const startRecording = async () => {
    try {
      // Réinitialiser les erreurs possibles
      setAudioError(false);
      
      // Réinitialiser les chunks audio existants
      setAudioChunks([]);
      
      // Vérifier si l'API est disponible
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("L'API d'enregistrement n'est pas disponible dans ton navigateur");
      }
      
      // Demander l'accès au micro avec des contraintes spécifiques
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        } 
      });
      
      setRecordingStatus("✅ Enregistrement en cours...");
      
      // Créer le MediaRecorder avec un type MIME pour la compatibilité maximale
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        options = { mimeType: 'audio/ogg' };
      }
      
      console.log("Options MediaRecorder:", options);
      const recorder = new MediaRecorder(stream, options);
      
      // Stockage temporaire des chunks audio dans une variable locale
      let tempChunks: Blob[] = [];
      
      setMediaRecorder(recorder);
      
      recorder.onstart = () => {
        console.log("Enregistrement démarré avec succès");
        setIsRecording(true);
        tempChunks = []; // Réinitialiser les chunks locaux
      };
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          console.log("Données audio reçues:", e.data.size, "bytes");
          // Ajouter à la fois à notre variable temporaire et à l'état
          tempChunks.push(e.data);
          setAudioChunks(chunks => [...chunks, e.data]);
        }
      };
      
      recorder.onerror = (e) => {
        console.error("Erreur d'enregistrement:", e);
        setRecordingStatus("❌ Erreur d'enregistrement");
        setIsRecording(false);
      };
      
      recorder.onstop = () => {
        console.log("Arrêt de l'enregistrement, chunks disponibles:", tempChunks.length);
        
        // S'assurer qu'il y a des données en vérifiant notre variable locale
        if (tempChunks.length === 0) {
          console.error("Aucune donnée audio n'a été capturée");
          setRecordingStatus("❌ Aucun son capturé, réessaie");
          return;
        }
        
        // Ajouter un délai avant de créer le blob pour s'assurer que tous les chunks sont arrivés
        setTimeout(() => {
          // Créer un blob avec le type correct et la variable locale qui garantit que nous avons les données
          const audioBlob = new Blob(tempChunks, { type: recorder.mimeType || 'audio/webm' });
          
          if (audioBlob.size === 0) {
            console.error("Blob audio vide");
            setRecordingStatus("❌ Enregistrement vide, réessaie");
            return;
          }
          
          console.log("Taille du blob:", audioBlob.size, "bytes, mime:", recorder.mimeType);
          
          // Créer l'URL et mettre à jour l'état
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioURL(audioUrl);
          setIsRecording(false);
          setRecordingStatus("✅ Enregistrement terminé !");
          
          // Arrêter toutes les pistes pour libérer le micro
          stream.getTracks().forEach(track => track.stop());
          
          // Convertir le blob en base64 pour le stockage
          const reader = new FileReader();
          reader.onloadstart = () => console.log("Début de lecture du fichier");
          reader.onprogress = (e) => console.log("Progression:", e.loaded, "/", e.total);
          reader.onerror = (e) => console.error("Erreur de lecture:", e);
          
          reader.onloadend = () => {
            if (reader.result) {
              console.log("Convertie en base64, taille:", (reader.result as string).length);
              const base64data = reader.result as string;
              
              // Stocker dans localStorage pour qu'il soit accessible dans analyse-deluxe
              try {
                localStorage.setItem('recordedAudio', base64data);
                console.log("Audio stocké dans localStorage");
              } catch (e) {
                console.error("Erreur de stockage dans localStorage:", e);
              }
              
              // Convertir le blob en fichier pour pouvoir l'utiliser avec l'API existante
              const file = new File([audioBlob], "recorded-pet.webm", { type: recorder.mimeType || 'audio/webm' });
              setWavFile(file);
              console.log("Fichier créé:", file.name, file.size, "bytes");
            } else {
              console.error("La conversion en base64 a échoué");
            }
          };
          
          reader.readAsDataURL(audioBlob);
        }, 500); // Attendre 500ms pour s'assurer que les données arrivent
      };
      
      // Démarrer l'enregistrement avec des timeslices plus grands
      recorder.start(1000); // Capture les données toutes les 1000ms (1 seconde)
      console.log("Enregistrement démarré");
      
    } catch (error) {
      console.error('Erreur d\'accès au microphone:', error);
      setRecordingStatus(`❌ Erreur: ${error instanceof Error ? error.message : "Accès microphone refusé"}`);
      setAudioError(true);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      console.log("Arrêt de l'enregistrement demandé");
      try {
        // Forcer une dernière capture de données avant d'arrêter
        mediaRecorder.requestData();
        
        // Petit délai pour permettre aux données d'être capturées
        setTimeout(() => {
          mediaRecorder.stop();
        }, 200);
        
      } catch (e) {
        console.error("Erreur lors de l'arrêt de l'enregistrement:", e);
        setRecordingStatus("❌ Erreur lors de l'arrêt de l'enregistrement");
      }
    } else {
      console.warn("Impossible d'arrêter: aucun enregistrement en cours");
    }
  };
  
  const cancelRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setAudioURL(null);
      setWavFile(null);
      setRecordingStatus("Enregistrement annulé. Réessaye !");
    }
  };
  
  const resetAudio = () => {
    setAudioURL(null);
    setWavFile(null);
    setRecordingStatus("Prêt à capturer ton pet légendaire !");
  };

  // Ajouter un useEffect pour initialiser l'audio lorsque l'URL change
  useEffect(() => {
    if (audioURL && audioRef.current) {
      audioRef.current.load();
    }
  }, [audioURL]);

  // Fonction pour gérer l'activation du premium
  const handlePremiumActivation = () => {
    console.log("Bouton premium cliqué");
    
    // Rediriger directement vers analyse-deluxe avec les paramètres
    const url = `/analyse-deluxe?sound=${encodeURIComponent(sound)}&place=${encodeURIComponent(place)}&duration=${encodeURIComponent(duration)}&style=${encodeURIComponent(style)}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
    
    // Sauvegarder l'audio si disponible
    if (audioChunks.length > 0) {
      console.log("Enregistrement audio détecté, conversion avant redirection...");
      // S'assurer d'avoir le bon type MIME
      const mimeType = mediaRecorder?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      
      if (audioBlob.size > 0) {
        console.log(`Conversion du blob audio (${audioBlob.size} bytes) en base64...`);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            const base64data = reader.result as string;
            console.log(`Audio converti en base64: ${base64data.substring(0, 50)}... (${base64data.length} caractères)`);
            
            // Vider d'abord le localStorage pour éviter les problèmes
            localStorage.removeItem('recordedAudio');
            
            // Stocker dans localStorage
            try {
              localStorage.setItem('recordedAudio', base64data);
              console.log("Audio stocké dans localStorage avec succès");
              
              // Attendre un court instant pour s'assurer que les données sont écrites
              setTimeout(() => {
                // Vérification que les données sont bien stockées
                const stored = localStorage.getItem('recordedAudio');
                if (stored && stored.length > 0) {
                  console.log(`Vérifié: audio stocké correctement (${stored.length} caractères)`);
                  window.location.href = url;
                } else {
                  console.error("Échec de stockage dans localStorage");
                  alert("Erreur lors du stockage de l'enregistrement audio. Essayez de réduire la durée de l'enregistrement.");
                }
              }, 100);
            } catch (e) {
              console.error("Erreur de stockage dans localStorage:", e);
              alert("Erreur lors du stockage de l'enregistrement audio: " + (e instanceof Error ? e.message : "Erreur inconnue"));
              window.location.href = url; // Rediriger quand même
            }
          } else {
            console.error("La conversion en base64 a échoué");
            window.location.href = url; // Rediriger quand même
          }
        };
        
        reader.onerror = (error) => {
          console.error("Erreur lors de la lecture du fichier:", error);
          window.location.href = url; // Rediriger quand même
        };
        
        reader.readAsDataURL(audioBlob);
      } else {
        console.warn("Blob audio vide, redirection sans audio");
        window.location.href = url;
      }
    } else if (wavFile) {
      console.log("Fichier audio importé détecté, conversion avant redirection...");
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const base64data = reader.result as string;
          console.log(`Fichier audio converti en base64: ${base64data.substring(0, 50)}... (${base64data.length} caractères)`);
          
          // Vider d'abord le localStorage pour éviter les problèmes
          localStorage.removeItem('recordedAudio');
          
          try {
            localStorage.setItem('recordedAudio', base64data);
            console.log("Fichier audio stocké dans localStorage avec succès");
            window.location.href = url;
          } catch (e) {
            console.error("Erreur de stockage du fichier dans localStorage:", e);
            alert("Erreur lors du stockage du fichier audio. Il est peut-être trop volumineux.");
            window.location.href = url; // Rediriger quand même
          }
        } else {
          console.error("La conversion du fichier en base64 a échoué");
          window.location.href = url; // Rediriger quand même
        }
      };
      reader.readAsDataURL(wavFile);
    } else {
      console.log("Aucun audio détecté, redirection simple");
      window.location.href = url;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-blue-50">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-40 w-80 h-80 bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-blue-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Barre de navigation */}
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
          {premiumTimeLeft && (
            <div className="text-sm text-indigo-600">
              Temps restant : {premiumTimeLeft}
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Image de fond */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/accueil.png")' }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        
        {/* Menu de navigation */}
        <nav className="w-full max-w-4xl flex flex-col justify-between items-center mb-8 relative z-10">
          {/* Menu principal et authentification sur une ligne */}
          <div className="w-full flex justify-between items-center mb-6">
            {/* Menu principal */}
            <div className="flex flex-wrap gap-3 ml-2 sm:ml-12 justify-center">
              <Link
                href="/dictionary"
                className="bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-300 flex items-center gap-1 shadow-lg text-sm"
              >
                <span className="mr-1">📚</span> Dictionnaire
              </Link>
              <Link
                href="/forum"
                className="bg-yellow-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-yellow-700 transition duration-300 flex items-center gap-1 shadow-lg text-sm"
              >
                <span className="mr-1">💬</span> Forum
              </Link>
              <Link
                href="/foods"
                className="bg-red-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-700 transition duration-300 flex items-center gap-1 shadow-lg text-sm"
              >
                <span className="mr-1">🍲</span> Aliments
              </Link>
              <a
                href="mailto:contact@traducteurdepets.com"
                className="bg-[#FF4500] text-white px-3 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-300 flex items-center gap-1 shadow-lg text-sm"
              >
                <span className="mr-1">📧</span> Suggestions ou remarques ? Contactez-nous !
              </a>
            </div>
            
            {/* Sélection de langue uniquement */}
            <div className="flex items-center gap-3 sm:gap-7">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="px-2 py-1.5 border-2 border-orange-400 rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 text-sm font-medium"
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
                <option value="de">🇩🇪 DE</option>
              </select>
            </div>
          </div>
          
          {/* Logo et titre en dessous */}
          <div className="w-full flex justify-center mt-6">
            <h1 className="text-5xl font-extrabold text-white drop-shadow-[0_3px_5px_rgba(0,0,0,1)] [text-shadow:_0_0_15px_rgb(255_255_255_/_70%),_0_0_8px_rgb(255_255_255_/_50%)]">
              Traducteur de Pets <span className="text-5xl animate-pulse-fast inline-block transform rotate-12">💨</span>
            </h1>
          </div>
        </nav>

        <div className="relative z-10 w-full">
          <p className="text-center text-white text-xl sm:text-2xl font-bold mb-4 italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Fais péter ton chef-d'œuvre !
          </p>
        </div>
        
        {/* Nouvelle structure en deux colonnes sur écrans larges */}
        <div className="w-full max-w-5xl flex flex-row gap-4 md:gap-6">
          {/* Formulaire (colonne gauche sur écrans larges) */}
          <div className="w-1/2 bg-gradient-to-br from-white to-yellow-100 bg-opacity-90 p-4 sm:p-5 rounded-2xl shadow-2xl transform hover:scale-102 transition-transform duration-300 border-4 border-double border-yellow-400 relative overflow-hidden z-10" style={{ height: '950px' }}>
            <div className="absolute -top-6 -left-6 bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center transform rotate-12 shadow-lg border-4 border-white">
              <span className="text-2xl font-bold">TOP</span>
            </div>
            
            <div className="absolute -bottom-5 -right-5 bg-orange-500 text-white w-20 h-20 rounded-full flex items-center justify-center transform -rotate-12 shadow-lg border-4 border-white overflow-hidden">
              <div className="text-xl font-bold animate-spin-slow">💨</div>
            </div>
            
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-50 to-transparent opacity-50 pointer-events-none"></div>
            
            <h2 className="text-2xl font-bold text-orange-800 mb-3 text-center italic relative px-4">
              <span className="relative inline-block">
                Décris ton pet, nous te dirons ce qu'il signifie ! ��‍♂️
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-orange-400 rounded-full"></span>
              </span>
            </h2>

            <div className="flex-grow space-y-2">
              {/* Champ obligatoire "Comment était-il ?" */}
              <div className="mb-2 relative">
                <label className="block text-orange-800 font-bold mb-1 flex items-center text-sm">
                  <span className="text-lg mr-2">💭</span> Comment était-il ? <span className="ml-1 text-red-500 text-xs">* Requis</span>
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className={`w-full p-2 border-2 ${!style ? 'border-red-400' : 'border-orange-400'} rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 shadow-md hover:shadow-lg transition-shadow`}
                >
                  <option value="">Choisis une option</option>
                  <option value="sec">Sec</option>
                  <option value="bruyant">Bruyant</option>
                  <option value="foireux">Foireux</option>
                  <option value="humide">Humide</option>
                  <option value="explosif">Explosif</option>
                </select>
              </div>

              {/* Champs optionnels regroupés avec moins d'espacement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Champ optionnel "Bruit" */}
                <div className="mb-1.5 relative">
                  <label className="block text-orange-800 font-bold mb-0.5 flex items-center text-sm">
                    <span className="text-lg mr-2">🔊</span> Quel bruit ? <span className="ml-1 text-gray-500 text-xs">Optionnel</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Prouuut, Paf, Fsss"
                    value={sound}
                    onChange={(e) => setSound(e.target.value)}
                    className="w-full p-1.5 border-2 border-orange-400 rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
                
                {/* Champ optionnel "Lieu" */}
                <div className="mb-1.5 relative">
                  <label className="block text-orange-800 font-bold mb-0.5 flex items-center text-sm">
                    <span className="text-lg mr-2">📍</span> Où ça ? <span className="ml-1 text-gray-500 text-xs">Optionnel</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: métro, réunion..."
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    className="w-full p-1.5 border-2 border-orange-400 rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* Champ optionnel "Odeur" */}
                <div className="mb-1.5 relative">
                  <label className="block text-orange-800 font-bold mb-0.5 flex items-center text-sm">
                    <span className="text-lg mr-2">👃</span> Quelle odeur ? <span className="ml-1 text-gray-500 text-xs">Optionnel</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Soufre, œuf pourri..."
                    value={smell}
                    onChange={(e) => setSmell(e.target.value)}
                    className="w-full p-1.5 border-2 border-orange-400 rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
                
                {/* Champ optionnel "Durée" */}
                <div className="mb-1.5 relative">
                  <label className="block text-orange-800 font-bold mb-0.5 flex items-center text-sm">
                    <span className="text-lg mr-2">⏱️</span> Durée ? <span className="ml-1 text-gray-500 text-xs">Optionnel</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2 sec, interminable..."
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-1.5 border-2 border-orange-400 rounded-lg bg-yellow-100 text-orange-800 focus:outline-none focus:border-orange-600 shadow-md hover:shadow-lg transition-shadow"
                  />
                </div>
              </div>
            
              {/* Champ optionnel "Audio" avec espacement réduit */}
              <div className="mb-0 relative">
                <label className="block text-orange-800 font-bold mb-0.5 flex items-center text-sm">
                  <span className="text-lg mr-2">🎤</span> Audio <span className="ml-1 text-gray-500 text-xs">Optionnel</span>
                </label>
                
                {/* Interface d'enregistrement audio plus compacte */}
                <div className="mb-0 bg-orange-50 p-2 rounded-lg border-2 border-orange-300">
                  <p className="text-orange-700 font-medium mb-1 text-sm">
                    {recordingStatus}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-1">
                    <button
                      onClick={startRecording}
                      disabled={isRecording}
                      className="px-2 py-1 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <span className="mr-1">🎙️</span> Démarrer
                    </button>
                    
                    <button
                      onClick={stopRecording}
                      disabled={!isRecording}
                      className="px-2 py-1 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <span className="mr-1">⏹️</span> Arrêter
                    </button>
                    
                    <button
                      onClick={cancelRecording}
                      disabled={!isRecording}
                      className="px-2 py-1 bg-orange-500 text-white rounded-md text-sm font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <span className="mr-1">❌</span> Annuler
                    </button>
                    
                    <button
                      onClick={resetAudio}
                      disabled={isRecording || !audioURL}
                      className="px-2 py-1 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      <span className="mr-1">🔄</span> Réinitialiser
                    </button>
                  </div>
                  
                  {/* Lecteur audio pour prévisualisation */}
                  {audioURL && !audioError && (
                    <div className="mt-1">
                      <audio 
                        ref={audioRef}
                        controls
                        src={audioURL}
                        onError={handleAudioError}
                        className="w-full h-6"
                      />
                    </div>
                  )}
                  
                  {/* Alternative: importation de fichier audio */}
                  <div className="mt-1">
                    <label className="text-orange-700 text-sm font-medium mb-0.5 flex items-center">
                      <span className="mr-1">📁</span> Ou importe un fichier audio
                    </label>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileChange}
                      className="w-full text-sm text-orange-700 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-400 file:text-white hover:file:bg-orange-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bouton Traduire */}
            <div className="mt-4 text-center">
              <button
                onClick={() => translateFart(false)}
                disabled={isTranslating || !style}
                className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg transform hover:scale-[1.02] transition-all border-2 border-blue-300 w-full max-w-md mx-auto"
              >
                {isTranslating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyse en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 text-xl">🔍</span> Traduire mon pet <span className="ml-1 text-blue-200 font-medium">(Gratuit)</span>
                  </span>
                )}
              </button>
            </div>
            
            {/* Affichage du résultat de la traduction - MAINTENANT APRÈS LE BOUTON */}
            {result && !isTranslating && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Résultat de l'analyse :</h3>
                <div className="bg-white p-3 rounded border border-blue-200">
                  <p className="text-gray-700 whitespace-pre-line">{result}</p>
                </div>
              </div>
            )}
          </div>
        
          {/* Résultat (colonne droite sur écrans larges) */}
          <div className="w-1/2" style={{ height: '950px' }}>
            {/* Zone de résultat - Maintenant utilisée uniquement pour la promotion premium */}
            <div className="bg-white bg-opacity-90 p-4 sm:p-5 rounded-2xl shadow-2xl relative" style={{ height: '950px' }}>
              {/* Affichage du résultat de la traduction */}
              
              {/* Bandeau premium conditionnel */}
              {shouldShowPremiumBanner && !isTranslating && result && !premiumActive && (
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all">
                  <div className="flex flex-col items-center text-white">
                    <div className="mb-2 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-100">
                      ✨ ANALYSE PREMIUM DE LUXE ✨
                    </div>
                    <p className="text-center mb-3 font-medium">
                      Débloquez une analyse scientifique approfondie avec graphiques, profil de personnalité et interprétation avancée par nos experts !
                    </p>
                    <div className="flex items-center space-x-2 text-yellow-200 font-bold">
                      <span className="text-2xl">1€</span>
                      <span className="opacity-75 text-sm line-through">5€</span>
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-80%</span>
                    </div>
                    <button
                      onClick={handlePremiumActivation}
                      className="mt-3 bg-white text-indigo-700 hover:bg-yellow-100 font-bold py-2 px-6 rounded-full shadow-md transition-colors duration-300"
                    >
                      Améliorer mon analyse 🚀
                    </button>
                  </div>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-amber-800 mb-6 text-center mt-[25px] relative">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-44 h-44 bg-orange-300 rounded-full opacity-30 blur-3xl"></div>
                <div className="relative">
                  <div className="absolute -top-7 left-0 right-0 mx-auto bg-orange-200 text-orange-700 text-xs font-bold py-1 px-3 rounded-full shadow-sm transform -rotate-2 w-max border border-orange-300">
                    MEILLEURE OFFRE 🔥
                  </div>
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-transparent bg-clip-text relative inline-block">
                    <span className="absolute -inset-1 bg-orange-200 blur-sm opacity-30 rounded-lg -z-10"></span>
                    Pet-O-Matic : Analyse Premium
                  </span>
                  <div className="mt-2 flex justify-center items-center gap-2">
                    <span className="bg-orange-100 text-orange-700 text-sm font-bold px-2 py-0.5 rounded shadow-sm border border-orange-200">1€ seulement</span>
                    <span className="text-gray-500 text-xs line-through">4,99€</span>
                    <span className="bg-green-100 text-green-600 text-xs font-bold px-1.5 py-0.5 rounded-sm shadow-sm border border-green-200">-80%</span>
                  </div>
                </div>
              </h2>
              
              {/* Section Analyse Premium en haut dans la colonne de droite */}
              <div className="mb-6 bg-gradient-to-br from-amber-100 to-amber-200 p-5 rounded-2xl shadow-xl z-10 text-gray-800 backdrop-blur-sm border border-amber-300 relative overflow-hidden">
                {/* Éléments décoratifs en arrière-plan */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-300 rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute bottom-0 left-5 w-20 h-20 bg-amber-400 rounded-full opacity-30 blur-xl"></div>
                
                <div className="text-center mb-4 relative">
                  <p className="text-amber-700">Découvre l'étendue de notre technologie flatulologique</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-white p-3 rounded-xl backdrop-blur-md hover:bg-amber-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-amber-200">
                    <h3 className="font-bold text-lg flex items-center text-amber-700">
                      <span className="mr-2 text-xl">🔊</span> Étude Analytique Sonore
                    </h3>
                    <p className="text-sm text-gray-600">Analyse spectrale avancée révélant les harmoniques cachés de votre flatulence. Notre algorithme propriétaire détecte les subtilités acoustiques invisibles à l'oreille humaine.</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl backdrop-blur-md hover:bg-blue-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-blue-200">
                    <h3 className="font-bold text-lg flex items-center text-blue-600">
                      <span className="mr-2 text-xl">🔬</span> Analyse avec Spectrométrie
                    </h3>
                    <p className="text-sm text-gray-600">Cartographie moléculaire précise des composés gazeux émis, avec identification de biomarqueurs exclusifs. Notre technologie dévoile les secrets chimiques que votre intestin tente de dissimuler.</p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl backdrop-blur-md hover:bg-purple-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-purple-200">
                    <h3 className="font-bold text-lg flex items-center text-purple-600">
                      <span className="mr-2 text-xl">📊</span> Rapport Personnalisé
                    </h3>
                    <p className="text-sm text-gray-600">Dossier complet avec visualisations interactives, conseils diététiques personnalisés et stratégies d'optimisation flatulente. Un véritable passeport pour maîtriser l'art subtil de la flatulence contrôlée.</p>
                  </div>
                </div>
                
                <div className="mt-6 text-center relative">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-300/20 to-orange-300/20 rounded-3xl blur-xl -z-10"></div>
                  <div className="relative z-10 p-2">
                    {/* Ajout d'une bannière promotionnelle au-dessus du bouton */}
                    <div className="mb-3 bg-red-600 text-white font-bold py-2 px-4 rounded-full transform -rotate-2 shadow-lg inline-block animate-pulse">
                      <span className="flex items-center">
                        <span className="mr-2">🔥</span> OFFRE SPÉCIALE LIMITÉE <span className="ml-2">🔥</span>
                      </span>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-300 rounded-2xl animate-pulse-slow opacity-70 blur-md"></div>
                    <button
                      onClick={() => translateFart(true)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xl px-10 py-5 rounded-xl shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden group z-10 border-2 border-amber-300 w-full max-w-xl mx-auto"
                    >
                      {/* Ajout d'un pseudo-élément pour un effet de brillance */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-300/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {/* Ajout d'un effet de scintillement */}
                      <span className="absolute top-0 left-0 w-20 h-full bg-white/30 transform -skew-x-30 opacity-30 animate-shine"></span>
                      <span className="relative z-10 flex items-center justify-center">
                        <span className="mr-2 text-2xl">✨</span>
                        Commencer mon analyse avancée pour 1€ seulement
                        <span className="ml-2 text-2xl">✨</span>
                      </span>
                    </button>
                    <div className="mt-3 text-sm font-medium text-amber-800 bg-amber-100/80 py-2 px-4 rounded-lg inline-block shadow-sm">
                      Inclut 3 analyses gratuites • Accès premium pendant 24h • Satisfaction garantie
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Toujours afficher le contenu premium, même quand il y a un résultat */}
              <div className="space-y-3">
                {/* Contenu supprimé */}
              </div>
            </div>
            
            {/* Dernières traductions publiques */}
            <div className="mt-4 bg-gradient-to-br from-blue-50 to-blue-100 bg-opacity-90 p-5 rounded-2xl shadow-lg flex-grow backdrop-blur-md border border-blue-200/50 relative overflow-hidden">
              <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
              
              <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                <span className="mr-2 text-xl bg-blue-100 p-1.5 rounded-full">🌍</span> 
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-transparent bg-clip-text">Dernières traductions publiques</span>
              </h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {translations.length > 0 ? (
                  translations.map((t, i) => (
                    <div 
                      key={i} 
                      className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-blue-100 text-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-0.5 hover:bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-blue-700">
                          Pet {t.style}{t.sound ? ` (${t.sound})` : ''}{t.place ? ` à ${t.place}` : ''}
                        </div>
                        <div className="text-xs text-gray-500 bg-blue-50 px-1.5 py-0.5 rounded">
                          {new Date(t.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-700 mt-1.5 line-clamp-2">
                        {t.translation}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500 italic bg-white/50 rounded-lg backdrop-blur-sm">
                    <div className="text-blue-400 text-2xl mb-1">🔍</div>
                    Aucune traduction publique pour le moment
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hall of Fame des Pets Légendaires - Section déplacée en dehors des colonnes */}
        <div className="w-full max-w-5xl mt-3 bg-gradient-to-br from-white to-orange-50 bg-opacity-90 p-6 rounded-3xl shadow-2xl z-10 relative overflow-hidden border border-orange-200/50">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-300 rounded-full opacity-20 blur-3xl"></div>
          
          <h3 className="text-xl font-bold text-orange-700 mb-4 text-center relative">
            <span className="inline-block animate-bounce-slow bg-orange-100 p-2 rounded-full shadow-md mr-2">🏆</span> 
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">Hall of Fame des Pets Légendaires</span>
          </h3>
          
          <div className="text-center text-sm text-orange-600 italic mb-5 max-w-2xl mx-auto">
            Les performances flatulentes qui ont marqué l'Histoire et inspiré des générations de péteurs
            <div className="h-0.5 w-40 bg-gradient-to-r from-transparent via-orange-300 to-transparent rounded mx-auto mt-2"></div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4 rounded-xl mb-5 text-sm shadow-md backdrop-blur-sm border border-yellow-200/70">
            <p className="text-orange-800">
              <span className="font-bold">Le Musée des Pets Légendaires</span> est le théâtre idéal pour ces performances. Les murs, gorgés d'histoires flatulentes, semblent murmurer leur approbation. L'écho de ces exploits auditifs rebondit sur les œuvres d'art, créant une symphonie unique en son genre.
            </p>
            <p className="text-orange-700 mt-2 text-xs bg-white/50 p-2 rounded-lg inline-block">
              <em>Note scientifique</em> : Ces représentations resteront gravées dans les annales du monde pétologique. De vrais chefs-d'œuvre du genre !
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legendaryFarts.map((fart, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] backdrop-blur-sm"
              >
                <div className="flex items-start">
                  <div className="text-3xl mr-4 animate-pulse-slow bg-gradient-to-br from-amber-100 to-yellow-100 p-3 rounded-full shadow-md">{fart.emoji}</div>
                  <div className="w-full">
                    <h4 className="font-bold text-orange-800 text-lg">{fart.title}</h4>
                    <p className="text-sm text-gray-700 mb-2">{fart.description}</p>
                    
                    <div className="bg-white/70 p-3 rounded-lg border border-orange-100 shadow-sm backdrop-blur-sm">
                      {fart.title === "Le Crescendo" && (
                        <p className="text-xs text-gray-600 italic">
                          Ce style est caractérisé par une augmentation progressive du volume sonore et de la fréquence, créant une mélodie singulière et rythmée. Apprécié pour sa richesse de tonalités, il est particulièrement impressionnant dans les espaces à forte résonance acoustique. Les vrais artistes maîtrisent parfaitement la montée en puissance, surprenant leur audience par une finale inattendue.
                        </p>
                      )}
                      {fart.title === "Le Silencieux mais Mortel" && (
                        <p className="text-xs text-gray-600 italic">
                          La pièce maîtresse du Musée des Pets. Cette flatulence mystérieuse et discrète peut passer inaperçue auditivement, mais gare à son parfum redoutable qui rappelle les tréfonds de l'enfer. Son pouvoir réside dans sa capacité à provoquer des réactions en chaîne de recherche du coupable, créant des situations sociales délicieusement embarrassantes.
                        </p>
                      )}
                      {fart.title === "Le Freestyle Rappeur" && (
                        <p className="text-xs text-gray-600 italic">
                          Imprévisible et rythmiquement complexe, le Freestyle Rappeur défie toute logique acoustique. Sa séquence syncopée de petits pets rapides et de variations tonales évoque une session d'improvisation hip-hop. Ce style nécessite une excellente maîtrise du sphincter et une alimentation riche en fibres pour atteindre sa pleine expression artistique.
                        </p>
                      )}
                      {fart.title === "L'Écho Profond" && (
                        <p className="text-xs text-gray-600 italic">
                          Provenant des profondeurs intestinales, l'Écho Profond résonne avec une gravité qui impressionne. Sa signature acoustique unique combine basses fréquences et réverbérations prolongées. Les connaisseurs apprécient sa capacité à faire vibrer les objets environnants, produisant parfois un effet secondaire de mise en mouvement des bibelots posés sur les étagères.
                        </p>
                      )}
                      {fart.title === "Le Sous-marin Périscope" && (
                        <p className="text-xs text-gray-600 italic">
                          Techniquement complexe à réaliser, ce pet furtif fait son apparition puis disparaît dans un mouvement rappelant un périscope. Souvent, il commence par une légère émission, suivie d'une pause stratégique, puis d'une seconde émission qui confirme sa présence. Les experts le considèrent comme le pet le plus élégant du répertoire flatulent.
                        </p>
                      )}
                      {fart.title === "Les Chaussons Dansants" && (
                        <p className="text-xs text-gray-600 italic">
                          Cette flatulence ludique crée une sensation de mouvement dans la pièce. Sa caractéristique principale réside dans sa capacité à sembler se déplacer d'un point à un autre, comme des pas de danse. Les témoins rapportent une impression de légèreté et de joie, malgré l'odeur parfois prononcée qui l'accompagne.
                        </p>
                      )}
                      {fart.title === "Le Décompte Lunaire" && (
                        <p className="text-xs text-gray-600 italic">
                          Inspiré des missions spatiales, ce pet se déroule en plusieurs phases distinctes, à la manière d'un compte à rebours. La phase d'allumage initial est suivie d'une série de propulsions de plus en plus rapides, culminant en un final puissant. Les astronautes de la NASA auraient secrètement étudié ce phénomène pour améliorer leurs systèmes de propulsion.
                        </p>
                      )}
                      {fart.title === "Le Tourbillon Vortex" && (
                        <p className="text-xs text-gray-600 italic">
                          Ce chef-d'œuvre flatulent crée un véritable cyclone olfactif dans son environnement. Son effet tourbillonnant est si puissant qu'il peut déplacer les rideaux légers et faire vaciller les flammes des bougies. Les scientifiques du Musée des Pets ont calculé que sa force rotative pourrait théoriquement alimenter une petite éolienne domestique.
                        </p>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-xs text-orange-500 italic">Niveau de difficulté: {index + 3}/5</p>
                      <p className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Popularité: ⭐⭐⭐⭐⭐</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500 bg-white/70 p-2 rounded-lg backdrop-blur-sm mx-auto max-w-2xl">
            * Ces légendes ont été immortalisées par notre comité scientifique international après des années d'études rigoureuses dans des espaces confinés
          </div>
          
          <div className="mt-5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 shadow-md backdrop-blur-sm">
            <p className="text-center text-sm text-yellow-800 flex items-center justify-center">
              <span className="bg-yellow-200 p-1.5 rounded-full mr-2">⚠️</span>
              <span><span className="font-bold">Avertissement de sécurité :</span> Dans ce Musée des Pets, les flatulences peuvent atteindre des sommets historiques en termes d'odeur et de volume. Préparez vos narines avec prudence et amusement !</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}