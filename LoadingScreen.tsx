
import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  stage: 'extracting' | 'generating';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ stage }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = {
    extracting: [
      "Iniciando visão computacional Fleming...",
      "Mapeando biomarcadores com precisão...",
      "Identificando unidades e valores laboratoriais...",
      "Quase pronto para sua revisão..."
    ],
    generating: [
      "Cruzando dados com protocolos Integrativos...",
      "Calculando níveis ótimos para sua biologia...",
      "Sintetizando recomendações nutricionais...",
      "Finalizando seu relatório estratégico..."
    ]
  };

  const activeMessages = messages[stage];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % activeMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [activeMessages]);

  return (
    <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="relative w-24 h-24 mb-10">
        {/* Animated concentric circles */}
        <div className="absolute inset-0 border-4 border-fleming-light/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-fleming-dark rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-4 border-b-fleming-light rounded-full animate-spin-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-fleming-dark rounded-full animate-ping"></div>
        </div>
      </div>

      <div className="text-center space-y-4 max-w-md">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Inteligência <span className="text-fleming-dark">Fleming</span>
        </h3>
        <div className="h-6">
          <p className="text-slate-500 font-medium animate-pulse transition-all duration-500">
            {activeMessages[messageIndex]}
          </p>
        </div>
        
        <div className="pt-8 flex gap-1 justify-center">
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-700 ${
                i <= messageIndex ? 'w-8 bg-fleming-dark' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
