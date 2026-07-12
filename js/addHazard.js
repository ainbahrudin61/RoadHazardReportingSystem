import { db } from "./firebase-config.js";

import { 
    ref, 
    push, 
    set 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


// Get form elements

const hazardForm = document.getElementById("hazardForm");

const imageInput = document.getElementById("image");

const previewImage = document.getElementById("previewImage");

let imageBase64 = "";


// ============================
// Image Preview
// ============================

imageInput.addEventListener("change", function(){

    const file = this.files[0];


    if(file){

        const reader = new FileReader();


        reader.onload = function(e){

            imageBase64 = e.target.result;

            previewImage.src = imageBase64;

            previewImage.style.display = "block";

        };


        reader.readAsDataURL(file);

    }

});



// ============================
// Save Hazard Data
// ============================

hazardForm.addEventListener("submit", function(e){

    e.preventDefault();


    const hazardType = document.getElementById("hazardType").value;

    const description = document.getElementById("description").value;

    const location = document.getElementById("location").value;

    const latitude = document.getElementById("latitude").value;

    const longitude = document.getElementById("longitude").value;

    const status = document.getElementById("status").value;



    // Check image

    if(imageBase64 === ""){

        alert("Please upload hazard image");

        return;

    }



    // Create new ID

    const hazardRef = push(ref(db, "hazards"));



    // Data structure

    const hazardData = {


        hazardId: hazardRef.key,

        hazardType: hazardType,

        description: description,

        location: location,

        latitude: latitude,

        longitude: longitude,

        status: status,

        image: imageBase64,

        createdAt: new Date().toLocaleString()


    };



    // Save to Firebase

    set(hazardRef, hazardData)

    .then(()=>{


        alert("Hazard added successfully!");


        window.location.href = "hazards.html";


    })

    .catch((error)=>{


        console.error(error);

        alert("Failed to add hazard");


    });



});