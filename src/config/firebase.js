import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyCYXcMq85Ss5AC19hVduzlvJ2uMt4Vz5s0",
  authDomain: "user-management-system-e7aa5.firebaseapp.com",
  projectId: "user-management-system-e7aa5",
  storageBucket: "user-management-system-e7aa5.appspot.com",
  messagingSenderId: "404860573284",
  appId: "1:404860573284:web:4fae51383e80a4c916f171",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage();
