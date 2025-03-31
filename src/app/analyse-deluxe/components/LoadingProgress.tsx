import { useState, useEffect } from 'react';

// Messages humoristiques pour la barre de progression
const LOADING_MESSAGES = [
  "Analyse des harmoniques flatulentes en cours...",
  "Calibration du spectromètre de gaz intestinaux...",
  "Interrogation des bactéries intestinales...",
  "Décodage des messages subliminaux contenus dans votre pet...",
  "Consultation de la base de données mondiale des flatulences...",
  "Calcul du ratio méthane/sulfure d'hydrogène...",
  "Évaluation du potentiel de réchauffement climatique...",
  "Comparaison avec les pets des célébrités (anonymisés)...",
  "Vérification des propriétés inflammables...",
  "Analyse psychologique de votre sphincter...",
  "Calcul de la vitesse de propulsion...",
  "Mesure du niveau de surprise des personnes présentes...",
  "Estimation du rayon d'action olfactif...",
  "Interrogation des experts pétologues internationaux...",
  "Synchronisation des données avec le satellite PET-SAT 3000...",
];

const LoadingProgress = () => {
  const [progressValue, setProgressValue] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  
  useEffect(() => {
    // Augmenter la progression de façon réaliste
    const interval = setInterval(() => {
      setProgressValue(prev => {
        // Accélération au début, puis ralentissement à la fin
        const increment = prev < 30 ? 3 : prev > 70 ? 1 : 2;
        
        // Valeur maximale 95% - les derniers 5% seront complétés lors du chargement final
        return Math.min(95, prev + increment);
      });
      
      // Changer le message de temps en temps
      if (Math.random() > 0.7) {
        setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }
    }, 180);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-orange-600 mb-2">Analyse Premium en cours</h2>
          <p className="text-gray-600 mb-4">Nos serveurs quantiques analysent votre pet avec la plus haute précision scientifique</p>
          
          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-300 flex items-center justify-end"
              style={{ width: `${progressValue}%` }}
            >
              {progressValue > 15 && (
                <span className="text-white text-xs font-bold mr-2">{progressValue}%</span>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 italic animate-pulse">
            {LOADING_MESSAGES[messageIndex]}
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-4 relative overflow-hidden">
            <span className="text-5xl animate-bounce">💨</span>
            <div className="absolute inset-0 bg-gradient-to-t from-orange-100 to-transparent animate-pulse"></div>
          </div>
          
          <p className="text-sm text-gray-500">
            Saviez-vous qu'un pet moyen voyage à une vitesse de 10km/h? Vous êtes sur le point de découvrir tous les secrets des vôtres.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingProgress; 