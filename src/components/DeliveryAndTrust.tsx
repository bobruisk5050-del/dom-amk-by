import React from 'react';
import { Truck, CreditCard, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DeliveryAndTrust: React.FC = () => {
  return (
    <section id="delivery" className="py-8 sm:py-16 md:py-20 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок секции */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 border border-emerald-200 dark:border-emerald-800">
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Удобная логистика и оплата
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 sm:mb-4">
            Доставка по Бобруйску и району за 2–4 часа
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base">
            Не нужно искать сторонних перевозчиков. Собственный автопарк привезет материалы прямо к объекту или даче с расчетом на месте.
          </p>
        </div>

        {/* 3 варианта доставки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Вариант 01
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Популярный
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Маневренная Газель 4.2 м
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Идеально для дач и частного сектора. Вмещает до 60 листов ОСБ-3, профильные трубы до 4 метров и доборы.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Подача по городу в течение 2–3 часов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Грузоподъемность до 1.8 тонн</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Вариант 02
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Крупный объём
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Манипулятор / Длинномер
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Для крупных строек, 6-метровых труб, целых заводских поддонов ОСБ-3 и длинных листов черепицы.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Механизированная выгрузка стрелой</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Грузоподъемность до 10 тонн</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 relative flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-500">
                  Вариант 03
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  Бесплатно
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Самовывоз со склада (0 руб.)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Приезжайте на личном авто или прицепе. Склад оборудован удобным асфальтированным подъездом.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Бесплатная погрузка кладовщиками</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Бесплатная резка трубы под багажник</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* География рейсов */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-8 mb-8 sm:mb-12 border border-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="max-w-xl">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
                География регулярных рейсов:
              </span>
              <h3 className="text-lg sm:text-2xl font-bold mb-1.5">
                Ежедневно возим по Бобруйску и всей округе
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Водитель свяжется за 30 минут до приезда и согласует место выгрузки.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 max-w-lg">
              {[
                'Бобруйск (все районы)',
                'Киселевичи',
                'Даманский',
                'Форштадт',
                'Березина',
                'Сычково',
                'г. Кировск',
                'г.п. Глуск',
                'г. Осиповичи',
                'г. Кличев',
                'Елизово',
                'Дачные поселки',
              ].map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] sm:text-xs font-medium border border-slate-700/80"
                >
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 преимущества и оплата */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-0.5">Любая форма оплаты</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-snug">
                Наличными водителю, банковской картой через мобильный терминал или безнал с НДС.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-0.5">Прием остатков</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-snug">
                Остались целые листы ОСБ-3 или профильная труба? Примем обратно на складе.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm mb-0.5">Сертификаты и ГОСТ</h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-snug">
                Вся продукция сертифицирована в Республике Беларусь: класс ОСБ-3 подтвержден протоколами.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
