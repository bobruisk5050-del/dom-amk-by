import React from 'react';
import { Phone, ArrowRight, Truck, Scissors, Wallet, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';
import { LeadPayload } from '../services/telegram';
import heroDepotImg from '../assets/images/hero_building_depot_1793724166031.jpg';

interface HeroProps {
  onOpenLeadModal: (initialData?: Partial<LeadPayload>) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLeadModal }) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden">
      {/* Фоновое изображение склада */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroDepotImg}
          alt="Склад кровельных материалов и OSB-3 в Бобруйске"
          className="w-full h-full object-cover object-center opacity-20 transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 sm:pt-14 sm:pb-18 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Левая колонка: Оффер и преимущества */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-xs font-semibold text-amber-400 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>База и склад в Бобруйске • Опт и розница с НДС</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 sm:mb-6">
              Кровельные материалы, плита ОСБ-3 и профильная труба{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                в Бобруйске
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed mb-6 sm:mb-8 font-normal">
              Прямые поставки со склада на <b>ул. Орджоникидзе, 349</b> и рынка «Птичка». Влагостойкая плита ОСБ-3, металлочерепица, ондулин, трубы для заборов и фасады АМК.
              <span className="hidden sm:inline"> Доставка по городу и району за 2–4 часа, бесплатная резка труб, оплата водителю при выгрузке.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 transition-all text-center cursor-pointer"
              >
                <span>Рассчитать смету со скидкой</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>

              <a
                href="tel:+375447022533"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700/80 transition-all text-center backdrop-blur-sm"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>+375 (44) 702-25-33</span>
              </a>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 text-[11px] sm:text-xs text-slate-300 scrollbar-none">
              <span className="font-semibold text-amber-400 whitespace-nowrap">В наличии:</span>
              {[
                'ОСБ-3 (9–22мм)',
                'Ондулин Smart',
                'Металлочерепица',
                'Труба 40×20 / 60×40',
                'Фасады АМК',
                'Мембраны',
              ].map((tag) => (
                <span
                  key={tag}
                  className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-200 border border-slate-700/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Правая колонка: Фото склада на главной */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 group">
              <img
                src={heroDepotImg}
                alt="Склад стройматериалов «Дома и кровли» в Бобруйске"
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Бейдж наличия сверху */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>В наличии на складе</span>
                </span>
              </div>

              {/* Адрес склада внизу фото */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Бобруйск, ул. Орджоникидзе, 349</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Кровельные материалы, плиты ОСБ-3, профильные трубы. Отгрузка от 1 шт., самовывоз и доставка за 2–4 ч.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 4 ключевых преимущества */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-8 sm:pt-12 mt-8 border-t border-slate-800/80">
          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-bold text-white text-xs sm:text-base mb-0.5">Своя доставка</h3>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Бобруйск и район за 2–4 ч. Газель и манипулятор.
            </p>
          </div>

          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-bold text-white text-xs sm:text-base mb-0.5">Резка в размер</h3>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Бесплатно нарежем трубу под багажник/прицеп.
            </p>
          </div>

          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-bold text-white text-xs sm:text-base mb-0.5">Оплата водителю</h3>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Наличные, карта на выгрузке, безнал с НДС.
            </p>
          </div>

          <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="font-bold text-white text-xs sm:text-base mb-0.5">Склад на месте</h3>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug">
              Орджоникидзе, 349 и «Птичка». Отгрузка от 1 шт.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
