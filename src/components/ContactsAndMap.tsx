import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { sendLeadToTelegram, LeadPayload } from '../services/telegram';
import { getWarehouseStatus, getPavilionStatus, checkNightMode } from '../utils/workingHours';
import {
  formatLocalBelarusDigits,
  validateLocalBelarusDigits,
  containsProfanity,
  isGibberish,
  isTelegramBotSpam,
  checkRateLimit,
  recordSubmitTimestamp,
} from '../utils/validation';

interface ContactsAndMapProps {
  onOpenLeadModal: (initialData?: Partial<LeadPayload>) => void;
}

export const ContactsAndMap: React.FC<ContactsAndMapProps> = ({ onOpenLeadModal }) => {
  const [name, setName] = useState('');
  const [localPhone, setLocalPhone] = useState('');
  const [material, setMaterial] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; previewText?: string } | null>(null);

  const [whStatus, setWhStatus] = useState(() => getWarehouseStatus());
  const [pavStatus, setPavStatus] = useState(() => getPavilionStatus());

  const [nightInfo, setNightInfo] = useState(() => checkNightMode());
  const [preferredCallTime, setPreferredCallTime] = useState(() => checkNightMode().isNight ? checkNightMode().defaultCallTime : '');
  const [showTimePicker, setShowTimePicker] = useState(() => checkNightMode().isNight);

  useEffect(() => {
    const timer = setInterval(() => {
      setWhStatus(getWarehouseStatus());
      setPavStatus(getPavilionStatus());
      const currentNight = checkNightMode();
      setNightInfo(currentNight);
      if (currentNight.isNight) {
        setShowTimePicker(true);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalPhone(formatLocalBelarusDigits(e.target.value));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Rate limit (60s)
    const rateCheck = checkRateLimit();
    if (!rateCheck.allowed) {
      setErrorMessage(`Пожалуйста, подождите еще ${rateCheck.waitSeconds} сек. перед повторной отправкой.`);
      return;
    }

    // Phone validation
    const phoneVal = validateLocalBelarusDigits(localPhone);
    if (!phoneVal.isValid || !phoneVal.fullPhone) {
      setErrorMessage(phoneVal.errorMessage || 'Укажите действующий номер Беларуси: код (29, 44, 33, 25) и 7 цифр');
      return;
    }

    // Profanity & Gibberish check
    if (name && (containsProfanity(name) || isGibberish(name))) {
      setErrorMessage('Пожалуйста, укажите корректное имя для обращения (без бессмысленного набора букв).');
      return;
    }
    if (material && (containsProfanity(material) || isGibberish(material))) {
      setErrorMessage('Пожалуйста, укажите понятное наименование материалов.');
      return;
    }
    if (comment && (containsProfanity(comment) || isGibberish(comment))) {
      setErrorMessage('Пожалуйста, укажите реальное примечание или адрес доставки.');
      return;
    }
    if (isTelegramBotSpam(`${name} ${material} ${comment}`)) {
      setErrorMessage('Заявка содержит недопустимый спам или ссылки.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await sendLeadToTelegram({
        name: name.trim(),
        phone: phoneVal.fullPhone,
        material: material.trim() || 'Консультация по материалам со склада',
        comment: comment.trim(),
        preferredCallTime: preferredCallTime.trim() || undefined,
        source: 'Форма в контактах на сайте',
      });
      recordSubmitTimestamp();

      if (nightInfo.isNight && res.success) {
        setSubmitResult({
          success: true,
          message: `Заявка успешно принята! Сейчас склад закрыт (нерабочее время). Менеджер свяжется с вами ${preferredCallTime || nightInfo.defaultCallTime}.`,
        });
      } else {
        setSubmitResult(res);
      }

      setName('');
      setLocalPhone('');
      setMaterial('');
      setComment('');
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
    <section id="contacts" className="py-12 sm:py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            Базы и павильоны в Бобруйске
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2 sm:mb-4">
            Контакты, адреса и график работы
          </h2>
          <p className="text-slate-300 text-xs sm:text-base">
            Приглашаем оценить качество материалов вживую или заказывайте по телефону с доставкой в день звонка.
          </p>
        </div>

        {/* 2 Main Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 mb-10 sm:mb-14">
          
          {/* Main Warehouse */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider">
                  Основной склад и база
                </span>
                <span className="text-[11px] font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${whStatus.dotColor} ring-2 ring-emerald-500/20`} />
                  <span className={whStatus.isOpen ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                    {whStatus.isOpen ? 'Сейчас открыт' : 'Сейчас закрыт'}
                  </span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                г. Бобруйск, ул. Орджоникидзе, 349
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                Удобный заезд для грузовых и легковых авто, резка труб в размер, отгрузка паллет OSB-3 и металлочерепицы.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 mb-5">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Режим работы склада:</div>
                    <div>Пн–Сб: 09:00 – 18:00 (Вс: выходной)</div>
                    <div className="text-amber-400 font-medium text-[11px] mt-0.5">{whStatus.statusText}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <a href="tel:+375447022533" className="font-bold text-white hover:text-amber-400 transition-colors text-sm sm:text-base tabular-nums">
                    +375 (44) 702-25-33 (A1)
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/80 flex gap-2">
              <a
                href="https://yandex.ru/maps/?text=Бобруйск+Орджоникидзе+349"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Маршрут в навигаторе</span>
              </a>
            </div>
          </div>

          {/* Pavilion on Market */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 sm:p-7 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-slate-700 text-slate-200 font-bold text-[11px] uppercase tracking-wider">
                  Торговая точка (рынок)
                </span>
                <span className="text-[11px] font-semibold flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${pavStatus.dotColor} ring-2 ring-emerald-500/20`} />
                  <span className={pavStatus.isOpen ? 'text-emerald-400 font-medium' : 'text-slate-400 font-medium'}>
                    {pavStatus.isOpen ? 'Сейчас открыт' : 'Сейчас закрыт'}
                  </span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5">
                Рынок «Птичка», ул. Дзержинского, 4
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-4">
                <b>Ряд 10, место 11</b>. Выставочные стенды фасадов АМК под кирпич, образцы металлочерепицы, сайдинга, софитов и водостоков.
              </p>

              <div className="space-y-2.5 text-xs text-slate-300 mb-5">
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Режим работы павильона:</div>
                    <div>Вт–Вс: 09:00 – 15:00 (Пн: выходной рынка)</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">{pavStatus.statusText}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <a href="tel:+375444571991" className="font-bold text-white hover:text-amber-400 transition-colors text-sm sm:text-base">
                    +375 (44) 457-19-91 (A1)
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/80 flex gap-2">
              <a
                href="https://yandex.ru/maps/?text=Бобруйск+рынок+Птичка+Дзержинского+4"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Маршрут к «Птичке»</span>
              </a>
            </div>
          </div>

        </div>

        {/* Lead Capture Form */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Моментальный расчет
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Оставьте заявку на точный расчет стоимости
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Перезвоним за 5–10 минут, назовем цену со склада с доставкой до вашего объекта в Бобруйске или районе.
              </p>

              <div className="pt-1 flex items-center gap-2 text-xs text-slate-300">
                <span className="text-slate-400">Мессенджеры:</span>
                <a
                  href="viber://chat?number=%2B375447022533"
                  className="px-2.5 py-1 rounded bg-purple-600/30 text-purple-300 hover:bg-purple-600/50 text-[11px] font-semibold border border-purple-500/40 cursor-pointer"
                >
                  Viber
                </a>
                <a
                  href="https://t.me/+375447022533"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-sky-600/30 text-sky-300 hover:bg-sky-600/50 text-[11px] font-semibold border border-sky-500/40 cursor-pointer"
                >
                  Telegram
                </a>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 p-4 sm:p-6 rounded-2xl">
              {submitResult ? (
                <div className="text-center py-4 space-y-3">
                  {submitResult.success ? (
                    <>
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-white">Заявка принята!</h4>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-rose-300">Не удалось отправить заявку</h4>
                    </>
                  )}

                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    {submitResult.message}
                  </p>

                  <button
                    onClick={() => setSubmitResult(null)}
                    className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Попробовать снова
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {nightInfo.isNight && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
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
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Ваше имя:
                      </label>
                      <input
                        type="text"
                        maxLength={40}
                        placeholder="Например, Александр"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Телефон (Беларусь) <span className="text-amber-400">*</span>:
                      </label>
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
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Что требуется (материал и объем):
                    </label>
                    <input
                      type="text"
                      maxLength={120}
                      placeholder="Например: 35 листов ОСБ-3 12мм + 60 метров профильной трубы 40х20"
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-300 mb-1">
                      Куда доставка / примечание:
                    </label>
                    <input
                      type="text"
                      maxLength={100}
                      placeholder="Бобруйск (Киселевичи, Даманский или район)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
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
                            onClick={() => setPreferredCallTime(opt)}
                            className={`px-2.5 py-2 rounded-xl text-[11px] text-left font-medium transition-colors cursor-pointer border ${
                              preferredCallTime === opt
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
                                onClick={() => setPreferredCallTime(opt)}
                                className={`px-2 py-1.5 rounded-lg text-[11px] text-left transition-colors cursor-pointer border ${
                                  preferredCallTime === opt
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Отправка...' : 'Отправить заявку менеджеру'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
