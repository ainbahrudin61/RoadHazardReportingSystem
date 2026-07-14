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


    }



})

.catch((error)=>{


    console.error(error);


});