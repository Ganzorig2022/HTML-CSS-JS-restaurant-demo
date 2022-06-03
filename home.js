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
  const starsInner = document.querySelector(".stars-inner");
  starsInner.style.width = starPercentageRounded;
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

userProfileBtn.addEventListener("click", () => {
  const userProfile = document.getElementsByClassName("user-profile-modal")[0];
  userProfile.classList.toggle("hidden");
});

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
});
loginClose.addEventListener("click", () => {
  loginModal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  e.target == loginModal ? loginModal.classList.remove("show-modal") : false;
});

// ========================SIGNUP MODAL window Open=====================
const singupOpen = document.getElementById("signup-open");
const signupModal = document.getElementById("signup-modal");
const signupClose = document.getElementById("signup-close-btn");

singupOpen.addEventListener("click", () => {
  signupModal.classList.add("show-modal");
});
signupClose.addEventListener("click", () => {
  signupModal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  e.target == signupModal ? signupModal.classList.remove("show-modal") : false;
});
