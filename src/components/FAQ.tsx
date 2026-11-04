import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faq';

interface FAQProps {
  onOpenLeadModal: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onOpenLeadModal }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Все');
  const [showAllMobile, setShowAllMobile] = useState<boolean>(false);

  const categories = ['Все', 'ОСБ-3', 'Доставка', 'Металл и трубы', 'Оплата', 'Самовывоз', 'Фасады АМК'];

  const filteredItems = activeCategory === 'Все'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory || (activeCategory === 'ОСБ-3' && item.category.includes('OSB')));

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-8 sm:py-16 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-semibold mb-2 sm:mb-3 border border-amber-200 dark:border-amber-800">
            <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            База знаний покупателя
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 sm:mb-3">
            Часто задаваемые вопросы
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base">
            Ответы на популярные вопросы о толщинах ОСБ-3, нарезке труб, самовывозе и условиях доставки по Бобруйску и району.
          </p>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setShowAllMobile(false);
              }}
              className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Аккордеон */}
        <div className="space-y-2.5 sm:space-y-3.5">
          {filteredItems.map((item, index) => {
            const isOpen = openId === item.id;
            const hideOnMobile = activeCategory === 'Все' && !showAllMobile && index >= 4;

            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
                  hideOnMobile ? 'hidden sm:block' : 'block'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-3.5 sm:p-5 text-left focus:outline-none cursor-pointer"
                >
                  <div className="pr-3">
                    <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md mb-1 border border-amber-100 dark:border-amber-900/50">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <div
                    className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-amber-500 dark:bg-amber-500 text-slate-950 dark:text-slate-950 font-bold' : ''
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-3.5 sm:px-5 pb-4 sm:pb-5 pt-1 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 whitespace-pre-line">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Кнопка "Показать еще вопросы" на мобильных */}
        {activeCategory === 'Все' && !showAllMobile && filteredItems.length > 4 && (
          <div className="mt-3 text-center sm:hidden">
            <button
              onClick={() => setShowAllMobile(true)}
              className="w-full py-2 px-4 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <span>Показать еще вопросы ({filteredItems.length - 4})</span>
              <ChevronDown className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        )}

        {/* Блок консультации */}
        <div className="mt-8 sm:mt-12 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
                Остались вопросы по толщинам или объемам?
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Позвоните на склад или оставьте заявку — кладовщик проконсультирует за 1 минуту
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href="tel:+375447022533"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>+375 (44) 702-25-33</span>
            </a>
            <button
              onClick={onOpenLeadModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Задать вопрос</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
