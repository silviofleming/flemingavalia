
import React from 'react';
import { Review } from '../types';

interface TestimonialsProps {
  reviews: Review[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ reviews }) => {
  // Algoritmo de relevância: Combinação de Nota + Extensão do Comentário
  const sortedReviews = [...reviews]
    .sort((a, b) => {
      const scoreA = (a.rating * 10) + (a.content.length / 5);
      const scoreB = (b.rating * 10) + (b.content.length / 5);
      return scoreB - scoreA;
    })
    .slice(0, 3);

  return (
    <section className="pt-8 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <span className="text-[10px] font-black text-fleming-dark bg-fleming-light/10 px-4 py-1.5 rounded-full uppercase tracking-[0.3em]">Comunidade Fleming</span>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Impacto na <span className="text-fleming-dark">Vida Real.</span></h3>
          <p className="text-slate-400 font-medium max-w-lg mx-auto text-sm">Depoimentos reais de quem já decifrou sua biologia com nossa tecnologia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sortedReviews.map((review) => {
            const isHighQuality = review.content.length > 50 && review.rating >= 5;
            return (
              <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col h-full hover:scale-[1.03] hover:shadow-2xl hover:shadow-fleming-dark/5 transition-all duration-700 group relative overflow-hidden">
                {isHighQuality && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 animate-pulse">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    Destaque Clínico
                  </div>
                )}
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-slate-600 font-medium italic mb-8 leading-relaxed flex-grow text-sm">"{review.content}"</p>
                
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg group-hover:bg-fleming-light/10 group-hover:text-fleming-dark transition-all duration-500">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{review.author}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
