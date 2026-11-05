import React from 'react';
import { Phone, Mail, MapPin, Clock, ArrowUp, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 flex-shrink-0 shadow-xs">
                <BrandLogo className="w-full h-full" />
              </div>
              <div>
                <span className="font-extrabold text-white text-base block tracking-tight">
                  ДОМА И КРОВЛИ
                </span>
                <span className="text-[11px] text-amber-500 font-semibold">
                  г. Бобруйск • dom-amk.by
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Оптово-розничный склад кровельных, фасадных и листовых материалов в Бобруйске. Влагостойкая плита ОСБ-3, металлочерепица, ондулин, профильная труба с нарезкой и фасадные системы АМК.
            </p>

            <div className="text-[11px] text-slate-500">
              Работаем с физическими лицами и организациями с полным пакетом документов (с НДС).
            </div>
          </div>

          {/* Col 2: Catalog links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Материалы на складе
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Плиты ОСБ-3 влагостойкие (9, 12, 15, 18, 22 мм)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Металлочерепица Монтеррей и Нордик
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Ондулин Smart (битумный волнистый лист)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Труба профильная (20×20, 40×20, 60×40, 80×80)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Фасадная система АМК (кирпич на сетке)
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-amber-400 transition-colors">
                  Кровельные мембраны Ютавек и пароизоляция
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Addresses */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Адреса в Бобруйске
            </h4>
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-white block">1. Основной склад-магазин:</span>
                <span className="text-slate-300">г. Бобруйск, ул. Орджоникидзе, 349</span>
                <span className="text-slate-500 block text-[11px]">Пн–Сб: 9:00 – 18:00 (Вс: вых.)</span>
              </div>

              <div>
                <span className="font-semibold text-white block">2. Торговый павильон:</span>
                <span className="text-slate-300">г. Бобруйск, рынок «Птичка», ул. Дзержинского, 4 (ряд 10, место 11)</span>
                <span className="text-slate-500 block text-[11px]">Вт–Вс: 9:00 – 15:00 (Пн: вых.)</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contacts & Phone */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Телефоны и заявки
            </h4>
            <div className="space-y-2">
              <a
                href="tel:+375447022533"
                className="flex items-center gap-2 text-base font-bold text-white hover:text-amber-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+375 (44) 702-25-33</span>
              </a>

              <a
                href="tel:+375444571991"
                className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-500" />
                <span>+375 (44) 457-19-91</span>
              </a>

              <a
                href="mailto:max_asmukowich@mail.ru"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors pt-1"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                <span>max_asmukowich@mail.ru</span>
              </a>
            </div>

            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Наверх страницы</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Склад-магазин «Дома и кровли» (dom-amk.by). Все права защищены.</span>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open_admin_panel'))}
              className="text-slate-600 hover:text-slate-400 p-0.5 rounded transition-colors cursor-pointer"
              title="Вход в управление ценами склада"
              aria-label="Вход для администратора"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
          <div>
            Информация на сайте носит справочный характер и не является публичной офертой.
          </div>
        </div>

      </div>
    </footer>
  );
};
