/**
 * Автоматическое переключение темы (День / Ночь):
 * 1. Если в ОС/браузере пользователя включена тёмная тема -> всегда включаем тёмную тему.
 * 2. Если в ОС/браузере светлая тема -> автоматически переключаем по времени суток:
 *    - Вечер и ночь (с 20:30 до 07:30): комфортная тёмная тема для защиты глаз.
 *    - День (с 07:30 до 20:30): четкая, контрастная светлая тема.
 */

export function initAutoTheme(): () => void {
  if (typeof window === 'undefined') return () => {};

  const checkIsNight = (): boolean => {
    // Проверяем как местное время устройства пользователя, так и часовой пояс Беларуси (UTC+3)
    const localNow = new Date();
    const localMinutes = localNow.getHours() * 60 + localNow.getMinutes();

    // Часовой пояс Беларуси (Минск/Бобруйск UTC+3)
    const utc = localNow.getTime() + localNow.getTimezoneOffset() * 60000;
    const belarusNow = new Date(utc + 3 * 3600000);
    const belarusMinutes = belarusNow.getHours() * 60 + belarusNow.getMinutes();

    const nightStart = 20 * 60 + 30; // 20:30
    const nightEnd = 7 * 60 + 30;    // 07:30

    const isLocalNight = localMinutes >= nightStart || localMinutes < nightEnd;
    const isBelarusNight = belarusMinutes >= nightStart || belarusMinutes < nightEnd;

    return isLocalNight || isBelarusNight;
  };

  const updateTheme = () => {
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isNight = checkIsNight();

      const shouldBeDark = prefersDark || isNight;

      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Игнорируем в старых веб-вью
    }
  };

  // Первоначальное применение темы
  updateTheme();

  // Отслеживание смены темы в ОС
  let mediaQuery: MediaQueryList | null = null;
  const mediaListener = () => updateTheme();

  try {
    if (window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', mediaListener);
    }
  } catch {
    // Игнорируем
  }

  // Регулярная проверка каждую минуту (на случай перехода времени с 20:29 на 20:30)
  const intervalId = setInterval(updateTheme, 60000);

  return () => {
    if (mediaQuery) {
      try {
        mediaQuery.removeEventListener('change', mediaListener);
      } catch {
        // Игнорируем
      }
    }
    clearInterval(intervalId);
  };
}
