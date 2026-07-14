import { auth, database, HAZARD_PATH } from "./firebase-config.js";
import { ref, onValue, remove } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const tableBody = document.getElementById("hazardTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");
const resetBtn = document.getElementById("resetBtn");

<<<<<<< HEAD
let allHazards = [];
=======
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
                
                <button
                    class="view-btn"
                    onclick="viewHazard('${hazardId}')"
                    title="View">
                    <i class="fa-solid fa-eye"></i>
                </button>

                <button
                    class="delete-btn"
                    data-id="${hazardId}"
                    title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>

            </td>


        </tr>

        `;


        tableBody.innerHTML += row;


        number++;


    });
>>>>>>> aff937f5c3d43415dc1e69367f33f0aa5dc462f0

// ======================================
// LOAD DATA FROM FIREBASE
// ======================================
const hazardsRef = ref(database, HAZARD_PATH);

onValue(hazardsRef, (snapshot) => {
    allHazards = [];
    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            allHazards.push({
                id: child.key,
                ...child.val()
            });
        });
    }
    // Sort by latest first
    allHazards.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    renderTable(allHazards);
});

<<<<<<< HEAD
// ======================================
// DISPLAY TABLE
// ======================================
function renderTable(data) {
    tableBody.innerHTML = "";
=======
// ===============================
// View Hazard
// ===============================

window.viewHazard = function(hazardId){

    window.location.href = `viewHazard.html?id=${hazardId}`;

}


>>>>>>> aff937f5c3d43415dc1e69367f33f0aa5dc462f0

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="10">No hazard reports found.</td>
            </tr>
        `;
        return;
    }

    data.forEach((hazard, index) => {
        tableBody.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>
                ${hazard.image 
                    ? `<img src="${hazard.image}" class="table-image">` 
                    : "No Image"}
            </td>
            <td>${hazard.username || "-"}</td>
            <td>${hazard.hazardType || "-"}</td>
            <td>${hazard.description || "-"}</td>
            <td>${hazard.location || "-"}</td>
            <td>${hazard.date || "-"}</td>
            <td>${hazard.time || "-"}</td>
            <td>
                <span class="status ${statusClass(hazard.status)}">
                    ${hazard.status || "New"}
                </span>
            </td>
            <td class="action-icons">
                <button class="view-btn" data-id="${hazard.id}">
                    <i class="fa-solid fa-eye"></i>
                </button>
                <button class="edit-btn" data-id="${hazard.id}">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="delete-btn" data-id="${hazard.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        </tr>
        `;
    });
}

// ======================================
// STATUS COLOUR
// ======================================
function statusClass(status) {
    switch(status) {
        case "New": return "new";
        case "Under Investigation": return "investigation";
        case "Resolved": return "resolved";
        default: return "";
    }
}

// ======================================
// LIVE SEARCH & FILTER
// ======================================
function filterData() {
    const keyword = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const date = dateFilter.value;

    const filtered = allHazards.filter((hazard) => {
        const matchKeyword = 
            (hazard.username || "").toLowerCase().includes(keyword) ||
            (hazard.hazardType || "").toLowerCase().includes(keyword) ||
            (hazard.location || "").toLowerCase().includes(keyword);
        
        const matchStatus = status === "" || hazard.status === status;
        const matchDate = date === "" || hazard.date === date;

        return matchKeyword && matchStatus && matchDate;
    });

    renderTable(filtered);
}

searchInput.addEventListener("input", filterData);
statusFilter.addEventListener("change", filterData);
dateFilter.addEventListener("change", filterData);

// ======================================
// RESET FILTER
// ======================================
resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    statusFilter.value = "";
    dateFilter.value = "";
    renderTable(allHazards);
});

// ======================================
// TABLE BUTTONS (View, Edit, Delete)
// ======================================
tableBody.addEventListener("click", async (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = button.dataset.id;

    if (button.classList.contains("view-btn")) {
        window.location.href = `viewHazard.html?id=${id}`;
    }

    if (button.classList.contains("edit-btn")) {
        window.location.href = `editHazard.html?id=${id}`;
    }

    if (button.classList.contains("delete-btn")) {
        const confirmDelete = confirm("Delete this hazard report?");
        if (!confirmDelete) return;

        try {
            await remove(ref(database, `${HAZARD_PATH}/${id}`));
            alert("Hazard deleted successfully.");
        } catch (error) {
            alert(error.message);
        }
    }
});

// ======================================
// LOGOUT
// ======================================
document.getElementById("logoutBtn").addEventListener("click", async () => {
    if (!confirm("Logout now?")) return;
    await signOut(auth);
    window.location.href = "login.html";
});