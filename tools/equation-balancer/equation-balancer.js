/* ============================================================
   Ввод уравнений реакций с автобалансировкой
   Экспортирует window.__renderEquationBalancer(containerEl)
   ============================================================ */
(function(){
  'use strict';

  // ============ Парсер формул (тот же, что в калькуляторе) ============
  function parseFormula(formula){
    formula = String(formula).trim()
      .replace(/[\s]/g, '')
      .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, ch => '₀₁₂₃₄₅₆₇₈₉'.indexOf(ch));

    if (!formula) throw new Error('Пустая формула');

    const result = {};
    let i = 0;

    function parseGroup(){
      const groupResult = {};
      while (i < formula.length){
        const ch = formula[i];
        if (ch === '('){
          i++;
          const inner = parseGroup();
          if (formula[i] !== ')') throw new Error('Не закрыта скобка');
          i++;
          let mult = readNumber();
          if (mult === 0) mult = 1;
          for (const el in inner){
            groupResult[el] = (groupResult[el] || 0) + inner[el] * mult;
          }
          continue;
        }
        if (ch === ')') return groupResult;
        if (/[A-ZА-Я]/.test(ch)){
          let el = ch;
          i++;
          while (i < formula.length && /[a-zа-я]/.test(formula[i])){
            el += formula[i]; i++;
          }
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
        numStr += formula[i]; i++;
      }
      return numStr ? parseInt(numStr, 10) : 0;
    }

    function normalizeElement(el){
      const map = { 'Н':'H','С':'C','О':'O','Р':'P','S':'S','N':'N','K':'K','I':'I','B':'B','F':'F' };
      return el.split('').map(c => map[c] || c).join('');
    }

    return parseGroup();
  }

  // ============ Парсер одной стороны уравнения ============
  // "2H2 + O2" → [{coef:2, formula:'H2', atoms:{H:2}}, {coef:1, formula:'O2', atoms:{O:2}}]
  function parseSide(sideStr){
    const parts = String(sideStr).split('+').map(s => s.trim()).filter(Boolean);
    if (!parts.length) throw new Error('Пустая сторона уравнения');

    return parts.map(part => {
      // Регулярка: опциональный коэффициент (число в начале), потом формула
      const m = part.match(/^(\d+)\s*\*?\s*(.+)$/);
      if (m){
        return {
          coef: parseInt(m[1], 10),
          formula: m[2].trim(),
          atoms: parseFormula(m[2])
        };
      }
      return {
        coef: 1,
        formula: part,
        atoms: parseFormula(part)
      };
    });
  }

  // ============ Подсчёт атомов на стороне ============
  function countAtoms(side){
    const counts = {};
    for (const part of side){
      for (const el in part.atoms){
        counts[el] = (counts[el] || 0) + part.atoms[el] * part.coef;
      }
    }
    return counts;
  }

  // ============ Расстановка коэффициентов ============
  // Метод: строим матрицу из элементов × веществ
  // Решаем линейную систему: sum(coef_left * atoms_left) = sum(coef_right * atoms_right)
  // Решаем методом Гаусса (приведение к ступенчатому виду) в рациональных числах.

  // --- Работа с рациональными числами (дроби) ---
  function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b){ [a, b] = [b, a % b]; } return a; }
  function lcm(a, b){ return a / gcd(a, b) * b; }

  function makeFraction(num, den = 1){
    if (den === 0) throw new Error('Деление на ноль');
    if (den < 0){ num = -num; den = -den; }
    const g = gcd(num, den) || 1;
    return { num: num / g, den: den / g };
  }
  function fAdd(a, b){ return makeFraction(a.num * b.den + b.num * a.den, a.den * b.den); }
  function fSub(a, b){ return makeFraction(a.num * b.den - b.num * a.den, a.den * b.den); }
  function fMul(a, b){ return makeFraction(a.num * b.num, a.den * b.den); }
  function fDiv(a, b){ return makeFraction(a.num * b.den, a.den * b.num); }
  function fIsZero(a){ return a.num === 0; }

  function balanceEquation(leftParts, rightParts){
    // Собираем все элементы
    const allEls = new Set();
    for (const p of leftParts) for (const el in p.atoms) allEls.add(el);
    for (const p of rightParts) for (const el in p.atoms) allEls.add(el);
    const elements = [...allEls];

    // Строим матрицу A: строки — элементы, столбцы — вещества.
    // Слева положительные вклады, справа отрицательные.
    // Требование: A · x = 0, где x — вектор коэффициентов.
    const cols = leftParts.length + rightParts.length;
    const A = elements.map(el => {
      const row = new Array(cols).fill(0);
      leftParts.forEach((p, i) => row[i] = p.atoms[el] || 0);
      rightParts.forEach((p, j) => row[leftParts.length + j] = -(p.atoms[el] || 0));
      return row.map(v => makeFraction(v, 1));
    });

    // Приводим к ступенчатому виду (метод Гаусса)
    const rows = A.length;
    let pivotRow = 0;
    const pivotCols = [];
    for (let col = 0; col < cols && pivotRow < rows; col++){
      // Ищем ненулевую ячейку в этом столбце начиная с pivotRow
      let swap = -1;
      for (let r = pivotRow; r < rows; r++){
        if (!fIsZero(A[r][col])){ swap = r; break; }
      }
      if (swap === -1) continue;

      // Меняем строки
      if (swap !== pivotRow){
        [A[swap], A[pivotRow]] = [A[pivotRow], A[swap]];
      }

      // Нормируем строку: делим на A[pivotRow][col]
      const pivotVal = A[pivotRow][col];
      for (let c = 0; c < cols; c++){
        A[pivotRow][c] = fDiv(A[pivotRow][c], pivotVal);
      }

      // Обнуляем остальные строки в этом столбце
      for (let r = 0; r < rows; r++){
        if (r === pivotRow) continue;
        if (fIsZero(A[r][col])) continue;
        const factor = A[r][col];
        for (let c = 0; c < cols; c++){
          A[r][c] = fSub(A[r][c], fMul(factor, A[pivotRow][c]));
        }
      }

      pivotCols.push(col);
      pivotRow++;
    }

    // Свободные переменные
    const freeCols = [];
    for (let c = 0; c < cols; c++){
      if (!pivotCols.includes(c)) freeCols.push(c);
    }

    if (freeCols.length === 0){
      throw new Error('Единственное решение — все коэффициенты нулевые. Проверьте уравнение.');
    }
    if (freeCols.length > 1){
      throw new Error('Уравнение имеет бесконечно много решений — возможно, это не одна реакция.');
    }

    // Свободную переменную полагаем = 1
    const freeCol = freeCols[0];
    const x = new Array(cols).fill(makeFraction(0, 1));
    x[freeCol] = makeFraction(1, 1);

    // Выражаем остальные через свободную
    for (let i = 0; i < pivotCols.length; i++){
      const pc = pivotCols[i];
      // В строке i: x[pc] + sum(A[i][c] * x[c]) = 0
      // x[pc] = -sum(A[i][c] * x[c])
      let sum = makeFraction(0, 1);
      for (let c = 0; c < cols; c++){
        if (c === pc) continue;
        if (fIsZero(A[i][c])) continue;
        sum = fAdd(sum, fMul(A[i][c], x[c]));
      }
      x[pc] = fSub(makeFraction(0, 1), sum);
    }

    // Приводим к целым числам: умножаем на НОК знаменателей
    let commonDen = 1;
    for (const v of x) commonDen = lcm(commonDen, v.den);
    const intX = x.map(v => (v.num * (commonDen / v.den)));
    // Приводим к НОД
    let commonGcd = 0;
    for (const v of intX) commonGcd = gcd(commonGcd, v);
    if (commonGcd === 0) commonGcd = 1;
    const finalX = intX.map(v => v / commonGcd);

    // Проверяем, что все положительные
    for (const v of finalX){
      if (v <= 0) throw new Error('Не удалось расставить коэффициенты — проверьте уравнение.');
    }

    return finalX;
  }

  // ============ Форматирование вывода ============
  function formatFormulaWithSub(formula){
    return String(formula).replace(/([A-Za-zА-Яа-я)])(\d+)/g, (m, el, num) => el + toSub(num));
  }
  function toSub(num){
    const map = { '0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉' };
    return String(num).split('').map(d => map[d] || d).join('');
  }

  function formatSideHtml(parts, coefs, offset){
    return parts.map((p, i) => {
      const c = coefs[offset + i];
      const coefStr = c > 1 ? `<span class="coef">${c}</span>` : '';
      return `${coefStr}<span class="formula">${formatFormulaWithSub(p.formula)}</span>`;
    }).join(' <span class="plus">+</span> ');
  }

  // ============ Точка входа ============
  window.__renderEquationBalancer = function(container){
    container.innerHTML = `
      <div class="tool-card">
        <p style="color:var(--ink-muted);font-size:0.9rem;margin-bottom:1.2rem;">
          Введите уравнение реакции. Можно писать формулы с коэффициентами или без них —
          инструмент сам подберёт правильные коэффициенты.
        </p>

        <div class="eq-input-grid">
          <div>
            <label class="eq-side-label" for="eqLeft">Левая часть (реагенты)</label>
            <input
              type="text"
              id="eqLeft"
              class="tool-input"
              placeholder="Например: CH4 + O2"
              autocomplete="off"
              spellcheck="false"
            >
          </div>
          <div class="eq-arrow">→</div>
          <div>
            <label class="eq-side-label" for="eqRight">Правая часть (продукты)</label>
            <input
              type="text"
              id="eqRight"
              class="tool-input"
              placeholder="Например: CO2 + H2O"
              autocomplete="off"
              spellcheck="false"
            >
          </div>
        </div>

        <div class="eq-examples">
          <span class="eq-example" data-l="CH4 + O2" data-r="CO2 + H2O">CH₄ + O₂ → CO₂ + H₂O</span>
          <span class="eq-example" data-l="H2 + O2" data-r="H2O">H₂ + O₂ → H₂O</span>
          <span class="eq-example" data-l="Fe + HCl" data-r="FeCl2 + H2">Fe + HCl → FeCl₂ + H₂</span>
          <span class="eq-example" data-l="Al + CuSO4" data-r="Al2(SO4)3 + Cu">Al + CuSO₄ → Al₂(SO₄)₃ + Cu</span>
          <span class="eq-example" data-l="KMnO4 + HCl" data-r="KCl + MnCl2 + Cl2 + H2O">KMnO₄ + HCl → …</span>
        </div>

        <div class="eq-actions">
          <button class="tool-btn" id="eqBalanceBtn">⚖️ Расставить коэффициенты</button>
          <button class="tool-btn tool-btn-secondary" id="eqClearBtn">Очистить</button>
        </div>

        <div id="eqResult"></div>
      </div>`;

    const leftInput = document.getElementById('eqLeft');
    const rightInput = document.getElementById('eqRight');
    const balanceBtn = document.getElementById('eqBalanceBtn');
    const clearBtn = document.getElementById('eqClearBtn');
    const result = document.getElementById('eqResult');

    function clearAll(){
      leftInput.value = '';
      rightInput.value = '';
      result.innerHTML = '';
      leftInput.focus();
    }

    function doBalance(){
      const l = leftInput.value.trim();
      const r = rightInput.value.trim();

      if (!l || !r){
        result.innerHTML = `<div class="eq-result error">
          <strong>⚠️ Введите обе части уравнения</strong>
        </div>`;
        return;
      }

      try {
        const leftParts = parseSide(l);
        const rightParts = parseSide(r);

        const coefs = balanceEquation(leftParts, rightParts);

        // Формируем HTML с коэффициентами
        const leftHtml = formatSideHtml(leftParts, coefs, 0);
        const rightHtml = formatSideHtml(rightParts, coefs, leftParts.length);

        // Проверка по атомам
        const leftAtoms = countAtoms(leftParts.map((p, i) => ({ ...p, coef: coefs[i] })));
        const rightAtoms = countAtoms(rightParts.map((p, i) => ({ ...p, coef: coefs[leftParts.length + i] })));

        const allEls = new Set([...Object.keys(leftAtoms), ...Object.keys(rightAtoms)]);
        const tableRows = [...allEls].map(el => {
          const lc = leftAtoms[el] || 0;
          const rc = rightAtoms[el] || 0;
          const ok = lc === rc;
          return `<tr>
            <td><span class="eq-element-sym">${el}</span></td>
            <td>${lc}</td>
            <td>${rc}</td>
            <td class="${ok ? 'balanced' : 'unbalanced'}">${ok ? '✓' : '✗'}</td>
          </tr>`;
        }).join('');

        result.innerHTML = `
          <div class="eq-result">
            <strong style="color:var(--accent-green);">✅ Уравнение уравнено</strong>
            <div class="eq-balanced">
              ${leftHtml} <span class="arrow">→</span> ${rightHtml}
            </div>
            <table class="eq-atoms-table">
              <thead>
                <tr>
                  <th>Элемент</th>
                  <th>Слева</th>
                  <th>Справа</th>
                  <th>Проверка</th>
                </tr>
              </thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>`;

      } catch(e){
        result.innerHTML = `<div class="eq-result error">
          <strong>⚠️ Ошибка</strong>
          <p style="margin-top:0.5rem;">${e.message}</p>
        </div>`;
      }
    }

    balanceBtn.addEventListener('click', doBalance);
    clearBtn.addEventListener('click', clearAll);

    // Enter в любом поле — балансировать
    [leftInput, rightInput].forEach(inp => {
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') doBalance();
      });
    });

    // Примеры
    container.querySelectorAll('.eq-example').forEach(el => {
      el.addEventListener('click', () => {
        leftInput.value = el.dataset.l;
        rightInput.value = el.dataset.r;
        doBalance();
      });
    });

    setTimeout(() => leftInput.focus(), 100);
  };
})();
