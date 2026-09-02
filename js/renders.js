// ============================================================
// renders.js - все функции отрисовки таблицы
// ============================================================

/* ============================💮💮💮============================ */
// --- PLACEHOLDER ---
// Заполняет таблицу дефисами при отсутствии данных (заглушка)
// Создаёт фиктивный объект глагола со всеми полями, равными "-",
// и вызывает соответствующий рендерер в зависимости от currentGroup.
// Это позволяет сохранить структуру таблицы (с местоимениями, цветами и т.п.)
// даже при отсутствии реальных данных.
function renderDashPlaceholder() {
  const verb = {v1: "-", v1s: "-", v2: "-", v3: "-", v_ing: "-"}; 
  switch (currentGroup) {
    case 'simple':              renderSimple(verb); break;
    case 'progressive':         renderContinuous(verb); break;
    case 'perfect':             renderPerfect(verb); break;
    case 'perfect-progressive': renderPerfectContinuous(verb); break;
    default:                    renderSimple(verb);
  }
}

/* ============================💮💮💮============================ */
// --- SIMPLE ---
// Рендерит ячейки для Present, Past и Future Simple.
// Для глагола 'be' используется отдельная логика с разбивкой по лицам,
// для всех остальных – стандартные конструкции с do/does/did.
function renderSimple(v) {
  // Проверка: v1, v1s, v2 - строки и не пустые.
  // Если хотя бы одно поле отсутствует, имеет неверный тип или пустое,
  // то вызов рендерера невозможен – показываем заглушку.
  if (
    typeof v.v1 !== 'string' || v.v1.trim() === '' ||
    typeof v.v1s !== 'string' || v.v1s.trim() === '' ||
    typeof v.v2 !== 'string' || v.v2.trim() === ''
  ) {
    renderDashPlaceholder();
    return;
  }
  const v1 = v.v1, v1s = v.v1s, v2 = v.v2;
  
  // Частный случай глагола be – его спряжение уникально для каждого лица.
  // В отличие от остальных глаголов, у be нет единых форм для всех лиц,
  // поэтому для каждого времени создаются отдельные блоки по группам местоимений.
  if (v1 === 'be') { 	
    // Future Simple: will + be (единый блок для всех лиц, так как be в будущем не меняется)
    document.getElementById('td_fut_q').innerHTML =
      `<div class="verb-block"><span class="v-i">Will</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-box">be</span>?</div>`;
    document.getElementById('td_fut_pos').innerHTML =
      `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will</span> <span class="v-box">be</span></div>`;
    document.getElementById('td_fut_neg').innerHTML =
      `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will not</span> <span class="v-box">be</span></div>`;

    // Present Simple: am/are/is в зависимости от лица (три группы: I / You-We-They / He-She-It)
    document.getElementById('td_pres_q').innerHTML = `
      <div class="verb-block"><span class="v-i">Am</span><div class="pronouns">I</div>?</div>
      <div class="verb-block"><span class="v-i">Are</span><div class="pronouns">You<br>We<br>They</div>?</div>
      <div class="verb-block"><span class="v-i">Is</span><div class="pronouns">He<br>She<br>It</div>?</div>
    `;
    document.getElementById('td_pres_pos').innerHTML = `
      <div class="verb-block"><div class="pronouns">I</div><span class="v-i">am</span></div>
      <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">are</span></div>
      <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">is</span></div>
    `;
    document.getElementById('td_pres_neg').innerHTML = `
      <div class="verb-block"><div class="pronouns">I</div><span class="v-i">am not</span></div>
      <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">are not</span></div>
      <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">is not</span></div>
    `;

    // Past Simple: was/were в зависимости от лица (две группы: I-He-She-It / You-We-They)
    document.getElementById('td_past_q').innerHTML = `
      <div class="verb-block"><span class="v-i">Was</span><div class="pronouns">I<br>He<br>She<br>It</div>?</div>
      <div class="verb-block"><span class="v-i">Were</span><div class="pronouns">You<br>We<br>They</div>?</div>
    `;
    document.getElementById('td_past_pos').innerHTML = `
      <div class="verb-block"><div class="pronouns">I<br>He<br>She<br>It</div><span class="v-i">was</span></div>
      <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">were</span></div>
    `;
    document.getElementById('td_past_neg').innerHTML = `
      <div class="verb-block"><div class="pronouns">I<br>He<br>She<br>It</div><span class="v-i">was not</span></div>
      <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">were not</span></div>
    `;
    return;
  }

  // Стандартные глаголы (не be)
  // Future Simple: единая конструкция для всех лиц
  document.getElementById('td_fut_q').innerHTML =
    `<div class="verb-block"><span class="v-i">Will</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-box">${v1}</span>?</div>`;
  document.getElementById('td_fut_pos').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will</span> <span class="v-box">${v1}</span></div>`;
  document.getElementById('td_fut_neg').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will not</span> <span class="v-box">${v1}</span></div>`;

  // Present Simple: разделение на I/You/We/They (do) и He/She/It (does)
  document.getElementById('td_pres_q').innerHTML = `
    <div class="verb-block"><span class="v-i">Do</span><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-box">${v1}</span>?</div>
    <div class="verb-block"><span class="v-i">Does</span><div class="pronouns">He<br>She<br>It</div><span class="v-box">${v1}</span>?</div>
  `;
  document.getElementById('td_pres_pos').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-box">${v1}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-box">${v1s}</span></div>
  `;
  document.getElementById('td_pres_neg').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-i">do not</span> <span class="v-box">${v1}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">does not</span> <span class="v-box">${v1}</span></div>
  `;

  // Past Simple: единая конструкция с did для всех лиц
  document.getElementById('td_past_q').innerHTML =
    `<div class="verb-block"><span class="v-i">Did</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-box">${v1}</span>?</div>`;
  document.getElementById('td_past_pos').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-box">${v2}</span></div>`;
  document.getElementById('td_past_neg').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">did not</span> <span class="v-box">${v1}</span></div>`;
}

/* ============================💮💮💮============================ */
// --- CONTINUOUS ---
// Рендерит ячейки для Present, Past и Future Continuous.
// Использует форму v_ing и вспомогательные глаголы to be.
function renderContinuous(v) {
  // Проверка: v_ing - строка и не пустая.
  // Если поле отсутствует, имеет неверный тип или пустое,
  // то вызов рендерера невозможен – показываем заглушку.
  if (typeof v.v_ing !== 'string' || v.v_ing.trim() === '') {
    renderDashPlaceholder();
    return;
  }
  const ing = v.v_ing;

  // Future Continuous: will be + ing (единый блок)
  document.getElementById('td_fut_q').innerHTML =
    `<div class="verb-block"><span class="v-i">Will</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">be</span> <span class="v-box">${ing}</span>?</div>`;
  document.getElementById('td_fut_pos').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will be</span> <span class="v-box">${ing}</span></div>`;
  document.getElementById('td_fut_neg').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will not be</span> <span class="v-box">${ing}</span></div>`;

  // Present Continuous: am/is/are + ing, разделение по лицам
  document.getElementById('td_pres_q').innerHTML = `
    <div class="verb-block"><span class="v-i">Am</span><div class="pronouns">I</div><span class="v-box">${ing}</span>?</div>
    <div class="verb-block"><span class="v-i">Are</span><div class="pronouns">You<br>We<br>They</div><span class="v-box">${ing}</span>?</div>
    <div class="verb-block"><span class="v-i">Is</span><div class="pronouns">He<br>She<br>It</div><span class="v-box">${ing}</span>?</div>
  `;
  document.getElementById('td_pres_pos').innerHTML = `
    <div class="verb-block"><div class="pronouns">I</div><span class="v-i">am</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">are</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">is</span> <span class="v-box">${ing}</span></div>
  `;
  document.getElementById('td_pres_neg').innerHTML = `
    <div class="verb-block"><div class="pronouns">I</div><span class="v-i">am not</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">are not</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">is not</span> <span class="v-box">${ing}</span></div>
  `;

  // Past Continuous: was/were + ing, разделение по лицам
  document.getElementById('td_past_q').innerHTML = `
    <div class="verb-block"><span class="v-i">Was</span><div class="pronouns">I<br>He<br>She<br>It</div><span class="v-box">${ing}</span>?</div>
    <div class="verb-block"><span class="v-i">Were</span><div class="pronouns">You<br>We<br>They</div><span class="v-box">${ing}</span>?</div>
  `;
  document.getElementById('td_past_pos').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>He<br>She<br>It</div><span class="v-i">was</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">were</span> <span class="v-box">${ing}</span></div>
  `;
  document.getElementById('td_past_neg').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>He<br>She<br>It</div><span class="v-i">was not</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">You<br>We<br>They</div><span class="v-i">were not</span> <span class="v-box">${ing}</span></div>
  `;
}

/* ============================💮💮💮============================ */
// --- PERFECT ---
// Рендерит ячейки для Present, Past и Future Perfect.
// Использует третью форму глагола (v3) и вспомогательные have/has/had.
function renderPerfect(v) {
  // Проверка: v3 - строка и не пустая.
  // Если поле отсутствует, имеет неверный тип или пустое,
  // то вызов рендерера невозможен – показываем заглушку.
  if (typeof v.v3 !== 'string' || v.v3.trim() === '') {
    renderDashPlaceholder();
    return;
  }
  const v3 = v.v3;

  // Future Perfect: will have + v3 (единый блок)
  document.getElementById('td_fut_q').innerHTML =
    `<div class="verb-block"><span class="v-i">Will</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">have</span> <span class="v-box">${v3}</span>?</div>`;
  document.getElementById('td_fut_pos').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will have</span> <span class="v-box">${v3}</span></div>`;
  document.getElementById('td_fut_neg').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will not have</span> <span class="v-box">${v3}</span></div>`;

  // Present Perfect: have/has + v3, разделение по лицам
  document.getElementById('td_pres_q').innerHTML = `
    <div class="verb-block"><span class="v-i">Have</span><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-box">${v3}</span>?</div>
    <div class="verb-block"><span class="v-i">Has</span><div class="pronouns">He<br>She<br>It</div><span class="v-box">${v3}</span>?</div>
  `;
  document.getElementById('td_pres_pos').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-i">have</span> <span class="v-box">${v3}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">has</span> <span class="v-box">${v3}</span></div>
  `;
  document.getElementById('td_pres_neg').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-i">have not</span> <span class="v-box">${v3}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">has not</span> <span class="v-box">${v3}</span></div>
  `;

  // Past Perfect: had + v3 (единый блок)
  document.getElementById('td_past_q').innerHTML =
    `<div class="verb-block"><span class="v-i">Had</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-box">${v3}</span>?</div>`;
  document.getElementById('td_past_pos').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">had</span> <span class="v-box">${v3}</span></div>`;
  document.getElementById('td_past_neg').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">had not</span> <span class="v-box">${v3}</span></div>`;
}

/* ============================💮💮💮============================ */
// --- PERFECT CONTINUOUS ---
// Рендерит ячейки для Present, Past и Future Perfect Continuous.
// Использует форму v_ing и вспомогательные глаголы have/has/had + been.
function renderPerfectContinuous(v) {
  // Проверка: v_ing - строка и не пустая.
  // Если поле отсутствует, имеет неверный тип или пустое,
  // то вызов рендерера невозможен – показываем заглушку.
  if (typeof v.v_ing !== 'string' || v.v_ing.trim() === '') {
    renderDashPlaceholder();
    return;
  }
  const ing = v.v_ing;

  // Future Perfect Continuous: will have been + ing
  document.getElementById('td_fut_q').innerHTML =
    `<div class="verb-block"><span class="v-i">Will</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">have been</span> <span class="v-box">${ing}</span>?</div>`;
  document.getElementById('td_fut_pos').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will have been</span> <span class="v-box">${ing}</span></div>`;
  document.getElementById('td_fut_neg').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">will not have been</span> <span class="v-box">${ing}</span></div>`;

  // Present Perfect Continuous: have/has been + ing
  document.getElementById('td_pres_q').innerHTML = `
    <div class="verb-block"><span class="v-i">Have</span><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-i">been</span> <span class="v-box">${ing}</span>?</div>
    <div class="verb-block"><span class="v-i">Has</span><div class="pronouns">He<br>She<br>It</div><span class="v-i">been</span> <span class="v-box">${ing}</span>?</div>
  `;
  document.getElementById('td_pres_pos').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-i">have been</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">has been</span> <span class="v-box">${ing}</span></div>
  `;
  document.getElementById('td_pres_neg').innerHTML = `
    <div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They</div><span class="v-i">have not been</span> <span class="v-box">${ing}</span></div>
    <div class="verb-block"><div class="pronouns">He<br>She<br>It</div><span class="v-i">has not been</span> <span class="v-box">${ing}</span></div>
  `;

  // Past Perfect Continuous: had been + ing
  document.getElementById('td_past_q').innerHTML =
    `<div class="verb-block"><span class="v-i">Had</span><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">been</span> <span class="v-box">${ing}</span>?</div>`;
  document.getElementById('td_past_pos').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">had been</span> <span class="v-box">${ing}</span></div>`;
  document.getElementById('td_past_neg').innerHTML =
    `<div class="verb-block"><div class="pronouns">I<br>You<br>We<br>They<br>He<br>She<br>It</div><span class="v-i">had not been</span> <span class="v-box">${ing}</span></div>`;
}

/* ===========================💮💮💮=========================== */
// --- TRANSCRIPTION ---
// Рендерит транскрипцию всех форм глагола на кнопке озвучки.
// Использует t1, t2, t3, t1s, t_ing.
function renderTranscription(v) {
  // Проверка: t1, t2, t3, t1s, t_ing - строки и не пустые.
  // Если хотя бы одно поле отсутствует, имеет неверный тип или пустое,
  // то показываем эмодзи и блокируем кнопку, 
  // иначе выводим полный набор транскрипций и кнопка рабочая.
  if (
    typeof v.t1 !== 'string' || v.t1.trim() === '' ||
    typeof v.t2 !== 'string' || v.t2.trim() === '' ||
    typeof v.t3 !== 'string' || v.t3.trim() === '' ||
    typeof v.t1s !== 'string' || v.t1s.trim() === '' ||
    typeof v.t_ing !== 'string' || v.t_ing.trim() === ''
  ) {
    document.getElementById('speakBtn').innerHTML = `<span style="font-size:2rem">🙊</span>`;
    document.getElementById('speakBtn').disabled = true;  // ← блокируем кнопку
    return;
  }
  const t1 = v.t1, t1s = v.t1s, t2 = v.t2, t3 = v.t3, t_ing = v.t_ing;
  
  // Все данные корректны – выводим транскрипции с разделителями.
  document.getElementById('speakBtn').innerHTML = `${t1} · ${t2} · ${t3}<br>${t1s} · ${t_ing}`;
  document.getElementById('speakBtn').disabled = false;  // ← активируем кнопку
}


/* ===========================💮💮💮=========================== */
