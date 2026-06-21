document.addEventListener("DOMContentLoaded", async () => {

    // await loadSidebar();

    await loadTopbar("Chi tiết học phần");

    await loadCourseDetail();

});

async function loadCourseDetail() {

    try {

        const params =
            new URLSearchParams(window.location.search);

        const courseId =
            params.get("id");

        const token =
            localStorage.getItem("access_token");

        const response = await fetch(
            `http://127.0.0.1:8000/api/student/open-courses/${courseId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result =
            await response.json();

        const course =
            result.data;

        document.getElementById("courseName").textContent =
            course.course_name;

        document.getElementById("courseCode").textContent =
            `Mã lớp học phần: HP${course.id}`;

        document.getElementById("lecturerName").textContent =
            course.lecturer_name;

        document.getElementById("classroom").textContent =
            course.classroom;

        document.getElementById("credits").textContent =
            course.credits;

        document.getElementById("schedule").textContent =
            `Thứ ${course.schedule_day}
             (${course.start_period}-${course.end_period})`;

        const available =
            course.maximum_students -
            course.registered_students;

        document.getElementById("capacity").textContent =
            `${course.registered_students}/${course.maximum_students}
            (${available} chỗ)`;

        document.getElementById("description").textContent =
            course.description;

        if (available <= 0) {

            const btn =
                document.getElementById("registerBtn");

            btn.disabled = true;
            btn.textContent = "Lớp đã đầy";
        }

    }
    catch(error){

        console.error(error);

        alert("Không tải được chi tiết học phần");

    }
}