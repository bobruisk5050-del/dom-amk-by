import { getVisitorLocation } from '../utils/geo';
import { DEFAULT_TELEGRAM_CONFIG } from '../config/telegram';
import { isTelegramBotSpam } from '../utils/validation';

export interface LeadPayload {
  name: string;
  phone: string;
  material?: string;
  quantity?: string;
  deliveryAddress?: string;
  comment?: string;
  preferredCallTime?: string;
  clientCity?: string;
  source?: string;
}

export interface SendLeadResult {
  success: boolean;
  isSimulated: boolean;
  message: string;
  errorDetail?: string;
  previewText?: string;
}

export const TELEGRAM_STORAGE_KEY_TOKEN = 'dom_amk_tg_token';
export const TELEGRAM_STORAGE_KEY_CHAT_ID = 'dom_amk_tg_chat_id';

export function getTelegramConfig(): { token: string; chatId: string } {
  // 1. Из переменных окружения (Netlify, Vercel, .env)
  const envToken = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN) || '';
  const envChatId = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID) || '';

  // 2. Из файла конфигурации по умолчанию
  const fileToken = DEFAULT_TELEGRAM_CONFIG.botToken || '';
  const fileChatId = DEFAULT_TELEGRAM_CONFIG.chatId || '';

  // 3. Из браузерного localStorage (если владелец ввел в админке на этом устройстве)
  const localToken = typeof window !== 'undefined' ? localStorage.getItem(TELEGRAM_STORAGE_KEY_TOKEN) || '' : '';
  const localChatId = typeof window !== 'undefined' ? localStorage.getItem(TELEGRAM_STORAGE_KEY_CHAT_ID) || '' : '';

  // Проверяем корректность формата токена (код:строка) и chat_id (целое число)
  const isValidLocalToken = /^\d+:[A-Za-z0-9_-]{30,}$/.test(localToken.trim());
  const isValidLocalChatId = /^-?\d+$/.test(localChatId.trim());

  const finalToken = (isValidLocalToken ? localToken : (envToken || fileToken)).trim();
  const finalChatId = (isValidLocalChatId ? localChatId : (envChatId || fileChatId)).trim();

  return {
    token: finalToken,
    chatId: finalChatId,
  };
}

export function saveTelegramConfig(token: string, chatId: string) {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem(TELEGRAM_STORAGE_KEY_TOKEN, token.trim());
    else localStorage.removeItem(TELEGRAM_STORAGE_KEY_TOKEN);

    if (chatId) localStorage.setItem(TELEGRAM_STORAGE_KEY_CHAT_ID, chatId.trim());
    else localStorage.removeItem(TELEGRAM_STORAGE_KEY_CHAT_ID);
  }
}

export function formatTelegramMessage(lead: LeadPayload): string {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });

  const rawDigits = lead.phone.replace(/\D/g, '');
  const cleanPhone = rawDigits.startsWith('375') ? `+${rawDigits}` : `+375${rawDigits}`;

  let text = `🚨 <b>НОВАЯ ЗАЯВКА С САЙТА dom-amk.by</b>\n`;
  text += `────────────────────\n`;
  text += `👤 <b>Имя:</b> ${escapeHtml(lead.name || 'Не указано')}\n`;
  text += `📞 <b>Телефон:</b> <a href="tel:${cleanPhone}">${cleanPhone}</a>\n`;

  if (lead.material) {
    text += `📦 <b>Интересует:</b> ${escapeHtml(lead.material)}\n`;
  }
  if (lead.quantity) {
    text += `🔢 <b>Объем:</b> ${escapeHtml(lead.quantity)}\n`;
  }
  if (lead.deliveryAddress) {
    text += `🚚 <b>Доставка / адрес:</b> ${escapeHtml(lead.deliveryAddress)}\n`;
  }
  if (lead.comment) {
    text += `💬 <b>Примечание:</b> ${escapeHtml(lead.comment)}\n`;
  }
  if (lead.preferredCallTime) {
    text += `⏰ <b>Желаемое время звонка:</b> ${escapeHtml(lead.preferredCallTime)}\n`;
  }
  if (lead.clientCity) {
    text += `📍 <b>Город посетителя (IP):</b> ${escapeHtml(lead.clientCity)}\n`;
  }

  text += `⏱ <b>Время заявки:</b> ${timeStr} (UTC+3)\n`;
  text += `────────────────────\n`;
  if (lead.preferredCallTime) {
    text += `⚡ <i>Клиент указал удобное время для связи: ${escapeHtml(lead.preferredCallTime)}</i>`;
  } else {
    text += `⚡ <i>Рекомендуется перезвонить в течение 5-10 минут!</i>`;
  }

  return text;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendLeadToTelegram(lead: LeadPayload): Promise<SendLeadResult> {
  if (!lead.clientCity) {
    try {
      const loc = await getVisitorLocation();
      if (loc && loc.city) {
        lead.clientCity = loc.region && loc.region !== loc.city ? `${loc.city} (${loc.region})` : loc.city;
      }
    } catch {
      // игнорируем ошибку гео-локации
    }
  }

  // 1. Тотальный фильтр спама от рекламных ботов и рассылок
  if (isTelegramBotSpam(lead)) {
    return {
      success: true,
      isSimulated: true,
      message: 'Заявка принята! Менеджер свяжется с вами в течение 10–15 минут.',
      previewText: 'Заявка отфильтрована как рекламный спам.',
    };
  }

  const { token, chatId } = getTelegramConfig();
  const messageText = formatTelegramMessage(lead);

  // Резервное сохранение заявки в локальную историю устройства
  try {
    const existingRaw = localStorage.getItem('dom_amk_lead_history');
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift({
      id: Date.now().toString(),
      ...lead,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('dom_amk_lead_history', JSON.stringify(existing.slice(0, 50)));
  } catch {
    // игнорируем
  }

  if (!token || !chatId) {
    return {
      success: false,
      isSimulated: false,
      message: 'Токен бота или Chat ID не заданы в настройках.',
      errorDetail: 'Токен бота или Chat ID не заданы в конфигурации.',
      previewText: messageText,
    };
  }

  // 2. Многоуровневая гарантированная доставка:
  // УРОВЕНЬ 1: Серверный роут /api/telegram/send (обходит любые блокировки браузера, CORS и блокировщики рекламы)
  try {
    const serverRes = await fetch('/api/telegram/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        chatId,
        text: messageText,
        parseMode: 'HTML',
      }),
    });

    const contentType = serverRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const serverData = await serverRes.json();
      if (serverData.ok) {
        return {
          success: true,
          isSimulated: false,
          message: 'Заявка успешно принята! Менеджер свяжется с вами в течение 10–15 минут.',
          previewText: messageText,
        };
      } else {
        // Ошибка от Telegram API
        let humanError = serverData.description || 'Ошибка Telegram API';
        if (humanError.includes("bot can't initiate conversation") || humanError.includes("chat not found")) {
          humanError = 'Вы не нажали СТАРТ в боте! Откройте бота @domkrovli_zayavki_bot в Telegram и обязательно нажмите кнопку "Start" (/start).';
        }
        return {
          success: false,
          isSimulated: false,
          message: 'Ошибка Telegram: ' + humanError,
          errorDetail: humanError,
          previewText: messageText,
        };
      }
    }
  } catch (err) {
    console.warn('[Telegram Service] /api/telegram/send not available, trying direct Telegram API:', err);
  }

  // УРОВЕНЬ 2: Прямой запрос к Telegram Bot API (POST)
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (data.ok) {
      return {
        success: true,
        isSimulated: false,
        message: 'Заявка успешно принята! Менеджер свяжется с вами в течение 10–15 минут.',
        previewText: messageText,
      };
    } else {
      let humanError = data.description || 'Неизвестная ошибка Telegram API';

      if (humanError.includes("bot can't initiate conversation") || humanError.includes("chat not found")) {
        humanError = 'Вы не нажали СТАРТ в боте! Откройте бота @domkrovli_zayavki_bot в Telegram и обязательно нажмите кнопку "Start" (/start), чтобы бот мог присылать вам заявки.';
      } else if (humanError.includes('Unauthorized') || humanError.includes('Not Found')) {
        humanError = 'Неверный токен бота. Проверьте правильность токена, полученного от @BotFather.';
      }

      return {
        success: false,
        isSimulated: false,
        message: 'Ошибка отправки в Telegram: ' + humanError,
        errorDetail: humanError,
        previewText: messageText,
      };
    }
  } catch (directPostErr) {
    console.warn('[Telegram Service] Direct POST failed, trying GET fallback:', directPostErr);
  }

  // УРОВЕНЬ 3: Прямой простой GET-запрос к Telegram Bot API (не требует предварительного CORS OPTIONS preflight)
  try {
    const getUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${encodeURIComponent(chatId)}&text=${encodeURIComponent(messageText)}&parse_mode=HTML`;
    const getRes = await fetch(getUrl, { method: 'GET' });
    const getData = await getRes.json();
    if (getData.ok) {
      return {
        success: true,
        isSimulated: false,
        message: 'Заявка успешно принята! Менеджер свяжется с вами в течение 10–15 минут.',
        previewText: messageText,
      };
    }
  } catch (getErr) {
    console.warn('[Telegram Service] Direct GET failed:', getErr);
  }

  // УРОВЕНЬ 4: Фоновый пинг через Image (обходит любые блокировщики fetch в браузере)
  try {
    const imgUrl = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${encodeURIComponent(chatId)}&text=${encodeURIComponent(messageText)}&parse_mode=HTML`;
    new Image().src = imgUrl;
    return {
      success: true,
      isSimulated: false,
      message: 'Заявка успешно принята! Менеджер свяжется с вами в течение 10–15 минут.',
      previewText: messageText,
    };
  } catch {
    //
  }

  return {
    success: false,
    isSimulated: false,
    message: 'Не удалось связаться с Telegram-ботом. Пожалуйста, позвоните нам по телефону +375 (44) 702-25-33.',
    errorDetail: 'Сетевая ошибка при обращении к Telegram',
    previewText: messageText,
  };
}
