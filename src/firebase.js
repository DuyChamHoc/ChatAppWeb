import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"
const firebaseConfig = {
  apiKey: "AIzaSyDyPQl4nGZsq2yzJISxwPftrRHYKgYWmgo",
  authDomain: "chat-app-464ba.firebaseapp.com",
  projectId: "chat-app-464ba",
  storageBucket: "chat-app-464ba.appspot.com",
  messagingSenderId: "784068863200",
  appId: "1:784068863200:web:4bc48c5c1ff21361e31c85",
  measurementId: "G-ZL7MQLWLM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const db = getFirestore(app);
const storage=getStorage(app)
export { app, auth, database, db,storage };




