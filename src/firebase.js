import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore"; // Perbarui ini


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaszUQO5P-LLKfO7lgrC9_7R7VCCjCm5w",
  authDomain: "portfolio-f0922.firebaseapp.com",
  projectId: "portfolio-f0922",
  storageBucket: "portfolio-f0922.firebasestorage.app",
  messagingSenderId: "221471086108",
  appId: "1:221471086108:web:59422709fec0d1212b71d9",
  measurementId: "G-04KCX7Q8V1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };