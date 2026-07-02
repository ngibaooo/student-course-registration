const API =
    "http://localhost:8000/admin/students";

document
    .getElementById("searchBtn")
    .addEventListener("click", loadLog);

async function loadLog() {

    const studentId =
        document
            .getElementById("studentIdInput")
            .value
            .trim();

    if (studentId === "") {

        alert("Vui lòng nhập mã sinh viên");

        return;
    }

    const token =
        localStorage.getItem("access_token");

    try {

        const response =
            await fetch(
                `${API}/${studentId}/registration-log`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        const logs =
            await response.json();

        if (logs.length === 0) {

            document
                .getElementById("studentInfoCard")
                .style.display = "none";

            document
                .getElementById("historyCard")
                .style.display = "none";

            alert("Không tìm thấy dữ liệu.");

            return;
        }

        renderStudentInfo(logs[0]);

        renderTable(logs);

    }

    catch (err) {

        console.error(err);

        alert("Không thể tải dữ liệu.");

    }

}

function renderStudentInfo(log) {

    document
        .getElementById("studentInfoCard")
        .style.display = "block";

    document
        .getElementById("historyCard")
        .style.display = "block";

    document
        .getElementById("studentId")
        .textContent =
        log.student_id;

    document
        .getElementById("studentName")
        .textContent =
        log.student_name;

    document
        .getElementById("studentDob")
        .textContent =
        formatDate(log.date_of_birth);

}

function renderTable(logs) {

    const tbody =
        document.getElementById("logTableBody");

    tbody.innerHTML = "";

    logs.forEach((log, index) => {

        let badge = "";

        switch (log.action_type) {

            case "REGISTER":

                badge =
                    `<span class="status register">
                        REGISTER
                    </span>`;

                break;

            case "CANCEL":

                badge =
                    `<span class="status cancel">
                        CANCEL
                    </span>`;

                break;

            case "TRANSFER":

                badge =
                    `<span class="status transfer">
                        TRANSFER
                    </span>`;

                break;

        }

        let roomHtml = "";

        if (log.action_type === "TRANSFER") {

            roomHtml =
                `
                <div class="transfer-room">

                    <span>${log.from_classroom}</span>

                    <i class="fa-solid fa-arrow-right transfer-arrow"></i>

                    <span>${log.classroom}</span>

                </div>
                `;
        }

        else {

            roomHtml = log.classroom;

        }

        let description = "";

        switch (log.action_type) {

            case "REGISTER":

                description =
                    `Sinh viên đăng ký học phần ${log.course_name}
                    tại phòng ${log.classroom}.`;

                break;

            case "CANCEL":

                description =
                    `Sinh viên hủy đăng ký học phần ${log.course_name}
                    tại phòng ${log.classroom}.`;

                break;

            case "TRANSFER":

                description =
                    `Sinh viên được chuyển lớp học phần từ phòng
                    ${log.from_classroom}
                    sang
                    ${log.classroom}.`;

                break;
        }
        tbody.innerHTML +=
            `
            <tr>

                <td>${index + 1}</td>

                <td>${badge}</td>

                <td>${log.course_name}</td>

                <td>${roomHtml}</td>

                <td>${formatDate(log.action_date)}</td>
                
                <td class="detail-cell">

                    ${description}

                </td>

            </tr>
            `;

    });

}

function formatDate(date){

    return new Date(date)
        .toLocaleDateString("vi-VN");
}