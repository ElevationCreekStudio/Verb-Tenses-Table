// Проверяем, поддерживает ли браузер Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then((reg) => {
        console.log('Service Worker успешно зарегистрирован! Сфера действия:', reg.scope);
      })
      .catch((error) => {
        console.log('Ошибка при регистрации Service Worker:', error);
      });
  });
}
