// Import the functions you need from the SDKs you need
import { getMessaging } from "@firebase/messaging";
import { initializeApp } from "firebase/app";
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
const firebaseApp = initializeApp(firebaseConfig);
const firebaseMessaging = getMessaging(firebaseApp);
export { firebaseApp, firebaseMessaging };
