// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNHB-FA4OqNtwEJDY1mKJPY5-q6STNZGQ",
  authDomain: "gitrizz.firebaseapp.com",
  projectId: "gitrizz",
  storageBucket: "gitrizz.firebasestorage.app",
  messagingSenderId: "256077011064",
  appId: "1:256077011064:web:db21ec59bd1b36f2f7358d",
  measurementId: "G-2KH9Y72BB8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export { app, auth };
