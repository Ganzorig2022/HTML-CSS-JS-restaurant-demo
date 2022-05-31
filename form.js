import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB3QZ_A3l3kiewkyFOcohC3ysb5QNTqzZc",
    authDomain: "fir-fd249.firebaseapp.com",
    projectId: "fir-fd29",
    storageBucket: "fir-fd249.appspot.com",
    messagingSenderId: "75241524933",
    appId: "1:75241524933:web:defb0698a9fbbf692aeaac",
    measurementId: "G-442965YCW0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);


document.getElementById('reg-btn').addEventListener('click', function(){
    document.getElementById('register-div').style.display="inline";
    document.getElementById('login-div').style.display="none";
});
document.getElementById('log-btn').addEventListener('click', function(){
    document.getElementById('register-div').style.display="none";
    document.getElementById('login-div').style.display="inline";
});

// LOGIN HESEG
    document.getElementById('login-btn').addEventListener('click', function(){
        const loginEmail=document.getElementById("login-email").value;
        const loginPassword=document.getElementById("login-password").value;

        signInWithEmailAndPassword(auth, loginEmail, loginPassword)
        .then((userCredential) => {
     // Signed in
        const user = userCredential.user;
        document.getElementById('result-box').style.display="inline";
        document.getElementById('login-div').style.display="none";
        document.getElementById('result').innerHTML="Welcome Back<br>"+loginEmail+" was logged in successfully";
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('result-box').style.display="inline";
        document.getElementById('login-div').style.display="none";
        document.getElementById('result').innerHTML="Sorry ! <br>"+errorMessage;

        });
    });

//REGISTER HESEG
        document.getElementById('register-btn').addEventListener('click', function(){
        const registerEmail=document.getElementById("register-email").value;
        const registerPassword=document.getElementById("register-password").value;

        createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
        .then((userCredential) => {
     // Signed in
        const user = userCredential.user;
        document.getElementById('result-box').style.display="inline";
        document.getElementById('register-div').style.display="none";
        document.getElementById('result').innerHTML="Welcome <br>"+registerEmail+" was registered successfully";
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById('result-box').style.display="inline";
        document.getElementById('register-div').style.display="none";
        document.getElementById('result').innerHTML="Sorry ! <br>"+errorMessage;

        });
    });
//LOGOUT HESEG
        document.getElementById('log-out-btn').addEventListener('click', function(){
        signOut(auth).then(() => {
        // Sign-out successful.
        document.getElementById('result-box').style.display="none";
        document.getElementById('login-div').style.display="inline";
        }).catch((error) => {
         // An error happened.
        document.getElementById('result').innerHTML="Sorry ! <br>"
        });
        })








