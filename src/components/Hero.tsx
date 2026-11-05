import React from 'react';
import { Phone, ArrowRight, Truck, Scissors, Wallet, ShieldCheck, MapPin } from 'lucide-react';
import { LeadPayload } from '../services/telegram';
import heroDepotImg from '../assets/images/hero_building_depot_1793724166031.jpg';

interface HeroProps {
  onOpenLeadModal: (initialData?: Partial<LeadPayload>) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLeadModal }) => {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800/80">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16">
        
        {/* Двухколоночный блок: текст слева + карточка с фото склада справа */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center mb-8 sm:mb-12">
          
          {/* Левая колонка: заголовок, описание, кнопки и плашки наличия */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
              <span>База и склад в Бобруйске • Опт и розница с НДС</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-[1.15] mb-3 sm:mb-4">
              Кровельные материалы, плита ОСБ-3 и профильная труба{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                в Бобруйске
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
              Прямые поставки со склада на <b>ул. Орджоникидзе, 349</b> и рынка «Птичка». Влагостойкая плита ОСБ-3 Kronospan, металлочерепица Монтеррей, ондулин, трубы для заборов и фасады АМК. Доставка по городу и району за 2–4 часа, бесплатная резка труб, оплата водителю при выгрузке.
            </p>

            {/* Кнопки призыва к действию */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
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

            {/* Плашки наличия — flex-wrap с переносом, текст никогда не обрезается */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
              <span className="font-bold text-amber-400 whitespace-nowrap mr-1">
                В наличии:
              </span>
              {[
                'ОСБ-3 (9–22мм)',
                'Ондулин Smart',
                'Металлочерепица',
                'Труба 40×20 / 60×40',
                'Фасады АМК',
                'Мембраны и водостоки',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-[11px] font-medium whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Правая колонка: карточка с реальным фото склада и подписью */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden">
                <img
                  src={heroDepotImg}
                  alt="Склад строительных материалов на Орджоникидзе 349 в Бобруйске"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  decoding="async"
                />
                
                {/* Бейдж в наличии в правом верхнем углу фото */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/85 text-emerald-400 text-xs font-bold border border-emerald-500/30 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-500/20" />
                    <span>В наличии на складе</span>
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />
              </div>

              {/* Информационная плашка под фото */}
              <div className="p-4 sm:p-5 bg-slate-950/95 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs sm:text-sm font-bold mb-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span>Бобруйск, ул. Орджоникидзе, 349</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Кровельные материалы, плиты ОСБ-3, профильные трубы. Отгрузка от 1 шт., самовывоз и быстрая доставка за 2–4 ч.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 4 ключевых преимущества со склада */}
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

