/**
 * График работы склада и торговой точки в Бобруйске (часовой пояс Минска, UTC+3)
 * - Основной склад (ул. Орджоникидзе, 349): Пн–Сб 09:00 – 18:00, Вс — выходной.
 * - Торговая точка (рынок «Птичка»): Вт–Вс 09:00 – 15:00, Пн — выходной.
 */

export interface ScheduleStatus {
  isOpen: boolean;
  statusText: string;
  badgeClass: string;
  dotColor: string;
}

export function getBelarusDate(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3 * 3600000);
}

export function getWarehouseStatus(): ScheduleStatus {
  const belarusTime = getBelarusDate();

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
      statusText: 'Склад откроется в понедельник в 09:00 (заявки онлайн 24/7)',
      badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      dotColor: 'bg-amber-400',
    };
  }

  // Понедельник — суббота в рабочие часы (09:00 – 18:00)
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

  // Утро до 09:00
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
  const belarusTime = getBelarusDate();

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
  isNight: boolean; // true всегда, когда склад закрыт (после 18:00, до 09:00 или в выходной день)
  title: string;
  message: string;
  defaultCallTime: string;
  nextOpenDayText: string;
  timeOptions: string[];
}

/**
 * Проверка нерабочего времени склада.
 * Синхронизирована со статусом склада: если склад закрыт (после 18:00, до 09:00, воскресенье),
 * возвращает isNight = true и актуальные подсказки для клиента.
 */
export function checkNightMode(): NightModeInfo {
  const belarusTime = getBelarusDate();
  const day = belarusTime.getDay(); // 0 = вс, 1 = пн ... 6 = сб
  const hour = belarusTime.getHours();
  const minute = belarusTime.getMinutes();
  const currentMinutes = hour * 60 + minute;

  const openMinutes = 9 * 60; // 09:00
  const closeMinutes = 18 * 60; // 18:00

  // 1. Склад ОТКРЫТ (Пн–Сб с 09:00 до 18:00)
  if (day !== 0 && currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isNight: false,
      title: 'Склад открыт сейчас',
      message: 'Склад открыт! Дежурный менеджер перезвонит в течение 10–15 минут.',
      defaultCallTime: 'В течение 10–15 минут',
      nextOpenDayText: 'сегодня',
      timeOptions: [
        'В течение 10–15 минут (прямо сейчас)',
        'В течение 1 часа',
        'В обед (12:00 – 14:00)',
        'Вечером (до 18:00)',
      ],
    };
  }

  // 2. Склад ЗАКРЫТ:
  // А) Воскресенье (выходной)
  if (day === 0) {
    return {
      isNight: true,
      title: 'Склад сейчас закрыт (воскресенье — выходной, откроется в понедельник в 09:00)',
      message: 'Сегодня склад на выходном. Заявки принимаем онлайн круглосуточно! Выберите, когда в понедельник вам перезвонить:',
      defaultCallTime: 'В понедельник с 09:00 (при открытии)',
      nextOpenDayText: 'в понедельник',
      timeOptions: [
        'В понедельник с 09:00 (при открытии)',
        'В понедельник с 10:00 до 12:00',
        'В понедельник в обед (12:00 – 14:00)',
        'В понедельник после 14:00',
        'В понедельник вечером (после 17:00)',
      ],
    };
  }

  // Б) Суббота после 18:00 (следующий рабочий день — понедельник)
  if (day === 6 && currentMinutes >= closeMinutes) {
    return {
      isNight: true,
      title: 'Склад закрыт на выходные (откроется в понедельник в 09:00)',
      message: 'Рабочий день склада завершён, воскресенье — выходной. Заявку принимаем онлайн прямо сейчас — выберите, во сколько в понедельник вам перезвонить:',
      defaultCallTime: 'В понедельник с 09:00 (при открытии)',
      nextOpenDayText: 'в понедельник',
      timeOptions: [
        'В понедельник с 09:00 (при открытии)',
        'В понедельник с 10:00 до 12:00',
        'В понедельник в обед (12:00 – 14:00)',
        'В понедельник после 14:00',
        'В понедельник вечером (после 17:00)',
      ],
    };
  }

  // В) Утро до 09:00 (откроется сегодня в 09:00)
  if (currentMinutes < openMinutes) {
    return {
      isNight: true,
      title: 'Склад откроется сегодня в 09:00',
      message: 'Склад сейчас закрыт до открытия в 09:00. Заявку принимаем прямо сейчас — укажите удобное время для звонка:',
      defaultCallTime: 'Сегодня утром с 09:00 (при открытии)',
      nextOpenDayText: 'сегодня',
      timeOptions: [
        'Сегодня утром с 09:00 (при открытии)',
        'Сегодня с 10:00 до 12:00',
        'В обед (12:00 – 14:00)',
        'Во второй половине дня (после 14:00)',
        'Вечером (после 17:00)',
      ],
    };
  }

  // Г) Вечер/ночь после 18:00 (Пн–Пт, откроется завтра в 09:00)
  return {
    isNight: true,
    title: 'Склад сейчас закрыт (рабочий день до 18:00, откроется завтра в 09:00)',
    message: 'Рабочий день склада завершён (работаем до 18:00). Заявку принимаем прямо сейчас 24/7 — укажите, когда завтра вам удобно ответить:',
    defaultCallTime: 'Завтра утром с 09:00 (при открытии)',
    nextOpenDayText: 'завтра',
    timeOptions: [
      'Завтра утром с 09:00 (при открытии)',
      'Завтра с 10:00 до 12:00',
      'Завтра в обед (12:00 – 14:00)',
      'Завтра во второй половине дня (после 14:00)',
      'Завтра вечером (после 17:00)',
    ],
  };
}
