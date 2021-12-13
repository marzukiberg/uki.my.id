export const registerServiceWorker = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((res) => {
        console.log("service worker registered", res);
      })
      .catch((err) => {
        console.log("failed registering service worker", err);
      });
  }
};
