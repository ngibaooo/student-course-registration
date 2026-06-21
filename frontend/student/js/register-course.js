let courses = [];
let selectedCourses = [];

document.addEventListener("DOMContentLoaded", async () => {

    await loadTopbar("Đăng ký học phần");

    await loadCourses();

    document
        .getElementById("registerBtn")
        .addEventListener(
            "click",
            registerCourses
        );
});

// async function loadCourses() {

//     const token =
//         localStorage.getItem("access_token");

//     const response = await fetch(
//         "http://localhost:8000/api/student/open-courses",
//         {
//             headers:{
//                 Authorization:`Bearer ${token}`
//             }
//         }
//     );

//     const result = await response.json();

//     courses = result.data;

//     renderCourses();
// }
async function loadCourses() {

    const token =
        localStorage.getItem("access_token");

    // Danh sách học phần mở
    const openCoursesResponse = await fetch(
        "http://localhost:8000/api/student/open-courses",
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

    if(selectedCourses.length === 0){

        alert(
            "Vui lòng chọn học phần"
        );

        return;
    }

    const token =
        localStorage.getItem(
            "access_token"
        );

    try {

        for(const sectionId of selectedCourses){

            await fetch(
                "http://localhost:8000/registrations",
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
        }

        alert(
            "Đăng ký học phần thành công"
        );

        location.reload();

    }
    catch(error){

        console.error(error);

        alert(
            "Đăng ký thất bại"
        );
    }
}