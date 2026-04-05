// Placeholder Firebase configuration
// Disesuaikan dengan arahan sprint 1 untuk FE-1.4

// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummy...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "temuin-dummy.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "temuin-dummy",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "temuin-dummy.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:12345:web:67890"
};

// Placeholder inisialisasi ketika env sudah ada:
// export const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();
// googleProvider.setCustomParameters({ hd: "itk.ac.id" }); // Hanya google workspace itk.ac.id
