
import React, { useState, useEffect } from 'react';

interface CalculatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculatorCard: React.FC<{ 
  title: string; 
  description: string; 
  children: React.ReactNode; 
  result: number | string | null; 
  unit?: string;
  status?: 'ideal' | 'alerta' | 'critico';
  reference: string;
}> = ({ title, description, children, result, unit, status, reference }) => {
  const statusColors = {
    ideal: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    alerta: 'text-amber-500 bg-amber-50 border-amber-100',
    critico: 'text-rose-500 bg-rose-50 border-rose-100',
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 flex flex-col h-full transition-all hover:shadow-md">
      <div className="space-y-1">
        <h4 className="font-black text-slate-900 text-lg tracking-tight">{title}</h4>
        <p className="text-xs text-slate-400 font-medium leading-relaxed">{description}</p>
      </div>
      
      <div className="flex-grow space-y-4">
        {children}
      </div>

      <div className="pt-6 border-t border-slate-50 mt-auto">
        <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${status ? statusColors[status] : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Resultado Calculado</span>
          <div className="text-3xl font-black">
            {result !== null ? result : '--'} <span className="text-sm font-bold uppercase">{unit}</span>
          </div>
          <p className="text-[9px] font-bold mt-2 opacity-70 uppercase tracking-widest">{reference}</p>
        </div>
      </div>
    </div>
  );
};

const CalculatorsModal: React.FC<CalculatorsModalProps> = ({ isOpen, onClose }) => {
  // Common State
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientSex, setPatientSex] = useState<'M' | 'F'>('M');

  // HOMA-IR State
  const [glucose, setGlucose] = useState<number | ''>('');
  const [insulin, setInsulin] = useState<number | ''>('');
  const [homaResult, setHomaResult] = useState<number | null>(null);
  const [homaStatus, setHomaStatus] = useState<'ideal' | 'alerta' | 'critico' | undefined>();

  // TG/HDL State
  const [triglycerides, setTriglycerides] = useState<number | ''>('');
  const [hdl, setHdl] = useState<number | ''>('');
  const [ratioResult, setRatioResult] = useState<number | null>(null);
  const [ratioStatus, setRatioStatus] = useState<'ideal' | 'alerta' | 'critico' | undefined>();

  // eGFR State (CKD-EPI)
  const [creatinine, setCreatinine] = useState<number | ''>('');
  const [egfrResult, setEgfrResult] = useState<number | null>(null);
  const [egfrStatus, setEgfrStatus] = useState<'ideal' | 'alerta' | 'critico' | undefined>();

  // Cardiovascular Risk State (Simplified)
  const [systolic, setSystolic] = useState<number | ''>('');
  const [riskResult, setRiskResult] = useState<string | null>(null);
  const [riskStatus, setRiskStatus] = useState<'ideal' | 'alerta' | 'critico' | undefined>();

  useEffect(() => {
    if (glucose && insulin) {
      const res = (Number(glucose) * Number(insulin)) / 405;
      setHomaResult(parseFloat(res.toFixed(2)));
      if (res <= 1.5) setHomaStatus('ideal');
      else if (res <= 2.5) setHomaStatus('alerta');
      else setHomaStatus('critico');
    } else {
      setHomaResult(null);
      setHomaStatus(undefined);
    }
  }, [glucose, insulin]);

  useEffect(() => {
    if (triglycerides && hdl) {
      const res = Number(triglycerides) / Number(hdl);
      setRatioResult(parseFloat(res.toFixed(2)));
      if (res < 2.0) setRatioStatus('ideal');
      else if (res < 3.0) setRatioStatus('alerta');
      else setRatioStatus('critico');
    } else {
      setRatioResult(null);
      setRatioStatus(undefined);
    }
  }, [triglycerides, hdl]);

  useEffect(() => {
    if (creatinine && patientAge && patientSex) {
      const Scr = Number(creatinine);
      const age = Number(patientAge);
      const isFemale = patientSex === 'F';
      
      // CKD-EPI 2021 Equation (Race-free)
      const kappa = isFemale ? 0.7 : 0.9;
      const alpha = isFemale ? -0.241 : -0.302;
      const femaleConstant = isFemale ? 1.012 : 1;
      
      const res = 142 * 
                  Math.pow(Math.min(Scr / kappa, 1), alpha) * 
                  Math.pow(Math.max(Scr / kappa, 1), -1.200) * 
                  Math.pow(0.9938, age) * 
                  femaleConstant;

      setEgfrResult(Math.round(res));
      if (res >= 90) setEgfrStatus('ideal');
      else if (res >= 60) setEgfrStatus('alerta');
      else setEgfrStatus('critico');
    } else {
      setEgfrResult(null);
      setEgfrStatus(undefined);
    }
  }, [creatinine, patientAge, patientSex]);

  useEffect(() => {
    if (patientAge && systolic) {
      const ageVal = Number(patientAge);
      const sysVal = Number(systolic);
      if (sysVal < 120 && ageVal < 50) {
        setRiskResult('Baixo');
        setRiskStatus('ideal');
      } else if (sysVal < 140) {
        setRiskResult('Moderado');
        setRiskStatus('alerta');
      } else {
        setRiskResult('Elevado');
        setRiskStatus('critico');
      }
    } else {
      setRiskResult(null);
      setRiskStatus(undefined);
    }
  }, [patientAge, systolic]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-slate-50 w-full max-w-7xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-fleming-dark rounded-2xl flex items-center justify-center text-white shadow-lg shadow-fleming-dark/20">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Painel de Calculadoras Clínicas</h3>
              <p className="text-sm text-slate-500 font-medium italic">Protocolo Fleming de Precisão Diagnóstica e Bio-Otimização.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-colors group">
            <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Common Inputs Bar */}
        <div className="bg-white px-10 py-6 border-b border-slate-100 flex gap-8 items-end no-print shadow-sm">
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Idade do Paciente</label>
              <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value ? Number(e.target.value) : '')} className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fleming-dark font-black" placeholder="Anos" />
           </div>
           <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sexo Biológico</label>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                 <button onClick={() => setPatientSex('M')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${patientSex === 'M' ? 'bg-fleming-dark text-white' : 'text-slate-400'}`}>M</button>
                 <button onClick={() => setPatientSex('F')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${patientSex === 'F' ? 'bg-fleming-dark text-white' : 'text-slate-400'}`}>F</button>
              </div>
           </div>
           <div className="flex-grow"></div>
           <div className="hidden md:flex flex-col items-end gap-1">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Dados Globais</span>
              <p className="text-[10px] text-slate-400 font-medium max-w-[200px] text-right">Preencha Idade e Sexo para cálculos automáticos de eGFR e Risco CV.</p>
           </div>
        </div>

        {/* Content Grid */}
        <div className="flex-grow overflow-y-auto p-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* HOMA-IR */}
            <CalculatorCard 
              title="Índice HOMA-IR" 
              description="Avaliação da resistência à insulina e integridade metabólica celular."
              result={homaResult}
              unit=""
              status={homaStatus}
              reference="Meta Fleming: < 1.5"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Glicose (mg/dL)</label>
                  <input type="number" value={glucose} onChange={e => setGlucose(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fleming-dark font-black" placeholder="Ex: 85" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Insulina (µUI/mL)</label>
                  <input type="number" value={insulin} onChange={e => setInsulin(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fleming-dark font-black" placeholder="Ex: 5.0" />
                </div>
              </div>
            </CalculatorCard>

            {/* TG/HDL */}
            <CalculatorCard 
              title="Razão TG / HDL" 
              description="Marcador indireto de partículas densas de LDL e risco aterogênico."
              result={ratioResult}
              unit=""
              status={ratioStatus}
              reference="Meta Fleming: < 2.0"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Triglicerídeos (mg/dL)</label>
                  <input type="number" value={triglycerides} onChange={e => setTriglycerides(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fleming-dark font-black" placeholder="Ex: 100" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">HDL (mg/dL)</label>
                  <input type="number" value={hdl} onChange={e => setHdl(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fleming-dark font-black" placeholder="Ex: 60" />
                </div>
              </div>
            </CalculatorCard>

            {/* eGFR (CKD-EPI) */}
            <CalculatorCard 
              title="Taxa de Filtração (eGFR)" 
              description="Equação CKD-EPI para estimativa precisa da função renal sem viés racial."
              result={egfrResult}
              unit="mL/min/1.73m²"
              status={egfrStatus}
              reference="Normal: > 90"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Creatinina Sérica (mg/dL)</label>
                  <input type="number" step="0.01" value={creatinine} onChange={e => setCreatinine(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fleming-dark font-black" placeholder="Ex: 0.95" />
                </div>
                <div className="p-3 bg-fleming-dark/5 rounded-xl border border-fleming-dark/10">
                   <p className="text-[8px] text-fleming-dark font-bold leading-tight uppercase">Utiliza idade e sexo biológico definidos no painel superior.</p>
                </div>
              </div>
            </CalculatorCard>

            {/* CV Risk */}
            <CalculatorCard 
              title="Risco Cardiovascular" 
              description="Avaliação de risco de eventos CV maiores com base em pressão e idade."
              result={riskResult}
              unit=""
              status={riskStatus}
              reference="Foco: Prevenção Primária"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pressão Sistólica (mmHg)</label>
                  <input type="number" value={systolic} onChange={e => setSystolic(e.target.value ? Number(e.target.value) : '')} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-fleming-dark font-black" placeholder="Ex: 120" />
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                   <p className="text-[8px] text-slate-500 font-bold leading-tight uppercase">Avaliação estratificada conforme Diretrizes de Cardiologia.</p>
                </div>
              </div>
            </CalculatorCard>

          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>
             </div>
             <p className="text-[10px] font-bold text-slate-400 uppercase max-w-lg text-center md:text-left">
               Informações geradas por modelos matemáticos. A interpretação final deve ser feita exclusivamente pelo profissional de saúde responsável.
             </p>
          </div>
          <button onClick={onClose} className="px-12 py-4 bg-fleming-dark text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-fleming-dark/20 hover:scale-[1.02] transition-all">
            Concluir Análise
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalculatorsModal;
