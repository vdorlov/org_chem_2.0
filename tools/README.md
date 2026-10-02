# Инструменты OrgChem 2.0

Модули подгружаются лениво при выборе из меню «🛠 Инструменты» в навбаре.

## Состав

### `molar-mass/`
Калькулятор молярных масс. Поддерживает скобки (Ca(OH)₂, Al₂(SO₄)₃), автозамену кириллицы на латиницу.
Экспорт: `window.__renderMolarMass(container)`.

### `equation-balancer/`
Автоматическая расстановка коэффициентов в уравнениях реакций методом Гаусса (в рациональных числах).
Экспорт: `window.__renderEquationBalancer(container)`.

### `formula-builder/`
Визуальный конструктор молекул. Клик по элементу → в формулу. Считает массу, показывает название если распознано.
Экспорт: `window.__renderFormulaBuilder(container)`.

## Добавление нового инструмента

1. Создайте папку `tools/my-tool/`.
2. Напишите `my-tool.js`, экспортирующий `window.__renderMyTool(container)`.
3. (Опционально) `my-tool.css`.
4. Добавьте запись в `TOOLS` объект в основном `index.html`:

   ```js
   'my-tool': {
     title: 'Мой инструмент',
     icon: '🎯',
     color: '#22d3ee',
     css: './tools/my-tool/my-tool.css',
     js: './tools/my-tool/my-tool.js',
     renderFn: '__renderMyTool'
   }
