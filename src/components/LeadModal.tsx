import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Phone, AlertCircle } from 'lucide-react';
import { LeadPayload, sendLeadToTelegram } from '../services/telegram';
import {
  formatLocalBelarusDigits,
  validateLocalBelarusDigits,
  containsProfanity,
  isGibberish,
  isTelegramBotSpam,
  checkRateLimit,
  recordSubmitTimestamp,
} from '../utils/validation';
import { checkNightMode } from '../utils/workingHours';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<LeadPayload>;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, initialData }) => {
  const [name, setName] = useState('');
  const [localPhone, setLocalPhone] = useState('');
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; previewText?: string } | null>(null);

  const [nightInfo, setNightInfo] = useState(() => checkNightMode());
  const [preferredCallTime, setPreferredCallTime] = useState(() => checkNightMode().isNight ? checkNightMode().defaultCallTime : '');
  const [customCallTime, setCustomCallTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(() => checkNightMode().isNight);

  useEffect(() => {
    if (isOpen) {
      setMaterial(initialData?.material || '');
      setQuantity(initialData?.quantity || '');
      setDeliveryAddress(initialData?.deliveryAddress || '');
      setLocalPhone('');
      setErrorMessage(null);
      setSubmitResult(null);
      const currentNight = checkNightMode();
      setNightInfo(currentNight);
      setShowTimePicker(currentNight.isNight);
      setPreferredCallTime(currentNight.isNight ? currentNight.defaultCallTime : '');
      setCustomCallTime('');
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLocalBelarusDigits(e.target.value);
    setLocalPhone(formatted);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Check rate limit (60s)
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setErrorMessage(`Вы недавно отправили заявку. Пожалуйста, подождите еще ${rateCheck.waitSeconds} сек.`);
      return;
    }

    // 2. Validate phone number
    const phoneVal = validateLocalBelarusDigits(localPhone);
    if (!phoneVal.isValid || !phoneVal.fullPhone) {
      setErrorMessage(phoneVal.errorMessage || 'Укажите действующий номер Беларуси: код (29, 44, 33, 25) и 7 цифр');
      return;
    }

    // 3. Profanity & Gibberish spam filter
    if (name && (containsProfanity(name) || isGibberish(name))) {
      setErrorMessage('Пожалуйста, укажите корректное имя для обращения (без бессмысленного набора букв).');
      return;
    }
    if (deliveryAddress && (containsProfanity(deliveryAddress) || isGibberish(deliveryAddress))) {
      setErrorMessage('Пожалуйста, укажите реальный адрес доставки или самовывоз.');
      return;
    }
    if (material && (containsProfanity(material) || isGibberish(material))) {
      setErrorMessage('Пожалуйста, укажите понятное наименование материала.');
      return;
    }
    if (isTelegramBotSpam(`${name} ${material} ${deliveryAddress}`)) {
      setErrorMessage('Заявка содержит недопустимый спам или ссылки.');
      return;
    }

    const finalCallTime = customCallTime.trim() || preferredCallTime.trim();

    setIsSubmitting(true);
    try {
      const res = await sendLeadToTelegram({
        name: name.trim(),
        phone: phoneVal.fullPhone,
        material: material.trim() || 'Быстрый заказ с сайта',
        quantity: quantity.trim() || undefined,
        deliveryAddress: deliveryAddress.trim() || undefined,
        preferredCallTime: finalCallTime || undefined,
        source: initialData?.source || 'Всплывающее окно быстрого заказа',
      });
      recordSubmitTimestamp();

      if (nightInfo.isNight && res.success) {
        setSubmitResult({
          success: true,
          message: `Заявка успешно принята! Сейчас склад закрыт (нерабочее время). Менеджер свяжется с вами ${finalCallTime || nightInfo.defaultCallTime}.`,
        });
      } else {
        setSubmitResult(res);
      }
    } catch (err) {
      console.error(err);
      setSubmitResult({
        success: true,
        message: 'Заявка принята! Менеджер свяжется с вами в течение 10–15 минут.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer select-none"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-2xl text-white overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Закрыть окно"
        >
          <X className="w-4 h-4" />
        </button>

        {submitResult ? (
          <div className="text-center py-4 space-y-3">
            {submitResult.success ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">Заявка принята!</h3>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-rose-300">Внимание</h3>
              </>
            )}

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {submitResult.message}
            </p>

            <button
              onClick={() => {
                if (submitResult.success) onClose();
                else setSubmitResult(null);
              }}
              className="mt-4 w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-lg cursor-pointer"
            >
              {submitResult.success ? 'Отлично, понятно' : 'Попробовать снова'}
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 pr-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Склад «Дома и кровли» в Бобруйске
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                Быстрый заказ со склада
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {nightInfo.isNight
                  ? `Склад сейчас закрыт (нерабочее время). Заявку принимаем прямо сейчас — перезвоним ${nightInfo.nextOpenDayText} утром.`
                  : 'Оставьте контактный номер — дежурный специалист перезвонит за 5–10 минут.'}
              </p>
            </div>

            {/* Статус закрытия склада */}
            {nightInfo.isNight && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
                <span className="text-base leading-none mt-0.5 select-none">🌙</span>
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-amber-400 leading-tight">
                    {nightInfo.title}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    {nightInfo.message}
                  </div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Выбранный материал:
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="ОСБ-3 12мм, ондулин, профильная труба и т.д."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {quantity && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Расчет из калькулятора:
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs focus:outline-none"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Ваше имя:
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    placeholder="Например, Андрей"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Телефон (Беларусь) <span className="text-amber-400">*</span>:
                  </label>
                  
                  {/* Fixed +375 block on the left so backspace is 100% natural */}
                  <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 overflow-hidden focus-within:border-amber-500">
                    <span className="px-2.5 py-2 bg-slate-800/90 text-amber-400 font-bold text-xs border-r border-slate-700 select-none">
                      +375
                    </span>
                    <input
                      type="tel"
                      required
                      value={localPhone}
                      onChange={handlePhoneChange}
                      placeholder="(29) 000-00-00"
                      className="w-full px-2.5 py-2 bg-transparent text-white text-xs sm:text-sm focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Адрес доставки или самовывоз:
                </label>
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Бобруйск (Киселевичи, Даманский, район) или самовывоз"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Ночной режим или выбор времени звонка */}
              {nightInfo.isNight ? (
                <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <span>⏰</span>
                      <span>Во сколько вам удобно принять звонок:</span>
                    </span>
                    <span className="text-[10px] font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">онлайн 24/7</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {nightInfo.timeOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => {
                          setPreferredCallTime(opt);
                          setCustomCallTime('');
                        }}
                        className={`px-2.5 py-2 rounded-xl text-[11px] text-left font-medium transition-colors cursor-pointer border ${
                          preferredCallTime === opt && !customCallTime
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-xs'
                            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="text-[11px] text-amber-400/90 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {showTimePicker ? '− Скрыть время звонка' : '+ Указать удобное время звонка (по желанию)'}
                  </button>
                  {showTimePicker && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-[11px] text-slate-300 font-medium">
                        В какое время вам удобно ответить:
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {nightInfo.timeOptions.map((opt) => (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => {
                              setPreferredCallTime(opt);
                              setCustomCallTime('');
                            }}
                            className={`px-2 py-1.5 rounded-lg text-[11px] text-left transition-colors cursor-pointer border ${
                              preferredCallTime === opt && !customCallTime
                                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Отправляем...' : 'Отправить заявку'}</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <a
                  href="tel:+375447022533"
                  className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Или позвоните: +375 (44) 702-25-33</span>
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
