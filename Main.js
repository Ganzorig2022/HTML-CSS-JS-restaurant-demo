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

const userProfileBtn = document.getElementsByClassName("profile")[0];

userProfileBtn.addEventListener("click", () => {
  console.log("clicked");
  const userProfile = document.getElementsByClassName("user-profile-modal")[0];
  userProfile.classList.toggle("hidden");
});


//listContainer1
let menuBtn = document.getElementById("btnBorder");
let menuBtn1 = document.getElementById("btnBorder1");
let MenuTxt = document.getElementsByTagName("h5")[0];
let listContainer = document.querySelector(".listContainer");
let listContainer1 = document.querySelector(".listContainer1");

menuBtn.addEventListener("click", ()=>{
  if(listContainer.style.display == "block"){

  }else{
  menuBtn.classList.toggle("btnActive");
  menuBtn1.classList.toggle("btnActive");

  MenuTxt.textContent = "ШӨЛ";
  
  listContainer.style.display = "block";
  listContainer1.style.display = "none";
  }
  // menuBtn.classList.toggle("btnActive");
  // menuBtn1.classList.toggle("btnActive");
  // MenuTxt.textContent = "ШӨЛ";
  // listContainer.style.display = "block";
  // listContainer1.style.display = "none";
});
menuBtn1.addEventListener("click", ()=>{
  if(listContainer1.style.display == "block"){

  }else{
  menuBtn.classList.toggle("btnActive");
  menuBtn1.classList.toggle("btnActive");
  MenuTxt.textContent = "Ус, ундаа";
  listContainer.style.display = "none";
  listContainer1.style.display = "block";
  }
  
});