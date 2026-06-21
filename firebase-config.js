(function initCozFirebase() {
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

  const statusAliases = {
    accepted: "approved",
    confirmed: "preparing",
    completed: "ready"
  };

  const statusFlow = ["pending", "approved", "preparing", "ready"];

  window.COZ_FIREBASE_CONFIG = firebaseConfig;
  window.COZ_ZIINA_CONFIG = {
    checkoutBaseUrl: "https://pay.ziina.com/ar/sharjha11/"
  };

  window.normalizeOrderStatus = function normalizeOrderStatus(status) {
    const normalized = statusAliases[status] || status || "pending";
    return statusFlow.includes(normalized) ? normalized : "pending";
  };

  if (window.firebase && window.firebase.apps && !window.firebase.apps.length) {
    window.firebase.initializeApp(firebaseConfig);
  }

  window.getCozDatabase = function getCozDatabase() {
    if (!window.firebase || !window.firebase.database) {
      return null;
    }
    if (!window.firebase.apps || !window.firebase.apps.length) {
      window.firebase.initializeApp(firebaseConfig);
    }
    return window.firebase.database();
  };
})();
