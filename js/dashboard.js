import { auth } from "./firebase-config.js";

import { 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const logoutBtn = document.getElementById("logoutBtn");


logoutBtn.addEventListener("click",()=>{


    signOut(auth)
    .then(()=>{

        alert("Logged out");

        window.location.href="login.html";

    });


});