let courses = [];
let selectedCourses = [];
let semesters = [];

document.addEventListener("DOMContentLoaded", async () => {

    await loadTopbar("Đăng ký học phần");

    // await loadCourses();
    await loadSemesters();

    document
        .getElementById("semesterSelect")
        .addEventListener(
            "change",
            handleSemesterChange
        );
    document
        .getElementById("registerBtn")
        .addEventListener(
            "click",
            registerCourses
        );
});

async function loadCourses(semesterId) {

    const token =
        localStorage.getItem("access_token");

    // Danh sách học phần mở
    const openCoursesResponse = await fetch(
        // "http://localhost:8000/api/student/open-courses",
        `http://localhost:8000/api/student/open-courses-by-semester?semester_id=${semesterId}`,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const openCoursesResult =
        await openCoursesResponse.json();

    // Danh sách học phần đã đăng ký
    const registeredResponse = await fetch(
        "http://localhost:8000/api/student/registered-courses",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

    const registeredResult =
        await registeredResponse.json();

    // Lấy danh sách section_id đã đăng ký
    const registeredSectionIds =
        registeredResult.data.map(
            item => item.section_id
        );

    // Loại bỏ những học phần đã đăng ký
    courses =
        openCoursesResult.data.filter(
            course =>
                !registeredSectionIds.includes(
                    course.id
                )
        );

    renderCourses();
}
function renderCourses() {

    const tbody =
        document.getElementById("courseTableBody");

    tbody.innerHTML = "";

    courses.forEach(course => {

        const available =
            course.available_slots > 0;

        tbody.innerHTML += `
        <tr>

            <td>
                <input
                    type="checkbox"
                    class="course-checkbox"
                    value="${course.id}"
                    data-credit="${course.credits}"
                    ${!available ? "disabled" : ""}
                >
            </td>

            <td>HP${course.id}</td>

            <td>${course.course_name}</td>

            <td>${course.lecturer_name}</td>

            <td>${course.credits}</td>

            <td>
                Thứ ${course.schedule_day}
                (${course.start_period}-${course.end_period})
            </td>

            <td class="${
                available
                    ? "available"
                    : "full"
            }">
                ${
                    available
                        ? `${course.available_slots} chỗ`
                        : "Đầy"
                }
            </td>
            <td>

                <a
                    href="course-detail.html?id=${course.id}"
                    class="detail-btn"
                >
                    <i class="fa-regular fa-eye"></i>
                    Xem chi tiết
                </a>

            </td>

        </tr>
        `;
    });

    attachCheckboxEvents();
}
function attachCheckboxEvents() {

    const checkboxes =
        document.querySelectorAll(
            ".course-checkbox"
        );

    checkboxes.forEach(cb => {

        cb.addEventListener("change", () => {

            selectedCourses = [];

            let totalCredits = 0;

            checkboxes.forEach(item => {

                if(item.checked){

                    selectedCourses.push(
                        Number(item.value)
                    );

                    totalCredits +=
                        Number(
                            item.dataset.credit
                        );
                }
            });

            document.getElementById(
                "selectedCount"
            ).textContent =
                selectedCourses.length;

            document.getElementById(
                "totalCredits"
            ).textContent =
                totalCredits;
        });

    });
}
async function registerCourses() {
    const errorBox =
        document.getElementById(
            "registerError"
        );

    errorBox.textContent = "";
    if(selectedCourses.length === 0){

        alert("Vui lòng chọn học phần");

        return;
    }

    const token =
        localStorage.getItem(
            "access_token"
        );

    try {

        for(const sectionId of selectedCourses){

            const response =
                await fetch(
                    "http://localhost:8000/registrations", //URL chính (không lỗi)
                    // "http://localhost:8000/registrations/demo-lost-update", //URL demo lỗi Lost Update
                    // "http://localhost:8000/registrations/demo-phantom", //URL demo lỗi Phantom Read
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            section_id: sectionId
                        })
                    }
                );

            const result =
                await response.json();

            // Backend trả lỗi
            if(!response.ok){

                throw new Error(
                    result.detail ||
                    "Đăng ký thất bại"
                );
            }
        }

        alert(
            "Đăng ký học phần thành công"
        );

        location.reload();

    }
    catch(error){

        console.error(error);

        alert(error.message);
    }
}
// async function loadSemesters(){

//     const token =
//         localStorage.getItem("access_token");

//     const response =
//         await fetch(
//             "http://localhost:8000/api/student/semesters",
//             {
//                 headers:{
//                     Authorization:`Bearer ${token}`
//                 }
//             }
//         );

//     const result =
//         await response.json();

//     const select =
//         document.getElementById(
//             "semesterSelect"
//         );

//     result.data.forEach(item => {

//         select.innerHTML += `
//             <option value="${item.id}">
//                 ${item.semester_name}
//                 ${item.academic_year}
//             </option>
//         `;
//     });
// }
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
// async function handleSemesterChange(){

//     const semesterId =
//         document.getElementById(
//             "semesterSelect"
//         ).value;

//     if(!semesterId){

//         document.getElementById(
//             "courseSection"
//         ).style.display = "none";

//         return;
//     }

//     await loadCourses(semesterId);

//     document.getElementById(
//         "courseSection"
//     ).style.display = "block";
// }
async function handleSemesterChange(){

    const semesterId =
        document.getElementById(
            "semesterSelect"
        ).value;

    const warningBox =
        document.getElementById(
            "semesterWarning"
        );

    const registerBtn =
        document.getElementById(
            "registerBtn"
        );

    if(!semesterId){

        document.getElementById(
            "courseSection"
        ).style.display = "none";

        warningBox.style.display = "none";

        return;
    }

    const semester =
        semesters.find(
            item =>
                item.id == semesterId
        );

    if(
        semester &&
        semester.status === "CLOSED"
    ){

        warningBox.style.display =
            "block";

        warningBox.textContent =
            "Sinh viên không được phép đăng ký học phần trong học kỳ này.";

        registerBtn.disabled = true;

    }
    else{

        warningBox.style.display =
            "none";

        registerBtn.disabled = false;
    }

    await loadCourses(semesterId);

    document.getElementById(
        "courseSection"
    ).style.display = "block";
}