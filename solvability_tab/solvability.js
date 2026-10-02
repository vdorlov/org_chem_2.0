/* ============================================================
   ТАБЛИЦА РАСТВОРИМОСТИ
   Модуль регистрирует window.__renderSolvability(containerEl)
   ============================================================ */
(function(){
  'use strict';

  const DATA_URL = new URL('data.json', document.currentScript.src).href;

  let DATA = null;
  let modalInited = false;
  let searchQuery = '';

  /* ---------- Загрузка данных ---------- */
  async function loadData(){
    if (DATA) return;
    const r = await fetch(DATA_URL, {cache:'force-cache'});
    if (!r.ok) throw new Error('Не удалось загрузить data.json: ' + r.status);
    DATA = await r.json();
  }

  /* ---------- HTML страницы ---------- */
  function buildHTML(){
    const types = DATA.types;
    return `
      <div class="solvability-page">
        <div class="solvability-header">
          <h2>Таблица растворимости</h2>
          <p>Кликните на ячейку — увидите название вещества, формулу и пример реакции</p>
        </div>

        <div class="sv-legend" id="svLegend">
          ${Object.entries(types).map(([id, t]) => `
            <div class="sv-legend-item">
              <span class="sv-legend-dot" style="--dot-color: ${t.color}">${t.label}</span>
              <span>${t.title}</span>
            </div>`).join('')}
        </div>

        <div class="sv-controls">
          <div class="sv-search">
            <input type="text" id="svSearchInput" placeholder="Найти ион (Na, Cl, SO4...)" autocomplete="off">
          </div>
          <div class="sv-filters" id="svFilters">
            <button class="sv-filter active" data-filter="all">Все</button>
            ${Object.entries(types).map(([id, t]) => `
              <button class="sv-filter" data-filter="${id}">${t.label} — ${t.title}</button>
            `).join('')}
          </div>
        </div>

        <div class="sv-wrap">
          <table class="sv-table" id="svTable"></table>
        </div>

        <div class="sv-bottom-legend">
          ${Object.entries(types).map(([id, t]) => `
            <span><b data-type="${id}">${t.label}</b> ${t.title}</span>
          `).join('')}
        </div>
      </div>`;
  }

  /* ---------- Рендер таблицы ---------- */
  function renderTable(){
    const table = document.getElementById('svTable');
    if (!table) return;
    table.innerHTML = '';

    const { cations, anions, cells } = DATA;

    // Шапка
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    const corner = document.createElement('th');
    corner.className = 'sv-th-corner';
    corner.rowSpan = 1;
    trHead.appendChild(corner);
    anions.forEach(a => {
      const th = document.createElement('th');
      th.className = 'sv-th-anion';
      th.dataset.anion = a.id;
      th.dataset.search = (a.formula + ' ' + a.name + ' ' + a.id).toLowerCase();
      th.textContent = a.formula;
      th.title = a.name;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    // Тело
    const tbody = document.createElement('tbody');
    cations.forEach(c => {
      const tr = document.createElement('tr');

      const thC = document.createElement('th');
      thC.className = 'sv-th-cation';
      thC.dataset.cation = c.id;
      thC.dataset.search = (c.formula + ' ' + c.name + ' ' + c.id).toLowerCase();
      thC.textContent = c.formula;
      thC.title = c.name;
      tr.appendChild(thC);

      anions.forEach(a => {
        const key = c.id + '|' + a.id;
        const cell = cells[key] || { type: 'soluble' };
        const typeData = DATA.types[cell.type] || DATA.types.unknown;
        const td = document.createElement('td');
        td.className = 'sv-cell';
        td.dataset.type = cell.type;
        td.dataset.cation = c.id;
        td.dataset.anion = a.id;
        td.dataset.key = key;
        td.dataset.search = (c.formula + ' ' + a.formula + ' ' + c.name + ' ' + a.name).toLowerCase();
        td.textContent = typeData.label;
        td.title = cell.name ? `${cell.name} (${cell.formula || ''})` : typeData.title;
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    applyFilters();
  }

  /* ---------- Фильтры и поиск ---------- */
  let activeFilter = 'all';

  function applyFilters(){
    const q = searchQuery.trim().toLowerCase();
    document.querySelectorAll('.sv-cell').forEach(c => {
      let show = true;
      if (activeFilter !== 'all' && c.dataset.type !== activeFilter) show = false;
      if (q){
        const cSearch = (c.closest('tr').querySelector('.sv-th-cation')?.dataset.search || '');
        const aSearch = (document.querySelector(`.sv-th-anion[data-anion="${c.dataset.anion}"]`)?.dataset.search || '');
        if (!cSearch.includes(q) && !aSearch.includes(q)) show = false;
      }
      c.classList.toggle('dimmed', !show);
    });
    // Подсветка активных катионов/анионов
    document.querySelectorAll('.sv-th-cation, .sv-th-anion').forEach(th => {
      const active = q && th.dataset.search.includes(q);
      th.classList.toggle('active', active);
    });
  }

  function attachHandlers(){
    document.getElementById('svSearchInput')?.addEventListener('input', e => {
      searchQuery = e.target.value;
      applyFilters();
    });

    document.getElementById('svFilters')?.addEventListener('click', e => {
      const btn = e.target.closest('.sv-filter'); if (!btn) return;
      document.querySelectorAll('#svFilters .sv-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      applyFilters();
    });

    // Клик по ячейке
    document.getElementById('svTable')?.addEventListener('click', e => {
      const cell = e.target.closest('.sv-cell'); if (!cell) return;
      openModal(cell.dataset.key);
    });
  }

  /* ---------- Модальное окно ---------- */
  function ensureModal(){
    if (modalInited) return;
    if (!document.getElementById('svModal')){
      const m = document.createElement('div');
      m.className = 'sv-modal';
      m.id = 'svModal';
      m.setAttribute('role','dialog');
      m.setAttribute('aria-modal','true');
      m.innerHTML = `
        <div class="sv-modal-content" id="svModalContent">
          <button class="sv-modal-close" id="svModalClose" aria-label="Закрыть">✕</button>
          <div id="svModalBody"></div>
        </div>`;
      document.body.appendChild(m);
      document.getElementById('svModalClose').addEventListener('click', closeModal);
      m.addEventListener('click', e => { if (e.target.id === 'svModal') closeModal(); });
    }
    modalInited = true;
  }

  function openModal(key){
    const cell = DATA.cells[key];
    if (!cell){
        const [cId, aId] = key.split('|');
        const c = DATA.cations.find(x => x.id === cId);
        const a = DATA.anions.find(x => x.id === aId);
        showModal({
          cation: c, anion: a,
          type: 'soluble',
          name: 'Растворимое вещество',
          formula: (c?.formula || '') + (a?.formula || ''),
          reaction: '',
          note: 'По умолчанию считается растворимым. Уточните информацию в справочнике.'
        });
        return;
   }
    const [cId, aId] = key.split('|');
    const c = DATA.cations.find(x => x.id === cId);
    const a = DATA.anions.find(x => x.id === aId);
    showModal({ cation: c, anion: a, ...cell });
  }

  function showModal({ cation, anion, type, name, formula, reaction, note }){
    const t = DATA.types[type] || DATA.types.unknown;
    const body = document.getElementById('svModalBody');
    const content = document.getElementById('svModalContent');
    content.style.setProperty('--el-color', t.color);

    // Преобразуем реакцию — обернуть стрелки
    const reactionHtml = reaction
      ? reaction
          .replace(/→/g, '<span class="arrow">→</span>')
          .replace(/⇄/g, '<span class="arrow">⇄</span>')
          .replace(/\((.*?)\)/g, '<span class="sub">($1)</span>')
      : '<em style="opacity:0.6">—</em>';

    body.innerHTML = `
      <div class="sv-modal-head">
        <div class="sv-modal-formula" style="--el-color: ${t.color}">
          ${escapeHtml(formula || '?')}
        </div>
        <div class="sv-modal-title">
          <h3 style="color:${t.color}">${escapeHtml(name || 'Вещество')}</h3>
          <div class="cat" style="
            background: color-mix(in srgb, ${t.color} 15%, transparent);
            border-color: color-mix(in srgb, ${t.color} 40%, transparent);
            color: ${t.color};
          ">${t.title}</div>
        </div>
      </div>

      <div class="sv-modal-grid">
        <div class="sv-modal-item">
          <div class="lbl">Катион</div>
          <div class="val">${escapeHtml(cation?.formula || '')} — ${escapeHtml(cation?.name || '')}</div>
        </div>
        <div class="sv-modal-item">
          <div class="lbl">Анион</div>
          <div class="val">${escapeHtml(anion?.formula || '')} — ${escapeHtml(anion?.name || '')}</div>
        </div>
      </div>

      ${reaction ? `
        <div class="sv-reaction">
          <strong style="color:var(--accent-cyan);display:block;margin-bottom:0.6rem;">Пример реакции:</strong>
          ${reactionHtml}
        </div>` : ''}

      <div class="sv-modal-desc">
        <strong>Пояснение.</strong> ${escapeHtml(note || 'Нет дополнительной информации.')}
      </div>`;

    document.getElementById('svModal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(){
    const m = document.getElementById('svModal');
    if (m) m.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Утилиты ---------- */
  function escapeHtml(s){
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Точка входа ---------- */
  window.__renderSolvability = async function(containerEl){
    await loadData();
    containerEl.innerHTML = buildHTML();
    ensureModal();
    renderTable();
    attachHandlers();
  };
})();
