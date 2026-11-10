/**
 * Базовая конфигурация Telegram-бота для получения заявок.
 * 
 * Поддерживает:
 * 1. Переменные окружения VITE_TELEGRAM_BOT_TOKEN и VITE_TELEGRAM_CHAT_ID (через GitHub Secrets / Netlify / Vercel).
 * 2. Настройку прямо в защищенной панели управления на сайте (localStorage).
 * 3. Встроенную резервную конфигурацию для склада Дома и Кровли.
 */

// Токен бота: 9219696978:AAEnVcq4GSpuLnlDUYHb9xyU_dw9ATK2gfs
// Чат владельца (Александр Пильников / pilnik1): 785696987
export const DEFAULT_TELEGRAM_CONFIG = {
  botToken: '9219696978:AAEnVcq4GSpuLnlDUYHb9xyU_dw9ATK2gfs',
  chatId: '785696987',
};
