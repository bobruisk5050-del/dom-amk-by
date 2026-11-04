import React, { useState, useEffect } from 'react';
import { X, Lock, CheckCircle2, AlertCircle, Save, RotateCcw, Download, Trash2, Send, DollarSign, MessageSquare, KeyRound, LogOut, ShieldAlert } from 'lucide-react';
import { getWarehouseSettings, saveWarehouseSettings, resetWarehouseSettings, WarehouseSettings } from '../utils/pricesStore';
import { getTelegramConfig, saveTelegramConfig, sendLeadToTelegram } from '../services/telegram';
import { verifyPinSecure, saveNewPinSecure, saveNewBackupPinSecure, resetSecurityToDefaults } from '../utils/security';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<'prices' | 'leads' | 'telegram' | 'security'>('prices');
  const [settings, setSettings] = useState<WarehouseSettings>(() => getWarehouseSettings());
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Telegram
  const [tgToken, setTgToken] = useState(() => getTelegramConfig().token);
  const [tgChatId, setTgChatId] = useState(() => getTelegramConfig().chatId);
  const [tgTesting, setTgTesting] = useState(false);
  const [tgResult, setTgResult] = useState<{ success: boolean; message: string } | null>(null);

  // Leads
  const [leads, setLeads] = useState<any[]>([]);

  // Security / PIN
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [newBackupPinInput, setNewBackupPinInput] = useState('');
  const [pinChangeStatus, setPinChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const initDrafts = (s: WarehouseSettings) => {
    const drafts: Record<string, string> = {
      osb9: String(s.osb9),
      osb12: String(s.osb12),
      osb15: String(s.osb15),
      osb18: String(s.osb18),
      osb22: String(s.osb22),
      metalTile: String(s.metalTile),
      onduline: String(s.onduline),
      profnastil: String(s.profnastil),
      amkFacade: String(s.amkFacade),
      pipe20x20: String(s.pipe20x20),
      pipe40x20: String(s.pipe40x20),
      pipe60x40: String(s.pipe60x40),
      membraneRoll: String(s.membraneRoll),
      drainageSystem: String(s.drainageSystem),
    };
    setPriceDrafts(drafts);
  };

  // Закрытие по нажатию клавиши Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // При каждом открытии панели всегда требуем ввод PIN-кода
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setPinInput('');
      setPinError(false);
      setPinChangeStatus(null);
      loadLeads();
      const currentSettings = getWarehouseSettings();
      setSettings(currentSettings);
      initDrafts(currentSettings);
      setTgToken(getTelegramConfig().token);
      setTgChatId(getTelegramConfig().chatId);
      setNewBackupPinInput('');
    } else {
      setIsAuthenticated(false);
      setPinInput('');
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

  const handleClose = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setPinError(false);
    onClose();
  };

  if (!isOpen) return null;

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPinError(false);
    try {
      const isValid = await verifyPinSecure(pinInput);
      if (isValid) {
        setIsAuthenticated(true);
        setPinError(false);
        setPinInput('');
      } else {
        setPinError(true);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput('');
    setPinError(false);
  };

  const handlePriceChange = (field: string, rawVal: string) => {
    // Преобразуем запятую в точку для клавиатур смартфонов
    const sanitized = rawVal.replace(',', '.');
    // Разрешаем пустую строку (стирание), цифры и максимум одну точку
    if (sanitized === '' || /^[0-9]*\.?[0-9]*$/.test(sanitized)) {
      setPriceDrafts((prev) => ({ ...prev, [field]: sanitized }));
    }
  };

  const handlePriceClear = (field: string) => {
    setPriceDrafts((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: WarehouseSettings = { ...settings };

    const numericKeys: Array<keyof WarehouseSettings> = [
      'osb9', 'osb12', 'osb15', 'osb18', 'osb22',
      'metalTile', 'onduline', 'profnastil', 'amkFacade',
      'pipe20x20', 'pipe40x20', 'pipe60x40',
      'membraneRoll', 'drainageSystem'
    ];

    numericKeys.forEach((key) => {
      const raw = priceDrafts[key as string];
      if (raw !== undefined && raw !== '') {
        const parsed = parseFloat(raw);
        if (!isNaN(parsed) && parsed >= 0) {
          (updated as any)[key] = Number(parsed.toFixed(2));
        }
      }
    });

    setSettings(updated);
    saveWarehouseSettings(updated);
    initDrafts(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetPrices = () => {
    if (confirm('Сбросить все цены к значениям по умолчанию?')) {
      const def = resetWarehouseSettings();
      setSettings(def);
      initDrafts(def);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isCurrentValid = await verifyPinSecure(currentPinInput);
    if (!isCurrentValid) {
      setPinChangeStatus({ type: 'error', message: 'Текущий PIN-код указан неверно' });
      return;
    }
    if (newPinInput.trim().length < 4 || newPinInput.trim().length > 12) {
      setPinChangeStatus({ type: 'error', message: 'Новый PIN должен содержать от 4 до 12 символов' });
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeStatus({ type: 'error', message: 'Новый PIN и подтверждение не совпадают' });
      return;
    }

    const success = await saveNewPinSecure(newPinInput.trim());
    if (success) {
      setPinChangeStatus({ type: 'success', message: 'Новый PIN-код зашифрован (SHA-256) и сохранен!' });
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
    } else {
      setPinChangeStatus({ type: 'error', message: 'Не удалось сохранить PIN' });
    }
  };

  const handleSaveBackupPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBackupPinInput.trim().length < 4) {
      setPinChangeStatus({ type: 'error', message: 'Резервный код должен быть от 4 до 12 знаков' });
      return;
    }
    const ok = await saveNewBackupPinSecure(newBackupPinInput.trim());
    if (ok) {
      setPinChangeStatus({ type: 'success', message: 'Новый резервный код зашифрован (SHA-256) и обновлен!' });
      setNewBackupPinInput('');
    } else {
      setPinChangeStatus({ type: 'error', message: 'Ошибка при сохранении резервного кода' });
    }
  };

  const handleResetToDefaultPin = () => {
    if (confirm('Сбросить авторизацию к исходным настройкам?')) {
      resetSecurityToDefaults();
      setPinChangeStatus({ type: 'success', message: 'Настройки доступа сброшены к начальным' });
    }
  };

  const handleSaveTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    saveTelegramConfig(tgToken, tgChatId);
    setTgTesting(true);
    setTgResult(null);

    try {
      const res = await sendLeadToTelegram({
        name: 'Проверка настроек склада',
        phone: '+375 (44) 702-25-33',
        material: 'Тестовый запрос',
        comment: 'Бот подключен успешно',
        source: 'Панель управления',
      });

      if (res.success && !res.isSimulated) {
        setTgResult({
          success: true,
          message: 'Тестовое сообщение доставлено в Telegram!',
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
      alert('Пока нет сохраненных заявок.');
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
    if (confirm('Очистить журнал заявок на этом устройстве?')) {
      localStorage.removeItem('dom_amk_lead_history');
      setLeads([]);
    }
  };

  // Рендер карточки для поля ввода цены
  const renderPriceCard = (
    label: string,
    fieldKey: string,
    unitBadge: string,
    hint?: string
  ) => {
    const val = priceDrafts[fieldKey] ?? '';
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <label className="text-xs font-semibold text-slate-200 truncate" title={label}>
            {label}
          </label>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/20 whitespace-nowrap flex-shrink-0">
            {unitBadge}
          </span>
        </div>

        <div className="relative flex items-center">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={val}
            onChange={(e) => handlePriceChange(fieldKey, e.target.value)}
            className="w-full pl-3 pr-16 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500 transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            {val !== '' && (
              <button
                type="button"
                onClick={() => handlePriceClear(fieldKey)}
                className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Очистить поле"
                aria-label="Очистить поле"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <span className="text-xs font-bold text-slate-400 select-none">
              BYN
            </span>
          </div>
        </div>
        {hint && <span className="text-[10px] text-slate-500 mt-1">{hint}</span>}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in cursor-pointer select-none"
      onClick={handleClose}
    >
      <div
        className={`relative w-full ${
          !isAuthenticated ? 'max-w-md' : 'max-w-4xl'
        } bg-slate-900 border border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl text-white max-h-[92vh] overflow-y-auto cursor-default select-text transition-all duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Закрыть панель"
          title="Закрыть"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Экран ввода PIN */}
        {!isAuthenticated ? (
          <div className="py-4 sm:py-6 max-w-sm mx-auto text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Вход в панель управления</h3>
              <p className="text-xs text-slate-400 mt-1">
                Склад «Дома и кровли» в Бобруйске
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-3 pt-1">
              <input
                type="password"
                maxLength={12}
                autoFocus
                placeholder="Введите PIN-код"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full text-center px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-base tracking-widest focus:outline-none focus:border-amber-500 transition-colors"
              />

              {pinError && (
                <div className="text-xs text-rose-400 flex items-center justify-center gap-1.5 py-1">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Неверный код доступа</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer disabled:opacity-50 shadow-lg"
              >
                {isVerifying ? 'Проверка...' : 'Войти в панель'}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                Отмена (закрыть)
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Шапка админки */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 pr-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Управление складом
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  Панель цен и заявок
                </h3>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                title="Заблокировать панель"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>

            {/* Вкладки */}
            <div className="flex border-b border-slate-800 gap-1 sm:gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTab('prices')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'prices'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Цены товаров</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'leads'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Заявки ({leads.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('telegram')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'telegram'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Telegram-бот</span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-amber-500 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Безопасность</span>
              </button>
            </div>

            {/* Вкладка 1: Цены склада */}
            {activeTab === 'prices' && (
              <form onSubmit={handleSavePrices} className="space-y-5">
                {saveSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span>Цены успешно обновлены на сайте!</span>
                  </div>
                )}

                {/* 1. Плиты OSB-3 */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      1. Плиты ОСБ-3 влагостойкие (2500×1250 мм)
                    </h4>
                    <span className="text-[11px] text-slate-400">Цена за 1 лист</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                    {renderPriceCard('ОСБ-3 9 мм', 'osb9', 'лист')}
                    {renderPriceCard('ОСБ-3 12 мм', 'osb12', 'лист')}
                    {renderPriceCard('ОСБ-3 15 мм', 'osb15', 'лист')}
                    {renderPriceCard('ОСБ-3 18 мм', 'osb18', 'лист')}
                    {renderPriceCard('ОСБ-3 22 мм', 'osb22', 'лист')}
                  </div>
                </div>

                {/* 2. Кровля и фасад */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      2. Кровля, профнастил и фасадные системы
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {renderPriceCard('Металлочерепица', 'metalTile', 'за м²')}
                    {renderPriceCard('Ондулин Smart', 'onduline', 'за лист')}
                    {renderPriceCard('Профнастил С-8/МП-20', 'profnastil', 'за м²')}
                    {renderPriceCard('Фасад АМК на сетке', 'amkFacade', 'за м²')}
                  </div>
                </div>

                {/* 3. Профильная труба */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      3. Труба профильная стальная
                    </h4>
                    <span className="text-[11px] text-slate-400">Цена за 1 метр</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {renderPriceCard('Труба 20×20', 'pipe20x20', 'за пог. м')}
                    {renderPriceCard('Труба 40×20', 'pipe40x20', 'за пог. м')}
                    {renderPriceCard('Труба 60×40', 'pipe60x40', 'за пог. м')}
                  </div>
                </div>

                {/* 4. Мембраны и водостоки */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      4. Изоляция и водосточные системы
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {renderPriceCard('Мембрана кровельная', 'membraneRoll', 'рулон 75 м²')}
                    {renderPriceCard('Водосточная система', 'drainageSystem', 'комплект от')}
                  </div>
                </div>

                {/* Закрепленная панель сохранения для удобства на мобильных */}
                <div className="sticky bottom-0 -mx-4 -mb-4 sm:-mx-7 sm:-mb-7 p-3 sm:p-4 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleResetPrices}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Сбросить к исходным</span>
                    <span className="sm:hidden">Сбросить</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg transition-transform active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить цены</span>
                  </button>
                </div>
              </form>
            )}

            {/* Вкладка 2: Журнал заявок */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs text-slate-400">
                    Всего зафиксировано: <b>{leads.length}</b> заявок
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportCSV}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Скачать CSV (Excel)</span>
                    </button>
                    {leads.length > 0 && (
                      <button
                        onClick={handleClearHistory}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Очистить</span>
                      </button>
                    )}
                  </div>
                </div>

                {leads.length === 0 ? (
                  <div className="py-12 text-center text-xs sm:text-sm text-slate-500">
                    Пока нет сохраненных заявок.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                    {leads.map((l, idx) => (
                      <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>{new Date(l.createdAt || Date.now()).toLocaleString('ru-RU')}</span>
                          {l.clientCity && (
                            <span className="text-amber-400 font-medium">📍 {l.clientCity}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-white font-bold text-sm">
                          <span>{l.name || 'Клиент'}</span>
                          <span className="text-amber-400 font-mono">{l.phone}</span>
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
                          <div className="text-slate-400 text-[11px] leading-relaxed">
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
              <form onSubmit={handleSaveTelegram} className="space-y-4 max-w-lg">
                <div className="text-xs text-slate-300 leading-relaxed">
                  Настройки Telegram-бота для мгновенного получения заявок со склада.
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
                    Bot Token:
                  </label>
                  <input
                    type="password"
                    required
                    value={tgToken}
                    onChange={(e) => setTgToken(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={tgTesting}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{tgTesting ? 'Отправка...' : 'Проверить и сохранить Telegram'}</span>
                </button>
              </form>
            )}

            {/* Вкладка 4: Безопасность и PIN */}
            {activeTab === 'security' && (
              <div className="space-y-6 max-w-lg">
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

                {/* Основной PIN */}
                <form onSubmit={handleChangePin} className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-amber-400">
                    <KeyRound className="w-4 h-4" />
                    <span>Смена основного PIN-кода (SHA-256)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Пароль сохраняется только в виде необратимого криптографического хеша. В коде и через F12 DevTools его невозможно подсмотреть.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Текущий PIN-код (или резервный):
                    </label>
                    <input
                      type="password"
                      maxLength={12}
                      required
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Новый PIN-код:
                    </label>
                    <input
                      type="password"
                      maxLength={12}
                      required
                      placeholder="От 4 до 12 символов"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Повторите новый PIN-код:
                    </label>
                    <input
                      type="password"
                      maxLength={12}
                      required
                      placeholder="Повтор нового кода"
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                  >
                    Зашифровать и сохранить новый PIN
                  </button>
                </form>

                {/* Резервный код */}
                <form onSubmit={handleSaveBackupPin} className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    <span>Смена резервного кода восстановления</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Резервный код позволяет войти, если основной PIN забыт. Также сохраняется в виде хеша.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Новый резервный код:
                    </label>
                    <input
                      type="password"
                      maxLength={12}
                      required
                      placeholder="Введите новый резервный код"
                      value={newBackupPinInput}
                      onChange={(e) => setNewBackupPinInput(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleResetToDefaultPin}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Сброс настроек
                    </button>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                    >
                      Сохранить резервный
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
