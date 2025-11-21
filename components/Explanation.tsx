import React from 'react';
import { Sun, Wind, Droplets, ArrowUp } from 'lucide-react';

const Explanation: React.FC = () => {
  return (
    <section id="explanation" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Cos'è l'Evapotraspirazione?</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            È la somma di due fenomeni distinti ma simultanei: l'<strong>evaporazione</strong> dell'acqua dal terreno e la <strong>traspirazione</strong> dalle piante.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Visual representation */}
          <div className="relative bg-sky-50 rounded-3xl p-8 h-96 flex items-end justify-center overflow-hidden shadow-inner border border-sky-100">
             {/* Ground */}
             <div className="absolute bottom-0 left-0 right-0 h-16 bg-amber-700/20 w-full z-10"></div>
             
             {/* Plant Simplified SVG */}
             <svg viewBox="0 0 200 300" className="h-64 w-auto z-20 relative drop-shadow-xl">
                {/* Stem */}
                <path d="M100,300 Q100,150 100,100" stroke="#16a34a" strokeWidth="8" fill="none" />
                {/* Leaves */}
                <path d="M100,200 Q60,150 20,180 Q60,220 100,200" fill="#4ade80" />
                <path d="M100,150 Q140,100 180,130 Q140,170 100,150" fill="#22c55e" />
                <path d="M100,100 Q60,50 30,80 Q70,120 100,100" fill="#86efac" />
             </svg>

             {/* Arrows animation */}
             <div className="absolute inset-0 z-30 pointer-events-none">
                {/* Evaporation arrows */}
                <div className="absolute bottom-10 left-1/4 animate-float" style={{ animationDelay: '0s' }}>
                    <ArrowUp className="text-sky-400 opacity-70" size={32} />
                    <span className="text-xs font-bold text-sky-500 ml-[-10px]">Evaporazione</span>
                </div>
                {/* Transpiration arrows */}
                <div className="absolute top-1/3 right-1/3 animate-float" style={{ animationDelay: '1s' }}>
                    <ArrowUp className="text-sky-500" size={40} />
                    <span className="text-xs font-bold text-sky-600 ml-[-10px]">Traspirazione</span>
                </div>
             </div>
             
             {/* Sun */}
             <div className="absolute top-5 right-5 animate-pulse">
                <Sun className="text-amber-400 h-16 w-16" />
             </div>
          </div>

          {/* Factors Grid */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-amber-100 p-3 rounded-lg text-amber-600">
                <Sun size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Radiazione Solare</h3>
                <p className="text-slate-600 mt-1">
                  Fornisce l'energia necessaria per trasformare l'acqua liquida in vapore. Più sole significa più evapotraspirazione.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                <Droplets size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Umidità dell'Aria</h3>
                <p className="text-slate-600 mt-1">
                  L'aria secca "chiama" l'acqua. Se l'umidità è alta, l'aria è già satura e l'evapotraspirazione rallenta.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="bg-slate-200 p-3 rounded-lg text-slate-600">
                <Wind size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Velocità del Vento</h3>
                <p className="text-slate-600 mt-1">
                  Il vento spazza via l'aria umida attorno alle foglie, permettendo a nuova acqua di evaporare più velocemente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Explanation;