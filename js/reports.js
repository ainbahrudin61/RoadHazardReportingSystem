import { auth, database, HAZARD_PATH } from "./firebase-config.js";

import {
    ref,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";

import {
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const tableBody = document.getElementById("reportTableBody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const dateFilter = document.getElementById("dateFilter");
const resetBtn = document.getElementById("resetBtn");

let reports = [];


// =======================================
// LOAD REPORTS
// =======================================

onValue(ref(database, HAZARD_PATH), (snapshot) => {

    reports = [];

    if (snapshot.exists()) {

        snapshot.forEach((child) => {

            reports.push({

                id: child.key,

                ...child.val()

            });

        });

    }

    reports.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    renderTable(reports);

});


// =======================================
// DISPLAY TABLE
// =======================================

function renderTable(data) {

    tableBody.innerHTML = "";

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="10">
                    No report found.
                </td>
            </tr>
        `;

        return;

    }

    data.forEach((report, index) => {

        tableBody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>

                ${
                    report.image
                    ?
                    `<img src="${report.image}" class="table-image">`
                    :
                    "No Image"
                }

            </td>

            <td>${report.username || "-"}</td>

            <td>${report.hazardType}</td>

            <td>${report.description}</td>

            <td>${report.location}</td>

            <td>${report.date}</td>

            <td>${report.time}</td>

            <td>

                <span class="status ${statusClass(report.status)}">

                    ${report.status}

                </span>

            </td>

            <td class="action-icons">

                <button
                    class="view-btn"
                    data-id="${report.id}">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button
                    class="delete-btn"
                    data-id="${report.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}


// =======================================
// STATUS COLOUR
// =======================================

function statusClass(status){

    switch(status){

        case "New":
            return "new";

        case "Under Investigation":
            return "investigation";

        case "Resolved":
            return "resolved";

        default:
            return "";

    }

}


// =======================================
// SEARCH & FILTER
// =======================================

function filterReports(){

    const keyword = searchInput.value.toLowerCase();

    const status = statusFilter.value;

    const date = dateFilter.value;

    const filtered = reports.filter((item)=>{

        const matchKeyword =

            (item.username || "").toLowerCase().includes(keyword)

            ||

            (item.hazardType || "").toLowerCase().includes(keyword)

            ||

            (item.location || "").toLowerCase().includes(keyword);

        const matchStatus =

            status === "" || item.status === status;

        const matchDate =

            date === "" || item.date === date;

        return matchKeyword && matchStatus && matchDate;

    });

    renderTable(filtered);

}

searchInput.addEventListener("input", filterReports);

statusFilter.addEventListener("change", filterReports);

dateFilter.addEventListener("change", filterReports);


// =======================================
// RESET
// =======================================

resetBtn.addEventListener("click",()=>{

    searchInput.value="";

    statusFilter.value="";

    dateFilter.value="";

    renderTable(reports);

});


// =======================================
// ACTION BUTTONS
// =======================================

tableBody.addEventListener("click",async(e)=>{

    const button = e.target.closest("button");

    if(!button) return;

    const id = button.dataset.id;

    if(button.classList.contains("view-btn")){

        window.location.href=`viewHazard.html?id=${id}`;

    }

    if(button.classList.contains("delete-btn")){

        const confirmDelete = confirm("Delete this report?");

        if(!confirmDelete) return;

        try{

            await remove(ref(database,`${HAZARD_PATH}/${id}`));

            alert("Report deleted successfully.");

        }

        catch(error){

            alert(error.message);

        }

    }

});


// =======================================
// LOGOUT
// =======================================

document.getElementById("logoutBtn").addEventListener("click",async()=>{

    if(!confirm("Logout now?")) return;

    await signOut(auth);

    window.location.href="login.html";

});