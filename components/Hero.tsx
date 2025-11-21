import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Nature Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-leaf-900/60 to-slate-900/80"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="inline-block mb-4 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-sm font-semibold tracking-wide uppercase">
          Idrologia Vegetale
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Il Respiro della <span className="text-transparent bg-clip-text bg-gradient-to-r from-leaf-300 to-sky-300">Natura</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 mb-10 font-light leading-relaxed">
          Scopri l'<strong>Evapotraspirazione</strong>: il processo invisibile che muove l'acqua dal suolo all'atmosfera, nutrendo le piante e raffreddando il pianeta.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => document.getElementById('explanation')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-leaf-600 hover:bg-leaf-500 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-leaf-900/20"
          >
            Come Funziona
          </button>
          <button 
             onClick={() => document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-bold text-lg transition-all"
          >
            Simula Adesso
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <ArrowDown size={32} />
      </div>
    </section>
  );
};

export default Hero;