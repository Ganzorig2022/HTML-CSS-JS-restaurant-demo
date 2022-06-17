import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
  query,
  updateDoc,
  arrayUnion,
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
    localStorage.setItem("loggedUserID", JSON.stringify(userUid));

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

// =============Нэвтэрсэн хэрэглэгчийн бүх data-г Firestore-оос LOCAL дээр хадгалах=============
const getUserDataFromFireStore = async function (userUid) {
  const docData = await getDoc(doc(db, "users", userUid));
  let userData = docData.data();
  localStorage.setItem("loggedUserData", JSON.stringify(userData));
};

// =============Рестораны бүх data-г Firestore-оос LOCAL дээр хадгалах=============
const getTableDataFromFireStore = async function () {
  // resauranii buh data-g tataj awah
  const docData = await query(collection(db, "restaurant"));
  let queryData = await getDocs(docData);
  let restaurantArr = [];
  queryData.forEach((doc) => {
    let restaurantData = doc.data();
    restaurantArr.push({ ...restaurantData, id: doc.id });
  });
  // awsan data-gaa LOCAL ruu hadgalah
  localStorage.setItem("restaurantAllData", JSON.stringify(restaurantArr));
};

getTableDataFromFireStore();

// =============Хэрэглэгчийн Захиалгыг Firestore-оос LOCAL дээр хадгалах=============
const updateUserOrderDataToLocalstorage = async function () {
  try {
    const resQuery = await query(collection(db, "restaurant"));
    let resQueryData = await getDocs(resQuery);
    resQueryData.forEach((item) => {
      let selectedRes = item.data();
      let selectedResOrder = selectedRes.order;
      let userID = JSON.parse(localStorage.getItem("loggedUserID"));
      let selectedUserOrder = selectedResOrder.filter(
        (e) => e.userID === userID
      );
      if (selectedUserOrder.length > 0) {
        localStorage.setItem(
          "selectedUserOrder",
          JSON.stringify(selectedUserOrder)
        );
      }
    });
  } catch (error) {}
};
// updateUserOrderDataToLocalstorage();

// =============Захиалгыг Firestore дээр НЭМЖ хадгалах=============
const updateUserOrderDataToFireStore = async function (
  loggedUserID,
  restaurantID,
  personValue,
  dateValue,
  timeValue,
  tableValue
) {
  try {
    const docRef = await doc(db, "restaurant", restaurantID);
    let docRefData = await getDoc(docRef);
    // зөвхөн захиалгуудыг салгаж авах
    let docOrderArr = docRefData.data().order;
    console.log("docOrderArr", docOrderArr);
    if (docOrderArr.length > 0 || docOrderArr == "undefined") {
    console.log("start...");

      let existingUserArrFiltered = docOrderArr.filter(
        (e) => e.userID == loggedUserID
      );
      if (existingUserArrFiltered.length > 0) {
        swal("Та ширээ захиалсан байна.");
      } else {
        swal("Та ширээ амжилттай захиаллаа.");
        updateDoc(docRef, {
          order: arrayUnion({
            date: dateValue,
            people: personValue,
            rating: 3.5,
            time: timeValue,
            userID: loggedUserID,
            table: tableValue,
          }),
        });
      }
    } else {
      await updateDoc(docRef, {
        order: arrayUnion({
          date: dateValue,
          people: personValue,
          rating: 3.5,
          time: timeValue,
          userID: loggedUserID,
          table: tableValue,
        }),
      });
    }
  } catch (error) {
    swal("ERR: ", error);
  }
};

// =============Хэрэглэгчийн ҮНЭЛГЭЭГ UPDATE хийх=============
const updateRestaurantRatingInFireStore = async function (
  userRatingValue,
  restaurantID
) {
  try {
    const docRef = await doc(db, "restaurant", restaurantID);
    await updateDoc(docRef, {
      rating: userRatingValue,
    });
    alert(" Үнэлгээ амжилттай шинэчлэгдлээ!");
  } catch (error) {
    console.log("ERR: ", error);
  }
};

// =============Хэрэглэгчийн хувийн мэдээллийг UPDATE хийх=============
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

// =============Хэрэглэгчийн нэвтрэх нэр, имэйлийг ШИНЭЭР СОЛИХ=============
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

export {
  signUp,
  signIn,
  logOut,
  updateUserDataInFireStore,
  updateUserOrderDataToFireStore,
  updateUserOrderDataToLocalstorage,
  updateRestaurantRatingInFireStore,
};
