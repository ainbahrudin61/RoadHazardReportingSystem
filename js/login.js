import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        })
        .catch((error) => {

            alert(error.message);

        });

});