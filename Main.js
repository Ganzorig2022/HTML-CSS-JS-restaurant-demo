import {
  signIn,
  logOut,
  updateUserOrderDataToLocalstorage,
  updateRestaurantRatingInFireStore,
  updateRestaurantRatingCommentInFireStore,
  orderTableDisable,
} from "./firebase_auth.js";

//=============1. Хамгийн түрүүнд ажиллах ФУНКЦҮҮД =============
document.addEventListener("DOMContentLoaded", () => {
  getRatings();
  showRestaurantsContent();
  showUserName();
});
//======================= 2. GLOBAL VARIABLES=====================
const userProfileBtn = document.getElementsByClassName("profile")[0];
const userProfile = document.getElementsByClassName("user-profile-modal")[0];
const loginOpen = document.getElementById("login-open");
const loginModal = document.getElementById("login-modal");
const loginClose = document.getElementById("modal-close-btn");
const signupOpen = document.getElementById("signup-open");
const logoutBtn = document.getElementById("logout-btn");
const userProfileModal =
  document.getElementsByClassName("user-profile-modal")[0];
const signinBtn = document.getElementById("login-submit-btn");
const cartIconBtn = document.getElementsByClassName("fa-shopping-cart")[0];
let btnTime = document.getElementsByClassName("btnTime")[0];
const loggedUserId = document.getElementById("logged-user-id");
const userProfileModalHeader = document.getElementById(
  "user-profile-modal--header"
);
const cartModal = document.getElementsByClassName("cart-modal")[0];
let submitCommentBtnSelect = "";
let textAreaSelect = "";

let restaurantAllArr = JSON.parse(localStorage.getItem("restaurantAllData"));
let restaurantID = JSON.parse(localStorage.getItem("selectedRestaurantID"));
let loggedUserIDData = JSON.parse(localStorage.getItem("loggedUserID"));

let restaurantAverageRatingValue;
let restaurantRatingSumValue;
let restaurantAverageRatingArr;
let countRating5star = 0;
let countRating4star = 0;
let countRating3star = 0;
let countRating2star = 0;
let countRating1star = 0;
let totalStar = 0;
const starsTotal = 5;

//=======Vnelgeenii toonoos hamaars 5 STAR-uudiig budah=============
function getRatings() {
  let starPercentageRounded = 0;

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

// ========================Хэрэглэгчдийн үнэлгээнүүдийг тусад нь САЛГАЖ авах=====================
function totalRating() {
  restaurantAllArr.forEach((restaurant) => {
    if (restaurant.id == restaurantID) {
      if (restaurant.comments) {
        const restaurantCommentArr = restaurant.comments;

        // 1. array-aas rating-vvdiig ni salgaad NEW ARRAY bolgono.
        restaurantAverageRatingArr = restaurantCommentArr.map(
          (comment) => comment.rating
        );

        // 2. NEW ARRAY-iin rating-iin SUM-iig gargana.
        restaurantRatingSumValue = restaurantAverageRatingArr.reduce(
          (acc, item1) => (acc += item1)
        );

        // 3. SUM-iigaa array-iin urtdaa huwaagaad AVERAGE Rating gargana. Butarhai orong 1-eer awaw.
        restaurantAverageRatingValue = (
          restaurantRatingSumValue / restaurantCommentArr.length
        ).toFixed(1);

        // 4. Firebase.auth.js-rvv utga damjuulaw.
        updateRestaurantRatingInFireStore(
          restaurantAverageRatingValue,
          restaurantID
        );
       
      } else {
        console.log("comments bhgv bn.");
      }
    }
  });

  // ямар үнэлгээ хэд байгааг тоолох
  if (restaurantAverageRatingArr) {
    for (let rating of restaurantAverageRatingArr) {
      if (rating === 5) {
        countRating5star++;
        calculateStarMeterWidth(countRating5star, 1);
      }
      if (rating === 4) {
        countRating4star++;
        calculateStarMeterWidth(countRating4star, 2);
      }
      if (rating === 3) {
        countRating3star++;
        calculateStarMeterWidth(countRating3star, 3);
      }
      if (rating === 2) {
        countRating2star++;
        calculateStarMeterWidth(countRating2star, 4);
      }
      if (rating === 1) {
        countRating1star++;
        calculateStarMeterWidth(countRating1star, 5);
      }
    }
  }

  // ========================Нийт үнэлгээний үзлэх Хувиар харуулах=====================
  function calculateStarMeterWidth(countRatingStar, num) {
    totalStar = (countRatingStar * 100) / restaurantAverageRatingArr.length;
    let meterDiv = document.getElementsByClassName(`meterDiv${num}`)[0];
    // console.log(meterDiv);
    if (totalStar > 0) {
      meterDiv.style.width = `${totalStar}%`;
    }
  }
}

// =========================Restaurant-iig Haruulah=================
function showRestaurantsContent() {
  restaurantAllArr.forEach((restaurant) => {
    if (restaurant.id == restaurantID) {
      let restaurantBackground = document.getElementsByTagName("header")[0];
      restaurantBackground.style.backgroundImage = `url(${restaurant.backgroundImage})`;
      let itemHTMLlocation = `
        <div>
          <i class="fa-solid fa-location-dot"></i><span>Салбар 1: ${restaurant.location},</span>
        </div>
      `;
      let itemHTML = `        
          <h2 class="center">
          ${restaurant.name}
          <span
            ><img
              src="${restaurant.logo}"
              alt=""
          /></span>
          </h2>
          <div class="stars-container">
          <div class="stars-outer">
            <div class="stars-inner"></div>
          </div>
          <span class="number-rating" id="number-rating"> ${
            restaurant.rating
          }</span
          >
          <i class="fa-regular fa-message"></i>
          <span><span>${
            restaurant.comments ? `${restaurant.comments.length}` : ""
          }  </span>Comment</span>
          </div>
          <span>${restaurant.about}</span>
          <h3>
          Menu
          </h3>
          <div class="menu-container">
            <button id="btnBorder" class="buttonMenu btnActive">
              Хоол
            </button>
            <button id="btnBorder1" class="buttonMenu">
              Ус, ундаа
            </button>
          </div>
          <h5>ШӨЛ</h5>
          <ul class="listContainer">
          ${restaurant.menu.food
            .map(
              (food) =>
                `<li>
                <h4> <span class="MenuText">${food.name}</span><span>${food.price}</span></h4>
                </li>`
            )
            .join("")}
          
          </ul>
          <ul class="listContainer1">
          ${restaurant.menu.drink
            .map(
              (drink) =>
                `<li>
              <h4> <span class="MenuText">${drink.name}</span><span>${drink.price}</span></h4>
              </li>`
            )
            .join("")}
          </ul>
          <button class="buttonMenu" id="food-menu-btn">Хоолны цэс дэлгэрэнгүй харах</button>
          <h3>
          Үнэлгээ өгсөн:
          <span> ${
            restaurant.comments ? `${restaurant.comments.length}` : ""
          } </span> хүн
          </h3>
          <div class="personRating">
          <div class="personRatingLeft">
            <div class="stars-container">
              <div class="stars-outer">
                <div class="stars-inner"></div>
              </div>
            <span class="number-rating" id="number-rating">${
              restaurant.rating
            }</span>

            </div>
            <ul class="ratingContaner">
              <li>4 <span>хоол</span> </li>
              <li>4 <span>үйлчилгээ</span></li>
              <li>5 <span>Тав тухтай байдал</span></li>
            </ul>
          </div>
          <div class="personRatingRight">
            <div>
              <span class="meterFoodRating">5</span>
              <meter class="meter" min="0" max="100" value="">
                <div class="meterDiv1">
                </div>
            </div>
            <div>
              <span class="meterFoodRating">4</span>
              <meter class="meter" min="0" max="100" value="">
                <div class="meterDiv2">
                </div>
            </div>
            <div>
              <span class="meterFoodRating">3</span>
              <meter class="meter" min="0" max="100" value="">
                <div class="meterDiv3">
                </div>
            </div>
            <div>
              <span class="meterFoodRating">2</span>
              <meter class="meter" min="0" max="100" value="">
                <div class="meterDiv4">
                </div>
            </div>
            <div>
              <span class="meterFoodRating">1</span>
              <meter class="meter" min="0" max="100" value="">
                <div class="meterDiv5">
                </div>
            </div>
          </div>
          </div>
                <div class="feedback-container-items">
                  <div class="star-widget">
                    <div class="star-widget-container">
                      <span class="star-rating-value">5-aaс</span>
                      <input type="radio" name="rate" class="starRate"  id="rate-5" value="5"/>
                      <label for="rate-5" class="fas fa-star"></label>
                      <input type="radio" name="rate" class="starRate" id="rate-4" value="4"/>
                      <label for="rate-4" class="fas fa-star"></label>
                      <input type="radio" name="rate" class="starRate" id="rate-3" value="3"/>
                      <label for="rate-3" class="fas fa-star"></label>
                      <input type="radio" name="rate" class="starRate" id="rate-2" value="2"/>
                      <label for="rate-2" class="fas fa-star"></label>
                      <input type="radio" name="rate" class="starRate" id="rate-1" value="1"/>
                      <label for="rate-1" class="fas fa-star"></label>
                    </div>
                    <p class="starRatingText">
                    </p
                    <form>
                      <div class="star-rating-text"></div>
                      <div class="textarea">
                        <textarea id="text-area-input"
                          cols="30"
                          placeholder="Та сэтгэгдлээ энд бичнэ үү.."
                        ></textarea>
                      </div>
                    </form>
                      <div class="submit-comment-btn">
                        <button type="submit" id="submit-comment-btn">Сэтгэгдэл үлдээх</button>
                      </div>
                  </div>
                </div>
          <h3>Сэтгэгдэл</h3>
          <div class="comment">
            ${
              restaurant.comments
                ? `
              ${restaurant.comments
                .map(
                  (comment) =>
                    `
                <div class="comments">
                  <div class="commentProfile">
                    <div class="commentProfilePicture center">
                      <span>${sliceUserName(comment.name)}</span>
                    </div>
                    <span>${comment.name}</span>
                  </div>
                  <div class="commentText">
                    <div class="stars-container">
                      <div class="stars-outer">
                        <div class="stars-inner"></div>
                      </div>
                      <span class="number-rating" id="number-rating"> ${
                        comment.rating
                      }</span>
                      <span>2 days ago</span>
                    </div>
                    <div>
                      <span>${comment.description}</span>
                    </div>
                  </div>
                </div>
                  `
                )
                .join("")}`
                : ""
            }
              
          </div>`;
      let rightContainer = document.getElementsByClassName("rightContainer")[0];
      let restaurantLocation = document.getElementById("locationTitle");
      restaurantLocation.innerHTML += itemHTMLlocation;
      rightContainer.innerHTML += itemHTML;
      submitCommentBtnSelect = document.getElementById("submit-comment-btn");
      textAreaSelect = document.getElementById("text-area-input");
      getRatings();
      menuSwap();
      totalRating();
      feedbackComment();
      userComment();
    }
  });
}
// =========================Restaurant-ii location харуулах=================
function showRestaurantsLocation() {}

//=====================Нэрний эхний 2 үсгийг тастдаг функц===========================
function sliceUserName(name) {
  return name ? name.slice(0, 2) : [];
}

//=====================Хоол, Уух menu дээр дарахад солбиж харуулах===========================
function menuSwap() {
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
}

// ===========================SIGN IN EXISTING USER=======================
let isSuccessful = false;

signinBtn.addEventListener("click", async () => {
  const signinEmail = document.getElementById("login-email").value;
  const signinPassword = document.getElementById("login-password").value;

  if (checkRequiredInputs([signinEmail, signinPassword])) {
    isSuccessful = await signIn(signinEmail, signinPassword);

    if (isSuccessful) {
      swal(`Хэрэглэгч та амжилттай нэвтэрлээ!`);
      reloadCurrentPage();

      loginModal.classList.remove("show-modal");
      disableLoginBtn();
      disableSignUpBtn();
      activeUserProfile();

      showUserName();
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

// =========================LOG OUT USER=================
logoutBtn.addEventListener("click", async () => {
  isSuccessful = await logOut();
  if (isSuccessful) {
    swal("Та системээс гарлаа.");
    reloadCurrentPage();
    // localStorage-iig empty bolgono.
    localStorage.removeItem("loggedUserData");
    localStorage.removeItem("selectedUserOrder");
    localStorage.removeItem("loggedUserID");
    localStorage.removeItem("order-time");

    userProfileModalHeader.innerHTML = `Хэрэглэгч:`;
    userProfileModal.classList.remove("hidden");

    enableLoginBtn();
    enableSignUpBtn();
    showUserName();
  } else {
    disableLoginInputs();
  }
});

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

// Хэрэглэгч нэвтэрсэн үед хэрэглэгчийн button-ыг УЛААН болгох
function activeUserProfile() {
  const userIcon = document.getElementsByClassName("fa-user")[0];
  userIcon.style.color = "#fff";
  userProfileBtn.style.background = "#fb1c25";
}
// Хэрэглэгч гарсан үед хэрэглэгчийн button-ыг СААРАЛ болгох
function inActiveUserProfile() {
  const userIcon = document.getElementsByClassName("fa-user")[0];
  userIcon.style.color = "#000";
  userProfileBtn.style.background = "#ccc";
}

// ========================Захиалга дээр дарахад ХАДГАЛАХ=====================
btnTime.addEventListener("click", async () => {
  // let key = selectedPerson.value;
  let personValue = selectedPerson.options[selectedPerson.selectedIndex].text;
  let dateValue = selected_date_element.textContent;
  let timeValue = selectedTime.options[selectedTime.selectedIndex].text;

  let timeData = {
    person: personValue,
    date: dateValue,
    time: timeValue,
  };

  // Zahialgiin medeellvvdiig LOCAL dr hadgalah
  localStorage.setItem("order-time", JSON.stringify(timeData));
  let restaurantID = JSON.parse(localStorage.getItem("selectedRestaurantID"));
  let isSuccessful = false;
  console.log("restaurantID", restaurantID);
  console.log("dateValue", dateValue);

  isSuccessful = await orderTableDisable(restaurantID, dateValue);
  if (isSuccessful) {
    if (localStorage.loggedUserData) {
      window.location.assign("table.html");
    } else {
      swal("Та нэвтэрч орсны дараа захиалга өгөх боломжтой!");
      loginModal.classList.add("show-modal");
    }
  }
});

// =========================Нэвтэрсэн Хэрэглэгчийн НЭРИЙГ харуулах=================
function showUserName() {
  if (localStorage.loggedUserData) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    let userName = userData.name;

    loggedUserId.innerHTML = `${userName}`;
    userProfileModalHeader.innerHTML = `Хэрэглэгч: ${userName}`;

    disableLoginBtn();
    disableSignUpBtn();
    activeUserProfile();

    console.log("User is available");
  } else {
    console.log("User is NOT available");
    loggedUserId.innerHTML = "нэвтрээгүй!";

    inActiveUserProfile();
  }
}

// ====================Захиалга хийсэн хэрэглэгч КОМЕНТ үлдээх====================
function feedbackComment() {
  const submitCommentBtn =
    document.getElementsByClassName("submit-comment-btn")[0];
  const textArea = document.getElementsByClassName("textarea")[0];
  const starsSelected = document.querySelectorAll(".starRate");
  let starRatingNumber;
  let textAreaValue = "";
  let userName = "";

  //Хэрэглэгч нэвтэрсэн эсэхийг шалгаад TRUE,FAlSE шалгана.
  let isUserName = checkUserIsLogged();
  if (isUserName) {
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    userName = userData.name;
  }
  if (!isUserName) swal("Нэвтэрсэн хэрэглэгч алга байна!");

  //Ж/нь: 1 гэсэн од дээр дарахад 1 гэсэн утга авдаг функц
  starsSelected.forEach((starInput) => {
    starInput.addEventListener("input", (event) => {
      starRatingNumber = event.target.value;
      showStarRatingText(+starRatingNumber);
    });
  });
  // bichsen setgegdel-ee textarea tag-aas barij awah
  textArea.addEventListener("input", (event) => {
    textAreaValue = event.target.value;
  });

  // ilgeeh towchin dr darahad bichsen textiig firestore-luu yawuulah
  submitCommentBtn.addEventListener("click", () => {
    if (textAreaValue && starRatingNumber && userName) {
      swal("Таны сэтгэгдэл амжилттай илгээгдлээ!");
      updateRestaurantRatingCommentInFireStore(
        textAreaValue,
        +starRatingNumber,
        restaurantID,
        userName
      );
    } else {
      alert("Та сэтгэгдэл бичнэ үү!");
    }
  });
}

// ======LocalStorage-d hereglegch bga esehiig shalgah
function checkUserIsLogged() {
  const loggedUserData = localStorage.getItem("loggedUserData");

  if (loggedUserData) return true;
  if (!loggedUserData) return false;
}

// ========SignIn, SignOut hiihed huudsiig REFRESH hiih function
function reloadCurrentPage() {
  location.reload();
}

// Хэрэглэгчийн сонгосон одноос хамаарч харгалзах текстийг гаргадаг функц.
function showStarRatingText(starRatingNumber) {
  const starRatingText = document.getElementsByClassName("starRatingText")[0];
  const starRatingValue =
    document.getElementsByClassName("star-rating-value")[0];
  if (starRatingNumber == 1) {
    starRatingText.innerHTML = `"Үйлчилгээ ёстой таалагдсангүй"`;
    starRatingValue.innerHTML = `5-aac ${starRatingNumber}`;
  }
  if (starRatingNumber == 2) {
    starRatingText.innerHTML = `"Ер нь таалагдсангүй"`;
    starRatingValue.innerHTML = `5-aac ${starRatingNumber}`;
  }
  if (starRatingNumber == 3) {
    starRatingText.innerHTML = `"Ер нь таалагдсан"`;
    starRatingValue.innerHTML = `5-aac ${starRatingNumber}`;
  }
  if (starRatingNumber == 4) {
    starRatingText.innerHTML = `"Үйлчилгээ сайн байсан"`;
    starRatingValue.innerHTML = `5-aac ${starRatingNumber}`;
  }
  if (starRatingNumber == 5) {
    starRatingText.innerHTML = `"Үнэхээр сайхан үйлчилгээтэй"`;
    starRatingValue.innerHTML = `5-aac ${starRatingNumber}`;
  }
}

// =================Сэтгэгдэл үлдээх - Баталгаажсан хэрэглэгч====================
function userComment() {
  let selectedRestaurant = restaurantAllArr.filter((e) => e.id == restaurantID);
  let selectedRestaurantOrders = selectedRestaurant[0].order;
  if (selectedRestaurantOrders.length > 0) {
    selectedRestaurantOrders.forEach((order) => {
      if (order.userID === loggedUserIDData) {
        enableUserCommentSection();
      } else {
        disableUserCommentSection();
      }
    });
  } else {
    disableUserCommentSection();
  }
}
function disableUserCommentSection() {
  submitCommentBtnSelect.setAttribute("disabled", "");
  textAreaSelect.disabled = true;
  textAreaSelect.style.cursor = "no-drop";
  submitCommentBtnSelect.style.cursor = "no-drop";
  submitCommentBtnSelect.style.background = "#555";
}
function enableUserCommentSection() {
  submitCommentBtnSelect.removeAttribute("disabled");
  textAreaSelect.disabled = false;
  // textAreaSelect.style.cursor = "no-drop";
  submitCommentBtnSelect.style.cursor = "pointer";
}

// ========================Profile window Open=====================
userProfileBtn.addEventListener("click", () => {
  userProfile.classList.toggle("hidden1");
});

// ========================LOGIN MODAL window Open=====================
loginOpen.addEventListener("click", () => {
  loginModal.classList.add("show-modal");
});

loginClose.addEventListener("click", () => {
  loginModal.classList.remove("show-modal");
});

window.addEventListener("click", (e) => {
  e.target == loginModal ? loginModal.classList.remove("show-modal") : false;
});

// ========================Сагсан дах захиалсан хоолны меню-г НЭЭХ=====================
cartIconBtn.addEventListener("click", () => {
  cartModal.classList.toggle("hidden");
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

