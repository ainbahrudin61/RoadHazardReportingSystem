import { database } from "./firebase-config.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    auth
} from "./firebase-config.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// =================================
// Logout
// =================================

document.getElementById("logoutBtn").addEventListener("click", () => {

    signOut(auth)
    .then(() => {

        alert("Logged out");

        window.location.href = "login.html";

    });

});



// =================================
// Get Hazard ID
// =================================

const params = new URLSearchParams(window.location.search);

const hazardId = params.get("id");



// =================================
// Form Elements
// =================================

const form = document.getElementById("editHazardForm");

const previewImage = document.getElementById("previewImage");

const photoInput = document.getElementById("photo");

let imageBase64 = "";



// =================================
// Load Hazard Data
// =================================

const hazardRef = ref(database, `hazards/${hazardId}`);

get(hazardRef)

.then((snapshot)=>{

    if(snapshot.exists()){

        const data = snapshot.val();

        document.getElementById("hazardType").value = data.hazardType;

        document.getElementById("location").value = data.location;

        document.getElementById("description").value = data.description;

        document.getElementById("status").value = data.status;

        imageBase64 = data.image;

        previewImage.src = imageBase64;

    }

    else{

        alert("Hazard not found.");

        window.location.href="hazards.html";

    }

})

.catch((error)=>{

    console.log(error);

});




// =================================
// Preview New Image
// =================================

photoInput.addEventListener("change",function(){

    const file = this.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(e){

            imageBase64 = e.target.result;

            previewImage.src = imageBase64;

        }

        reader.readAsDataURL(file);

    }

});




// =================================
// Update Hazard
// =================================

form.addEventListener("submit",(e)=>{

    e.preventDefault();


    const updatedData={

        hazardType:document.getElementById("hazardType").value,

        location:document.getElementById("location").value,

        description:document.getElementById("description").value,

        status:document.getElementById("status").value,

        image:imageBase64

    };


    update(ref(database,`Hazards/${hazardId}`),updatedData)

    .then(()=>{

        alert("Hazard updated successfully!");

        window.location.href="hazards.html";

    })

    .catch((error)=>{

        console.log(error);

        alert("Failed to update hazard.");

    });

});