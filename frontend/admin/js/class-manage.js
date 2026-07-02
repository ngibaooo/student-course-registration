let currentEditId = null;
let currentDeleteId = null;
let allClasses = [];

let currentStudents = [];




document.addEventListener("DOMContentLoaded", async () => {
    await fetchDropdowns();
    await fetchClasses();
   
    const searchInput = document.getElementById("searchClassInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => filterClasses(e.target.value.trim()));
    }
    const searchStudent = document.getElementById("searchStudentInClass");

        if(searchStudent){

            searchStudent.addEventListener("input", function(){

                const keyword = this.value.trim().toLowerCase();

                if(keyword===""){

                    renderStudentTable(currentStudents);
                    return;
                }

                const filtered = currentStudents.filter(s=>{

                    return (
                        s.id.toString().includes(keyword) ||
                        s.full_name.toLowerCase().includes(keyword)
                    );

                });

                renderStudentTable(filtered);

            });

        }
});




async function fetchDropdowns() {
    try {
        const token = localStorage.getItem("access_token");
        const headers = { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" };
       
        const [courseRes, lecturerRes, semesterRes] = await Promise.all([
            fetch(`${API_URL}/course-sections/dropdown/course`, { headers }),
            fetch(`${API_URL}/course-sections/dropdown/lecturer`, { headers }),
            fetch(`${API_URL}/course-sections/dropdown/semester`, { headers })
        ]);
       
        const courses = courseRes.ok ? await courseRes.json() : [];
        const lecturers = lecturerRes.ok ? await lecturerRes.json() : [];
        const semesters = semesterRes.ok ? await semesterRes.json() : [];
       
        const courseSelect = document.getElementById("modal_class_course");
        if (courseSelect) {
            courses.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c.id;
                opt.textContent = `${c.id} - ${c.course_name}`;
                courseSelect.appendChild(opt);
            });
        }
       
        const lecturerSelect = document.getElementById("modal_class_teacher");
        if (lecturerSelect) {
            lecturers.forEach(l => {
                const opt = document.createElement("option");
                opt.value = l.id;
                opt.textContent = `${l.id} - ${l.full_name}`;
                lecturerSelect.appendChild(opt);
            });
        }
       
        const semesterSelect = document.getElementById("modal_class_semester");
        if (semesterSelect) {
            semesters.forEach(s => {
                const opt = document.createElement("option");
                opt.value = s.id;
                opt.textContent = `${s.id} - ${s.semester_name} (${s.academic_year})`;
                semesterSelect.appendChild(opt);
            });
        }
    } catch (e) {
        console.error("Lỗi tải dữ liệu dropdown:", e);
    }
}




async function fetchClasses() {
    const tableBody = document.getElementById("classTableBody");
    if (!tableBody) return;




    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/course-sections`, {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });




        if (!response.ok) throw new Error("Không thể tải danh sách lớp học phần");




        const result = await response.json();
       
        let classes = [];
        if (Array.isArray(result)) {
            classes = result;
        } else if (result && Array.isArray(result.data)) {
            classes = result.data;
        }




        allClasses = classes;
        renderClasses(allClasses);
    } catch (e) {
        console.error(e);
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#DC2626; padding:40px;">Lỗi kết nối dữ liệu: ${e.message}</td></tr>`;
    }
}




function filterClasses(keyword) {
    if (!keyword) {
        renderClasses(allClasses);
        return;
    }
    const lowerKeyword = keyword.toLowerCase();
    const filtered = allClasses.filter(c =>
        (c.course_name && c.course_name.toLowerCase().includes(lowerKeyword)) ||
        (c.lecturer_name && c.lecturer_name.toLowerCase().includes(lowerKeyword)) ||
        (c.semester_name && c.semester_name.toLowerCase().includes(lowerKeyword)) ||
        (c.id.toString().includes(lowerKeyword))
    );
    renderClasses(filtered);
}




function renderClasses(classes) {
    const tableBody = document.getElementById("classTableBody");
    tableBody.innerHTML = "";




    if (!Array.isArray(classes) || classes.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#6b7280; padding:40px;">Không tìm thấy lớp học phần nào</td></tr>`;
        return;
    }




    classes.forEach(c => {
        const tr = document.createElement("tr");




        let statusBadge = `<span class="badge success">Đang mở</span>`;
        if (c.status && c.status !== 'ACTIVE') {
            statusBadge = `<span class="badge warning">${c.status === 'INACTIVE' ? 'Đã khóa' : c.status}</span>`;
        }




        tr.innerHTML = `
            <td><strong>${c.id}</strong></td>
            <td>${c.course_name || 'HP' + c.course_id}</td>
            <td>${c.lecturer_name || 'GV' + c.lecturer_id}</td>
            <td>${c.semester_name || 'HK' + c.semester_id}</td>
            <td>Thứ ${c.schedule_day} (${c.start_period}-${c.end_period})</td>
            <td>${c.classroom}</td>
            <td>${c.registered_students || 0}/${c.maximum_students}</td>
            <td>${statusBadge}</td>
            <td>
                <div class="action-icons">
                    <a href="#"
                    onclick="openDetailModal(${c.id})"
                    class="action-btn view">
                        <i class="fa-solid fa-eye"></i>
                    </a>

                    <a href="#"
                    onclick="openEditModal(${c.id})"
                    class="action-btn edit">
                        <i class="fa-solid fa-pen"></i>
                    </a>

                    ${
                        c.status === 'INACTIVE'
                        ? `
                        <a href="#"
                        onclick="executeEnable(${c.id})"
                        class="action-btn"
                        style="background:#10b981;color:white;">
                            <i class="fa-solid fa-unlock"></i>
                        </a>`
                        : `
                        <a href="#"
                        onclick="confirmDelete(${c.id})"
                        class="action-btn delete">
                            <i class="fa-solid fa-lock"></i>
                        </a>`
                    }

                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}




function openAddModal() {
    currentEditId = null;
    document.getElementById("modal_class_course").value = "";
    document.getElementById("modal_class_teacher").value = "";
    document.getElementById("modal_class_semester").value = "";
    document.getElementById("modal_class_room").value = "";
    document.getElementById("modal_class_day").value = "2";
    document.getElementById("modal_class_max").value = "";
    document.getElementById("modal_class_start").value = "";
    document.getElementById("modal_class_end").value = "";
    openModal('class-modal');
}




function openEditModal(id) {
    const cls = allClasses.find(c => c.id === id);
    if (!cls) return;




    currentEditId = id;
    document.getElementById("modal_class_course").value = cls.course_id;
    document.getElementById("modal_class_teacher").value = cls.lecturer_id;
    document.getElementById("modal_class_semester").value = cls.semester_id;
    document.getElementById("modal_class_room").value = cls.classroom;
    document.getElementById("modal_class_day").value = cls.schedule_day;
    document.getElementById("modal_class_max").value = cls.maximum_students;
    document.getElementById("modal_class_start").value = cls.start_period;
    document.getElementById("modal_class_end").value = cls.end_period;
   
    openModal('class-modal');
}




async function saveClass() {
    const courseId = document.getElementById("modal_class_course").value;
    const lecturerId = document.getElementById("modal_class_teacher").value;
    const semesterId = document.getElementById("modal_class_semester").value;
    const classroom = document.getElementById("modal_class_room").value.trim();
    const scheduleDay = document.getElementById("modal_class_day").value;
    const maxStudents = document.getElementById("modal_class_max").value;
    const startPeriod = document.getElementById("modal_class_start").value;
    const endPeriod = document.getElementById("modal_class_end").value;




    if (!courseId || !lecturerId || !semesterId || !classroom || !scheduleDay || !maxStudents || !startPeriod || !endPeriod) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }




    const payload = {
        classroom: classroom,
        schedule_day: parseInt(scheduleDay),
        start_period: parseInt(startPeriod),
        end_period: parseInt(endPeriod),
        maximum_students: parseInt(maxStudents),
        semester_id: parseInt(semesterId),
        course_id: parseInt(courseId),
        lecturer_id: parseInt(lecturerId)
    };




    try {
        const token = localStorage.getItem("access_token");
       
        let url = `${API_URL}/course-sections`;
        let method = "POST";
       
        if (currentEditId) {
            url = `${API_URL}/course-sections/${currentEditId}`;
            method = "PUT";
        }




        const response = await fetch(url, {
            method: method,
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });




        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.detail ? JSON.stringify(result.detail) : "Lỗi lưu lớp học phần");
        }




        alert("Lưu lớp học phần thành công!");
        closeModal('class-modal');
        fetchClasses();
    } catch (e) {
        alert(e.message);
    }
}




function confirmDelete(id) {
    currentDeleteId = id;
    openModal('delete-modal');
}




async function executeDelete() {
    if (!currentDeleteId) return;




    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/course-sections/${currentDeleteId}/disable`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });




        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.detail || "Yêu cầu khóa bị từ chối từ Server");
        }




        alert("Đã khóa lớp học phần thành công!");
        closeModal('delete-modal');
        currentDeleteId = null;
        fetchClasses();




    } catch (error) {
        alert("Lỗi thực hiện khóa: " + error.message);
    }
}




async function executeEnable(id) {
    if (!confirm("Bạn có chắc muốn mở khóa lớp học phần này?")) return;
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/course-sections/${id}/enable`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });


        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.detail || "Yêu cầu mở khóa bị từ chối từ Server");
        }


        alert("Đã mở khóa lớp học phần thành công!");
        fetchClasses();
    } catch (error) {
        alert("Lỗi mở khóa: " + error.message);
    }
}




// Modal Toggle Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
}




function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}




window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}
async function openDetailModal(sectionId) {

    try {

        const token = localStorage.getItem("access_token");

        const response = await fetch(
            `${API_URL}/course-sections/${sectionId}/students`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            throw new Error("Không lấy được dữ liệu");

        }

        // const data = await response.json();

        // renderDetail(data);

        // openModal("detail-modal");
        const data = await response.json();

        currentStudents = data.students;

        renderDetail(data);

        document.getElementById("searchStudentInClass").value = "";

        openModal("detail-modal");

    }
    catch(e){

        alert(e.message);

    }

}
function renderDetail(data){

    const section = data.section;
    const students = data.students;

    document.getElementById("detailInfo").innerHTML = `
        <div class="detail-card">

            <p><strong>Môn học:</strong> ${section.course_name}</p>

            <p><strong>Giảng viên:</strong> ${section.lecturer_name}</p>

            <p><strong>Học kỳ:</strong> ${section.semester_name}</p>

            <p><strong>Phòng:</strong> ${section.classroom}</p>

            <p><strong>Lịch:</strong>
                Thứ ${section.schedule_day}
                (${section.start_period}-${section.end_period})
            </p>

            <p><strong>Sĩ số:</strong>
                ${section.registered_students}/${section.maximum_students}
            </p>

        </div>
    `;

    // const body = document.getElementById("studentDetailBody");

    // body.innerHTML = "";

    // if(students.length===0){

    //     body.innerHTML=`
    //         <tr>

    //             <td colspan="6"
    //                 style="text-align:center">

    //                 Chưa có sinh viên đăng ký

    //             </td>

    //         </tr>
    //     `;

    //     return;

    // }

    // students.forEach(s=>{

    //     body.innerHTML += `
    //         <tr>

    //             <td>${s.id}</td>

    //             <td>${s.full_name}</td>

    //             <td>${s.email}</td>

    //             <td>${s.phone}</td>

    //             <td>${s.department_name ?? ""}</td>

    //             <td>${formatDate(s.registration_date)}</td>

    //         </tr>
    //     `;

    // });
    renderStudentTable(students);
}
function formatDate(date){

    if(!date) return "";

    return new Date(date).toLocaleString("vi-VN");

}
function renderStudentTable(students){

    const body = document.getElementById("studentDetailBody");

    body.innerHTML = "";

    if(students.length===0){

        body.innerHTML=`
            <tr>
                <td colspan="6" style="text-align:center">
                    Không tìm thấy sinh viên
                </td>
            </tr>
        `;

        return;
    }

    students.forEach(s=>{

        body.innerHTML += `
            <tr>

                <td>${s.id}</td>

                <td>${s.full_name}</td>

                <td>${s.email}</td>

                <td>${s.phone}</td>

                <td>${s.department_name ?? ""}</td>

                <td>${formatDate(s.registration_date)}</td>

            </tr>
        `;

    });

}