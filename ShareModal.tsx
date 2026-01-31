
import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, shareUrl }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen && shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 600,
        margin: 2,
        color: {
          dark: '#436d2e',
          light: '#ffffff'
        }
      })
      .then(url => {
        setQrDataUrl(url);
        setError(false);
      })
      .catch(err => {
        console.error("Erro ao gerar QR Code:", err);
        setError(true);
      });
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá! Acesse aqui sua análise clínica Fleming Saúde em formato digital: ${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 no-print">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 text-center space-y-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-fleming-dark bg-fleming-light/10 px-4 py-1.5 rounded-full uppercase tracking-[0.3em]">DNA Clínico Digital</span>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">QR Code <span className="text-fleming-dark">Privado</span></h3>
            <p className="text-sm text-slate-500 font-medium px-4 leading-relaxed italic">Sua saúde ao seu lado. Aponte a câmera para acessar o laudo interativo em qualquer dispositivo.</p>
          </div>

          <div className="relative group flex justify-center">
            <div className="absolute -inset-6 bg-fleming-light/20 rounded-[4rem] blur-3xl group-hover:bg-fleming-light/30 transition-all duration-1000"></div>
            
            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden flex items-center justify-center min-h-[224px] min-w-[224px]">
              {error ? (
                <div className="text-rose-500 text-[10px] font-black uppercase text-center p-4">
                  Erro ao gerar QR Code.<br/>O laudo é muito extenso para este formato.
                </div>
              ) : qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="QR Code do Laudo" 
                  className="w-48 h-48 md:w-56 md:h-56 object-contain animate-in fade-in duration-500" 
                />
              ) : (
                <div className="w-12 h-12 border-4 border-fleming-light border-t-fleming-dark rounded-full animate-spin"></div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <button 
              onClick={handleCopy}
              className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-sm'}`}
            >
              {copied ? 'Copiado!' : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Copiar Link
                </>
              )}
            </button>
            <button 
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Enviar WhatsApp
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-relaxed px-6">
             Fleming Saúde: Ao seu lado, por sua saúde. <br/>Geração local e segura.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
