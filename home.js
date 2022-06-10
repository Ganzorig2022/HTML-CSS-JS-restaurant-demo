import { signUp, signIn, logOut } from "./firebase_auth.js";

// Run getRatings when DOM loads
document.addEventListener("DOMContentLoaded", getRatings);

const starsTotal = 5;
// Get ratings
function getRatings() {
  // Get percentage
  const numberRating = document.getElementById("number-rating");
  let numberRatingValue = numberRating.textContent;

  const starPercentage = (numberRatingValue / starsTotal) * 100;

  // Round to nearest 10
  const starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;

  // Set width of stars-inner to percentage
  const starsInners = document.querySelectorAll(".stars-inner");
  starsInners.forEach((starInner) => {
    starInner.style.width = starPercentageRounded;
  });

  showUserName();
}
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

// ========================Profile window Open=====================
const userProfileBtn = document.getElementsByClassName("profile")[0];
const userProfile = document.getElementsByClassName("user-profile-modal")[0];

userProfileBtn.addEventListener("click", () => {
  userProfile.classList.toggle("hidden");
});

// ========================Cart Modal Window Open=====================
const cartIconBtn = document.getElementsByClassName("fa-shopping-cart")[0];
const cartModal = document.getElementsByClassName("cart-modal")[0];

cartIconBtn.addEventListener("click", () => {
  cartModal.classList.toggle("hidden");
});

// ========================LOGIN MODAL window Open=====================
const loginOpen = document.getElementById("login-open");
const loginModal = document.getElementsByClassName("login-modal-container")[0];
const loginClose = document.getElementById("modal-close-btn");

loginOpen.addEventListener("click", () => {
  loginModal.classList.add("show-modal");
  clearLoginInputs();
});
loginClose.addEventListener("click", () => {
  loginModal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  if (e.target == loginModal) {
    loginModal.classList.remove("show-modal");
  }
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
const logoutBtn = document.getElementById("logout-btn");
const userProfileModal =
  document.getElementsByClassName("user-profile-modal")[0];
const userProfileModalHeader = document.getElementById(
  "user-profile-modal--header"
);
let loginInputs = document.querySelectorAll(".login-modal-form input");

let isSuccessful = false;

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
      activeUserProfile();
    } else {
      swal("Шинэ хэрэглэгч үүсэхэд алдаа гарлаа!");

      enableLoginInputs();
      enableSignUpBtn();
    }
  } else {
    swal("Таны бөглөх талбарууд хоосон байна!");
  }
});

// ===========================SIGN IN EXISTING USER=======================
signinBtn.addEventListener("click", async () => {
  const signinEmail = document.getElementById("login-email").value;
  const signinPassword = document.getElementById("login-password").value;

  if (checkRequiredInputs([signinEmail, signinPassword])) {
    isSuccessful = await signIn(signinEmail, signinPassword);

    if (isSuccessful) {
      swal("Та амжилттай нэвтэрлээ!");

      loginModal.classList.remove("show-modal");
      clearLoginInputs();
      disableLoginInputs();
      disableLoginBtn();
      disableSignUpBtn();
      activeUserProfile();

      showUserName();
    } else {
      swal("Нэвтрэлт амжилтгүй. Хэрэглэгч олдсонгүй!");
    }
  } else {
    swal("Таны бөглөх талбарууд хоосон байна!");
  }
});

// =========================LOG OUT USER=================
logoutBtn.addEventListener("click", async () => {
  isSuccessful = await logOut();
  if (isSuccessful) {
    swal("Та системээс гарлаа.");
    // localStorage-iig empty bolgono.
    localStorage.removeItem("loggedUserUid");

    userProfileModal.classList.remove("hidden");
    userProfileModalHeader.innerHTML = `Хэрэглэгч:`;

    enableLoginInputs();
    enableLoginBtn();
    enableSignUpBtn();
    clearLoginInputs();
    inActiveUserProfile();
  } else {
    disableLoginInputs();
  }
});

// INPUT-uud hooson esehiig shalgadag function()
function checkRequiredInputs(inputArr) {
  return !inputArr.includes("");
}
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

// =========================USER NAME-iig Haruulah=================
function showUserName() {
  if (localStorage.length > 0) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserUid"));
    let userName = userData.name;

    userProfileModalHeader.innerHTML = `Хэрэглэгч: ${userName}`;
  } else {
    console.log("Local storage is empty");
  }
}

const searchField = document.getElementsByClassName("restaurant-search")[0];
const searchInput = document.getElementsByClassName(
  "restaurant-search__input"
)[0];
const searchResultsContainer =
  document.getElementsByClassName("search-results")[0];
console.log(searchResultsContainer);
const showCaseContent = document.getElementsByClassName("showcase-content")[0];

const restaurants = [
  {
    name: "ling",
    rating: 3,
  },
  {
    name: "momo",
    rating: 5,
  },
];

searchField.addEventListener("submit", (e) => {
  e.preventDefault();

  // if input field is empty, clear the search results
  if (searchInput.value === null) {
    searchResultsContainer.innerHTML = "";
    return;
  }

  // filter restaurant
  const searchResults = restaurants.filter(
    (restaurant) => +searchInput.value <= restaurant.rating
  );

  console.log(searchResults);
  searchResults.forEach((element) => {
    console.log(element);
    let itemHTML = `
    <div class="search-results">
        <p>${element.name}</p>
        <p>${element.rating}</p>
    </div>
    `;
    //showCaseContent.appendChild(itemHTML);
    showCaseContent.innerHTML += itemHTML;

    console.log("HTML", showCaseContent.innerHTML);
  });
});
