import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { analyzeAudio } from '../utils/audioProcessing';
import { selectAcousticCurve, detectAudioCharacteristics } from '../../../data/predefinedAcousticCurves';

// Déclaration pour webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const AudioVisualizationSection: React.FC = () => {
  const searchParams = useSearchParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [audioData, setAudioData] = useState<any>(null);
  const [hasRealRecording, setHasRealRecording] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processedRef = useRef<boolean>(false);
  const audioFrequencies = useRef<number[]>([]);
  const audioAmplitudes = useRef<number[]>([]);
  const audioTimestamps = useRef<number[]>([]);
  const dominantFrequency = useRef<number>(0);
  const dominantAmplitude = useRef<number>(0);
  const simulationMode = useRef<boolean>(false);
  const simulationName = useRef<string>("Simulation");
  
  // Fonction pour créer ou reprendre l'AudioContext
  const createOrResumeAudioContext = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  };
  
  // Fonction d'initialisation audio, maintenant séparée du gestionnaire de clic
  const initAudio = async () => {
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      // Générer immédiatement des données simulées pour éviter l'affichage "Analyse en cours..."
      generateSimpleFallbackData();
      processSimulatedAudioData(2, 0.5);
      
      // Vérifier s'il y a un audio stocké dans le localStorage
      const storedAudio = localStorage.getItem('recordedAudio');
      
      if (audioContextRef.current === null) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (storedAudio) {
        // Créer un élément audio pour obtenir la durée et d'autres métadonnées
        const audioElement = document.createElement('audio');
        audioElement.src = storedAudio;
        
        // Attendre que les métadonnées soient chargées pour obtenir la durée
        audioElement.addEventListener('loadedmetadata', () => {
          // Pour les enregistrements réels, utiliser une simulation au lieu de tenter le décodage
          // qui peut causer l'erreur "Invalid array length"
          processSimulatedDataForRealRecording(audioElement);
        });
        
        // Gérer les erreurs de chargement
        audioElement.addEventListener('error', () => {
          console.error("Erreur lors du chargement de l'audio");
          generateSimpleFallbackData();
          processSimulatedAudioData(2, 0.5);
        });
        
        // Déclencher le chargement des métadonnées
        audioElement.load();
      } else {
        // Pas d'audio disponible, générer des données simulées simples
        generateSimpleFallbackData();
        
        // Générer également des données pour l'affichage des métriques
        processSimulatedAudioData(2, 0.5);
      }
    } catch (error) {
      console.error("Erreur d'initialisation audio:", error);
      generateSimpleFallbackData();
      // Générer également des données pour l'affichage des métriques en cas d'erreur
      processSimulatedAudioData(2, 0.5);
    }
  };
  
  // Gestionnaire de clic pour initialiser l'audio (maintenu pour compatibilité)
  const handleInitAudio = async () => {
    setIsAudioReady(true);
    await initAudio();
  };
  
  // Fonction qui traite l'audio réel en utilisant une courbe prédéfinie
  const processSimulatedDataForRealRecording = (audioElement: HTMLAudioElement): void => {
    try {
      // Obtenir la durée de l'audio pour ajuster la simulation
      const duration = audioElement.duration || 5; // Fallback si la durée n'est pas disponible
      
      // Déterminer les caractéristiques en fonction du type d'enregistrement
      // En cas réel, on pourrait analyser le contenu audio pour détecter ces caractéristiques
      let soundTrend: 'montant' | 'descendant' | 'stable' | 'montant-descendant' | 'descendant-montant' | 'fluctuant' = 'fluctuant';
      let intensityTrend: 'forte' | 'faible' | 'moyenne' | 'croissante' | 'décroissante' | 'variable' = 'variable';
      
      // Déterminer le type de courbe en fonction de la durée
      const durationCategory = duration < 2 ? 'courte' : duration > 6 ? 'longue' : 'moyenne';
      
      // Sélectionner une courbe prédéfinie qui correspond aux caractéristiques de l'enregistrement
      const selectedCurve = selectAcousticCurve({
        soundTrend,
        intensityTrend,
        duration: durationCategory,
        complexity: 'complexe'
      }, true); // Le paramètre true force l'utilisation d'une simulation
      
      // Ajuster le nombre de points en fonction de la durée
      const pointsPerSecond = 12;
      const totalPoints = Math.max(24, Math.min(144, Math.round(duration * pointsPerSecond)));
      
      // Adapter les données de la courbe sélectionnée au nombre de points nécessaires
      const frequencies: number[] = [];
      const amplitudes: number[] = [];
      const timestamps: number[] = [];
      
      const originalData = selectedCurve.data;
      const originalPoints = originalData.frequencies.length;
      
      for (let i = 0; i < totalPoints; i++) {
        // Interpolation linéaire si le nombre de points est différent
        const ratio = i / (totalPoints - 1);
        const originalIndex = Math.min(originalPoints - 1, Math.floor(ratio * originalPoints));
        const nextIndex = Math.min(originalPoints - 1, originalIndex + 1);
        const subRatio = (ratio * originalPoints) - originalIndex;
        
        // Interpoler les valeurs entre les points originaux
        const frequency = 
          originalData.frequencies[originalIndex] * (1 - subRatio) + 
          originalData.frequencies[nextIndex] * subRatio;
          
        const amplitude = 
          originalData.amplitudes[originalIndex] * (1 - subRatio) + 
          originalData.amplitudes[nextIndex] * subRatio;
        
        frequencies.push(frequency);
        amplitudes.push(amplitude);
        timestamps.push(i * (duration / totalPoints));
      }
      
      // Stocker les données pour l'affichage
      audioFrequencies.current = frequencies;
      audioAmplitudes.current = amplitudes;
      audioTimestamps.current = timestamps;
      
      // Mémoriser la fréquence et l'amplitude dominantes pour l'analyse
      const maxFreqIndex = amplitudes.reduce((maxIndex, amplitude, index, array) => 
        amplitude > array[maxIndex] ? index : maxIndex, 0);
      
      dominantFrequency.current = frequencies[maxFreqIndex];
      dominantAmplitude.current = amplitudes[maxFreqIndex];
      
      // Ajouter une annotation pour indiquer qu'il s'agit d'une simulation
      simulationMode.current = true;
      simulationName.current = selectedCurve.name;
      
      // Re-dessiner le canvas avec les nouvelles données
      drawWaveform();
    } catch (error) {
      console.error("Erreur lors de la génération de la simulation:", error);
      // Fallback en cas d'erreur: générer des données très simples
      generateSimpleFallbackData();
    }
  };
  
  // Fonction de fallback très simple en cas d'erreur
  const generateSimpleFallbackData = () => {
    const points = 48; // 4 secondes x 12 points/seconde
    const frequencies: number[] = [];
    const amplitudes: number[] = [];
    const timestamps: number[] = [];
    
    for (let i = 0; i < points; i++) {
      // Courbe simple en forme de cloche
      const x = i / points * 2 - 1; // -1 à 1
      const frequency = 200 + 200 * Math.exp(-2 * x * x);
      const amplitude = 50 + 30 * Math.exp(-2 * x * x);
      
      frequencies.push(frequency);
      amplitudes.push(amplitude);
      timestamps.push(i * (4 / points));
    }
    
    audioFrequencies.current = frequencies;
    audioAmplitudes.current = amplitudes;
    audioTimestamps.current = timestamps;
    dominantFrequency.current = 300;
    dominantAmplitude.current = 70;
    simulationMode.current = true;
    simulationName.current = "Simulation: Mode de Secours";
    
    drawWaveform();
  };
  
  useEffect(() => {
    // Initialiser l'audio automatiquement au chargement du composant
    if (isAudioReady) {
      initAudio();
    }
  }, [isAudioReady]);
  
  const processRealAudioData = async (base64Audio: string, audioContext: AudioContext) => {
    // Cette fonction n'est plus utilisée, mais conservée pour référence
    try {
      console.log("Utilisation de la simulation pour l'enregistrement audio");
      processSimulatedDataForRealRecording(new Audio(base64Audio));
    } catch (error) {
      console.error("Erreur lors du traitement audio:", error);
      processSimulatedAudioData(2, 0.5);
    }
  };
  
  const processSimulatedAudioData = (duration = 2, intensity = 0.5) => {
    // Simuler ou analyser réellement l'audio
    const data = analyzeAudio(duration, intensity);
    setAudioData(data);
    
    // Dessiner le graphique une fois les données disponibles
    setTimeout(() => {
      if (data) {
        drawWaveform();
      }
    }, 100);
  };
  
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);
    
    // Ajouter un fond subtil avec un dégradé
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(255, 248, 240, 0.5)');
    bgGradient.addColorStop(1, 'rgba(255, 240, 230, 0.5)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Ajouter une grille subtile
    ctx.strokeStyle = 'rgba(255, 120, 50, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Lignes horizontales
    for (let y = 20; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Lignes verticales
    for (let x = 20; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Diviser le canvas en deux parties: 60% pour la forme d'onde, 40% pour les échantillons
    const waveformHeight = Math.floor(height * 0.6);
    const samplesHeight = height - waveformHeight;
    const waveformTop = 0;
    const samplesTop = waveformHeight;
    
    // Ajouter une ligne de séparation élégante
    const separatorGradient = ctx.createLinearGradient(0, samplesTop-1, width, samplesTop-1);
    separatorGradient.addColorStop(0, 'rgba(255, 120, 50, 0.01)');
    separatorGradient.addColorStop(0.2, 'rgba(255, 120, 50, 0.3)');
    separatorGradient.addColorStop(0.5, 'rgba(255, 120, 50, 0.5)');
    separatorGradient.addColorStop(0.8, 'rgba(255, 120, 50, 0.3)');
    separatorGradient.addColorStop(1, 'rgba(255, 120, 50, 0.01)');
    
    ctx.fillStyle = separatorGradient;
    ctx.fillRect(0, samplesTop-1, width, 2);
    
    // Partie 1: Dessiner la forme d'onde
    if (audioFrequencies.current.length > 0) {
      // Créer un dégradé plus riche pour la forme d'onde
      const gradient = ctx.createLinearGradient(0, waveformTop, 0, waveformTop + waveformHeight);
      gradient.addColorStop(0, '#ff3b00');
      gradient.addColorStop(0.4, '#ff7800');
      gradient.addColorStop(0.6, '#ff9500');
      gradient.addColorStop(1, '#ffb700');
      
      // Ajouter un effet de lueur
      ctx.shadowColor = 'rgba(255, 85, 0, 0.4)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      ctx.fillStyle = gradient;
      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 2;
      
      // Dessiner un titre plus élégant avec effet
      const titleX = 10;
      const titleY = 24;
      
      // Ombre du titre pour effet 3D
      ctx.shadowColor = 'rgba(255, 100, 0, 0.5)';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#ff8500';
      ctx.font = 'bold 14px "Arial", sans-serif';
      let title = "Forme d'Onde Acoustique";
      if (simulationMode.current) {
        title += ` - ${simulationName.current}`;
      }
      ctx.fillText(title, titleX, titleY);
      
      // Réinitialiser l'ombre pour le reste du dessin
      ctx.shadowBlur = 3;
      
      // Dessiner la forme d'onde proprement dite
      ctx.beginPath();
      ctx.moveTo(0, waveformTop + waveformHeight);
      
      const points = audioFrequencies.current.length;
      
      // Facteur d'échelle pour les amplitudes
      const amplitudeScale = waveformHeight / 120;
      
      for (let i = 0; i < points; i++) {
        const x = i * (width / (points - 1));
        const normalizedAmplitude = audioAmplitudes.current[i] * amplitudeScale;
        const y = waveformTop + waveformHeight - normalizedAmplitude;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      // Fermer le chemin en bas
      ctx.lineTo(width, waveformTop + waveformHeight);
      ctx.lineTo(0, waveformTop + waveformHeight);
      
      // Remplir et dessiner le contour avec effet de lueur
      ctx.fill();
      ctx.stroke();
      
      // Réinitialiser l'ombre pour les marqueurs
      ctx.shadowBlur = 0;
      
      // Ajouter des indicateurs de données clés dans la forme d'onde
      // Trouver la fréquence et l'amplitude dominantes pour les mettre en évidence
      const maxFreqIndex = audioAmplitudes.current.reduce((maxIndex, amplitude, index, array) => 
        amplitude > array[maxIndex] ? index : maxIndex, 0);
      
      const peakX = maxFreqIndex * (width / (points - 1));
      const peakY = waveformTop + waveformHeight - (audioAmplitudes.current[maxFreqIndex] * amplitudeScale);
      
      // Dessiner un marqueur plus élaboré à la position du pic d'amplitude
      // Cercle extérieur avec glow
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 9, 0, Math.PI * 2);
      ctx.fill();
      
      // Cercle intérieur
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ff3b00';
      ctx.beginPath();
      ctx.arc(peakX, peakY, 5, 0, Math.PI * 2);
      ctx.fill();
      
      // Ligne pointant vers le pic
      ctx.setLineDash([2, 2]);
      ctx.strokeStyle = 'rgba(255, 59, 0, 0.5)';
      ctx.beginPath();
      ctx.moveTo(peakX, waveformTop);
      ctx.lineTo(peakX, peakY - 12);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Mini étiquette
      ctx.fillStyle = 'rgba(255, 59, 0, 0.9)';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PIC', peakX, peakY - 15);
      ctx.textAlign = 'start';
      
      // Ajouter des étiquettes pour les valeurs clés directement sur le graphique
      // Dessiner une boîte d'information avec les valeurs clés
      const infoBoxWidth = 160;
      const infoBoxHeight = 85;
      const infoBoxX = width - infoBoxWidth - 15;
      const infoBoxY = 12;
      
      // Rectangle avec dégradé et coins arrondis
      const boxGradient = ctx.createLinearGradient(infoBoxX, infoBoxY, infoBoxX, infoBoxY + infoBoxHeight);
      boxGradient.addColorStop(0, 'rgba(255, 85, 0, 0.85)');
      boxGradient.addColorStop(1, 'rgba(255, 120, 0, 0.85)');
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      ctx.fillStyle = boxGradient;
      ctx.beginPath();
      ctx.roundRect(infoBoxX, infoBoxY, infoBoxWidth, infoBoxHeight, 8);
      ctx.fill();
      
      // Bord lustré
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(infoBoxX + 0.5, infoBoxY + 0.5, infoBoxWidth - 1, infoBoxHeight - 1, 8);
      ctx.stroke();
      
      // Texte des valeurs clés avec mise en forme améliorée
      // Titre de la boîte
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px Arial';
      ctx.fillText("DONNÉES CLÉS", infoBoxX + 12, infoBoxY + 22);
      
      // Sous-titre
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'italic 9px Arial';
      ctx.fillText("Paramètres acoustiques", infoBoxX + 12, infoBoxY + 34);
      
      // Ligne séparatrice
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(infoBoxX + 10, infoBoxY + 38);
      ctx.lineTo(infoBoxX + infoBoxWidth - 10, infoBoxY + 38);
      ctx.stroke();
      
      // Valeurs avec icônes
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = '#ffffff';
      
      // Fréquence
      ctx.fillText(`${formatValue(dominantFrequency.current)} Hz`, infoBoxX + 30, infoBoxY + 54);
      ctx.font = '10px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`Fréquence`, infoBoxX + 30, infoBoxY + 66);
      
      // Amplitude
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${formatValue(dominantAmplitude.current)}%`, infoBoxX + 105, infoBoxY + 54);
      ctx.font = '10px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`Amplitude`, infoBoxX + 105, infoBoxY + 66);
      
      // Durée
      ctx.font = 'bold 11px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${formatValue(audioTimestamps.current[audioTimestamps.current.length-1])} sec`, infoBoxX + 70, infoBoxY + 81);
      ctx.font = '10px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(`Durée`, infoBoxX + 70, infoBoxY + 93);
    }
    
    // Partie 2: Dessiner les échantillons (12 par seconde)
    if (audioFrequencies.current.length > 0) {
      // Titre de la section des échantillons avec style amélioré
      ctx.fillStyle = '#ff5500';
      ctx.shadowColor = 'rgba(255, 100, 0, 0.3)';
      ctx.shadowBlur = 3;
      ctx.font = 'bold 13px Arial';
      ctx.fillText('Échantillons Acoustiques - 12 points/seconde', 10, samplesTop + 20);
      ctx.shadowBlur = 0;
      
      const points = audioFrequencies.current.length;
      const barWidth = Math.min(8, width / points);
      const barSpacing = 2;
      const totalBarWidth = barWidth + barSpacing;
      
      // Normaliser les valeurs pour les barres
      const maxFreq = Math.max(...audioFrequencies.current);
      const freqScale = (samplesHeight * 0.75) / maxFreq;
      
      const maxAmp = Math.max(...audioAmplitudes.current);
      const ampScale = (samplesHeight * 0.75) / maxAmp;
      
      // Créer des gradients pour les barres
      const freqGradient = ctx.createLinearGradient(0, samplesTop, 0, samplesTop + samplesHeight);
      freqGradient.addColorStop(0, 'rgba(255, 100, 0, 0.9)');
      freqGradient.addColorStop(1, 'rgba(255, 100, 0, 0.6)');
      
      const ampGradient = ctx.createLinearGradient(0, samplesTop, 0, samplesTop + samplesHeight);
      ampGradient.addColorStop(0, 'rgba(255, 180, 0, 0.9)');
      ampGradient.addColorStop(1, 'rgba(255, 180, 0, 0.6)');
      
      // Dessiner les barres pour chaque échantillon avec effets
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 2;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      for (let i = 0; i < points; i++) {
        const x = i * (width / (points - 1));
        
        // Barre pour la fréquence
        const freqHeight = audioFrequencies.current[i] * freqScale;
        ctx.fillStyle = freqGradient;
        ctx.fillRect(
          x - totalBarWidth / 2, 
          samplesTop + samplesHeight - freqHeight, 
          barWidth / 2, 
          freqHeight
        );
        
        // Barre pour l'amplitude
        const ampHeight = audioAmplitudes.current[i] * ampScale;
        ctx.fillStyle = ampGradient;
        ctx.fillRect(
          x - totalBarWidth / 2 + barWidth / 2, 
          samplesTop + samplesHeight - ampHeight, 
          barWidth / 2, 
          ampHeight
        );
        
        // Marquer chaque seconde avec plus de style
        if (i % 12 === 0) {
          const timeInSec = Math.floor(i / 12);
          
          // Ligne verticale de repère
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255, 85, 0, 0.2)';
          ctx.setLineDash([1, 1]);
          ctx.beginPath();
          ctx.moveTo(x, samplesTop + 25);
          ctx.lineTo(x, samplesTop + samplesHeight - 5);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Marqueur de temps
          ctx.fillStyle = 'rgba(255, 85, 0, 0.8)';
          ctx.beginPath();
          ctx.arc(x, samplesTop + samplesHeight - 5, 8, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${timeInSec}s`, x, samplesTop + samplesHeight - 2);
          ctx.textAlign = 'start';
        }
      }
      
      // Réinitialiser les effets d'ombre
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      
      // Légende améliorée
      // Fond de la légende
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.roundRect(width - 125, samplesTop + 8, 115, 38, 5);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 120, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(width - 125, samplesTop + 8, 115, 38, 5);
      ctx.stroke();
      
      // Icônes et texte
      ctx.fillStyle = 'rgba(255, 100, 0, 0.8)';
      ctx.fillRect(width - 115, samplesTop + 15, 10, 10);
      ctx.fillStyle = '#ff5500';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('Fréquence', width - 100, samplesTop + 23);
      
      ctx.fillStyle = 'rgba(255, 180, 0, 0.8)';
      ctx.fillRect(width - 115, samplesTop + 30, 10, 10);
      ctx.fillStyle = '#ff5500';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('Amplitude', width - 100, samplesTop + 38);
    }
  };
  
  // Valeurs intéressantes à afficher
  const formatValue = (value: number, decimals = 1) => {
    return value ? value.toFixed(decimals) : "N/A";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl p-6 transform hover:scale-[1.01] transition-transform mb-8 border-2 border-orange-200 relative overflow-hidden">
      {/* Élément décoratif - vague stylisée en position absolue */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-100/40 to-amber-200/40 rounded-full blur-xl"></div>
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-red-100/30 to-orange-200/30 rounded-full blur-xl"></div>
      
      <div className="flex justify-between items-center mb-4 relative">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 flex items-center">
          <span className="text-red-500 mr-2">🔊</span> Analyse de l'Enregistrement
        </h2>
        
        {!hasRealRecording && (
          <div className="bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 px-3 py-1 rounded-full text-sm font-medium border border-amber-300 shadow-sm">
            Simulation
          </div>
        )}
      </div>
      
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-orange-200 shadow-inner relative">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-3 flex items-center">
            <span className="inline-block w-3 h-3 bg-gradient-to-br from-red-500 to-orange-400 rounded-full mr-2"></span>
            Signature Acoustique
          </h3>
          <div className="bg-white/90 p-2 rounded-xl shadow-md border border-orange-200 h-80 hover:shadow-lg transition-shadow duration-300">
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={320} 
              className="w-full h-full"
            ></canvas>
          </div>
          <div className="mt-2 text-sm text-orange-600 text-center font-medium">
            Visualisation temporelle avec 12 échantillons/seconde ({hasRealRecording ? 'enregistrement réel' : 'simulation'})
          </div>
        </div>
        
        {audioData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-md border border-orange-200 text-center transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
              <div className="text-orange-600 font-medium mb-1 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Fréquence Dominante
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {formatValue(audioData.frequency)} <span className="text-sm text-orange-500">Hz</span>
              </div>
              <div className="text-xs text-orange-600 mt-2 font-medium py-1 px-2 rounded-full bg-orange-100/50 inline-block">
                {audioData.frequency < 150 ? "Tonalité grave" : 
                 audioData.frequency < 400 ? "Tonalité moyenne" : "Tonalité aiguë"}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-md border border-orange-200 text-center transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
              <div className="text-orange-600 font-medium mb-1 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Amplitude Maximale
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {formatValue(audioData.amplitude * 100)} <span className="text-sm text-orange-500">%</span>
              </div>
              <div className="text-xs text-orange-600 mt-2 font-medium py-1 px-2 rounded-full bg-orange-100/50 inline-block">
                {audioData.amplitude < 0.3 ? "Volume discret" : 
                 audioData.amplitude < 0.7 ? "Volume modéré" : "Volume élevé"}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-md border border-orange-200 text-center transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
              <div className="text-orange-600 font-medium mb-1 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Durée Totale
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {formatValue(audioData.duration)} <span className="text-sm text-orange-500">sec</span>
              </div>
              <div className="text-xs text-orange-600 mt-2 font-medium py-1 px-2 rounded-full bg-orange-100/50 inline-block">
                {audioData.duration < 1 ? "Court et précis" : 
                 audioData.duration < 3 ? "Durée moyenne" : "Longue performance"}
              </div>
            </div>
          </div>
        ) : (
          // Si audioData n'est pas défini, affichez des données alternatives
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-md border border-orange-200 text-center transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
              <div className="text-orange-600 font-medium mb-1 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Fréquence Dominante
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {formatValue(dominantFrequency.current || 280)} <span className="text-sm text-orange-500">Hz</span>
              </div>
              <div className="text-xs text-orange-600 mt-2 font-medium py-1 px-2 rounded-full bg-orange-100/50 inline-block">
                {(dominantFrequency.current || 280) < 150 ? "Tonalité grave" : 
                 (dominantFrequency.current || 280) < 400 ? "Tonalité moyenne" : "Tonalité aiguë"}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-md border border-orange-200 text-center transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
              <div className="text-orange-600 font-medium mb-1 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Amplitude Maximale
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {formatValue((dominantAmplitude.current || 75))} <span className="text-sm text-orange-500">%</span>
              </div>
              <div className="text-xs text-orange-600 mt-2 font-medium py-1 px-2 rounded-full bg-orange-100/50 inline-block">
                {(dominantAmplitude.current || 75) < 30 ? "Volume discret" : 
                 (dominantAmplitude.current || 75) < 70 ? "Volume modéré" : "Volume élevé"}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-orange-50 p-4 rounded-xl shadow-md border border-orange-200 text-center transform hover:scale-[1.02] hover:shadow-lg transition-all duration-300">
              <div className="text-orange-600 font-medium mb-1 flex items-center justify-center">
                <span className="inline-block w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Durée Totale
              </div>
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {formatValue(audioTimestamps.current.length > 0 ? audioTimestamps.current[audioTimestamps.current.length-1] : 2)} <span className="text-sm text-orange-500">sec</span>
              </div>
              <div className="text-xs text-orange-600 mt-2 font-medium py-1 px-2 rounded-full bg-orange-100/50 inline-block">
                {(audioTimestamps.current.length > 0 ? audioTimestamps.current[audioTimestamps.current.length-1] : 2) < 1 ? "Court et précis" : 
                 (audioTimestamps.current.length > 0 ? audioTimestamps.current[audioTimestamps.current.length-1] : 2) < 3 ? "Durée moyenne" : "Longue performance"}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-gradient-to-br from-white to-orange-50 p-5 rounded-xl shadow-md border border-orange-200 relative overflow-hidden">
          {/* Élément décoratif dans le coin */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-100/40 to-amber-200/40 rounded-full blur-md"></div>
          
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-3 flex items-center relative z-10">
            <span className="inline-block w-2 h-2 bg-gradient-to-br from-red-500 to-orange-400 rounded-full mr-2"></span>
            Transcription par nos experts
          </h3>
          <p className="text-orange-800 leading-relaxed relative z-10 bg-white/50 p-4 rounded-lg shadow-inner">
            {audioData || dominantFrequency.current ? (
              <>
                Cette signature acoustique révèle un pet de 
                {(audioData?.frequency || dominantFrequency.current) < 150 ? " basse fréquence caractéristique d'une origine profonde" : 
                 (audioData?.frequency || dominantFrequency.current) < 400 ? " fréquence moyenne indiquant un équilibre intestinal optimal" : 
                 " haute fréquence témoignant d'une pression élevée"}, avec une amplitude 
                {(audioData?.amplitude || dominantAmplitude.current/100) < 0.3 ? " discrète suggérant une maîtrise sphinctérienne remarquable" : 
                 (audioData?.amplitude || dominantAmplitude.current/100) < 0.7 ? " modérée démontrant un contrôle équilibré" : 
                 " impressionnante révélant une puissance abdominale exceptionnelle"}.
                Sa durée de {formatValue(audioData?.duration || (audioTimestamps.current.length > 0 ? audioTimestamps.current[audioTimestamps.current.length-1] : 2))} secondes 
                {(audioData?.duration || (audioTimestamps.current.length > 0 ? audioTimestamps.current[audioTimestamps.current.length-1] : 2)) < 1 ? " témoigne d'une efficacité digestive optimale" : 
                 (audioData?.duration || (audioTimestamps.current.length > 0 ? audioTimestamps.current[audioTimestamps.current.length-1] : 2)) < 3 ? " indique un système gastro-intestinal en pleine forme" : 
                 " démontre une capacité de stockage gazeux extraordinaire"}.
              </>
            ) : "Analyse en cours..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualizationSection; 