import { auth } from "./firebase-config.js";

import { 
    signOut 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { db } from "./firebase-config.js";


import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// GET USERS COUNT

const usersRef = ref(db, "users");


onValue(usersRef, (snapshot)=>{


    let totalUsers = snapshot.size;


    document.getElementById("totalUsers").innerHTML = totalUsers;


});




// GET REPORTS DATA


const reportsRef = ref(db,"hazards");


onValue(reportsRef,(snapshot)=>{


    let total = 0;
    let open = 0;
    let resolved = 0;


    let table = document.getElementById("recentTable");


    table.innerHTML="";


    snapshot.forEach((child)=>{


        let data = child.val();


        total++;


        if(data.status=="New")
        {
            open++;
        }


        if(data.status=="Resolved")
        {
            resolved++;
        }



        // display table


        table.innerHTML += `

        <tr>

            <td>${data.user || "Unknown"}</td>

            <td>${data.hazardType}</td>

            <td>${data.date}</td>

            <td>${data.status}</td>

        </tr>

        `;


    });



    document.getElementById("totalReports").innerHTML = total;


    document.getElementById("openReports").innerHTML = open;


    document.getElementById("resolvedReports").innerHTML = resolved;



});


const logoutBtn = document.getElementById("logoutBtn");


logoutBtn.addEventListener("click",()=>{


    signOut(auth)
    .then(()=>{

        alert("Logged out");

        window.location.href="login.html";

    });


});