const TOTAL_PERIODS = 10;
let currentWeekOffset = 0;
const CA_HOC = [
    {
        ca: 1,
        start: 1,
        end: 3,
        time: "06:45 - 09:15"
    },
    {
        ca: 2,
        start: 4,
        end: 6,
        time: "09:25 - 11:55"
    },
    {
        ca: 3,
        start: 7,
        end: 9,
        time: "12:10 - 14:40"
    },
    {
        ca: 4,
        start: 10,
        end: 12,
        time: "14:50 - 17:20"
    },
    {
        ca: 5,
        start: 13,
        end: 15,
        time: "17:30 - 20:00"
    }
];

let schedules = [];

document.addEventListener("DOMContentLoaded", async () => {
    document
        .getElementById(
            "prevWeekBtn"
        )
        .addEventListener(
            "click",
            () => {

                currentWeekOffset--;

                renderWeekHeader();
                renderSchedule();
            }
        );
    document
        .getElementById("currentWeekBtn")
        .addEventListener("click", () => {

            currentWeekOffset = 0;

            renderWeekHeader();
            renderSchedule();

        });
    document
        .getElementById(
            "nextWeekBtn"
        )
        .addEventListener(
            "click",
            () => {

                currentWeekOffset++;

                renderWeekHeader();
                renderSchedule();
            }
        );
    await loadTopbar("Lịch học cá nhân");

    renderWeekHeader();

    await loadSchedule();

});
function isDateInSemester(semesterStart, semesterEnd, currentDate){

    const start = new Date(semesterStart);
    const end = new Date(semesterEnd);

    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    return currentDate >= start && currentDate <= end;
}
async function loadSchedule() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response = await fetch(
            "http://127.0.0.1:8000/api/student/schedule",
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );

        const result =
            await response.json();

        schedules =
            result.data;

        renderSchedule();

    }
    catch(error){

        console.error(error);

    }
}
function renderSchedule(){
    const today = new Date();

    const currentDay = today.getDay();

    const monday = new Date(today);

    monday.setDate(
        today.getDate() -
        (currentDay === 0 ? 6 : currentDay - 1)
    );

    monday.setDate(
        monday.getDate() + currentWeekOffset * 7
    );
    const tbody =
        document.getElementById("scheduleBody");

    tbody.innerHTML = "";

    CA_HOC.forEach(ca => {

        let row = `<tr>`;

        row += `
            <td class="period-cell">

                <div class="ca-name">
                    Ca ${ca.ca}
                </div>

                <div class="ca-period">
                    Tiết ${ca.start} - ${ca.end}
                </div>

               

            </td>
        `;

        for(let day = 2; day <= 8; day++){
            const currentDate = new Date(monday);
            currentDate.setDate(monday.getDate() + (day - 2));
            const course =
                schedules.find(item =>

                    item.schedule_day === day &&

                    item.start_period === ca.start &&

                    item.end_period === ca.end &&

                    isDateInSemester(
                        item.start_date,
                        item.end_date,
                        currentDate
                    )

                );

            if(course){

                row += `
                    <td class="schedule-cell">

                        <div class="course-block">

                            <div class="course-name">
                                ${course.course_name}
                            </div>

                            <div class="classroom">
                                Phòng học: ${course.classroom}
                            </div>

                            <div class="course-period">
                                Tiết: ${course.start_period}
                                -
                                ${course.end_period}
                            </div>
                             <div class="ca-time">
                                ${ca.time}
                            </div>

                        </div>

                    </td>
                `;
            }
            else{

                row += `
                    <td class="schedule-cell"></td>
                `;
            }
        }

        row += `</tr>`;

        tbody.innerHTML += row;
    });
}
function renderWeekHeader(){

    const headerRow =
        document.getElementById(
            "scheduleHeaderRow"
        );

    const weekInfo =
        document.getElementById(
            "weekInfo"
        );

    const today =
        new Date();

    const currentDay =
        today.getDay();

    const monday =
        new Date(today);

    monday.setDate(
        today.getDate()
        -
        (
            currentDay === 0
                ? 6
                : currentDay - 1
        )
    );

    monday.setDate(
        monday.getDate()
        +
        currentWeekOffset * 7
    );

    const sunday =
        new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    weekInfo.textContent =
        `${formatDate(monday)}
         - 
         ${formatDate(sunday)}`;

    headerRow.innerHTML =
        `<th>Ca học</th>`;

    const dayNames = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "CN"
    ];

    for(let i=0;i<7;i++){

        const date =
            new Date(monday);

        date.setDate(
            monday.getDate()+i
        );

        headerRow.innerHTML += `
            <th>
                ${dayNames[i]}
                <br>
                <small>
                    ${formatDate(date)}
                </small>
            </th>
        `;
    }
}

function formatDate(date){
    return date
        .toLocaleDateString(
            "vi-VN",
            {
                day:"2-digit",
                month:"2-digit",
                year:"numeric"
            }
        );
}