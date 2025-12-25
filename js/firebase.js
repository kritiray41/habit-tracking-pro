// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBiUIVQ56dsKRKCy4EjH-dbXafgB0B24VQ",
  authDomain: "habit-tracker-pro-d8ed4.firebaseapp.com",
  projectId: "habit-tracker-pro-d8ed4",
  storageBucket: "habit-tracker-pro-d8ed4.firebasestorage.app",
  messagingSenderId: "553812934904",
  appId: "1:553812934904:web:670994364e8907845f7b0d",
  measurementId: "G-MBJSMVRD3G"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
