import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDa_B9Pv_9cu_mPswpSMmQdXB6yk-QF-EQ",
  authDomain: "memory-game-6c151.firebaseapp.com",
  projectId: "memory-game-6c151",
  storageBucket: "memory-game-6c151.firebasestorage.app",
  messagingSenderId: "275643768468",
  appId: "1:275643768468:web:f0345b57c0bb18f2cb1e81",
  measurementId: "G-H0BGTPMBL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, db };
