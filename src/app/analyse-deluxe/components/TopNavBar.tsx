import Link from 'next/link';

type TopNavBarProps = {
  onGeneratePDF: () => void;
  onPrint: () => void;
};

const TopNavBar = ({ onGeneratePDF, onPrint }: TopNavBarProps) => {
  return (
    <div className="bg-white shadow-md py-3 px-4 mb-6 rounded-lg flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="flex items-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center">
          <span className="mr-2">🏠</span>
          Accueil
        </button>
      </Link>
      
      <div className="text-center text-xl font-bold text-gray-800">
        Rapport d'Analyse Premium Pet-O-Matic
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={onGeneratePDF}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
        >
          <span className="mr-2">📑</span>
          Rapport PDF
        </button>
        
        <button 
          onClick={onPrint}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center"
        >
          <span className="mr-2">🖨️</span>
          Imprimer
        </button>
      </div>
    </div>
  );
};

export default TopNavBar; 