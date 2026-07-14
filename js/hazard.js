
import { database } from "./firebase-config.js";

import {
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

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


// ===============================
// Display Hazard Data
// ===============================

const tableBody = document.getElementById("hazardTableBody");

if(!tableBody){

    console.error("Table body not found!");

}

const hazardsRef = ref(database, "Hazards");


onValue(hazardsRef, (snapshot)=>{

    console.log("Firebase data:", snapshot.val());

    tableBody.innerHTML = "";


    let number = 1;


    snapshot.forEach((childSnapshot)=>{


        const data = childSnapshot.val();
        const hazardId = childSnapshot.key;


        const row = `

        <tr>

            <td>${number}</td>
            <td>${data.hazardType}</td>
            <td>${data.location}</td>
            <td>${data.status}</td>

            <td>
                ${
                data.image 
                ?
                `<img src="${data.image}" width="80">`
                :
                "No Image"
                }

            </td>

            <td class="action-icons">
                <button class="view-btn" onclick="viewHazard('${hazardId}')">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button
                    class="delete-btn"
                    data-id="${hazardId}">
                    Delete
                </button>

            </td>


        </tr>

        `;


        tableBody.innerHTML += row;


        number++;


    });


});


// ===============================
// Delete Hazard
// ===============================

tableBody.addEventListener("click", async (e) => {

    if (!e.target.classList.contains("delete-btn")) {
        return;
    }

    const hazardId = e.target.dataset.id;

    const confirmDelete = confirm("Are you sure you want to delete this hazard?");

    if (!confirmDelete) {
        return;
    }

    try {

        await remove(ref(database, `Hazards/${hazardId}`));

        alert("Hazard deleted successfully!");

    } catch (error) {

        console.error(error);

        alert("Failed to delete hazard.");

    }

});