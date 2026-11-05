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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300">
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
    </div>
  );
}
