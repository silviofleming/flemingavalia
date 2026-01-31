
import React from 'react';
import { HistoryItem } from '../types';

interface SidebarProps {
  history: HistoryItem[];
  onSelect: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, onSelect, isOpen, onClose }) => {
  return (
    <aside className={`fixed left-0 top-20 h-[calc(100vh-80px)] bg-white border-r border-slate-200 w-72 transition-transform duration-300 z-40 print:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Histórico de Pacientes</h3>
          <button onClick={onClose} className="md:hidden text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {history.length > 0 ? history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="w-full text-left p-4 rounded-2xl border border-slate-100 hover:border-fleming-light hover:bg-fleming-light/5 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{item.date}</span>
                <span className="text-[10px] font-black text-fleming-dark bg-fleming-light/10 px-1.5 py-0.5 rounded">
                  {item.score}%
                </span>
              </div>
              <p className="font-bold text-slate-700 text-sm group-hover:text-fleming-dark transition-colors truncate">
                {item.patientName}
              </p>
            </button>
          )) : (
            <div className="text-center py-12 opacity-40">
              <p className="text-xs font-bold uppercase tracking-widest">Nenhuma análise salva</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Espaço do Profissional</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-fleming-dark flex items-center justify-center text-white text-[10px] font-black">DR</div>
              <div className="leading-none">
                <p className="text-xs font-bold text-slate-700">Dr. Fleming AI</p>
                <p className="text-[9px] text-slate-400">CRM 123456-SP</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
