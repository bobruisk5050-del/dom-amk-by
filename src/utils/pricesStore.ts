export interface WarehouseSettings {
  // Плиты ОСБ-3 влагостойкие (цена за 1 лист, BYN)
  osb9: number;
  osb12: number;
  osb15: number;
  osb18: number;
  osb22: number;

  // Кровля, металл, фасады и изоляция (BYN)
  metalTile: number;      // Металлочерепица Монтеррей / Нордик (за м²)
  onduline: number;       // Еврошифер Ондулин Smart (за 1 лист)
  pipe20x20: number;      // Труба профильная 20×20 (за 1 метр)
  pipe40x20: number;      // Труба профильная 40×20 (за 1 метр)
  pipe60x40: number;      // Труба профильная 60×40 (за 1 метр)
  amkFacade: number;      // Фасадная система АМК кирпич на сетке (за м²)
  profnastil: number;     // Профнастил С-8 / МП-20 (за м²)
  membraneRoll: number;   // Кровельная диффузионная мембрана 75 м² (за рулон)
  drainageSystem: number; // Водосточные системы комплект от (BYN)

  // Контакты
  phoneWarehouse: string;
  phonePavilion: string;
  email: string;
}

export const DEFAULT_SETTINGS: WarehouseSettings = {
  osb9: 21.5,
  osb12: 27.9,
  osb15: 34.8,
  osb18: 41.5,
  osb22: 52.0,
  metalTile: 18.5,
  onduline: 24.9,
  pipe20x20: 2.1,
  pipe40x20: 3.4,
  pipe60x40: 5.8,
  amkFacade: 38.0,
  profnastil: 16.8,
  membraneRoll: 85.0,
  drainageSystem: 145.0,
  phoneWarehouse: '+375 (44) 702-25-33',
  phonePavilion: '+375 (44) 457-19-91',
  email: 'max_asmukowich@mail.ru',
};

const STORAGE_KEY = 'dom_amk_warehouse_settings';

export function getWarehouseSettings(): WarehouseSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveWarehouseSettings(settings: WarehouseSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('dom_amk_settings_updated'));
  } catch {
    //
  }
}

export function resetWarehouseSettings(): WarehouseSettings {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('dom_amk_settings_updated'));
  }
  return DEFAULT_SETTINGS;
}
