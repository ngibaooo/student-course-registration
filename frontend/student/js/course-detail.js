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
        document.getElementById("semester").textContent =
            `${course.semester_name} (${course.academic_year})`;
        document.getElementById("credits").textContent =
            course.credits;

        document.getElementById("schedule").textContent =
            `Thứ ${course.schedule_day}
             (Tiết: ${course.start_period}-${course.end_period})`;

        const available =
            course.maximum_students -
            course.registered_students;

        document.getElementById("capacity").textContent =
            `${course.registered_students}/${course.maximum_students}
            (${available} chỗ)`;

        document.getElementById("description").textContent =
            course.description;

        // if (available <= 0) {

        //     const btn =
        //         document.getElementById("registerBtn");

        //     btn.disabled = true;
        //     btn.textContent = "Lớp đã đầy";
        // }
        const btn =
            document.getElementById(
                "registerBtn"
            );

        if(
            course.semester_status === "CLOSED"
        ){

            btn.disabled = true;

            btn.textContent =
                "Học kỳ đã đóng";

             const warning =
                document.getElementById(
                    "semesterWarning"
                );

            warning.style.display =
                "block";

            warning.textContent =
                "Sinh viên không được phép đăng ký học phần trong học kỳ này.";
        }
        else if(available <= 0){

            btn.disabled = true;

            btn.textContent =
                "Lớp đã đầy";
        }
        else{

            btn.disabled = false;

            btn.textContent =
                "Đăng ký học phần";
        }
        const registerBtn =
            document.getElementById("registerBtn");

        registerBtn.addEventListener(
            "click",
            () => registerCourse(course.id)
        );

    }
    catch(error){

        console.error(error);

        alert("Không tải được chi tiết học phần");

    }
}
async function registerCourse(sectionId) {

    const confirmed = confirm(
        "Bạn có chắc muốn đăng ký học phần này?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const token =
            localStorage.getItem("access_token");

        const response = await fetch(
            "http://localhost:8000/registrations",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    section_id: sectionId
                })
            }
        );

        const result =
            await response.json();

        if (!response.ok) {

            throw new Error(
                result.detail ||
                result.message ||
                "Đăng ký thất bại"
            );
        }

        alert(
            "Đăng ký học phần thành công"
        );

        window.location.href =
            "register-course.html";

    }
    catch(error){

        console.error(error);

        alert(
            error.message ||
            "Đăng ký học phần thất bại"
        );
    }
}