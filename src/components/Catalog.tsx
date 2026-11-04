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
    { id: 'osb', label: 'OSB-3 (ОСБ)' },
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

  return (
    <section id="catalog" className="py-10 sm:py-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold mb-2.5 border border-slate-200 dark:border-slate-700">
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            Склад в Бобруйске
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2 sm:mb-4">
            Каталог стройматериалов со склада
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base">
            Все позиции в наличии на ул. Орджоникидзе, 349 и рынке «Птичка». Отгрузка от 1 листа или 1 метра трубы.
          </p>
        </div>

        {/* Category Tabs (scrollable chips on mobile) */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-6 sm:mb-10 scrollbar-none">
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? CATALOG_PRODUCTS.length
              : CATALOG_PRODUCTS.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategory === cat.id
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredProducts.map((product) => {
            const isSpecsOpen = expandedSpecsId === product.id;
            const priceInfo = getProductPriceDisplay(product.id);

            return (
              <div
                key={product.id}
                className="group bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative aspect-[16/10] sm:aspect-[4/3] bg-slate-100 dark:bg-slate-900 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                      {product.badge && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[11px] font-black shadow-sm">
                          {product.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-semibold border border-slate-700/50">
                        {product.categoryLabel}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/95 text-white text-[10px] font-bold backdrop-blur-sm shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        В наличии
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors leading-snug">
                        {product.title}
                      </h3>
                    </div>

                    {/* Dynamic Price Badge */}
                    <div className="mb-3 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Актуальная цена склада:</span>
                        <span className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                          {priceInfo.priceText}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 text-right">
                        {priceInfo.subtext}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-3 line-clamp-2 sm:line-clamp-none">
                      {product.shortDesc}
                    </p>

                    {/* Popular Sizes / Variations buttons */}
                    {product.popularDimensions && product.popularDimensions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                          Ходовые размеры:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.popularDimensions.map((dim) => (
                            <button
                              key={dim}
                              onClick={() => handleOrderClick(product, dim)}
                              className="text-[11px] px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 hover:text-amber-900 dark:hover:text-amber-300 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors font-medium text-left cursor-pointer"
                              title={`Выбрать: ${dim}`}
                            >
                              {dim}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Collapsible Specs for Mobile */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => toggleSpecs(product.id)}
                        className="sm:hidden w-full flex items-center justify-between text-slate-500 dark:text-slate-400 py-1 font-semibold"
                      >
                        <span>Характеристики товара</span>
                        {isSpecsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <div className={`space-y-1.5 ${isSpecsOpen ? 'block pt-2' : 'hidden sm:block'}`}>
                        {product.specs.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-[11px] sm:text-xs">
                            <span className="text-slate-400 dark:text-slate-500">{s.label}:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 sm:p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Поставка:</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {product.priceHint}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOrderClick(product)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 hover:bg-amber-500 hover:text-slate-950 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span>Заказать</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Custom request banner */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-0.5">
              Нужна другая толщина или редкий размер?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Быстро привезем под заказ любые кровельные элементы, доборы, крепеж и смеси.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => onOpenLeadModal({ source: 'Запрос редкого материала' })}
              className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer border border-slate-700"
            >
              Узнать наличие
            </button>
            <a
              href="tel:+375447022533"
              className="px-3 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center justify-center"
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
