
import React from 'react';

interface ProtocolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProtocolCard: React.FC<{ title: string; icon: React.ReactNode; range: string; description: string; items: { label: string; functional: string; lab: string }[] }> = ({ title, icon, range, description, items }) => (
  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-200/60 space-y-4">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-fleming-dark">
        {icon}
      </div>
      <div>
        <h4 className="font-black text-slate-900 leading-tight">{title}</h4>
        <p className="text-[9px] font-black text-fleming-dark uppercase tracking-widest">{range}</p>
      </div>
    </div>
    <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
    <div className="space-y-2 pt-2">
      {items.map((item, i) => (
        <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100">
          <span className="text-[10px] font-black text-slate-700 uppercase">{item.label}</span>
          <div className="text-right">
            <div className="text-[10px] font-black text-fleming-dark">{item.functional} <span className="text-[8px] text-slate-300 ml-1">FUNCIONAL</span></div>
            <div className="text-[8px] font-bold text-slate-400 line-through">{item.lab} <span className="ml-1">LAB</span></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProtocolsModal: React.FC<ProtocolsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 flex flex-col">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-fleming-dark rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Protocolos de Saúde Funcional</h3>
              <p className="text-xs text-slate-500 font-medium">Por que nossas faixas de referência são diferentes das do laboratório.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-fleming-dark/5 p-8 rounded-[2.5rem] border border-fleming-light/20 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-4">
                <h4 className="text-xl font-black text-fleming-dark">O Conceito Fleming de Bio-Otimização</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Laboratórios convencionais utilizam médias populacionais para detectar doenças. A Fleming utiliza <strong>Faixas de Performance</strong> baseadas na literatura médica integrativa, focadas no funcionamento celular perfeito e na prevenção ativa.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="bg-white p-4 rounded-2xl shadow-sm text-center">
                   <div className="text-rose-400 font-black text-lg">Patologia</div>
                   <div className="text-[9px] font-bold text-slate-400 uppercase">Foco Lab</div>
                </div>
                <div className="bg-fleming-dark p-4 rounded-2xl shadow-sm text-center text-white">
                   <div className="font-black text-lg">Vitalidade</div>
                   <div className="text-[9px] font-bold text-fleming-light uppercase">Foco Fleming</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProtocolCard 
                title="Eixo Glicêmico"
                range="Metabolismo de Energia"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2"/></svg>}
                description="Monitoramos a eficiência da insulina para prevenir a inflamação sistêmica e o envelhecimento precoce."
                items={[
                  { label: "Glicose Jejum", functional: "75 - 86 mg/dL", lab: "70 - 99 mg/dL" },
                  { label: "Hemoglobina Glicada", functional: "4.8% - 5.2%", lab: "Até 5.6%" }
                ]}
              />
              <ProtocolCard 
                title="Eixo Hormonal"
                range="Tireoide e Glândulas"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.618.309a6 6 0 01-3.86.517l-2.387-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 002.348 2.348l2.387-.477a2 2 0 001.022-.547l1.168-1.168a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-2.348-2.348l-2.387.477a2 2 0 00-1.022.547l-1.168 1.168" strokeWidth="2"/></svg>}
                description="O TSH 'normal' para o laboratório pode esconder um metabolismo lento. Buscamos o ponto ótimo de energia."
                items={[
                  { label: "TSH (Adultos)", functional: "1.0 - 2.3 µUI/mL", lab: "0.4 - 4.5 µUI/mL" },
                  { label: "Ferritina (Mulher)", functional: "70 - 100 ng/mL", lab: "10 - 200 ng/mL" }
                ]}
              />
              <ProtocolCard 
                title="Micronutrientes"
                range="Cofatores Celulares"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2"/></svg>}
                description="Níveis mínimos não garantem performance cognitiva. Vitamina D e B12 são pilares de neuroproteção."
                items={[
                  { label: "Vitamina D", functional: "40 - 70 ng/mL", lab: "20 - 100 ng/mL" },
                  { label: "Vitamina B12", functional: "500 - 800 pg/mL", lab: "200 - 900 pg/mL" }
                ]}
              />
              <ProtocolCard 
                title="Eixo Inflamatório"
                range="Integridade Tecidual"
                icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2"/></svg>}
                description="Identificamos inflamação subclínica que os métodos tradicionais podem ignorar."
                items={[
                  { label: "PCR Ultrassensível", functional: "< 1.0 mg/L", lab: "< 3.0 mg/L" },
                  { label: "Homocisteína", functional: "6.0 - 9.0 µmol/L", lab: "Até 15.0" }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase max-w-lg text-center md:text-left">
            Estes protocolos são baseados em diretrizes de medicina funcional e integrativa internacional. Consulte sempre seu médico assistente.
          </p>
          <button onClick={onClose} className="px-10 py-3 bg-fleming-dark text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-fleming-dark/20">
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProtocolsModal;
