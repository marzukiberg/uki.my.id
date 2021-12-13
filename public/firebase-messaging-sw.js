// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmAk9MJSy15Qpqs5EtsaIAU6pJDN9KfZ4",
  authDomain: "hadits-harian.firebaseapp.com",
  projectId: "hadits-harian",
  storageBucket: "hadits-harian.appspot.com",
  messagingSenderId: "650412390543",
  appId: "1:650412390543:web:bd9d1f46469f6ccd5c58fa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
