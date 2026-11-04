import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faq';

interface FAQProps {
  onOpenLeadModal: () => void;
}

export const FAQ: React.FC<FAQProps> = ({ onOpenLeadModal }) => {
  const [openId, setOpenId] = useState<string | null>('osb-thickness');
  const [activeCategory, setActiveCategory] = useState<string>('Все');

  const categories = ['Все', 'OSB-3 (ОСБ)', 'Доставка', 'Металл и трубы', 'Оплата', 'Самовывоз', 'Фасады АМК'];

  const filteredItems = activeCategory === 'Все'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-12 sm:py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 text-xs sm:text-sm font-semibold mb-3 border border-amber-200 dark:border-amber-800">
            <HelpCircle className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            База знаний покупателя
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 sm:mb-4">
            Часто задаваемые вопросы
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base">
            Собрали понятные ответы на популярные вопросы о толщинах OSB-3 (ОСБ), нарезке труб, самовывозе и условиях доставки по Бобруйску и району.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                >
                  <div className="pr-4">
                    <span className="inline-block text-[11px] font-semibold tracking-wider uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md mb-1.5 border border-amber-100 dark:border-amber-900/50">
                      {item.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-amber-500 dark:bg-amber-500 text-slate-950 dark:text-slate-950 font-bold' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800 whitespace-pre-line">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions block */}
        <div className="mt-12 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Остались вопросы по толщинам или объемам?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Позвоните на склад или оставьте заявку — кладовщик проконсультирует за 1 минуту
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href="tel:+375447022533"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors border border-slate-700"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>+375 (44) 702-25-33</span>
            </a>
            <button
              onClick={onOpenLeadModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Задать вопрос</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
