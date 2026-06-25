let currentEditId = null;
let currentDeleteId = null;
let allCourses = [];


document.addEventListener("DOMContentLoaded", () => {
    fetchCourses();
    const searchInput = document.getElementById("searchCourseInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => fetchCourses(e.target.value.trim()));
    }
});


async function fetchCourses(keyword = "") {
    const tableBody = document.getElementById("courseTableBody");
    if (!tableBody) return;


    try {
        const token = localStorage.getItem("access_token");
        let url = `${API_URL}/courses`;
        if (keyword) url = `${API_URL}/courses/search?keyword=${encodeURIComponent(keyword)}`;


        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });


        if (!response.ok) throw new Error("Không thể tải danh sách môn học");


        const result = await response.json();
       
        let courses = [];
        if (Array.isArray(result)) {
            courses = result;
        } else if (result && Array.isArray(result.data)) {
            courses = result.data;
        }


        allCourses = courses;
        tableBody.innerHTML = "";


        if (!Array.isArray(courses) || courses.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#6b7280; padding:40px;">Không tìm thấy môn học nào</td></tr>`;
            return;
        }


        courses.forEach(c => {
            const tr = document.createElement("tr");


            let statusBadge = `<span class="badge success">Đang mở</span>`;
            if (c.status && c.status !== 'ACTIVE') {
                statusBadge = `<span class="badge warning">${c.status === 'INACTIVE' ? 'Đã khóa' : c.status}</span>`;
            }


            tr.innerHTML = `
                <td><strong>${c.id}</strong></td>
                <td><strong>${c.course_name}</strong></td>
                <td>${c.credits}</td>
                <td><span style="display:inline-block; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${c.description || ''}">${c.description || 'Không có mô tả'}</span></td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-icons">
                        <a href="#" onclick="openEditModal(${c.id})" class="action-btn edit"><i class="fa-solid fa-pen"></i></a>
                        <a href="#" onclick="confirmDelete(${c.id})" class="action-btn delete"><i class="fa-solid fa-lock"></i></a>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#DC2626; padding:40px;">Lỗi kết nối dữ liệu: ${e.message}</td></tr>`;
    }
}


function openAddModal() {
    currentEditId = null;
    document.getElementById("modal_course_name").value = "";
    document.getElementById("modal_course_credits").value = "";
    document.getElementById("modal_course_description").value = "";
    openModal('course-modal');
}


function openEditModal(id) {
    const course = allCourses.find(c => c.id === id);
    if (!course) return;


    currentEditId = id;
    document.getElementById("modal_course_name").value = course.course_name;
    document.getElementById("modal_course_credits").value = course.credits;
    document.getElementById("modal_course_description").value = course.description || "";
    openModal('course-modal');
}


async function saveCourse() {
    const course_name = document.getElementById("modal_course_name").value.trim();
    const credits = document.getElementById("modal_course_credits").value;
    const description = document.getElementById("modal_course_description").value.trim();


    if (!course_name || !credits) {
        alert("Vui lòng điền tên môn học và số tín chỉ!");
        return;
    }


    const payload = {
        course_name: course_name,
        credits: parseInt(credits),
        description: description || null
    };


    try {
        const token = localStorage.getItem("access_token");
       
        let url = `${API_URL}/courses`;
        let method = "POST";
       
        if (currentEditId) {
            url = `${API_URL}/courses/${currentEditId}`;
            method = "PUT";
        }


        const response = await fetch(url, {
            method: method,
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });


        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.detail || "Lỗi lưu môn học");
        }


        alert("Lưu môn học thành công!");
        closeModal('course-modal');
        fetchCourses();
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
        const response = await fetch(`${API_URL}/courses/${currentDeleteId}/disable`, {
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


        alert("Đã khóa môn học thành công!");
        closeModal('delete-modal');
        currentDeleteId = null;
        fetchCourses();


    } catch (error) {
        alert("Lỗi thực hiện khóa: " + error.message);
        console.error("Lỗi Disable:", error);
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


// Close on outside click
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
}

