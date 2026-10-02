/* ============================================================
   ПЕРИОДИЧЕСКАЯ ТАБЛИЦА МЕНДЕЛЕЕВА
   Модуль самодостаточный: регистрирует window.__renderPeriodic()
   ============================================================ */
(function(){
  'use strict';

  const DATA_URL = new URL('data.json', document.currentScript.src).href;

  let EL_CATEGORIES = {};
  let ELEMENTS = [];
  let dataLoaded = false;
  let ptFilter = 'all';
  let ptSearch = '';
  let modalInited = false;

  const LANTHANIDE_Z = new Set([57,58,59,60,61,62,63,64,65,66,67,68,69,70,71]);
  const ACTINIDE_Z   = new Set([89,90,91,92,93,94,95,96,97,98,99,100,101,102,103]);

  /* ---------- Загрузка данных ---------- */
  async function loadData(){
    if (dataLoaded) return;
    const r = await fetch(DATA_URL, {cache:'force-cache'});
    if (!r.ok) throw new Error('Не удалось загрузить data.json: ' + r.status);
    const json = await r.json();
    EL_CATEGORIES = json.categories || {};
    ELEMENTS = json.elements || [];
    dataLoaded = true;
  }

  /* ---------- HTML страницы ---------- */
  function buildPeriodicHTML(){
    const cats = Object.entries(EL_CATEGORIES);
    const filtersHTML = `
      <button class="pt-filter active" data-filter="all" style="--cat-color: var(--accent-cyan)">Все</button>
      ${cats.map(([key, v]) => `
        <button class="pt-filter" data-filter="${key}" style="--cat-color: ${v.color}">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${v.color};margin-right:6px;vertical-align:middle;"></span>
          ${v.label}
        </button>`).join('')}`;
    return `
      <div class="periodic-page" id="periodicPage">
        <div class="periodic-header">
          <h2>Периодическая таблица Менделеева</h2>
          <p>Кликните на любой элемент, чтобы увидеть подробную информацию</p>
        </div>
        <div class="pt-controls">
          <div class="pt-search"><input type="text" id="ptSearchInput" placeholder="Найти элемент (Au, золото...)" autocomplete="off"></div>
          <div class="pt-filters" id="ptFilters">${filtersHTML}</div>
        </div>
        <div class="pt-wrap"><div class="periodic-table" id="ptTable"></div></div>
        <div class="pt-legend" id="ptLegend">
          ${cats.map(([key, v]) => `
            <div class="pt-legend-item" data-filter="${key}">
              <span class="pt-legend-dot" style="--dot-color: ${v.color}"></span>
              <span>${v.label}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  /* ---------- Позиция в таблице ---------- */
  function getGridPosition(Z){
    if (LANTHANIDE_Z.has(Z)) return { col: Z - 57 + 3, row: 9 };
    if (ACTINIDE_Z.has(Z))   return { col: Z - 89 + 3, row: 10 };
    const el = ELEMENTS.find(e => e[0] === Z);
    if (!el) return null;
    const group = el[6], period = el[7];
    if (group && period) return { col: group, row: period };
    if (Z === 2) return { col: 18, row: 1 };
    return null;
  }

  /* ---------- Построение таблицы ---------- */
  function buildTable(){
    const table = document.getElementById('ptTable');
    if (!table) return;
    table.innerHTML = '';
    ELEMENTS.forEach(el => {
      const [Z, sym, name, nameEn, mass, cat] = el;
      const pos = getGridPosition(Z);
      if (!pos) return;
      const color = EL_CATEGORIES[cat]?.color || EL_CATEGORIES.unknown?.color || '#94a3b8';
      const div = document.createElement('button');
      div.className = 'pt-el'; div.type = 'button';
      div.dataset.z = Z; div.dataset.cat = cat;
      div.dataset.search = (sym + ' ' + name + ' ' + nameEn + ' ' + Z).toLowerCase();
      div.style.setProperty('--cat-color', color);
      div.style.gridColumn = pos.col; div.style.gridRow = pos.row;
      div.innerHTML = `<span class="num">${Z}</span><span class="sym">${sym}</span><span class="name">${name}</span><span class="mass">${mass}</span>`;
      div.addEventListener('click', () => openModal(Z));
      table.appendChild(div);
    });
    const laPointer = document.createElement('div');
    laPointer.className = 'pt-el';
    laPointer.style.setProperty('--cat-color', EL_CATEGORIES.lanthanide?.color || '#f472b6');
    laPointer.style.gridColumn = 3; laPointer.style.gridRow = 7;
    laPointer.style.cursor = 'default'; laPointer.style.opacity = 0.6;
    laPointer.innerHTML = `<span class="num">57-71</span><span class="sym" style="font-size:0.9rem;">La-Lu</span>`;
    table.appendChild(laPointer);
    const acPointer = document.createElement('div');
    acPointer.className = 'pt-el';
    acPointer.style.setProperty('--cat-color', EL_CATEGORIES.actinide?.color || '#c084fc');
    acPointer.style.gridColumn = 3; acPointer.style.gridRow = 8;
    acPointer.style.cursor = 'default'; acPointer.style.opacity = 0.6;
    acPointer.innerHTML = `<span class="num">89-103</span><span class="sym" style="font-size:0.9rem;">Ac-Lr</span>`;
    table.appendChild(acPointer);
    applyFilters();
  }

  /* ---------- Фильтры ---------- */
  function applyFilters(){
    const cells = document.querySelectorAll('#ptTable .pt-el');
    const search = ptSearch.trim().toLowerCase();
    cells.forEach(c => {
      const cat = c.dataset.cat, s = c.dataset.search || '';
      let show = true;
      if (ptFilter !== 'all' && cat && cat !== ptFilter) show = false;
      if (search && s && !s.includes(search)) show = false;
      c.classList.toggle('dimmed', !show);
    });
  }

  function attachHandlers(){
    document.getElementById('ptSearchInput')?.addEventListener('input', e => {
      ptSearch = e.target.value; applyFilters();
    });
    document.getElementById('ptFilters')?.addEventListener('click', e => {
      const btn = e.target.closest('.pt-filter'); if (!btn) return;
      document.querySelectorAll('#ptFilters .pt-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); ptFilter = btn.dataset.filter; applyFilters();
    });
    document.getElementById('ptLegend')?.addEventListener('click', e => {
      const item = e.target.closest('.pt-legend-item'); if (!item) return;
      ptFilter = item.dataset.filter;
      document.querySelectorAll('#ptFilters .pt-filter').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === ptFilter);
      });
      applyFilters();
    });
  }

  /* ---------- Модальное окно ---------- */
  function ensureModal(){
    if (modalInited) return;
    if (!document.getElementById('ptModal')){
      const modal = document.createElement('div');
      modal.className = 'pt-modal';
      modal.id = 'ptModal';
      modal.setAttribute('role','dialog');
      modal.setAttribute('aria-modal','true');
      modal.innerHTML = `
        <div class="pt-modal-content" id="ptModalContent">
          <button class="pt-modal-close" id="ptModalClose" aria-label="Закрыть">✕</button>
          <div id="ptModalBody"></div>
        </div>`;
      document.body.appendChild(modal);
      document.getElementById('ptModalClose').addEventListener('click', closeModal);
      modal.addEventListener('click', e => { if (e.target.id === 'ptModal') closeModal(); });
    }
    modalInited = true;
  }

  function openModal(Z){
    const el = ELEMENTS.find(e => e[0] === Z); if (!el) return;
    const [zn, sym, name, nameEn, mass, cat, group, period, config, en, melt, boil, discovered, use] = el;
    const color = EL_CATEGORIES[cat]?.color || EL_CATEGORIES.unknown?.color || '#94a3b8';
    const catLabel = EL_CATEGORIES[cat]?.label || 'Неизвестно';
    const fmtNum = (v, s='') => (v === null || v === undefined || v === '') ? '—' : v + s;
    const body = document.getElementById('ptModalBody');
    const content = document.getElementById('ptModalContent');
    content.style.setProperty('--el-color', color);
    body.innerHTML = `
      <div class="pt-modal-head">
        <div class="pt-modal-symbol" style="--el-color: ${color}">
          <span class="n">${zn}</span><span class="s">${sym}</span><span class="m">${mass}</span>
        </div>
        <div class="pt-modal-title">
          <h3 style="color:${color}">${name}</h3>
          <div class="en">${nameEn}</div>
          <div class="cat">${catLabel}</div>
        </div>
      </div>
      <div class="pt-orbital" style="--el-color: ${color}">
        <div class="orbit"></div><div class="orbit"></div><div class="orbit"></div><div class="nucleus"></div>
      </div>
      <div class="pt-modal-grid">
        <div class="pt-modal-item"><div class="lbl">Атомный номер</div><div class="val">${zn}</div></div>
        <div class="pt-modal-item"><div class="lbl">Атомная масса</div><div class="val">${mass} а.е.м.</div></div>
        <div class="pt-modal-item"><div class="lbl">Период</div><div class="val">${period}</div></div>
        <div class="pt-modal-item"><div class="lbl">Группа</div><div class="val">${group || '—'}</div></div>
        <div class="pt-modal-item"><div class="lbl">Электроотрицательность</div><div class="val">${fmtNum(en)}</div></div>
        <div class="pt-modal-item"><div class="lbl">T плавления</div><div class="val">${fmtNum(melt, ' °C')}</div></div>
        <div class="pt-modal-item"><div class="lbl">T кипения</div><div class="val">${fmtNum(boil, ' °C')}</div></div>
        <div class="pt-modal-item"><div class="lbl">Открыт</div><div class="val">${discovered || '—'}</div></div>
        <div class="pt-modal-item" style="grid-column: 1 / -1;">
          <div class="lbl">Электронная конфигурация</div>
          <div class="val config">${config || '—'}</div>
        </div>
      </div>
      <div class="pt-modal-desc"><strong>Применение.</strong> ${use}</div>`;
    document.getElementById('ptModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    const m = document.getElementById('ptModal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Точка входа ---------- */
  window.__renderPeriodic = async function(containerEl){
    await loadData();
    containerEl.innerHTML = buildPeriodicHTML();
    ensureModal();
    buildTable();
    attachHandlers();
  };
})();
