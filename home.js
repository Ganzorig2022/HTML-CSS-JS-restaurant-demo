import { signUp, signIn, logOut } from "./firebase_auth.js";

// Run getRatings when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  getRatings();
  showRestaurantsContent();
  showUserName();
});

//=======Vnelgeenii toonoos hamaars 5 STAR-uudiig budah
function getRatings() {
  const starsTotal = 5;
  let starPercentageRounded = 0;

  // Get percentage
  const numberRatings = document.querySelectorAll("#number-rating");
  // Set width of stars-inner to percentage
  const starsInners = document.querySelectorAll(".stars-inner");
  starsInners.forEach((starInner, idx) => {
    let numberRatingValue = numberRatings[idx].textContent;
    const starPercentage = (numberRatingValue / starsTotal) * 100;
    starPercentageRounded = `${Math.round(starPercentage / 10) * 10}%`;
    starInner.style.width = starPercentageRounded;
  });
}

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
    localStorage.removeItem("loggedUserData");

    userProfileModal.classList.remove("hidden");
    userProfileModalHeader.innerHTML = `Хэрэглэгч:`;

    enableLoginInputs();
    enableLoginBtn();
    enableSignUpBtn();
    clearLoginInputs();
    inActiveUserProfile();
    localStorage.clear("selectedUserOrder");
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

// =========================Newtersen USER NAME-iig Haruulah=================
function showUserName() {
  if (localStorage.length > 0) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    let userName = userData.name;

    userProfileModalHeader.innerHTML = `Хэрэглэгч: ${userName}`;
  } else {
    console.log("Local storage is empty");
  }
}

//=============restauran-iig vnelgeegeer ni haih==========
const searchField = document.getElementsByClassName("restaurant-search")[0];
const searchInput = document.getElementsByClassName(
  "restaurant-search__input"
)[0];
const searchResultsContainer =
  document.getElementsByClassName("search-results")[0];
const searchResultsUL = document.getElementsByClassName("search-results-UL")[0];

const restaurantsArr = [
  {
    name: "ling",
    rating: 2.7,
  },
  {
    name: "momo",
    rating: 4.5,
  },
  {
    name: "yuna",
    rating: 3.8,
  },
  {
    name: "bull",
    rating: 4.9,
  },
];

function getRestaurantsToDOM(ratingValue) {
  // 1. Restauranii array-g ihees baga ruu ni sort-low.
  const sortedRestaurantsArr = restaurantsArr.sort(
    (a, b) => b.rating - a.rating
  );
  // 2. Sortolson array-gaara filter() hiihed vr dvn ni hamgiin ondor vnelgeeteigeesee dooshoo tsuwj RESULT garna.
  const searchResults = sortedRestaurantsArr.filter(
    (restaurant) => ratingValue <= restaurant.rating
  );
  // 3. Array-gaara dawtaad "3" gesen utga oghod 3-aas deesh vnelgeetei restauranii medeelliig DOM ruu hiine.
  if (searchResults.length > 0) {
    if (!searchResultsUL.innerHTML == "") {
      searchResultsUL.innerHTML = "";
      searchResults.forEach((element) => {
        let itemHTML = `
            <li>
              <p>${element.name}</p>
              <div class="stars-outer">
                <div class="stars-inner"></div>
              </div>
              <span class="number-rating"><span id="number-rating"> ${element.rating}</span></span>
            </li>`;
        searchResultsUL.innerHTML += itemHTML;
        searchResultsContainer.classList.add("show");
        searchInput.value = "";
        getRatings();
      });
    } else {
      searchResults.forEach((element) => {
        let itemHTML = `
            <li>
              <p>${element.name}</p>
              <div class="stars-outer">
                <div class="stars-inner"></div>
              </div>
              <span class="number-rating"><span id="number-rating"> ${element.rating}</span></span>
            </li>`;
        searchResultsUL.innerHTML += itemHTML;
        searchResultsContainer.classList.add("show");
        searchInput.value = "";
        getRatings();
      });
    }
  } else {
    searchResultsUL.innerHTML = "";
    searchResultsContainer.classList.remove("show");
    swal(`${ratingValue} үнэлгээтэй ресторан олдсонгүй!`);
  }
}

//=============== haih towchin dr darahad restauran-uudiig vnelgeegeer ni haruulah==========
searchField.addEventListener("submit", (event) => {
  event.preventDefault();

  let ratingValue = searchInput.value;

  // herwee hooson utgan dr darwal hailt hiigdehgvi
  if (ratingValue === "") {
    swal("Та хайлтын хэсэг дээр ямар нэгэн тоо оруулна уу!");
  } else {
    if (ratingValue <= 5 && ratingValue >= 1) {
      getRestaurantsToDOM(+ratingValue);
    } else {
      swal("Та 1-ээс 5-ын хооронд бүхэл тоо оруулна уу.");
    }
  }
});

// =============================Restauran-uudiig Home page dr haruulah===============================
function showRestaurantsContent() {
  let restaurantArr = JSON.parse(localStorage.getItem("restaurantAllData"));

  restaurantArr.forEach((restaurant) => {
    let itemHTML = `        
    <div class="main-container__restaurant-content">
            <div class="left-content">
              <h2>${restaurant.name}
                <span
                  ><img
                    src="https://scontent.fuln8-1.fna.fbcdn.net/v/t31.18172-8/17761016_1896818063904890_8880108015428113544_o.jpg?_nc_cat=111&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=knDZV3HMs5IAX9Ujg6u&tn=SZT24u-xOvzoHsDB&_nc_ht=scontent.fuln8-1.fna&oh=00_AT9_1fu_3gSME4gAa7hw50JfxkHqOtK838ZEE1jakNoWTw&oe=62B5DB9B"
                    alt=""
                /></span>
              </h2>
              <p>
                Эрүүл, амтат хоол, найрсаг үйлчилгээтэй Момо Хот Пот та бүхнийг урьж
                байна.<br /><br />
                <strong>Хаяг :&nbsp; </strong>Улсын Их Дэлгүүрийн зүүн талд, Мөнгөн
                завьяа явах зам дагуу
              </p>
              <div class="stars-outer">
                <div class="stars-inner"></div>
              </div>
              <span class="number-rating"
                >Үнэлгээ: 5-аас <span id="number-rating"> ${restaurant.rating}</span></span
              >
              <button class="more-btn ripple" id="open" restaurant-id="${restaurant.id}">Дэлгэрэнгүй <i class="fas fa-arrow-right"></i></button>
            </div>
            <div class="right-content">
              <div class="right-content-img">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt=""
                />
              </div>
            </div>
    </div>`;
    let mainContainer = document.getElementsByClassName("main-container")[0];
    mainContainer.innerHTML += itemHTML;
    getRatings();
    moreBtnClick();
  });
}

// ========================Дэлгэрэнгүй товч дээр дарах=====================
function moreBtnClick() {
  const moreBtn = document.querySelectorAll(".more-btn");
  moreBtn.forEach((more) => {
    more.addEventListener("click", (e) => {
      const restaurantID = e.target.getAttribute("restaurant-id");
      localStorage.setItem(
        "selectedRestaurantID",
        JSON.stringify(restaurantID)
      );
      location.href = "Main.html";
    });
  });
}

///////////////////////=BUSAD=//////////////////////////////////
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
