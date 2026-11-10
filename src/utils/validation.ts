/**
 * Валидация телефонных номеров Беларуси и защита от спама
 */

// Базовые корни ненормативной лексики и спама
const PROFANITY_PATTERNS = [
  /ху[йияеё]/i,
  /пизд/i,
  /бля[дт]/i,
  /еб[ааеёиу]/i,
  /ёб/i,
  /сук[ааио]/i,
  /гандон/i,
  /мудак/i,
  /залуп/i,
  /чмо/i,
  /порно/i,
  /казино/i,
  /ставки/i,
  /крипт/i,
];

// 1. Прямые спам-фразы, вариации названий ботов, пробива и рассылок
export const SPAM_PHRASE_PATTERNS: RegExp[] = [
  /поисков[оы]й\s+бот/i,
  /новый\s+поисков[оы]й/i,
  /запустить\s+бот/i,
  /попробуйте\s+бесплатно/i,
  /варианты\s+поиска/i,
  /контакты\s+и\s+имена/i,
  /социальные\s+сети/i,
  /автомобили/i,
  /фотографии/i,
  /пробив/i,
  /osint/i,
  /баз[аы]\s+данных/i,
  /слив\s+(данных|баз|фото)/i,
  /телефонн[ыо][ей]\s+справочник/i,
  /rokie/i,
  /post[\s_-]*automation/i,
  /глаз\s*бога/i,
  /eye[\s_-]*of[\s_-]*god/i,
  /детонатор/i,
  /спам[\s_-]*бот/i,
  /автоматическ[аяое]+\s+рассылк/i,
  /рассылк[аи]\s+сообщени/i,
];

// 2. Ссылки, протоколы и упоминания чужих ботов/каналов
export const SPAM_LINK_PATTERNS: RegExp[] = [
  /t\.me\//i,
  /telegram\.me\//i,
  /tg:\/\/resolve/i,
  /@[\w_]+bot\b/i,
  /https?:\/\//i,
  /www\./i,
  /\.рф\b/i,
  /\.xyz\b/i,
  /\.top\b/i,
  /\.click\b/i,
];

// 3. Подозрительные пары ключевых слов (комбинации рекламы сервисов)
const SUSPICIOUS_PAIRS: [RegExp, RegExp][] = [
  [/бот/i, /поиск/i],
  [/бот/i, /бесплатн/i],
  [/поиск/i, /контакт/i],
  [/поиск/i, /авто/i],
  [/бот/i, /telegram|телеграм/i],
  [/запуск/i, /бот/i],
  [/канал/i, /подпис/i],
];

// Шаблоны тестовых и фейковых номеров
const DUMMY_NUMBER_PATTERNS = [
  /0000000/,
  /1111111/,
  /2222222/,
  /3333333/,
  /4444444/,
  /5555555/,
  /6666666/,
  /7777777/,
  /8888888/,
  /9999999/,
  /1234567/,
  /7654321/,
  /0123456/,
  /9876543/,
  /1212121/,
];

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  return PROFANITY_PATTERNS.some((pattern) => pattern.test(text));
}

/**
 * Проверка текста на агрессивный капслок (ALL CAPS спам)
 */
function isAggressiveAllCaps(text: string): boolean {
  const letters = text.replace(/[^a-zA-Zа-яА-ЯёЁ]/g, '');
  if (letters.length < 25) return false;

  const upper = text.replace(/[^A-ZА-ЯЁ]/g, '').length;
  return upper / letters.length >= 0.65;
}

/**
 * Максимально надежная проверка на спам от Telegram-ботов и рекламных рассылок.
 * Поддерживает передачу строки, массива строк или целого объекта заявки (LeadPayload).
 */
export function isTelegramBotSpam(input: unknown, ...additionalFields: unknown[]): boolean {
  if (!input) return false;

  let combined = '';

  if (typeof input === 'string') {
    combined = input;
  } else if (Array.isArray(input)) {
    combined = input.filter(Boolean).join(' ');
  } else if (typeof input === 'object') {
    combined = Object.values(input as Record<string, unknown>)
      .filter((v) => typeof v === 'string')
      .join(' ');
  }

  if (additionalFields.length > 0) {
    const extra = additionalFields
      .filter((v) => typeof v === 'string')
      .join(' ');
    combined = `${combined} ${extra}`;
  }

  const clean = combined.trim();
  if (!clean) return false;

  // 1. Проверка прямых спам-фраз
  for (const pattern of SPAM_PHRASE_PATTERNS) {
    if (pattern.test(clean)) return true;
  }

  // 2. Проверка ссылок на Telegram-боты, каналы и сторонние сайты
  for (const pattern of SPAM_LINK_PATTERNS) {
    if (pattern.test(clean)) return true;
  }

  // 3. Проверка агрессивного ALL-CAPS спама
  if (isAggressiveAllCaps(clean)) {
    if (/бот|telegram|тг|поиск|бесплатн|канал|жми|ссылк|кнопк|баз[аы]|слив/i.test(clean)) {
      return true;
    }
  }

  // 4. Проверка подозрительных комбинаций
  for (const [r1, r2] of SUSPICIOUS_PAIRS) {
    if (r1.test(clean) && r2.test(clean)) {
      return true;
    }
  }

  return false;
}

// Проверка на бессмысленный набор букв, случайные нажатия клавиатуры и спам
export function isGibberish(text: string): boolean {
  if (!text) return false;
  const clean = text.trim();
  if (clean.length === 0) return false;

  // 1. Повторение одного и того же символа 3+ раза (например: ааа, жжжжж, 111)
  if (/(.)\1{2,}/i.test(clean)) return true;

  // 2. Классические клавиатурные проходы (русская и английская раскладка)
  const keyboardPasses = [
    /фыва/i, /ывап/i, /вапр/i, /апро/i, /прол/i, /ролд/i, /олдж/i, /ждло/i,
    /йцук/i, /цуке/i, /укен/i, /кенг/i, /енгш/i, /нгшщ/i, /гшщз/i, /шщзх/i,
    /ячсм/i, /чсми/i, /смит/i, /мить/i, /итьб/i,
    /asdf/i, /sdfg/i, /dfgh/i, /fghj/i, /ghjk/i, /hjkl/i,
    /qwer/i, /wert/i, /erty/i, /rtyu/i, /tyui/i, /yuio/i, /uiop/i,
    /zxcv/i, /xcvb/i, /cvbn/i, /vbnm/i,
    /12345/, /54321/,
  ];
  if (keyboardPasses.some((p) => p.test(clean))) return true;

  // 3. Отсутствие гласных букв в словах длиннее 3 символов (например: фывп, бвгдж, hjkl)
  const words = clean.split(/[\s,.-]+/);
  for (const word of words) {
    if (word.length >= 4 && !/[аеёиоуыэюяaeiouy]/i.test(word) && !/^\d+$/.test(word)) {
      return true;
    }
  }

  // 4. Слишком много согласных подряд (более 4 без гласных и пробелов)
  if (/[^аеёиоуыэюяaeiouy\s\d\-.,_]{5,}/i.test(clean)) return true;

  return false;
}

// Форматирование 9 цифр белорусского номера в (XX) XXX-XX-XX
export function formatLocalBelarusDigits(raw: string): string {
  let digits = raw.replace(/\D/g, '');

  if (digits.startsWith('375')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('80') && digits.length >= 10) {
    digits = digits.slice(2);
  }

  digits = digits.slice(0, 9);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 5) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  fullPhone?: string;
  rawPhone?: string; // e.g. +375291234567 for 1-tap dial
}

// Проверка 9 цифр белорусского номера (строго реальные операторы Беларуси)
export function validateLocalBelarusDigits(formattedOrRaw: string): ValidationResult {
  const digits = formattedOrRaw.replace(/\D/g, '');

  if (digits.length !== 9) {
    return {
      isValid: false,
      errorMessage: 'Введите 9 цифр номера: код оператора (29, 44, 33, 25) и 7 цифр номера',
    };
  }

  const operatorCode = digits.slice(0, 2);
  const localNumber = digits.slice(2);

  if (DUMMY_NUMBER_PATTERNS.some((p) => p.test(localNumber))) {
    return {
      isValid: false,
      errorMessage: 'Пожалуйста, укажите настоящий действующий номер телефона для связи',
    };
  }

  // Разрешенные коды: мобильные (29, 44, 33, 25) и региональные (22 — Бобруйск/Могилев, 17 — Минск)
  const validCodes = ['29', '44', '33', '25', '22', '17'];
  if (!validCodes.includes(operatorCode)) {
    return {
      isValid: false,
      errorMessage: `Код (${operatorCode}) не поддерживается. Укажите мобильный код Беларуси: (29), (44), (33), (25)`,
    };
  }

  return {
    isValid: true,
    fullPhone: `+375 (${operatorCode}) ${localNumber.slice(0, 3)}-${localNumber.slice(3, 5)}-${localNumber.slice(5, 7)}`,
    rawPhone: `+375${operatorCode}${localNumber}`,
  };
}

// Защита от спама: не более 1 заявки за 60 секунд
const LAST_SUBMIT_KEY = 'dom_amk_last_lead_ts';

export function checkRateLimit(): { allowed: boolean; waitSeconds?: number } {
  try {
    const lastStr = localStorage.getItem(LAST_SUBMIT_KEY);
    if (!lastStr) return { allowed: true };

    const last = parseInt(lastStr, 10);
    const now = Date.now();
    const diff = Math.floor((now - last) / 1000);

    // Возвращено 60 секунд для боевого режима
    if (diff < 60) {
      return { allowed: false, waitSeconds: 60 - diff };
    }
  } catch {
    // игнорируем
  }
  return { allowed: true };
}

export function recordSubmitTimestamp() {
  try {
    localStorage.setItem(LAST_SUBMIT_KEY, Date.now().toString());
  } catch {
    // игнорируем
  }
}
