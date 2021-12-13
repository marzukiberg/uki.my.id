window.onload = () => {
  if ("serviceWorker" in navigator) {
    console.log("service worker supported.");

    navigator.serviceWorker
      .register("./firebase-messaging-sw.js")
      .then((res) => {
        console.log("service worker registered", res);
      })
      .catch((err) => {
        console.log("failed registering service worker", err);
      });
  }
};
