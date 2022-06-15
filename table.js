import { updateUserOrderDataToFireStore } from "./firebase_auth.js";

let tablesSelected = document.getElementsByClassName("tables");
let personNum = document.getElementById("person");
let option = document.getElementsByClassName("option");
let tableTimeValue = document.getElementsByClassName("timeValue");
let orderButton = document.getElementsByClassName("orderbutton")[1];

let orderTime = JSON.parse(localStorage.getItem("order-time"));

//LocalStore
for (let i = 0; i < option.length; i++) {
  if (option[i].textContent === orderTime.person) {
    option[i].setAttribute("selected", "");
  }
}
selected_date_element.textContent = orderTime.date;
for (let i = 0; i < tableTimeValue.length; i++) {
  if (tableTimeValue[i].textContent === orderTime.time) {
    tableTimeValue[i].setAttribute("selected", "");
  }
}
let personSelected = personNum.options[personNum.selectedIndex].text;
let personValue = personNum.options[personNum.selectedIndex].value;

//Ширээ сонгох болон 2 давхар ширээ захиалга шалгах хэсэг
//=============================================================================================
let seat = 0;
let orderTable = "";
for (let i = 0; i < tablesSelected.length; i++) {
  tablesSelected[i].addEventListener("click", (e) => {
    let seatCount = tablesSelected[i].firstElementChild.value;
    orderTable = tablesSelected[i].lastElementChild.textContent;
    if (seatCount >= personValue) {
      console.log("ALDAA");
      if (seat < 1) {
        seat++;
        tablesSelected[i].classList.toggle("active");
        if (tablesSelected[i].classList[2]) {
        } else {
          seat = seat - 2;
        }
      } else {
        if (tablesSelected[i].classList[2]) {
          seat--;
          tablesSelected[i].classList.toggle("active");
        } else alert("Та 2 ширээ захилах гэж байна.");
      }
    } else {
      swal(`${personValue} дээш суудалтай ширээ захиална уу!`);
    }
  });
}
//=============================================================================================

//

orderButton.addEventListener("click", () => {
  let personValue = selectedPerson.options[selectedPerson.selectedIndex].text;
  let dateValue = selected_date_element.textContent;
  let timeValue = selectedTime.options[selectedTime.selectedIndex].text;
  let tableValue = orderTable;

  if (tableValue === "") {
    swal("Та ширээгээ заавал сонгоно уу!");
  } else {
    let timeData = {
      person: personValue,
      date: dateValue,
      time: timeValue,
      table: tableValue,
    };
    localStorage.setItem("order-time", JSON.stringify(timeData));

    let restaurantID = JSON.parse(localStorage.getItem("selectedRestaurantID"));
    let loggedUserID = JSON.parse(localStorage.getItem("loggedUserID"));
    console.log(restaurantID);

    updateUserOrderDataToFireStore(
      loggedUserID,
      restaurantID,
      personValue,
      dateValue,
      timeValue,
      +tableValue
    );
  }

  //   window.location.assign("profile.html");
});

const loginOpen = document.getElementById("login-open");
const loginModal = document.getElementsByClassName("login-modal-container")[0];
const loginClose = document.getElementById("modal-close-btn");
window.addEventListener("click", (e) => {
  if (e.target == loginModal) {
    loginModal.classList.remove("show-modal");
  }
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

// =========================USER NAME-iig Haruulah=================
const userProfileModalHeader = document.getElementById(
  "user-profile-modal--header"
);
const userProfileBtn = document.getElementsByClassName("profile")[0];
const loggedUserId = document.getElementById("logged-user-id");

// ========================Profile window Open=====================
const userProfile = document.getElementsByClassName("user-profile-modal")[0];

userProfileBtn.addEventListener("click", () => {
  userProfile.classList.toggle("hidden2");
});

// ========================Cart Modal Window Open=====================
const cartIconBtn = document.getElementsByClassName("fa-shopping-cart")[0];
const cartModal = document.getElementsByClassName("cart-modal")[0];

cartIconBtn.addEventListener("click", () => {
  cartModal.classList.toggle("hidden");
});

function showUserName() {
  if (localStorage.length > 0) {
    //Items are stored in local storage
    let userData = JSON.parse(localStorage.getItem("loggedUserData"));
    let userName = userData.name;
    loggedUserId.innerHTML = `${userName}`;
    userProfileModalHeader.innerHTML = `Хэрэглэгч: ${userName}`;
    console.log("User is available");
    activeUserProfile();
  } else {
    console.log("Local storage is empty");
  }
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
showUserName();
