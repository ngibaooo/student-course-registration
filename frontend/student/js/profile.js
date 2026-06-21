document.addEventListener("DOMContentLoaded", async () => {

    await loadTopbar("Thông tin cá nhân");

    await loadProfile();

});

async function loadProfile() {

    try {

        const token = localStorage.getItem("access_token");

        const response = await fetch(
            "http://127.0.0.1:8000/api/student/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result = await response.json();

        const student = result.data;
        // PROFILE

        document.getElementById("fullName").textContent =
            student.full_name;

        document.getElementById("studentId").textContent =
            `ID: ${student.id}`;

        document.getElementById("departmentName").textContent =
            `Khoa: ${student.department_name}`;

        document.getElementById("infoFullName").textContent =
            student.full_name;

        document.getElementById("dateOfBirth").textContent =
            formatDate(student.date_of_birth);

        document.getElementById("email").textContent =
            student.email;

        document.getElementById("phone").textContent =
            student.phone;

        document.getElementById("address").textContent =
            student.address;

        document.getElementById("studyStudentId").textContent =
            student.id;

        document.getElementById("studyDepartment").textContent =
            student.department_name;

        document.getElementById("gender").textContent =
            student.gender;

        const initials = getInitials(student.full_name);
        
        document.getElementById("avatarLarge").textContent =
            initials;

    }
    catch (error) {

        console.error(error);

    }
}
function getInitials(fullName) {

    const words = fullName.trim().split(" ");

    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[words.length - 1].charAt(0)
    ).toUpperCase();
}

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleDateString("vi-VN");
}