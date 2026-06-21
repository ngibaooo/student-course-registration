document.addEventListener("DOMContentLoaded", async () => {

    await loadTopbar("Học phần mở");

    await loadCourses();

});

async function loadCourses() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response = await fetch(
            "http://127.0.0.1:8000/api/student/open-courses",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        renderCourses(result.data);

    }
    catch(error){

        console.error(error);

    }

}

function renderCourses(courses){

    const tbody =
        document.getElementById("courseTableBody");

    tbody.innerHTML = "";

    courses.forEach(course => {

        const availableText =
            course.available_slots > 0
                ? `${course.available_slots} chỗ`
                : "Đầy";

        const availableClass =
            course.available_slots > 0
                ? "available"
                : "full";

        tbody.innerHTML += `
        <tr>

            <td>HP${course.id}</td>

            <td>${course.course_name}</td>

            

            <td>${course.credits}</td>

            <td>${course.lecturer_name}</td>

            <td>${course.classroom}</td>

            <td>
                Thứ ${course.schedule_day}
                (${course.start_period}-${course.end_period})
            </td>

            <td class="${availableClass}">
                ${availableText}
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

}