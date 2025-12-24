// js/habits.js

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  serverTimestamp,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= HELPERS ================= */

export function getToday() {
  return new Date().toLocaleDateString("en-CA");
}

export function getYesterday() {
  return new Date(Date.now() - 86400000).toLocaleDateString("en-CA");
}

export function getBadge(streak) {
  if (streak >= 100) return "👑 Legend";
  if (streak >= 30) return "🥇 Gold";
  if (streak >= 7) return "🥈 Silver";
  if (streak >= 3) return "🥉 Bronze";
  return "None";
}

/* ================= ADD HABIT ================= */

export async function addHabit(uid, name) {
  if (!uid || !name) throw new Error("Invalid input");

  const cleanName = name.trim().toLowerCase();
  const habitsRef = collection(db, "users", uid, "habits");

  // Prevent duplicates
  await runTransaction(db, async transaction => {
    const q = query(habitsRef, orderBy("createdAt"));
    const snap = await transaction.get(q);

    const exists = snap.docs.some(
      d => d.data().name.toLowerCase() === cleanName
    );

    if (exists) {
      throw new Error("Habit already exists");
    }

    const newRef = doc(habitsRef);
    transaction.set(newRef, {
      name,
      streak: 0,
      badge: "None",
      lastCompleted: null,
      createdAt: serverTimestamp()
    });
  });
}

/* ================= LISTEN HABITS ================= */

export function listenToHabits(uid, callback, onError) {
  if (!uid) throw new Error("UID required");
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  const q = query(
    collection(db, "users", uid, "habits"),
    orderBy("createdAt")
  );

  return onSnapshot(
    q,
    snapshot => {
      const habits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(habits);
    },
    error => {
      console.error("Habit listener error:", error);
      if (onError) onError(error);
    }
  );
}

/* ================= MARK DONE (TRANSACTION SAFE) ================= */

export async function markHabitDone(uid, habitId) {
  if (!uid || !habitId) throw new Error("Invalid input");

  const ref = doc(db, "users", uid, "habits", habitId);

  return await runTransaction(db, async transaction => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    const today = getToday();
    const yesterday = getYesterday();

    if (data.lastCompleted === today) {
      throw new Error("Already completed today");
    }

    const streak =
      data.lastCompleted === yesterday ? data.streak + 1 : 1;

    const badge = getBadge(streak);

    transaction.update(ref, {
      streak,
      badge,
      lastCompleted: today
    });

    return badge !== data.badge ? badge : null;
  });
}
