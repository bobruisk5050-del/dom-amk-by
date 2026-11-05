import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, MapPin, Database, PhoneCall } from 'lucide-react';

const STORAGE_KEY = 'dom_amk_cookie_consent';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const consented = localStorage.getItem(STORAGE_KEY);
      if (!consented) {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // Игнорируем в приватных режимах
    }
  }, []);

  // Закрытие модального окна подробностей по Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Игнорируем
    }
    setIsVisible(false);
    setIsModalOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Компактная плашка внизу экрана */}
      <aside
        aria-label="Уведомление о cookie"
        className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 z-40 sm:max-w-lg bg-slate-900/95 text-slate-200 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 sm:py-2.5 sm:px-4 shadow-2xl text-xs transition-all animate-in slide-in-from-bottom duration-300"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="text-[11px] sm:text-xs text-slate-300 leading-snug">
              <span>Используем cookie и данные для работы сайта и расчета доставки. </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer inline"
              >
                Подробнее
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              type="button"
              onClick={handleAccept}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Принять
            </button>
            <button
              type="button"
              onClick={handleAccept}
              className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Закрыть уведомление"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Окно подробностей по Закону РБ № 99-З */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer select-none"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[90vh] overflow-y-auto cursor-default select-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Закрыть"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Шапка */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Обработка персональных данных и cookie
                </h3>
                <p className="text-xs text-slate-400">
                  В соответствии с Законом Республики Беларусь № 99-З «О защите персональных данных»
                </p>
              </div>
            </div>

            {/* Основной текст */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  <span>Какие данные собираются сайтом:</span>
                </div>
                <ul className="space-y-2 pl-1 text-[11px] sm:text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <div>
                      <b className="text-white">Технические файлы cookie:</b> необходимы для запоминания выбранных товаров в калькуляторе, оформления заказа и сохранения выбранной темы оформления (светлая/тёмная).
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <div>
                      <b className="text-white">IP-адрес (геолокация):</b> используется исключительно для ориентировочного определения города (Бобруйск, Кировск, Осиповичи, Глуск) с целью предварительного расчёта доставки строительных материалов.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <div>
                      <b className="text-white">Имя и номер телефона:</b> обрабатываются исключительно при добровольной отправке форм («Заказать звонок», «Заявка на расчёт») для обратной связи менеджера склада с вами по заказу.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Гарантия конфиденциальности:</span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-300">
                  Мы <b>не передаём</b> ваши персональные данные сторонним рекламным сервисам или третьим лицам. Доступ к информации имеют только сотрудники склада «Дома и кровли» в Бобруйске для выполнения обязательств по поставке стройматериалов.
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-slate-400 text-[11px]">
                <div className="text-slate-300 font-semibold">Управление файлами cookie:</div>
                <p>
                  Вы можете в любой момент изменить настройки или заблокировать файлы cookie в меню вашего интернет-браузера.
                </p>
              </div>
            </div>

            {/* Кнопка закрытия / согласия */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleAccept}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg"
              >
                Понятно, я согласен
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
