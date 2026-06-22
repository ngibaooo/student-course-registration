let registeredCourses = [];

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadTopbar(
            "Học phần đã đăng ký"
        );

        await loadRegisteredCourses();

    }
);

async function loadRegisteredCourses(){

    try{

        const token =
            localStorage.getItem(
                "access_token"
            );

        const response =
            await fetch(
                "http://localhost:8000/api/student/registered-courses",
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

        updateSummary();

        renderCourses();

    }
    catch(error){

        console.error(error);

    }

}

function updateSummary(){

    document.getElementById(
        "courseCount"
    ).textContent =
        registeredCourses.length;

    const totalCredits =
        registeredCourses.reduce(
            (sum, course) =>
                sum + course.credits,
            0
        );

    document.getElementById(
        "totalCredits"
    ).textContent =
        totalCredits;
    
    document.getElementById(
        "semester"
    ).textContent =
        registeredCourses.length > 0
            ? `${registeredCourses[0].semester_name}
               (${registeredCourses[0].academic_year})`
            : "-";
}

function renderCourses(){

    const tbody =
        document.getElementById(
            "courseTableBody"
        );

    tbody.innerHTML = "";

    if(
        registeredCourses.length === 0
    ){

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    class="empty-row"
                >
                    Chưa đăng ký học phần nào
                </td>
            </tr>
        `;

        return;
    }

    registeredCourses.forEach(
        course => {

            tbody.innerHTML += `
            <tr>

                <td>
                    HP${course.section_id}
                </td>

                <td>
                    ${course.course_name}
                </td>

                <td>
                    ${course.credits}
                </td>

                <td>
                    ${formatDate(
                        course.registration_date
                    )}
                </td>

                <td>

                    <span class="status-badge">

                        Đã đăng ký

                    </span>

                </td>

                <td>

                    <button
                        class="cancel-btn"
                        onclick="cancelCourse(${course.section_id})"
                    >
                        Hủy đăng ký
                    </button>

                </td>

            </tr>
            `;
        }
    );
}

function formatDate(dateString){

    return new Date(
        dateString
    ).toLocaleDateString(
        "vi-VN"
    );
}

async function cancelCourse(
    sectionId
){

    const confirmCancel =
        confirm(
            "Bạn có chắc muốn hủy học phần này?"
        );

    if(!confirmCancel){
        return;
    }

    try{

        const token =
            localStorage.getItem(
                "access_token"
            );

        const response =
            await fetch(
                "http://localhost:8000/registrations",
                {
                    method:"DELETE",

                    headers:{
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body:JSON.stringify({
                        section_id: sectionId
                    })
                }
            );

        const result =
            await response.json();

        if(!response.ok){

            throw new Error(
                result.detail
            );

        }

        alert(
            "Hủy đăng ký thành công"
        );

        await loadRegisteredCourses();

    }
    catch(error){

        console.error(error);

        alert(
            error.message
        );

    }
}