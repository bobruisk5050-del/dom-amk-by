import React from 'react';
import { Phone, ArrowRight, Truck, Scissors, Wallet, ShieldCheck } from 'lucide-react';
import { LeadPayload } from '../services/telegram';
import heroDepotImg from '../assets/images/hero_building_depot_1793724166031.jpg';

interface HeroProps {
  onOpenLeadModal: (initialData?: Partial<LeadPayload>) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLeadModal }) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800/80">
      {/* Оптимизированный фоновый снимок склада */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src={heroDepotImg}
          alt="Склад строительных материалов в Бобруйске"
          className="w-full h-full object-cover object-right md:object-center opacity-25"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-14 sm:pb-16 lg:pt-18 lg:pb-20">
        <div className="max-w-3xl">
          
          {/* Аккуратный текстовый кикер без лишних рамок */}
          <div className="text-xs sm:text-sm font-bold tracking-wide uppercase text-amber-400 mb-2 sm:mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Оптово-розничный склад стройматериалов • Бобруйск</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] mb-3 sm:mb-5">
            Кровельные материалы, плита ОСБ-3 и профильная труба{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              в Бобруйске
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed mb-6 sm:mb-8 font-normal">
            Прямые поставки со склада на <b>ул. Орджоникидзе, 349</b> и рынка «Птичка». Влагостойкая плита ОСБ-3 Kronospan, металлочерепица Монтеррей, ондулин и труба для заборов с бесплатной нарезкой. Быстрая доставка по городу и району за 2–4 часа, расчет при выгрузке.
          </p>

          {/* Кнопки призыва к действию */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 sm:mb-8">
            <a
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-center cursor-pointer"
            >
              <span>Рассчитать смету со скидкой</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </a>

            <a
              href="tel:+375447022533"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-700/80 active:scale-95 transition-colors text-center tabular-nums"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>+375 (44) 702-25-33</span>
            </a>
          </div>

          {/* Строка наличия — чистая, элегантная, без громоздких серых рамок */}
          <div className="text-xs text-slate-300 flex items-center flex-wrap gap-x-2 gap-y-1 mb-8 sm:mb-12">
            <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              В наличии на складе:
            </span>
            <span className="text-white font-medium">ОСБ-3 (9–22 мм)</span>
            <span className="text-slate-600">•</span>
            <span className="text-white font-medium">Металлочерепица</span>
            <span className="text-slate-600">•</span>
            <span className="text-white font-medium">Ондулин Smart</span>
            <span className="text-slate-600">•</span>
            <span className="text-white font-medium">Профтруба 40×20 / 60×40</span>
            <span className="text-slate-600">•</span>
            <span className="text-white font-medium">Фасады АМК</span>
          </div>

        </div>

        {/* 4 ключевых преимущества — легкий премиальный стрип */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-6 border-t border-slate-800/80">
          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <h3 className="font-bold text-white text-xs sm:text-sm">Своя доставка</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Бобруйск и район за 2–4 ч. Газель 4.2м и манипулятор.
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-1">
              <Scissors className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <h3 className="font-bold text-white text-xs sm:text-sm">Резка в размер</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Бесплатно нарежем профтрубу под ваш прицеп или багажник.
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <h3 className="font-bold text-white text-xs sm:text-sm">Оплата водителю</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Наличными или картой на выгрузке. Безнал с НДС для юрлиц.
            </p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl bg-slate-900/50 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <h3 className="font-bold text-white text-xs sm:text-sm">Отгрузка от 1 шт.</h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Орджоникидзе, 349 и «Птичка». Возврат неиспользованных листов.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

