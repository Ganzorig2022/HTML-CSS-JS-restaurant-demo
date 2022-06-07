import {
  signUp,
  signIn,
  logOut,
  updateUserDataInFireStore,
} from "./firebase_auth.js";

// DOM Refresh hiigdehed ehleed ajillana.
document.addEventListener("DOMContentLoaded", showUserName);

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
const userProfileModal =
  document.getElementsByClassName("user-profile-modal")[0];
const userProfileModalHeader = document.getElementById(
  "user-profile-modal--header"
);
let loginInputs = document.querySelectorAll(".login-modal-form input");
const loggedUserId = document.getElementById("logged-user-id");

let isSuccessful = false;

// ===========================SIGN UP NEW USER=======================
signupBtn.addEventListener("click", () => {
  const signupName = document.getElementById("signup-name").value;
  const signupEmail = document.getElementById("signup-email").value;
  const signupPassword = document.getElementById("signup-password").value;
  isSuccessful = signUp(signupEmail, signupPassword, signupName);

  if (isSuccessful) {
    swal("Шинэ хэрэглэгч үүслээ!");

    signupModal.classList.remove("show-modal");

    disableLoginInputs();
    clearSignupInputs();
    disableSignUpBtn();

    showUserName();
  } else {
    swal("Та нэвтрээгүй байна");

    enableLoginInputs();
    enableSignUpBtn();
  }
});

// ===========================SIGN IN EXISTING USER=======================
signinBtn.addEventListener("click", async () => {
  const signinEmail = document.getElementById("login-email").value;
  const signinPassword = document.getElementById("login-password").value;

  isSuccessful = await signIn(signinEmail, signinPassword);

  if (isSuccessful) {
    swal("Та амжилттай нэвтэрлээ!");

    loginModal.classList.remove("show-modal");
    clearLoginInputs();
    disableLoginInputs();
    disableLoginBtn();
    disableSignUpBtn();

    showUserName();
  }
});

// =========================LOG OUT USER=================
logoutBtn.addEventListener("click", async () => {
  isSuccessful = await logOut();
  if (isSuccessful) {
    swal("Та системээс гарлаа.");
    localStorage.removeItem("loggedUserUid");
    userProfileModal.classList.remove("hidden");
    userProfileModalHeader.innerHTML = `Хэрэглэгч:`;
    loggedUserId.textContent = "";

    enableLoginInputs();
    enableLoginBtn();
    enableSignUpBtn();
    clearLoginInputs();
    clearUserInputs();
  } else {
    disableLoginInputs();
  }
});

// SIGN IN hiisnii daraa input-uudiig IDEWHGV bolgoh
function disableLoginInputs() {
  loginInputs.forEach((input) => {
    input.setAttribute("disabled", "");
  });
}

// SIGN OUT hiisnii daraa input-uudiig IDEWHTEI bolgoh
function enableLoginInputs() {
  loginInputs.forEach((input) => {
    input.removeAttribute("disabled");
  });
}

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
// SIGN OUT hiisnii daraa LOGIN button-iig IDEWHTEI bolgoh
function clearUserInputs() {
  const userFirstName = document.getElementById("user-first-name");
  const userLastName = document.getElementById("user-last-name");
  const userLoginPassword = document.getElementById(
    "user-login-password"
  ).value;
  const userLoginEmail = document.getElementById("user-login-email");

  userFirstName.value = "";
  userLastName.value = "";
  userLoginPassword.value = "";
  userLoginEmail.value = "";
}

// SIGN IN hiisnii daraa LOGIN button-iig IDEWHGVI bolgoh
function disableLoginBtn() {
  loginOpen.disabled = true;
  loginOpen.style.backgroundColor = "#555";
  loginOpen.style.cursor = "no-drop";
}

// SIGN OUT hiisnii daraa LOGIN button-iig IDEWHTEI bolgoh
function enableLoginBtn() {
  loginOpen.disabled = false;
  loginOpen.style.backgroundColor = "var(--secondary-color)";
  loginOpen.style.cursor = "pointer";
}

// SIGN UP hiisnii daraa LOGIN button-iig IDEWHGVI bolgoh
function disableSignUpBtn() {
  signupOpen.disabled = true;
  signupOpen.style.backgroundColor = "#555";
  signupOpen.style.cursor = "no-drop";
}

// SIGN UP hiisnii daraa LOGIN button-iig IDEWHTEI bolgoh
function enableSignUpBtn() {
  signupOpen.disabled = false;
  signupOpen.style.backgroundColor = "var(--secondary-color)";
  signupOpen.style.cursor = "pointer";
}

// =========================USER NAME-iig Haruulah=================
function showUserName() {
  let userData = JSON.parse(localStorage.getItem("loggedUserUid"));

  let userName = userData.name;

  userProfileModalHeader.innerHTML = `Хэрэглэгч: ${userName}`;
  loggedUserId.textContent = userName;
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
    userFirstName == "" &&
    userLastName == "" &&
    userLoginPassword == "" &&
    userLoginEmail == ""
  ) {
    swal("Та мэдээллээ бөглөөд хадгална уу.");
  } else {
    isSuccessful = await updateUserDataInFireStore(
      userFirstName,
      userLastName,
      userLoginPassword,
      userLoginEmail
    );
    if (isSuccessful) {
      saveUserInfoBtn.innerHTML = "Мэдээлэл хадгалагдлаа";
    } else {
    }
  }
});
