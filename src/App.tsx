import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Catalog } from './components/Catalog';
import { Calculator } from './components/Calculator';
import { DeliveryAndTrust } from './components/DeliveryAndTrust';
import { FAQ } from './components/FAQ';
import { ContactsAndMap } from './components/ContactsAndMap';
import { Footer } from './components/Footer';
import { LeadModal } from './components/LeadModal';
import { AdminPanel } from './components/AdminPanel';
import { CookieBanner } from './components/CookieBanner';
import { ScrollToTop } from './components/ScrollToTop';
import { LeadPayload } from './services/telegram';
import { initAutoTheme } from './utils/theme';
import { Phone, MessageSquare } from 'lucide-react';

export default function App() {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Partial<LeadPayload> | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const cleanupTheme = initAutoTheme();

    if (window.location.hash === '#admin' || window.location.hash === '#telegram') {
      try {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch {
        //
      }
    }

    const handleOpenAdmin = () => setIsAdminOpen(true);
    window.addEventListener('open_admin_panel', handleOpenAdmin);

    // Горячие клавиши Ctrl+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'Ф' || e.key === 'ф')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 5. Определение перехода из Instagram (по UTM-метке или рефереру)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isFromInstagram =
        urlParams.get('utm_source')?.toLowerCase().includes('insta') ||
        urlParams.get('source')?.toLowerCase().includes('insta') ||
        document.referrer.toLowerCase().includes('instagram.com');
      
      if (isFromInstagram) {
        sessionStorage.setItem('dom_amk_traffic_source', 'Instagram (профиль/сторис)');
      }
    } catch {
      // Игнорируем
    }

    return () => {
      cleanupTheme();
      window.removeEventListener('open_admin_panel', handleOpenAdmin);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenLeadModal = (initialData?: Partial<LeadPayload>) => {
    // Если клиент пришел из Instagram, автоматически дополняем источник заявки
    const trafficSource = typeof window !== 'undefined' ? sessionStorage.getItem('dom_amk_traffic_source') : null;
    const enrichedSource = trafficSource
      ? `${initialData?.source || 'Сайт'} [${trafficSource}]`
      : initialData?.source;

    setModalInitialData({
      ...initialData,
      source: enrichedSource,
    });
    setIsLeadModalOpen(true);
  };

  const handleCloseLeadModal = () => {
    setIsLeadModalOpen(false);
    setModalInitialData(undefined);
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#telegram') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 pb-14 sm:pb-0 transition-colors duration-300">
      <Header onOpenLeadModal={() => handleOpenLeadModal({ source: 'Кнопка в шапке сайта' })} />

      <main>
        <Hero onOpenLeadModal={handleOpenLeadModal} />
        <Catalog onOpenLeadModal={handleOpenLeadModal} />
        <Calculator onOpenLeadModal={handleOpenLeadModal} />
        <DeliveryAndTrust />
        <FAQ onOpenLeadModal={() => handleOpenLeadModal({ source: 'Вопрос из FAQ' })} />
        <ContactsAndMap onOpenLeadModal={handleOpenLeadModal} />
      </main>

      <Footer />

      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={handleCloseLeadModal}
        initialData={modalInitialData}
      />

      <AdminPanel isOpen={isAdminOpen} onClose={handleCloseAdmin} />

      <CookieBanner />
      <ScrollToTop />

      {/* Мобильная панель быстрого звонка */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 p-2 sm:hidden shadow-2xl flex items-center gap-1.5">
        <a
          href="tel:+375447022533"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md"
        >
          <Phone className="w-4 h-4" />
          <span>Позвонить</span>
        </a>

        <a
          href="viber://chat?number=%2B375447022533&draft=Здравствуйте!+Интересуют+стройматериалы+со+склада+в+Бобруйске"
          className="px-3 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center flex-shrink-0"
          title="Написать в Viber с готовым вопросом"
        >
          <span>Viber</span>
        </a>

        <button
          onClick={() => handleOpenLeadModal({ source: 'Плавающая мобильная кнопка' })}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <span>Заявка</span>
        </button>
      </div>
    </div>
  );
}
