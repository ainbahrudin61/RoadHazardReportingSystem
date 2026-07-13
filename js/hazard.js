
import { db } from "./firebase-config.js";

import {

    ref,
    onValue

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

// ===============================
// Display Hazard Data
// ===============================

const tableBody = document.getElementById("hazardTableBody");

if(!tableBody){

    console.error("Table body not found!");

}

const hazardsRef = ref(db, "hazards");


onValue(hazardsRef, (snapshot)=>{

    console.log("Firebase data:", snapshot.val());

    tableBody.innerHTML = "";


    let number = 1;


    snapshot.forEach((childSnapshot)=>{


        const data = childSnapshot.val();


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

            <td>
                <button class="view-btn">
                    View
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </td>


        </tr>

        `;


        tableBody.innerHTML += row;


        number++;


    });


});