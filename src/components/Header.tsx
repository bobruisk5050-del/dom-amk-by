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
    // Проверка статуса работы склада каждую минуту
    const interval = setInterval(() => {
      setScheduleStatus(getWarehouseStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-300">
      {/* Верхняя информационная полоса со статусом работы склада */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>г. Бобруйск, ул. Орджоникидзе, 349 • рынок «Птичка»</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
              <span className={`w-2 h-2 rounded-full ${scheduleStatus.dotColor} animate-pulse`} />
              <span className={scheduleStatus.isOpen ? 'text-emerald-400' : 'text-amber-300'}>
                {scheduleStatus.statusText}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Основная панель навигации */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Логотип компании */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center p-1.5 sm:p-2 shadow-xs group-hover:border-amber-500/50 transition-all flex-shrink-0">
              <BrandLogo className="w-full h-full" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors leading-none mb-1">
                ДОМА И КРОВЛИ
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 leading-none">
                <span>Склад стройматериалов</span>
                <span className="w-1 h-1 rounded-full bg-slate-400" />
                <span className="text-slate-600 dark:text-slate-300 font-semibold">Бобруйск</span>
              </div>
            </div>
          </a>

          {/* Навигация для десктопа */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-xs">
            <a
              href="#catalog"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition-all"
            >
              Каталог
            </a>
            <a
              href="#calculator"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition-all"
            >
              Калькулятор
            </a>
            <a
              href="#delivery"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition-all"
            >
              Доставка и оплата
            </a>
            <a
              href="#faq"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition-all"
            >
              Вопрос-ответ
            </a>
            <a
              href="#contacts"
              className="px-3.5 py-1.5 rounded-full hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 hover:shadow-xs transition-all"
            >
              Контакты
            </a>
          </nav>

          {/* Блок контактов и звонка */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <a
                href="tel:+375447022533"
                className="inline-flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-slate-900 dark:text-white hover:text-amber-500 transition-colors leading-tight"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+375 (44) 702-25-33</span>
              </a>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>Резерв: </span>
                <a href="tel:+375444571991" className="hover:text-slate-800 dark:hover:text-slate-200">
                  +375 (44) 457-19-91
                </a>
              </div>
            </div>

            <button
              onClick={onOpenLeadModal}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-slate-800 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              Заказать звонок
            </button>
          </div>

          {/* Мобильные кнопки справа */}
          <div className="flex sm:hidden items-center gap-2">
            <a
              href="tel:+375447022533"
              className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs"
              title="Позвонить на склад"
              aria-label="Позвонить"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-800 focus:outline-none"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Выпадающее меню для мобильных телефонов */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-5 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-0.5 mb-4 text-sm font-bold text-slate-900 dark:text-white">
            <a
              href="#catalog"
              onClick={closeMobile}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <span>Каталог материалов</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#calculator"
              onClick={closeMobile}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <span>Калькулятор сметы</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#delivery"
              onClick={closeMobile}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <span>Доставка и оплата</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#faq"
              onClick={closeMobile}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <span>Частые вопросы (FAQ)</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
            <a
              href="#contacts"
              onClick={closeMobile}
              className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              <span>Контакты и склад</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </a>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5">
            <a
              href="tel:+375447022533"
              className="flex items-center justify-between py-2 px-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-sm"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+375 (44) 702-25-33</span>
              </div>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">Звонок</span>
            </a>

            <button
              onClick={() => {
                closeMobile();
                onOpenLeadModal();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider text-center cursor-pointer"
            >
              Заказать обратный звонок
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
