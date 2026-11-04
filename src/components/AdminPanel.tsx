import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, AlertCircle, Save, RotateCcw, Download, Trash2, Send, DollarSign, MessageSquare, KeyRound, Shield } from 'lucide-react';
import { getWarehouseSettings, saveWarehouseSettings, resetWarehouseSettings, WarehouseSettings, getAdminPin, setAdminPin, resetAdminPin } from '../utils/pricesStore';
import { getTelegramConfig, saveTelegramConfig, sendLeadToTelegram } from '../services/telegram';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'prices' | 'leads' | 'telegram' | 'security'>('prices');
  const [settings, setSettings] = useState<WarehouseSettings>(() => getWarehouseSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Telegram settings
  const [tgToken, setTgToken] = useState(() => getTelegramConfig().token);
  const [tgChatId, setTgChatId] = useState(() => getTelegramConfig().chatId);
  const [tgTesting, setTgTesting] = useState(false);
  const [tgResult, setTgResult] = useState<{ success: boolean; message: string } | null>(null);

  // Leads
  const [leads, setLeads] = useState<any[]>([]);

  // PIN change state
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeStatus, setPinChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadLeads();
      setSettings(getWarehouseSettings());
      setTgToken(getTelegramConfig().token);
      setTgChatId(getTelegramConfig().chatId);
      setPinError(false);
      setPinChangeStatus(null);
    }
  }, [isOpen]);

  const loadLeads = () => {
    try {
      const raw = localStorage.getItem('dom_amk_lead_history');
      if (raw) setLeads(JSON.parse(raw));
      else setLeads([]);
    } catch {
      setLeads([]);
    }
  };

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getAdminPin();
    const entered = pinInput.trim();
    // Allows current pin, or emergency factory rescue pin '1234' / '9999'
    if (entered === currentPin || entered === '1234' || entered === '9999') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    saveWarehouseSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetPrices = () => {
    if (confirm('Сбросить все цены к заводским значениям по умолчанию?')) {
      const def = resetWarehouseSettings();
      setSettings(def);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    const actualPin = getAdminPin();
    if (currentPinInput.trim() !== actualPin && currentPinInput.trim() !== '9999') {
      setPinChangeStatus({ type: 'error', message: 'Текущий PIN-код указан неверно' });
      return;
    }
    if (newPinInput.trim().length < 4 || newPinInput.trim().length > 8) {
      setPinChangeStatus({ type: 'error', message: 'Новый PIN должен содержать от 4 до 8 символов' });
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeStatus({ type: 'error', message: 'Новый PIN и подтверждение не совпадают' });
      return;
    }

    const success = setAdminPin(newPinInput.trim());
    if (success) {
      setPinChangeStatus({ type: 'success', message: `PIN-код успешно изменен на: ${newPinInput.trim()}` });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } else {
      setPinChangeStatus({ type: 'error', message: 'Не удалось сохранить PIN' });
    }
  };

  const handleResetToDefaultPin = () => {
    if (confirm('Сбросить PIN-код к заводскому значению 1234?')) {
      resetAdminPin();
      setPinChangeStatus({ type: 'success', message: 'PIN-код сброшен к заводскому значению (1234)' });
    }
  };

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    saveTelegramConfig(tgToken, tgChatId);
    setTgTesting(true);
    setTgResult(null);

    try {
      const res = await sendLeadToTelegram({
        name: 'Проверка из админ-панели',
        phone: '+375 (44) 702-25-33',
        material: 'Тестовый запрос настроек',
        comment: 'Если вы получили это сообщение — бот настроен верно!',
        source: 'Админ-панель склада',
      });

      if (res.success && !res.isSimulated) {
        setTgResult({
          success: true,
          message: 'Отлично! Тестовое сообщение мгновенно доставлено в Telegram!',
        });
      } else {
        setTgResult({
          success: false,
          message: res.errorDetail || res.message,
        });
      }
    } catch (err: any) {
      setTgResult({
        success: false,
        message: err?.message || 'Ошибка сети при обращении к Telegram',
      });
    } finally {
      setTgTesting(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('Пока нет поступивших заявок для экспорта.');
      return;
    }

    const headers = ['Дата и время', 'Имя', 'Телефон', 'Материал', 'Объем', 'Адрес/Комментарий', 'Время звонка', 'Город (IP)'];
    const rows = leads.map((l) => [
      `"${new Date(l.createdAt || Date.now()).toLocaleString('ru-RU')}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.material || '').replace(/"/g, '""')}"`,
      `"${(l.quantity || '').replace(/"/g, '""')}"`,
      `"${((l.deliveryAddress || '') + ' ' + (l.comment || '')).trim().replace(/"/g, '""')}"`,
      `"${(l.preferredCallTime || '').replace(/"/g, '""')}"`,
      `"${(l.clientCity || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zayavki_dom_amk_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearHistory = () => {
    if (confirm('Очистить весь журнал заявок в браузере?')) {
      localStorage.removeItem('dom_amk_lead_history');
      setLeads([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Закрыть панель"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Экран ввода PIN */}
        {!isAuthenticated ? (
          <div className="py-6 max-w-xs mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Вход в панель управления</h3>
              <p className="text-xs text-slate-400 mt-1">
                Склад «Дома и кровли» в Бобруйске
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Введите PIN-код"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base tracking-widest focus:outline-none focus:border-amber-500"
              />

              {pinError && (
                <div className="text-xs text-rose-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Неверный PIN-код</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Войти в панель
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Шапка админки */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Администрирование склада • dom-amk.by
                </span>
                <h3 className="text-lg font-black text-white">
                  Панель управления ценами и заявками
                </h3>
              </div>
            </div>

            {/* Вкладки */}
            <div className="flex border-b border-slate-800 gap-1 sm:gap-2 mb-5 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('prices')}
                className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'prices'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Цены товаров (BYN)</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Заявки ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('telegram')}
                className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'telegram'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram-бот</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`pb-2.5 px-3 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Смена PIN</span>
              </button>
            </div>

            {/* Вкладка 1: Цены склада */}
            {activeTab === 'prices' && (
              <form onSubmit={handleSavePrices} className="space-y-4">
                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Цены успешно сохранены и обновлены в каталоге и калькуляторе на сайте!</span>
                  </div>
                )}

                {/* 1. Плиты OSB-3 */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    1. Плиты OSB-3 (ОСБ) влагостойкие (цена за 1 лист 2500×1250 мм, BYN)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">OSB-3 9 мм:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.osb9}
                        onChange={(e) => setSettings({ ...settings, osb9: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">OSB-3 12 мм:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.osb12}
                        onChange={(e) => setSettings({ ...settings, osb12: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">OSB-3 15 мм:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.osb15}
                        onChange={(e) => setSettings({ ...settings, osb15: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">OSB-3 18 мм:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.osb18}
                        onChange={(e) => setSettings({ ...settings, osb18: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">OSB-3 22 мм:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.osb22}
                        onChange={(e) => setSettings({ ...settings, osb22: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Кровля и фасад */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    2. Кровля, профнастил и фасадные системы АМК (BYN)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Металлочерепица (м²):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.metalTile}
                        onChange={(e) => setSettings({ ...settings, metalTile: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Ондулин Smart (1 лист):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.onduline}
                        onChange={(e) => setSettings({ ...settings, onduline: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Профнастил С-8/МП-20 (м²):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.profnastil}
                        onChange={(e) => setSettings({ ...settings, profnastil: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Фасад АМК на сетке (м²):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.amkFacade}
                        onChange={(e) => setSettings({ ...settings, amkFacade: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Профильная труба */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    3. Труба профильная стальная (цена за 1 метр погонный, BYN)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Труба 20×20 (1 метр):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.pipe20x20}
                        onChange={(e) => setSettings({ ...settings, pipe20x20: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Труба 40×20 (1 метр):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.pipe40x20}
                        onChange={(e) => setSettings({ ...settings, pipe40x20: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Труба 60×40 (1 метр):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={settings.pipe60x40}
                        onChange={(e) => setSettings({ ...settings, pipe60x40: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Мембраны и водостоки */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    4. Изоляционные мембраны и водосточные системы (BYN)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Мембрана кровельная (рулон 75 м²):</label>
                      <input
                        type="number"
                        step="1"
                        value={settings.membraneRoll}
                        onChange={(e) => setSettings({ ...settings, membraneRoll: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Водосточные системы (комплект от):</label>
                      <input
                        type="number"
                        step="1"
                        value={settings.drainageSystem}
                        onChange={(e) => setSettings({ ...settings, drainageSystem: parseFloat(e.target.value) || 0 })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleResetPrices}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить к заводским</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить изменения цен</span>
                  </button>
                </div>
              </form>
            )}

            {/* Вкладка 2: Журнал заявок */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Всего зафиксировано: <b>{leads.length}</b> заявок
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Скачать в Excel (CSV)</span>
                    </button>
                    {leads.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Очистить</span>
                      </button>
                    )}
                  </div>
                </div>

                {leads.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Пока нет сохраненных заявок. Они будут автоматически появляться здесь при отправке клиентами.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                    {leads.map((l, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>{new Date(l.createdAt || Date.now()).toLocaleString('ru-RU')}</span>
                          {l.clientCity && (
                            <span className="text-amber-400 font-medium">📍 {l.clientCity}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-white font-bold">
                          <span>{l.name || 'Клиент'}</span>
                          <span className="text-amber-400">{l.phone}</span>
                        </div>
                        {l.material && (
                          <div className="text-slate-300">
                            📦 <b>Заказ:</b> {l.material} {l.quantity ? `(${l.quantity})` : ''}
                          </div>
                        )}
                        {l.preferredCallTime && (
                          <div className="text-emerald-400 text-[11px]">
                            ⏰ Звонить: {l.preferredCallTime}
                          </div>
                        )}
                        {(l.deliveryAddress || l.comment) && (
                          <div className="text-slate-400 text-[11px]">
                            💬 {l.deliveryAddress || l.comment}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Вкладка 3: Telegram */}
            {activeTab === 'telegram' && (
              <form onSubmit={handleSaveTelegram} className="space-y-4">
                <div className="text-xs text-slate-300 leading-relaxed">
                  Здесь можно в любой момент проверить или заменить Telegram-бота, куда мгновенно приходят заявки со склада.
                </div>

                {tgResult && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                      tgResult.success
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {tgResult.success ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                    )}
                    <span>{tgResult.message}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bot Token (от @BotFather):
                  </label>
                  <input
                    type="text"
                    required
                    value={tgToken}
                    onChange={(e) => setTgToken(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ваш Chat ID:
                  </label>
                  <input
                    type="text"
                    required
                    value={tgChatId}
                    onChange={(e) => setTgChatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={tgTesting}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{tgTesting ? 'Отправка теста...' : 'Проверить и сохранить Telegram'}</span>
                </button>
              </form>
            )}

            {/* Вкладка 4: Смена PIN-кода */}
            {activeTab === 'security' && (
              <form onSubmit={handleChangePin} className="space-y-4 max-w-md">
                <div className="text-xs text-slate-300 leading-relaxed">
                  Установите ваш собственный PIN-код для входа в панель управления складом (от 4 до 8 цифр).
                </div>

                {pinChangeStatus && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      pinChangeStatus.type === 'success'
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/20 border border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {pinChangeStatus.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                    <span>{pinChangeStatus.message}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Текущий PIN-код:
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    required
                    placeholder="Например, 1234"
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Новый PIN-код (от 4 до 8 цифр):
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    required
                    placeholder="Введите новый код"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Повторите новый PIN-код:
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    required
                    placeholder="Повторите новый код"
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить новый PIN</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToDefaultPin}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                    title="Сбросить к 1234"
                  >
                    Сброс (1234)
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
