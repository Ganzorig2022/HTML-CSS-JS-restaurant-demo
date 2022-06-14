// import { signinBtn, logoutBtn, signupBtn } from "./home.js";

// Run getRatings when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  getRatings();
  showUserName();
});

const starsTotal = 5;
// Get ratings
//=======Vnelgeenii toonoos hamaars 5 STAR-uudiig budah
function getRatings() {
  let starPercentageRounded = 0;

  // Get percentage
  const numberRatings = document.querySelectorAll(".number-rating");

  // Set width of stars-inner to percentage
  const starsInners = document.querySelectorAll(".stars-inner");
  starsInners.forEach((starInner, idx) => {
    let numberRatingValue = numberRatings[idx].textContent;
    const starPercentage = (numberRatingValue / starsTotal) * 100;
    starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
    starInner.style.width = starPercentageRounded;
  });
}
// =================Button Effect====================
const buttons = document.querySelectorAll(".ripple");
buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    // mouse-iin bairshliig X, Y toogoor gargaj ogno.
    const x = e.clientX;
    const y = e.clientY;

    // button bairshliig gargaj ogno.
    const buttonTop = e.target.offsetTop;
    const buttonLeft = e.target.offsetLeft;

    const xInside = x - buttonLeft;
    const yInside = y - buttonTop;

    const circle = document.createElement("span");

    // circle.className = "circle"- ni classList.add-tai adilhan.
    circle.classList.add("circle");
    this.appendChild(circle);
    circle.style.top = yInside + "px";
    circle.style.left = xInside + "px";

    setTimeout(() => circle.remove(), 200);
  });
});

// ========================Profile window Open=====================
const userProfileBtn = document.getElementsByClassName("profile")[0];
const userProfile = document.getElementsByClassName("user-profile-modal")[0];
console.log(userProfile);

userProfileBtn.addEventListener("click", () => {
  userProfile.classList.toggle("hidden1");
});

// let meterDiv = document.getElementsByClassName("meterDiv")[0];
// meterDiv.style.width = "50%";
// Meter rating
let meterFoodRating = document.getElementsByClassName("meterFoodRating");
let meterDivCount = 0;
for (let i = 0; i < meterFoodRating.length; i++) {
  let meterFoodRatingValue = meterFoodRating[i].textContent;
  let meterPercentage = (meterFoodRatingValue / starsTotal) * 100;
  // Round to nearest 10
  let meterPercentageRounded = `${Math.round(meterPercentage / 10) * 10}%`;
  meterDivCount++;
  let meterDiv = document.getElementsByClassName(`meterDiv${meterDivCount}`)[0];
  meterDiv.style.width = meterPercentageRounded;
}

//=====================listContainer1===========================
let menuBtn = document.getElementById("btnBorder");
let menuBtn1 = document.getElementById("btnBorder1");
let MenuTxt = document.getElementsByTagName("h5")[0];
let listContainer = document.querySelector(".listContainer");
let listContainer1 = document.querySelector(".listContainer1");

menuBtn.addEventListener("click", () => {
  if (listContainer.style.display == "block") {
  } else {
    menuBtn.classList.toggle("btnActive");
    menuBtn1.classList.toggle("btnActive");

    MenuTxt.textContent = "ШӨЛ";

    listContainer.style.display = "block";
    listContainer1.style.display = "none";
  }
});
menuBtn1.addEventListener("click", () => {
  if (listContainer1.style.display == "block") {
  } else {
    menuBtn.classList.toggle("btnActive");
    menuBtn1.classList.toggle("btnActive");
    MenuTxt.textContent = "Ус, ундаа";
    listContainer.style.display = "none";
    listContainer1.style.display = "block";
  }
});

// ========================Cart Modal Window Open=====================
const cartIconBtn = document.getElementsByClassName("fa-shopping-cart")[0];
cartIconBtn.addEventListener("click", () => {
  const cartModal = document.getElementsByClassName("cart-modal")[0];
  cartModal.classList.toggle("hidden");
});

// ========================Захиалга өгөх товч дээр дарах=====================

const loginOpen = document.getElementById("login-open");
const loginModal = document.getElementsByClassName("login-modal-container")[0];
const loginClose = document.getElementById("modal-close-btn");
let btnTime = document.getElementsByClassName("btnTime")[0];

btnTime.addEventListener("click", () => {
  // let key = selectedPerson.value;
  let personValue = selectedPerson.options[selectedPerson.selectedIndex].text;
  let dateValue = selected_date_element.textContent;
  let timeValue = selectedTime.options[selectedTime.selectedIndex].text;

  let timeData = {
    person: personValue,
    date: dateValue,
    time: timeValue,
  };

  localStorage.setItem("order-time", JSON.stringify(timeData));

  if (localStorage.loggedUserData) {
    window.location.assign("table.html");
  } else {
    loginModal.classList.add("show-modal");
  }
});

// =========================USER NAME-iig Haruulah=================
const loggedUserId = document.getElementById("logged-user-id");

function showUserName() {
  if (localStorage.loggedUserData) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    let userName = userData.name;

    loggedUserId.innerHTML = `${userName}`;
    console.log("User is available");
  } else {
    console.log("User is NOT available");
  }
}
