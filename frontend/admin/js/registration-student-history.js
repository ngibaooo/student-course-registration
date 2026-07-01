const API="http://127.0.0.1:8000/admin";

document
.getElementById("searchBtn")
.addEventListener("click",loadHistory);

async function loadHistory(){

    const studentId=document
        .getElementById("studentIdInput")
        .value;

    if(!studentId){

        alert("Nhập mã sinh viên");

        return;
    }

    try{

        const token=localStorage
            .getItem("access_token");

        const res=await fetch(
            `${API}/students/${studentId}/registrations`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const data=await res.json();

        renderHistory(data);

    }
    catch(e){

        console.error(e);

    }

}

function renderHistory(data){

    const tbody=document
        .getElementById("historyTableBody");

    tbody.innerHTML="";

    if(data.length===0){

        document
            .getElementById("studentInfoCard")
            .style.display="none";

        document
            .getElementById("historyCard")
            .style.display="block";

        tbody.innerHTML=
        `<tr>
            <td colspan="8" class="empty">
                Không có dữ liệu
            </td>
        </tr>`;

        return;
    }

    document
        .getElementById("studentInfoCard")
        .style.display="block";

    document
        .getElementById("historyCard")
        .style.display="block";

    document
        .getElementById("studentId")
        .textContent=data[0].student_id;

    document
        .getElementById("studentName")
        .textContent=data[0].student_name;

    document
        .getElementById("studentDob")
        .textContent=formatDate(data[0].date_of_birth);

    data.forEach((item,index)=>{

        tbody.innerHTML+=`

        <tr>

            <td>${index+1}</td>

            <td>${item.course_name}</td>

            <td>${item.semester_name}</td>

            <td>${item.classroom}</td>

            <td class="schedule-cell">

                Thứ ${convertDay(item.schedule_day)}

                <br>

                Tiết ${item.start_period}-${item.end_period}

            </td>

            <td>${item.lecturer_name}</td>

            <td>${formatDateTime(item.registration_date)}</td>

            <td>

                <span class="status ${item.status.toLowerCase()}">

                    ${item.status}

                </span>

            </td>

        </tr>

        `;

    });

}

function convertDay(day){

    return day===8 ? "CN" : day;
}

function formatDate(date){

    return new Date(date)
        .toLocaleDateString("vi-VN");
}

function formatDateTime(date){

    return new Date(date)
        .toLocaleString("vi-VN");
}