
import React, { useState } from 'react';
import { BiomarkerDraft } from '../types';

interface OCRReviewProps {
  drafts: BiomarkerDraft[];
  onConfirm: (finalDrafts: BiomarkerDraft[]) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const OCRReview: React.FC<OCRReviewProps> = ({ drafts, onConfirm, onCancel, isLoading }) => {
  const [items, setItems] = useState<BiomarkerDraft[]>(drafts);

  const updateItem = (index: number, field: keyof BiomarkerDraft, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { name: '', value: '', unit: '' }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between bg-slate-50 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-black text-fleming-dark">Revisão do Especialista</h2>
            <span className="bg-fleming-dark text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
              {items.length} ITENS DETECTADOS
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Garanta que todos os exames (numéricos e qualitativos) estejam listados.</p>
        </div>
        <button 
          onClick={addItem}
          className="px-4 py-2 bg-white border border-slate-200 text-fleming-dark rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
          Adicionar Exame
        </button>
      </div>

      <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 sticky top-0 z-10">
            <tr>
              <th className="px-8 py-4 bg-slate-50">Biomarcador</th>
              <th className="px-8 py-4 w-40 bg-slate-50">Resultado</th>
              <th className="px-8 py-4 w-32 bg-slate-50">Unidade</th>
              <th className="px-8 py-4 w-16 text-center bg-slate-50">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((item, idx) => (
              <tr key={idx} className="group hover:bg-fleming-light/5 transition-colors">
                <td className="px-8 py-4">
                  <input 
                    type="text" 
                    value={item.name} 
                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-700 placeholder-slate-300"
                    placeholder="Nome do exame..."
                  />
                </td>
                <td className="px-8 py-4">
                  <input 
                    type="text" 
                    value={item.value} 
                    onChange={(e) => updateItem(idx, 'value', e.target.value)}
                    className="w-full bg-slate-100/50 rounded-lg px-4 py-2 font-black text-fleming-dark border-2 border-transparent focus:border-fleming-light focus:bg-white outline-none transition-all"
                    placeholder="Valor ou Texto"
                  />
                </td>
                <td className="px-8 py-4">
                  <input 
                    type="text" 
                    value={item.unit} 
                    onChange={(e) => updateItem(idx, 'unit', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-400 placeholder-slate-200"
                    placeholder="Unid."
                  />
                </td>
                <td className="px-8 py-4 text-center">
                  <button 
                    onClick={() => removeItem(idx)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-8 bg-slate-50 flex flex-col md:flex-row gap-4 justify-between items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
           Total de {items.length} biomarcadores prontos para processamento sistêmico.
        </p>
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={onCancel}
            className="flex-1 md:flex-none px-8 py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-100 transition-all"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(items)}
            disabled={isLoading || items.length === 0}
            className="flex-1 md:flex-none px-12 py-3 bg-fleming-dark text-white font-black rounded-2xl shadow-xl shadow-fleming-dark/20 hover:bg-[#345424] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analisando...
              </>
            ) : (
              'Gerar Laudo Completo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OCRReview;
