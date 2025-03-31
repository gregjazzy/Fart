import React from 'react';
import { AnalysisContent } from '../utils/contentGeneration';

interface ScientificReportSectionProps {
  analysis: AnalysisContent;
}

const ScientificReportSection: React.FC<ScientificReportSectionProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-xl shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-300 mb-8 border border-indigo-100 relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-1000"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-3000"></div>
      
      <div className="relative">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 mb-5 flex items-center">
          <span className="text-indigo-600 mr-3 bg-indigo-100 p-1.5 rounded-lg shadow-sm">🧪</span> 
          Rapport Scientifique
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panneau de composition chimique */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 shadow-inner">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-500 mb-4 text-center">
              Composition Chimique
            </h3>
            <div className="w-full bg-white/60 p-4 rounded-lg shadow-sm backdrop-blur-sm mb-4">
              <div className="h-48 relative flex flex-col justify-center items-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="w-30 h-30 rounded-full bg-gradient-to-br from-indigo-500/30 to-blue-500/30 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/40 to-blue-500/40 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-indigo-900 font-bold text-sm">Flatulence</div>
                        <div className="text-indigo-600 text-xs font-medium">Analyse chimique</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/60 p-4 rounded-lg shadow-sm backdrop-blur-sm flex flex-col">
              <h4 className="text-base font-semibold text-indigo-700 mb-2">Composants & Effets</h4>
              <div className="divide-y divide-indigo-100 flex-grow overflow-auto max-h-60">
                {analysis.chemicals.map((chemical, index) => (
                  <div key={index} className="py-3 px-1 hover:bg-indigo-50/50 transition-colors rounded-md">
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: index % 2 === 0 ? 'rgba(100, 130, 255, 0.8)' : 'rgba(180, 100, 255, 0.8)'}}></div>
                      <div className="font-medium text-indigo-800">{chemical.name}</div>
                      <div className="ml-auto text-indigo-600 font-semibold">{chemical.percentage.toFixed(1)}%</div>
                    </div>
                    <p className="text-indigo-700 text-sm pl-5">{chemical.effect}</p>
                  </div>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-indigo-100">
                <div className="text-xs text-indigo-500 italic">
                  Analyse réalisée avec une précision de ±0.1% selon les standards de l'Institut de Pétologie Avancée.
                </div>
              </div>
            </div>
          </div>
          
          {/* Panneau des paramètres acoustiques */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-200 shadow-inner">
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-500 mb-4 text-center">
              Paramètres Acoustiques
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {analysis.parameters.map((param, index) => (
                <div key={index} className="bg-white/60 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 backdrop-blur-sm border border-indigo-100/50 overflow-hidden relative group">
                  {/* Effet de hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="flex items-start justify-between mb-2 relative z-10">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mr-2 animate-pulse"></span>
                      <h4 className="font-semibold text-indigo-800">{param.name}</h4>
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold text-indigo-700">{param.value}</span>
                      {param.unit && <span className="ml-1 text-sm text-indigo-500">{param.unit}</span>}
                    </div>
                  </div>
                  
                  {/* Barre de progression stylisée */}
                  <div className="h-2 bg-indigo-100 rounded-full mb-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, Math.random() * 70 + 30)}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-indigo-700 relative z-10">{param.interpretation}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-indigo-100/50 p-3 rounded-lg">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-2 rounded-lg mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-indigo-800 text-sm">
                  Les paramètres acoustiques sont mesurés en temps réel grâce à notre technologie exclusive d'analyse vibratoire multi-spectrale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificReportSection; 