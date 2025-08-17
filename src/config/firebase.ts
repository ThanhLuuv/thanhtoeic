// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMBokj99we1G-tTgEzJa-te1ElO3DCD98",
  authDomain: "thanhtoeic-e1f58.firebaseapp.com",
  projectId: "thanhtoeic-e1f58",
  storageBucket: "thanhtoeic-e1f58.firebasestorage.app",
  messagingSenderId: "225528375762",
  appId: "1:225528375762:web:a78cb610a102a489af000b",
  measurementId: "G-NN3GBZ93V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
