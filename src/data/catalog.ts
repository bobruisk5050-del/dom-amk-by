import osbImg from '../assets/images/osb_boards_stock_1793724166182.jpg';
import roofingImg from '../assets/images/roofing_tiles_stock_1793724180609.jpg';
import pipesImg from '../assets/images/profile_pipes_metal_1793724180202.jpg';
import facadeImg from '../assets/images/facade_amk_brick_1793724196363.jpg';
import heroDepotImg from '../assets/images/hero_building_depot_1793724166031.jpg';

export interface Product {
  id: string;
  title: string;
  category: 'osb' | 'roofing' | 'pipes' | 'facade' | 'insulation' | 'drainage';
  categoryLabel: string;
  image: string;
  badge?: string;
  shortDesc: string;
  specs: { label: string; value: string }[];
  priceHint: string;
  unit: string;
  inStock: boolean;
  popularDimensions?: string[];
}

export interface CategoryTab {
  id: string;
  label: string;
  count: number;
}

export const CATALOG_PRODUCTS: Product[] = [
  {
    id: 'osb-3-moisture',
    title: 'Плита OSB-3 (ОСБ) влагостойкая Kronospan',
    category: 'osb',
    categoryLabel: 'OSB-3 (ОСБ) плита',
    image: osbImg,
    badge: 'Хит продаж',
    shortDesc: 'Ориентированно-стружечная влагостойкая плита повышенной прочности для сплошного настила кровли, каркасных стен, перегородок и черновых полов.',
    specs: [
      { label: 'Размер листа', value: '2500 × 1250 мм (3.125 м²)' },
      { label: 'Толщины на складе', value: '9, 12, 15, 18, 22 мм' },
      { label: 'Класс влагостойкости', value: 'OSB-3 (для влажных условий)' },
      { label: 'Класс эмиссии', value: 'E1 (экологически безопасна)' },
      { label: 'Производитель', value: 'Kronospan / Калевала' },
    ],
    priceHint: 'Прямые поставки со склада',
    unit: 'за лист',
    inStock: true,
    popularDimensions: ['9 мм (под мягкую кровлю)', '12 мм (стены, каркас)', '15 мм (усиленные стены)', '18 мм (пол, перекрытия)', '22 мм (нагруженный пол)'],
  },
  {
    id: 'metal-roofing-monterrey',
    title: 'Металлочерепица «Монтеррей» и «Нордик» (0.45 / 0.5 мм)',
    category: 'roofing',
    categoryLabel: 'Кровельные материалы',
    image: roofingImg,
    badge: 'Гарантия до 25 лет',
    shortDesc: 'Классическая металлочерепица с защитным цинковым слоем и полимерным матовым/глянцевым покрытием (RAL 7024 графит, RAL 8017 шоколад, RAL 3005 вишня, RAL 6005 зеленый мох).',
    specs: [
      { label: 'Толщина металла', value: '0.45 мм / 0.50 мм ГОСТ' },
      { label: 'Ширина листа', value: '1180 мм (полезная 1100 мм)' },
      { label: 'Длина листа', value: 'Под заказ по размерам ската' },
      { label: 'Покрытие', value: 'Polyester глянец / ПЭ матовый (Velur)' },
    ],
    priceHint: 'Точный расчет без обрезков',
    unit: 'за м²',
    inStock: true,
    popularDimensions: ['RAL 7024 Графит', 'RAL 8017 Темный шоколад', 'RAL 3005 Бордо', 'RAL 8019 Серо-коричневый'],
  },
  {
    id: 'onduline-smart',
    title: 'Еврошифер Ондулин Smart (Onduline)',
    category: 'roofing',
    categoryLabel: 'Кровельные материалы',
    image: roofingImg,
    badge: 'Легкий монтаж',
    shortDesc: 'Оригинальный битумный волнистый лист с «умным» замком Smart Lock. Не шумит во время дождя, легкий вес (не перегружает стропила), не ржавеет и не конденсирует влагу.',
    specs: [
      { label: 'Размер листа', value: '1950 × 950 мм' },
      { label: 'Толщина', value: '3.0 мм' },
      { label: 'Цвета', value: 'Коричневый, Красный, Зеленый, Серый' },
      { label: 'Вес листа', value: 'всего 6.3 кг' },
    ],
    priceHint: 'От 1 листа со склада',
    unit: 'за лист',
    inStock: true,
    popularDimensions: ['Коричневый', 'Красный', 'Зеленый', 'Гвозди Ондулин с монолитной шляпкой'],
  },
  {
    id: 'profile-pipes-steel',
    title: 'Труба профильная стальная (квадратная и прямоугольная)',
    category: 'pipes',
    categoryLabel: 'Профильная труба',
    image: pipesImg,
    badge: 'Резка в размер',
    shortDesc: 'Горячекатаная и холоднокатаная профильная труба для изготовления заборов, ворот, калиток, навесов, теплиц и кровельных ферм. Бесплатная резка для удобной перевозки!',
    specs: [
      { label: 'Ходовые размеры', value: '20×20, 40×20, 50×50, 60×40, 60×60, 80×80 мм' },
      { label: 'Толщина стенки', value: '1.5 мм, 2.0 мм, 3.0 мм' },
      { label: 'Длина хлыста', value: '6 метров (режем по 2, 3 м или вашим размерам)' },
      { label: 'Сталь', value: 'Ст3сп / ГОСТ 8645-68' },
    ],
    priceHint: 'Опт и розница от 1 метра',
    unit: 'за метр пог.',
    inStock: true,
    popularDimensions: ['40×20×1.5 (для заборных лаг)', '60×40×2.0 (для столбов и каркаса)', '20×20×1.5 (для решеток и ферм)', '80×80×3.0 (несущие стойки)'],
  },
  {
    id: 'facade-amk-system',
    title: 'Фасадная декоративная система АМК (кирпич на сетке)',
    category: 'facade',
    categoryLabel: 'Фасады АМК',
    image: facadeImg,
    badge: 'Оригинал АМК',
    shortDesc: 'Инновационное покрытие из натуральной мраморной крошки на армирующей стеклосетке. Монтируется на клей для утеплителя на любые поверхности: газосиликат, пенопласт, минвату, ОСБ, гипсокартон.',
    specs: [
      { label: 'Формат элементов', value: 'Кирпич, Блок, Клинкер, Ригель, Мозаика' },
      { label: 'Размер полотна', value: '0.9 м² (в сетке 1250 × 995 мм)' },
      { label: 'Срок службы', value: 'Более 25 лет без выцветания' },
      { label: 'Защита', value: 'Защитная пленка на каждом элементе для легкой затирки швов' },
    ],
    priceHint: 'Официальный дилер в Бобруйске',
    unit: 'за м²',
    inStock: true,
    popularDimensions: ['АМК Кирпич классический', 'АМК Клинкер микс', 'АМК Блок серый/графит', 'Фирменный клей и грунт'],
  },
  {
    id: 'profnastil-c8-mp20',
    title: 'Профнастил оцинкованный и полимерный (С-8, МП-20)',
    category: 'roofing',
    categoryLabel: 'Кровельные материалы',
    image: roofingImg,
    badge: 'Для крыши и забора',
    shortDesc: 'Профилированный лист для заборов, фасадов и кровли. Жесткая геометрия волны, стойкое защитное антикоррозийное полимерное покрытие с обеих сторон.',
    specs: [
      { label: 'Маркировка', value: 'С-8 (стеновой/заборный), МП-20 (кровельный)' },
      { label: 'Высота профиля', value: '8 мм / 20 мм' },
      { label: 'Толщина стали', value: '0.40 мм, 0.45 мм, 0.50 мм' },
      { label: 'Цвета', value: 'RAL 7024, 8017, 6005, оцинкованный' },
    ],
    priceHint: 'В наличии стандартные длины 1.5м, 1.8м, 2.0м',
    unit: 'за м²',
    inStock: true,
    popularDimensions: ['2.0 метра (для стандартного забора)', '1.5 метра (для невысоких ограждений)', 'Под заказ любая длина до 6 м'],
  },
  {
    id: 'roofing-membranes-films',
    title: 'Кровельные диффузионные мембраны и пленки Ютавек / Технониколь',
    category: 'insulation',
    categoryLabel: 'Изоляция и мембраны',
    image: heroDepotImg,
    badge: 'Европейское качество',
    shortDesc: 'Трехслойные супердиффузионные ветро-влагозащитные мембраны и пароизоляционные пленки для защиты утеплителя и деревянных стропил от влаги, пара и выдувания тепла.',
    specs: [
      { label: 'Площадь рулона', value: '75 м² (1.5 × 50 м)' },
      { label: 'Плотность', value: '95 г/м², 115 г/м², 135 г/м²' },
      { label: 'Паропроницаемость', value: '> 1200 г/м²/24ч' },
      { label: 'Назначение', value: 'Мансарды, утепленные скатные кровли, каркасные стены' },
    ],
    priceHint: 'В наличии в рулонах со склада',
    unit: 'за рулон',
    inStock: true,
    popularDimensions: ['Мембрана ветро-влагозащитная 115г', 'Пароизоляция армированная', 'Бутилкаучуковая соединительная лента'],
  },
  {
    id: 'drainage-systems',
    title: 'Водосточные системы (пластиковые и металлические)',
    category: 'drainage',
    categoryLabel: 'Водосточные системы',
    image: roofingImg,
    badge: 'Полный комплект',
    shortDesc: 'Надежные водостоки Döcke и металл с глубоким желобом. Предотвращают размывание фундамента и намокание фасада. Полный комплект: желоба, трубы, воронки, колена, кронштейны.',
    specs: [
      { label: 'Диаметры', value: 'Желоб 120-125 мм / Труба 80-90 мм' },
      { label: 'Материал', value: 'Ударопрочный ПВХ (не выгорает) / Оцинкованная сталь с полимером' },
      { label: 'Цвета', value: 'Белый, Шоколад (RAL 8017), Графит (RAL 7024)' },
      { label: 'Гарантия', value: 'До 25 лет на стойкость цвета' },
    ],
    priceHint: 'Бесплатный расчет элементов по проекту',
    unit: 'за комплект',
    inStock: true,
    popularDimensions: ['Коричневый RAL 8017', 'Графит RAL 7024', 'Белый RAL 9003'],
  },
];
