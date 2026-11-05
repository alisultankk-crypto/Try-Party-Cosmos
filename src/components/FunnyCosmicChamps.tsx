import React from 'react';
import { OriginalTileType, MagicEffectType, TileType } from '../types/game';

interface ChampionMeta {
  name: string;
  title: string;
  magic: MagicEffectType;
  accentColor: string;
  glowColor: string;
  funnyName: string;
}

export const CHAMPION_METAS: Record<OriginalTileType, ChampionMeta> = {
  yasuo: { name: 'Ясуо', funnyName: 'Хасаги 0/10 🌪️', title: 'Непрощённый', magic: 'wind', accentColor: '#38bdf8', glowColor: 'rgba(56, 189, 248, 0.7)' },
  ahri: { name: 'Ари', funnyName: 'Лисичка-Хитрюга 🦊', title: 'Девятихвостая лиса', magic: 'arcane', accentColor: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.7)' },
  jinx: { name: 'Джинкс', funnyName: 'Психо-Ракета 🚀', title: 'Хулиганка', magic: 'fire', accentColor: '#06b6d4', glowColor: 'rgba(6, 182, 212, 0.7)' },
  teemo: { name: 'Тимо', funnyName: 'Капитан Гриб 🍄', title: 'Шустрый скаут', magic: 'wind', accentColor: '#84cc16', glowColor: 'rgba(132, 204, 22, 0.7)' },
  garen: { name: 'Гарен', funnyName: 'Гарен-Вертолет ⚔️', title: 'Мощь Демасии', magic: 'starlight', accentColor: '#fbbf24', glowColor: 'rgba(251, 191, 36, 0.7)' },
  zed: { name: 'Зед', funnyName: 'Ниндзя в Очках 🕶️', title: 'Мастер теней', magic: 'void', accentColor: '#ef4444', glowColor: 'rgba(239, 68, 68, 0.7)' },
  blitzcrank: { name: 'Блицкранк', funnyName: 'Зубастик-Робот 🤖', title: 'Паровой голем', magic: 'arcane', accentColor: '#eab308', glowColor: 'rgba(234, 179, 8, 0.7)' },
  vi: { name: 'Вай', funnyName: 'Вай-Мегакулак 🥊', title: 'Миротворец', magic: 'fire', accentColor: '#f43f5e', glowColor: 'rgba(244, 63, 94, 0.7)' },
  ashe: { name: 'Эш', funnyName: 'Сосулька Эш ❄️', title: 'Ледяная лучница', magic: 'frost', accentColor: '#67e8f9', glowColor: 'rgba(103, 232, 249, 0.7)' },
  darius: { name: 'Дариус', funnyName: 'Злюка Дариус 🪓', title: 'Рука Ноксуса', magic: 'fire', accentColor: '#b91c1c', glowColor: 'rgba(185, 28, 28, 0.7)' },
  asol: { name: 'Аурелион Сол', funnyName: 'Космо-Дракоша 🌌', title: 'Создатель звёзд', magic: 'void', accentColor: '#818cf8', glowColor: 'rgba(129, 140, 248, 0.8)' },
  lux: { name: 'Люкс', funnyName: 'Люкс-Вспышка ✨', title: 'Леди сияния', magic: 'starlight', accentColor: '#fef08a', glowColor: 'rgba(254, 240, 138, 0.8)' },
  heimer: { name: 'Хеймердингер', funnyName: 'Мега-Афро Учёный 🧪', title: 'Изобретатель', magic: 'arcane', accentColor: '#f97316', glowColor: 'rgba(249, 115, 22, 0.7)' },
  katarina: { name: 'Катарина', funnyName: 'Кинжал-Юла 🗡️', title: 'Зловещий клинок', magic: 'fire', accentColor: '#dc2626', glowColor: 'rgba(220, 38, 38, 0.7)' },
};

export const FunnyCosmicChamps: React.FC<{ type: TileType; isCovered?: boolean }> = ({
  type,
  isCovered = false,
}) => {
  const iconClass = isCovered ? 'opacity-60 filter grayscale-[0.4] contrast-75' : 'opacity-100 hover:scale-110';

  return (
    <svg
      viewBox="0 0 40 40"
      className={`w-10 h-10 transition-transform duration-150 select-none ${iconClass}`}
    >
      {renderFunnyDrawing(type)}
    </svg>
  );
};

function renderFunnyDrawing(type: TileType) {
  switch (type) {
    case 'yasuo':
      // 🌪️ ЯСУО 0/10: Огромный развевающийся синий самурайский хвост, травинка в зубах, свирепый прищур
      return (
        <g>
          {/* Огромный развевающийся хвост волос */}
          <path d="M22 14C28 4 36 2 38 6C36 12 30 14 26 18Z" fill="#18181b" />
          <path d="M24 12C30 5 35 4 37 7" stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" />
          {/* Волосы */}
          <circle cx="20" cy="18" r="11" fill="#27272a" />
          {/* Синяя повязка с узлом */}
          <rect x="10" y="14" width="20" height="4" rx="2" fill="#0284c7" />
          <circle cx="10" cy="16" r="2" fill="#38bdf8" />
          {/* Лицо */}
          <circle cx="20" cy="22" r="8" fill="#fed7aa" />
          {/* Сердитые густые брови */}
          <path d="M14 18L18 20M26 18L22 20" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          {/* Прищуренные смешные глаза */}
          <circle cx="16" cy="21" r="1.5" fill="#000" />
          <circle cx="24" cy="21" r="1.5" fill="#000" />
          {/* Шрам на носу */}
          <line x1="19" y1="20" x2="21" y2="23" stroke="#ea580c" strokeWidth="1.2" />
          {/* Травинка/соломинка во рту */}
          <path d="M19 25C17 27 12 28 9 27" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="27" r="1.2" fill="#86efac" />
          {/* Синий шарф ветра */}
          <path d="M12 28C16 32 24 32 28 28C26 34 14 34 12 28Z" fill="#0369a1" />
        </g>
      );

    case 'ahri':
      // 🦊 АРИ: Пухлые розовые щёчки, один глаз-сердечко подмигивает, лисьи ушки
      return (
        <g>
          {/* Лисьи Ушки с розовым пухом */}
          <polygon points="10,5 16,16 6,15" fill="#18181b" />
          <polygon points="10,7 14,14 8,14" fill="#f43f5e" />
          <polygon points="30,5 24,16 34,15" fill="#18181b" />
          <polygon points="30,7 26,14 32,14" fill="#f43f5e" />
          {/* Черные локоны */}
          <circle cx="20" cy="20" r="12" fill="#1e1b4b" />
          {/* Мордочка / Круглое лицо */}
          <circle cx="20" cy="22" r="9" fill="#fde68a" />
          {/* Лисьи полосочки на щеках */}
          <line x1="12" y1="22" x2="9" y2="22" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="12" y1="24" x2="10" y2="25" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="28" y1="22" x2="31" y2="22" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="28" y1="24" x2="30" y2="25" stroke="#e11d48" strokeWidth="1.2" strokeLinecap="round" />
          {/* Левый глаз подмигивает */}
          <path d="M15 21C16 19 18 19 19 21" stroke="#be185d" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Правый глаз — сияющее сердечко! */}
          <path d="M23 20C22 19 23 18 24 19C25 18 26 19 25 20L24 21Z" fill="#ec4899" transform="scale(1.4) translate(-4, -4)" />
          {/* Розовые щёчки румянца */}
          <ellipse cx="14" cy="24" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="26" cy="24" rx="2.5" ry="1.5" fill="#f43f5e" opacity="0.6" />
          {/* Улыбочка с язычком */}
          <path d="M18 26C19 28 21 28 22 26" stroke="#9f1239" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="34" r="4" fill="#38bdf8" />
          <circle cx="20" cy="34" r="2" fill="#ffffff" />
        </g>
      );

    case 'jinx':
      // 💣 ДЖИНКС: Спиральные сумасшедшие глаза, высунутый язык, ракета на макушке!
      return (
        <g>
          {/* Ракета "Акула" торчит из прически */}
          <path d="M24 2L32 6L28 10Z" fill="#f43f5e" />
          <circle cx="28" cy="6" r="1.5" fill="#facc15" />
          {/* Неоново-синие косички в стороны */}
          <path d="M10 16C4 18 2 26 4 34" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M30 16C36 18 38 26 36 34" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Челка */}
          <circle cx="20" cy="18" r="11" fill="#06b6d4" />
          {/* Белое безумное лицо */}
          <circle cx="20" cy="20" r="8.5" fill="#f8fafc" />
          {/* Огромные розовые глаза со спиралями */}
          <circle cx="16" cy="18" r="3.8" fill="#f43f5e" />
          <circle cx="16" cy="18" r="2" fill="#ffffff" />
          <circle cx="16" cy="18" r="1" fill="#000000" />
          <circle cx="24" cy="18" r="3.8" fill="#f43f5e" />
          <circle cx="24" cy="18" r="2" fill="#ffffff" />
          <circle cx="24" cy="18" r="1" fill="#000000" />
          {/* Сумасшедшая широченная улыбка */}
          <path d="M14 23C16 28 24 28 26 23" fill="#881337" stroke="#1e293b" strokeWidth="1.2" />
          <rect x="16" y="23" width="8" height="2" fill="#ffffff" />
          {/* Высунутый розовый язык */}
          <ellipse cx="20" cy="26" rx="2.5" ry="3.5" fill="#fb7185" />
        </g>
      );

    case 'teemo':
      // 🍄 ТИМО: Толстый колобок-скаут с хитрющей мордочкой и огромным ядовитым грибом
      return (
        <g>
          {/* Огромная зеленая шляпа-гриб скаута */}
          <path d="M6 16C6 8 14 3 20 3C26 3 34 8 34 16Z" fill="#15803d" />
          <ellipse cx="20" cy="16" rx="16" ry="4" fill="#166534" />
          {/* Красное перо на шляпе */}
          <path d="M26 2C27 6 30 7 32 5C30 9 27 10 26 12Z" fill="#ef4444" />
          {/* Медные очки на шляпе */}
          <circle cx="15" cy="12" r="3.5" fill="#b45309" />
          <circle cx="15" cy="12" r="2" fill="#38bdf8" />
          <circle cx="25" cy="12" r="3.5" fill="#b45309" />
          <circle cx="25" cy="12" r="2" fill="#38bdf8" />
          {/* Пухлое довольное лицо хомяка */}
          <circle cx="20" cy="24" r="9" fill="#fde68a" />
          <circle cx="10" cy="23" r="3" fill="#fbbf24" />
          <circle cx="30" cy="23" r="3" fill="#fbbf24" />
          {/* Хитрющие закрытые глаза-дуги */}
          <path d="M14 22C15 20 17 20 18 22" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M22 22C23 20 25 20 26 22" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Черный круглый носик */}
          <ellipse cx="20" cy="24" rx="2" ry="1.5" fill="#1c1917" />
          {/* Самодовольная улыбочка */}
          <path d="M17 27C19 29 21 29 23 27" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Грибочек в лапке */}
          <path d="M7 28C7 24 13 24 13 28Z" fill="#dc2626" />
          <rect x="9.5" y="28" width="1.5" height="4" fill="#fef08a" />
        </g>
      );

    case 'garen':
      // ⚔️ ГАРЕН: Квадратная челюсть, синий шарф, золотые эполеты, крутящийся меч
      return (
        <g>
          {/* Волосы воина */}
          <rect x="13" y="6" width="14" height="6" rx="2" fill="#78350f" />
          {/* Квадратная богатырская голова */}
          <rect x="13" y="11" width="14" height="12" rx="3" fill="#fed7aa" />
          {/* Суровые монобровные брови */}
          <path d="M14 13L19 15M26 13L21 15" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
          {/* Серьезные бусинки-глаза */}
          <circle cx="16" cy="17" r="1.6" fill="#0284c7" />
          <circle cx="24" cy="17" r="1.6" fill="#0284c7" />
          {/* Мужественный подбородок */}
          <line x1="18" y1="21" x2="22" y2="21" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          {/* Синий демасийский шарф */}
          <rect x="10" y="23" width="20" height="5" rx="2" fill="#1d4ed8" />
          {/* Золотые наплечники гиганты */}
          <polygon points="4,25 12,23 10,33 2,30" fill="#facc15" />
          <polygon points="36,25 28,23 30,33 38,30" fill="#facc15" />
          {/* Маленький меч крутится */}
          <rect x="19" y="27" width="2" height="10" fill="#e2e8f0" />
          <rect x="16" y="30" width="8" height="2" fill="#facc15" />
        </g>
      );

    case 'zed':
      // 🕶️ ЗЕД В ОЧКАХ: Ниндзя в темных крутых очках, светящийся визор, сюрикен
      return (
        <g>
          {/* Металлический шлем ниндзя со шипами */}
          <polygon points="20,4 26,10 14,10" fill="#64748b" />
          <rect x="10" y="9" width="20" height="15" rx="4" fill="#1e293b" />
          {/* Крутые черные очки "Deal With It" */}
          <rect x="11" y="13" width="8" height="4" rx="1" fill="#000" />
          <rect x="21" y="13" width="8" height="4" rx="1" fill="#000" />
          <rect x="18" y="14" width="4" height="2" fill="#000" />
          {/* Алое неоновое свечение из-под очков */}
          <line x1="12" y1="15" x2="17" y2="15" stroke="#ef4444" strokeWidth="2" />
          <line x1="22" y1="15" x2="27" y2="15" stroke="#ef4444" strokeWidth="2" />
          {/* Железная маска-респиратор */}
          <polygon points="15,19 25,19 23,26 17,26" fill="#94a3b8" />
          <line x1="20" y1="20" x2="20" y2="25" stroke="#475569" strokeWidth="1.5" />
          {/* Красный шарф ниндзя */}
          <path d="M12 26C16 30 24 30 28 26" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      );

    case 'blitzcrank':
      // 🤖 БЛИЦКРАНК: Золотой робот с огромной зубастой улыбкой и пружинными глазками
      return (
        <g>
          {/* Труба на макушке с дымком */}
          <rect x="25" y="3" width="4" height="6" fill="#78350f" />
          <circle cx="27" cy="2" r="2" fill="#e2e8f0" opacity="0.6" />
          {/* Золотая голова-ведро */}
          <rect x="8" y="8" width="24" height="20" rx="6" fill="#facc15" />
          <rect x="10" y="10" width="20" height="16" rx="4" fill="#eab308" />
          {/* Огромные круглые лампочки-глаза */}
          <circle cx="15" cy="14" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="15" cy="14" r="1.5" fill="#ffffff" />
          <circle cx="25" cy="14" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="25" cy="14" r="1.5" fill="#ffffff" />
          {/* Широкая зубастая металлическая улыбка */}
          <rect x="12" y="20" width="16" height="5" rx="2" fill="#1c1917" />
          <line x1="16" y1="20" x2="16" y2="25" stroke="#facc15" strokeWidth="1.5" />
          <line x1="20" y1="20" x2="20" y2="25" stroke="#facc15" strokeWidth="1.5" />
          <line x1="24" y1="20" x2="24" y2="25" stroke="#facc15" strokeWidth="1.5" />
          {/* Корпус */}
          <rect x="10" y="28" width="20" height="7" rx="3" fill="#b45309" />
        </g>
      );

    case 'vi':
      // 🥊 ВАЙ: Розовые шипы, надутые губки и гигантские боксёрские перчатки
      return (
        <g>
          {/* Очки на лбу */}
          <rect x="13" y="6" width="6" height="3" rx="1" fill="#f59e0b" />
          <rect x="21" y="6" width="6" height="3" rx="1" fill="#f59e0b" />
          {/* Торчащие во все стороны розовые волосы */}
          <circle cx="20" cy="14" r="10" fill="#ec4899" />
          <polygon points="9,14 4,8 12,10" fill="#f43f5e" />
          <polygon points="31,14 36,8 28,10" fill="#f43f5e" />
          {/* Личико */}
          <circle cx="20" cy="18" r="8" fill="#fed7aa" />
          {/* Тату "VI" под глазом */}
          <text x="12" y="22" fill="#be185d" fontSize="5" fontWeight="bold">VI</text>
          {/* Сердитые милые глазки */}
          <circle cx="17" cy="17" r="1.6" fill="#0284c7" />
          <circle cx="23" cy="17" r="1.6" fill="#0284c7" />
          {/* Надутый ротик (angry pout) */}
          <ellipse cx="20" cy="22" rx="1.8" ry="1.2" fill="#9f1239" />
          {/* Гигантские золотые хекстек-перчатки */}
          <circle cx="9" cy="27" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="31" cy="27" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
        </g>
      );

    case 'ashe':
      // ❄️ ЭШ-СОСУЛЬКА: Дрожит от холода, синий носик, ледяная шапка-капюшон
      return (
        <g>
          {/* Тёмно-синий капюшон */}
          <path d="M10 12C10 5 15 2 20 2C25 2 30 5 30 12C32 20 30 26 20 28C10 26 8 20 10 12Z" fill="#0f172a" />
          {/* Белые ледяные волосы */}
          <rect x="13" y="10" width="14" height="6" fill="#e0f2fe" />
          {/* Бледное личико */}
          <circle cx="20" cy="18" r="7.5" fill="#fef08a" opacity="0.9" />
          {/* Замерзшие круглые глазки */}
          <circle cx="17" cy="17" r="2" fill="#38bdf8" />
          <circle cx="23" cy="17" r="2" fill="#38bdf8" />
          <circle cx="17" cy="17" r="0.8" fill="#fff" />
          <circle cx="23" cy="17" r="0.8" fill="#fff" />
          {/* Синий замерзший носик */}
          <circle cx="20" cy="19.5" r="1.5" fill="#0284c7" />
          {/* Дрожащий ротик */}
          <path d="M18 22L19 23L20 22L21 23L22 22" stroke="#0369a1" strokeWidth="1.2" strokeLinecap="round" />
          {/* Снежинки вокруг */}
          <text x="5" y="12" fill="#38bdf8" fontSize="8">❄</text>
          <text x="31" y="14" fill="#38bdf8" fontSize="6">❄</text>
        </g>
      );

    case 'darius':
      // 🪓 ДАРИУС: Маленький злюка с седой прядью, шрамом и огромным топором
      return (
        <g>
          {/* Чёрные волосы с седой прядью */}
          <path d="M12 14C12 6 28 6 28 14Z" fill="#18181b" />
          <path d="M14 8L16 13" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
          {/* Свирепое лицо */}
          <rect x="12" y="13" width="16" height="12" rx="3" fill="#fed7aa" />
          {/* Шрам через глаз */}
          <line x1="15" y1="11" x2="17" y2="19" stroke="#dc2626" strokeWidth="1.5" />
          {/* Очень сердитые брови и глаза */}
          <path d="M14 15L18 17M26 15L22 17" stroke="#000" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="17" cy="18" r="1.4" fill="#7f1d1d" />
          <circle cx="23" cy="18" r="1.4" fill="#7f1d1d" />
          {/* Оскал */}
          <line x1="16" y1="22" x2="24" y2="22" stroke="#7f1d1d" strokeWidth="2" strokeLinecap="round" />
          {/* Ноксианский шипастый воротник */}
          <polygon points="6,26 14,24 10,34 5,30" fill="#7f1d1d" />
          <polygon points="34,26 26,24 30,34 35,30" fill="#7f1d1d" />
          {/* Красный топор */}
          <path d="M28 22L36 18L34 26Z" fill="#dc2626" />
        </g>
      );

    case 'asol':
      // 🌌 АУРЕЛИОН ДРАКОША: Маленький милый звёздный дракончик жуёт звезду в очках
      return (
        <g>
          {/* Космические фиолетовые рожки со звёздами */}
          <path d="M12 12C8 6 12 2 16 6" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M28 12C32 6 28 2 24 6" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Золотая звездочка на лбу */}
          <circle cx="20" cy="8" r="3" fill="#facc15" />
          {/* Круглая синяя драконья голова */}
          <circle cx="20" cy="18" r="10" fill="#312e81" />
          <circle cx="20" cy="18" r="8.5" fill="#4338ca" />
          {/* Золотые сияющие глаза-звёздочки */}
          <circle cx="16" cy="17" r="2.5" fill="#facc15" />
          <circle cx="16" cy="17" r="1" fill="#ffffff" />
          <circle cx="24" cy="17" r="2.5" fill="#facc15" />
          <circle cx="24" cy="17" r="1" fill="#ffffff" />
          {/* Жуёт маленькую сияющую комету */}
          <circle cx="20" cy="22" r="3" fill="#fde047" />
          <line x1="20" y1="22" x2="26" y2="25" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
          {/* Звёздная космическая пыль */}
          <circle cx="9" cy="25" r="1.5" fill="#c084fc" />
          <circle cx="31" cy="24" r="1.5" fill="#38bdf8" />
        </g>
      );

    case 'lux':
      // ✨ ЛЮКС-СОЛНЫШКО: Гипер-счастливая девочка в тиаре, стреляющая радугой
      return (
        <g>
          {/* Яркие золотисто-жёлтые волосы */}
          <circle cx="20" cy="17" r="11" fill="#facc15" />
          {/* Сияющая тиара */}
          <polygon points="15,8 20,4 25,8 23,10 17,10" fill="#e2e8f0" />
          <circle cx="20" cy="7" r="1.5" fill="#38bdf8" />
          {/* Лицо-колобок */}
          <circle cx="20" cy="20" r="8.5" fill="#fef08a" />
          {/* Глаза со звёздочками счастья! */}
          <circle cx="16" cy="18" r="3" fill="#0284c7" />
          <circle cx="16" cy="18" r="1.5" fill="#ffffff" />
          <circle cx="24" cy="18" r="3" fill="#0284c7" />
          <circle cx="24" cy="18" r="1.5" fill="#ffffff" />
          {/* Огромная сияющая улыбка */}
          <path d="M16 23C18 26 22 26 24 23" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" fill="none" />
          {/* Радужные лучи света */}
          <line x1="6" y1="8" x2="2" y2="4" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <line x1="34" y1="8" x2="38" y2="4" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="32" x2="20" y2="38" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'heimer':
      // 🧪 ХЕЙМЕРДИНГЕР: Гигантское оранжевое афро, круглые очки-спирали, усы-щётка
      return (
        <g>
          {/* Гигантское пышное афро в 3 раза больше тела */}
          <circle cx="14" cy="11" r="7" fill="#f97316" />
          <circle cx="26" cy="11" r="7" fill="#f97316" />
          <circle cx="20" cy="8" r="8" fill="#ea580c" />
          {/* Маленькое йордл-личико */}
          <circle cx="20" cy="20" r="7" fill="#fde68a" />
          {/* Огромные круглые очки профессора со спиралями */}
          <circle cx="15" cy="18" r="4.5" fill="#334155" />
          <circle cx="15" cy="18" r="3.5" fill="#38bdf8" />
          <circle cx="15" cy="18" r="1.5" fill="#0284c7" />
          <circle cx="25" cy="18" r="4.5" fill="#334155" />
          <circle cx="25" cy="18" r="3.5" fill="#38bdf8" />
          <circle cx="25" cy="18" r="1.5" fill="#0284c7" />
          {/* Роскошные коричневые усы-щётка */}
          <ellipse cx="20" cy="24" rx="7" ry="3.5" fill="#78350f" />
          <circle cx="20" cy="22" r="1.8" fill="#1c1917" />
          {/* Маленький галстук-бабочка */}
          <polygon points="17,30 23,30 20,28" fill="#dc2626" />
        </g>
      );

    case 'katarina':
      // 🗡️ КАТАРИНА: Огненно-рыжие волосы, боевой шрам, вертится как волчок с кинжалами
      return (
        <g>
          {/* Пылающие красные волосы */}
          <path d="M8 12C8 4 32 4 32 12C36 24 32 30 20 30C8 30 4 24 8 12Z" fill="#dc2626" />
          <circle cx="20" cy="16" r="8.5" fill="#fed7aa" />
          {/* Шрам через левый глаз */}
          <line x1="16" y1="10" x2="16" y2="20" stroke="#991b1b" strokeWidth="1.5" />
          {/* Хищные зеленые глаза кошки */}
          <ellipse cx="16" cy="16" rx="2" ry="1.5" fill="#15803d" />
          <ellipse cx="24" cy="16" rx="2" ry="1.5" fill="#15803d" />
          {/* Ехидная ухмылочка */}
          <path d="M18 20C20 22 23 21 24 20" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Два скрещенных кинжала */}
          <line x1="10" y1="24" x2="30" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="24" x2="10" y2="34" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="29" r="2" fill="#facc15" />
        </g>
      );

    default:
      return <circle cx="20" cy="20" r="12" fill="#38bdf8" />;
  }
}
