import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCaszUQO5P-LLKfO7lgrC9_7R7VCCjCm5w",
    authDomain: "portfolio-f0922.firebaseapp.com",
    projectId: "portfolio-f0922",
    storageBucket: "portfolio-f0922.firebasestorage.app",
    messagingSenderId: "221471086108",
    appId: "1:221471086108:web:59422709fec0d1212b71d9",
    measurementId: "G-04KCX7Q8V1"
  };

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };