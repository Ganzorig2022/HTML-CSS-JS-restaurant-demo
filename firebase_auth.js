import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
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
  getDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-firestore.js";

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

// ===========================SIGN UP AUTHENTICATION=======================
const signUp = function (signupEmail, signupPassword, signupName) {
  const isSuccessful = createUserWithEmailAndPassword(
    auth,
    signupEmail,
    signupPassword,
    signupName
  )
    .then((userCredential) => {
      //==== Signed in
      const userUid = userCredential.user.uid;

      setDoc(doc(db, "users", userUid), {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });

      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return false;
    });
  return isSuccessful;
};

// ===========================SIGN IN AUTHENTICATION=======================
const signIn = function (signinEmail, signinPassword) {
  const isSuccessful = signInWithEmailAndPassword(
    auth,
    signinEmail,
    signinPassword
  )
    .then((userCredential) => {
      const userUid = userCredential.user.uid;
      getUserDataFromFireStore(userUid);

      return true;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      swal(errorCode, errorMessage);
      return false;
    });
  return isSuccessful;
};

// =========================LOG OUT USER IN AUTHENTICATION=================
const logOut = function () {
  const isSuccessful = signOut(auth)
    .then(() => {
      // Sign-out successful.
      return true;
    })
    .catch((error) => {
      // An error happened.
      const errorCode = error.code;
      const errorMessage = error.message;
      swal(errorCode, errorMessage);

      return false;
    });
  return isSuccessful;
};

//=========page REFRESH hiihed Newtersen hereglegch bga esehiig shalgadag heseg=======
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    swal("Та нэвтэрсэн хэвээр байна!", uid);
  } else {
    swal("Та системээс гарсан байна!");
  }
});

// =============Get Document Data from Firestore=============
const getUserDataFromFireStore = function (userUid) {
  getDoc(doc(db, "users", userUid))
    .then((doc) => {
      // {name: "xxx", email: "gmail.com", password:"xxxx"} gej firestore-oos irne.
      let userData = doc.data();

      // firestore-aas awsan user-iin data-gaa LOCALSTORAGE-d object baidlaar hadgalaw.
      localStorage.setItem("loggedUserUid", JSON.stringify(userData));
    })
    .catch((error) => {
      swal("Aldaa zaalaa", error);
    });
};

export { signUp, signIn, logOut };
