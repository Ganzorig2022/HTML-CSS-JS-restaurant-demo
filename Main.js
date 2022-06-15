import {
  signUp,
  signIn,
  logOut,
  updateUserDataInFireStore,
  updateUserOrderDataToLocalstorage,
} from "./firebase_auth.js";
// import { clearSignupInputs, clearLoginInputs } from "./home.js";

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

userProfileBtn.addEventListener("click", () => {
  userProfile.classList.toggle("hidden1");
});

// ========================LOGIN MODAL window Open=====================
const loginOpen = document.getElementById("login-open");
const loginModal = document.getElementById("login-modal");
const loginClose = document.getElementById("modal-close-btn");

loginOpen.addEventListener("click", () => {
  loginModal.classList.add("show-modal");
});

loginClose.addEventListener("click", () => {
  loginModal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  e.target == loginModal ? loginModal.classList.remove("show-modal") : false;
});

// ===========================SIGN IN EXISTING USER=======================
const signinBtn = document.getElementById("login-submit-btn");
let isSuccessful = false;
let signupOpen = document.getElementById("signup-open");

signinBtn.addEventListener("click", async () => {
  const signinEmail = document.getElementById("login-email").value;
  const signinPassword = document.getElementById("login-password").value;

  if (checkRequiredInputs([signinEmail, signinPassword])) {
    isSuccessful = await signIn(signinEmail, signinPassword);

    if (isSuccessful) {
      swal(`Хэрэглэгч та амжилттай нэвтэрлээ!`);

      loginModal.classList.remove("show-modal");
      disableLoginBtn();
      disableSignUpBtn();
      activeUserProfile();

      showUserName();
      // content1.classList.add("show");
      updateUserOrderDataToLocalstorage();
    } else {
      swal("Нэвтрэлт амжилтгүй. Хэрэглэгч олдсонгүй!");
    }
  } else {
    swal("Таны бөглөх талбарууд хоосон байна!");
  }
});
// INPUT-uud hooson esehiig shalgadag function()
function checkRequiredInputs(inputArr) {
  return !inputArr.includes("");
}

// SIGN IN hiisnii daraa LOGIN button-iig NONE bolgoh
function disableLoginBtn() {
  loginOpen.style.display = "none";
}
// SIGN OUT hiisnii daraa LOGIN button-iig IDEWHTEI bolgoh
function enableLoginBtn() {
  loginOpen.style.display = "block";
}
// SIGN UP hiisnii daraa LOGIN button-iig NONE bolgoh
function disableSignUpBtn() {
  signupOpen.style.display = "none";
}

// SIGN UP hiisnii daraa LOGIN button-iig IDEWHTEI bolgoh
function enableSignUpBtn() {
  signupOpen.style.display = "block";
}
function activeUserProfile() {
  const userIcon = document.getElementsByClassName("fa-user")[0];
  userIcon.style.color = "#fff";
  userProfileBtn.style.background = "#fb1c25";
}
function inActiveUserProfile() {
  const userIcon = document.getElementsByClassName("fa-user")[0];
  userIcon.style.color = "#000";
  userProfileBtn.style.background = "#ccc";
}
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
const userProfileModalHeader = document.getElementById(
  "user-profile-modal--header"
);
function showUserName() {
  if (localStorage.loggedUserData) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    let userName = userData.name;

    loggedUserId.innerHTML = `${userName}`;
    userProfileModalHeader.innerHTML = `Хэрэглэгч: ${userName}`;

    disableLoginBtn();
    disableSignUpBtn();
    console.log("User is available");
  } else {
    console.log("User is NOT available");
  }
}
