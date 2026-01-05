// ==========================
// Calorie Counter App
// ==========================

// ----- DOM ELEMENTS -----
const foodForm = document.getElementById("food-form");
const foodNameInput = document.getElementById("food-name");
const foodCaloriesInput = document.getElementById("food-calories");
const foodMealSelect = document.getElementById("food-meal");

const foodList = document.getElementById("food-list");
const totalCaloriesEl = document.getElementById("total-calories");

const dailyGoalInput = document.getElementById("daily-goal");
const setGoalBtn = document.getElementById("set-goal");
const goalStatusEl = document.getElementById("goal-status");
const progressEl = document.getElementById("progress");

const resetDayBtn = document.getElementById("reset-day");

// ----- STATE -----
let foods = JSON.parse(localStorage.getItem("foods")) || [];
let dailyGoal = Number(localStorage.getItem("dailyGoal")) || 0;

// ----- INIT -----
document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  renderFoodList();
  updateTotalCalories();
  updateGoalUI();
}

// ----- EVENTS -----
foodForm.addEventListener("submit", addFood);
setGoalBtn.addEventListener("click", setDailyGoal);
resetDayBtn.addEventListener("click", resetDay);

// ----- FUNCTIONS -----

function addFood(e) {
  e.preventDefault();

  const name = foodNameInput.value.trim();
  const calories = Number(foodCaloriesInput.value);
  const meal = foodMealSelect.value;

  if (!name || calories <= 0) {
    alert("Please enter valid food data.");
    return;
  }

  const food = {
    id: Date.now(),
    name,
    calories,
    meal
  };

  foods.push(food);
  saveFoods();
  renderFoodList();
  updateTotalCalories();

  foodForm.reset();
}

function deleteFood(id) {
  foods = foods.filter(food => food.id !== id);
  saveFoods();
  renderFoodList();
  updateTotalCalories();
}

function renderFoodList() {
  foodList.innerHTML = "";

  if (foods.length === 0) {
    foodList.innerHTML = "<li>No foods added yet.</li>";
    return;
  }

  foods.forEach(food => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>
        <strong>${food.name}</strong> 
        (${food.meal}) - ${food.calories} kcal
      </span>
      <button class="btn-danger btn-sm">Delete</button>
    `;

    li.querySelector("button").addEventListener("click", () => {
      deleteFood(food.id);
    });

    foodList.appendChild(li);
  });
}

function updateTotalCalories() {
  const total = foods.reduce((sum, food) => sum + food.calories, 0);
  totalCaloriesEl.textContent = `${total} kcal`;
  updateProgress(total);
}

function setDailyGoal() {
  const goal = Number(dailyGoalInput.value);

  if (goal <= 0) {
    alert("Please enter a valid daily goal.");
    return;
  }

  dailyGoal = goal;
  localStorage.setItem("dailyGoal", dailyGoal);
  updateGoalUI();
}

function updateGoalUI() {
  const total = foods.reduce((sum, food) => sum + food.calories, 0);

  if (dailyGoal > 0) {
    goalStatusEl.textContent = `${total} / ${dailyGoal} kcal`;
    dailyGoalInput.value = dailyGoal;
  } else {
    goalStatusEl.textContent = "No daily goal set";
  }

  updateProgress(total);
}

function updateProgress(totalCalories) {
  if (dailyGoal <= 0) {
    progressEl.style.width = "0%";
    return;
  }

  const percentage = Math.min((totalCalories / dailyGoal) * 100, 100);
  progressEl.style.width = `${percentage}%`;
}

function resetDay() {
  if (!confirm("Are you sure you want to reset the day?")) return;

  foods = [];
  saveFoods();
  renderFoodList();
  updateTotalCalories();
}

// ----- LOCAL STORAGE -----
function saveFoods() {
  localStorage.setItem("foods", JSON.stringify(foods));
}
