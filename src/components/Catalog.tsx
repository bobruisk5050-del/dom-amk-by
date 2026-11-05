import React, { useState, useEffect } from 'react';
import { CATALOG_PRODUCTS, Product } from '../data/catalog';
import { LeadPayload } from '../services/telegram';
import { getWarehouseSettings, WarehouseSettings } from '../utils/pricesStore';
import { ArrowRight, Tag, Phone, ChevronDown, ChevronUp } from 'lucide-react';

interface CatalogProps {
  onOpenLeadModal: (initialData?: Partial<LeadPayload>) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ onOpenLeadModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSpecsId, setExpandedSpecsId] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState<boolean>(false);
  const [settings, setSettings] = useState<WarehouseSettings>(() => getWarehouseSettings());

  useEffect(() => {
    const handleSettingsUpdated = () => {
      setSettings(getWarehouseSettings());
    };
    window.addEventListener('dom_amk_settings_updated', handleSettingsUpdated);
    return () => window.removeEventListener('dom_amk_settings_updated', handleSettingsUpdated);
  }, []);

  const categories = [
    { id: 'all', label: 'Все' },
    { id: 'osb', label: 'ОСБ-3' },
    { id: 'roofing', label: 'Кровля' },
    { id: 'pipes', label: 'Профтруба' },
    { id: 'facade', label: 'Фасады АМК' },
    { id: 'insulation', label: 'Пленки' },
    { id: 'drainage', label: 'Водостоки' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? CATALOG_PRODUCTS
    : CATALOG_PRODUCTS.filter((p) => p.category === selectedCategory);

  const getProductPriceDisplay = (productId: string): { priceText: string; subtext: string } => {
    switch (productId) {
      case 'osb-3-moisture':
        return {
          priceText: `от ${settings.osb9.toFixed(1)} руб.`,
          subtext: 'за лист 9 мм (со склада)',
        };
      case 'metal-roofing-monterrey':
        return {
          priceText: `от ${settings.metalTile.toFixed(1)} руб.`,
          subtext: 'за м² в размер',
        };
      case 'onduline-smart':
        return {
          priceText: `от ${settings.onduline.toFixed(1)} руб.`,
          subtext: 'за лист Smart 1.95×0.95',
        };
      case 'profile-pipes-steel':
        return {
          priceText: `от ${settings.pipe20x20.toFixed(1)} руб.`,
          subtext: 'за 1 метр (с нарезкой)',
        };
      case 'facade-amk-system':
        return {
          priceText: `от ${settings.amkFacade.toFixed(1)} руб.`,
          subtext: 'за м² (кирпич на сетке)',
        };
      case 'profnastil-c8-mp20':
        return {
          priceText: `от ${settings.profnastil.toFixed(1)} руб.`,
          subtext: 'за м² (С-8 / МП-20)',
        };
      case 'roofing-membranes-films':
        return {
          priceText: `от ${settings.membraneRoll.toFixed(0)} руб.`,
          subtext: 'за рулон 75 м²',
        };
      case 'drainage-systems':
        return {
          priceText: `от ${settings.drainageSystem.toFixed(0)} руб.`,
          subtext: 'за комплект Döcke/Металл',
        };
      default:
        return {
          priceText: 'Прямая цена',
          subtext: 'со склада в Бобруйске',
        };
    }
  };

  const handleOrderClick = (product: Product, dimension?: string) => {
    onOpenLeadModal({
      material: `${product.title}${dimension ? ` — ${dimension}` : ''}`,
      quantity: undefined,
      source: `Каталог: ${product.title}`,
    });
  };

  const toggleSpecs = (id: string) => {
    setExpandedSpecsId((prev) => (prev === id ? null : id));
  };

  // На мобильном телефоне при выборе "Все" по умолчанию показываем первые 4 товара,
  // чтобы страница не растягивалась бесконечно и легко прокручивалась
  const displayedProducts = selectedCategory === 'all' && !showAllMobile
    ? filteredProducts
    : filteredProducts;

  return (
    <section id="catalog" className="py-8 sm:py-16 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Заголовок секции */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2 border border-slate-200 dark:border-slate-700">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            Склад в Бобруйске
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
            Каталог стройматериалов со склада
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base">
            Все позиции в наличии на ул. Орджоникидзе, 349 и рынке «Птичка». Отгрузка от 1 листа или 1 метра трубы.
          </p>
        </div>

        {/* Категории (чистые тактильные табы) */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-6 sm:mb-10 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setShowAllMobile(false);
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {displayedProducts.map((product, index) => {
            const isSpecsOpen = expandedSpecsId === product.id;
            const priceInfo = getProductPriceDisplay(product.id);
            const hideOnMobile = selectedCategory === 'all' && !showAllMobile && index >= 4;

            return (
              <div
                key={product.id}
                className={`group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:border-amber-500/40 transition-all flex flex-col justify-between ${
                  hideOnMobile ? 'hidden sm:flex' : 'flex'
                }`}
              >
                <div>
                  {/* Изображение товара */}
                  <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-950 overflow-hidden">
                    <img
                      src={product.image.startsWith('/') ? `.${product.image}` : product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                      decoding="async"
                    />
                    
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      {product.badge ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-xs">
                          {product.badge}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-200 text-[10px] font-semibold">
                          {product.categoryLabel}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/80 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        В наличии
                      </span>
                    </div>
                  </div>

                  {/* Информация о товаре */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors leading-snug mb-2">
                      {product.title}
                    </h3>

                    {/* Блок цены — чистый, без избыточных обводок */}
                    <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Цена со склада:</span>
                        <span className="text-base sm:text-xl font-black text-amber-500 dark:text-amber-400 tabular-nums">
                          {priceInfo.priceText}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                        {priceInfo.subtext}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed mb-3 line-clamp-2">
                      {product.shortDesc}
                    </p>

                    {/* Размеры */}
                    {product.popularDimensions && product.popularDimensions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Популярные размеры:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.popularDimensions.map((dim) => (
                            <button
                              key={dim}
                              onClick={() => handleOrderClick(product, dim)}
                              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-400 dark:hover:text-slate-950 text-slate-700 dark:text-slate-300 transition-colors font-medium text-left cursor-pointer"
                              title={`Выбрать: ${dim}`}
                            >
                              {dim}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Характеристики */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleSpecs(product.id)}
                        className="sm:hidden w-full flex items-center justify-between text-slate-400 py-1 font-semibold text-xs"
                      >
                        <span>Характеристики</span>
                        {isSpecsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <div className={`space-y-1 ${isSpecsOpen ? 'block pt-2' : 'hidden sm:block'}`}>
                        {product.specs.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-400 text-[11px]">
                            <span>{s.label}:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Низ карточки */}
                <div className="p-4 sm:p-5 pt-0">
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Отгрузка:</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {product.priceHint}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOrderClick(product)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <span>Заказать</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Кнопка "Показать все позиции склада" на мобильных экранах */}
        {selectedCategory === 'all' && !showAllMobile && (
          <div className="mt-4 text-center sm:hidden">
            <button
              onClick={() => setShowAllMobile(true)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <span>Показать еще 4 материала склада</span>
              <ChevronDown className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        )}

        {/* Баннер индивидуального заказа */}
        <div className="mt-6 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div>
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white mb-0.5">
              Нужна другая толщина или редкий размер?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Быстро привезем под заказ любые кровельные элементы, доборы, крепеж и смеси.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onOpenLeadModal({ source: 'Запрос редкого материала' })}
              className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer border border-slate-700"
            >
              Узнать наличие
            </button>
            <a
              href="tel:+375447022533"
              className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center justify-center"
              title="Позвонить"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
