import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Thermometer, Droplets, Wind, Sun } from 'lucide-react';
import { WeatherData } from '../types';

const Calculator: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 25,
    humidity: 50,
    windSpeed: 10,
    solarRadiation: 500
  });

  const [etRate, setEtRate] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);

  // Simplified logic to approximate Penman-Monteith for educational visualization
  const calculateET = (data: WeatherData) => {
    const tFactor = 0.05 * data.temperature; 
    const hFactor = 1 + (100 - data.humidity) / 100;
    const wFactor = 1 + (data.windSpeed / 100);
    const sFactor = data.solarRadiation / 500;
    
    // Base rate mm/day roughly
    let et = (2 * tFactor * hFactor * wFactor * sFactor) / 3;
    return Math.min(Math.max(et, 0), 15); // Clamp between 0 and 15 mm/day
  };

  useEffect(() => {
    const rate = calculateET(weather);
    setEtRate(rate);

    // Generate fictitious diurnal cycle data based on current inputs
    const newData = [];
    for (let hour = 0; hour <= 24; hour++) {
        let sunModifier = 0;
        if (hour > 6 && hour < 20) {
            // Simple sine wave for daylight
            sunModifier = Math.sin(((hour - 6) / 14) * Math.PI);
        }
        
        // Temperature usually peaks around 14:00
        const tempModifier = weather.temperature - 5 + (10 * Math.sin(((hour - 9) / 24) * 2 * Math.PI));
        
        const hourlyET = calculateET({
            ...weather,
            temperature: tempModifier,
            solarRadiation: weather.solarRadiation * sunModifier
        });

        newData.push({
            hour: `${hour}:00`,
            et: parseFloat(hourlyET.toFixed(2)),
            temp: parseFloat(tempModifier.toFixed(1))
        });
    }
    setChartData(newData);
  }, [weather]);

  const handleChange = (field: keyof WeatherData, value: number) => {
    setWeather(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="simulator" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simulatore di Evapotraspirazione (ETo)</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Modifica i parametri ambientali per vedere come cambiano i bisogni idrici delle piante.
            Questo modello semplificato stima la perdita d'acqua in millimetri al giorno (mm/giorno).
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <h3 className="text-xl font-semibold mb-6 border-b border-slate-700 pb-2">Parametri Ambientali</h3>
            
            <div className="space-y-6">
              {/* Temperature */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="flex items-center text-slate-300">
                    <Thermometer size={18} className="mr-2 text-red-400" /> Temperatura
                  </label>
                  <span className="font-mono text-sky-400">{weather.temperature}°C</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={weather.temperature} 
                  onChange={(e) => handleChange('temperature', Number(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Humidity */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="flex items-center text-slate-300">
                    <Droplets size={18} className="mr-2 text-blue-400" /> Umidità Relativa
                  </label>
                  <span className="font-mono text-sky-400">{weather.humidity}%</span>
                </div>
                <input 
                  type="range" min="10" max="100" value={weather.humidity} 
                  onChange={(e) => handleChange('humidity', Number(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

              {/* Wind */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="flex items-center text-slate-300">
                    <Wind size={18} className="mr-2 text-gray-300" /> Vento
                  </label>
                  <span className="font-mono text-sky-400">{weather.windSpeed} km/h</span>
                </div>
                <input 
                  type="range" min="0" max="50" value={weather.windSpeed} 
                  onChange={(e) => handleChange('windSpeed', Number(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>

               {/* Solar Radiation */}
               <div>
                <div className="flex justify-between mb-2">
                  <label className="flex items-center text-slate-300">
                    <Sun size={18} className="mr-2 text-amber-400" /> Radiazione Solare
                  </label>
                  <span className="font-mono text-sky-400">{weather.solarRadiation} W/m²</span>
                </div>
                <input 
                  type="range" min="0" max="1000" step="50" value={weather.solarRadiation} 
                  onChange={(e) => handleChange('solarRadiation', Number(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Result Gauge */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 flex flex-col items-center justify-center">
            <h3 className="text-lg text-slate-400 mb-4">Tasso di Evapotraspirazione Stimato</h3>
            <div className="relative w-48 h-48 flex items-center justify-center border-8 border-slate-700 rounded-full mb-4">
               <div className="absolute inset-0 rounded-full border-8 border-sky-500 opacity-70" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${etRate * 10}%, 0 ${etRate * 10}%)` }}></div>
               <div className="text-center z-10">
                 <span className="text-5xl font-bold text-white">{etRate.toFixed(1)}</span>
                 <span className="block text-sm text-slate-400 mt-1">mm / giorno</span>
               </div>
            </div>
            <p className="text-center text-slate-300 text-sm px-4">
                {etRate < 3 && "Basso: Le piante consumano poca acqua. Ideale per giorni nuvolosi e freschi."}
                {etRate >= 3 && etRate < 6 && "Medio: Consumo d'acqua standard per una giornata primaverile."}
                {etRate >= 6 && "Alto: Stress idrico elevato! Le piante hanno bisogno di irrigazione abbondante."}
            </p>
          </div>

          {/* Chart */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
             <h3 className="text-lg text-slate-400 mb-4">Ciclo Giornaliero Stimato</h3>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickMargin={10} minTickGap={30} />
                        <YAxis stroke="#94a3b8" fontSize={12} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                            itemStyle={{ color: '#38bdf8' }}
                        />
                        <Line type="monotone" dataKey="et" stroke="#38bdf8" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
             <p className="text-xs text-center text-slate-500 mt-2">Distribuzione oraria teorica basata sui valori attuali.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Calculator;