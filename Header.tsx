
import React from 'react';

interface HeaderProps {
  isPremium?: boolean;
  onOpenProtocols?: () => void;
  onOpenSpecialists?: () => void;
  onOpenCalculators?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isPremium = false, onOpenProtocols, onOpenSpecialists, onOpenCalculators }) => {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
             <div className="absolute inset-0 border-[3px] border-fleming-light rounded-xl opacity-80 translate-x-1 -translate-y-1"></div>
             <div className="absolute inset-0 border-[3px] border-fleming-dark rounded-xl"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1 h-5 bg-fleming-dark rounded-full"></div>
                <div className="w-5 h-1 bg-fleming-dark rounded-full absolute"></div>
             </div>
          </div>
          <div className="flex flex-col leading-none">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-fleming-dark tracking-tighter">fleming</span>
              <div className="flex items-center gap-1.5">
                {isPremium && (
                  <span className="bg-amber-400 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shadow-sm">Premium</span>
                )}
              </div>
            </div>
            <span className="text-[7px] font-black text-slate-400 tracking-[0.2em] uppercase mt-1">Ao seu lado, por sua saúde</span>
          </div>
        </div>
        <nav className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <a href="#" className="text-fleming-dark border-b-2 border-fleming-light pb-1">Analisador</a>
          <button onClick={onOpenProtocols} className="hover:text-fleming-dark transition-colors border-b-2 border-transparent hover:border-fleming-light pb-1">Protocolos</button>
          <button onClick={onOpenCalculators} className="hover:text-fleming-dark transition-colors border-b-2 border-transparent hover:border-fleming-light pb-1">Ferramentas</button>
          <button onClick={onOpenSpecialists} className="hover:text-fleming-dark transition-colors border-b-2 border-transparent hover:border-fleming-light pb-1">Especialistas</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
