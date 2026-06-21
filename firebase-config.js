// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8B_N-8p2tws4lhvax2LJog95CAHAMG4c",
  authDomain: "coz-cafe.firebaseapp.com",
  databaseURL: "https://coz-cafe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "coz-cafe",
  storageBucket: "coz-cafe.firebasestorage.app",
  messagingSenderId: "534730865978",
  appId: "1:534730865978:web:eb410f8455e190a6246403",
  measurementId: "G-P5QCQH62VK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

// Export for use in other files
export { app, db, analytics };
