import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
  duration?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete, 
  duration = 6000 
}) => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  
  const loadingMessages = [
    "Calibration des capteurs acoustiques...",
    "Analyse des harmoniques flatulentes...",
    "Identification des composés chimiques...",
    "Consultation de la base de données pétologiques...",
    "Interprétation des modulations sonores...",
    "Génération du profil de personnalité intestinale...",
    "Calcul des probabilités de résonance sociale...",
    "Application des algorithmes de traduction flatulo-linguistique...",
    "Comparaison avec l'encyclopédie des flatulences historiques...",
    "Finalisation du rapport scientifique..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prevProgress + (100 / (duration / 100));
      });
    }, 100);

    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => 
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, duration / loadingMessages.length);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-indigo-900 flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/10 backdrop-blur-sm shadow-2xl text-center">
        <div className="animate-bounce mb-5">
          <div className="text-white text-5xl">💨</div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-6">Analyse Avancée en Cours</h2>
        
        <div className="mb-6 relative">
          <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-white mt-2 text-sm">{Math.round(progress)}%</div>
        </div>
        
        <div className="h-16 flex items-center justify-center">
          <p className="text-white text-lg font-medium transition-opacity duration-300">
            {loadingMessages[currentMessageIndex]}
          </p>
        </div>
        
        <div className="mt-8 text-indigo-200 text-xs">
          Propulsé par la technologie avancée de l'Institut de Pétologie
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 