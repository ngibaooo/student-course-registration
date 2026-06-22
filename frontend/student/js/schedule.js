const TOTAL_PERIODS = 10;
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

    await loadTopbar("Lịch học cá nhân");

    await loadSchedule();

});
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
// function renderSchedule(){

//     const tbody =
//         document.getElementById("scheduleBody");

//     tbody.innerHTML = "";

//     for(let period = 1; period <= TOTAL_PERIODS; period++){

//         let row = `<tr>`;

//         row += `
//             <td class="period-cell">
//                 Tiết ${period}
//             </td>
//         `;

//         for(let day = 2; day <= 7; day++){

//             const course =
//                 schedules.find(item =>
//                     item.schedule_day === day &&
//                     period >= item.start_period &&
//                     period <= item.end_period
//                 );

//             if(course){

//                 row += `
//                     <td class="schedule-cell">

//                         <div class="course-block">

//                             <div class="course-name">
//                                 ${course.course_name}
//                             </div>

//                             <div class="classroom">
//                                 ${course.classroom}
//                             </div>

//                         </div>

//                     </td>
//                 `;
//             }
//             else{

//                 row += `
//                     <td class="schedule-cell"></td>
//                 `;
//             }
//         }

//         row += `</tr>`;

//         tbody.innerHTML += row;
//     }
// }
function renderSchedule(){

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

               

            </td>
        `;

        for(let day = 2; day <= 8; day++){

            const course =
                schedules.find(item =>

                    item.schedule_day === day &&

                    item.start_period === ca.start &&

                    item.end_period === ca.end

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