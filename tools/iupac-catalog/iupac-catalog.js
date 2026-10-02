/* ============================================================
   Справочник названий ИЮПАК с 3D-просмотром
   Экспортирует window.__renderIupacCatalog(containerEl)

   Лицензия 3Dmol.js: BSD (свободное использование)
   Данные: NCI Cactus (NIH, Public Domain)
   ============================================================ */
(function(){
  'use strict';

  /* ============================================================
     КАТАЛОГ ВЕЩЕСТВ
     ============================================================ */
  const CATALOG = [
    {
      id: 'alkany',
      title: 'Алканы',
      icon: '🔗',
      color: '#22d3ee',
      items: [
        { name: 'Метан', iupac: 'methane', formula: 'CH₄' },
        { name: 'Этан', iupac: 'ethane', formula: 'C₂H₆' },
        { name: 'Пропан', iupac: 'propane', formula: 'C₃H₈' },
        { name: 'Бутан', iupac: 'butane', formula: 'C₄H₁₀' },
        { name: '2-Метилпропан', iupac: '2-methylpropane', formula: '(CH₃)₃CH' },
        { name: 'Пентан', iupac: 'pentane', formula: 'C₅H₁₂' },
        { name: '2-Метилбутан', iupac: '2-methylbutane', formula: 'C₅H₁₂' },
        { name: '2,2-Диметилпропан', iupac: '2,2-dimethylpropane', formula: 'C₅H₁₂' },
        { name: 'Гексан', iupac: 'hexane', formula: 'C₆H₁₄' },
        { name: '2,3-Диметилбутан', iupac: '2,3-dimethylbutane', formula: 'C₆H₁₄' },
        { name: 'Гептан', iupac: 'heptane', formula: 'C₇H₁₆' },
        { name: 'Октан', iupac: 'octane', formula: 'C₈H₁₈' },
        { name: 'Нонан', iupac: 'nonane', formula: 'C₉H₂₀' },
        { name: 'Декан', iupac: 'decane', formula: 'C₁₀H₂₂' },
        { name: 'Циклогексан', iupac: 'cyclohexane', formula: 'C₆H₁₂' },
        { name: 'Метилциклогексан', iupac: 'methylcyclohexane', formula: 'C₇H₁₄' },
        { name: 'Циклопропан', iupac: 'cyclopropane', formula: 'C₃H₆' },
        { name: 'Циклобутан', iupac: 'cyclobutane', formula: 'C₄H₈' }
      ]
    },
    {
      id: 'alkeny',
      title: 'Алкены',
      icon: '⚡',
      color: '#5b8def',
      items: [
        { name: 'Этен (этилен)', iupac: 'ethene', formula: 'C₂H₄' },
        { name: 'Пропен (пропилен)', iupac: 'propene', formula: 'C₃H₆' },
        { name: 'Бутен-1', iupac: 'but-1-ene', formula: 'C₄H₈' },
        { name: 'Бутен-2 (цис)', iupac: 'cis-but-2-ene', formula: 'C₄H₈' },
        { name: 'Бутен-2 (транс)', iupac: 'trans-but-2-ene', formula: 'C₄H₈' },
        { name: '2-Метилпропен', iupac: '2-methylpropene', formula: 'C₄H₈' },
        { name: 'Пентен-1', iupac: 'pent-1-ene', formula: 'C₅H₁₀' },
        { name: 'Пентен-2', iupac: 'pent-2-ene', formula: 'C₅H₁₀' },
        { name: 'Гексен-1', iupac: 'hex-1-ene', formula: 'C₆H₁₂' },
        { name: 'Стирол', iupac: 'styrene', formula: 'C₆H₅CH=CH₂' },
        { name: 'Бутадиен-1,3', iupac: 'buta-1,3-diene', formula: 'C₄H₆' },
        { name: 'Изопрен', iupac: 'isoprene', formula: 'C₅H₈' },
        { name: 'Циклогексен', iupac: 'cyclohexene', formula: 'C₆H₁₀' }
      ]
    },
    {
      id: 'alkiny',
      title: 'Алкины',
      icon: '🧵',
      color: '#b47cf0',
      items: [
        { name: 'Этин (ацетилен)', iupac: 'ethyne', formula: 'C₂H₂' },
        { name: 'Пропин', iupac: 'propyne', formula: 'C₃H₄' },
        { name: 'Бутин-1', iupac: 'but-1-yne', formula: 'C₄H₆' },
        { name: 'Бутин-2', iupac: 'but-2-yne', formula: 'C₄H₆' },
        { name: 'Пентин-1', iupac: 'pent-1-yne', formula: 'C₅H₈' },
        { name: 'Гексин-1', iupac: 'hex-1-yne', formula: 'C₆H₁₀' },
        { name: 'Октин-1', iupac: 'oct-1-yne', formula: 'C₈H₁₄' }
      ]
    },
    {
      id: 'areny',
      title: 'Арены',
      icon: '💎',
      color: '#fbbf24',
      items: [
        { name: 'Бензол', iupac: 'benzene', formula: 'C₆H₆' },
        { name: 'Метилбензол (толуол)', iupac: 'toluene', formula: 'C₆H₅CH₃' },
        { name: 'Этилбензол', iupac: 'ethylbenzene', formula: 'C₆H₅C₂H₅' },
        { name: 'о-Ксилол', iupac: 'o-xylene', formula: 'C₆H₄(CH₃)₂' },
        { name: 'м-Ксилол', iupac: 'm-xylene', formula: 'C₆H₄(CH₃)₂' },
        { name: 'п-Ксилол', iupac: 'p-xylene', formula: 'C₆H₄(CH₃)₂' },
        { name: 'Кумол', iupac: 'cumene', formula: 'C₆H₅CH(CH₃)₂' },
        { name: 'Нафталин', iupac: 'naphthalene', formula: 'C₁₀H₈' },
        { name: 'Антрацен', iupac: 'anthracene', formula: 'C₁₄H₁₀' },
        { name: 'Фенантрен', iupac: 'phenanthrene', formula: 'C₁₄H₁₀' }
      ]
    },
    {
      id: 'spirty',
      title: 'Спирты',
      icon: '🍷',
      color: '#fb923c',
      items: [
        { name: 'Метанол', iupac: 'methanol', formula: 'CH₃OH' },
        { name: 'Этанол', iupac: 'ethanol', formula: 'C₂H₅OH' },
        { name: 'Пропанол-1', iupac: 'propan-1-ol', formula: 'C₃H₇OH' },
        { name: 'Пропанол-2', iupac: 'propan-2-ol', formula: 'CH₃CHOHCH₃' },
        { name: 'Бутанол-1', iupac: 'butan-1-ol', formula: 'C₄H₉OH' },
        { name: 'Бутанол-2', iupac: 'butan-2-ol', formula: 'C₂H₅CHOHCH₃' },
        { name: '2-Метилпропанол-1', iupac: '2-methylpropan-1-ol', formula: '(CH₃)₂CHCH₂OH' },
        { name: '2-Метилпропанол-2', iupac: '2-methylpropan-2-ol', formula: '(CH₃)₃COH' },
        { name: 'Пентанол-1', iupac: 'pentan-1-ol', formula: 'C₅H₁₁OH' },
        { name: 'Этиленгликоль', iupac: 'ethane-1,2-diol', formula: 'HOCH₂CH₂OH' },
        { name: 'Глицерин', iupac: 'glycerol', formula: 'C₃H₅(OH)₃' },
        { name: 'Циклогексанол', iupac: 'cyclohexanol', formula: 'C₆H₁₁OH' },
        { name: 'Бензиловый спирт', iupac: 'benzyl alcohol', formula: 'C₆H₅CH₂OH' }
      ]
    },
    {
      id: 'fenoly',
      title: 'Фенолы',
      icon: '🌸',
      color: '#f87171',
      items: [
        { name: 'Фенол', iupac: 'phenol', formula: 'C₆H₅OH' },
        { name: 'о-Крезол', iupac: 'o-cresol', formula: 'CH₃C₆H₄OH' },
        { name: 'м-Крезол', iupac: 'm-cresol', formula: 'CH₃C₆H₄OH' },
        { name: 'п-Крезол', iupac: 'p-cresol', formula: 'CH₃C₆H₄OH' },
        { name: 'Пирокатехин', iupac: 'pyrocatechol', formula: 'C₆H₄(OH)₂' },
        { name: 'Резорцин', iupac: 'resorcinol', formula: 'C₆H₄(OH)₂' },
        { name: 'Гидрохинон', iupac: 'hydroquinone', formula: 'C₆H₄(OH)₂' },
        { name: 'Пикриновая кислота', iupac: 'picric acid', formula: 'C₆H₂(NO₂)₃OH' }
      ]
    },
    {
      id: 'aldehydy',
      title: 'Альдегиды и кетоны',
      icon: '⚗️',
      color: '#34d399',
      items: [
        { name: 'Формальдегид (метаналь)', iupac: 'formaldehyde', formula: 'HCHO' },
        { name: 'Ацетальдегид (этаналь)', iupac: 'acetaldehyde', formula: 'CH₃CHO' },
        { name: 'Пропаналь', iupac: 'propanal', formula: 'C₂H₅CHO' },
        { name: 'Бутаналь', iupac: 'butanal', formula: 'C₃H₇CHO' },
        { name: 'Бензальдегид', iupac: 'benzaldehyde', formula: 'C₆H₅CHO' },
        { name: 'Ацетон (пропанон)', iupac: 'acetone', formula: 'CH₃COCH₃' },
        { name: 'Бутанон-2', iupac: 'butan-2-one', formula: 'C₂H₅COCH₃' },
        { name: 'Циклогексанон', iupac: 'cyclohexanone', formula: 'C₆H₁₀O' },
        { name: 'Ацетофенон', iupac: 'acetophenone', formula: 'C₆H₅COCH₃' }
      ]
    },
    {
      id: 'karbonovye',
      title: 'Карбоновые кислоты',
      icon: '🧪',
      color: '#10b981',
      items: [
        { name: 'Муравьиная кислота', iupac: 'formic acid', formula: 'HCOOH' },
        { name: 'Уксусная кислота', iupac: 'acetic acid', formula: 'CH₃COOH' },
        { name: 'Пропионовая кислота', iupac: 'propionic acid', formula: 'C₂H₅COOH' },
        { name: 'Масляная кислота', iupac: 'butyric acid', formula: 'C₃H₇COOH' },
        { name: 'Валериановая кислота', iupac: 'valeric acid', formula: 'C₄H₉COOH' },
        { name: 'Щавелевая кислота', iupac: 'oxalic acid', formula: 'HOOC-COOH' },
        { name: 'Малоновая кислота', iupac: 'malonic acid', formula: 'HOOC-CH₂-COOH' },
        { name: 'Янтарная кислота', iupac: 'succinic acid', formula: 'HOOC-(CH₂)₂-COOH' },
        { name: 'Бензойная кислота', iupac: 'benzoic acid', formula: 'C₆H₅COOH' },
        { name: 'Акриловая кислота', iupac: 'acrylic acid', formula: 'CH₂=CHCOOH' }
      ]
    },
    {
      id: 'efiry',
      title: 'Сложные эфиры',
      icon: '💠',
      color: '#06b6d4',
      items: [
        { name: 'Метилформиат', iupac: 'methyl formate', formula: 'HCOOCH₃' },
        { name: 'Этилформиат', iupac: 'ethyl formate', formula: 'HCOOC₂H₅' },
        { name: 'Метилацетат', iupac: 'methyl acetate', formula: 'CH₃COOCH₃' },
        { name: 'Этилацетат', iupac: 'ethyl acetate', formula: 'CH₃COOC₂H₅' },
        { name: 'Пропилацетат', iupac: 'propyl acetate', formula: 'CH₃COOC₃H₇' },
        { name: 'Метилбензоат', iupac: 'methyl benzoate', formula: 'C₆H₅COOCH₃' },
        { name: 'Тристеарин', iupac: 'tristearin', formula: 'C₅₇H₁₁₀O₆' },
        { name: 'Триолеин', iupac: 'triolein', formula: 'C₅₇H₁₀₄O₆' }
      ]
    },
    {
      id: 'aminy',
      title: 'Амины',
      icon: '🦠',
      color: '#818cf8',
      items: [
        { name: 'Метиламин', iupac: 'methylamine', formula: 'CH₃NH₂' },
        { name: 'Этиламин', iupac: 'ethylamine', formula: 'C₂H₅NH₂' },
        { name: 'Пропиламин', iupac: 'propylamine', formula: 'C₃H₇NH₂' },
        { name: 'Диметиламин', iupac: 'dimethylamine', formula: '(CH₃)₂NH' },
        { name: 'Триметиламин', iupac: 'trimethylamine', formula: '(CH₃)₃N' },
        { name: 'Анилин', iupac: 'aniline', formula: 'C₆H₅NH₂' },
        { name: 'Дифениламин', iupac: 'diphenylamine', formula: '(C₆H₅)₂NH' }
      ]
    },
    {
      id: 'aminokisloty',
      title: 'Аминокислоты',
      icon: '🧬',
      color: '#c084fc',
      items: [
        { name: 'Глицин', iupac: 'glycine', formula: 'NH₂CH₂COOH' },
        { name: 'Аланин', iupac: 'alanine', formula: 'CH₃CH(NH₂)COOH' },
        { name: 'Валин', iupac: 'valine', formula: '(CH₃)₂CHCH(NH₂)COOH' },
        { name: 'Лейцин', iupac: 'leucine', formula: '(CH₃)₂CHCH₂CH(NH₂)COOH' },
        { name: 'Изолейцин', iupac: 'isoleucine', formula: 'C₂H₅CH(CH₃)CH(NH₂)COOH' },
        { name: 'Серин', iupac: 'serine', formula: 'HOCH₂CH(NH₂)COOH' },
        { name: 'Цистеин', iupac: 'cysteine', formula: 'HSCH₂CH(NH₂)COOH' },
        { name: 'Метионин', iupac: 'methionine', formula: 'CH₃SCH₂CH₂CH(NH₂)COOH' },
        { name: 'Фенилаланин', iupac: 'phenylalanine', formula: 'C₆H₅CH₂CH(NH₂)COOH' },
        { name: 'Тирозин', iupac: 'tyrosine', formula: 'HOC₆H₄CH₂CH(NH₂)COOH' },
        { name: 'Аспарагиновая кислота', iupac: 'aspartic acid', formula: 'HOOCCH₂CH(NH₂)COOH' },
        { name: 'Глутаминовая кислота', iupac: 'glutamic acid', formula: 'HOOC(CH₂)₂CH(NH₂)COOH' },
        { name: 'Лизин', iupac: 'lysine', formula: 'H₂N(CH₂)₄CH(NH₂)COOH' },
        { name: 'Аргинин', iupac: 'arginine', formula: 'H₂NC(=NH)NH(CH₂)₃CH(NH₂)COOH' },
        { name: 'Гистидин', iupac: 'histidine', formula: 'C₆H₉N₃O₂' },
        { name: 'Пролин', iupac: 'proline', formula: 'C₅H₉NO₂' },
        { name: 'Триптофан', iupac: 'tryptophan', formula: 'C₁₁H₁₂N₂O₂' }
      ]
    },
    {
      id: 'uglevody',
      title: 'Углеводы',
      icon: '🍬',
      color: '#fb7185',
      items: [
        { name: 'Глюкоза', iupac: 'D-glucose', formula: 'C₆H₁₂O₆' },
        { name: 'Фруктоза', iupac: 'D-fructose', formula: 'C₆H₁₂O₆' },
        { name: 'Галактоза', iupac: 'D-galactose', formula: 'C₆H₁₂O₆' },
        { name: 'Рибоза', iupac: 'D-ribose', formula: 'C₅H₁₀O₅' },
        { name: 'Дезоксирибоза', iupac: 'deoxyribose', formula: 'C₅H₁₀O₄' },
        { name: 'Сахароза', iupac: 'sucrose', formula: 'C₁₂H₂₂O₁₁' },
        { name: 'Мальтоза', iupac: 'maltose', formula: 'C₁₂H₂₂O₁₁' },
        { name: 'Лактоза', iupac: 'lactose', formula: 'C₁₂H₂₂O₁₁' }
      ]
    }
  ];

  /* ============================================================
     ЗАГРУЗКА 3DMOL.JS (ленивая)
     ============================================================ */
  let threeDMolLoaded = false;
  let threeDMolPromise = null;

  function load3Dmol(){
    if (threeDMolLoaded) return Promise.resolve();
    if (threeDMolPromise) return threeDMolPromise;
    threeDMolPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://3dmol.org/build/3Dmol-min.js';
      s.onload = () => {
        threeDMolLoaded = true;
        resolve();
      };
      s.onerror = () => reject(new Error('Не удалось загрузить 3Dmol.js'));
      document.head.appendChild(s);
    });
    return threeDMolPromise;
  }

  /* ============================================================
     КЭШ SDF В LOCALSTORAGE
     ============================================================ */
  const SDF_STORAGE_PREFIX = 'orgchem-sdf:';

  function sdfCacheGet(key){
    try {
      return localStorage.getItem(SDF_STORAGE_PREFIX + key);
    } catch(e){
      return null;
    }
  }
  function sdfCacheSet(key, value){
    try {
      localStorage.setItem(SDF_STORAGE_PREFIX + key, value);
    } catch(e){ /* переполнение — игнорируем */ }
  }

  /* ============================================================
     ЗАПРОС SDF ИЗ NCI CACTUS
     Cactus отдаёт SDF как text/plain — читается без проблем
     (в отличие от PubChem, где Content-Disposition: attachment)
     ============================================================ */
  async function fetchSDF(iupacName){
    const key = iupacName.toLowerCase();

    // 1. Из кэша
    const cached = sdfCacheGet(key);
    if (cached){
      console.log('📦 SDF из кэша:', iupacName, '→ длина', cached.length);
      return cached;
    }

    // 2. Запрос к NCI Cactus
    const url = `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(iupacName)}/sdf`;
    console.log('🔍 NCI Cactus:', url);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const r = await fetch(url, {signal: controller.signal, cache: 'force-cache'});
      clearTimeout(timer);
      console.log('📥 Cactus статус:', r.status);

      if (!r.ok){
        throw new Error(`HTTP ${r.status}`);
      }

      const sdf = await r.text();
      console.log('📄 Cactus длина ответа:', sdf.length);

      if (!sdf || sdf.length < 50){
        throw new Error('слишком короткий ответ (' + (sdf ? sdf.length : 0) + ' байт)');
      }
      if (!/\$\$\$\$/.test(sdf)){
        console.warn('⚠️ В ответе Cactus нет маркера конца SDF, но продолжаем');
      }

      console.log('✅ SDF получен:', iupacName, '→ длина', sdf.length);
      sdfCacheSet(key, sdf);
      return sdf;

    } catch(e){
      clearTimeout(timer);
      console.error('❌ fetchSDF (Cactus):', e);
      if (e.name === 'AbortError'){
        throw new Error('NCI Cactus не ответил за 10 секунд');
      }
      throw new Error('Не удалось получить 3D-структуру: ' + e.message);
    }
  }

  /* ============================================================
     МОДАЛКА
     ============================================================ */
  let modalInited = false;
  let currentViewer = null;

  function ensureModal(){
    if (modalInited) return;
    const modal = document.createElement('div');
    modal.className = 'iupac-modal';
    modal.id = 'iupacModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="iupac-modal-content" id="iupacModalContent">
        <div class="iupac-modal-header">
          <div>
            <h3 class="iupac-modal-title" id="iupacModalTitle">Молекула</h3>
            <div class="iupac-modal-formula" id="iupacModalFormula"></div>
          </div>
          <button class="iupac-modal-close" id="iupacModalClose" aria-label="Закрыть">✕</button>
        </div>
        <div id="iupac-3d-viewer">
          <div class="iupac-3d-status">🔄 Загрузка молекулы…</div>
        </div>
        <div class="iupac-modal-footer">
          <span>Данные: <a href="https://cactus.nci.nih.gov/" target="_blank" rel="noopener">NCI Cactus</a> · <a href="https://3dmol.org/" target="_blank" rel="noopener">3Dmol.js</a> (BSD)</span>
          <span>🖱 Вращайте мышью · Колесо — масштаб</span>
        </div>
      </div>`;
    document.body.appendChild(modal);

    document.getElementById('iupacModalClose').addEventListener('click', closeModal);
    modal.addEventListener('click', e => {
      if (e.target.id === 'iupacModal') closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
    modalInited = true;
  }

  function closeModal(){
    const modal = document.getElementById('iupacModal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
    const viewerEl = document.getElementById('iupac-3d-viewer');
    if (viewerEl){
      viewerEl.innerHTML = '<div class="iupac-3d-status">🔄 Загрузка молекулы…</div>';
    }
    currentViewer = null;
  }

  /* ============================================================
     ОТКРЫТИЕ МОДАЛКИ С 3D
     Каждый шаг выводится прямо в модалку — чтобы видеть, где стоп
     ============================================================ */
  async function openMoleculeModal(item, groupColor){
    ensureModal();
    const modal = document.getElementById('iupacModal');
    const modalContent = document.getElementById('iupacModalContent');
    const viewerEl = document.getElementById('iupac-3d-viewer');

    // Отладочный статус прямо в модалке
    const log = (html) => {
      console.log('[IUPAC]', html.replace(/<[^>]+>/g, ' '));
      if (viewerEl){
        viewerEl.innerHTML = `<div class="iupac-3d-status" style="padding:2rem 1rem;text-align:center;font-family:monospace;font-size:0.85rem;line-height:2;">${html}</div>`;
      }
    };

    modalContent.style.setProperty('--modal-color', groupColor);
    document.getElementById('iupacModalTitle').textContent = item.name;
    document.getElementById('iupacModalFormula').textContent = item.formula || '';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
      // ШАГ 1 — 3Dmol.js
      log('📦 Шаг 1/6: загрузка 3Dmol.js…');
      await load3Dmol();
      if (!window.$3Dmol || typeof window.$3Dmol.createViewer !== 'function'){
        throw new Error('3Dmol.js загрузился, но createViewer недоступен');
      }
      log('✅ Шаг 1: 3Dmol.js загружен');

      // ШАГ 2 — SDF из Cactus
      log('📦 Шаг 2/6: запрос SDF из NCI Cactus…<br><span style="font-size:0.75rem;color:var(--ink-muted)">' + item.iupac + '</span>');
      const sdf = await fetchSDF(item.iupac);
      log('✅ Шаг 2: SDF получен<br><span style="font-size:0.75rem;color:var(--ink-muted)">Размер: ' + sdf.length + ' байт</span>');

      // ШАГ 3 — контейнер
      log('📦 Шаг 3/6: создание контейнера…');
      await new Promise(r => setTimeout(r, 80));

      viewerEl.innerHTML = '';
      const container = document.createElement('div');
      container.id = 'iupac-3d-canvas';
      container.style.width = '100%';
      container.style.height = '480px';
      container.style.background = 'rgba(255,255,255,0.03)';
      container.style.borderRadius = '12px';
      container.style.position = 'relative';
      viewerEl.appendChild(container);

      await new Promise(r => setTimeout(r, 80));

      const rect = container.getBoundingClientRect();
      log('✅ Шаг 3: контейнер ' + Math.round(rect.width) + '×' + Math.round(rect.height) + ' px');

      if (rect.width < 10 || rect.height < 10){
        throw new Error('Контейнер имеет нулевой размер: ' + rect.width + '×' + rect.height);
      }

      // ШАГ 4 — viewer
      log('📦 Шаг 4/6: createViewer…');
      const viewer = window.$3Dmol.createViewer(container, {
        backgroundColor: '#0a0e27'
      });
      if (!viewer) throw new Error('createViewer вернул null');
      currentViewer = viewer;
      log('✅ Шаг 4: viewer создан');

      // ШАГ 5 — addModel
      log('📦 Шаг 5/6: парсинг SDF…');
      const model = viewer.addModel(sdf, 'sdf');
      if (!model) throw new Error('addModel вернул null — не удалось распарсить SDF');
      log('✅ Шаг 5: модель добавлена');

      // ШАГ 6 — рендер
      log('📦 Шаг 6/6: рендер…');
      viewer.setStyle({}, {
        stick: { radius: 0.15, colorscheme: 'Jmol' },
        sphere: { scale: 0.25, colorscheme: 'Jmol' }
      });
      viewer.zoomTo();
      viewer.render();
      viewer.spin('y', 0.5);

      // Прячем статус — теперь canvas должен быть виден
      await new Promise(r => setTimeout(r, 200));
      const statusEl = viewerEl.querySelector('.iupac-3d-status');
      if (statusEl) statusEl.remove();

    } catch(e){
      console.error('❌ ОШИБКА 3D:', e);
      if (viewerEl){
        viewerEl.innerHTML = `<div class="iupac-3d-error" style="padding:2rem 1rem;text-align:center;">
          <div style="font-weight:700;margin-bottom:0.5rem;color:var(--accent-red);">⚠️ Ошибка</div>
          <div style="font-size:0.88rem;color:var(--ink);margin-bottom:0.5rem;font-family:monospace;word-break:break-all;line-height:1.5;">
            ${escapeHtml(e.message || 'Неизвестная ошибка')}
          </div>
          <div style="font-size:0.75rem;color:var(--ink-muted);margin-top:1rem;">
            Проверьте интернет и попробуйте снова.
          </div>
          <button class="module-btn" style="margin-top:1.2rem;padding:0.5rem 1.2rem;font-size:0.85rem;"
            onclick="event.stopPropagation(); document.getElementById('iupacModal').classList.remove('open'); document.body.style.overflow='';">Закрыть</button>
        </div>`;
      }
    }
  }

  /* ============================================================
     РЕНДЕР КАТАЛОГА
     ============================================================ */
  function renderCatalog(container, groups, searchQuery = ''){
    const query = searchQuery.trim().toLowerCase();

    const html = groups.map(group => {
      const filtered = query
        ? group.items.filter(it =>
            it.name.toLowerCase().includes(query) ||
            (it.iupac || '').toLowerCase().includes(query) ||
            (it.formula || '').toLowerCase().includes(query)
          )
        : group.items;

      if (query && !filtered.length) return '';

      const itemsHtml = filtered.map(item => `
        <div class="iupac-item">
          <div class="iupac-item-name">
            ${escapeHtml(item.name)}
            ${item.formula ? `<span class="formula">${escapeHtml(item.formula)}</span>` : ''}
          </div>
          <button class="iupac-3d-btn" data-group="${group.id}" data-iupac="${escapeHtml(item.iupac)}">3D</button>
        </div>
      `).join('');

      return `
        <div class="iupac-group" data-group-id="${group.id}" style="--group-color: ${group.color};">
          <div class="iupac-group-header">
            <div class="iupac-group-title">
              <span>${group.icon}</span>
              <span>${group.title}</span>
            </div>
            <div style="display:flex;align-items:center;gap:0.8rem;">
              <span class="iupac-group-count">${filtered.length} шт.</span>
              <span class="iupac-group-toggle">▾</span>
            </div>
          </div>
          <div class="iupac-group-body">
            ${itemsHtml || '<div class="iupac-empty">Ничего не найдено</div>'}
          </div>
        </div>`;
    }).filter(Boolean).join('');

    container.innerHTML = html || '<div class="iupac-empty">По вашему запросу ничего не найдено</div>';

    container.querySelectorAll('.iupac-group-header').forEach(h => {
      h.addEventListener('click', () => {
        h.closest('.iupac-group').classList.toggle('collapsed');
      });
    });

    container.querySelectorAll('.iupac-3d-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const groupId = btn.dataset.group;
        const iupac = btn.dataset.iupac;
        const group = CATALOG.find(g => g.id === groupId);
        const item = group?.items.find(it => it.iupac === iupac);
        if (!item || !group) return;

        btn.disabled = true;
        btn.textContent = '…';
        try {
          await openMoleculeModal(item, group.color);
        } finally {
          btn.disabled = false;
          btn.textContent = '3D';
        }
      });
    });
  }

  function escapeHtml(s){
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ============================================================
     ТОЧКА ВХОДА
     ============================================================ */
  window.__renderIupacCatalog = function(containerEl){
    const totalCount = CATALOG.reduce((sum, g) => sum + g.items.length, 0);

    containerEl.innerHTML = `
      <div class="iupac-page">
        <div class="iupac-header">
          <div class="iupac-badge">📖 Справочник названий</div>
          <h2>ИЮПАК и тривиальные названия</h2>
          <p>${totalCount} соединений по классам. Нажмите <b>3D</b>, чтобы увидеть пространственное строение молекулы.</p>
        </div>
        <div class="iupac-search">
          <input type="text" id="iupacSearchInput" placeholder="Поиск: этанол, benzene, C2H5OH…" autocomplete="off">
        </div>
        <div class="iupac-groups" id="iupacGroups"></div>
      </div>`;

    const groupsEl = document.getElementById('iupacGroups');
    const searchInput = document.getElementById('iupacSearchInput');

    renderCatalog(groupsEl, CATALOG);

    let debounce;
    searchInput.addEventListener('input', e => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        renderCatalog(groupsEl, CATALOG, e.target.value);
      }, 200);
    });
  };
})();
