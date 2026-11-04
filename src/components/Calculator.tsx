import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, ArrowRight, Layers, Home, Shield, DollarSign } from 'lucide-react';
import { LeadPayload } from '../services/telegram';
import { getWarehouseSettings, WarehouseSettings } from '../utils/pricesStore';

interface CalculatorProps {
  onOpenLeadModal: (initialData?: Partial<LeadPayload>) => void;
}

type Mode = 'osb' | 'roof' | 'fence';

export const Calculator: React.FC<CalculatorProps> = ({ onOpenLeadModal }) => {
  const [mode, setMode] = useState<Mode>('osb');
  const [settings, setSettings] = useState<WarehouseSettings>(() => getWarehouseSettings());

  useEffect(() => {
    const handler = () => setSettings(getWarehouseSettings());
    window.addEventListener('dom_amk_settings_updated', handler);
    return () => window.removeEventListener('dom_amk_settings_updated', handler);
  }, []);

  // OSB state
  const [osbArea, setOsbArea] = useState<number>(45);
  const [osbThickness, setOsbThickness] = useState<string>('12 мм (стены, каркас)');

  // Roof state
  const [roofArea, setRoofArea] = useState<number>(110);
  const [roofMaterial, setRoofMaterial] = useState<string>('Металлочерепица Монтеррей 0.5 мм');

  // Fence state
  const [fenceLength, setFenceLength] = useState<number>(35);
  const [fenceHeight, setFenceHeight] = useState<number>(2.0);

  // Calculations
  const osbSheetsNeeded = Math.ceil((osbArea * 1.1) / 3.125);
  const osbScrews = osbSheetsNeeded * 35;
  const osbMembraneRolls = Math.ceil((osbArea * 1.15) / 75);

  const roofSheetsOnduline = Math.ceil((roofArea * 1.15) / 1.5);
  const roofScrews = Math.round(roofArea * 8);
  const roofMembraneRolls = Math.ceil((roofArea * 1.15) / 75);

  const fencePosts = Math.ceil(fenceLength / 2.5) + 1;
  const fenceLagsMeters = Math.round(fenceLength * 2);
  const fenceSheets = Math.ceil(fenceLength / 1.15);

  // Расчет примерной сметы в рублях (BYN)
  let estimatedPriceByn = 0;
  if (mode === 'osb') {
    let sheetPrice = settings.osb12;
    if (osbThickness.includes('9 мм')) sheetPrice = settings.osb9;
    else if (osbThickness.includes('15 мм')) sheetPrice = settings.osb15;
    else if (osbThickness.includes('18 мм')) sheetPrice = settings.osb18;
    else if (osbThickness.includes('22 мм')) sheetPrice = settings.osb22;
    estimatedPriceByn = Math.round(osbSheetsNeeded * sheetPrice);
  } else if (mode === 'roof') {
    if (roofMaterial.includes('Ондулин')) {
      estimatedPriceByn = Math.round(roofSheetsOnduline * settings.onduline);
    } else {
      estimatedPriceByn = Math.round(roofArea * settings.metalTile);
    }
  } else {
    // Каркас + профлист
    estimatedPriceByn = Math.round(
      fencePosts * 3 * 6.5 + fenceLagsMeters * settings.pipe40x20 + fenceSheets * 2 * 21
    );
  }

  const handleSendCalculation = () => {
    let summary = '';
    let materialName = '';

    if (mode === 'osb') {
      materialName = `Плита OSB-3 ${osbThickness}`;
      summary = `Площадь: ${osbArea} м² -> ${osbSheetsNeeded} листов (~${estimatedPriceByn} руб.), саморезов ~${osbScrews} шт, мембраны ${osbMembraneRolls} рул.`;
    } else if (mode === 'roof') {
      materialName = roofMaterial;
      summary = `Площадь кровли: ${roofArea} м² -> Покрытие ~${roofArea} м² (~${estimatedPriceByn} руб.), саморезов ~${roofScrews} шт, мембраны ${roofMembraneRolls} рул.`;
    } else {
      materialName = `Забор из профнастила h=${fenceHeight}м`;
      summary = `Длина: ${fenceLength} п.м. -> Столбов: ${fencePosts} шт, лаг: ${fenceLagsMeters} м (~${estimatedPriceByn} руб. с материалом).`;
    }

    onOpenLeadModal({
      material: materialName,
      quantity: summary,
      source: 'Калькулятор сметы на сайте',
    });
  };

  return (
    <section id="calculator" className="py-8 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-2.5">
            <CalcIcon className="w-3.5 h-3.5" />
            Быстрый расчет без лишней воды
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 sm:mb-4">
            Калькулятор необходимого объема
          </h2>
          <p className="text-slate-300 text-xs sm:text-base">
            Укажите площадь или длину — калькулятор моментально прикинет расход с запасом 10% на подрезку.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 max-w-xl mx-auto mb-6 sm:mb-10">
          <button
            onClick={() => setMode('osb')}
            className={`flex items-center justify-center gap-1.5 py-2 sm:py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'osb'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ОСБ-3</span>
          </button>

          <button
            onClick={() => setMode('roof')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'roof'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Кровля</span>
          </button>

          <button
            onClick={() => setMode('fence')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              mode === 'fence'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Забор</span>
          </button>
        </div>

        {/* Calculator Main Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start bg-slate-800/80 border border-slate-700 rounded-2xl p-4 sm:p-8 backdrop-blur-sm">
          
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            {mode === 'osb' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200">
                      Площадь обшивки стен, пола или кровли:
                    </label>
                    <span className="text-amber-400 font-bold text-base sm:text-lg">{osbArea} м²</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={osbArea}
                    onChange={(e) => setOsbArea(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>5 м² (бытовка)</span>
                    <span>100 м² (дом)</span>
                    <span>200 м²</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
                    Толщина листа ОСБ-3:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      '9 мм (кровля)',
                      '12 мм (стены)',
                      '15 мм (усиленные)',
                      '18 мм (пол)',
                      '22 мм (нагрузки)',
                    ].map((th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setOsbThickness(th)}
                        className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                          osbThickness.startsWith(th.slice(0, 4))
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {th}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === 'roof' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200">
                      Общая площадь скатов крыши:
                    </label>
                    <span className="text-amber-400 font-bold text-base sm:text-lg">{roofArea} м²</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    step="5"
                    value={roofArea}
                    onChange={(e) => setRoofArea(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>20 м² (гараж)</span>
                    <span>120 м² (дом)</span>
                    <span>300 м² (коттедж)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
                    Кровельное покрытие:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Металлочерепица Монтеррей 0.5 мм',
                      'Металлочерепица Нордик 0.45 мм',
                      'Еврошифер Ондулин Smart',
                      'Профнастил МП-20',
                    ].map((mat) => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setRoofMaterial(mat)}
                        className={`text-left text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                          roofMaterial === mat
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {mode === 'fence' && (
              <>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs sm:text-sm font-semibold text-slate-200">
                      Общая длина забора:
                    </label>
                    <span className="text-amber-400 font-bold text-base sm:text-lg">{fenceLength} м.п.</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="1"
                    value={fenceLength}
                    onChange={(e) => setFenceLength(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>10 м</span>
                    <span>40 м (стандарт)</span>
                    <span>120 м (периметр)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
                    Высота забора:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1.5, 1.8, 2.0].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setFenceHeight(h)}
                        className={`text-center text-xs p-2.5 rounded-lg border transition-all cursor-pointer ${
                          fenceHeight === h
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-900/60 border-slate-700 text-slate-300'
                        }`}
                      >
                        {h} метра
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 text-[11px] text-slate-300 leading-snug">
              💡 <b>Склад в Бобруйске:</b> неиспользованные целые листы ОСБ-3 или профильную трубу без резки принимаем обратно с возвратом средств!
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 to-slate-950 p-5 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Итоговый расчет
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold">
                  В наличии
                </span>
              </div>

              {mode === 'osb' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">Плита ОСБ-3 (2500×1250):</span>
                    <span className="text-lg font-bold text-amber-400">{osbSheetsNeeded} листов</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Толщина: <span className="text-white">{osbThickness}</span> (~{(osbSheetsNeeded * 3.125).toFixed(1)} м²)
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-300">Саморезы оцинкованные:</span>
                    <span className="font-semibold text-white">~{osbScrews} шт.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Мембрана влагозащитная:</span>
                    <span className="font-semibold text-white">{osbMembraneRolls} рул.</span>
                  </div>
                </div>
              )}

              {mode === 'roof' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">Площадь скатов:</span>
                    <span className="text-lg font-bold text-amber-400">~{roofArea} м²</span>
                  </div>
                  {roofMaterial.includes('Ондулин') ? (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-300">Ондулин Smart:</span>
                      <span className="font-semibold text-white">{roofSheetsOnduline} листов</span>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                      <span className="text-slate-300">Металлочерепица:</span>
                      <span className="font-semibold text-white">в нарезку по скатам</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Саморезы кровельные:</span>
                    <span className="font-semibold text-white">~{roofScrews} шт.</span>
                  </div>
                </div>
              )}

              {mode === 'fence' && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-300">Столбы (труба 60×40):</span>
                    <span className="text-lg font-bold text-amber-400">{fencePosts} шт.</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-300">Лаги (труба 40×20 в 2 ряда):</span>
                    <span className="font-semibold text-white">{fenceLagsMeters} м.п.</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300">Листов профнастила:</span>
                    <span className="font-semibold text-white">{fenceSheets} шт.</span>
                  </div>
                </div>
              )}
              {/* Примерная стоимость по ценам склада */}
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-amber-400">
                    Ориентировочно со склада:
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Точный расчет с учетом скидки на объем
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg sm:text-xl font-black text-amber-400">
                    ~{estimatedPriceByn} руб.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={handleSendCalculation}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span>Заказать этот расчет со скидкой</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
