import { auth } from "./firebase.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

export async function login() {
  try {
    const res = await signInWithPopup(auth, provider);
    console.log("LOGIN SUCCESS", res.user);
    return res;
  } catch (err) {
    console.error("AUTH ERROR OBJECT:", err);
    alert(err.code + "\n" + err.message);
    throw err;
  }
}

export function logout() {
  return signOut(auth);
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}
