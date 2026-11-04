import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY = 'dom_amk_cookie_consent';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const consented = localStorage.getItem(STORAGE_KEY);
      if (!consented) {
        // Небольшая задержка перед показом, чтобы не перебивать первую загрузку экрана
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Игнорируем в приватных режимах
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Игнорируем
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Уведомление об обработке данных и cookie"
      className="fixed bottom-16 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-4 z-50 max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-300 dark:border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-800 dark:text-slate-200 text-xs transition-all animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs">
              Защита персональных данных и cookie
            </h4>
            <button
              onClick={handleAccept}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 -mr-1"
              aria-label="Закрыть"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Мы используем файлы cookie и технические данные (включая IP-адрес для предварительного определения города доставки по Бобруйску и району). Номер телефона и имя обрабатываются исключительно для связи по вашему заказу в соответствии с Законом РБ № 99-З «О защите персональных данных».
          </p>

          {showDetails && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <div>• <b>Cookie:</b> сохранение выбранных материалов в калькуляторе и темы оформления.</div>
              <div>• <b>IP-адрес:</b> определение региона (Бобруйск, Кировск, Глуск и др.) для расчета доставки.</div>
              <div>• <b>Контакты:</b> передаются только сотрудникам склада «Дома и кровли» и не передаются третьим лицам.</div>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>{showDetails ? 'Скрыть детали' : 'Подробнее'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={handleAccept}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
            >
              Понятно / Согласен
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
