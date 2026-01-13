// 🔥 Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔐 Firebase config (COLE A SUA AQUI)
const firebaseConfig = {
  apiKey: "AIzaSyBOvbrC2qReZaNawk4MG17cKjOUlPk8u2g",
  authDomain: "calculadora-app-926cf.firebaseapp.com",
  projectId: "calculadora-app-926cf",
};

// 🚀 Init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🧱 DIVS
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");

// 🔁 CONTROLE DE LOGIN
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginDiv.style.display = "none";
    appDiv.style.display = "block";
  } else {
    loginDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});

// 🔐 LOGIN EMAIL
window.loginEmail = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  signInWithEmailAndPassword(auth, email, senha)
    .catch(err => alert(err.message));
};

// 🆕 CRIAR CONTA
window.criarConta = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .catch(err => alert(err.message));
};

// 🔐 GOOGLE
const provider = new GoogleAuthProvider();
window.loginGoogle = function () {
  signInWithPopup(auth, provider)
    .catch(err => alert(err.message));
};

// 🚪 SAIR
window.logout = function () {
  signOut(auth);
};
