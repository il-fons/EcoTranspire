
import React, { useState, useEffect } from 'react';
import { Calculator, Droplet, Sprout, Ruler, Clock, Settings, CloudRain, Maximize, AlertTriangle } from 'lucide-react';

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
  mandorlo: { name: 'Mandorlo', kc: { initial: 0.4, mid: 0.9, late: 0.65 } },
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
  const [rainfall, setRainfall] = useState<number>(0); // Rainfall in mm
  const [cropKey, setCropKey] = useState<string>('pomodoro');
  const [growthStage, setGrowthStage] = useState<keyof CropData['kc']>('mid');
  const [systemType, setSystemType] = useState<'drip' | 'sprinkler'>('drip');
  
  // System specs
  const [emitterFlow, setEmitterFlow] = useState<number>(2.0); // L/h
  const [rowSpacing, setRowSpacing] = useState<number>(1.0); // meters
  const [emitterSpacing, setEmitterSpacing] = useState<number>(0.3); // meters
  const [dripLines, setDripLines] = useState<number>(1); // Number of drip lines per row
  const [systemArea, setSystemArea] = useState<number>(1000); // m2 for system design
  const [maxIrrigationTime, setMaxIrrigationTime] = useState<number>(1); // hours
  const [pumpFlowRate, setPumpFlowRate] = useState<number>(2.5); // L/s

  // Results
  const [result, setResult] = useState({
    kc: 0,
    etc: 0,
    netDeficit: 0,
    waterNeeded: 0,
    precipRate: 0,
    timeMinutes: 0,
    timeHours: 0,
    totalSystemFlow: 0,
    pumpTimeHours: 0
  });

  useEffect(() => {
    calculateIrrigation();
  }, [et0, rainfall, cropKey, growthStage, systemType, emitterFlow, rowSpacing, emitterSpacing, dripLines, systemArea, pumpFlowRate]);

  const calculateIrrigation = () => {
    // 1. Get Crop Coefficient (Kc)
    const crop = CROPS[cropKey];
    const kc = crop.kc[growthStage];

    // 2. Calculate Crop Evapotranspiration (ETc)
    const etc = et0 * kc;

    // 3. Subtract Rainfall to find Net Deficit
    const netDeficit = Math.max(0, etc - rainfall);

    // 4. Determine Efficiency based on system
    const efficiency = systemType === 'drip' ? 0.90 : 0.65;

    // 5. Calculate Gross Water Need (mm)
    const waterNeeded = netDeficit / efficiency;

    // 6. Calculate System Precipitation Rate (mm/h)
    const areaPerEmitter = rowSpacing * emitterSpacing;
    let effectiveFlow = emitterFlow;
    if (systemType === 'drip') {
        effectiveFlow = emitterFlow * dripLines;
    }
    const precipRate = areaPerEmitter > 0 ? effectiveFlow / areaPerEmitter : 0;

    // 7. Calculate Time required
    let timeHours = 0;
    if (precipRate > 0) {
      timeHours = waterNeeded / precipRate;
    }

    // 8. Calculate Total System Flow (m3/h)
    const totalSystemFlow = (systemArea * precipRate) / 1000;

    // 9. Calculate Required Time based on Pump Flow Rate (L/s)
    // Volume (L) = etc (mm) * systemArea (m2)
    // Time (h) = Volume (L) / (pumpFlowRate (L/s) * 3600)
    const volumeLiters = etc * systemArea;
    const pumpTimeHours = pumpFlowRate > 0 ? volumeLiters / (pumpFlowRate * 3600) : 0;
    setMaxIrrigationTime(Math.min(24, parseFloat(pumpTimeHours.toFixed(1))));

    setResult({
      kc,
      etc,
      netDeficit,
      waterNeeded,
      precipRate,
      timeHours,
      timeMinutes: Math.round(timeHours * 60),
      totalSystemFlow,
      pumpTimeHours
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes <= 0) return "0 min";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
  };

  return (
    <section id="irrigation-advisor" className="py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Calcolatore Tempi d'Irrigazione
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Inserisci i dati della tua coltura, la pioggia caduta e le specifiche del tuo impianto per calcolare il tempo esatto di irrigazione.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* INPUT COLUMN */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Card 1: Environmental Data */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="flex items-center text-lg font-bold text-slate-800 mb-4">
                <Droplet className="w-5 h-5 mr-2 text-sky-500" />
                Dati Ambientali
              </h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    ET0 Accumulata (mm)
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <CloudRain className="w-4 h-4 mr-1 text-slate-400" /> Pioggia Caduta (mm)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={rainfall}
                      onChange={(e) => setRainfall(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="block w-full rounded-lg border-slate-300 bg-white p-3 shadow-sm focus:border-leaf-500 focus:ring-leaf-500 sm:text-sm border"
                    />
                    <span className="ml-3 text-slate-500 font-medium">mm</span>
                  </div>
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
                    {Object.entries(CROPS).sort((a,b) => a[1].name.localeCompare(b[1].name)).map(([key, data]) => (
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
            </div>

          </div>

          {/* RESULT COLUMN */}
          <div className="lg:col-span-5 flex">
            <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-2xl border border-slate-700 flex flex-col w-full">
              <div className="flex items-center mb-6 flex-shrink-0">
                <Clock className="w-8 h-8 text-leaf-400 mr-3" />
                <h3 className="text-2xl font-bold">Consiglio Irrigazione</h3>
              </div>

              <div className="flex-1 flex flex-col justify-center mb-8 text-center py-10 bg-slate-700/50 rounded-2xl border border-slate-600">
                <span className="block text-slate-400 text-sm mb-3 uppercase tracking-widest font-bold">Tempo Consigliato</span>
                <span className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-leaf-300 via-sky-300 to-sky-500 ${result.timeMinutes === 0 ? 'text-leaf-400' : ''}`}>
                  {formatDuration(result.timeMinutes)}
                </span>
                {result.timeMinutes === 0 && (
                   <span className="block text-leaf-400 mt-4 font-medium px-4">Pioggia sufficiente, non irrigare!</span>
                )}
              </div>

              <div className="space-y-4 flex-shrink-0">
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Coefficiente Colturale (Kc)</span>
                  <span className="font-mono text-leaf-400 font-bold">{result.kc.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Fabbisogno Coltura (ETc)</span>
                  <span className="font-mono text-sky-300">{result.etc.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Pioggia (Sottratta)</span>
                  <span className="font-mono text-leaf-300">-{rainfall.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                  <span className="text-slate-400">Deficit Netto</span>
                  <span className="font-mono text-orange-300 font-bold">{result.netDeficit.toFixed(2)} mm</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">Intensità Pioggia Impianto</span>
                  <span className="font-mono text-slate-300">{result.precipRate.toFixed(2)} mm/h</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-sky-900/30 rounded-xl border border-sky-800/50 flex items-start flex-shrink-0">
                <Calculator className="w-5 h-5 text-sky-400 mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm text-sky-200">
                  {result.timeMinutes > 0 
                    ? `Il calcolo considera l'efficienza del ${systemType === 'drip' ? '90%' : '65%'} e sottrae la pioggia dal fabbisogno totale.`
                    : "La pioggia caduta copre interamente il fabbisogno idrico della coltura."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progettazione Settori Irrigui Section */}
        <div id="sector-design" className="mt-8 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-leaf-900/30 rounded-xl mr-4 border border-leaf-800/50">
              <Maximize className="w-6 h-6 text-leaf-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Progettazione Settori Irrigui</h3>
              <p className="text-slate-400 text-sm">Calcola la portata totale necessaria per il tuo settore</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Superficie totale (m²)
              </label>
              <div className="relative group">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={systemArea}
                  onChange={(e) => setSystemArea(Math.max(1, parseInt(e.target.value) || 0))}
                  className="block w-full rounded-2xl border-slate-700 bg-slate-900 text-white p-4 pr-16 text-xl font-bold focus:border-leaf-500 focus:ring-leaf-500 transition-all shadow-inner"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <span className="text-slate-500 font-bold">m²</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Superficie totale da irrigare.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-300">
                  Tempo d'irrigazione necessario
                </label>
              </div>
              <div className="relative pt-6 pb-2">
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="0.1"
                  readOnly
                  value={maxIrrigationTime}
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-default accent-leaf-500 transition-all pointer-events-none"
                />
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                  <span>0h</span>
                  <span>6h</span>
                  <span>12h</span>
                  <span>18h</span>
                  <span>24h</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Tempo calcolato per soddisfare il volume richiesto con la portata della pompa.
              </p>
              
              {result.pumpTimeHours > 24 && (
                <div className="mt-4 flex items-center gap-3 p-4 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 animate-pulse">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-bold">
                    Attenzione: Il tempo necessario ({result.pumpTimeHours.toFixed(1)}h) supera le 24 ore!
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Portata della pompa (l/s)
              </label>
              <div className="relative group">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={pumpFlowRate}
                  onChange={(e) => setPumpFlowRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                  className="block w-full rounded-2xl border-slate-700 bg-slate-900 text-white p-4 pr-16 text-xl font-bold focus:border-leaf-500 focus:ring-leaf-500 transition-all shadow-inner"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-6">
                  <span className="text-slate-500 font-bold">l/s</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 italic">
                Portata massima erogabile dalla pompa.
              </p>
            </div>

            <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
              {/* Portata Totale Richiesta */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center shadow-inner">
                <span className="text-xs text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">Portata Totale Richiesta</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-5xl md:text-6xl font-black text-leaf-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                    {result.totalSystemFlow.toFixed(2)}
                  </span>
                  <span className="text-slate-400 font-black text-xl">m³/h</span>
                </div>
                <div className="mt-4 px-4 py-2 bg-leaf-900/20 rounded-full border border-leaf-800/30">
                  <span className="text-leaf-300 font-mono font-bold">
                    ≈ {(result.totalSystemFlow * 1000 / 3600).toFixed(2)} l/s
                  </span>
                </div>
              </div>

              {/* Tempo d'irrigazione necessario */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center shadow-inner">
                <span className="text-xs text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">Tempo Necessario</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-5xl md:text-6xl font-black text-leaf-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.3)]">
                    {maxIrrigationTime}
                  </span>
                  <span className="text-slate-400 font-black text-xl">{maxIrrigationTime === 1 ? 'ora' : 'ore'}</span>
                </div>
              </div>

              {/* Volume da Somministrare */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-2xl border border-slate-800 flex flex-col justify-center items-center text-center shadow-inner">
                <span className="text-xs text-slate-500 uppercase font-black mb-2 tracking-[0.2em]">Volume da Somministrare</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-5xl md:text-6xl font-black text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                    {((result.etc * systemArea) / 1000).toFixed(2)}
                  </span>
                  <span className="text-slate-400 font-black text-xl">m³</span>
                </div>
                <div className="mt-4 px-4 py-2 bg-sky-900/20 rounded-full border border-sky-800/30">
                  <span className="text-sky-300 font-mono font-bold">
                    ≈ {(result.etc * systemArea).toFixed(0)} Litri totali
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IrrigationAdvisor;
