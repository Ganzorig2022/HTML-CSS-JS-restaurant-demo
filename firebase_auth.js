import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  updateEmail,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

// import {
//   getDatabase,
//   get,
//   ref,
//   child,
//   onChildChanged,
//   push,
// } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

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
// const database = getDatabase(app);
const db = getFirestore(app);
const auth = getAuth(app);
let documentID;
// ===========================SIGN UP AUTHENTICATION=======================
const signUp = async function (signupEmail, signupPassword, signupName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signupEmail,
      signupPassword,
      signupName
    );
    // 1. User ID-iigaa barij awna.
    const userUid = userCredential.user.uid;

    // 2. User ID-iigaaraa shineer uusgesen DOCUMENT COLLECTION-oo FIRESTORE DATABASE dotor hadgalna.
    const docRef = await setDoc(doc(db, "users", userUid), {
      name: signupName,
      password: signupPassword,
      email: signupEmail,
    });
    
    return true;
  } catch (error) {
    return false;
  }
};

// ===========================SIGN IN AUTHENTICATION=======================
const signIn = async function (signinEmail, signinPassword) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      signinEmail,
      signinPassword
    );

    const userUid = userCredential.user.uid;
    await getUserDataFromFireStore(userUid);

    return true;
  } catch (error) {
    return false;
  }
};

// =========================LOG OUT USER IN AUTHENTICATION=================
const logOut = async function () {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.log("ERR: ", error);
  }
};

//=========page REFRESH hiihed Newtersen hereglegch bga esehiig shalgadag heseg=======
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    swal(`Та нэвтэрсэн хэвээр байна. Таны ID:${uid}`);
  } else {
    swal("Та системээс гарсан байна!");
  }
});

// =============Get Document Data from Firestore=============
const getUserDataFromFireStore = async function (userUid) {
  const docData = await getDoc(doc(db, "users", userUid));
  let userData = docData.data();
  localStorage.setItem("loggedUserUid", JSON.stringify(userData));
};

// =============Update User Info to Firestore=============
const updateUserDataInFireStore = async function (
  userFirstName,
  userLastName,
  userLoginPassword,
  userLoginEmail
) {
  const user = auth.currentUser;
  const userUid = user.uid;

  try {
    await setDoc(
      doc(db, "users", userUid),
      {
        firstname: userFirstName,
        lastname: userLastName,
        password: userLoginPassword,
        email: userLoginEmail,
      },
      { merge: true }
    );

    resetPasswordEmail(userLoginPassword, userLoginEmail);

    return true;
  } catch (error) {
    swal("ERR: ", error);
  }
};

// =============Change Login Password and Email to Firestore=============
function resetPasswordEmail(userLoginPassword, userLoginEmail) {
  const user = auth.currentUser;
  const newPassword = userLoginPassword;
  const newEMail = userLoginEmail;

  updatePassword(user, newPassword)
    .then(() => {
      // Update successful.
      swal("Таны нэвтрэх password солигдлоо.");
    })
    .catch((error) => {
      console.log("password update error", error);
    });

  updateEmail(user, newEMail)
    .then(() => {
      // Update successful.
      swal("Таны нэвтрэх email солигдлоо.");
      console.log("Таны нэвтрэх email солигдлоо.");
    })
    .catch((error) => {
      console.log("email update error", error);
    });
}

export { signUp, signIn, logOut, updateUserDataInFireStore };
