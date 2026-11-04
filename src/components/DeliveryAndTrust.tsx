import React from 'react';
import { Truck, CreditCard, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DeliveryAndTrust: React.FC = () => {
  return (
    <section id="delivery" className="py-16 md:py-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 text-xs sm:text-sm font-semibold mb-3 border border-emerald-200 dark:border-emerald-800">
            <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Удобная логистика и оплата
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Доставка по Бобруйску и району за 2–4 часа
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Не нужно искать сторонних перевозчиков и переплачивать. Собственный автопарк привезет материалы прямо к вашему фундаменту или даче с расчетом на месте.
          </p>
        </div>

        {/* 3 Step Logistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Маневренная Газель 4.2 м
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Идеально для дачных участков и узких улочек частного сектора. Вмещает до 60 листов OSB-3 (ОСБ), профильные трубы до 4 метров и кровельные доборы.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
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
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Самый популярный вариант
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Манипулятор / Длинномер
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Для крупных строительных объектов, длинных 6-метровых труб, целых заводских поддонов OSB-3 (ОСБ) и длинных листов металлочерепицы.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
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
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Для оптовых заказов
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Самовывоз со склада (0 руб.)
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                Приезжайте на личном авто, прицепе или бусе. Склад оборудован удобным асфальтированным подъездом и погрузчиком.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
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
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              ул. Орджоникидзе, 349
            </div>
          </div>

        </div>

        {/* Coverage towns chips */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-12 border border-slate-800">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
                География регулярных рейсов:
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Ежедневно возим по Бобруйску и всей округе
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm">
                Водитель свяжется за 30 минут до приезда, согласует точное место выгрузки и поможет аккуратно принять товар.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-w-lg">
              {[
                'г. Бобруйск (все районы)',
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
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700/80"
                >
                  📍 {loc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Payment Methods & Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Любая форма оплаты</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                Наличные рубли водителю, оплата банковской картой через мобильный терминал, либо безнал с НДС для юрлиц.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Прием остатков</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                Остались целые неиспользованные листы OSB-3 (ОСБ) или профильная труба? Примем обратно на складе без лишней бюрократии.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Сертификаты и ГОСТ</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                Вся продукция сертифицирована в Республике Беларусь: класс влагостойкости OSB-3 подтвержден протоколами.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
