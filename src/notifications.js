function registerServiceWorker() {
  return navigator.serviceWorker
    .register("/service-worker.js")
    .then(function (registration) {
      return registration;
    });
}

export function registerNotifications() {
  return new Promise(function (resolve) {
    // Service Worker isn't supported.
    if (
      !("serviceWorker" in navigator) ||
      Notification.permission === "denied"
    ) {
      resolve({ showNotification: () => {} });
    }

    if (Notification.permission === "granted") {
      registerServiceWorker().then(resolve);
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          registerServiceWorker().then(resolve);
        } else {
          resolve({ showNotification: () => {} });
        }
      });
    }
  });
}

export const key = {};
