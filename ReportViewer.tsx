
import React, { useState, useRef, useEffect } from 'react';
import { AnalysisReport, Biomarker } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { generateTTSNarrative } from '../geminiService';

interface ReportViewerProps {
  report: AnalysisReport;
  isPremium?: boolean;
  onUnlockFullAnalysis?: () => void;
  isUnlockedInitially?: boolean;
  isOptimizingForPDF?: boolean;
}

const StatusBadge: React.FC<{ status: Biomarker['classificacao'] }> = ({ status }) => {
  const configs = {
    otimo: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'ÓTIMO' },
    alerta: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'ALERTA' },
    critico: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'CRÍTICO' }
  };
  const config = configs[status] || configs['otimo'];
  return (
    <span className={`px-4 py-1.5 rounded-lg text-[8px] font-black tracking-[0.2em] uppercase ${config.bg} ${config.text} border border-black/5`}>
      {config.label}
    </span>
  );
};

const ReportViewer: React.FC<ReportViewerProps> = ({ report, isPremium = false, onUnlockFullAnalysis, isUnlockedInitially = false, isOptimizingForPDF = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rasterizedChart, setRasterizedChart] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const totalBiomarkers = report.biomarkers.length;
  const visibleCount = (isUnlockedInitially || isPremium) ? totalBiomarkers : Math.ceil(totalBiomarkers * 0.6);
  const visibleBiomarkers = report.biomarkers.slice(0, visibleCount);
  const hiddenCount = totalBiomarkers - visibleCount;

  useEffect(() => {
    if (isOptimizingForPDF && chartRef.current) {
      const timer = setTimeout(() => {
        const svg = chartRef.current?.querySelector('svg');
        if (svg) {
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          canvas.width = 400; canvas.height = 400;
          const url = URL.createObjectURL(new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' }));
          img.onload = () => {
            if (ctx) {
              ctx.fillStyle = 'white'; ctx.fillRect(0, 0, 400, 400);
              ctx.drawImage(img, 0, 0, 400, 400);
              setRasterizedChart(canvas.toDataURL('image/jpeg', 0.9));
            }
            URL.revokeObjectURL(url);
          };
          img.src = url;
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOptimizingForPDF]);

  const handlePlayAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const base64 = await generateTTSNarrative(report.functionalHealthImpactSummary);
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
      buffer.getChannelData(0).set(Array.from(dataInt16).map(v => v / 32768.0));
      const source = audioCtx.createBufferSource();
      source.buffer = buffer; source.connect(audioCtx.destination);
      source.onended = () => setIsPlaying(false);
      source.start();
    } catch (e) { console.error(e); setIsPlaying(false); }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val % 1 === 0 ? val.toString() : val.toFixed(2).replace('.', ',');
    }
    return val;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in duration-1000 print:space-y-10 px-4 md:px-0 pb-20">
      {/* Impressão Header */}
      <div className="hidden print:flex items-center justify-between border-b-[6px] border-fleming-dark pb-12 mb-10">
        <div className="flex items-center gap-8">
           <div className="w-20 h-20 bg-fleming-dark rounded-2xl flex items-center justify-center text-white text-4xl font-black italic">F</div>
           <div>
              <h1 className="text-4xl font-black text-fleming-dark tracking-tighter">FLEMING SAÚDE</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inteligência em Longevidade</p>
           </div>
        </div>
        <div className="text-right">
           <p className="text-2xl font-black text-slate-900 uppercase">{report.patientName}</p>
           <p className="text-xs font-bold text-slate-500 uppercase">{report.patientAge} anos | {report.date}</p>
        </div>
      </div>

      {/* Hero Card */}
      <div className="bg-white rounded-[4rem] border border-slate-100 shadow-xl overflow-hidden print:shadow-none break-inside-avoid">
        <div className="bg-fleming-dark p-12 md:p-16 text-white flex flex-col md:flex-row justify-between items-center gap-10 print:bg-slate-50 print:text-slate-900">
           <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full border border-white/20">
                <span className="text-fleming-light text-[9px] font-black uppercase tracking-widest print:text-fleming-dark">Análise Digital Oficial</span>
              </div>
              <h3 className="text-5xl md:text-6xl font-black tracking-tighter">Escore de <br/><span className="text-fleming-light print:text-fleming-dark">Vitalidade.</span></h3>
           </div>
           <div className="flex items-center gap-10 bg-white/10 px-12 py-8 rounded-3xl border border-white/10 print:bg-white print:border-slate-200">
              <div className="text-center">
                 <div className="text-6xl font-black">{report.biomarkers.length}</div>
                 <div className="text-[10px] font-bold uppercase opacity-60">Exames</div>
              </div>
              <div className="w-px h-16 bg-white/20"></div>
              <div className="text-center">
                 <div className="text-6xl font-black text-fleming-light print:text-fleming-dark">{report.healthScore}%</div>
                 <div className="text-[10px] font-bold uppercase opacity-60">Score</div>
              </div>
           </div>
        </div>
        <div className="p-12 md:p-16">
           <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="flex-1 space-y-8">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-4">Tese Clínica Consolidada</span>
                 <p className="text-slate-800 font-medium leading-relaxed italic text-2xl md:text-3xl tracking-tight">"{report.functionalHealthImpactSummary}"</p>
                 <button onClick={handlePlayAudio} disabled={isPlaying} className="no-print flex items-center gap-4 px-8 py-4 rounded-2xl bg-slate-50 text-fleming-dark font-black text-[11px] uppercase tracking-widest hover:bg-fleming-light/10 transition-all border border-slate-100">
                    <div className="w-8 h-8 bg-fleming-dark rounded-full flex items-center justify-center text-white shadow-md">
                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    {isPlaying ? "Processando..." : "Ouvir Explicação"}
                 </button>
              </div>
              <div className="lg:w-80 flex flex-col items-center bg-slate-50/50 p-10 rounded-3xl border border-slate-100">
                 <div ref={chartRef} className="w-56 h-56 relative">
                    <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                       <span className="text-4xl font-black text-slate-900">{report.healthScore}%</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Status</span>
                    </div>
                    {rasterizedChart ? <img src={rasterizedChart} className="w-full h-full" alt="Chart" /> : (
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie data={[{v: report.healthScore}, {v: 100-report.healthScore}]} innerRadius={70} outerRadius={95} dataKey="v" stroke="none" startAngle={90} endAngle={-270}>
                               <Cell fill="#436d2e" /><Cell fill="#f1f5f9" />
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Grid de Marcadores Detalhado */}
      <div className="space-y-12">
        <div className="flex items-center gap-6">
           <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Painel de Biomarcadores</span>
           <div className="h-px bg-slate-100 flex-grow"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {visibleBiomarkers.map((bio, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col h-full break-inside-avoid hover:border-fleming-light transition-all group">
              <div className="flex justify-between items-start mb-10">
                <h4 className="font-black text-slate-900 text-2xl tracking-tighter w-2/3 leading-tight">{bio.biomarcador}</h4>
                <StatusBadge status={bio.classificacao} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                 <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 group-hover:bg-white transition-colors">
                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Encontrado</span>
                    <div className="text-3xl font-black text-slate-900 mt-2 tracking-tighter break-words leading-tight">
                      {formatValue(bio.valor)} <span className="text-xs text-slate-400 font-bold tracking-normal">{bio.unidade}</span>
                    </div>
                 </div>
                 <div className="bg-emerald-50/40 border border-emerald-100/50 p-8 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                    <span className="text-[9px] text-emerald-600 font-black uppercase tracking-widest">Referência Fleming</span>
                    <div className="text-xl font-black text-emerald-700 mt-2 tracking-tighter">{bio.faixa_ideal}</div>
                 </div>
              </div>

              <div className="flex-grow p-8 bg-slate-50/50 rounded-2xl border border-slate-50">
                 <p className="text-[15px] text-slate-600 font-semibold leading-relaxed italic border-l-4 border-fleming-light/40 pl-6">{bio.interpretacao_simples}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bloqueio Premium */}
        {!(isUnlockedInitially || isPremium) && hiddenCount > 0 && (
          <div className="relative -mt-64 pb-20 no-print z-20">
            <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-white via-white/95 to-transparent"></div>
            <div className="relative bg-white/80 backdrop-blur-xl border-4 border-dashed border-slate-200 p-16 rounded-[4rem] text-center space-y-8 shadow-2xl max-w-4xl mx-auto">
               <div className="w-20 h-20 bg-amber-400 text-slate-900 rounded-3xl flex items-center justify-center mx-auto shadow-xl rotate-3">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth="2.5"/></svg>
               </div>
               <div className="space-y-4">
                 <h4 className="text-4xl font-black text-slate-900 tracking-tighter">Desbloqueie {hiddenCount} exames.</h4>
                 <p className="text-lg text-slate-500 font-medium italic max-w-2xl mx-auto">
                   Seu laudo contém dados sensíveis que exigem sua atenção. Obtenha a análise completa por um valor simbólico de otimização.
                 </p>
               </div>
               <button onClick={onUnlockFullAnalysis} className="px-16 py-7 bg-fleming-dark text-white font-black rounded-3xl text-xs uppercase tracking-widest shadow-xl hover:bg-slate-900 transition-all flex items-center gap-4 mx-auto">
                  Liberar Acesso Completo (R$ 19,90)
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeWidth="3"/></svg>
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="pt-24 pb-16 border-t border-slate-100 text-center max-w-4xl mx-auto break-inside-avoid">
        <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mb-16 italic opacity-70">
           {report.disclaimer}
        </p>
        <div className="flex flex-col items-center gap-4">
           <div className="flex items-center gap-4">
             <div className="w-10 h-10 border-4 border-fleming-dark rounded-xl"></div>
             <span className="text-3xl font-black text-fleming-dark tracking-tighter uppercase">fleming saúde</span>
           </div>
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ao seu lado, por sua saúde</p>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
