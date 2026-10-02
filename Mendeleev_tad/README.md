# Модуль «Периодическая таблица Менделеева»

Самодостаточный модуль: рендерит интерактивную таблицу 118 элементов.

## Файлы

- `periodic_table.js` — логика: рендер, фильтры, поиск, модалка. Экспортирует `window.__renderPeriodic(containerEl)`.
- `periodic_table.css` — стили таблицы. Используют CSS-переменные из основного `index.html`.
- `data.json` — данные 118 элементов + список категорий.

## Как подключить

В основном `index.html` таблица **не грузится сразу**. Она подкачивается при клике:

```js
await loadScript('Mendeleev_tad/periodic_table.js');
await loadStyle('Mendeleev_tad/periodic_table.css');
await window.__renderPeriodic(document.getElementById('periodic-root'));
