import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Menu, X, ChevronRight } from 'lucide-react';
import { getWarehouseStatus } from '../utils/workingHours';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  onOpenLeadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLeadModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scheduleStatus, setScheduleStatus] = useState(() => getWarehouseStatus());

  useEffect(() => {
    const interval = setInterval(() => {
      setScheduleStatus(getWarehouseStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200">
      {/* Верхняя компактная информационная полоса (TopBar) — всегда строгая темная, как на скриншоте */}
      <div className="hidden sm:block bg-slate-950 text-slate-400 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>г. Бобруйск, ул. Орджоникидзе, 349 • рынок «Птичка»</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="relative flex h-2 w-2">
              {scheduleStatus.isOpen && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${scheduleStatus.dotColor}`} />
            </span>
            <span className={scheduleStatus.isOpen ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
              {scheduleStatus.statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Основная панель навигации (белая днем по скриншоту, темная при включении темной темы/вечером) */}
      <div className="w-full bg-white dark:bg-slate-950/95 sm:backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800/80 shadow-xs dark:shadow-none transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
            
            {/* Логотип компании с сохранением фирменного векторного логотипа */}
            <a href="#" className="flex items-center gap-2.5 sm:gap-3 group select-none">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 shadow-xs group-hover:border-amber-500/50 transition-colors flex-shrink-0">
                <BrandLogo className="w-full h-full" />
              </div>
              <div>
                <div className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-tight">
                  ДОМА И КРОВЛИ
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 leading-none mt-0.5">
                  <span>Склад стройматериалов</span>
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">Бобруйск</span>
                </div>
              </div>
            </a>

            {/* Навигация для десктопа — скругленная капсула со ссылками, как на скриншоте */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs">
              <a
                href="#catalog"
                className="px-3 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Каталог
              </a>
              <a
                href="#calculator"
                className="px-3 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Калькулятор
              </a>
              <a
                href="#delivery"
                className="px-3 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Доставка и оплата
              </a>
              <a
                href="#faq"
                className="px-3 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Вопрос-ответ
              </a>
              <a
                href="#contacts"
                className="px-3 py-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                Контакты
              </a>
            </nav>

            {/* Контакты и кнопка на десктопе */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <a
                  href="tel:+375447022533"
                  className="inline-flex items-center gap-1.5 text-sm lg:text-base font-extrabold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors leading-tight tabular-nums"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span>+375 (44) 702-25-33</span>
                </a>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>Резерв: </span>
                  <a href="tel:+375444571991" className="hover:text-slate-800 dark:hover:text-slate-200 tabular-nums">
                    +375 (44) 457-19-91
                  </a>
                </div>
              </div>

              <button
                onClick={onOpenLeadModal}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                Заказать звонок
              </button>
            </div>

            {/* Мобильная правая колонка: быстрый телефон и кнопка меню */}
            <div className="flex sm:hidden items-center gap-2">
              <a
                href="tel:+375447022533"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow-xs active:scale-95"
                aria-label="Позвонить на склад"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Звонок</span>
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 flex items-center justify-center focus:outline-none"
                aria-label="Открыть меню"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Мобильное выпадающее меню (адаптировано под светлую и темную темы) */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-5 shadow-2xl">
          <div className="space-y-1 mb-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <a
              href="#catalog"
              onClick={closeMobile}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span>Каталог материалов со склада</span>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </a>
            <a
              href="#calculator"
              onClick={closeMobile}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span>Калькулятор расчёта сметы</span>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </a>
            <a
              href="#delivery"
              onClick={closeMobile}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span>Доставка и оплата</span>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </a>
            <a
              href="#faq"
              onClick={closeMobile}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span>Частые вопросы (FAQ)</span>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </a>
            <a
              href="#contacts"
              onClick={closeMobile}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span>Контакты и адреса складов</span>
              <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Склад Орджоникидзе, 349:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{scheduleStatus.statusText}</span>
            </div>

            <a
              href="tel:+375447022533"
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-xs tabular-nums"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+375 (44) 702-25-33</span>
              </div>
              <span className="text-[10px] text-amber-500 font-bold uppercase">A1</span>
            </a>

            <button
              onClick={() => {
                closeMobile();
                onOpenLeadModal();
              }}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center cursor-pointer transition-colors"
            >
              Заказать обратный звонок
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
