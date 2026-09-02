// ============================================================
// main.js - основной скрипт приложения "Таблица времён"
// ============================================================

/* ===========================💮💮💮=========================== */
// --- Хранилище для загруженных глаголов (для быстрого доступа) ---
// Ключом выступает инфинитив (v1), значением – полный объект глагола.
let verbMap = {};
// --- Текущая выбранная группа времён ---
// Определяет, какой рендерер будет использоваться при обновлении таблицы.
let currentGroup = 'simple';
// --- Идентификатор текущей цепочки озвучки ---
// Используется для остановки озвучки при повторном нажатии кнопки, 
// смене глагола или файла.
let lastChainId = null;
// --- Константы таймаутов ---
const SPEECH_PAUSE_MS = 1000;   // пауза между формами глагола при озвучке
const MESSAGE_DISPLAY_MS = 5000; // сколько показывать всплывающее сообщение

/* ===========================💮💮💮=========================== */
// --- Функция загрузки списка глаголов из JSON файла ---
// Принимает имя файла (например, 'verbs_regular.json') и инициирует загрузку.
// В случае успеха данные передаются в populateVerbs, при ошибке – выводится заглушка.
function loadVerbs(filename) {
  fetch(filename)
    .then(r => r.json())
    .then(populateVerbs)
    .catch(() => {
      // Техническая ошибка: сеть, битый JSON, HTTP-статус не 200 и т.п.
      // Все такие ошибки обрабатываются единообразно: показываем сообщение в списке,
      // блокируем выбор и заполняем таблицу дефисами.
      // Блокируем кнопку озвучки и показываем на ней эмодзи.
      const s = document.getElementById('verbSelect');
      s.innerHTML = '<option>Ошибка загрузки списка!</option>';
      s.disabled = true;
      verbMap = {};
      updateTable();
    });
}

/* ===========================💮💮💮=========================== */
// --- Заполнение выпадающего списка и первичный рендеринг ---
// verbs – массив объектов глаголов, полученный из JSON.
// Функция проверяет корректность данных, фильтрует валидные записи,
// заполняет verbMap, строит выпадающий список и отображает первый глагол.
function populateVerbs(verbs) {
  // Базовая проверка: если не массив или пустой массив, ставится заглушка 
  if (!Array.isArray(verbs) || verbs.length === 0) {
    const s = document.getElementById('verbSelect');
    s.innerHTML = '<option>Нет доступных глаголов</option>';
    s.disabled = true;
    verbMap = {};
    updateTable();
    return;
  }

  // Фильтрация: оставляем только корректные объекты
  // Проверяем, что каждый элемент – объект, имеет поле v1 типа строка, и v1 не пустая.
  // Это предотвращает попадание в список значений undefined, null, чисел и т.п.
  const validVerbs = verbs.filter(v => 
    v &&                                // не null/undefined
    typeof v === 'object' &&            // объект
    typeof v.v1 === 'string' &&         // v1 – строка
    v.v1.trim() !== ''                  // не пустая строка (даже если только пробелы)
  );

  // Если после фильтрации не осталось ни одного глагола, ставится заглушка 
  if (validVerbs.length === 0) {
    const s = document.getElementById('verbSelect');
    s.innerHTML = '<option>Некорректные данные</option>';
    s.disabled = true; 
    verbMap = {};
    updateTable();
    return;
  }

  // Заполнение verbMap – быстрый доступ по инфинитиву
  verbMap = {};
  validVerbs.forEach(v => {
    verbMap[v.v1] = v;
  });

  // Заполнение выпадающего списка: создаём option для каждого валидного глагола
  const s = document.getElementById('verbSelect');
  s.innerHTML = validVerbs.map(v => `<option value="${v.v1}">${v.v1}</option>`).join('');
  s.disabled = false;
  s.onchange = function() {
    stopSpeech();   // останавливаем текущую озвучку (если она была) при выборе нового глагола
    updateTable();  // и перерисовываем таблицу
  };

  // Автовыбор первого глагола и отображение таблицы
  const first = validVerbs[0];
  s.value = first.v1;
  updateTable();
}

/* ===========================💮💮💮=========================== */
// --- Основная функция обновления таблицы ---
// Получает выбранный глагол из выпадающего списка, ищет его в verbMap.
// Если глагол найден, вызывает рендерер, соответствующий текущей группе времён.
// Если не найден (например, из-за ошибки данных), отображает заглушку.
function updateTable() {	
  const select = document.getElementById('verbSelect');
  const selected = select.value;
  const verb = verbMap[selected];
  if (!verb) {
    renderDashPlaceholder();
    renderTranscription({});
    return;
  }  
  switch (currentGroup) {
    case 'simple':              renderSimple(verb); break;
    case 'progressive':         renderContinuous(verb); break;
    case 'perfect':             renderPerfect(verb); break;
    case 'perfect-progressive': renderPerfectContinuous(verb); break;
    default:                    renderSimple(verb);
  }
  renderTranscription(verb);
}

// ============================================================
// Обработчики событий
// ============================================================

/* ===========================💮💮💮=========================== */
// --- Переключение списка Regular / Irregular ---
// При изменении состояния чекбокса загружается соответствующий JSON-файл.
// Если чекбокс включён – загружаются неправильные глаголы, иначе – правильные.
document.getElementById('fileToggle').onchange = function() {
  stopSpeech(); // останавливаем при переключении файла
  const filename = this.checked ? './verbs/verbs_irregular.json' : './verbs/verbs_regular.json';
  loadVerbs(filename);
};

/* ===========================💮💮💮=========================== */
// --- Переключение группы времён и цвета ---
// При выборе радио-кнопки обновляется currentGroup, меняется цветовая тема
// и перерисовывается таблица с новым рендерером.
document.querySelectorAll('input[name="tense-group"]').forEach(radio => {
  radio.addEventListener('change', function() {
    currentGroup = this.value;
    // Карта цветов для каждой группы – меняет CSS-переменную --primary-color
    const colorMap = {
      'simple':              '#00b8e6',
      'progressive':         '#ff8095',
      'perfect':             '#e9a633',
      'perfect-progressive': '#8f5ca0'
    };
    document.documentElement.style.setProperty('--primary-color', colorMap[currentGroup] || '#00b8e6');
    updateTable();
  });
});



/* ===========================💮💮💮=========================== */
// --- Кнопка озвучки ---
// Последовательно произносит все формы глагола.
document.getElementById('speakBtn').addEventListener('click', function() {
  // Если кнопка заблокирована – нечего озвучивать
  if (this.disabled) return;

  // Проверка поддержки синтеза речи
  if (!('speechSynthesis' in window)) {
    showSpeechMessage('Ваш браузер не поддерживает синтез речи.');
    return;
  }

  // Получаем текущий глагол и проверяем наличие всех форм
  const select = document.getElementById('verbSelect');
  const verb = verbMap[select.value];
  if (!verb) return;

  if (
      typeof verb.v1 !== 'string' || verb.v1.trim() === '' ||
      typeof verb.v1s !== 'string' || verb.v1s.trim() === '' ||
      typeof verb.v2 !== 'string' || verb.v2.trim() === '' ||
      typeof verb.v3 !== 'string' || verb.v3.trim() === '' ||
      typeof verb.v_ing !== 'string' || verb.v_ing.trim() === ''
  ) {
    showSpeechMessage('Нет полного набора форм глагола.');
    return;
  }

  const forms = [verb.v1, verb.v1s, verb.v2, verb.v3, verb.v_ing];

  // Отменяем текущую озвучку и создаём уникальный ID цепочки
  window.speechSynthesis.cancel();
  const chainId = Date.now();
  console.log('chainId:', chainId);
  lastChainId = chainId;

  // Рекурсивная функция для последовательной озвучки с паузой
  const speakNext = (index) => {
    if (chainId !== lastChainId || index >= forms.length) return;

    const utterance = new SpeechSynthesisUtterance(forms[index]);
    utterance.lang = 'en-US';
    utterance.rate = 0.5;   // скорость речи: от 0.1 до 10, 1.0 - реальная скорость.
    utterance.pitch = 1.0;  // высота тона: от 0 до 2, 1.0 - естественный голос.
    utterance.volume = 1.0; // громкость: от 0 до 1, 1.0 - полная громкость.

    utterance.onend = () => {
      if (chainId !== lastChainId) return;
      setTimeout(() => speakNext(index + 1), SPEECH_PAUSE_MS);
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext(0);
});


/* ===========================💮💮💮=========================== */
// --- Функция остановки синтеза речи ---
// Останавливает текущую озвучку и сбрасывает идентификатор,
// чтобы все активные цепочки прекратились.
function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  lastChainId = null;
}

// ============================================================
// 🔵🔴🟠🟣
// ============================================================

/* ===========================💮💮💮=========================== */
// --- Замена дефолтного Alert ---
// Всплывающее сообщение для уведомлений
let speechMessageTimer;
function showSpeechMessage(text) {
  const el = document.getElementById('speechMessage');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(speechMessageTimer);
  speechMessageTimer = setTimeout(() => {
    el.classList.remove('show');
  }, MESSAGE_DISPLAY_MS);
}

/* ===========================💮💮💮=========================== */
// --- Инициализация –--
// При старте приложения загружается JSON с правильными глаголами.
loadVerbs('./verbs/verbs_regular.json');


/* ===========================💮💮💮=========================== */
