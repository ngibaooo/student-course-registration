let registeredCourses = [];
let semesters = [];

<<<<<<< Updated upstream
// document.addEventListener(
//     "DOMContentLoaded",
//     async () => {

//         await loadTopbar(
//             "Học phần đã đăng ký"
//         );

//         await loadRegisteredCourses();

//     }
// );
document.addEventListener(
    "DOMContentLoaded",
    async () => {
=======
>>>>>>> Stashed changes

document.addEventListener("DOMContentLoaded", async () => {
    await loadTopbar("Học phần đã đăng ký");
    await loadRegisteredCourses();
});

<<<<<<< Updated upstream
        await loadSemesters();

        document
            .getElementById(
                "semesterSelect"
            )
            .addEventListener(
                "change",
                handleSemesterChange
            );
    }
);
async function handleSemesterChange(){

    const semesterId =
        document.getElementById(
            "semesterSelect"
        ).value;

    if(!semesterId){

        registeredCourses = [];

        renderCourses();

        updateSummary();

        return;
    }

    await loadRegisteredCourses(
        semesterId
    );
}
async function loadSemesters(){

    const token =
        localStorage.getItem("access_token");

    const response =
        await fetch(
            "http://localhost:8000/api/student/semesters",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

    const result =
        await response.json();

    semesters = result.data;

    const select =
        document.getElementById(
            "semesterSelect"
        );

    result.data.forEach(item => {

        select.innerHTML += `
            <option value="${item.id}">
                ${item.semester_name}
                ${item.academic_year}
            </option>
        `;
    });
}
async function loadRegisteredCourses(semesterId){
=======

async function loadRegisteredCourses() {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/student/registered-courses", {
            headers: { Authorization: `Bearer ${token}` }
        });

>>>>>>> Stashed changes

        const result = await response.json();
       
        if (!response.ok) {
            throw new Error(result.detail || "Không tải được danh sách môn đã đăng ký");
        }

<<<<<<< Updated upstream
        const token =
            localStorage.getItem(
                "access_token"
            );

        // const response =
        //     await fetch(
        //         "http://localhost:8000/api/student/registered-courses",
        //         {
        //             headers:{
        //                 Authorization:
        //                     `Bearer ${token}`
        //             }
        //         }
        //     );
        const response =
            await fetch(
                `http://localhost:8000/api/student/registered-courses-by-semester?semester_id=${semesterId}`,
                {
                    headers:{
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const result =
            await response.json();

        registeredCourses =
            result.data;
=======
>>>>>>> Stashed changes

        registeredCourses = result.data || [];
        updateSummary();
        renderCourses();
    } catch(error) {
        console.error(error);
        alert("Lỗi tải API học phần đã đăng ký: " + error.message);
    }
}


function updateSummary() {
    document.getElementById("courseCount").textContent = registeredCourses.length;
    const totalCredits = registeredCourses.reduce((sum, course) => sum + course.credits, 0);
    document.getElementById("totalCredits").textContent = totalCredits;
   
    document.getElementById("semester").textContent = registeredCourses.length > 0
        ? `${registeredCourses[0].semester_name} (${registeredCourses[0].academic_year})`
        : "-";
}


function renderCourses() {
    const tbody = document.getElementById("courseTableBody");
    tbody.innerHTML = "";


    if (registeredCourses.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty-row">Chưa đăng ký học phần nào</td></tr>`;
        return;
    }


    registeredCourses.forEach(course => {
        tbody.innerHTML += `
        <tr>
            <td>HP${course.section_id}</td>
            <td>${course.course_name}</td>
            <td>${course.credits}</td>
            <td>${formatDate(course.registration_date)}</td>
            <td><span class="status-badge">Đã đăng ký</span></td>
            <td><button class="cancel-btn" onclick="cancelCourse(${course.section_id})">Hủy đăng ký</button></td>
        </tr>
        `;
    });
}


function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN");
}


async function cancelCourse(sectionId) {
    const confirmCancel = confirm("Bạn có chắc muốn hủy học phần này?");
    if (!confirmCancel) return;


    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/registrations", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ section_id: sectionId })
        });


        const result = await response.json();


        if (!response.ok) {
            throw new Error(result.detail || "Lỗi khi hủy môn");
        }


        alert("Hủy đăng ký thành công");
        await loadRegisteredCourses();
    } catch(error) {
        console.error(error);
        alert(error.message);
    }
}

