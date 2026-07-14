<<<<<<< HEAD
import { auth, database, HAZARD_PATH } from "./firebase-config.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// =======================================
// LOGOUT
// =======================================

document.getElementById("logoutBtn").addEventListener("click", async () => {

    const confirmLogout = confirm("Logout now?");

    if (!confirmLogout) return;

    try {

        await signOut(auth);

        window.location.href = "login.html";

    }

    catch (error) {

        alert(error.message);

    }

});


// =======================================
// GET HAZARD ID
// =======================================

const params = new URLSearchParams(window.location.search);

const hazardId = params.get("id");

if (!hazardId) {

    alert("Invalid Hazard ID.");

    window.location.href = "hazards.html";

}


// =======================================
// LOAD DATA
// =======================================

const hazardRef = ref(database, `${HAZARD_PATH}/${hazardId}`);

get(hazardRef)

.then((snapshot) => {

    if (!snapshot.exists()) {

        alert("Hazard not found.");

        window.location.href = "hazards.html";

        return;

    }

    const data = snapshot.val();

    document.getElementById("hazardId").textContent =
        data.hazardId || hazardId;

    document.getElementById("username").textContent =
        data.username || "-";

    document.getElementById("hazardType").textContent =
        data.hazardType || "-";

    document.getElementById("description").textContent =
        data.description || "-";

    document.getElementById("location").textContent =
        data.location || "-";

    document.getElementById("latitude").textContent =
        data.latitude || "-";

    document.getElementById("longitude").textContent =
        data.longitude || "-";

    document.getElementById("date").textContent =
        data.date || "-";

    document.getElementById("time").textContent =
        data.time || "-";

    // ======================
    // IMAGE
    // ======================

    const photo = document.getElementById("hazardPhoto");

    if (data.image && data.image !== "") {

        photo.src = data.image;

    } else {

        photo.src = "../images/no-image.png";
=======
import { database } from "./firebase-config.js";


import {
    ref,
    get,
    child
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";



// Get ID from URL

const params = new URLSearchParams(window.location.search);

const reportId = params.get("id");



// Firebase reference

const dbRef = ref(database);



get(child(dbRef, "Reports/" + reportId))

.then((snapshot)=>{


    if(snapshot.exists()){


        const data = snapshot.val();



        document.getElementById("reportId").innerText = reportId;


        document.getElementById("userName").innerText =
        data.userName || "-";


        document.getElementById("hazardType").innerText =
        data.hazardType || "-";


        document.getElementById("description").innerText =
        data.description || "-";


        document.getElementById("location").innerText =
        data.location || "-";


        document.getElementById("latitude").innerText =
        data.latitude || "-";


        document.getElementById("longitude").innerText =
        data.longitude || "-";


        document.getElementById("status").innerText =
        data.status || "-";


        document.getElementById("date").innerText =
        data.date || "-";



        if(data.image){


            document.getElementById("reportImage").src =
            data.image;


        }
        else{


            document.getElementById("reportImage").style.display="none";


        }



    }

    else{


        alert("Report not found");

>>>>>>> aff937f5c3d43415dc1e69367f33f0aa5dc462f0

    }


<<<<<<< HEAD
    // ======================
    // STATUS
    // ======================

    const badge = document.getElementById("statusBadge");

    badge.textContent = data.status;

    badge.className = "";

    switch (data.status) {

        case "New":

            badge.classList.add("status", "new");

            break;

        case "Under Investigation":

            badge.classList.add("status", "investigation");

            break;

        case "Resolved":

            badge.classList.add("status", "resolved");

            break;

        default:

            badge.classList.add("status");

    }

})

.catch((error) => {

    console.error(error);

    alert("Failed to load hazard.");
=======

})

.catch((error)=>{


    console.error(error);

>>>>>>> aff937f5c3d43415dc1e69367f33f0aa5dc462f0

});