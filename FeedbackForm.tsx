
import React, { useState } from 'react';

interface FeedbackFormProps {
  onSuccess: (content: string, rating: number) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length > 5) {
      onSuccess(content, rating);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 text-center animate-in zoom-in duration-500">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg shadow-emerald-500/20">✓</div>
        <h4 className="text-2xl font-black text-emerald-900 mb-2">Depoimento Enviado!</h4>
        <p className="text-emerald-700/70 font-medium">Sua experiência ajudará outros pacientes a buscarem clareza clínica. Obrigado!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 print:hidden">
      <div className="space-y-4 mb-8">
        <h4 className="text-2xl font-black text-slate-900">Como foi sua experiência?</h4>
        <p className="text-slate-400 font-medium">Seu feedback é fundamental para nossa evolução técnica e humana.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4 items-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avaliação:</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`transition-all ${star <= rating ? 'text-amber-400 scale-110' : 'text-slate-200'}`}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Conte-nos como essa análise te ajudou a entender melhor sua saúde..."
          className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-medium text-slate-700 focus:ring-4 focus:ring-fleming-light/10 focus:border-fleming-dark outline-none transition-all shadow-sm resize-none"
        />

        <button 
          disabled={content.length < 5}
          className="w-full py-4 bg-fleming-dark text-white font-black rounded-2xl hover:bg-[#345424] disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-fleming-dark/20 uppercase tracking-widest text-xs"
        >
          Publicar Depoimento
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
