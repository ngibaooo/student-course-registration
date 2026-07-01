const API_BASE = "http://127.0.0.1:8000";

let currentStudentId = null;
let currentRegistrations = [];

document.addEventListener("DOMContentLoaded", async () => {

    // await loadTopbar("Quản lý chuyển lớp học phần");

    document
        .getElementById("searchBtn")
        .addEventListener("click", searchStudent);

});

async function searchStudent() {

    const studentId =
        document.getElementById("studentId").value.trim();

    if (!studentId) {
        alert("Nhập mã sinh viên");
        return;
    }

    currentStudentId = studentId;

    await loadStudentRegistrations(studentId);
}

async function loadStudentRegistrations(studentId) {

    try {

        const token =
            localStorage.getItem("access_token");

        const response = await fetch(
            `${API_BASE}/admin/students/${studentId}/registrations`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok)
            throw new Error("Không tìm thấy sinh viên");

        const data =
            await response.json();

        currentRegistrations = data;

        renderStudentInfo(data);

        renderRegistrationTable(data);

    }
    catch (err) {

        alert(err.message);

        document.getElementById("studentInfo").innerHTML =
            "Không tìm thấy sinh viên";

        document.getElementById("registrationTable").innerHTML = "";
    }

}

function renderStudentInfo(data) {

    if (data.length === 0) {
        document.getElementById("studentInfo").innerHTML =
            "Sinh viên chưa đăng ký học phần";

        return;
    }
    const student = data[0];
    document.getElementById("studentInfo").innerHTML = `
        <p><b>Mã sinh viên:</b> ${student.student_id}</p>
        <p><b>Họ tên:</b> ${student.student_name}</p>
        <p><b>Ngày sinh:</b> ${formatDate(student.date_of_birth)}</p>
        <p><b>Số học phần đã đăng kí:</b> ${data.length}</p>
    `;

}

function renderRegistrationTable(data) {

    const tbody =
        document.getElementById("registrationTable");

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `
            <tr>

                <td>${item.section_id}</td>

                <td>${item.course_name}</td>

                <td>${item.lecturer_name}</td>

                <td>${item.classroom}</td>

                <td>Thứ ${item.schedule_day}</td>

                <td>${item.start_period}-${item.end_period}</td>

                <td>

                    <button
                        class="action-btn"
                        onclick="openTransferPopup(
                            ${item.course_id},
                            ${item.section_id}
                        )">

                        Chuyển lớp

                    </button>

                </td>

            </tr>
        `;

    });

}

async function openTransferPopup(courseId, fromSectionId) {

    const token =
        localStorage.getItem("access_token");

    const response = await fetch(
        `${API_BASE}/admin/course-sections/${courseId}/courses`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const sections =
        await response.json();

    let options = "";

    sections
        .filter(s => s.section_id !== fromSectionId)
        .forEach(s => {

            options += `
                <option value="${s.section_id}">
                    LHP ${s.section_id}
                    -
                    ${s.classroom}
                    -
                    Thứ ${s.schedule_day}
                    -
                    Tiết ${s.start_period}-${s.end_period}
                    -
                    ${s.semester_name}
                </option>
            `;

        });

    removePopup();

    const popup = document.createElement("div");

    popup.id = "transferPopup";

    popup.innerHTML = `
        <div class="popup-overlay">

            <div class="popup-content">

                <h3>Chuyển lớp học phần</h3>

                <select id="newSection">

                    ${options}

                </select>

                <div style="margin-top:20px">

                    <button onclick="confirmTransfer(${fromSectionId})">
                        Xác nhận
                    </button>

                    <button onclick="removePopup()">
                        Hủy
                    </button>

                </div>

            </div>

        </div>
    `;

    document.body.appendChild(popup);

}

function removePopup() {

    const popup =
        document.getElementById("transferPopup");

    if (popup)
        popup.remove();

}

async function confirmTransfer(fromSectionId) {

    const toSectionId =
        document.getElementById("newSection").value;

    if (!toSectionId)
        return;

    try {

        const token =
            localStorage.getItem("access_token");

        const response = await fetch(
            // `${API_BASE}/admin/registrations/transfer`,
            `${API_BASE}/admin/registrations/transfer/demo-deadlock`, //demo DEADLOCK
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({

                    student_id: Number(currentStudentId),

                    from_section_id: fromSectionId,

                    to_section_id: Number(toSectionId)

                })

            }
        );

        if (!response.ok) {

            const err =
                await response.json();

            throw new Error(
                err.detail
            );

        }

        alert("Chuyển lớp thành công");

        removePopup();

        await loadStudentRegistrations(
            currentStudentId
        );

    }
    catch (err) {

        alert(err.message);

    }

}
function formatDate(dateStr){
    return new Date(dateStr).toLocaleDateString(
        "vi-VN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}