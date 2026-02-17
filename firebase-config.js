// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6_AtJME0kTZAwNVRh_2c0X_OGFkAD3Yo",
  authDomain: "learnit-11.firebaseapp.com",
  projectId: "learnit-11",
  storageBucket: "learnit-11.firebasestorage.app",
  messagingSenderId: "487572253554",
  appId: "1:487572253554:web:016626613daef464dd4beb",
  measurementId: "G-5ZTPEKDDH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc, serverTimestamp };