
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AnalysisReport, ChatMessage } from '../types';

interface IntegrativeChatProps {
  report: AnalysisReport;
}

const IntegrativeChat: React.FC<IntegrativeChatProps> = ({ report }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const userMessagesCount = messages.filter(m => m.role === 'user').length;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isLimitReached) return;

    const currentInput = input;
    const userMessage: ChatMessage = { role: 'user', parts: [{ text: currentInput }] };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');

    if (userMessagesCount >= 2) {
      setIsLoading(true);
      setTimeout(() => {
        const transitionMessage: ChatMessage = { 
          role: 'model', 
          parts: [{ text: `Para que possamos aprofundar esses pontos específicos e construir seu plano de otimização personalizado, agora é o momento de falar diretamente com nosso time de especialistas. 

Estamos prontos para te dar o suporte humano necessário para sua jornada de saúde.` }] 
        };
        setMessages(prev => [...prev, transitionMessage]);
        setIsLoading(false);
        setIsLimitReached(true);
      }, 1000);
      return;
    }

    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const systemInstruction = `
        Você é o Concierge Fleming Saúde. Sua essência é "Ao seu lado, por sua saúde".
        Especialista em Medicina Funcional e Integrativa.
        
        PROTOCOLO DE ATENDIMENTO E ESCRITA:
        1. REGRAS DE FORMATAÇÃO: 
           - NUNCA utilize aspas (") ou asteriscos (*) para listas ou itálico.
           - Use negrito (ex: **palavra**) de forma estratégica para termos cruciais.
        
        2. FLUXO DE CONTEXTO:
           - PRIMEIRA MENSAGEM: Cumprimente pelo nome ${report.patientName.split(' ')[0]} e apresente a tese clínica: ${report.functionalHealthImpactSummary}.
           - MENSAGENS SUBSEQUENTES: Seja direto e mantenha a fluidez.
        
        3. PERSONALIDADE: Cortês, proativo e acolhedor.
        
        DADOS DO LAUDO:
        Paciente: ${report.patientName} | Score: ${report.healthScore}%
        Biomarcadores Urina (se presentes): ${report.biomarkers.filter(b => b.system === 'Renal' || b.biomarcador.toLowerCase().includes('ph') || b.biomarcador.toLowerCase().includes('densidade')).map(b => `${b.biomarcador}: ${b.valor} (${b.classificacao})`).join('; ')}
        Principais Pontos: ${report.o_que_merece_atencao.join(', ')}
      `;

      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction },
        history: messages.map(m => ({
          role: m.role,
          parts: m.parts
        }))
      });

      const result = await chat.sendMessage({ message: currentInput });
      const responseText = result.text;

      const modelMessage: ChatMessage = { 
        role: 'model', 
        parts: [{ text: responseText || "Entendido. Como podemos seguir com seu cuidado?" }] 
      };
      
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Erro no chat:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        parts: [{ text: "Tive um soluço técnico, mas sigo aqui com você. O que gostaria de saber agora?" }] 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`Olá! Sou o(a) ${report.patientName} e acabei de realizar minha análise no Fleming Saúde. Gostaria de aprofundar meus resultados (Score: ${report.healthScore}%) com um especialista.`);
    // Número oficial atualizado: 27 99933-9001
    window.open(`https://wa.me/5527999339001?text=${text}`, '_blank');
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden no-print">
      <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-fleming-light rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-fleming-light/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight">Concierge <span className="text-fleming-light">Fleming IA</span></h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ao seu lado, por sua saúde</p>
          </div>
        </div>
        <div className="hidden md:block">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 bg-fleming-light rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase text-slate-400">Atendimento Ativo</span>
           </div>
        </div>
      </div>

      <div ref={scrollRef} className="h-[450px] overflow-y-auto p-8 space-y-6 bg-slate-50/50 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-6 opacity-60">
            <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-sm text-fleming-dark rotate-3">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">Olá, {report.patientName.split(' ')[0]}!</p>
              <p className="text-xs font-medium text-slate-500 italic max-w-xs mx-auto">
                Analisei seus {report.biomarkers.length} marcadores com foco em sua vitalidade.
                <br/><br/>
                Como posso ajudar com suas dúvidas agora?
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-fleming-dark text-white rounded-tr-none' 
                : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
            }`}>
              {msg.parts[0].text.split('\n').filter(p => p.trim() !== '').map((para, idx) => (
                <p key={idx} className={idx > 0 ? 'mt-4' : ''}>{para}</p>
              ))}
              
              {isLimitReached && i === messages.length - 1 && msg.role === 'model' && (
                <button 
                  onClick={openWhatsApp}
                  className="mt-6 w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  Conversar com Especialista
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-3xl rounded-tl-none border border-slate-100 flex gap-2 shadow-sm">
              <div className="w-1.5 h-1.5 bg-fleming-light rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-fleming-light rounded-full animate-bounce delay-100"></div>
              <div className="w-1.5 h-1.5 bg-fleming-light rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-6 bg-white border-t border-slate-100 flex gap-4">
        <input 
          type="text" 
          disabled={isLimitReached}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isLimitReached ? "Limite de consulta automatizada atingido." : "Tire suas dúvidas aqui..."}
          className="flex-grow bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-fleming-dark font-medium transition-all text-slate-700 placeholder:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          disabled={isLoading || !input.trim() || isLimitReached}
          className="bg-fleming-dark text-white px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-30 flex items-center justify-center min-w-[120px]"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default IntegrativeChat;
