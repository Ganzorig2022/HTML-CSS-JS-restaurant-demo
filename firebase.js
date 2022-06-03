// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

import {
  getDatabase,
  get,
  ref,
  child,
  onChildChanged,
  push,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyhTFD4jIoRjzdihj4BC1L0_cp1pd1BiA",
  authDomain: "restaurant-61cf5.firebaseapp.com",
  projectId: "restaurant-61cf5",
  storageBucket: "restaurant-61cf5.appspot.com",
  messagingSenderId: "253265064730",
  appId: "1:253265064730:web:d455b23b4afb64fab8b2a3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);

// =============================SIGN UP AUTHENTICATION=======================
const signupBtn = document.getElementById("signup-submit-btn");
const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");

signupBtn.addEventListener("click", (e) => {
  let signupName = document.getElementById("signup-name").value;
  let signupEmail = document.getElementById("signup-email").value;
  let signupPassword = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, signupEmail, signupPassword, signupName)
    .then((userCredential) => {
      //==== Signed in
      const userUid = userCredential.user.uid;

      setDoc(doc(db, "users", userUid), {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });

      signupModal.classList.remove("show-modal");
      loginModal.classList.add("show-modal");

      alert(userUid, "user created!!!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      swal("errorcode is: ", errorCode, "errorMessage is: ", errorMessage);
      // ..
    });
});

// =============================SIGN IN EXISTING USER=======================
const signinBtn = document.getElementById("login-submit-btn");

signinBtn.addEventListener("click", () => {
  const signinEmail = document.getElementById("login-email").value;
  const signinPassword = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, signinEmail, signinPassword)
    .then((userCredential) => {
      const userUid = userCredential.user.uid;
      loginModal.classList.remove("show-modal");
      swal("Баяр хүргэе та амжилттай нэвтэрлээ: ", userUid);
      const currentUser = auth.currentUser;
      console.log("current Hereglegch shvv", currentUser);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      swal(errorCode, errorMessage);
    });
});

// =============================LOGOUT USER IN AUTHENTICATION=======================
const logoutBtn = document.getElementById("logout-btn");
const userProfileModal =
  document.getElementsByClassName("user-profile-modal")[0];
console.log(userProfileModal);

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      console.log("Та гарлаа.");
      swal("Та системээс гарлаа.");
      userProfileModal.classList.remove("hidden");
    })
    .catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      swal(errorCode, errorMessage);
    });
});

// if (currentUser !== null) {
//   const displayName = user.displayName;
//   console.log(displayName, "1 sda law bn.");
// } else {
//   console.log("hen ch alga sda min");
// }

//=========page REFRESH hiihed Newtersen hereglegch bga esehiig shalgadag heseg=======
const loginInputs = document.querySelectorAll(".login-modal-form input");

const autoSignin = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      swal(uid, "Та нэвтэрч орсон байна.");

      loginInputs.forEach((input) => {
        input.setAttribute("disabled", "");
      });
      // signinBtn.setAttribute("disabled", "");
      signinBtn.defaultValue = "Нэвтрэх боломжгүй!";
    } else {
      swal("Та системээс гарсан байна. Нэвтэрч орно уу.");
      loginInputs.forEach((input) => {
        input.removeAttribute("disabled");
      });
      signinBtn.defaultValue = "Нэвтрэx";
    }
  });
};
autoSignin();
