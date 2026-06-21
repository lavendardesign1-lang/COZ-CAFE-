// Firebase Configuration for COZ CAFE
const firebaseConfig = {
    apiKey: "AIzaSyB8B_N-8p2tws4lhvax2LJog95CAHAMG4c",
    authDomain: "coz-cafe.firebaseapp.com",
    databaseURL: "https://coz-cafe-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "coz-cafe",
    storageBucket: "coz-cafe.firebasestorage.app",
    messagingSenderId: "534730865978",
    appId: "1:534730865978:web:eb410f8455e190a6246403"
};

// Initialize Firebase (guard against re-initialization)
if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
