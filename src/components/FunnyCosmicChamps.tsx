import React from 'react';
import { TileType, MagicEffectType } from '../types/game';

export interface DoorsItemMeta {
  name: string;
  category: string;
  title: string;
  magic: MagicEffectType;
  accentColor: string;
  glowColor: string;
  neonColor: string;
  neonGlow: string;
  funnyName: string;
}

export const DOORS_ITEMS_METAS: Record<TileType, DoorsItemMeta> = {
  yasuo: {
    name: 'Распятие',
    category: 'Священная защита',
    title: 'Crucifix (DOORS)',
    magic: 'starlight',
    accentColor: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.7)',
    neonColor: '#00f0ff',
    neonGlow: 'rgba(0, 240, 255, 0.85)',
    funnyName: 'Распятие против демонов ✝️',
  },
  ahri: {
    name: 'Зажигалка',
    category: 'Огонь и Тепло',
    title: 'Lighter (DOORS)',
    magic: 'fire',
    accentColor: '#ff8c00',
    glowColor: 'rgba(255, 140, 0, 0.7)',
    neonColor: '#ff8c00',
    neonGlow: 'rgba(255, 140, 0, 0.85)',
    funnyName: 'Зажигалка Zippo 🔥',
  },
  jinx: {
    name: 'Фонарик',
    category: 'Освещение',
    title: 'Flashlight (DOORS)',
    magic: 'starlight',
    accentColor: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    neonColor: '#facc15',
    neonGlow: 'rgba(250, 204, 21, 0.85)',
    funnyName: 'Тактический Фонарик 🔦',
  },
  teemo: {
    name: 'Ключ-Череп',
    category: 'Мастер-Ключ',
    title: 'Skeleton Key (DOORS)',
    magic: 'wind',
    accentColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.7)',
    neonColor: '#10b981',
    neonGlow: 'rgba(16, 185, 129, 0.85)',
    funnyName: 'Скелетный Ключ 💀🗝️',
  },
  lux: {
    name: 'Свет-Проводник',
    category: 'Небесный Свет',
    title: 'Guiding Light (DOORS)',
    magic: 'arcane',
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    neonColor: '#38bdf8',
    neonGlow: 'rgba(56, 189, 248, 0.85)',
    funnyName: 'Добрый Свет Guiding Light 🌌✨',
  },
  blitzcrank: {
    name: 'Витамины',
    category: 'Скорость',
    title: 'Vitamins (DOORS)',
    magic: 'fire',
    accentColor: '#ff5722',
    glowColor: 'rgba(255, 87, 34, 0.7)',
    neonColor: '#ff5722',
    neonGlow: 'rgba(255, 87, 34, 0.85)',
    funnyName: 'Витамины Ускорения ⚡💊',
  },
  vi: {
    name: 'Отмычки',
    category: 'Взлом Дверей',
    title: 'Lockpick (DOORS)',
    magic: 'arcane',
    accentColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    neonColor: '#a855f7',
    neonGlow: 'rgba(168, 85, 247, 0.85)',
    funnyName: 'Набор Отмычек 🗝️🔓',
  },
  ashe: {
    name: 'Свеча-Детектор',
    category: 'Детекция Монстров',
    title: 'Candle (DOORS)',
    magic: 'frost',
    accentColor: '#2dd4bf',
    glowColor: 'rgba(45, 212, 191, 0.7)',
    neonColor: '#2dd4bf',
    neonGlow: 'rgba(45, 212, 191, 0.85)',
    funnyName: 'Призрачная Свеча 🕯️👻',
  },
  darius: {
    name: 'Секатор',
    category: 'Инструменты Оранжереи',
    title: 'Shears (DOORS)',
    magic: 'fire',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.7)',
    neonColor: '#ef4444',
    neonGlow: 'rgba(239, 68, 68, 0.85)',
    funnyName: 'Секатор для Лиан ✂️🌿',
  },
  zed: {
    name: 'Аптечка',
    category: 'Медицина',
    title: 'Bandage Pack (DOORS)',
    magic: 'void',
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    neonColor: '#f43f5e',
    neonGlow: 'rgba(244, 63, 94, 0.85)',
    funnyName: 'Полевая Аптечка 🩹❤️',
  },
  garen: {
    name: 'Динамо-Фонарик',
    category: 'Кинетический Свет',
    title: 'Shakelight (DOORS)',
    magic: 'wind',
    accentColor: '#84cc16',
    glowColor: 'rgba(132, 204, 22, 0.7)',
    neonColor: '#84cc16',
    neonGlow: 'rgba(132, 204, 22, 0.85)',
    funnyName: 'Трясущийся Фонарик ⚡🔦',
  },
  asol: {
    name: 'Банка Разлома',
    category: 'Аномалия Разлома',
    title: 'Curious Light Jar (DOORS)',
    magic: 'void',
    accentColor: '#d946ef',
    glowColor: 'rgba(217, 70, 239, 0.7)',
    neonColor: '#d946ef',
    neonGlow: 'rgba(217, 70, 239, 0.85)',
    funnyName: 'Банка со Звездным Светом 🏺✨',
  },
  heimer: {
    name: 'Будильник',
    category: 'Отвлечение Фигуры',
    title: 'Alarm Clock (DOORS)',
    magic: 'arcane',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.7)',
    neonColor: '#eab308',
    neonGlow: 'rgba(234, 179, 8, 0.85)',
    funnyName: 'Будильник для Библиотеки ⏰🔔',
  },
  katarina: {
    name: 'Батарейки',
    category: 'Энергопитание',
    title: 'Battery Pack (DOORS)',
    magic: 'fire',
    accentColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.7)',
    neonColor: '#06b6d4',
    neonGlow: 'rgba(6, 182, 212, 0.85)',
    funnyName: 'Двойные Батарейки 🔋⚡',
  },
};

// Backwards compatibility alias for all existing imports
export const CHAMPION_METAS = DOORS_ITEMS_METAS;

export const FunnyCosmicChamps: React.FC<{ type: TileType; isCovered?: boolean }> = ({
  type,
  isCovered = false,
}) => {
  const iconClass = isCovered
    ? 'opacity-70 filter contrast-90'
    : 'opacity-100 hover:scale-110 drop-shadow-sm';

  return (
    <svg
      viewBox="0 0 40 40"
      className={`w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-150 select-none ${iconClass}`}
    >
      {renderDoorsItemDrawing(type)}
    </svg>
  );
};

export const DoorsItemSvg = FunnyCosmicChamps;

function renderDoorsItemDrawing(type: TileType) {
  switch (type) {
    case 'yasuo':
      // ✝️ CRUCIFIX (Распятие из DOORS): Деревянный крест с золотой окантовкой, обвитый небесными неоново-голубыми цепями света
      return (
        <g>
          {/* Небесное неоновое свечение святого распятия */}
          <circle cx="20" cy="18" r="16" fill="#00f0ff" opacity="0.15" />
          {/* Вертикальная деревянная балка */}
          <rect x="17" y="4" width="6" height="31" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
          {/* Горизонтальная деревянная балка */}
          <rect x="7" y="11" width="26" height="6" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="0.8" />
          {/* Текстура темного полированного дерева */}
          <line x1="19" y1="5" x2="19" y2="33" stroke="#92400e" strokeWidth="0.8" strokeLinecap="round" />
          <line x1="8" y1="13" x2="31" y2="13" stroke="#92400e" strokeWidth="0.8" strokeLinecap="round" />
          {/* Золотые наконечники на концах креста */}
          <rect x="16" y="3.5" width="8" height="2" rx="0.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
          <rect x="16" y="33.5" width="8" height="2" rx="0.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
          <rect x="6.5" y="10" width="2" height="8" rx="0.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
          <rect x="31.5" y="10" width="2" height="8" rx="0.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
          {/* Центральный золотой медальон святости */}
          <circle cx="20" cy="14" r="4.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />
          <circle cx="20" cy="14" r="2.5" fill="#fef08a" />
          {/* Сияющие неоново-голубые цепи сдерживания сущностей */}
          <path
            d="M12 11 Q20 18 28 11"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeDasharray="2 1.5"
            strokeLinecap="round"
          />
          <path
            d="M14 20 Q20 25 26 20"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.8"
            strokeDasharray="2 1.5"
            strokeLinecap="round"
          />
          {/* Священная вспышка на макушке */}
          <polygon points="20,1 21,3 23,3 21,5 22,7 20,5.5 18,7 19,5 17,3 19,3" fill="#38bdf8" />
        </g>
      );

    case 'ahri':
      // 🔥 LIGHTER (Зажигалка Zippo из DOORS): Хромированная откидная зажигалка с фитилем и ярким трепещущим пламенем
      return (
        <g>
          {/* Неоновый ореол пламени */}
          <circle cx="20" cy="9" r="8" fill="#ff8c00" opacity="0.2" />
          {/* Металлический откинутый колпачок зажигалки */}
          <path d="M12 18 L5 9 L15 5 L19 16 Z" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
          <path d="M7 11 L14 7" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
          {/* Нижний металлический корпус Zippo */}
          <rect x="12" y="17" width="16" height="19" rx="2" fill="#94a3b8" stroke="#334155" strokeWidth="1" />
          {/* Хромированный блик на корпусе */}
          <line x1="14" y1="19" x2="14" y2="34" stroke="#f1f5f9" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="17" y1="19" x2="17" y2="34" stroke="#64748b" strokeWidth="0.8" />
          {/* Ветрозащитная решетка с отверстиями */}
          <rect x="15" y="11" width="10" height="7" rx="1" fill="#475569" stroke="#1e293b" strokeWidth="0.8" />
          <circle cx="17.5" cy="14.5" r="0.9" fill="#0f172a" />
          <circle cx="20" cy="14.5" r="0.9" fill="#0f172a" />
          <circle cx="22.5" cy="14.5" r="0.9" fill="#0f172a" />
          {/* Золотистое колесико кремня */}
          <circle cx="13.5" cy="12.5" r="2.2" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="13.5" cy="12.5" r="1" fill="#facc15" />
          {/* Пламя зажигалки: внешнее оранжевое, сердцевина ярко-желтая */}
          <path d="M20 2 C16 6 15 11 20 12 C25 11 24 6 20 2 Z" fill="#ff5722" />
          <path d="M20 4 C17 7 17 11 20 12 C23 11 23 7 20 4 Z" fill="#facc15" />
          <circle cx="20" cy="9.5" r="1.3" fill="#ffffff" />
          {/* Искры */}
          <circle cx="15" cy="8" r="0.8" fill="#facc15" />
          <circle cx="24" cy="6" r="0.8" fill="#ff8c00" />
        </g>
      );

    case 'jinx':
      // 🔦 FLASHLIGHT (Фонарик из DOORS): Массивный тактический черный фонарь с ярким конусом желтого света
      return (
        <g>
          {/* Яркий световой луч */}
          <polygon points="22,17 38,6 39,26" fill="#fef08a" opacity="0.45" />
          <polygon points="22,17 34,9 35,23" fill="#ffffff" opacity="0.3" />
          {/* Тактический прорезиненный корпус под углом */}
          <g transform="rotate(-32 17 26)">
            {/* Рукоять фонаря */}
            <rect x="7" y="23" width="16" height="7" rx="1.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
            {/* Ребристая насечка для хвата */}
            <line x1="10" y1="24" x2="10" y2="29" stroke="#475569" strokeWidth="1" />
            <line x1="13" y1="24" x2="13" y2="29" stroke="#475569" strokeWidth="1" />
            <line x1="16" y1="24" x2="16" y2="29" stroke="#475569" strokeWidth="1" />
            <line x1="19" y1="24" x2="19" y2="29" stroke="#475569" strokeWidth="1" />
            {/* Кнопка включения */}
            <rect x="13" y="21.5" width="4" height="2" rx="0.5" fill="#ef4444" />
            {/* Расширенная головка фонаря */}
            <path d="M22 21.5 L28 19 L28 34 L22 31.5 Z" fill="#334155" stroke="#0f172a" strokeWidth="1" />
            {/* Серебристое кольцо безеля */}
            <rect x="27.5" y="18.5" width="2" height="16" rx="0.5" fill="#cbd5e1" />
            {/* Линза излучателя */}
            <ellipse cx="29" cy="26.5" rx="1.2" ry="7" fill="#fef08a" />
          </g>
          {/* Световые искры луча */}
          <circle cx="36" cy="12" r="1.2" fill="#fef08a" />
          <circle cx="33" cy="20" r="1" fill="#fef08a" />
        </g>
      );

    case 'teemo':
      // 💀 SKELETON KEY (Скелетный Ключ из DOORS): Старинный кованый ключ с черепом на навершии и резной бородкой
      return (
        <g>
          {/* Неоновый ореол ключа */}
          <circle cx="20" cy="11" r="10" fill="#10b981" opacity="0.2" />
          {/* Череп на навершии ключа (Skeleton Key Bow) */}
          <ellipse cx="20" cy="11" rx="7" ry="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          {/* Челюсть черепа */}
          <rect x="17.5" y="15" width="5" height="3" rx="0.5" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
          {/* Глазницы черепа */}
          <circle cx="17.5" cy="10.5" r="1.7" fill="#1c1917" />
          <circle cx="22.5" cy="10.5" r="1.7" fill="#1c1917" />
          {/* Треугольный носик */}
          <polygon points="20,12.5 19,14 21,14" fill="#1c1917" />
          {/* Швы черепа */}
          <line x1="20" y1="5.5" x2="20" y2="8" stroke="#78350f" strokeWidth="0.8" />
          {/* Стержень ключа */}
          <rect x="18.5" y="17.5" width="3" height="17" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
          {/* Декоративное кольцо на стержне */}
          <ellipse cx="20" cy="19" rx="3" ry="1.2" fill="#facc15" stroke="#78350f" strokeWidth="0.6" />
          {/* Резная бородка старинного ключа с вырезами */}
          <path
            d="M21.5 27 H28 V30 H25 V32 H28.5 V35.5 H21.5 Z"
            fill="#d97706"
            stroke="#78350f"
            strokeWidth="0.8"
          />
          {/* Зеленые мистические искры */}
          <circle cx="26" cy="7" r="1" fill="#34d399" />
          <circle cx="12" cy="16" r="0.8" fill="#34d399" />
        </g>
      );

    case 'lux':
      // 🌌 GUIDING LIGHT (Свет-Проводник из DOORS): Небесная сияющая сфера духов, указывающая безопасные двери
      return (
        <g>
          {/* Внешнее небесное сияние */}
          <circle cx="20" cy="20" r="16" fill="#38bdf8" opacity="0.2" />
          <circle cx="20" cy="20" r="11" fill="#0284c7" opacity="0.4" />
          {/* Энергетическое ядро Guiding Light */}
          <circle cx="20" cy="20" r="7" fill="#7dd3fc" />
          <circle cx="20" cy="20" r="4" fill="#ffffff" />
          {/* Направляющие лучи света (4 стороны) */}
          <polygon points="20,3 21.5,16 20,18 18.5,16" fill="#e0f2fe" />
          <polygon points="20,37 21.5,24 20,22 18.5,24" fill="#e0f2fe" />
          <polygon points="3,20 16,18.5 18,20 16,21.5" fill="#e0f2fe" />
          <polygon points="37,20 24,18.5 22,20 24,21.5" fill="#e0f2fe" />
          {/* Диагональные лучики */}
          <polygon points="7,7 17,17 15,19 5,9" fill="#bae6fd" opacity="0.8" />
          <polygon points="33,7 23,17 25,19 35,9" fill="#bae6fd" opacity="0.8" />
          {/* Парящие небесные частицы */}
          <circle cx="10" cy="28" r="1.2" fill="#ffffff" />
          <circle cx="30" cy="29" r="1.5" fill="#ffffff" />
          <circle cx="28" cy="11" r="1" fill="#bae6fd" />
        </g>
      );

    case 'blitzcrank':
      // 💊 VITAMINS (Витамины из DOORS): Оранжевая полупрозрачная баночка с молнией, дающая бешеный спринт
      return (
        <g>
          {/* Неоновый ореол скорости */}
          <circle cx="20" cy="22" r="14" fill="#ff5722" opacity="0.2" />
          {/* Белая ребристая крышка флакона */}
          <rect x="14" y="6" width="12" height="4.5" rx="1" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="16" y1="7" x2="16" y2="9.5" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="18" y1="7" x2="18" y2="9.5" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="20" y1="7" x2="20" y2="9.5" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="22" y1="7" x2="22" y2="9.5" stroke="#cbd5e1" strokeWidth="0.8" />
          <line x1="24" y1="7" x2="24" y2="9.5" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Горлышко бутылки */}
          <rect x="15" y="10.5" width="10" height="2" fill="#ea580c" />
          {/* Янтарно-оранжевая банка с витаминами */}
          <rect x="11" y="12.5" width="18" height="22" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
          {/* Блик на стекле/пластике */}
          <path d="M13 15 L13 31" stroke="#fdba74" strokeWidth="1.2" strokeLinecap="round" />
          {/* Белая этикетка на банке */}
          <rect x="13.5" y="16.5" width="13" height="13" rx="1.5" fill="#ffffff" stroke="#e2e8f0" strokeWidth="0.6" />
          {/* Яркая молния скорости на этикетке */}
          <polygon
            points="21,17.5 16.5,23 20,23 18.5,28 23.5,21.5 20,21.5"
            fill="#facc15"
            stroke="#ea580c"
            strokeWidth="0.6"
          />
          {/* Полосы скорости от бега */}
          <line x1="5" y1="18" x2="9" y2="18" stroke="#ff5722" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="24" x2="8" y2="24" stroke="#ff5722" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="6" y1="30" x2="9" y2="30" stroke="#ff5722" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );

    case 'vi':
      // 🗝️ LOCKPICK (Отмычки из DOORS): Скрещенные стальные отмычки с натяжителем и замочной скважиной
      return (
        <g>
          {/* Неоновый фиолетовый ореол замка */}
          <circle cx="20" cy="20" r="14" fill="#a855f7" opacity="0.2" />
          {/* Фон замка */}
          <rect x="13" y="18" width="14" height="14" rx="3" fill="#581c87" stroke="#9333ea" strokeWidth="1" />
          {/* Дужка замка */}
          <path
            d="M15 18 V12 C15 8 25 8 25 12 V18"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Золотая замочная скважина */}
          <circle cx="20" cy="23" r="2.2" fill="#facc15" />
          <polygon points="19,23.5 21,23.5 21.5,28 18.5,28" fill="#facc15" />
          {/* Первая отмычка: крючок с фиолетовой ручкой */}
          <line x1="7" y1="35" x2="28" y2="8" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M28 8 Q32 6 33 10" fill="none" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="6" y="30" width="7" height="3" rx="1" transform="rotate(-52 8 32)" fill="#a855f7" />
          {/* Вторая отмычка: натяжитель L-wrench */}
          <path
            d="M33 34 L18 13 L14 14"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Искорки взлома */}
          <circle cx="29" cy="14" r="1.2" fill="#e9d5ff" />
        </g>
      );

    case 'ashe':
      // 🕯️ CANDLE (Свеча-Детектор из DOORS): Медный подсвечник со свечой; пламя горит сине-бирюзовым при приближении монстра
      return (
        <g>
          {/* Мистический ореол синего детектора */}
          <circle cx="20" cy="9" r="9" fill="#2dd4bf" opacity="0.25" />
          {/* Медное блюдце-подставка подсвечника */}
          <ellipse cx="20" cy="34" rx="13" ry="3.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.8" />
          <ellipse cx="20" cy="33.5" rx="8" ry="2" fill="#eab308" />
          {/* Круглая ручка для пальца сбоку */}
          <path
            d="M8 32 C4 30 4 24 8 22 C11 24 11 30 8 32 Z"
            fill="none"
            stroke="#ca8a04"
            strokeWidth="2.2"
          />
          {/* Восковой цилиндр белой свечи */}
          <rect x="17" y="14" width="6" height="19" rx="1" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Подтек воска по боку свечи */}
          <path d="M17 18 C16 21 16 24 17 25" stroke="#e2e8f0" strokeWidth="1.6" strokeLinecap="round" />
          {/* Черный фитиль */}
          <line x1="20" y1="14" x2="20" y2="11" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
          {/* Призрачное сине-бирюзовое пламя детекции */}
          <path d="M20 2 C16 6 15 11 20 11.5 C25 11 24 6 20 2 Z" fill="#2dd4bf" />
          <path d="M20 4.5 C17.5 7.5 17.5 10.5 20 11 C22.5 10.5 22.5 7.5 20 4.5 Z" fill="#a7f3d0" />
          <circle cx="20" cy="9" r="1.2" fill="#ffffff" />
          {/* Волны тревожного детектора */}
          <path d="M13 6 C11 8 11 11 13 13" stroke="#2dd4bf" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M27 6 C29 8 29 11 27 13" stroke="#2dd4bf" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      );

    case 'darius':
      // ✂️ SHEARS (Секатор из DOORS): Мощные металлические ножницы для расчистки ядовитых лиан в теплице
      return (
        <g>
          {/* Ореол стальных ножниц */}
          <circle cx="20" cy="20" r="14" fill="#ef4444" opacity="0.15" />
          {/* Лезвие 1 (загнутый крюк) */}
          <path
            d="M19 19 C17 13 18 7 24 4 C21 9 22 15 19 19 Z"
            fill="#94a3b8"
            stroke="#334155"
            strokeWidth="0.8"
          />
          {/* Лезвие 2 (противоположное) */}
          <path
            d="M21 19 C23 13 22 7 16 4 C19 9 18 15 21 19 Z"
            fill="#cbd5e1"
            stroke="#334155"
            strokeWidth="0.8"
          />
          {/* Центральный осевой шарнир */}
          <circle cx="20" cy="19.5" r="2.2" fill="#facc15" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="20" cy="19.5" r="1" fill="#451a03" />
          {/* Центральная возвратная пружина */}
          <path d="M18 21 C19 23 21 23 22 21" stroke="#64748b" strokeWidth="1.5" fill="none" />
          {/* Красные рукоятки секатора с резиновыми накладками */}
          <path d="M18 21.5 L10 34" stroke="#dc2626" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M18 21.5 L10 34" stroke="#f87171" strokeWidth="1" strokeLinecap="round" />
          <path d="M22 21.5 L30 34" stroke="#dc2626" strokeWidth="3.6" strokeLinecap="round" />
          <path d="M22 21.5 L30 34" stroke="#f87171" strokeWidth="1" strokeLinecap="round" />
          {/* Срезанные зеленые листики оранжереи */}
          <path d="M27 8 C31 6 33 10 29 11 Z" fill="#22c55e" />
          <path d="M12 9 C8 7 6 11 10 12 Z" fill="#22c55e" />
        </g>
      );

    case 'zed':
      // 🩹 BANDAGE PACK (Аптечка / Бинты из DOORS): Полевая тканевая сумка с красным медицинским крестом и рулоном бинта
      return (
        <g>
          {/* Неоновый ореол медицины */}
          <circle cx="20" cy="20" r="14" fill="#f43f5e" opacity="0.2" />
          {/* Ремешок сумки */}
          <path d="M13 13 C13 8 25 8 25 13" fill="none" stroke="#94a3b8" strokeWidth="1.8" />
          {/* Белый плотный медицинский подсумок */}
          <rect x="8" y="13" width="22" height="18" rx="3.5" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          {/* Верхний клапан сумки на липучке */}
          <rect x="8" y="13" width="22" height="6" rx="2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
          {/* Красный медицинский крест (Red Cross) */}
          <rect x="17" y="20" width="4" height="9" rx="0.6" fill="#ef4444" />
          <rect x="14.5" y="22.5" width="9" height="4" rx="0.6" fill="#ef4444" />
          {/* Рулон белого бинта сбоку */}
          <ellipse cx="30" cy="26" rx="4" ry="5.5" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
          <ellipse cx="30" cy="26" rx="2" ry="3" fill="#e2e8f0" />
          <circle cx="30" cy="26" r="0.8" fill="#64748b" />
          {/* Маленькие сердечки исцеления */}
          <path
            d="M26 8 C25 6 27 5 28 6 C29 5 31 6 30 8 L28 10 Z"
            fill="#f43f5e"
            transform="scale(0.8) translate(3, -1)"
          />
        </g>
      );

    case 'garen':
      // ⚡ SHAKELIGHT (Динамо-Фонарик из DOORS): Зеленый прозрачный фонарь с индукционной катушкой и бесконечной зарядкой
      return (
        <g>
          {/* Неоновый лаймовый ореол */}
          <circle cx="20" cy="20" r="14" fill="#84cc16" opacity="0.25" />
          {/* Световой конус излучения вверх */}
          <polygon points="15,5 9,1 31,1 25,5" fill="#bef264" opacity="0.4" />
          {/* Прозрачный зеленый корпус фонарика */}
          <rect
            x="13.5"
            y="7"
            width="13"
            height="26"
            rx="4.5"
            fill="#65a30d"
            opacity="0.85"
            stroke="#365314"
            strokeWidth="1"
          />
          {/* Верхняя фара */}
          <rect x="13" y="4" width="14" height="4" rx="1.5" fill="#365314" />
          <rect x="15" y="5" width="10" height="2" rx="0.5" fill="#bef264" />
          {/* Внутренняя полость с медной катушкой индукции */}
          <rect x="15.5" y="13" width="9" height="13" rx="1.5" fill="#14532d" opacity="0.7" />
          {/* Медные витки катушки */}
          <line x1="16" y1="15" x2="24" y2="15" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16" y1="17.5" x2="24" y2="17.5" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16" y1="20" x2="24" y2="20" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="16" y1="22.5" x2="24" y2="22.5" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
          {/* Бегающий магнитный сердечник */}
          <rect x="18" y="16" width="4" height="7" rx="1" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.6" />
          {/* Стрелочки тряски (Shake motion) */}
          <path d="M9 15 L7 18 L11 18" stroke="#84cc16" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M31 23 L33 20 L29 20" stroke="#84cc16" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'asol':
      // 🏺 CURIOUS LIGHT / RIFT JAR (Банка Разлома из DOORS): Стеклянная банка с пойманным желтым звездным светом и вихрем
      return (
        <g>
          {/* Неоновый ореол космического Разлома */}
          <circle cx="20" cy="20" r="15" fill="#d946ef" opacity="0.25" />
          {/* Пробковая крышка банки */}
          <rect x="16" y="5" width="8" height="3" rx="0.6" fill="#b45309" stroke="#78350f" strokeWidth="0.6" />
          {/* Стеклянное горлышко */}
          <rect x="14" y="8" width="12" height="2.5" rx="1" fill="#e2e8f0" opacity="0.8" stroke="#94a3b8" strokeWidth="0.6" />
          {/* Прозрачная стеклянная банка с фиолетовым свечением Разлома */}
          <rect
            x="11"
            y="10.5"
            width="18"
            height="23"
            rx="4"
            fill="#a855f7"
            opacity="0.2"
            stroke="#c084fc"
            strokeWidth="1.2"
          />
          {/* Блик на стекле банки */}
          <line x1="13" y1="13" x2="13" y2="30" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          {/* Сияющая звезда Любопытного Света (Curious Light) внутри банки */}
          <polygon
            points="20,15 21.5,19 25,19.5 22.5,22 23.5,26 20,24 16.5,26 17.5,22 15,19.5 18.5,19"
            fill="#facc15"
            stroke="#ea580c"
            strokeWidth="0.8"
          />
          <circle cx="20" cy="21" r="2" fill="#ffffff" />
          {/* Космические искры и спирали Разлома */}
          <circle cx="16" cy="14" r="1" fill="#fde047" />
          <circle cx="24" cy="28" r="1.2" fill="#fde047" />
          <circle cx="15" cy="27" r="0.8" fill="#e879f9" />
          <circle cx="25" cy="14" r="0.8" fill="#38bdf8" />
        </g>
      );

    case 'heimer':
      // ⏰ ALARM CLOCK (Заводной Будильник из DOORS): Механический двухзвонковый будильник для отвлечения Фигуры
      return (
        <g>
          {/* Неоновый ореол будильника */}
          <circle cx="20" cy="22" r="14" fill="#eab308" opacity="0.2" />
          {/* Два верхних звонковых колокольчика */}
          <circle cx="12" cy="10" r="4.5" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          <circle cx="28" cy="10" r="4.5" fill="#facc15" stroke="#854d0e" strokeWidth="0.8" />
          {/* Центральный молоточек */}
          <line x1="20" y1="10" x2="20" y2="6" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="6" r="1.5" fill="#94a3b8" />
          {/* Ножки будильника */}
          <line x1="13" y1="32" x2="10" y2="37" stroke="#854d0e" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="27" y1="32" x2="30" y2="37" stroke="#854d0e" strokeWidth="2.5" strokeLinecap="round" />
          {/* Золотистый корпус часов */}
          <circle cx="20" cy="22" r="12" fill="#eab308" stroke="#854d0e" strokeWidth="1.2" />
          {/* Белый циферблат */}
          <circle cx="20" cy="22" r="9.5" fill="#ffffff" />
          {/* Метки часов */}
          <circle cx="20" cy="14.5" r="0.8" fill="#1e293b" />
          <circle cx="20" cy="29.5" r="0.8" fill="#1e293b" />
          <circle cx="12.5" cy="22" r="0.8" fill="#1e293b" />
          <circle cx="27.5" cy="22" r="0.8" fill="#1e293b" />
          {/* Стрелки на 10:10 */}
          <line x1="20" y1="22" x2="16" y2="18" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="20" y1="22" x2="25" y2="18" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="20" cy="22" r="1.2" fill="#ef4444" />
          {/* Звуковые волны звона (Звенит в библиотеке!) */}
          <path d="M5 8 C3 11 3 15 5 18" stroke="#eab308" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M35 8 C37 11 37 15 35 18" stroke="#eab308" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      );

    case 'katarina':
      // 🔋 BATTERIES (Батарейки из DOORS): Пара синих цилиндрических батареек с желтым верхом и молниями
      return (
        <g>
          {/* Неоновый ореол батареек */}
          <circle cx="20" cy="20" r="14" fill="#06b6d4" opacity="0.2" />
          {/* Первая батарейка (левая) */}
          <rect x="9" y="11" width="9" height="21" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
          {/* Плюсовой контакт */}
          <rect x="12" y="9" width="3" height="2.2" rx="0.5" fill="#94a3b8" />
          {/* Золотая верхняя полоса */}
          <rect x="9" y="11" width="9" height="5" fill="#facc15" />
          {/* Молния заряда */}
          <path d="M14 19 L12 23 L15 23 L13 28" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Вторая батарейка (правая, чуть смещена) */}
          <rect x="22" y="13" width="9" height="21" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="0.8" />
          {/* Плюсовой контакт */}
          <rect x="25" y="11" width="3" height="2.2" rx="0.5" fill="#94a3b8" />
          {/* Золотая верхняя полоса */}
          <rect x="22" y="13" width="9" height="5" fill="#facc15" />
          {/* Молния заряда */}
          <path d="M27 21 L25 25 L28 25 L26 30" stroke="#facc15" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          {/* Электрические разряды */}
          <polygon points="19,6 20,9 18,9.5 21,12 17,11" fill="#00f0ff" />
        </g>
      );

    default:
      return <circle cx="20" cy="20" r="12" fill="#38bdf8" />;
  }
}
