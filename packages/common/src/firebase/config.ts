// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtMdXliGPJQRahUHTJBsx4OE1A5mn2GBo",
  authDomain: "szalty-7057d.firebaseapp.com",
  projectId: "szalty-7057d",
  storageBucket: "szalty-7057d.firebasestorage.app",
  messagingSenderId: "65438588262",
  appId: "1:65438588262:web:ad1162e514b7881ef47ca7",
  measurementId: "G-V5NYD8QDTV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
