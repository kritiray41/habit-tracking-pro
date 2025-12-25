import { login, logout, observeAuth } from "./auth.js";
import { addHabit, listenToHabits, markHabitDone } from "./habits.js";

/* DOM */
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const habitSection = document.getElementById("habit-section");
const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");

let unsubscribeHabits = null;
let currentUserId = null;

/* AUTH */
loginBtn.onclick = () => login();
logoutBtn.onclick = () => logout();

observeAuth(user => {
  if (user) {
    currentUserId = user.uid;
    loginBtn.hidden = true;
    logoutBtn.hidden = false;
    habitSection.hidden = false;
    startHabitListener();
  } else {
    currentUserId = null;
    loginBtn.hidden = false;
    logoutBtn.hidden = true;
    habitSection.hidden = true;
    habitList.innerHTML = "";
    if (unsubscribeHabits) unsubscribeHabits();
  }
});

/* HABITS */
addHabitBtn.onclick = async () => {
  const name = habitInput.value;
  if (!name) return;

  try {
    await addHabit(currentUserId, name);
    habitInput.value = "";
  } catch (e) {
    alert(e.message);
  }
};

function startHabitListener() {
  if (unsubscribeHabits) unsubscribeHabits();

  unsubscribeHabits = listenToHabits(currentUserId, habits => {
    habitList.innerHTML = "";

    habits.forEach(habit => {
      const li = document.createElement("li");

      li.innerHTML = `
        <strong>${habit.name}</strong>
        | 🔥 ${habit.streak}
        | ${habit.badge}
        <button>Done</button>
      `;

      li.querySelector("button").onclick = async () => {
        try {
          const badge = await markHabitDone(currentUserId, habit.id);
          if (badge) alert(`New badge earned: ${badge}`);
        } catch (e) {
          alert(e.message);
        }
      };

      habitList.appendChild(li);
    });
  });
}
