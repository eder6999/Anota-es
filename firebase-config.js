import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAoQOzrsDW9pO7j9-LHy52xtXNUd8zV18Q",
  authDomain: "agenda-anotacoes.firebaseapp.com",
  projectId: "agenda-anotacoes",
  storageBucket: "agenda-anotacoes.firebasestorage.app",
  messagingSenderId: "66445285107",
  appId: "1:66445285107:web:6112a2c3821c81b685c986"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

console.log("Firebase conectado: agenda-anotacoes");
