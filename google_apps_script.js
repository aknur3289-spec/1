// ============================================================
// GOOGLE APPS SCRIPT — вставьте этот код целиком
// Инструкция: script.google.com → Новый проект → вставить
// ============================================================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Выбираем лист в зависимости от типа формы
    const sheetName = data.form_type === 'participant' ? 'Участники' : 'Ассистенты';
    let sheet = ss.getSheetByName(sheetName);

    // Если листа нет — создаём его с заголовками
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const headers = Object.keys(data);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#f3f3f3');
      sheet.setFrozenRows(1);
    }

    // Добавляем строку с данными
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(h => data[h] !== undefined ? data[h] : '—');
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Для тестирования вручную (не обязательно)
function doGet(e) {
  return ContentService
    .createTextOutput('Скрипт работает! Используйте POST-запросы для отправки данных.')
    .setMimeType(ContentService.MimeType.TEXT);
}
