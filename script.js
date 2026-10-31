// =====================================================
// STUDENT DATABASE MANAGEMENT SYSTEM
// DATA STRUCTURE: HASHING
// COLLISION RESOLUTION: LINEAR PROBING
// =====================================================

const TABLE_SIZE = 10;

let hashTable = new Array(TABLE_SIZE).fill(null);
let students = [];
let collisionCount = 0;


// =====================================================
// HASH FUNCTION
// h(key) = key % TABLE_SIZE
// =====================================================

function hashFunction(key) {
    return Number(key) % TABLE_SIZE;
}


// =====================================================
// INSERT STUDENT USING LINEAR PROBING
// =====================================================

function insertStudent(student) {

    let index = hashFunction(student.roll);
    let originalIndex = index;
    let collision = false;

    while (hashTable[index] !== null) {

        collision = true;
        index = (index + 1) % TABLE_SIZE;

        if (index === originalIndex) {
            alert("Hash Table is full!");
            return false;
        }
    }

    if (collision) {
        collisionCount++;
    }

    student.hashIndex = index;
    hashTable[index] = student;
    students.push(student);

    return true;
}


// =====================================================
// INITIAL DEMO DATA
// =====================================================

const sampleStudents = [

    {
        roll: 25,
        name: "Sushant Sapte",
        department: "Computer Engineering",
        division: "A",
        semester: 3,
        marks: 92
    },

    {
        roll: 12,
        name: "Rahul Patil",
        department: "Computer Engineering",
        division: "A",
        semester: 3,
        marks: 85
    },

    {
        roll: 33,
        name: "Sneha Joshi",
        department: "Computer Engineering",
        division: "B",
        semester: 3,
        marks: 91
    },

    {
        roll: 41,
        name: "Amit Sharma",
        department: "Computer Engineering",
        division: "B",
        semester: 3,
        marks: 78
    },

    {
        roll: 20,
        name: "Neha Kulkarni",
        department: "Computer Engineering",
        division: "A",
        semester: 3,
        marks: 88
    }

];

sampleStudents.forEach(student => {
    insertStudent(student);
});


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId, button = null) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    const selectedPage = document.getElementById(pageId);

    if (!selectedPage) {
        console.error("Page not found:", pageId);
        return;
    }

    selectedPage.classList.add("active-page");

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        students: "Student Directory",
        addStudent: "Add Student",
        search: "Find Student",
        hashing: "Hash Table"
    };

    const pageTitle = document.getElementById("pageTitle");

    if (pageTitle) {
        pageTitle.textContent = titles[pageId] || "Dashboard";
    }

    if (pageId === "students") {
        displayStudents();
    }

    if (pageId === "hashing") {
        displayHashTable();
    }

    if (pageId === "dashboard") {
        updateDashboard();
        displayRecentStudents();
    }
}


// =====================================================
// ADD STUDENT
// =====================================================

const studentForm = document.getElementById("studentForm");

if (studentForm) {

    studentForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const student = {

            roll: Number(
                document.getElementById("rollNo").value
            ),

            name: document
                .getElementById("studentName")
                .value.trim(),

            department: document
                .getElementById("department")
                .value,

            division: document
                .getElementById("division")
                .value,

            semester: Number(
                document.getElementById("semester").value
            ),

            marks: Number(
                document.getElementById("marks").value
            )

        };

        // CHECK FOR DUPLICATE ROLL NUMBER

        const duplicate = students.some(
            s => s.roll === student.roll
        );

        if (duplicate) {
            alert(
                "A student with this Roll Number already exists."
            );
            return;
        }

        // INSERT STUDENT INTO HASH TABLE

        const success = insertStudent(student);

        if (success) {

            alert(
                "Student Added Successfully!\n\n" +
                "Roll Number: " + student.roll +
                "\nHash Index: " + student.hashIndex
            );

            studentForm.reset();

            updateDashboard();
            displayStudents();
            displayHashTable();
            displayRecentStudents();
        }

    });

}


// =====================================================
// DISPLAY STUDENTS
// =====================================================

function displayStudents() {

    const table = document.getElementById("studentTable");

    if (!table) {
        return;
    }

    const filterInput = document.getElementById("studentFilter");

    const filter = filterInput
        ? filterInput.value.toLowerCase().trim()
        : "";

    table.innerHTML = "";

    const filtered = students.filter(student =>

        student.name.toLowerCase().includes(filter) ||

        student.roll.toString().includes(filter) ||

        student.department.toLowerCase().includes(filter)

    );

    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6"
                    class="empty-cell"
                    style="text-align:center;padding:30px">
                    No student records found.
                </td>
            </tr>
        `;

        return;
    }

    filtered.forEach(student => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${student.roll}</strong>
            </td>

            <td>${student.name}</td>

            <td>${student.department}</td>

            <td>${student.division}</td>

            <td>
                <strong>${student.marks}</strong>
            </td>

            <td>
                <button
                    class="action-btn"
                    onclick="deleteStudent(${student.roll})"
                    title="Delete Student">

                    <i class="fa-solid fa-trash"></i>

                </button>
            </td>
        `;

        table.appendChild(row);

    });

}


// =====================================================
// SEARCH STUDENT USING HASHING
// =====================================================

function searchStudent() {

    const searchInput = document.getElementById("searchRoll");
    const result = document.getElementById("searchResult");

    if (!searchInput || !result) {
        return;
    }

    const inputValue = searchInput.value.trim();

    if (inputValue === "") {

        result.innerHTML = `
            <div class="result-card">
                <div class="result-title">
                    Please enter a Roll Number.
                </div>
            </div>
        `;

        return;
    }

    const roll = Number(inputValue);

    if (!Number.isInteger(roll) || roll < 0) {

        result.innerHTML = `
            <div class="result-card">
                <div class="result-title">
                    Please enter a valid Roll Number.
                </div>
            </div>
        `;

        return;
    }

    let index = hashFunction(roll);
    const startingIndex = index;
    let probes = 0;

    // SEARCH USING LINEAR PROBING

    while (hashTable[index] !== null) {

        probes++;

        if (hashTable[index].roll === roll) {

            const student = hashTable[index];

            result.innerHTML = `
                <div class="result-card">

                    <div class="result-title">
                        <i class="fa-solid fa-circle-check"></i>
                        Student Found
                    </div>

                    <div class="result-row">
                        <span>Roll Number</span>
                        <strong>${student.roll}</strong>
                    </div>

                    <div class="result-row">
                        <span>Name</span>
                        <strong>${student.name}</strong>
                    </div>

                    <div class="result-row">
                        <span>Department</span>
                        <strong>${student.department}</strong>
                    </div>

                    <div class="result-row">
                        <span>Division</span>
                        <strong>${student.division}</strong>
                    </div>

                    <div class="result-row">
                        <span>Semester</span>
                        <strong>${student.semester}</strong>
                    </div>

                    <div class="result-row">
                        <span>Marks</span>
                        <strong>${student.marks}</strong>
                    </div>

                    <div class="result-row">
                        <span>Hash Index</span>
                        <strong>${index}</strong>
                    </div>

                    <div class="result-row">
                        <span>Probes Required</span>
                        <strong>${probes}</strong>
                    </div>

                </div>
            `;

            return;
        }

        index = (index + 1) % TABLE_SIZE;

        if (index === startingIndex) {
            break;
        }
    }

    // STUDENT NOT FOUND

    result.innerHTML = `
        <div class="result-card">

            <div class="result-title" style="color:#c85b5b">
                <i class="fa-solid fa-circle-xmark"></i>
                Student Not Found
            </div>

            <div class="result-row">
                <span>Roll Number</span>
                <strong>${roll}</strong>
            </div>

            <div class="result-row">
                <span>Calculated Hash Index</span>
                <strong>${hashFunction(roll)}</strong>
            </div>

        </div>
    `;

}


// =====================================================
// DELETE STUDENT
// =====================================================

function deleteStudent(roll) {

    const index = students.findIndex(
        student => student.roll === roll
    );

    if (index === -1) {
        return;
    }

    const student = students[index];

    const confirmed = confirm(
        `Delete ${student.name}'s record?`
    );

    if (!confirmed) {
        return;
    }

    students.splice(index, 1);

    // REBUILD THE HASH TABLE AFTER DELETION

    rebuildHashTable();

    displayStudents();
    displayHashTable();
    displayRecentStudents();
    updateDashboard();

}


// =====================================================
// REBUILD HASH TABLE
// =====================================================

function rebuildHashTable() {

    const oldStudents = [...students];

    hashTable = new Array(TABLE_SIZE).fill(null);

    students = [];
    collisionCount = 0;

    oldStudents.forEach(student => {

        const copy = {

            roll: student.roll,
            name: student.name,
            department: student.department,
            division: student.division,
            semester: student.semester,
            marks: student.marks

        };

        insertStudent(copy);

    });

}


// =====================================================
// DISPLAY HASH TABLE
// =====================================================

function displayHashTable() {

    const table = document.getElementById("hashTableBody");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    hashTable.forEach((student, index) => {

        const row = document.createElement("tr");

        if (student) {

            row.innerHTML = `
                <td>
                    <strong>${index}</strong>
                </td>

                <td>${student.roll}</td>

                <td>${student.name}</td>

                <td>${student.department}</td>

                <td>${student.marks}</td>
            `;

        } else {

            row.innerHTML = `
                <td>
                    <strong>${index}</strong>
                </td>

                <td colspan="4" class="empty-cell">
                    Empty Slot
                </td>
            `;

        }

        table.appendChild(row);

    });

}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    const totalStudents = document.getElementById("totalStudents");
    const recordsStored = document.getElementById("recordsStored");
    const collisions = document.getElementById("collisionCount");

    if (totalStudents) {
        totalStudents.textContent = students.length;
    }

    if (recordsStored) {
        recordsStored.textContent = students.length;
    }

    if (collisions) {
        collisions.textContent = collisionCount;
    }

}


// =====================================================
// DISPLAY RECENT STUDENTS
// =====================================================

function displayRecentStudents() {

    const container = document.getElementById("recentStudents");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const recent = [...students].slice(-5).reverse();

    recent.forEach(student => {

        const initials = student.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();

        const item = document.createElement("div");

        item.className = "recent-item";

        item.innerHTML = `
            <div class="student-avatar">
                ${initials}
            </div>

            <div class="student-info">
                <strong>${student.name}</strong>
                <span>Roll No. ${student.roll}</span>
            </div>

            <div class="student-mark">
                ${student.marks}%
            </div>
        `;

        container.appendChild(item);

    });

}


// =====================================================
// STUDENT DIRECTORY FILTER
// =====================================================

const studentFilter = document.getElementById("studentFilter");

if (studentFilter) {

    studentFilter.addEventListener("input", function() {
        displayStudents();
    });

}


// =====================================================
// INITIALIZE APPLICATION
// =====================================================

updateDashboard();

displayStudents();

displayHashTable();

displayRecentStudents();