import {
  signUp,
  signIn,
  logOut,
  updateUserDataInFireStore,
  updateUserOrderDataToLocalstorage,
} from "./firebase_auth.js";

// DOM Refresh hiigdehed ehleed ajillana.
document.addEventListener("DOMContentLoaded", () => {
  showUserInfo();
  showUserName();
});

// ==================Scroll To Top Effect===============
const scrollToTopBtn = document.getElementById("scrollToTop-button");
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
}

scrollToTopBtn.addEventListener("click", () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

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

// ========================Profile Menu Show Hide==================

const content1 = document.getElementsByClassName("content1")[0];
const content2 = document.getElementsByClassName("content2")[0];
const listItems = document.querySelectorAll(".left-content li");

listItems.forEach((item, idx) => {
  item.addEventListener("click", () => {
    hideAllListItems();
    item.classList.add("active");
    if (idx === 1) {
      //hereglegchiin zahialga tsonh
      content2.classList.add("show");
      localStorageShowOrderItems();
    } else {
      content2.classList.remove("show");
    }
    if (idx === 0) {
      //huwiin medeelel tsonh
      content1.classList.add("show");
    } else {
      content1.classList.remove("show");
    }
  });
});

function hideAllListItems() {
  listItems.forEach((content) => content.classList.remove("active"));
}

// ========================Cart Modal Window Open=====================
const cartIconBtn = document.getElementsByClassName("fa-shopping-cart")[0];

cartIconBtn.addEventListener("click", () => {
  const cartModal = document.getElementsByClassName("cart-modal")[0];
  cartModal.classList.toggle("hidden");
});

// ========================LOGIN MODAL window Open=====================
const loginOpen = document.getElementById("login-open");
const loginModal = document.getElementById("login-modal");
const loginClose = document.getElementById("modal-close-btn");

loginOpen.addEventListener("click", () => {
  loginModal.classList.add("show-modal");
  clearLoginInputs();
});

loginClose.addEventListener("click", () => {
  loginModal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  e.target == loginModal ? loginModal.classList.remove("show-modal") : false;
});

// ========================SIGNUP MODAL window Open=====================
let signupOpen = document.getElementById("signup-open");
let signupModal = document.getElementById("signup-modal");
const signupClose = document.getElementById("signup-close-btn");

signupOpen.addEventListener("click", () => {
  signupModal.classList.add("show-modal");
  clearSignupInputs();
});
signupClose.addEventListener("click", () => {
  signupModal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  e.target == signupModal ? signupModal.classList.remove("show-modal") : false;
});

//////////////////////////////////FIRESTORE///////////////////////////
// =============================GLOBAL VARIABLES=======================
const signupBtn = document.getElementById("signup-submit-btn");
const signinBtn = document.getElementById("login-submit-btn");
const logoutBtn = document.getElementById("user-logout-btn");
const userProfileBtn = document.getElementsByClassName("profile")[0];
const loggedUserId = document.getElementById("logged-user-id");
const userProfile = document.getElementsByClassName("user-profile-modal")[0];


const userIcon = document.getElementsByClassName("fa-user")[0];

let isSuccessful = false;
userProfileBtn.addEventListener("click", () => {
  userProfile.classList.toggle("hidden");
});
// ===========================SIGN UP NEW USER=======================
signupBtn.addEventListener("click", async () => {
  const signupName = document.getElementById("signup-name").value;
  const signupEmail = document.getElementById("signup-email").value;
  const signupPassword = document.getElementById("signup-password").value;
  const signupPassword2 = document.getElementById("signup-password2").value;

  if (
    checkRequiredInputs([
      signupName,
      signupEmail,
      signupPassword,
      signupPassword2,
    ])
  ) {
    isSuccessful = await signUp(signupEmail, signupPassword, signupName);

    if (isSuccessful) {
      swal("Шинэ хэрэглэгч амжилттай үүслээ!");

      signupModal.classList.remove("show-modal");

      disableLoginInputs();
      clearSignupInputs();
      disableSignUpBtn();
      disableLoginBtn();
    } else {
      swal("Шинэ хэрэглэгч үүсэхэд алдаа гарлаа!");

      enableLoginInputs();
      enableSignUpBtn();
    }
  } else {
    swal("Таны бөглөх талбарууд хоосон байна!");
  }
});

// INPUT-uud hooson esehiig shalgadag function()
function checkRequiredInputs(inputArr) {
  return !inputArr.includes("");
}

// ===========================SIGN IN EXISTING USER=======================
signinBtn.addEventListener("click", async () => {
  const signinEmail = document.getElementById("login-email").value;
  const signinPassword = document.getElementById("login-password").value;

  if (checkRequiredInputs([signinEmail, signinPassword])) {
    isSuccessful = await signIn(signinEmail, signinPassword);

    if (isSuccessful) {
      swal(`Хэрэглэгч "${showUserName()}" та амжилттай нэвтэрлээ!`);

      loginModal.classList.remove("show-modal");
      clearLoginInputs();
      disableLoginBtn();
      disableSignUpBtn();
      activeUserProfile();

      showUserName();
      content1.classList.add("show");
      updateUserOrderDataToLocalstorage();

      showUserInfo();
    } else {
      swal("Нэвтрэлт амжилтгүй. Хэрэглэгч олдсонгүй!");
      clearLoginInputs();
    }
  } else {
    swal("Таны бөглөх талбарууд хоосон байна!");
  }
});

// =========================LOG OUT USER=================
logoutBtn.addEventListener("click", async () => {
  isSuccessful = await logOut();
  if (isSuccessful) {
    swal("Та системээс гарлаа. Дахин нэвтэрч орно уу.");
    localStorage.clear("loggedUserUid");
    content1.classList.add("show");
    loggedUserId.textContent = "байхгүй!";

    enableLoginBtn();
    enableSignUpBtn();
    clearLoginInputs();
    inActiveUserProfile();
    clearUserInputs();
    // localStorage.clear();
    localStorageShowOrderItems();
  } else {
    disableLoginBtn();
  }
});

//======================= SIGN IN hiisnii daraa hereglegchiin medeelliig HARUULAH
function showUserInfo() {
  if (localStorage.length > 0) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    let FirstName = userData.firstname;
    let LastName = userData.lastname;
    let Password = userData.password;
    let Email = userData.email;

    userFirstName.value = FirstName;
    userLastName.value = LastName;
    userLoginPassword.value = Password;
    userLoginEmail.value = Email;
  } else {
    console.log("Local storage is empty");
  }
}

// =========================USER NAME-iig Haruulah=================
function showUserName() {
  if (localStorage.length > 0) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    let userName = userData.name;
    // console.log("Username: ", userName);

    loggedUserId.textContent = userName;
    return userName;
  } else {
    console.log("Local storage is empty");
  }
}

// =============Update User Info to Firestore=============
const saveUserInfoBtn = document.getElementById("save-user-info-btn");

saveUserInfoBtn.addEventListener("click", async () => {
  const userFirstName = document.getElementById("user-first-name").value;
  const userLastName = document.getElementById("user-last-name").value;
  const userLoginPassword = document.getElementById(
    "user-login-password"
  ).value;
  const userLoginEmail = document.getElementById("user-login-email").value;

  if (
    checkRequiredInputs([
      userFirstName,
      userLastName,
      userLoginPassword,
      userLoginEmail,
    ])
  ) {
    isSuccessful = await updateUserDataInFireStore(
      userFirstName,
      userLastName,
      userLoginPassword,
      userLoginEmail
    );
    if (isSuccessful) {
      swal("Мэдээлэл хадгалагдлаа");
    } else {
      swal("Амжилтгүй!");
    }
  } else {
    swal("Таны бөглөх талбарууд хоосон байна!");
  }
});

// SIGN IN hiisnii daraa input-uudiig CLEAR hiih
function clearLoginInputs() {
  const signinEmail = document.getElementById("login-email");
  const signinPassword = document.getElementById("login-password");

  signinEmail.value = "";
  signinPassword.value = "";
}

// SIGN OUT hiisnii daraa input-uudiig CLEAR hiih
function clearSignupInputs() {
  const signupName = document.getElementById("signup-name");
  const signupEmail = document.getElementById("signup-email");
  const signupPassword = document.getElementById("signup-password");

  signupName.value = "";
  signupEmail.value = "";
  signupPassword.value = "";
}
// SIGN OUT hiisnii daraa hereglegchiin medeelliig CLEAR hiih
const userFirstName = document.getElementById("user-first-name");
const userLastName = document.getElementById("user-last-name");
const userLoginPassword = document.getElementById("user-login-password");
const userLoginEmail = document.getElementById("user-login-email");

function clearUserInputs() {
  userFirstName.value = "";
  userLastName.value = "";
  userLoginPassword.value = "";
  userLoginEmail.value = "";
}

// SIGN IN hiisnii daraa LOGIN button-iig IDEWHGVI bolgoh
function disableLoginBtn() {
  loginOpen.style.display = "none";
}

// SIGN OUT hiisnii daraa LOGIN button-iig IDEWHTEI bolgoh
function enableLoginBtn() {
  loginOpen.style.display = "block";
}

// SIGN UP hiisnii daraa LOGIN button-iig IDEWHGVI bolgoh
function disableSignUpBtn() {
  signupOpen.style.display = "none";
}

// SIGN UP hiisnii daraa LOGIN button-iig IDEWHTEI bolgoh
function enableSignUpBtn() {
  signupOpen.style.display = "block";
}

function activeUserProfile() {
  userIcon.style.color = "#fff";
  userProfileBtn.style.background = "#fb1c25";
}
function inActiveUserProfile() {
  userIcon.style.color = "#000";
  userProfileBtn.style.background = "#ccc";
}

//LOCALSTORAGE-ees data awaw

let personOrderDate = document.getElementsByClassName("right-content-date")[0];
let personOrderPersonValue = document.getElementsByClassName(
  "right-content-people"
)[0];
let personOrderTimeValue =
  document.getElementsByClassName("right-content-time")[0];
let personOrderSeatValue =
  document.getElementsByClassName("right-content-seat")[0];
let orderStatus = document.getElementsByClassName("order-status")[0];

// localStorageShowOrderItems();
function localStorageShowOrderItems() {
  let selectedUserOrder = JSON.parse(localStorage.getItem("selectedUserOrder"));
  if (localStorage.selectedUserOrder) {
    selectedUserOrder.forEach((item) => {
      personOrderDate.lastElementChild.textContent = item.date;
      personOrderPersonValue.lastElementChild.textContent = item.people;
      personOrderTimeValue.lastElementChild.textContent = item.time;
      personOrderSeatValue.lastElementChild.textContent = item.table;
      orderStatus.textContent = "Баталгаажсан";
    });
  } else {
    personOrderDate.lastElementChild.textContent = "";
    personOrderPersonValue.lastElementChild.textContent = "";
    personOrderTimeValue.lastElementChild.textContent = "";
    personOrderSeatValue.lastElementChild.textContent = "";
    orderStatus.textContent = "";
  }
}
//==============Ширээ захиалга руу буцах хэсэг
let backUserInfoBtn = document.getElementById("back-user-info-btn");
backUserInfoBtn.addEventListener("click", () => {
  const restaurantID = localStorage.getItem("selectedRestaurantID");
  if (restaurantID) {
    window.location.assign("table.html");
  } else {
    window.location.assign("home.html");
  }
});

export { localStorageShowOrderItems };
