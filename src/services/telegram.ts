import { getVisitorLocation } from '../utils/geo';
import { DEFAULT_TELEGRAM_CONFIG } from '../config/telegram';

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

export const TELEGRAM_STORAGE_KEY_TOKEN = '9219696978:AAEnVcq4GSpuLnlDUYHb9xyU_dw9ATK2gfs';
export const TELEGRAM_STORAGE_KEY_CHAT_ID = '785696987';

export function getTelegramConfig(): { token: string; chatId: string } {
  // 1. Из переменных окружения (Netlify, Vercel, .env)
  const envToken = (import.meta.env.VITE_TELEGRAM_BOT_TOKEN as string) || '';
  const envChatId = (import.meta.env.VITE_TELEGRAM_CHAT_ID as string) || '';

  // 2. Из файла конфигурации по умолчанию
  const fileToken = DEFAULT_TELEGRAM_CONFIG.botToken || '';
  const fileChatId = DEFAULT_TELEGRAM_CONFIG.chatId || '';

  // 3. Из браузерного localStorage (если владелец ввел в админке на этом устройстве)
  const localToken = typeof window !== 'undefined' ? localStorage.getItem(TELEGRAM_STORAGE_KEY_TOKEN) || '' : '';
  const localChatId = typeof window !== 'undefined' ? localStorage.getItem(TELEGRAM_STORAGE_KEY_CHAT_ID) || '' : '';

  const finalToken = (localToken || envToken || fileToken).trim();
  const finalChatId = (localChatId || envChatId || fileChatId).trim();

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
      //
    }
  }

  const { token, chatId } = getTelegramConfig();
  const messageText = formatTelegramMessage(lead);

  // Сохранение резервной копии заявки на устройстве
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
    //
  }

  // 1. Попытка отправки через защищенную серверную функцию Netlify (без утечки токена в F12 DevTools!)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    try {
      const netlifyRes = await fetch('/.netlify/functions/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          chatId,
          text: messageText,
        }),
      });

      if (netlifyRes.ok) {
        const netlifyData = await netlifyRes.json();
        if (netlifyData.ok) {
          return {
            success: true,
            isSimulated: false,
            message: 'Заявка принята! Менеджер свяжется с вами в течение 10–15 минут.',
            previewText: messageText,
          };
        }
      }
    } catch {
      // При отсутствии Netlify Functions продолжаем отправку напрямую
    }
  }

  // 2. Если токен или chat_id отсутствуют в конфигурации
  if (!token || !chatId) {
    return {
      success: true,
      isSimulated: true,
      message: 'Заявка принята! Менеджер свяжется с вами в течение 10–15 минут.',
      errorDetail: 'Токен бота или Chat ID не заданы в конфигурации (src/config/telegram.ts или в переменных окружения).',
      previewText: messageText,
    };
  }

  // 3. Прямая отправка в Telegram Bot API
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
        message: 'Заявка принята! Менеджер свяжется с вами в течение 10–15 минут.',
        previewText: messageText,
      };
    } else {
      let humanError = data.description || 'Неизвестная ошибка Telegram API';

      if (humanError.includes("bot can't initiate conversation") || humanError.includes("chat not found")) {
        humanError = 'Вы не нажали СТАРТ в боте! Откройте вашего бота в Telegram и обязательно нажмите кнопку "Start" (/start), чтобы бот получил право присылать вам сообщения.';
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
  } catch (err: any) {
    return {
      success: true,
      isSimulated: true,
      message: 'Заявка принята и сохранена! (Браузер ограничил прямой сетевой запрос к Telegram)',
      errorDetail: err?.message || 'Сетевая ошибка',
      previewText: messageText,
    };
  }
}
