/* ============================================================
   Калькулятор молярных масс
   Экспортирует window.__renderMolarMass(containerEl)
   ============================================================ */
(function(){
  'use strict';

  // Атомные массы элементов (г/моль)
  const ATOMIC_MASSES = {
    H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011,
    N: 14.007, O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305,
    Al: 26.982, Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45, Ar: 39.948,
    K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
    Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38,
    Ga: 69.723, Ge: 72.630, As: 74.922, Se: 78.971, Br: 79.904, Kr: 83.798,
    Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224, Nb: 92.906, Mo: 95.95,
    Tc: 98, Ru: 101.07, Rh: 102.91, Pd: 106.42, Ag: 107.87, Cd: 112.41,
    In: 114.82, Sn: 118.71, Sb: 121.76, Te: 127.60, I: 126.90, Xe: 131.29,
    Cs: 132.91, Ba: 137.33, La: 138.91, Ce: 140.12, Pr: 140.91, Nd: 144.24,
    Pm: 145, Sm: 150.36, Eu: 151.96, Gd: 157.25, Tb: 158.93, Dy: 162.50,
    Ho: 164.93, Er: 167.26, Tm: 168.93, Yb: 173.05, Lu: 174.97, Hf: 178.49,
    Ta: 180.95, W: 183.84, Re: 186.21, Os: 190.23, Ir: 192.22, Pt: 195.08,
    Au: 196.97, Hg: 200.59, Tl: 204.38, Pb: 207.2, Bi: 208.98, Po: 209,
    At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.04, Pa: 231.04,
    U: 238.03, Np: 237, Pu: 244, Am: 243, Cm: 247, Bk: 247, Cf: 251,
    Es: 252, Fm: 257, Md: 258, No: 259, Lr: 266, Rf: 267, Db: 268,
    Sg: 269, Bh: 270, Hs: 269, Mt: 278, Ds: 281, Rg: 282, Cn: 285,
    Nh: 286, Fl: 289, Mc: 290, Lv: 293, Ts: 294, Og: 294
  };

  const ELEMENT_NAMES = {
    H:'Водород', He:'Гелий', Li:'Литий', Be:'Бериллий', B:'Бор', C:'Углерод',
    N:'Азот', O:'Кислород', F:'Фтор', Ne:'Неон', Na:'Натрий', Mg:'Магний',
    Al:'Алюминий', Si:'Кремний', P:'Фосфор', S:'Сера', Cl:'Хлор', Ar:'Аргон',
    K:'Калий', Ca:'Кальций', Fe:'Железо', Cu:'Медь', Zn:'Цинк', Ag:'Серебро',
    Sn:'Олово', Pb:'Свинец', Hg:'Ртуть', Mn:'Марганец', Ni:'Никель',
    Co:'Кобальт', Cr:'Хром', Ba:'Барий', Sr:'Стронций', Br:'Бром', I:'Иод'
  };

  // Разбор формулы
  // H2SO4 → [{el:'H', count:2}, {el:'S', count:1}, {el:'O', count:4}]
  // С поддержкой скобок: Ca(OH)2, (NH4)2SO4
  function parseFormula(formula){
    // Нормализация: убираем пробелы, преобразуем подстрочные цифры
    formula = String(formula).trim()
      .replace(/[\s]/g, '')
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, ch => '₀₁₂₃₄₅₆₇₈₉'.indexOf(ch));

    if (!formula) throw new Error('Пустая формула');

    const result = {}; // { H: 2, S: 1, O: 4 }
    let i = 0;

    function parseGroup(){
      const groupResult = {};
      while (i < formula.length){
        const ch = formula[i];

        if (ch === '('){
          i++;
          const inner = parseGroup();
          // Ожидаем ')'
          if (formula[i] !== ')') throw new Error('Не закрыта скобка');
          i++;
          // Читаем коэффициент после скобки
          let mult = readNumber();
          if (mult === 0) mult = 1;
          for (const el in inner){
            groupResult[el] = (groupResult[el] || 0) + inner[el] * mult;
          }
          continue;
        }

        if (ch === ')'){
          return groupResult;
        }

        if (ch === '·' || ch === '*' || ch === '×'){
          // Кристаллогидрат — просто пропускаем пока (можно улучшить)
          i++;
          continue;
        }

        // Читаем элемент: заглавная + опционально строчные
        if (/[A-ZА-Я]/.test(ch)){
          let el = ch;
          i++;
          while (i < formula.length && /[a-zа-я]/.test(formula[i])){
            el += formula[i];
            i++;
          }
          // Нормализация кириллицы в латиницу (если ученик напечатал "С" вместо "C")
          el = normalizeElement(el);
          const count = readNumber() || 1;
          groupResult[el] = (groupResult[el] || 0) + count;
          continue;
        }

        i++;
      }
      return groupResult;
    }

    function readNumber(){
      let numStr = '';
      while (i < formula.length && /\d/.test(formula[i])){
        numStr += formula[i];
        i++;
      }
      return numStr ? parseInt(numStr, 10) : 0;
    }

    function normalizeElement(el){
      // Замена кириллических похожих букв на латинские
      const map = { 'Н':'H', 'С':'C', 'О':'O', 'Р':'P', 'S':'S', 'N':'N', 'K':'K', 'I':'I', 'B':'B', 'F':'F' };
      return el.split('').map(c => map[c] || c).join('');
    }

    const parsed = parseGroup();
    return parsed;
  }

  // Расчёт массы
  function calculateMolarMass(parsed){
    let total = 0;
    const breakdown = [];
    const errors = [];

    for (const el in parsed){
      if (!ATOMIC_MASSES[el]){
        errors.push(el);
        continue;
      }
      const count = parsed[el];
      const mass = ATOMIC_MASSES[el];
      const contrib = count * mass;
      total += contrib;
      breakdown.push({
        el,
        name: ELEMENT_NAMES[el] || el,
        count,
        mass,
        contrib
      });
    }

    // Сортировка по убыванию вклада
    breakdown.sort((a, b) => b.contrib - a.contrib);

    return { total, breakdown, errors };
  }

  // Форматирование числа
  function fmt(n){
    return Math.round(n * 100) / 100;
  }

  // HTML вывод
  function renderResult(inputFormula, parsed, { total, breakdown, errors }){
    if (errors.length){
      return `<div class="tool-error">
        ⚠️ Неизвестные элементы: ${errors.join(', ')}.
        Проверьте формулу или напишите её латиницей (H₂SO₄ → H2SO4).
      </div>`;
    }

    const breakdownRows = breakdown.map(b => `
      <div class="molar-row">
        <span class="molar-symbol" style="color: ${elementColor(b.el)}">${b.el}</span>
        <span class="molar-name">${b.name}</span>
        <span class="molar-count">${b.count} × ${fmt(b.mass)}</span>
        <span class="molar-contrib">${fmt(b.contrib)} г/моль</span>
      </div>
    `).join('');

    // Формула с подстрочными цифрами для отображения
    const renderedFormula = formatFormula(inputFormula);

    return `
      <div class="molar-result">
        <div class="molar-formula-rendered">${renderedFormula}</div>
        <div class="molar-total">${fmt(total)}</div>
        <div class="molar-total-suffix">г/моль — молярная масса</div>
        <div class="molar-breakdown">${breakdownRows}</div>
      </div>`;
  }

  // Цвет элемента (приблизительный)
  function elementColor(el){
    const colors = {
      H: '#eef2fa', C: '#8b92b9', O: '#fb7185', N: '#5b8def',
      S: '#fbbf24', P: '#fb923c', Cl: '#34d399', F: '#22d3ee',
      Br: '#a855f7', I: '#b47cf0', Na: '#c084fc', K: '#a78bfa',
      Ca: '#f472b6', Mg: '#818cf8', Fe: '#fb923c', Cu: '#fbbf24',
      Zn: '#94a3b8', Ag: '#cbd5e1', Ba: '#f87171', Al: '#a3e635'
    };
    return colors[el] || '#a8b0d6';
  }

  // Заменяет цифры в формуле на подстрочные
  function formatFormula(formula){
    return String(formula)
      .replace(/([A-Za-zА-Яа-я)])(\d+)/g, (m, el, num) => el + toSub(num));
  }
  function toSub(num){
    const map = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉' };
    return String(num).split('').map(d => map[d] || d).join('');
  }

  // Точка входа
  window.__renderMolarMass = function(container){
    container.innerHTML = `
      <div class="tool-card">
        <label class="tool-label" for="mmInput">Химическая формула</label>
        <div class="molar-mass-input-row">
          <input
            type="text"
            id="mmInput"
            class="tool-input"
            placeholder="Например: H2SO4, Ca(OH)2, C6H12O6"
            autocomplete="off"
            spellcheck="false"
          >
          <button class="tool-btn" id="mmCalcBtn">Рассчитать</button>
        </div>
        <div class="molar-mass-examples">
          ${['H2O', 'H2SO4', 'Ca(OH)2', 'C6H12O6', 'KMnO4', 'CH3COOH', 'Al2(SO4)3']
            .map(f => `<span class="molar-mass-example" data-formula="${f}">${formatFormula(f)}</span>`)
            .join('')}
        </div>
        <div id="mmResult"></div>
      </div>`;

    const input = document.getElementById('mmInput');
    const btn = document.getElementById('mmCalcBtn');
    const result = document.getElementById('mmResult');

    function calculate(){
      const raw = input.value.trim();
      if (!raw){
        result.innerHTML = '';
        return;
      }
      try {
        const parsed = parseFormula(raw);
        const calc = calculateMolarMass(parsed);
        result.innerHTML = renderResult(raw, parsed, calc);
        renderMathJax(result);
      } catch(e){
        result.innerHTML = `<div class="tool-error">⚠️ ${e.message}</div>`;
      }
    }

    btn.addEventListener('click', calculate);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') calculate();
    });

    // Примеры
    container.querySelectorAll('.molar-mass-example').forEach(el => {
      el.addEventListener('click', () => {
        input.value = el.dataset.formula;
        calculate();
      });
    });

    // Автофокус
    setTimeout(() => input.focus(), 100);

    // Реакция на ввод (с задержкой)
    let debounce;
    input.addEventListener('input', () => {
      clearTimeout(debounce);
      debounce = setTimeout(calculate, 400);
    });
  };
})();
