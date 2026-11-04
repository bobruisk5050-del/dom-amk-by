/**
 * График работы склада и павильона в Бобруйске (часовой пояс Минска, UTC+3)
 * - Основной склад (ул. Орджоникидзе, 349): Пн–Сб 09:00 – 18:00, Вс — выходной.
 * - Торговая точка (рынок «Птичка»): Вт–Вс 09:00 – 15:00, Пн — выходной.
 */

export interface ScheduleStatus {
  isOpen: boolean;
  statusText: string;
  badgeClass: string;
  dotColor: string;
}

export function getWarehouseStatus(): ScheduleStatus {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const belarusTime = new Date(utc + 3 * 3600000);

  const day = belarusTime.getDay(); // 0 = вс, 1 = пн ... 6 = сб
  const hour = belarusTime.getHours();
  const minute = belarusTime.getMinutes();
  const currentMinutes = hour * 60 + minute;

  const openMinutes = 9 * 60; // 09:00
  const closeMinutes = 18 * 60; // 18:00

  // Воскресенье — склад закрыт
  if (day === 0) {
    return {
      isOpen: false,
      statusText: 'Склад откроется в понедельник в 09:00 (заявки принимаем 24/7)',
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dotColor: 'bg-amber-400',
    };
  }

  // Понедельник — суббота
  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    const hoursLeft = Math.floor((closeMinutes - currentMinutes) / 60);
    const minsLeft = (closeMinutes - currentMinutes) % 60;
    const timeRemainingStr = hoursLeft > 0 ? `еще ${hoursLeft} ч.` : `еще ${minsLeft} мин.`;

    return {
      isOpen: true,
      statusText: `Склад открыт сейчас (до 18:00, ${timeRemainingStr}) • Отгрузка сегодня`,
      badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      dotColor: 'bg-emerald-400',
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: 'Склад откроется сегодня в 09:00 • Отгрузки в день звонка',
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dotColor: 'bg-amber-400',
    };
  }

  // После 18:00
  const nextOpenDay = day === 6 ? 'в понедельник' : 'завтра';
  return {
    isOpen: false,
    statusText: `Склад закрыт • Откроется ${nextOpenDay} в 09:00 (заявки онлайн 24/7)`,
    badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    dotColor: 'bg-amber-400',
  };
}

export function getPavilionStatus(): ScheduleStatus {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const belarusTime = new Date(utc + 3 * 3600000);

  const day = belarusTime.getDay();
  const hour = belarusTime.getHours();
  const minute = belarusTime.getMinutes();
  const currentMinutes = hour * 60 + minute;

  const openMinutes = 9 * 60;
  const closeMinutes = 15 * 60;

  // Понедельник — санитарный день рынка
  if (day === 1) {
    return {
      isOpen: false,
      statusText: 'Выходной день рынка (откроется во вторник в 09:00)',
      badgeClass: 'bg-slate-700 text-slate-300',
      dotColor: 'bg-slate-400',
    };
  }

  // Вторник — воскресенье с 9:00 до 15:00
  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      statusText: 'Павильон открыт сейчас (до 15:00)',
      badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      dotColor: 'bg-emerald-400',
    };
  }

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: 'Павильон откроется сегодня в 09:00',
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dotColor: 'bg-amber-400',
    };
  }

  const nextDay = day === 0 ? 'во вторник' : 'завтра';
  return {
    isOpen: false,
    statusText: `Павильон откроется ${nextDay} в 09:00`,
    badgeClass: 'bg-slate-700 text-slate-300',
    dotColor: 'bg-slate-400',
  };
}

export interface NightModeInfo {
  isNight: boolean;
  message: string;
  defaultCallTime: string;
  timeOptions: string[];
}

export function checkNightMode(): NightModeInfo {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const belarusTime = new Date(utc + 3 * 3600000);
  const hour = belarusTime.getHours();
  const minute = belarusTime.getMinutes();
  const currentMinutes = hour * 60 + minute;

  // Ночной режим: с 21:30 вечера до 08:30 утра (21:30 = 1290 мин, 08:30 = 510 мин)
  const isNight = currentMinutes >= 21 * 60 + 30 || currentMinutes < 8 * 60 + 30;

  return {
    isNight,
    message: isNight
      ? 'Склад сейчас закрыт на ночь (откроется в 09:00). Заявку принимаем прямо сейчас — выберите, во сколько утром вам перезвонить.'
      : 'Склад открыт! Дежурный менеджер перезвонит в течение 10–15 минут.',
    defaultCallTime: 'Утром с 09:00',
    timeOptions: [
      'Утром с 09:00 (при открытии)',
      'С 10:00 до 12:00',
      'В обед (12:00 – 14:00)',
      'После 14:00',
      'Вечером (после 17:00)',
    ],
  };
}

