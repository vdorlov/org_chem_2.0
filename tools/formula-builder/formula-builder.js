/* ============================================================
   Конструктор формул с поддержкой скобок
   Экспортирует window.__renderFormulaBuilder(containerEl)
   ============================================================ */
(function(){
  'use strict';

  // ============ Элементы для палитры ============
  const ELEMENTS = [
    { sym: 'C',  name: 'Углерод',   color: '#8b92b9', mass: 12.011 },
    { sym: 'H',  name: 'Водород',   color: '#eef2fa', mass: 1.008 },
    { sym: 'O',  name: 'Кислород',  color: '#fb7185', mass: 15.999 },
    { sym: 'N',  name: 'Азот',      color: '#5b8def', mass: 14.007 },
    { sym: 'S',  name: 'Сера',      color: '#fbbf24', mass: 32.06 },
    { sym: 'P',  name: 'Фосфор',    color: '#fb923c', mass: 30.974 },
    { sym: 'Cl', name: 'Хлор',      color: '#34d399', mass: 35.45 },
    { sym: 'F',  name: 'Фтор',      color: '#22d3ee', mass: 18.998 },
    { sym: 'Br', name: 'Бром',      color: '#a855f7', mass: 79.904 },
    { sym: 'I',  name: 'Иод',       color: '#b47cf0', mass: 126.90 },
    { sym: 'Na', name: 'Натрий',    color: '#c084fc', mass: 22.990 },
    { sym: 'K',  name: 'Калий',     color: '#a78bfa', mass: 39.098 },
    { sym: 'Ca', name: 'Кальций',   color: '#f472b6', mass: 40.078 },
    { sym: 'Mg', name: 'Магний',    color: '#818cf8', mass: 24.305 },
    { sym: 'Fe', name: 'Железо',    color: '#fb923c', mass: 55.845 },
    { sym: 'Cu', name: 'Медь',      color: '#fbbf24', mass: 63.546 },
    { sym: 'Zn', name: 'Цинк',      color: '#94a3b8', mass: 65.38 },
    { sym: 'Al', name: 'Алюминий',  color: '#a3e635', mass: 26.982 },
    { sym: 'Ag', name: 'Серебро',   color: '#cbd5e1', mass: 107.87 },
    { sym: 'Ba', name: 'Барий',     color: '#f87171', mass: 137.33 }
  ];

  // Металлы (для умной сортировки)
  const METALS = ['Li','Na','K','Rb','Cs','Fr','Be','Mg','Ca','Sr','Ba','Ra','Al','Fe','Cu','Zn','Ag','Sn','Pb','Hg','Mn','Ni','Co','Cr'];

  // Известные вещества
  const KNOWN = [
    // Органика
    { formula: 'CH4',     name: 'Метан' },
    { formula: 'C2H6',    name: 'Этан' },
    { formula: 'C3H8',    name: 'Пропан' },
    { formula: 'C4H10',   name: 'Бутан' },
    { formula: 'C2H4',    name: 'Этен (этилен)' },
    { formula: 'C3H6',    name: 'Пропен' },
    { formula: 'C2H2',    name: 'Этин (ацетилен)' },
    { formula: 'C6H6',    name: 'Бензол' },
    { formula: 'C6H5CH3', name: 'Толуол' },
    { formula: 'CH3OH',   name: 'Метанол' },
    { formula: 'C2H5OH',  name: 'Этанол' },
    { formula: 'C3H7OH',  name: 'Пропанол' },
    { formula: 'C6H5OH',  name: 'Фенол' },
    { formula: 'CH3COOH', name: 'Уксусная кислота' },
    { formula: 'HCOOH',   name: 'Муравьиная кислота' },
    { formula: 'HCHO',    name: 'Формальдегид (метаналь)' },
    { formula: 'CH3CHO',  name: 'Ацетальдегид (этаналь)' },
    { formula: 'CH3COCH3',name: 'Ацетон (пропанон)' },
    { formula: 'CH2O',    name: 'Формальдегид' },
    { formula: 'C6H12O6', name: 'Глюкоза' },
    { formula: 'CH3COOC2H5', name: 'Этилацетат' },

    // Неорганика — вода, газы, кислоты
    { formula: 'H2O',     name: 'Вода' },
    { formula: 'H2O2',    name: 'Пероксид водорода' },
    { formula: 'CO2',     name: 'Углекислый газ' },
    { formula: 'CO',      name: 'Угарный газ' },
    { formula: 'NH3',     name: 'Аммиак' },
    { formula: 'SO2',     name: 'Сернистый газ' },
    { formula: 'SO3',     name: 'Серный ангидрид' },
    { formula: 'NO',      name: 'Оксид азота(II)' },
    { formula: 'NO2',     name: 'Оксид азота(IV)' },
    { formula: 'HNO3',    name: 'Азотная кислота' },
    { formula: 'H2SO4',   name: 'Серная кислота' },
    { formula: 'H2SO3',   name: 'Сернистая кислота' },
    { formula: 'H3PO4',   name: 'Фосфорная кислота' },
    { formula: 'H2S',     name: 'Сероводород' },
    { formula: 'HCl',     name: 'Соляная кислота' },
    { formula: 'H2CO3',   name: 'Угольная кислота' },

    // Соли
    { formula: 'Na2CO3',  name: 'Карбонат натрия (сода)' },
    { formula: 'NaHCO3',  name: 'Гидрокарбонат натрия' },
    { formula: 'Na2SO4',  name: 'Сульфат натрия' },
    { formula: 'NaNO3',   name: 'Нитрат натрия' },
    { formula: 'NaCl',    name: 'Хлорид натрия (соль)' },
    { formula: 'NaOH',    name: 'Гидроксид натрия' },
    { formula: 'KOH',     name: 'Гидроксид калия' },
    { formula: 'K2CO3',   name: 'Карбонат калия (поташ)' },
    { formula: 'KMnO4',   name: 'Перманганат калия' },
    { formula: 'KCl',     name: 'Хлорид калия' },
    { formula: 'CaCO3',   name: 'Карбонат кальция (мел, мрамор)' },
    { formula: 'CaO',     name: 'Оксид кальция (известь)' },
    { formula: 'CaCl2',   name: 'Хлорид кальция' },
    { formula: 'Ca(OH)2', name: 'Гидроксид кальция (гашёная известь)' },
    { formula: 'MgO',     name: 'Оксид магния' },
    { formula: 'Al2O3',   name: 'Оксид алюминия' },
    { formula: 'Al(OH)3', name: 'Гидроксид алюминия' },
    { formula: 'FeS',     name: 'Сульфид железа(II)' },
    { formula: 'Fe2O3',   name: 'Оксид железа(III)' },
    { formula: 'Fe3O4',   name: 'Железная окалина' },
    { formula: 'Fe(OH)3', name: 'Гидроксид железа(III)' },
    { formula: 'CuSO4',   name: 'Сульфат меди(II)' },
    { formula: 'CuO',     name: 'Оксид меди(II)' },
    { formula: 'AgCl',    name: 'Хлорид серебра' },
    { formula: 'AgNO3',   name: 'Нитрат серебра' },
    { formula: 'ZnCl2',   name: 'Хлорид цинка' },
    { formula: 'BaSO4',   name: 'Сульфат бария' },
    { formula: 'Ba(OH)2', name: 'Гидроксид бария' },
    { formula: 'NH4Cl',   name: 'Хлорид аммония' },
    { formula: '(NH4)2SO4', name: 'Сульфат аммония' },
    { formula: 'Al2(SO4)3', name: 'Сульфат алюминия' },
    { formula: 'Ca3(PO4)2', name: 'Фосфат кальция' },
    { formula: '(NH4)2CO3', name: 'Карбонат аммония' }
  ];

  const ATOMIC_MASSES = {};
  ELEMENTS.forEach(e => ATOMIC_MASSES[e.sym] = e.mass);
  // Дополняем металлами, которых нет в палитре, но могут быть в KNOWN
  const EXTRA_MASSES = {
    Li: 6.94, Rb: 85.468, Cs: 132.91, Be: 9.0122, Sr: 87.62, Ra: 226,
    Sn: 118.71, Pb: 207.2, Hg: 200.59, Mn: 54.938, Ni: 58.693, Co: 58.933,
    Cr: 51.996, B: 10.81, Si: 28.085, As: 74.922, Se: 78.971
  };
  Object.assign(ATOMIC_MASSES, EXTRA_MASSES);

  // ============ Состояние ============
  // atoms: [{type:'atom', sym, count, id} | {type:'group', items:[...], count, id}]
  let atoms = [];
  let nextId = 1;

  // Открытая группа, в которую пишутся новые атомы (id группы)
  // null = корень
  let currentGroupId = null;

  // ============ Утилиты ============
  function getElement(sym){
    return ELEMENTS.find(e => e.sym === sym);
  }
  function toSub(num){
    const map = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉' };
    return String(num).split('').map(d => map[d] || d).join('');
  }

  // ============ Работа с деревом ============
  function findGroupById(id){
    if (id === null) return { items: atoms };
    function search(list){
      for (const item of list){
        if (item.type === 'group'){
          if (item.id === id) return item;
          const nested = search(item.items);
          if (nested) return nested;
        }
      }
      return null;
    }
    return search(atoms);
  }

  function getCurrentContainer(){
    const group = findGroupById(currentGroupId);
    return group ? group.items : atoms;
  }

  // ============ Добавление элемента ============
  function addElement(sym){
    const container = getCurrentContainer();

    // Если такой атом уже есть на этом уровне — увеличиваем count
    const existing = container.find(a => a.type === 'atom' && a.sym === sym);
    if (existing){
      existing.count++;
    } else {
      container.push({ type: 'atom', sym, count: 1, id: nextId++ });
    }
    render();
  }

  function removeItem(id){
    function removeFrom(list){
      for (let i = 0; i < list.length; i++){
        if (list[i].id === id){
          list.splice(i, 1);
          return true;
        }
        if (list[i].type === 'group'){
          if (removeFrom(list[i].items)) return true;
        }
      }
      return false;
    }
    removeFrom(atoms);
    // Если удалили открытую группу — сброс
    if (currentGroupId !== null && !findGroupById(currentGroupId)){
      currentGroupId = null;
    }
    render();
  }

  function incrementItem(id){
    function inc(list){
      for (const item of list){
        if (item.id === id){ item.count++; return true; }
        if (item.type === 'group'){
          if (inc(item.items)) return true;
        }
      }
      return false;
    }
    inc(atoms);
    render();
  }

  function decrementItem(id){
    function dec(list){
      for (let i = 0; i < list.length; i++){
        const item = list[i];
        if (item.id === id){
          item.count--;
          if (item.count <= 0) list.splice(i, 1);
          return true;
        }
        if (item.type === 'group'){
          if (dec(item.items)) return true;
        }
      }
      return false;
    }
    dec(atoms);
    if (currentGroupId !== null && !findGroupById(currentGroupId)){
      currentGroupId = null;
    }
    render();
  }

  // ============ Работа со скобками ============
  function toggleGroup(){
    if (currentGroupId !== null){
      // Закрыть текущую группу — вернуться на уровень выше
      const group = findGroupById(currentGroupId);
      const parentId = group ? findParentId(currentGroupId) : null;
      currentGroupId = parentId;
    } else {
      // Открыть новую группу внутри корня
      const newGroup = { type: 'group', items: [], count: 1, id: nextId++ };
      atoms.push(newGroup);
      currentGroupId = newGroup.id;
    }
    render();
  }

  function findParentId(targetId){
    function search(list, parentId){
      for (const item of list){
        if (item.id === targetId) return parentId;
        if (item.type === 'group'){
          const found = search(item.items, item.id);
          if (found !== undefined) return found;
        }
      }
      return undefined;
    }
    const res = search(atoms, null);
    return res === undefined ? null : res;
  }

  // ============ Формирование формулы ============
  // Разворачиваем дерево в плоскую структуру: { C: 1, O: 3, Na: 2 }
  function flattenCounts(list, multiplier = 1){
    const counts = {};
    for (const item of list){
      if (item.type === 'atom'){
        counts[item.sym] = (counts[item.sym] || 0) + item.count * multiplier;
      } else if (item.type === 'group'){
        const inner = flattenCounts(item.items, 1);
        for (const sym in inner){
          counts[sym] = (counts[sym] || 0) + inner[sym] * item.count * multiplier;
        }
      }
    }
    return counts;
  }

  // Рендер одной группы как строки
  function renderGroup(group){
    const innerStr = group.items.map(renderItem).join('');
    if (!innerStr) return '';
    const sub = group.count > 1 ? toSub(group.count) : '';
    return `(${innerStr})${sub}`;
  }

  // Рендер одного элемента (атом или группа)
  function renderItem(item){
    if (item.type === 'atom'){
      const sub = item.count > 1 ? toSub(item.count) : '';
      return `${item.sym}${sub}`;
    }
    if (item.type === 'group'){
      return renderGroup(item);
    }
    return '';
  }

  // Плоская формула без вложенных скобок (для известных названий)
  // Убирает внешние скобки, оставляет внутренние — но это редкий случай
  function buildFormulaString(){
    if (!atoms.length) return '';
    return atoms.map(renderItem).join('');
  }

  // Плоская формула без подстрочных, с сохранением скобок
  // Нужна для сравнения с KNOWN (там формулы вида (NH4)2SO4)
  function buildPlainFormula(){
    if (!atoms.length) return '';
    function renderItemPlain(item){
      if (item.type === 'atom'){
        return item.count > 1 ? `${item.sym}${item.count}` : item.sym;
      }
      if (item.type === 'group'){
        const inner = item.items.map(renderItemPlain).join('');
        if (!inner) return '';
        const sub = item.count > 1 ? item.count : '';
        return `(${inner})${sub}`;
      }
      return '';
    }
    return atoms.map(renderItemPlain).join('');
  }

  // Масса с учётом групп
  function calculateMass(){
    const counts = flattenCounts(atoms, 1);
    let total = 0;
    for (const sym in counts){
      if (ATOMIC_MASSES[sym]) total += ATOMIC_MASSES[sym] * counts[sym];
    }
    return total;
  }

  // Общее число атомов
  function countTotalAtoms(){
    const counts = flattenCounts(atoms, 1);
    let total = 0;
    for (const sym in counts) total += counts[sym];
    return total;
  }

  // ============ Рендер UI ============
  function render(){
    const canvas = document.getElementById('fbCanvas');
    const resultFormula = document.getElementById('fbResultFormula');
    const massVal = document.getElementById('fbMassVal');
    const atomsVal = document.getElementById('fbAtomsVal');
    const nameVal = document.getElementById('fbNameVal');
    const bracketBtn = document.getElementById('fbBracketBtn');
    if (!canvas) return;

    // Панель-подсказка про скобки
    if (bracketBtn){
      if (currentGroupId !== null){
        bracketBtn.textContent = 'Завершить группу )';
        bracketBtn.classList.add('active');
      } else {
        bracketBtn.textContent = 'Открыть группу (';
        bracketBtn.classList.remove('active');
      }
    }

    // Рисуем canvas
    if (!atoms.length){
      canvas.innerHTML = `<div class="fb-empty-hint" style="width:100%;">
        Нажмите на элементы слева, чтобы добавить их в молекулу
      </div>`;
    } else {
      canvas.innerHTML = atoms.map(item => renderItemHtml(item, 0)).join('');
    }

    // Формула
    const formula = buildFormulaString();
    resultFormula.innerHTML = formula || '<span class="empty">— пока пусто —</span>';

    // Молярная масса
    const mass = calculateMass();
    massVal.textContent = mass > 0 ? Math.round(mass * 100) / 100 + ' г/моль' : '—';

    // Всего атомов
    const totalAtoms = countTotalAtoms();
    atomsVal.textContent = totalAtoms || '—';

    // Название
    const plain = buildPlainFormula();
    const known = KNOWN.find(k => k.formula === plain);
    nameVal.textContent = known ? known.name : '—';

    // MathJax
    renderMathJax(resultFormula);
  }

  function renderItemHtml(item, depth){
    if (item.type === 'atom'){
      const el = getElement(item.sym);
      const color = el?.color || '#22d3ee';
      return `<div class="fb-atom" data-id="${item.id}" style="--el-color: ${color};">
        <button class="fb-atom-close" title="Удалить">×</button>
        <span class="fb-atom-sym">${item.sym}</span>
        <span class="fb-atom-count ${item.count <= 1 ? 'hidden' : ''}">${item.count}</span>
      </div>`;
    }
    if (item.type === 'group'){
      const isCurrent = item.id === currentGroupId;
      const isEmpty = item.items.length === 0;
      const countStr = item.count > 1 ? `<span class="fb-group-count">${item.count}</span>` : '';
      return `<div class="fb-group ${isCurrent ? 'current' : ''} ${isEmpty ? 'empty' : ''}" data-id="${item.id}">
        <div class="fb-group-bracket open">(</div>
        <div class="fb-group-content">
          ${isEmpty
            ? `<span class="fb-group-empty-hint">пустая группа</span>`
            : item.items.map(child => renderItemHtml(child, depth + 1)).join('')
          }
        </div>
        <div class="fb-group-bracket close">)${countStr}</div>
        <button class="fb-group-close" title="Удалить группу">×</button>
      </div>`;
    }
    return '';
  }

  // ============ Действия ============
  function clearAll(){
    atoms = [];
    currentGroupId = null;
    render();
  }

  // ============ Точка входа ============
  window.__renderFormulaBuilder = function(container){
    const palette = ELEMENTS.map(e => `
      <button class="fb-element" data-sym="${e.sym}" style="--el-color: ${e.color};" title="${e.name}">
        <span class="fb-sym">${e.sym}</span>
        <span class="fb-name">${e.name}</span>
      </button>
    `).join('');

    container.innerHTML = `
      <div class="fb-layout">
        <div>
          <div class="tool-card">
            <label class="tool-label">Выберите элементы</label>
            <div class="fb-palette" id="fbPalette">
              ${palette}
            </div>

            <div class="fb-controls-row">
              <button class="fb-bracket-btn" id="fbBracketBtn">Открыть группу (</button>
              <span class="fb-controls-hint">
                Скобки позволяют собрать повторяющиеся группы: <code>Ca(OH)₂</code>, <code>Al₂(SO₄)₃</code>
              </span>
            </div>

            <label class="tool-label" style="margin-top:1rem;">Ваша молекула</label>
            <div class="fb-canvas" id="fbCanvas"></div>
            <p style="font-size:0.82rem;color:var(--ink-muted);margin-top:0.8rem;">
              💡 Клик по атому — увеличить количество. <b>Shift</b> + клик — уменьшить.
              Крестик удаляет элемент/группу.
            </p>
          </div>
        </div>

        <aside class="fb-panel">
          <div class="fb-result-formula" id="fbResultFormula">
            <span class="empty">— пока пусто —</span>
          </div>
          <div class="fb-info">
            <div class="fb-info-row">
              <span class="label">Молярная масса</span>
              <span class="value big" id="fbMassVal">—</span>
            </div>
            <div class="fb-info-row">
              <span class="label">Всего атомов</span>
              <span class="value" id="fbAtomsVal">—</span>
            </div>
            <div class="fb-info-row">
              <span class="label">Название</span>
              <span class="value" id="fbNameVal" style="font-family:inherit;color:var(--accent-amber);">—</span>
            </div>
          </div>
          <div class="fb-actions">
            <button class="tool-btn tool-btn-secondary" id="fbClearBtn">🗑 Очистить всё</button>
          </div>
        </aside>
      </div>`;

    // Палитра
    container.querySelectorAll('.fb-element').forEach(el => {
      el.addEventListener('click', e => {
        const sym = el.dataset.sym;
        if (e.shiftKey){
          const container2 = getCurrentContainer();
          const last = [...container2].reverse().find(a => a.type === 'atom' && a.sym === sym);
          if (last) decrementItem(last.id);
        } else {
          addElement(sym);
        }
      });
    });

    // Скобки
    document.getElementById('fbBracketBtn').addEventListener('click', toggleGroup);

    // Клики по canvas (делегирование)
    document.getElementById('fbCanvas').addEventListener('click', e => {
      // Удаление группы/атома
      const closeBtn = e.target.closest('.fb-atom-close, .fb-group-close');
      if (closeBtn){
        const parentEl = closeBtn.closest('.fb-atom, .fb-group');
        const id = +parentEl.dataset.id;
        removeItem(id);
        return;
      }
      // Клик по атому — увеличить/уменьшить
      const atomEl = e.target.closest('.fb-atom');
      if (atomEl){
        const id = +atomEl.dataset.id;
        if (e.shiftKey) decrementItem(id);
        else incrementItem(id);
        return;
      }
      // Клик по группе — увеличить/уменьшить
      const groupEl = e.target.closest('.fb-group');
      if (groupEl){
        const id = +groupEl.dataset.id;
        if (e.shiftKey) decrementItem(id);
        else incrementItem(id);
        return;
      }
    });

    // Очистить
    document.getElementById('fbClearBtn').addEventListener('click', clearAll);

    // Первичный рендер
    render();
  };
})();
