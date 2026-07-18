import { auth, database, HAZARD_PATHS, USER_PATH } from "./firebase-config.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// ==============================
// TOTAL USERS
// ==============================
const usersRef = ref(database, USER_PATH);

onValue(usersRef, (snapshot) => {
    let totalUsers = 0;
     snapshot.forEach(() => {
        totalUsers++;
    });

    document.getElementById("totalUsers").textContent = totalUsers;
});

// ==============================
// TOTAL REPORTS
// ==============================
const reportMap = new Map();

function renderDashboard(reportList) {
    let totalReports = reportList.length;
    let openReports = 0;
    let resolvedReports = 0;

    reportList.forEach((report) => {
        switch (report.status) {
            case "New":
            case "Under Investigation":
            case "Repair":
                openReports++;
                break;
            case "Resolved":
                resolvedReports++;
                break;
        }
    });

    document.getElementById("totalReports").textContent = totalReports;
    document.getElementById("openReports").textContent = openReports;
    document.getElementById("resolvedReports").textContent = resolvedReports;

    displayRecentReports(reportList);
}

function syncReports(snapshot, path) {
    if (!snapshot.exists()) return;

    snapshot.forEach((child) => {
        const data = child.val() || {};
        const key = `${path}/${child.key}`;
        const existing = reportMap.get(key) || {};

        const normalizedReport = {
            firebaseId: child.key,
            sourcePath: path,
            ...existing,
            ...data,
            user: data.username || data.user || data.email || data.reportedBy || existing.user || existing.email || existing.reportedBy || "-",
            hazardType: data.hazardType || existing.hazardType || "-",
            status: data.status || existing.status || "New",
            createdAt: data.createdAt || existing.createdAt || 0,
            date: data.date || existing.date || "-",
            location: data.location || existing.location || "-"
        };

        reportMap.set(key, normalizedReport);
    });

    const reportList = Array.from(reportMap.values());
    renderDashboard(reportList);
}

function startDashboardSync() {
    HAZARD_PATHS.forEach((path) => {
        const hazardRef = ref(database, path);
        onValue(hazardRef, (snapshot) => {
            syncReports(snapshot, path);
        });
    });
}

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.replace("login.html");
        return;
    }

    startDashboardSync();
});

// ==============================
// RECENT REPORTS
// ==============================
function displayRecentReports(reportList) {
    const table = document.getElementById("recentTable");
    table.innerHTML = "";

    // Sort by latest first
    reportList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    // Take only first 5
    const recent = reportList.slice(0, 5);

    recent.forEach((report, index) => {
        const displayDate = report.date || "-";
        const displayLocation = report.location || "-";
        const idNumber = index + 1;

        table.innerHTML += `
            <tr>
                <td>${idNumber}</td>
                <td>${report.user}</td>
                <td>${report.hazardType}</td>
                <td>${displayLocation}</td>
                <td>${displayDate}</td>
                <td>
                    <span class="status ${formatStatus(report.status)}">
                        ${report.status || "New"}
                    </span>
                </td>
            </tr>
        `;
    });
}

// ==============================
// STATUS CLASS
// ==============================
function formatStatus(status) {
    switch (status) {
        case "New": return "new";
        case "Under Investigation": return "investigation";
        case "Repair": return "repair";
        case "Resolved": return "resolved";
        default: return "";
    }
}

// ==============================
// LOGOUT
// ==============================
document.getElementById("logoutBtn").addEventListener("click", async () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
        await signOut(auth);
        alert("Logout successful.");
        window.location.href = "login.html";
    } catch (error) {
        alert(error.message);
    }
});