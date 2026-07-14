import { auth, database, HAZARD_PATH } from "./firebase-config.js";
import { ref, get, update } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", async () => {
    if (!confirm("Logout now?")) return;
    await signOut(auth);
    window.location.href = "login.html";
});

// GET HAZARD ID
const params = new URLSearchParams(window.location.search);
const hazardId = params.get("id");

if (!hazardId) {
    alert("Invalid Hazard ID.");
    window.location.href = "hazards.html";
}

// FORM
const form = document.getElementById("editHazardForm");
const previewImage = document.getElementById("previewImage");
const photoInput = document.getElementById("photo");
let imageBase64 = "";

// LOAD DATA
const hazardRef = ref(database, `${HAZARD_PATH}/${hazardId}`);

get(hazardRef)
    .then((snapshot) => {
        if (!snapshot.exists()) {
            alert("Hazard not found.");
            window.location.href = "hazards.html";
            return;
        }

        const data = snapshot.val();

        document.getElementById("username").value = data.username || "-";
        document.getElementById("hazardType").value = data.hazardType || "";
        document.getElementById("description").value = data.description || "";
        document.getElementById("location").value = data.location || "";
        document.getElementById("latitude").value = data.latitude || "";
        document.getElementById("longitude").value = data.longitude || "";
        document.getElementById("status").value = data.status || "New";

        imageBase64 = data.image || "";
        if (imageBase64 !== "") {
            previewImage.src = imageBase64;
        }
    })
    .catch((error) => {
        console.error(error);
        alert("Failed to load hazard data.");
    });

// CHANGE IMAGE
photoInput.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        imageBase64 = e.target.result;
        previewImage.src = imageBase64;
    };
    reader.readAsDataURL(file);
});

// UPDATE DATA
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedData = {
        username: document.getElementById("username").value,
        hazardType: document.getElementById("hazardType").value,
        description: document.getElementById("description").value.trim(),
        location: document.getElementById("location").value.trim(),
        latitude: document.getElementById("latitude").value,
        longitude: document.getElementById("longitude").value,
        status: document.getElementById("status").value,
        image: imageBase64,
        updatedAt: new Date().getTime()
    };

    try {
        await update(hazardRef, updatedData);
        alert("Hazard updated successfully.");
        window.location.href = "hazards.html";
    } catch (error) {
        console.error(error);
        alert("Failed to update hazard.");
    }
});