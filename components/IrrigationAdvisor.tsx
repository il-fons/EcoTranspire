import React, { useState, useEffect } from 'react';
import { Calculator, Droplet, Sprout, Ruler, Clock, Settings } from 'lucide-react';

interface CropData {
  name: string;
  kc: {
    initial: number;
    mid: number;
    late: number;
  };
}

const CROPS: Record<string, CropData> = {
  arancio: { name: 'Arancio', kc: { initial: 0.7, mid: 0.65, late: 0.7 } },
  avocado: { name: 'Avocado', kc: { initial: 0.6, mid: 0.85, late: 0.75 } },
  carciofo: { name: 'Carciofo', kc: { initial: 0.5, mid: 1.0, late: 0.95 } },
  carota: { name: 'Carota', kc: { initial: 0.7, mid: 1.05, late: 0.95 } },
  lattuga: { name: 'Lattuga', kc: { initial: 0.7, mid: 1.0, late: 0.95 } },
  limone: { name: 'Limone', kc: { initial: 0.7, mid: 0.65, late: 0.7 } },
  mais: { name: 'Mais', kc: { initial: 0.3, mid: 1.2, late: 0.35 } },
  mango: { name: 'Mango', kc: { initial: 0.4, mid: 0.9, late: 0.75 } },
  olivo: { name: 'Olivo', kc: { initial: 0.65, mid: 0.7, late: 0.7 } },
  pomodoro: { name: 'Pomodoro', kc: { initial: 0.6, mid: 1.15, late: 0.8 } },
  prato: { name: 'Prato / Erba', kc: { initial: 0.9, mid: 0.95, late: 0.95 } },
  vite_tavola: { name: 'Vite (Uva da Tavola)', kc: { initial: 0.3, mid: 0.85, late: 0.55 } },
  vite_vino: { name: 'Vite (da Vino)', kc: { initial: 0.3, mid: 0.7, late: 0.45 } },
};

const IrrigationAdvisor: React.FC = () => {
  // State for inputs
  const [et0, setEt0] = useState<number>(5); // Accumulated ET0 in mm
  const [cropKey, setCropKey] = useState<string>('pomodoro');
  const [growthStage, setGrowthStage] = useState<keyof CropData['kc']>('mid');
  const [systemType, setSystemType] = useState<'drip' | 'sprinkler'>('drip');
  
  // System specs
  const [emitterFlow, setEmitterFlow] = useState<number>(2.0); // L/h
  const [rowSpacing, setRowSpacing] = useState<number>(1.0); // meters
  const [emitterSpacing, setEmitterSpacing] = useState<number>(0.3); // meters
  const [dripLines, setDripLines] = useState<number>(1); // Number of drip lines per row

  // Results
  const [result, setResult] = useState({
    kc: 0,
    etc: 0,
    waterNeeded: 0,
    precipRate: 0,
    timeMinutes: 0,
    timeHours: 0
  });

  useEffect(() => {
    calculateIrrigation();
  }, [et0, cropKey, growthStage, systemType, emitterFlow, rowSpacing, emitterSpacing, dripLines]);

  const calculateIrrigation = () => {
    // 1. Get Crop Coefficient (Kc)
    const crop = CROPS[cropKey];
    const kc = crop.kc[growthStage];

    // 2. Calculate Crop Evapotranspiration (ETc)
    const etc = et0 * kc;

    // 3. Determine Efficiency based on system
    // Changed to 0.65 for sprinkler as requested
    const efficiency = systemType === 'drip' ? 0.90 : 0.65;

    // 4. Calculate Gross Water Need (mm)
    const waterNeeded = etc / efficiency;

    // 5. Calculate System Precipitation Rate (mm/h)
    // Formula: Flow (L/h) / Area (m2) = mm/h
    const areaPerEmitter = rowSpacing * emitterSpacing;
    
    // If drip, we consider the number of lines per row.
    // Effectively, for the same area (rowSpacing * emitterSpacing), we have 'dripLines' emitters delivering water.
    
    let effectiveFlow = emitterFlow;
    if (systemType === 'drip') {
        effectiveFlow = emitterFlow * dripLines;
    }

    const precipRate = areaPerEmitter > 0 ? effectiveFlow / areaPerEmitter : 0;

    // 6. Calculate Time required
    // Time (h) = Water Needed (mm) / Precip Rate (mm/h)
    let timeHours = 0;
    if (precipRate > 0) {
      timeHours = waterNeeded / precipRate;
    }

    setResult({
      kc,
      etc,
      waterNeeded,
      precipRate,
      timeHours,
      timeMinutes: Math.round(timeHours * 60)
    });
  };

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h} ore e ${m} min`;
    return `${m} minuti`;
  };

  return (
    <section id="irrigation-advisor" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Calcolatore Tempi d'Irrigazione
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Inserisci i dati della tua coltura e del tuo impianto per calcolare il tempo esatto necessario a reintegrare l'acqua persa (ET0).
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* INPUT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: Environmental Data */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-slate-800 mb-4">
                <Droplet className="w-5 h-5 mr-2 text-sky-500" />
                Dati Evapotraspirazione
              </h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ET0 Accumulata (mm)
                  <span className="text-slate-400 font-normal ml-2 text-xs block sm:inline">
                    (Somma delle ET0 orarie o dato giornaliero)
                  </span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={et0}
                    onChange={(e) => setEt0(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="block w-full rounded-lg border-slate-300 bg-white p-3 shadow-sm focus:border-leaf-500 focus:ring-leaf-500 sm:text-sm border"
                  />
                  <span className="ml-3 text-slate-500 font-medium">mm</span>
                </div>
              </div>
            </div>

            {/* Card 2: Crop Data */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-slate-800 mb-4">
                <Sprout className="w-5 h-5 mr-2 text-leaf-600" />
                Dati Coltura
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tipo di Coltura</label>
                  <select
                    value={cropKey}
                    onChange={(e) => setCropKey(e.target.value)}
                    className="block w-full rounded-lg border-slate-300 bg-white p-3 shadow-sm focus:border-leaf-500 focus:ring-leaf-500 sm:text-sm border"
                  >
                    {Object.entries(CROPS).map(([key, data]) => (
                      <option key={key} value={key}>{data.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fase di Crescita</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as any)}
                    className="block w-full rounded-lg border-slate-300 bg-white p-3 shadow-sm focus:border-leaf-500 focus:ring-leaf-500 sm:text-sm border"
                  >
                    <option value="initial">Iniziale (Piantina)</option>
                    <option value="mid">Sviluppo Completo (Metà stagione)</option>
                    <option value="late">Maturazione / Fine</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Card 3: System Specs */}
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
              <h3 className="flex items-center text-lg font-bold text-white mb-4">
                <Settings className="w-5 h-5 mr-2 text-slate-300" />
                Dati Impianto
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo Irrigazione</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSystemType('drip')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                      systemType === 'drip' 
                        ? 'border-leaf-500 bg-leaf-900/50 text-leaf-400' 
                        : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-700'
                    }`}
                  >
                    A Goccia
                  </button>
                  <button
                    onClick={() => setSystemType('sprinkler')}
                    className={`flex-1 py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                      systemType === 'sprinkler' 
                        ? 'border-sky-500 bg-sky-900/50 text-sky-400' 
                        : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-700'
                    }`}
                  >
                    Aspersione
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sky-200 mb-1">
                    Portata Erogatore
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={emitterFlow}
                      onChange={(e) => setEmitterFlow(parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-lg border-slate-600 bg-slate-700 text-white p-2 pr-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-slate-400 sm:text-sm">L/h</span>
                    </div>
                  </div>
                </div>
                
                {systemType === 'drip' && (
                   <div>
                     <label className="block text-sm font-medium text-sky-200 mb-1">
                       N. Ali Gocciolanti (per fila)
                     </label>
                     <div className="relative rounded-md shadow-sm">
                       <input
                         type="number"
                         min="1"
                         step="1"
                         value={dripLines}
                         onChange={(e) => setDripLines(Math.max(1, parseInt(e.target.value) || 1))}
                         className="block w-full rounded-lg border-slate-600 bg-slate-700 text-white p-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                       />
                     </div>
                   </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                 <div>
                  <label className="block text-sm font-medium text-sky-200 mb-1">
                    Distanza tra file
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={rowSpacing}
                      onChange={(e) => setRowSpacing(parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-lg border-slate-600 bg-slate-700 text-white p-2 pr-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-slate-400 sm:text-sm">m</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-sky-200 mb-1">
                    Distanza erogatori
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={emitterSpacing}
                      onChange={(e) => setEmitterSpacing(parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-lg border-slate-600 bg-slate-700 text-white p-2 pr-10 focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-slate-400 sm:text-sm">m</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3 italic">
                *Nota: Le etichette sono in colore chiaro per migliore leggibilità.
              </p>
            </div>
          </div>

          {/* RESULT COLUMN */}
          <div className="lg:col-span-5">
            <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-2xl sticky top-24 border border-slate-700">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-leaf-400 mr-3" />
                <h3 className="text-2xl font-bold">Consiglio Irrigazione</h3>
              </div>

              <div className="mb-8 text-center py-8 bg-slate-700/50 rounded-2xl border border-slate-600">
                <span className="block text-slate-400 text-sm mb-1 uppercase tracking-wider font-semibold">Tempo Consigliato</span>
                <span className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-leaf-300 to-sky-300">
                  {formatDuration(result.timeMinutes)}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Coeff. Coltura (Kc)</span>
                  <span className="font-mono text-leaf-300">{result.kc.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Fabbisogno Reale (ETc)</span>
                  <span className="font-mono text-sky-300">{result.etc.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Acqua da Erogare (Lordo)</span>
                  <span className="font-mono text-sky-300 font-bold">{result.waterNeeded.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Intensità Pioggia Impianto</span>
                  <span className="font-mono text-orange-300">{result.precipRate.toFixed(2)} mm/h</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-sky-900/30 rounded-xl border border-sky-800/50 flex items-start">
                <Calculator className="w-5 h-5 text-sky-400 mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm text-sky-200">
                  Questo calcolo assume un'efficienza del {systemType === 'drip' ? '90%' : '65%'}. 
                  Assicurati che il tuo impianto sia in buono stato. Se piove, sottrai i mm di pioggia dall'ET0.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IrrigationAdvisor;