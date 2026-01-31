
import React, { useState } from 'react';
import { LeadInfo } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (key: string) => boolean;
  onLeadSubmit: (lead: LeadInfo) => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onActivate, onLeadSubmit }) => {
  const [view, setView] = useState<'registration' | 'offer' | 'pix' | 'key' | 'success'>('registration');
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.length > 2 && email.includes('@')) {
      onLeadSubmit({ name: '', phone: '', email, city });
      setView('offer');
    }
  };

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onActivate(key);
    if (success) {
      setView('success');
      setTimeout(() => onClose(), 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const copyPix = () => {
    // Substituir pela sua chave pix real quando disponível
    navigator.clipboard.writeText("suachavepix@dominio.com");
    alert("Chave Pix copiada! Realize o pagamento de R$ 19,90 e nos envie o comprovante para receber sua chave de acesso.");
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_0_100px_rgba(67,109,46,0.3)] overflow-hidden animate-in zoom-in duration-500">
        {/* Banner Premium de Elite */}
        <div className="bg-slate-900 pt-12 pb-10 px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-fleming-light/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/20 border border-amber-400/30 rounded-full">
              <span className="text-amber-400 text-[10px] font-black uppercase tracking-[0.4em]">Acesso Exclusivo Fleming</span>
            </div>
            <h3 className="text-white text-4xl font-black tracking-tighter leading-none">
              {view === 'registration' ? 'Complete seu Perfil' : 'Assuma o Controle Total.'}
            </h3>
            <p className="text-slate-400 text-sm font-medium italic">
               {view === 'registration' ? 'Precisamos desses dados para validar seu laudo digital.' : 'Acesso exclusivo ao laudo digital completo e PDF oficial.'}
            </p>
          </div>
          <button onClick={onClose} className="absolute top-6 right-8 text-white/30 hover:text-white transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="p-10 md:p-14">
          {view === 'registration' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="text-center space-y-2">
                 <h4 className="text-2xl font-black text-slate-900 tracking-tight">Identificação de Concierge</h4>
                 <p className="text-sm text-slate-500 font-medium">Informe onde você está e como podemos te contatar oficialmente.</p>
               </div>
               <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Cidade / Estado</label>
                    <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black outline-none focus:border-fleming-dark transition-all" placeholder="Ex: Vitória, ES" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">E-mail Profissional</label>
                    <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-black outline-none focus:border-fleming-dark transition-all" placeholder="voce@exemplo.com" />
                  </div>
                  <button className="w-full py-5 bg-fleming-dark text-white font-black rounded-2xl shadow-xl shadow-fleming-dark/20 hover:bg-slate-900 transition-all uppercase tracking-widest text-[11px]">
                    Ver Laudo Completo
                  </button>
               </form>
            </div>
          )}

          {view === 'offer' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-lg font-black text-slate-900 leading-tight">Vantagens do Acesso Elite:</h4>
                  <ul className="space-y-4">
                    {[
                      "Download do PDF com Identidade Visual",
                      "Tese Clínica Completa (sem cortes)",
                      "Todos os biomarcadores visíveis",
                      "Evolução Histórica Digital Ilimitada",
                      "Suporte Prioritário no Concierge"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[13px] font-semibold text-slate-600">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                          <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center space-y-6 shadow-inner">
                   <div className="space-y-1">
                      <p className="text-[11px] font-black text-slate-400 line-through uppercase tracking-widest">Valor Normal: R$ 97,00</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl font-black text-slate-900">R$</span>
                        <span className="text-6xl font-black text-slate-900 tracking-tighter">19,90</span>
                      </div>
                      <div className="bg-amber-100 px-3 py-1 rounded-lg">
                        <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Apenas p/ os 100 primeiros</p>
                      </div>
                   </div>
                   
                   <div className="w-full space-y-3">
                     <button 
                       onClick={() => setView('pix')}
                       className="w-full py-5 bg-fleming-dark text-white font-black rounded-2xl shadow-[0_15px_30px_rgba(67,109,46,0.3)] hover:bg-slate-900 transition-all uppercase tracking-widest text-[11px]"
                     >
                       Pagar via Pix (R$ 19,90)
                     </button>
                     <button 
                       onClick={() => setView('key')}
                       className="text-[10px] font-black text-slate-400 hover:text-fleming-dark transition-all uppercase tracking-widest underline decoration-2 underline-offset-8 decoration-slate-200"
                     >
                       Já possuo uma chave
                     </button>
                   </div>
                </div>
              </div>
            </div>
          )}

          {view === 'pix' && (
            <div className="space-y-10 animate-in slide-in-from-right duration-500 text-center">
              <div className="space-y-3">
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Pagamento Instantâneo</h4>
                <p className="text-sm text-slate-500 font-medium italic">Liberação manual em até 5 minutos após o envio do comprovante.</p>
              </div>

              <div className="flex flex-col items-center gap-8">
                {/* Placeholder de QR Code - Área Nobre */}
                <div className="w-64 h-64 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem] flex items-center justify-center p-8 relative group overflow-hidden">
                   <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center p-6 text-center">
                      <p className="text-xs font-black uppercase text-fleming-dark leading-tight">Envie sua imagem de QR Code<br/>para eu aplicar aqui!</p>
                   </div>
                   <svg className="w-24 h-24 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeWidth="2"/></svg>
                </div>

                <div className="w-full max-w-sm space-y-4">
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between group hover:border-fleming-light transition-all shadow-sm">
                    <div className="flex flex-col items-start overflow-hidden">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Copia e Cola</span>
                       <span className="text-xs font-black text-slate-900 truncate w-full">suachavepix@dominio.com</span>
                    </div>
                    <button onClick={copyPix} className="px-6 py-3 bg-fleming-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shrink-0 shadow-lg shadow-fleming-dark/20">Copiar</button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic text-center">Após o pagamento, insira a chave recebida para desbloqueio.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setView('offer')} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors">Voltar</button>
                <button onClick={() => setView('key')} className="flex-1 py-5 bg-emerald-500 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-colors">Inserir Chave Recebida</button>
              </div>
            </div>
          )}

          {view === 'key' && (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
              <div className="space-y-3 text-center">
                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Validar Desbloqueio</h4>
                <p className="text-sm text-slate-500 font-medium italic">Insira o código de 6 dígitos que você recebeu.</p>
              </div>
              <form onSubmit={handleKeySubmit} className="space-y-6">
                <input 
                  type="text" 
                  autoFocus
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  placeholder="EX: FSXXXX"
                  className={`w-full bg-slate-50 border-2 ${error ? 'border-rose-400' : 'border-slate-100'} rounded-[2.5rem] px-10 py-7 font-black text-center tracking-[0.8em] text-3xl outline-none focus:border-fleming-dark transition-all shadow-inner`}
                />
                {error && <p className="text-[11px] text-rose-500 font-black text-center uppercase tracking-widest animate-bounce">Chave inválida. Verifique e tente novamente.</p>}
                <button className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl hover:bg-black transition-all uppercase tracking-[0.4em] text-[11px] shadow-2xl shadow-slate-900/40">
                  Liberar Laudo Oficial
                </button>
              </form>
              <button onClick={() => setView('offer')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all text-center">Ver oferta novamente</button>
            </div>
          )}

          {view === 'success' && (
            <div className="text-center py-20 space-y-8 animate-in zoom-in duration-500">
              <div className="w-36 h-36 bg-emerald-500 text-white rounded-[4rem] flex items-center justify-center mx-auto text-6xl shadow-2xl shadow-emerald-500/30 rotate-12">
                ✓
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Acesso Liberado.</h3>
                <p className="text-base text-slate-500 font-medium italic">
                  Obrigado por escolher a Fleming Saúde. <br/>Sua biologia em sua forma mais clara.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-50 p-10 text-center border-t border-slate-100 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Ambiente Seguro & Criptografado</p>
          </div>
          <p className="text-[10px] text-slate-300 font-bold max-w-sm uppercase leading-relaxed">
            Fleming Saúde: Ao seu lado, por sua saúde.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
