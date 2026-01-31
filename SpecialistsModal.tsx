
import React, { useState } from 'react';

interface SpecialistsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureItem: React.FC<{ icon: React.ReactNode; title: string; text: string }> = ({ icon, title, text }) => (
  <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
    <div className="w-10 h-10 shrink-0 bg-fleming-dark/10 rounded-xl flex items-center justify-center text-fleming-dark">
      {icon}
    </div>
    <div>
      <h5 className="font-black text-slate-900 text-sm mb-1">{title}</h5>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">{text}</p>
    </div>
  </div>
);

const SpecialistsModal: React.FC<SpecialistsModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState<'form' | 'deck' | 'survey' | 'final'>('form');
  const [deckStep, setDeckStep] = useState(0);

  const deckSlides = [
    {
      title: "O Gap da Medicina Tradicional",
      text: "Hoje, 85% dos pacientes com exames 'normais' no laboratório já apresentam disfunções subclínicas. A Fleming preenche esse vácuo com dados.",
      highlight: "Visão Funcional vs. Patológica",
      stat: "40%",
      statDesc: "Mais precisão na detecção precoce"
    },
    {
      title: "Economia de Tempo Real",
      text: "Um médico gasta em média 22 minutos transcrevendo e explicando exames. Com nossa IA, esse tempo cai para menos de 3 minutos.",
      highlight: "Automatização de OCR Médico",
      stat: "7x",
      statDesc: "Mais agilidade na consulta"
    },
    {
      title: "Fidelização e Autoridade",
      text: "O laudo Fleming é um ativo de marketing para sua clínica. Pacientes valorizam o que conseguem entender visualmente.",
      highlight: "Design Clínico de Elite",
      stat: "+90",
      statDesc: "NPS de satisfação do paciente"
    }
  ];

  if (!isOpen) return null;

  const handleNextDeck = () => {
    if (deckStep < deckSlides.length - 1) {
      setDeckStep(deckStep + 1);
    } else {
      setStage('survey');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative bg-white w-full max-w-6xl h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col md:flex-row transition-all duration-500 ${stage !== 'form' ? 'bg-slate-900' : ''}`}>
        
        {stage === 'form' ? (
          <>
            {/* Lado Esquerdo: Proposta de Valor */}
            <div className="flex-1 bg-slate-900 p-10 text-white overflow-y-auto custom-scrollbar">
              <div className="max-w-md mx-auto space-y-10">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-fleming-light uppercase tracking-[0.4em]">Ecosistema Fleming</span>
                  <h3 className="text-4xl font-black tracking-tighter leading-none">A Tecnologia a serviço da sua <span className="text-fleming-light">Autoridade Clínica.</span></h3>
                  <p className="text-slate-400 font-medium leading-relaxed">Nossa plataforma não substitui o médico; ela o torna sobre-humano, processando milhares de correlações em segundos.</p>
                </div>

                <div className="space-y-6">
                  <FeatureItem 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeWidth="2"/></svg>}
                    title="Precisão Subclínica"
                    text="Identifique desvios funcionais meses antes dos sintomas clínicos se manifestarem em faixas laboratoriais comuns."
                  />
                  <FeatureItem 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth="2"/></svg>}
                    title="Adesão Visual"
                    text="Pacientes que 'veem' sua saúde através de scores e cores aderem 40% mais aos protocolos e suplementações."
                  />
                  <FeatureItem 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/></svg>}
                    title="Eficiência Operacional"
                    text="Libere sua agenda. O OCR inteligente automatiza a transcrição de exames, focando seu tempo na conduta terapêutica."
                  />
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center gap-4">
                  <div className="text-3xl font-black text-fleming-light">98%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Precisão na leitura de <br/>manuscritos e PDFs</div>
                </div>
              </div>
            </div>

            {/* Lado Direito: Formulário */}
            <div className="flex-1 bg-white p-12 flex flex-col justify-center relative">
              <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>

              <div className="max-w-md mx-auto w-full space-y-8">
                <div className="space-y-2">
                  <h4 className="text-3xl font-black text-slate-900 tracking-tight">Seja um <span className="text-fleming-dark">Especialista Credenciado.</span></h4>
                  <p className="text-sm text-slate-500 font-medium">Integre a Inteligência Fleming no seu consultório ou clínica.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); setStage('deck'); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Nome Completo</label>
                        <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fleming-dark outline-none" placeholder="Dr(a)..." />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Registro (CRM/CRN)</label>
                        <input required type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fleming-dark outline-none" placeholder="123456-UF" />
                     </div>
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-slate-400 uppercase ml-1">E-mail Profissional</label>
                     <input required type="email" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fleming-dark outline-none" placeholder="contato@clinica.com.br" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Especialidade Principal</label>
                     <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-fleming-dark outline-none appearance-none">
                        <option>Medicina Integrativa</option>
                        <option>Endocrinologia</option>
                        <option>Nutrição Funcional</option>
                        <option>Longevidade / Anti-aging</option>
                        <option>Cardiologia Preventiva</option>
                        <option>Outros</option>
                     </select>
                  </div>
                  
                  <div className="pt-4">
                     <button className="w-full py-5 bg-fleming-dark text-white font-black rounded-2xl shadow-xl shadow-fleming-dark/20 hover:scale-[1.02] transition-all uppercase tracking-[0.2em] text-[10px]">
                        Solicitar Credenciamento
                     </button>
                  </div>
                </form>
                
                <div className="text-center pt-8 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
                    Uso exclusivo para profissionais de saúde devidamente registrados em seus conselhos de classe.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : stage === 'deck' ? (
          /* PITCH DECK CLINICAL */
          <div className="flex-grow flex flex-col p-10 md:p-20 text-white relative">
            <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            
            <div className="flex-grow flex flex-col justify-center max-w-4xl mx-auto space-y-12 animate-in slide-in-from-right duration-700" key={deckStep}>
              <div className="space-y-4">
                <span className="text-fleming-light font-black text-xs uppercase tracking-[0.5em]">{deckSlides[deckStep].highlight}</span>
                <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">{deckSlides[deckStep].title}</h3>
                <p className="text-xl text-slate-400 font-medium max-w-2xl">{deckSlides[deckStep].text}</p>
              </div>
              
              <div className="flex items-center gap-8">
                 <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] flex items-center gap-6">
                    <div className="text-6xl font-black text-fleming-light">{deckSlides[deckStep].stat}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">
                       {deckSlides[deckStep].statDesc.split(' ').map((w,i) => <React.Fragment key={i}>{w}<br/></React.Fragment>)}
                    </div>
                 </div>
                 <div className="flex-1 h-px bg-white/10 hidden md:block"></div>
              </div>
            </div>

            <div className="flex justify-between items-center max-w-4xl mx-auto w-full pt-10 border-t border-white/10">
              <div className="flex gap-2">
                {deckSlides.map((_, i) => (
                  <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === deckStep ? 'w-12 bg-fleming-light' : 'w-4 bg-white/20'}`}></div>
                ))}
              </div>
              <button onClick={handleNextDeck} className="px-12 py-5 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-fleming-light transition-all">
                {deckStep === deckSlides.length - 1 ? 'Personalizar minha Experiência' : 'Próximo Pilar'}
              </button>
            </div>
          </div>
        ) : stage === 'survey' ? (
          /* SURVEY DE EXPERIÊNCIA */
          <div className="flex-grow flex items-center justify-center p-10 text-white">
             <div className="max-w-xl w-full space-y-10 text-center animate-in zoom-in duration-500">
                <div className="space-y-4">
                   <h3 className="text-4xl font-black tracking-tighter">Como podemos ajudar sua <span className="text-fleming-light">rotina?</span></h3>
                   <p className="text-slate-400 font-medium">Responda 3 perguntas para adaptarmos a plataforma ao seu perfil.</p>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); setStage('final'); }} className="space-y-6 text-left">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Qual seu principal desafio hoje?</label>
                      <div className="grid grid-cols-1 gap-3">
                         {["Transcrição lenta de exames", "Explicar resultados ao paciente", "Falta de faixas integrativas", "Fidelização pós-consulta"].map(d => (
                           <label key={d} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group">
                              <input type="radio" name="pain" className="w-4 h-4 accent-fleming-light" required />
                              <span className="text-sm font-bold text-slate-300 group-hover:text-white">{d}</span>
                           </label>
                         ))}
                      </div>
                   </div>
                   
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Volume médio de pacientes/mês?</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-300 font-bold outline-none focus:border-fleming-light transition-all appearance-none">
                         <option>Até 20 pacientes</option>
                         <option>20 a 50 pacientes</option>
                         <option>Mais de 50 pacientes</option>
                      </select>
                   </div>

                   <button className="w-full py-5 bg-fleming-light text-slate-900 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-2xl shadow-fleming-light/20">
                      Finalizar Configuração
                   </button>
                </form>
             </div>
          </div>
        ) : (
          /* TELA FINAL DE SUCESSO */
          <div className="flex-grow flex flex-col items-center justify-center p-10 text-center space-y-8 text-white">
            <div className="w-32 h-32 bg-fleming-light text-slate-900 rounded-[3rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-fleming-light/30 rotate-12 animate-bounce">
              ✓
            </div>
            <div className="space-y-4 max-w-md">
              <h4 className="text-4xl font-black tracking-tighter">Bem-vindo à <span className="text-fleming-light">Fleming Saúde.</span></h4>
              <p className="text-slate-400 font-medium leading-relaxed">
                Seu pré-cadastro e perfil foram registrados com sucesso. Nossa equipe entrará em contato em breve para liberar seu acesso Full-Access.
              </p>
            </div>
            <div className="flex gap-4">
               <button onClick={onClose} className="px-10 py-4 bg-white/10 border border-white/20 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-white/20 transition-all">
                  Explorar Painel
               </button>
               <a href="#" className="px-10 py-4 bg-fleming-light text-slate-900 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:scale-105 transition-all">
                  Falar com Consultor
               </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialistsModal;
