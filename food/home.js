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
