/* ============================================================
   Конструктор формул
   Экспортирует window.__renderFormulaBuilder(containerEl)
   ============================================================ */
(function(){
  'use strict';

  // Элементы для конструктора
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
    { sym: 'Al', name: 'Алюминий',  color: '#a3e635', mass: 26.982 }
  ];

  // Известные вещества (для распознавания)
  const KNOWN = [
    { formula: 'CH4',    name: 'Метан' },
    { formula: 'C2H6',   name: 'Этан' },
    { formula: 'C3H8',   name: 'Пропан' },
    { formula: 'C4H10',  name: 'Бутан' },
    { formula: 'C2H4',   name: 'Этен (этилен)' },
    { formula: 'C3H6',   name: 'Пропен' },
    { formula: 'C2H2',   name: 'Этин (ацетилен)' },
    { formula: 'C6H6',   name: 'Бензол' },
    { formula: 'C6H5CH3',name: 'Толуол' },
    { formula: 'CH3OH',  name: 'Метанол' },
    { formula: 'C2H5OH', name: 'Этанол' },
    { formula: 'C3H7OH', name: 'Пропанол' },
    { formula: 'C6H5OH', name: 'Фенол' },
    { formula: 'CH3COOH',name: 'Уксусная кислота' },
    { formula: 'HCOOH',  name: 'Муравьиная кислота' },
    { formula: 'HCHO',   name: 'Формальдегид (метаналь)' },
    { formula: 'CH3CHO', name: 'Ацетальдегид (этаналь)' },
    { formula: 'CH3COCH3',name: 'Ацетон (пропанон)' },
    { formula: 'H2O',    name: 'Вода' },
    { formula: 'H2O2',   name: 'Пероксид водорода' },
    { formula: 'CO2',    name: 'Углекислый газ' },
    { formula: 'CO',     name: 'Угарный газ' },
    { formula: 'NH3',    name: 'Аммиак' },
    { formula: 'HNO3',   name: 'Азотная кислота' },
    { formula: 'H2SO4',  name: 'Серная кислота' },
    { formula: 'H3PO4',  name: 'Фосфорная кислота' },
    { formula: 'H2S',    name: 'Сероводород' }
  ];

  const ATOMIC_MASSES = {};
  ELEMENTS.forEach(e => ATOMIC_MASSES[e.sym] = e.mass);

  // Состояние
  let atoms = []; // [{ sym, count, id }]
  let nextId = 1;

  // ============ Утилиты ============
  function getElement(sym){
    return ELEMENTS.find(e => e.sym === sym);
  }
  function toSub(num){
    const map = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉' };
    return String(num).split('').map(d => map[d] || d).join('');
  }

  // Формируем строку формулы: обычно C—H—прочее, H₂O
  function buildFormulaString(){
    if (!atoms.length) return '';

    // Порядок элементов в органической формуле: C, H, потом остальные по алфавиту
    // Упрощённо: C, H, потом O, N, S, P, Cl, F, Br, I, металлы
    const order = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'Na', 'K', 'Ca', 'Mg', 'Fe', 'Cu', 'Zn', 'Al'];

    // Группируем по sym, суммируем count
    const grouped = {};
    for (const a of atoms){
      grouped[a.sym] = (grouped[a.sym] || 0) + a.count;
    }

    return order
      .filter(sym => grouped[sym])
      .map(sym => {
        const cnt = grouped[sym];
        return cnt > 1 ? sym + toSub(cnt) : sym;
      })
      .join('');
  }

  // Без подстрочных символов — для сравнения с KNOWN
  function buildPlainFormula(){
    if (!atoms.length) return '';
    const order = ['C', 'H', 'O', 'N', 'S', 'P', 'F', 'Cl', 'Br', 'I', 'Na', 'K', 'Ca', 'Mg', 'Fe', 'Cu', 'Zn', 'Al'];
    const grouped = {};
    for (const a of atoms) grouped[a.sym] = (grouped[a.sym] || 0) + a.count;
    return order
      .filter(sym => grouped[sym])
      .map(sym => {
        const cnt = grouped[sym];
        return cnt > 1 ? sym + cnt : sym;
      })
      .join('');
  }

  function calculateMass(){
    let total = 0;
    for (const a of atoms){
      if (ATOMIC_MASSES[a.sym]) total += ATOMIC_MASSES[a.sym] * a.count;
    }
    return total;
  }

  // ============ Рендер ============
  function render(){
    const canvas = document.getElementById('fbCanvas');
    const resultFormula = document.getElementById('fbResultFormula');
    const massVal = document.getElementById('fbMassVal');
    const atomsVal = document.getElementById('fbAtomsVal');
    const nameVal = document.getElementById('fbNameVal');
    if (!canvas) return;

    // Canvas
    if (!atoms.length){
      canvas.innerHTML = `<div class="fb-empty-hint" style="width:100%;">
        Нажмите на элементы слева, чтобы добавить их в молекулу
      </div>`;
    } else {
      canvas.innerHTML = atoms.map(a => {
        const el = getElement(a.sym);
        const color = el?.color || '#22d3ee';
        return `<div class="fb-atom" data-id="${a.id}" style="--el-color: ${color};">
          <button class="fb-atom-close" title="Удалить">×</button>
          <span class="fb-atom-sym">${a.sym}</span>
          <span class="fb-atom-count ${a.count <= 1 ? 'hidden' : ''}">${a.count}</span>
        </div>`;
      }).join('');
    }

    // Формула
    const formula = buildFormulaString();
    resultFormula.innerHTML = formula || '<span class="empty">— пока пусто —</span>';

    // Молярная масса
    const mass = calculateMass();
    massVal.textContent = mass > 0 ? Math.round(mass * 100) / 100 + ' г/моль' : '—';

    // Всего атомов
    const totalAtoms = atoms.reduce((s, a) => s + a.count, 0);
    atomsVal.textContent = totalAtoms || '—';

    // Название (если совпадает с известным)
    const plain = buildPlainFormula();
    const known = KNOWN.find(k => k.formula === plain);
    nameVal.textContent = known ? known.name : '—';

    // Обновить формулу в MathJax
    renderMathJax(resultFormula);
  }

  // ============ Действия ============
  function addElement(sym){
    // Если такой элемент уже есть и не C — увеличиваем count
    // Для углерода в органике часто нужно несколько атомов — тоже увеличиваем
    const existing = atoms.find(a => a.sym === sym);
    if (existing){
      existing.count++;
    } else {
      atoms.push({ sym, count: 1, id: nextId++ });
    }
    render();
  }

  function removeAtom(id){
    atoms = atoms.filter(a => a.id !== id);
    render();
  }

  function incrementAtom(id){
    const a = atoms.find(x => x.id === id);
    if (a){ a.count++; render(); }
  }

  function decrementAtom(id){
    const a = atoms.find(x => x.id === id);
    if (a){
      a.count--;
      if (a.count <= 0) atoms = atoms.filter(x => x.id !== id);
      render();
    }
  }

  function clearAll(){
    atoms = [];
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
            <label class="tool-label" style="margin-top:1rem;">Ваша молекула</label>
            <div class="fb-canvas" id="fbCanvas"></div>
            <p style="font-size:0.82rem;color:var(--ink-muted);margin-top:0.8rem;">
              💡 Нажмите на атом, чтобы добавить ещё один такой же.
              Клик по крестику или на элементе с <b>Shift</b> уменьшает количество.
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
          // Уменьшить последний такой
          const last = [...atoms].reverse().find(a => a.sym === sym);
          if (last) decrementAtom(last.id);
        } else {
          addElement(sym);
        }
      });
    });

    // Клики по canvas (делегирование)
    document.getElementById('fbCanvas').addEventListener('click', e => {
      const closeBtn = e.target.closest('.fb-atom-close');
      if (closeBtn){
        const id = +closeBtn.closest('.fb-atom').dataset.id;
        removeAtom(id);
        return;
      }
      const atomEl = e.target.closest('.fb-atom');
      if (atomEl){
        const id = +atomEl.dataset.id;
        if (e.shiftKey){
          decrementAtom(id);
        } else {
          incrementAtom(id);
        }
      }
    });

    // Очистить
    document.getElementById('fbClearBtn').addEventListener('click', clearAll);

    // Первичный рендер
    render();
  };
})();
