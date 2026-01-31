
import React, { useState } from 'react';
import { AnalysisMode } from '../types';

interface ExamUploaderProps {
  onAnalyze: (data: string | { data: string, mimeType: string }, isImage: boolean) => void;
  isLoading: boolean;
}

const ExamUploader: React.FC<ExamUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.TEXT);
  const [textInput, setTextInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        onAnalyze({ data: base64Data, mimeType: file.type }, true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitText = () => {
    if (textInput.trim()) {
      onAnalyze(textInput, false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 max-w-2xl mx-auto">
      <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
        <button
          onClick={() => setMode(AnalysisMode.TEXT)}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
            mode === AnalysisMode.TEXT ? 'bg-white shadow-sm text-fleming-dark' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Colar Resultados
        </button>
        <button
          onClick={() => setMode(AnalysisMode.IMAGE)}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
            mode === AnalysisMode.IMAGE ? 'bg-white shadow-sm text-fleming-dark' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Upload de Foto/PDF
        </button>
      </div>

      {mode === AnalysisMode.TEXT ? (
        <div className="space-y-6">
          <textarea
            className="w-full h-56 p-5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-fleming-light focus:border-fleming-dark outline-none transition-all text-slate-700 placeholder-slate-400 font-medium"
            placeholder="Exemplo: Glicemia de jejum: 98 mg/dL, Vitamina D: 32 ng/mL..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button
            onClick={handleSubmitText}
            disabled={isLoading || !textInput.trim()}
            className="w-full py-5 bg-fleming-dark hover:bg-[#345424] disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-lg shadow-fleming-dark/20 flex items-center justify-center gap-3 text-lg"
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Processando Inteligência...
              </>
            ) : (
              'Analisar com Fleming Saúde'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <label 
            className={`flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              dragActive ? 'border-fleming-light bg-fleming-light/10' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="w-16 h-16 mb-4 bg-fleming-dark/10 rounded-full flex items-center justify-center text-fleming-dark">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 012 2H5a2 2 0 01-2-2V9z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="mb-2 text-sm text-slate-700 font-semibold">
                Tire uma foto ou selecione o arquivo
              </p>
              <p className="text-xs text-slate-400">Suporte para Laudos em JPG, PNG ou PDF</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*,.pdf" 
              onChange={handleFileChange} 
              disabled={isLoading}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default ExamUploader;
