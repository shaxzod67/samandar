
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/storage'; 
import 'firebase/firestore';
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyDiWj4aePe0TTCCfW8C8rLlu6SxZkHhY0I",
  authDomain: "vazifa-af8d6.firebaseapp.com",
  projectId: "vazifa-af8d6",
  storageBucket: "vazifa-af8d6.appspot.com",
  messagingSenderId: "261426523573",
  appId: "1:261426523573:web:0a3a6621c17a956dd93dfc",
  measurementId: "G-7QH3SZJXZG"
};


firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
export const storage = getStorage(app);
export default firebase;  