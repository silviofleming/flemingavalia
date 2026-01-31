
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExamUploader from './components/ExamUploader';
import ReportViewer from './components/ReportViewer';
import OCRReview from './components/OCRReview';
import LoadingScreen from './components/LoadingScreen';
import Sidebar from './components/Sidebar';
import PremiumModal from './components/PremiumModal';
import ShareModal from './components/ShareModal';
import Testimonials from './components/Testimonials';
import ProtocolsModal from './components/ProtocolsModal';
import SpecialistsModal from './components/SpecialistsModal';
import CalculatorsModal from './components/CalculatorsModal';
import IntegrativeChat from './components/IntegrativeChat';
import { extractBiomarkers, generateIntegrativeReport } from './geminiService';
import { AnalysisReport, BiomarkerDraft, AppStage, HistoryItem, LeadInfo, Review } from './types';

const PREMIUM_TEST_KEY = "FS1234";

const INITIAL_REVIEWS: Review[] = [
  { id: '1', author: 'Dra. Marina Silva', role: 'Nutricionista Funcional', content: 'A análise integrativa integrada à IA Fleming traz uma clareza sem precedentes para a medicina preventiva.', rating: 5, isFeatured: true, date: '10/02/2024' },
  { id: '2', author: 'Dr. Ricardo Mello', role: 'Médico Integrativo', content: 'Finalmente uma ferramenta que traduz biomarcadores em saúde real e não apenas em números frios.', rating: 5, isFeatured: false, date: '15/01/2024' },
  { id: '3', author: 'Ana Paula G.', role: 'Paciente Premium', content: 'Entender a tese clínica por trás dos meus sintomas mudou minha adesão ao tratamento.', rating: 5, isFeatured: false, date: '05/02/2024' }
];

const COMMON_SYMPTOMS = ["Fadiga Crônica", "Névoa Mental", "Insônia", "Ansiedade", "Irritabilidade", "Dores Articulares"];

const ValueTeaser: React.FC = () => (
  <section className="space-y-16 py-12">
    <div className="text-center max-w-4xl mx-auto space-y-6">
       <div className="inline-block px-5 py-2 bg-fleming-light/10 rounded-full border border-fleming-light/20">
         <span className="text-[11px] font-black text-fleming-dark uppercase tracking-[0.5em]">Tecnologia Preditiva de Elite</span>
       </div>
       <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">Antecipe o Futuro da sua <br/><span className="text-fleming-dark">Expressão Celular.</span></h2>
       <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto">Sua biologia não é um destino imutável. É um código que pode ser otimizado através de dados e clareza clínica.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto px-4">
      <div className="group bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:scale-[1.03] transition-all duration-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-fleming-light opacity-30"></div>
        <div className="w-16 h-16 bg-fleming-dark/5 rounded-3xl flex items-center justify-center text-fleming-dark mb-8 group-hover:bg-fleming-dark group-hover:text-white transition-all shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2.5"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2.5"/></svg>
        </div>
        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Saber antes de todos</h4>
        <p className="text-base text-slate-500 font-medium leading-relaxed italic">Detectamos sinais de alerta na sua expressão celular meses antes do laudo comum. Antecipe-se à doença.</p>
      </div>

      <div className="group bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl hover:scale-[1.03] transition-all duration-700 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-fleming-light"></div>
        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center text-fleming-light mb-8 shadow-inner">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2.5"/></svg>
        </div>
        <h4 className="text-2xl font-black mb-4 tracking-tight">Clareza Absoluta</h4>
        <p className="text-base text-slate-400 font-medium leading-relaxed italic">Traduzimos números frios em uma linguagem que faz sentido para você. Sua saúde, explicada pelo Concierge IA.</p>
      </div>

      <div className="group bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:scale-[1.03] transition-all duration-700 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2.5 h-full bg-fleming-dark opacity-30"></div>
        <div className="w-16 h-16 bg-fleming-light/10 rounded-3xl flex items-center justify-center text-fleming-dark mb-8 group-hover:bg-fleming-dark group-hover:text-white transition-all shadow-sm">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2.5"/></svg>
        </div>
        <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Otimização Epigenética</h4>
        <p className="text-base text-slate-500 font-medium leading-relaxed italic">Receba o caminho exato para otimizar sua biologia e silenciar riscos precocemente com base nos seus dados.</p>
      </div>
    </div>
  </section>
);

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('upload');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'extracting' | 'generating'>('extracting');
  const [drafts, setDrafts] = useState<BiomarkerDraft[]>([]);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | string[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientSex, setPatientSex] = useState<'Masculino' | 'Feminino' | ''>('');
  const [patientCity, setPatientCity] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientSymptoms, setPatientSymptoms] = useState('');
  
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isProtocolsModalOpen, setIsProtocolsModalOpen] = useState(false);
  const [isSpecialistsModalOpen, setIsSpecialistsModalOpen] = useState(false);
  const [isCalculatorsModalOpen, setIsCalculatorsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#report=')) {
      try {
        const base64Data = hash.substring(8);
        const decodedJson = decodeURIComponent(escape(atob(base64Data)));
        const sharedReport = JSON.parse(decodedJson);
        setReport(sharedReport);
        setIsUnlocked(true);
        setStage('report');
      } catch (e) {
        console.error("Erro ao decodificar link de laudo", e);
        setError("Não foi possível carregar o laudo compartilhado.");
      }
    }
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem('fleming_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) {}
    }
    const savedPremium = localStorage.getItem('fleming_premium_active');
    if (savedPremium === 'true') setIsPremium(true);

    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleSymptom = (symptom: string) => {
    const symptoms = patientSymptoms.split(',').map(s => s.trim()).filter(s => s !== "");
    if (symptoms.includes(symptom)) {
      setPatientSymptoms(symptoms.filter(s => s !== symptom).join(', '));
    } else {
      setPatientSymptoms([...symptoms, symptom].join(', '));
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleActivatePremium = (key: string): boolean => {
    if (key === PREMIUM_TEST_KEY || key.startsWith("FS")) {
      setIsPremium(true);
      localStorage.setItem('fleming_premium_active', 'true');
      return true;
    }
    return false;
  };

  const getValidationErrors = () => {
    const errors: string[] = [];
    if (patientName.trim().length < 4) errors.push("Nome Completo (mínimo 4 caracteres)");
    if (!patientAge || parseInt(patientAge) <= 0) errors.push("Idade válida");
    if (patientSex === '') errors.push("Sexo Biológico");
    if (patientPhone.replace(/\D/g, '').length < 10) errors.push("WhatsApp de Contato (com DDD)");
    if (!acceptedTerms) errors.push("Aceite dos Termos Fleming");
    return errors;
  };

  const handleStartExtraction = async (input: string | { data: string, mimeType: string }, isImage: boolean) => {
    const validationErrors = getValidationErrors();
    if (validationErrors.length > 0) {
      setError(validationErrors);
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    setLoadingStage('extracting');
    setError(null);
    try {
      const extracted = await extractBiomarkers(input, isImage);
      setDrafts(extracted);
      setStage('review');
    } catch (err) {
      setError("Falha na extração. Certifique-se de que o arquivo está legível.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReview = async (finalDrafts: BiomarkerDraft[]) => {
    setIsLoading(true);
    setLoadingStage('generating');
    try {
      const finalReport = await generateIntegrativeReport(finalDrafts, patientName, patientAge, patientSex as any, patientSymptoms);
      const enrichedReport: AnalysisReport = { ...finalReport, patientCity, patientEmail, patientPhone };
      setReport(enrichedReport);
      const newHistoryItem: HistoryItem = { id: enrichedReport.id, date: enrichedReport.date, patientName: enrichedReport.patientName, score: enrichedReport.healthScore, report: enrichedReport };
      setHistory(prev => [newHistoryItem, ...prev]);
      localStorage.setItem('fleming_history', JSON.stringify([newHistoryItem, ...history]));
      setStage('report');
    } catch (err) {
      setError("Erro ao processar análise preventiva. Tente novamente em instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeadSubmit = (lead: LeadInfo) => {
    setPatientCity(lead.city || '');
    setPatientEmail(lead.email || '');
    if (report) {
      const updatedReport = { ...report, patientCity: lead.city, patientEmail: lead.email };
      setReport(updatedReport);
      const updatedHistory = history.map(h => h.id === report.id ? { ...h, report: updatedReport } : h);
      setHistory(updatedHistory);
      localStorage.setItem('fleming_history', JSON.stringify(updatedHistory));
    }
  };

  const handlePrintRequest = () => {
    if (isPremium || isUnlocked) {
      setIsGeneratingPDF(true);
      setTimeout(() => { 
        window.print(); 
        setIsGeneratingPDF(false); 
      }, 1000);
    } else {
      setIsPremiumModalOpen(true);
    }
  };

  const handleSaveHTML = () => {
    if (!report) return;
    const reportEl = document.getElementById('full-report-content');
    if (!reportEl) return;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');
    const htmlContent = `<!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Relatório Fleming Saúde - ${report.patientName}</title><script src="https://cdn.tailwindcss.com"></script>${styles}</head><body class="bg-white p-12"><div class="max-w-5xl mx-auto">${reportEl.innerHTML}</div><div class="mt-20 text-center text-slate-400 text-xs uppercase tracking-widest no-print">Relatório gerado em ${report.date} por Fleming Saúde.</div></body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laudo_Fleming_${report.patientName.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShareRequest = () => {
    if (report) {
      const essentialReport = {
        id: report.id,
        patientName: report.patientName,
        date: report.date,
        healthScore: report.healthScore,
        functionalHealthImpactSummary: report.functionalHealthImpactSummary,
        biomarkers: report.biomarkers.map(b => ({
           biomarcador: b.biomarcador,
           valor: b.valor,
           unidade: b.unidade,
           faixa_ideal: b.faixa_ideal,
           classificacao: b.classificacao,
           interpretacao_simples: b.interpretacao_simples
        })),
        o_que_merece_atencao: report.o_que_merece_atencao,
        proximos_passos_possiveis: report.proximos_passos_possiveis
      };
      const json = JSON.stringify(essentialReport);
      const base64Report = btoa(unescape(encodeURIComponent(json)));
      setShareUrl(`${window.location.origin}${window.location.pathname}#report=${base64Report}`);
      setIsShareModalOpen(true);
    }
  };

  const handleReset = () => {
    window.location.hash = '';
    setStage('upload');
    setReport(null);
    setDrafts([]);
    setIsUnlocked(false);
    setError(null);
  };

  return (
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden ${isFullScreen ? 'bg-white' : 'bg-[#fafbf9]'}`}>
      {isLoading && <LoadingScreen stage={loadingStage} />}
      {isGeneratingPDF && (
        <div className="fixed inset-0 z-[600] bg-slate-950/60 backdrop-blur-md flex items-center justify-center no-print">
           <div className="bg-white p-14 rounded-[4rem] shadow-2xl flex flex-col items-center gap-8 animate-in zoom-in duration-300 border border-slate-100">
              <div className="w-20 h-20 border-8 border-fleming-light/20 border-t-fleming-dark rounded-full animate-spin"></div>
              <div className="text-center space-y-3">
                 <h4 className="text-2xl font-black text-slate-900 tracking-tight">Formatando seu Laudo</h4>
                 <p className="text-sm text-slate-400 font-medium italic">Preparando visualização profissional para impressão...</p>
              </div>
           </div>
        </div>
      )}

      <PremiumModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
        onActivate={handleActivatePremium} 
        onLeadSubmit={(lead) => { handleLeadSubmit(lead); setIsUnlocked(true); }} 
      />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} shareUrl={shareUrl} />
      <ProtocolsModal isOpen={isProtocolsModalOpen} onClose={() => setIsProtocolsModalOpen(false)} />
      <SpecialistsModal isOpen={isSpecialistsModalOpen} onClose={() => setIsSpecialistsModalOpen(false)} />
      <CalculatorsModal isOpen={isCalculatorsModalOpen} onClose={() => setIsCalculatorsModalOpen(false)} />
      
      {!isFullScreen && (
        <Header isPremium={isPremium} onOpenProtocols={() => setIsProtocolsModalOpen(true)} onOpenSpecialists={() => setIsSpecialistsModalOpen(true)} onOpenCalculators={() => setIsCalculatorsModalOpen(true)} />
      )}
      
      <div className="flex">
        {!isFullScreen && (
          <Sidebar history={history} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onSelect={(id) => { const item = history.find(h => h.id === id); if (item) { setReport(item.report); setStage('report'); setIsSidebarOpen(false); } }} />
        )}
        
        {!isFullScreen && (
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="fixed left-6 bottom-6 z-[100] p-5 bg-white border border-slate-200 rounded-[2rem] shadow-2xl text-fleming-dark no-print hover:scale-110 hover:bg-slate-50 transition-all active:scale-95">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        )}

        <main className={`flex-grow py-20 px-4 transition-all duration-500 ${isSidebarOpen && !isFullScreen ? 'md:ml-72' : ''} print:ml-0 print:py-0 ${isFullScreen ? 'py-10' : ''}`}>
          <div className="max-w-7xl mx-auto">
            {stage === 'upload' && (
              <div className="space-y-24 animate-in fade-in duration-1000">
                <div className="text-center max-w-5xl mx-auto space-y-8">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-fleming-dark text-white rounded-full shadow-lg shadow-fleming-dark/20">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Fleming Saúde Preditiva</span>
                  </div>
                  <h1 className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-none">Cuidado <br/><span className="text-fleming-dark">Preditivo.</span></h1>
                  <p className="text-slate-400 font-bold text-2xl tracking-tight uppercase max-w-2xl mx-auto">Sua biologia decifrada por inteligência artificial integrativa.</p>
                </div>

                <ValueTeaser />
                <Testimonials reviews={INITIAL_REVIEWS} />
                
                <div className="max-w-4xl mx-auto space-y-12 bg-white p-12 md:p-20 rounded-[4.5rem] border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-fleming-dark to-fleming-light opacity-80"></div>
                  
                  {error && (
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] space-y-4 animate-in slide-in-from-top duration-500 shadow-sm">
                      <div className="flex items-center gap-3 text-rose-600 font-black text-[12px] uppercase tracking-[0.3em]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeWidth="2.5"/></svg>
                        Atenção aos Dados de Cadastro
                      </div>
                      {Array.isArray(error) ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                          {error.map((err, i) => (
                            <li key={i} className="text-[11px] font-bold text-rose-500 uppercase flex items-center gap-3 italic">
                              <span className="w-1.5 h-1.5 bg-rose-300 rounded-full"></span> {err}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[11px] font-bold text-rose-500 uppercase italic">{error}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Nome Completo</label>
                        <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-5 font-black outline-none focus:border-fleming-dark focus:bg-white transition-all shadow-inner" placeholder="Paciente" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Idade Biológica</label>
                        <input type="number" value={patientAge} onChange={e => setPatientAge(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-5 font-black outline-none focus:border-fleming-dark focus:bg-white transition-all shadow-inner" placeholder="Idade" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Sexo Biológico</label>
                        <div className="flex gap-4 p-1.5 bg-slate-50 rounded-[2rem] border border-slate-100">
                          {['Masculino', 'Feminino'].map(s => (
                            <button key={s} onClick={() => setPatientSex(s as any)} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[11px] border-2 transition-all uppercase tracking-widest ${patientSex === s ? 'border-fleming-dark bg-white text-fleming-dark shadow-md' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">WhatsApp de Contato</label>
                        <input type="tel" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-5 font-black outline-none focus:border-fleming-dark focus:bg-white transition-all shadow-inner" placeholder="(00) 00000-0000" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Sintomas e Queixas (Opcional)</label>
                      <textarea value={patientSymptoms} onChange={e => setPatientSymptoms(e.target.value)} className="w-full h-40 bg-slate-50 border border-slate-100 rounded-[2.5rem] px-8 py-7 outline-none resize-none font-medium text-slate-600 focus:border-fleming-dark focus:bg-white transition-all shadow-inner" placeholder="Descreva como você tem se sentido ultimamente..." />
                      <div className="flex flex-wrap gap-3 pt-3">
                        {COMMON_SYMPTOMS.map(s => <button key={s} onClick={() => toggleSymptom(s)} className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${patientSymptoms.includes(s) ? 'bg-fleming-dark border-fleming-dark text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-fleming-light'}`}>{s}</button>)}
                      </div>
                    </div>

                    <div className="pt-12 border-t border-slate-50">
                      <label className="flex items-start gap-5 p-8 bg-slate-50 rounded-[3rem] mb-12 cursor-pointer group hover:bg-slate-100 transition-all border border-slate-50">
                        <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="mt-1.5 w-6 h-6 accent-fleming-dark cursor-pointer shadow-sm" />
                        <span className="text-[12px] font-bold text-slate-500 uppercase leading-relaxed italic">
                          Declaro estar ciente de que esta análise é de cunho informativo e integrativo. Estaremos ao seu lado, por sua saúde.
                        </span>
                      </label>
                      <ExamUploader onAnalyze={handleStartExtraction} isLoading={isLoading} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stage === 'review' && <OCRReview drafts={drafts} onConfirm={handleConfirmReview} onCancel={handleReset} isLoading={isLoading} />}
            {stage === 'report' && report && (
              <div className="space-y-16 pb-32">
                {/* Barra de Ações Superior */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 no-print px-6 max-w-6xl mx-auto">
                  <button onClick={handleReset} className="text-[11px] font-black text-slate-400 hover:text-fleming-dark uppercase tracking-[0.4em] flex items-center gap-4 transition-all group">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:bg-fleming-light/10 group-hover:border-fleming-light transition-all">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="3" strokeLinecap="round"/></svg>
                    </div>
                    Nova Análise
                  </button>
                  <div className="flex flex-wrap gap-5 w-full md:w-auto">
                    <button onClick={toggleFullScreen} className="flex-1 md:flex-none px-6 py-5 bg-white border border-slate-100 text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 hover:shadow-lg transition-all flex items-center justify-center gap-3">
                      {isFullScreen ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 9L4 4m0 0l5 0M4 4l0 5m11 0l5-5m0 0l-5 0m5 0l0 5m-5 11l5 5m0 0l-5 0m5 0l0-5m-11 0l-5 5m0 0l5 0m-5 0l0-5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 3h6m0 0v6m0-6L14 10M9 3H3m0 0v6m0-6l7 7m-7 5v6m0 0h6m-6 0l7-7m5 7h6m0 0v-6m0 6l-7-7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                      {isFullScreen ? 'Sair Foco' : 'Modo Foco'}
                    </button>
                    <button onClick={handleShareRequest} className="flex-1 md:flex-none px-8 py-5 bg-white border border-slate-100 text-slate-600 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 hover:shadow-lg transition-all flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2.5"/></svg>
                      Link
                    </button>
                    <button onClick={handleSaveHTML} className="flex-1 md:flex-none px-8 py-5 bg-emerald-50 text-emerald-700 rounded-[2rem] border border-emerald-100 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-emerald-100 hover:shadow-lg transition-all flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" strokeWidth="2.5"/></svg>
                      Offline
                    </button>
                    <button onClick={handlePrintRequest} className={`flex-1 md:flex-none px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] transition-all flex items-center justify-center gap-4 ${isPremium || isUnlocked ? 'bg-fleming-dark text-white hover:bg-black hover:scale-105' : 'bg-amber-400 text-slate-900 hover:bg-amber-500 hover:scale-105'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth="2.5"/></svg>
                      {isPremium || isUnlocked ? (isGeneratingPDF ? 'PDF...' : 'Baixar PDF') : 'PDF Elite'}
                    </button>
                  </div>
                </div>

                <div id="full-report-content" className={`${isFullScreen ? 'bg-white p-10 md:p-20' : 'bg-white print:p-0'}`}>
                  <ReportViewer 
                    report={report} 
                    isPremium={isPremium} 
                    isUnlockedInitially={isUnlocked} 
                    onUnlockFullAnalysis={() => setIsPremiumModalOpen(true)} 
                    isOptimizingForPDF={isGeneratingPDF} 
                  />
                </div>

                <div className="max-w-6xl mx-auto pt-24 no-print px-4 md:px-0">
                   <div className="flex items-center gap-6 mb-12">
                      <div className="h-px bg-slate-200 flex-grow"></div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Validação do Concierge IA</span>
                      <div className="h-px bg-slate-200 flex-grow"></div>
                   </div>
                   <IntegrativeChat report={report} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
