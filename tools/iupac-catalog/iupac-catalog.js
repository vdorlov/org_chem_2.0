/* ============================================================
   Справочник названий ИЮПАК с 3D-просмотром
   Экспортирует window.__renderIupacCatalog(containerEl)

   Все SDF-модели берутся из локальной папки репозитория
   (tools/iupac-catalog/3D_model/...).

   КЛЮЧЕВЫЕ МОМЕНТЫ:
   - ждём 400 мс после открытия модалки, пока завершится
     CSS-переход opacity, иначе WebGL-контекст создаётся
     в «невидимом» контейнере с нулевыми размерами;
   - контейнеру задаются фиксированные размеры в пикселях;
   - несколько повторных resize+render, чтобы поймать момент,
     когда layout окончательно устаканится.
   ============================================================ */
(function(){
  'use strict';

  /* ============================================================
     КАТАЛОГ ВЕЩЕСТВ
     ============================================================ */
  const CATALOG = [
    /* ---------------- АЛКАНЫ ---------------- */
    {
      id: 'alkany',
      title: 'Алканы',
      icon: '🔗',
      color: '#22d3ee',
      dir: 'tools/iupac-catalog/3D_model/Alkany/',
      items: [
        { name: 'Метан',              iupac: 'methane',             formula: 'CH₄',       file: 'Methan.sdf' },
        { name: 'Этан',               iupac: 'ethane',              formula: 'C₂H₆',      file: 'Eyhan.sdf' },
        { name: 'Пропан',             iupac: 'propane',             formula: 'C₃H₈',      file: 'Prophan.sdf' },
        { name: 'Бутан',              iupac: 'butane',              formula: 'C₄H₁₀',     file: 'Buthan.sdf' },
        { name: '2-Метилпропан',      iupac: '2-methylpropane',     formula: '(CH₃)₃CH',  file: '2-methylpropane.sdf' },
        { name: 'Пентан',             iupac: 'pentane',             formula: 'C₅H₁₂',     file: 'Pentane.sdf' },
        { name: '2-Метилбутан',       iupac: '2-methylbutane',      formula: 'C₅H₁₂',     file: '2-methylbutane.sdf' },
        { name: '2,2-Диметилпропан',  iupac: '2,2-dimethylpropane', formula: 'C₅H₁₂',     file: '2,2-dimethylpropan.sdf' },
        { name: 'Гексан',             iupac: 'hexane',              formula: 'C₆H₁₄',     file: 'Hexane.sdf' },
        { name: '2,2-Диметилбутан',   iupac: '2,2-dimethylbutane',  formula: 'C₆H₁₄',     file: '2,2-dimethylbuthane.sdf' },
        { name: 'Гептан',             iupac: 'heptane',             formula: 'C₇H₁₆',     file: 'Gepthane.sdf' },
        { name: 'Октан',              iupac: 'octane',              formula: 'C₈H₁₈',     file: 'Okthane.sdf' },
        { name: 'Нонан',              iupac: 'nonane',              formula: 'C₉H₂₀',     file: 'Nonane.sdf' },
        { name: 'Циклогексан',        iupac: 'cyclohexane',         formula: 'C₆H₁₂',     file: 'Cyklohexan.sdf' },
        { name: 'Метилциклогексан',   iupac: 'methylcyclohexane',   formula: 'C₇H₁₄',     file: 'Methylcyklohexan.sdf' },
        { name: 'Циклопропан',        iupac: 'cyclopropane',        formula: 'C₃H₆',      file: 'Cyklopropane.sdf' },
        { name: 'Циклобутан',         iupac: 'cyclobutane',         formula: 'C₄H₈',      file: 'Cyklobuthane.sdf' }
      ]
    },

    /* ---------------- АЛКЕНЫ ---------------- */
    {
      id: 'alkeny',
      title: 'Алкены',
      icon: '⚡',
      color: '#5b8def',
      dir: 'tools/iupac-catalog/3D_model/Alkeny/',
      items: [
        { name: 'Этен (этилен)',    iupac: 'ethene',          formula: 'C₂H₄',       file: 'Ethylene.sdf' },
        { name: 'Пропен (пропилен)',iupac: 'propene',         formula: 'C₃H₆',       file: 'Propylene.sdf' },
        { name: 'Бутен-1',          iupac: 'but-1-ene',       formula: 'C₄H₈',       file: '1-Butene.sdf' },
        { name: 'Бутен-2 (цис)',    iupac: 'cis-but-2-ene',   formula: 'C₄H₈',       file: 'cis-2-BUTENE.sdf' },
        { name: 'Бутен-2 (транс)',  iupac: 'trans-but-2-ene', formula: 'C₄H₈',       file: 'trans-2-BUTENE.sdf' },
        { name: '2-Метилпропен',    iupac: '2-methylpropene', formula: 'C₄H₈',       file: 'Isobutylene.sdf' },
        { name: 'Пентен-1',         iupac: 'pent-1-ene',      formula: 'C₅H₁₀',      file: '1-Pentene.sdf' },
        { name: 'Пентен-2',         iupac: 'pent-2-ene',      formula: 'C₅H₁₀',      file: '2-Pentene.sdf' },
        { name: 'Гексен-1',         iupac: 'hex-1-ene',       formula: 'C₆H₁₂',      file: '1-Hexene.sdf' },
        { name: 'Бутадиен-1,3',     iupac: 'buta-1,3-diene',  formula: 'C₄H₆',       file: '1,3-Butadiene.sdf' },
        { name: 'Изопрен',          iupac: 'isoprene',        formula: 'C₅H₈',       file: 'Isoprene.sdf' },
        { name: 'Циклогексен',      iupac: 'cyclohexene',     formula: 'C₆H₁₀',      file: 'Cyclohexene.sdf' }
      ]
    },

    /* ---------------- АЛКИНЫ ---------------- */
    {
      id: 'alkiny',
      title: 'Алкины',
      icon: '🧵',
      color: '#b47cf0',
      dir: 'tools/iupac-catalog/3D_model/Alkiny/',
      items: [
        { name: 'Этин (ацетилен)', iupac: 'ethyne',    formula: 'C₂H₂',  file: 'Acetylene.sdf' },
        { name: 'Пропин',          iupac: 'propyne',   formula: 'C₃H₄',  file: 'Propyne.sdf' },
        { name: 'Бутин-1',         iupac: 'but-1-yne', formula: 'C₄H₆',  file: '1-Butyne.sdf' },
        { name: 'Бутин-2',         iupac: 'but-2-yne', formula: 'C₄H₆',  file: '2-Butyne.sdf' },
        { name: 'Пентин-1',        iupac: 'pent-1-yne',formula: 'C₅H₈',  file: '1-Pentyne.sdf' },
        { name: 'Гексин-1',        iupac: 'hex-1-yne', formula: 'C₆H₁₀', file: '1-Hexyne.sdf' },
        { name: 'Октин-1',         iupac: 'oct-1-yne', formula: 'C₈H₁₄', file: '1-Octyne.sdf' }
      ]
    },

    /* ---------------- АРЕНЫ ---------------- */
    {
      id: 'areny',
      title: 'Арены',
      icon: '💎',
      color: '#fbbf24',
      dir: 'tools/iupac-catalog/3D_model/Areny/',
      items: [
        { name: 'Бензол',              iupac: 'benzene',      formula: 'C₆H₆',          file: 'Benzene.sdf' },
        { name: 'Метилбензол (толуол)',iupac: 'toluene',      formula: 'C₆H₅CH₃',       file: 'Toluene.sdf' },
        { name: 'Этилбензол',          iupac: 'ethylbenzene', formula: 'C₆H₅C₂H₅',      file: 'Ethylbenzene.sdf' },
        { name: 'Стирол',              iupac: 'styrene',      formula: 'C₆H₅CH=CH₂',    file: 'Styrene.sdf' },
        { name: 'о-Ксилол',            iupac: 'o-xylene',     formula: 'C₆H₄(CH₃)₂',    file: 'O-Xylene.sdf' },
        { name: 'м-Ксилол',            iupac: 'm-xylene',     formula: 'C₆H₄(CH₃)₂',    file: 'M-Xylene.sdf' },
        { name: 'п-Ксилол',            iupac: 'p-xylene',     formula: 'C₆H₄(CH₃)₂',    file: 'P-Xylene.sdf' },
        { name: 'Кумол',               iupac: 'cumene',       formula: 'C₆H₅CH(CH₃)₂',  file: 'Cumene.sdf' },
        { name: 'Нафталин',            iupac: 'naphthalene',  formula: 'C₁₀H₈',         file: 'Naphthalene.sdf' },
        { name: 'Антрацен',            iupac: 'anthracene',   formula: 'C₁₄H₁₀',        file: 'Anthracene.sdf' },
        { name: 'Фенантрен',           iupac: 'phenanthrene', formula: 'C₁₄H₁₀',        file: 'Phenanthrene.sdf' }
      ]
    },

    /* ---------------- СПИРТЫ ---------------- */
    {
      id: 'spirty',
      title: 'Спирты',
      icon: '🍷',
      color: '#fb923c',
      dir: 'tools/iupac-catalog/3D_model/Spirty/',
      items: [
        { name: 'Метанол',            iupac: 'methanol',           formula: 'CH₃OH',         file: 'Methanol.sdf' },
        { name: 'Этанол',             iupac: 'ethanol',            formula: 'C₂H₅OH',        file: 'Ethanol.sdf' },
        { name: 'Пропанол-1',         iupac: 'propan-1-ol',        formula: 'C₃H₇OH',        file: '1-Propanol.sdf' },
        { name: 'Пропанол-2',         iupac: 'propan-2-ol',        formula: 'CH₃CHOHCH₃',    file: '2-Propanol.sdf' },
        { name: 'Бутанол-1',          iupac: 'butan-1-ol',         formula: 'C₄H₉OH',        file: '1-Butanol.sdf' },
        { name: 'Бутанол-2',          iupac: 'butan-2-ol',         formula: 'C₂H₅CHOHCH₃',   file: '2-Butanol.sdf' },
        { name: '2-Метилпропанол-1',  iupac: '2-methylpropan-1-ol',formula: '(CH₃)₂CHCH₂OH', file: '2-Methylpropanol-1.sdf' },
        { name: '2-Метилпропанол-2',  iupac: '2-methylpropan-2-ol',formula: '(CH₃)₃COH',     file: '2-Methylpropanol-2.sdf' },
        { name: 'Пентанол-1',         iupac: 'pentan-1-ol',        formula: 'C₅H₁₁OH',       file: '1-Pentanol.sdf' },
        { name: 'Этиленгликоль',      iupac: 'ethane-1,2-diol',    formula: 'HOCH₂CH₂OH',    file: 'Ethylene_Glycol.sdf' },
        { name: 'Глицерин',           iupac: 'glycerol',           formula: 'C₃H₅(OH)₃',     file: 'Glycerol.sdf' },
        { name: 'Циклогексанол',      iupac: 'cyclohexanol',       formula: 'C₆H₁₁OH',       file: 'Cyclohexanol.sdf' },
        { name: 'Бензиловый спирт',   iupac: 'benzyl alcohol',     formula: 'C₆H₅CH₂OH',     file: 'Benzyl_Alcohol.sdf' }
      ]
    },

    /* ---------------- ФЕНОЛЫ ---------------- */
    {
      id: 'fenoly',
      title: 'Фенолы',
      icon: '🌸',
      color: '#f87171',
      dir: 'tools/iupac-catalog/3D_model/Fenoly/',
      items: [
        { name: 'Фенол',              iupac: 'phenol',          formula: 'C₆H₅OH',        file: 'Phenol.sdf' },
        { name: 'о-Крезол',           iupac: 'o-cresol',        formula: 'CH₃C₆H₄OH',     file: 'O-Cresol.sdf' },
        { name: 'м-Крезол',           iupac: 'm-cresol',        formula: 'CH₃C₆H₄OH',     file: 'M-Cresol.sdf' },
        { name: 'п-Крезол',           iupac: 'p-cresol',        formula: 'CH₃C₆H₄OH',     file: 'P-Cresol.sdf' },
        { name: 'Пирокатехин',        iupac: 'pyrocatechol',    formula: 'C₆H₄(OH)₂',     file: 'Catechol.sdf' },
        { name: 'Резорцин',           iupac: 'resorcinol',      formula: 'C₆H₄(OH)₂',     file: 'Resorcinol.sdf' },
        { name: 'Гидрохинон',         iupac: 'hydroquinone',    formula: 'C₆H₄(OH)₂',     file: 'Hydroquinone.sdf' },
        { name: 'Пикриновая кислота', iupac: 'picric acid',     formula: 'C₆H₂(NO₂)₃OH',  file: 'Picric Acid.sdf' }
      ]
    },

    /* ---------------- АЛЬДЕГИДЫ И КЕТОНЫ ---------------- */
    {
      id: 'aldehydy',
      title: 'Альдегиды и кетоны',
      icon: '⚗️',
      color: '#34d399',
      dir: 'tools/iupac-catalog/3D_model/Aldegidy_Ketony/',
      items: [
        { name: 'Формальдегид (метаналь)', iupac: 'formaldehyde', formula: 'HCHO',        file: 'Formaldehyde.sdf' },
        { name: 'Ацетальдегид (этаналь)',  iupac: 'acetaldehyde', formula: 'CH₃CHO',      file: 'Acetaldehyde.sdf' },
        { name: 'Пропаналь',               iupac: 'propanal',     formula: 'C₂H₅CHO',     file: 'Propanal.sdf' },
        { name: 'Бутаналь',                iupac: 'butanal',      formula: 'C₃H₇CHO',     file: 'Butanal.sdf' },
        { name: 'Бензальдегид',            iupac: 'benzaldehyde', formula: 'C₆H₅CHO',     file: 'Benzaldehyde.sdf' },
        { name: 'Ацетон (пропанон)',       iupac: 'acetone',      formula: 'CH₃COCH₃',    file: 'Acetone.sdf' },
        { name: 'Бутанон-2',               iupac: 'butan-2-one',  formula: 'C₂H₅COCH₃',   file: 'Methyl_Ethyl_Ketone.sdf' },
        { name: 'Циклогексанон',           iupac: 'cyclohexanone',formula: 'C₆H₁₀O',      file: 'Cyclohexanone.sdf' },
        { name: 'Ацетофенон',              iupac: 'acetophenone', formula: 'C₆H₅COCH₃',   file: 'Acetophenone.sdf' }
      ]
    },

    /* ---------------- КАРБОНОВЫЕ КИСЛОТЫ ---------------- */
    {
      id: 'karbonovye',
      title: 'Карбоновые кислоты',
      icon: '🧪',
      color: '#10b981',
      dir: 'tools/iupac-catalog/3D_model/Kisloty/',
      items: [
        { name: 'Муравьиная кислота',   iupac: 'formic acid',    formula: 'HCOOH',            file: 'Formic_Acid.sdf' },
        { name: 'Уксусная кислота',     iupac: 'acetic acid',    formula: 'CH₃COOH',          file: 'Acetic_Acid.sdf' },
        { name: 'Пропионовая кислота',  iupac: 'propionic acid', formula: 'C₂H₅COOH',         file: 'Propionic_Acid.sdf' },
        { name: 'Масляная кислота',     iupac: 'butyric acid',   formula: 'C₃H₇COOH',         file: 'Butyric_Acid.sdf' },
        { name: 'Валериановая кислота', iupac: 'valeric acid',   formula: 'C₄H₉COOH',         file: 'Pentanoic_Acid.sdf' },
        { name: 'Щавелевая кислота',    iupac: 'oxalic acid',    formula: 'HOOC-COOH',        file: 'Oxalic_Acid.sdf' },
        { name: 'Малоновая кислота',    iupac: 'malonic acid',   formula: 'HOOC-CH₂-COOH',    file: 'Malonic_Acid.sdf' },
        { name: 'Янтарная кислота',     iupac: 'succinic acid',  formula: 'HOOC-(CH₂)₂-COOH', file: 'Succinic_Acid.sdf' },
        { name: 'Бензойная кислота',    iupac: 'benzoic acid',   formula: 'C₆H₅COOH',         file: 'Benzoic_Acid.sdf' }
      ]
    },

    /* ---------------- СЛОЖНЫЕ ЭФИРЫ ---------------- */
    {
      id: 'efiry',
      title: 'Сложные эфиры',
      icon: '💠',
      color: '#06b6d4',
      dir: 'tools/iupac-catalog/3D_model/Ephiry/',
      items: [
        { name: 'Метилформиат',  iupac: 'methyl formate',  formula: 'HCOOCH₃',      file: 'Methyl_formate.sdf' },
        { name: 'Этилформиат',   iupac: 'ethyl formate',   formula: 'HCOOC₂H₅',     file: 'Ethyl_formate.sdf' },
        { name: 'Метилацетат',   iupac: 'methyl acetate',  formula: 'CH₃COOCH₃',    file: 'Methyl_Acetate.sdf' },
        { name: 'Этилацетат',    iupac: 'ethyl acetate',   formula: 'CH₃COOC₂H₅',   file: 'Ethyl_Acetate.sdf' },
        { name: 'Пропилацетат',  iupac: 'propyl acetate',  formula: 'CH₃COOC₃H₇',   file: 'Propyl_Acetate.sdf' },
        { name: 'Метилбензоат',  iupac: 'methyl benzoate', formula: 'C₆H₅COOCH₃',   file: 'Methyl_Benzoate.sdf' }
      ]
    },

    /* ---------------- АМИНЫ ---------------- */
    {
      id: 'aminy',
      title: 'Амины',
      icon: '🦠',
      color: '#818cf8',
      dir: 'tools/iupac-catalog/3D_model/Aminy/',
      items: [
        { name: 'Метиламин',   iupac: 'methylamine',   formula: 'CH₃NH₂',   file: 'Methylamine.sdf' },
        { name: 'Этиламин',    iupac: 'ethylamine',    formula: 'C₂H₅NH₂',  file: 'Ethylamine.sdf' },
        { name: 'Пропиламин',  iupac: 'propylamine',   formula: 'C₃H₇NH₂',  file: 'Propylamine.sdf' },
        { name: 'Диметиламин', iupac: 'dimethylamine', formula: '(CH₃)₂NH', file: 'Dimethylamine.sdf' },
        { name: 'Триметиламин',iupac: 'trimethylamine',formula: '(CH₃)₃N',  file: 'Trimethylamine.sdf' },
        { name: 'Анилин',      iupac: 'aniline',       formula: 'C₆H₅NH₂',  file: 'Aniline.sdf' },
        { name: 'Дифениламин', iupac: 'diphenylamine', formula: '(C₆H₅)₂NH',file: 'Diphenylamine.sdf' }
      ]
    },

    /* ---------------- АМИНОКИСЛОТЫ ---------------- */
    {
      id: 'aminokisloty',
      title: 'Аминокислоты',
      icon: '🧬',
      color: '#c084fc',
      dir: 'tools/iupac-catalog/3D_model/Aminokisloty/',
      items: [
        { name: 'Глицин',                iupac: 'glycine',      formula: 'NH₂CH₂COOH',             file: 'Glycine.sdf' },
        { name: 'Аланин',                iupac: 'alanine',      formula: 'CH₃CH(NH₂)COOH',         file: 'Alanine.sdf' },
        { name: 'Валин',                 iupac: 'valine',       formula: '(CH₃)₂CHCH(NH₂)COOH',    file: 'Valine.sdf' },
        { name: 'Лейцин',                iupac: 'leucine',      formula: '(CH₃)₂CHCH₂CH(NH₂)COOH', file: 'Leucine.sdf' },
        { name: 'Изолейцин',             iupac: 'isoleucine',   formula: 'C₂H₅CH(CH₃)CH(NH₂)COOH', file: 'Isoleucine.sdf' },
        { name: 'Серин',                 iupac: 'serine',       formula: 'HOCH₂CH(NH₂)COOH',       file: 'Serine.sdf' },
        { name: 'Цистеин',               iupac: 'cysteine',     formula: 'HSCH₂CH(NH₂)COOH',       file: 'Cysteine.sdf' },
        { name: 'Метионин',              iupac: 'methionine',   formula: 'CH₃SCH₂CH₂CH(NH₂)COOH',  file: 'Methionine.sdf' },
        { name: 'Фенилаланин',           iupac: 'phenylalanine',formula: 'C₆H₅CH₂CH(NH₂)COOH',     file: 'Phenylalanine.sdf' },
        { name: 'Аспарагиновая кислота', iupac: 'aspartic acid',formula: 'HOOCCH₂CH(NH₂)COOH',     file: 'Aspartic_Acid.sdf' },
        { name: 'Глутаминовая кислота',  iupac: 'glutamic acid',formula: 'HOOC(CH₂)₂CH(NH₂)COOH',  file: 'Glutamic_Acid.sdf' },
        { name: 'Лизин',                 iupac: 'lysine',       formula: 'H₂N(CH₂)₄CH(NH₂)COOH',   file: 'Lysine.sdf' },
        { name: 'Аргинин',               iupac: 'arginine',     formula: 'H₂NC(=NH)NH(CH₂)₃CH(NH₂)COOH', file: 'Arginine.sdf' },
        { name: 'Пролин',                iupac: 'proline',      formula: 'C₅H₉NO₂',                file: 'Proline.sdf' },
        { name: 'Триптофан',             iupac: 'tryptophan',   formula: 'C₁₁H₁₂N₂O₂',             file: 'Tryptophan.sdf' }
      ]
    },

    /* ---------------- УГЛЕВОДЫ ---------------- */
    {
      id: 'uglevody',
      title: 'Углеводы',
      icon: '🍬',
      color: '#fb7185',
      dir: 'tools/iupac-catalog/3D_model/Uglevody/',
      items: [
        { name: 'Глюкоза',   iupac: 'D-glucose',   formula: 'C₆H₁₂O₆',   file: 'Glucose.sdf' },
        { name: 'Фруктоза',  iupac: 'D-fructose',  formula: 'C₆H₁₂O₆',   file: 'Fructose.sdf' },
        { name: 'Галактоза', iupac: 'D-galactose', formula: 'C₆H₁₂O₆',   file: 'Galactose.sdf' },
        { name: 'Рибоза',    iupac: 'D-ribose',    formula: 'C₅H₁₀O₅',   file: 'Ribose.sdf' },
        { name: 'Сахароза',  iupac: 'sucrose',     formula: 'C₁₂H₂₂O₁₁', file: 'Sucrose.sdf' }
      ]
    }
  ];

  /* ============================================================
     ЗАГРУЗКА 3DMOL.JS
     ============================================================ */
  const THREEDMOL_SOURCES = [
    'tools/iupac-catalog/lib/3Dmol-min.js',
    'https://cdn.jsdelivr.net/npm/3dmol@2/build/3Dmol-min.js',
    'https://unpkg.com/3dmol@2/build/3Dmol-min.js'
  ];

  let threeDMolLoaded = false;
  let threeDMolPromise = null;

  function loadScriptFromUrl(url, timeoutMs){
    timeoutMs = timeoutMs || 15000;
    return new Promise(function(resolve, reject){
      var s = document.createElement('script');
      s.src = url;
      var done = false;

      var timer = setTimeout(function(){
        if (done) return;
        done = true;
        s.remove();
        reject(new Error('Таймаут ' + timeoutMs + ' мс: ' + url));
      }, timeoutMs);

      s.onload = function(){
        if (done) return;
        done = true;
        clearTimeout(timer);
        resolve();
      };
      s.onerror = function(){
        if (done) return;
        done = true;
        clearTimeout(timer);
        s.remove();
        reject(new Error('Не загрузился: ' + url));
      };

      document.head.appendChild(s);
    });
  }

  function load3Dmol(){
    if (threeDMolLoaded && window.$3Dmol) return Promise.resolve();
    if (threeDMolPromise) return threeDMolPromise;

    threeDMolPromise = (async function(){
      var lastError = null;
      for (var i = 0; i < THREEDMOL_SOURCES.length; i++){
        var url = THREEDMOL_SOURCES[i];
        try {
          console.log('📦 Пробую загрузить 3Dmol.js:', url);
          await loadScriptFromUrl(url);
          if (window.$3Dmol && typeof window.$3Dmol.createViewer === 'function'){
            threeDMolLoaded = true;
            console.log('✅ 3Dmol.js загружен из', url);
            return;
          }
          throw new Error('Скрипт загрузился, но $3Dmol не определён');
        } catch(e){
          console.warn('⚠️ Не сработал:', url, e.message);
          lastError = e;
        }
      }
      threeDMolPromise = null;
      throw new Error('Не удалось загрузить 3Dmol.js. Последняя ошибка: ' + (lastError ? lastError.message : 'неизвестно'));
    })();

    return threeDMolPromise;
  }

  /* ============================================================
     ЗАГРУЗКА SDF
     ============================================================ */
  const SDF_CACHE_PREFIX = 'orgchem-sdf:';

  function sdfCacheGet(key){
    try { return sessionStorage.getItem(SDF_CACHE_PREFIX + key); }
    catch(e){ return null; }
  }
  function sdfCacheSet(key, value){
    try { sessionStorage.setItem(SDF_CACHE_PREFIX + key, value); }
    catch(e){ /* ignore */ }
  }

  async function fetchSDF(url, cacheKey){
    cacheKey = cacheKey || url;
    const cached = sdfCacheGet(cacheKey);
    if (cached){
      console.log('📦 SDF из кэша:', cacheKey, '→ длина', cached.length);
      return cached;
    }

    console.log('🔍 Загружаю SDF:', url);

    const controller = new AbortController();
    const timer = setTimeout(function(){ controller.abort(); }, 15000);

    try {
      const r = await fetch(url, {signal: controller.signal, cache: 'force-cache'});
      clearTimeout(timer);
      console.log('📥 SDF статус:', r.status, url);

      if (!r.ok) throw new Error('HTTP ' + r.status + ' — ' + url);

      const sdf = await r.text();
      console.log('📄 SDF длина:', sdf.length);

      if (!sdf || sdf.length < 20){
        throw new Error('слишком короткий ответ (' + (sdf ? sdf.length : 0) + ' байт)');
      }

      sdfCacheSet(cacheKey, sdf);
      return sdf;

    } catch(e){
      clearTimeout(timer);
      console.error('❌ fetchSDF:', e, url);
      if (e.name === 'AbortError'){
        throw new Error('Файл не загрузился за 15 секунд: ' + url);
      }
      throw new Error('Не удалось получить 3D-структуру из ' + url + ' — ' + e.message);
    }
  }

  /* ============================================================
     МОДАЛКА
     ============================================================ */
  var modalInited = false;
  var currentViewer = null;

  function ensureModal(){
    if (modalInited) return;
    var modal = document.createElement('div');
    modal.className = 'iupac-modal';
    modal.id = 'iupacModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML =
      '<div class="iupac-modal-content" id="iupacModalContent">' +
        '<div class="iupac-modal-header">' +
          '<div>' +
            '<h3 class="iupac-modal-title" id="iupacModalTitle">Молекула</h3>' +
            '<div class="iupac-modal-formula" id="iupacModalFormula"></div>' +
          '</div>' +
          '<button class="iupac-modal-close" id="iupacModalClose" aria-label="Закрыть">✕</button>' +
        '</div>' +
        '<div id="iupac-3d-viewer">' +
          '<div class="iupac-3d-status">🔄 Загрузка молекулы…</div>' +
        '</div>' +
        '<div class="iupac-modal-footer">' +
          '<span>Модели: локальные SDF-файлы репозитория</span>' +
          '<span>🖱 Вращайте мышью · Колесо — масштаб</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    document.getElementById('iupacModalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){
      if (e.target.id === 'iupacModal') closeModal();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') closeModal();
    });
    modalInited = true;
  }

  function closeModal(){
    var modal = document.getElementById('iupacModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
    var viewerEl = document.getElementById('iupac-3d-viewer');
    if (viewerEl){
      viewerEl.innerHTML = '<div class="iupac-3d-status">🔄 Загрузка молекулы…</div>';
    }
    currentViewer = null;
  }

  /* ============================================================
     ОТКРЫТИЕ МОДАЛКИ С 3D
     ============================================================ */
  async function openMoleculeModal(item, groupColor){
    if (!item.sdf){
      alert('Для этого соединения 3D-модель пока не добавлена в репозиторий.');
      return;
    }

    ensureModal();
    var modal = document.getElementById('iupacModal');
    var modalContent = document.getElementById('iupacModalContent');
    var viewerEl = document.getElementById('iupac-3d-viewer');

    var log = function(html){
      if (viewerEl){
        viewerEl.innerHTML = '<div class="iupac-3d-status" style="padding:2rem 1rem;text-align:center;font-family:monospace;font-size:0.85rem;line-height:2;">' + html + '</div>';
      }
    };

    modalContent.style.setProperty('--modal-color', groupColor);
    document.getElementById('iupacModalTitle').textContent = item.name;
    document.getElementById('iupacModalFormula').textContent = item.formula || '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
      log('📦 Шаг 1/4: загрузка 3Dmol.js…');
      await load3Dmol();
      if (!window.$3Dmol || typeof window.$3Dmol.createViewer !== 'function'){
        throw new Error('3Dmol.js загрузился, но createViewer недоступен');
      }
      log('✅ Шаг 1: 3Dmol.js загружен');

      log('📦 Шаг 2/4: загрузка SDF из репозитория…<br>' +
          '<span style="font-size:0.7rem;color:var(--ink-muted)">' + item.sdf + '</span>');
      var sdf = await fetchSDF(item.sdf, 'file:' + item.sdf);
      log('✅ Шаг 2: SDF получен<br>' +
          '<span style="font-size:0.7rem;color:var(--ink-muted)">Размер: ' + sdf.length + ' байт</span>');

      log('📦 Шаг 3/4: ждём появления модалки…');
      // ⚠️ ГЛАВНОЕ ИСПРАВЛЕНИЕ: ждём 400 мс, чтобы CSS-переход
      //    opacity: 0 → 1 завершился и модалка стала полностью видимой.
      await new Promise(function(r){ setTimeout(r, 400); });

      log('📦 Шаг 4/4: создаём canvas…');

      viewerEl.innerHTML = '';
      viewerEl.style.position = 'relative';

      // ⚠️ Фиксированные размеры в пикселях, а не проценты —
      //    чтобы не зависеть от flex/анимации.
      var container = document.createElement('div');
      container.id = 'iupac-3d-canvas';
      container.style.width = '700px';
      container.style.height = '480px';
      container.style.position = 'relative';
      container.style.margin = '0 auto';
      container.style.background = 'rgba(255,255,255,0.03)';
      viewerEl.appendChild(container);

      var cw = container.clientWidth;
      var ch = container.clientHeight;
      console.log('📐 Размер контейнера:', cw, '×', ch);

      if (cw < 10 || ch < 10){
        throw new Error('Контейнер имеет нулевой размер: ' + cw + '×' + ch);
      }

      // ⚠️ antialias: false — отключает FBO-путь в 3Dmol, который
      //    ломается при создании в нестабильном контейнере.
      var viewer = window.$3Dmol.createViewer(container, {
        backgroundColor: '#0a0e27',
        antialias: false,
        upscale: false
      });
      if (!viewer) throw new Error('createViewer вернул null');
      currentViewer = viewer;
      console.log('✅ Viewer создан');

      var model = viewer.addModel(sdf, 'sdf');
      if (!model) throw new Error('addModel вернул null — не удалось распарсить SDF');

      viewer.setStyle({}, {
        stick: { radius: 0.15, colorscheme: 'Jmol' },
        sphere: { scale: 0.25, colorscheme: 'Jmol' }
      });
      viewer.zoomTo();
      viewer.render();
      console.log('🎨 Первый render() выполнен');

      // ⚠️ Несколько повторных resize+render — «догоняем» layout,
      //    который может устаканиваться не сразу.
      [100, 400, 800, 1500].forEach(function(delay){
        setTimeout(function(){
          try {
            viewer.resize();
            viewer.render();
            console.log('🎨 resize+render через', delay, 'мс');
          } catch(err){
            console.warn('render через ' + delay + ' мс не удался:', err);
          }
        }, delay);
      });

      // Убираем статус «Загрузка…»
      setTimeout(function(){
        var statusEl = viewerEl.querySelector('.iupac-3d-status');
        if (statusEl) statusEl.remove();
        try { viewer.spin('y', 0.5); } catch(err){}
      }, 1600);

    } catch(e){
      console.error('❌ ОШИБКА 3D:', e);
      if (viewerEl){
        viewerEl.innerHTML = '<div class="iupac-3d-error" style="padding:2rem 1rem;text-align:center;">' +
          '<div style="font-weight:700;margin-bottom:0.5rem;color:var(--accent-red);">⚠️ Ошибка</div>' +
          '<div style="font-size:0.88rem;color:var(--ink);margin-bottom:0.5rem;font-family:monospace;word-break:break-all;line-height:1.5;">' +
            escapeHtml(e.message || 'Неизвестная ошибка') +
          '</div>' +
          '<div style="font-size:0.75rem;color:var(--ink-muted);margin-top:1rem;">' +
            'Проверьте, что файл существует в репозитории по указанному пути.' +
          '</div>' +
          '<button class="module-btn" style="margin-top:1.2rem;padding:0.5rem 1.2rem;font-size:0.85rem;" ' +
            'onclick="event.stopPropagation(); document.getElementById(\'iupacModal\').classList.remove(\'open\'); document.body.style.overflow=\'\';">Закрыть</button>' +
        '</div>';
      }
    }
  }

  /* ============================================================
     РЕНДЕР КАТАЛОГА
     ============================================================ */
  function renderCatalog(container, groups, searchQuery){
    var query = (searchQuery || '').trim().toLowerCase();

    var html = groups.map(function(group){
      var filtered = query
        ? group.items.filter(function(it){
            return it.name.toLowerCase().indexOf(query) !== -1 ||
                   (it.iupac || '').toLowerCase().indexOf(query) !== -1 ||
                   (it.formula || '').toLowerCase().indexOf(query) !== -1;
          })
        : group.items;

      if (query && !filtered.length) return '';

      var itemsHtml = filtered.map(function(item){
        var hasModel = !!item.file;

        return '<div class="iupac-item' + (hasModel ? '' : ' iupac-item-disabled') + '">' +
          '<div class="iupac-item-name">' +
            escapeHtml(item.name) +
            (item.formula ? '<span class="formula">' + escapeHtml(item.formula) + '</span>' : '') +
          '</div>' +
          '<button class="iupac-3d-btn" ' +
            'data-group="' + group.id + '" data-iupac="' + escapeHtml(item.iupac) + '" ' +
            (hasModel ? '' : 'disabled title="Модель пока не добавлена"') + '>' +
            (hasModel ? '3D' : '—') +
          '</button>' +
        '</div>';
      }).join('');

      return '<div class="iupac-group" data-group-id="' + group.id + '" style="--group-color: ' + group.color + ';">' +
        '<div class="iupac-group-header">' +
          '<div class="iupac-group-title">' +
            '<span>' + group.icon + '</span>' +
            '<span>' + group.title + '</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:0.8rem;">' +
            '<span class="iupac-group-count">' + filtered.length + ' шт.</span>' +
            '<span class="iupac-group-toggle">▾</span>' +
          '</div>' +
        '</div>' +
        '<div class="iupac-group-body">' +
          (itemsHtml || '<div class="iupac-empty">Ничего не найдено</div>') +
        '</div>' +
      '</div>';
    }).filter(Boolean).join('');

    container.innerHTML = html || '<div class="iupac-empty">По вашему запросу ничего не найдено</div>';

    container.querySelectorAll('.iupac-group-header').forEach(function(h){
      h.addEventListener('click', function(){
        h.closest('.iupac-group').classList.toggle('collapsed');
      });
    });

    container.querySelectorAll('.iupac-3d-btn').forEach(function(btn){
      btn.addEventListener('click', async function(){
        if (btn.disabled) return;
        var groupId = btn.dataset.group;
        var iupac = btn.dataset.iupac;
        var group = CATALOG.find(function(g){ return g.id === groupId; });
        var item = group && group.items.find(function(it){ return it.iupac === iupac; });
        if (!item || !group) return;

        var fullItem = Object.assign({}, item, {
          sdf: item.file ? (group.dir + item.file) : null
        });

        btn.disabled = true;
        var oldText = btn.textContent;
        btn.textContent = '…';
        try {
          await openMoleculeModal(fullItem, group.color);
        } finally {
          btn.disabled = false;
          btn.textContent = oldText;
        }
      });
    });
  }

  function escapeHtml(s){
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ============================================================
     ТОЧКА ВХОДА
     ============================================================ */
  window.__renderIupacCatalog = function(containerEl){
    var totalCount = CATALOG.reduce(function(sum, g){ return sum + g.items.length; }, 0);
    var withModel = CATALOG.reduce(function(sum, g){
      return sum + g.items.filter(function(it){ return !!it.file; }).length;
    }, 0);

    containerEl.innerHTML =
      '<div class="iupac-page">' +
        '<div class="iupac-header">' +
          '<div class="iupac-badge">📖 Справочник названий</div>' +
          '<h2>ИЮПАК и тривиальные названия</h2>' +
          '<p>' + totalCount + ' соединений по классам. ' +
            'Доступно 3D-моделей: <b>' + withModel + '</b>. ' +
            'Нажмите <b>3D</b>, чтобы увидеть пространственное строение молекулы.</p>' +
        '</div>' +
        '<div class="iupac-search">' +
          '<input type="text" id="iupacSearchInput" placeholder="Поиск: этанол, benzene, C2H5OH…" autocomplete="off">' +
        '</div>' +
        '<div class="iupac-groups" id="iupacGroups"></div>' +
      '</div>';

    var groupsEl = document.getElementById('iupacGroups');
    var searchInput = document.getElementById('iupacSearchInput');

    renderCatalog(groupsEl, CATALOG, '');

    var debounce;
    searchInput.addEventListener('input', function(e){
      clearTimeout(debounce);
      debounce = setTimeout(function(){
        renderCatalog(groupsEl, CATALOG, e.target.value);
      }, 200);
    });
  };
})();
