document.addEventListener("DOMContentLoaded", () => {
    fetchDepartments();
    fetchStudents();


    const searchInput = document.getElementById("searchStudentInput");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => fetchStudents(e.target.value.trim()));
    }
});


let departments = [];


async function fetchDepartments() {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/students/departments/list`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        if (response.ok) {
            departments = await response.json();
            const select = document.getElementById("modal_department_id");
            if (select) {
                select.innerHTML = departments.map(d => `<option value="${d.id}">${d.department_name}</option>`).join('');
            }
        }
    } catch (e) {
        console.error("Lỗi fetch departments", e);
    }
}








let currentDeleteId = null;
let currentEditId = null;
let allStudents = [];








async function fetchStudents(keyword = "") {
    const tableBody = document.getElementById("studentTableBody");
    if (!tableBody) return;








    try {
        const token = localStorage.getItem("access_token");
        let url = `${API_URL}/students`;
        if (keyword) url = `${API_URL}/students/search?keyword=${encodeURIComponent(keyword)}`;








        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });








        if (!response.ok) throw new Error("Server trả về mã lỗi: " + response.status);








        const result = await response.json();
       
        let students = [];
        if (Array.isArray(result)) {
            students = result;
        } else if (result && Array.isArray(result.data)) {
            students = result.data;
        } else if (result && typeof result === 'object') {
            students = result.items || result.results || Object.values(result)[0] || [];
        }








        tableBody.innerHTML = "";








        if (!Array.isArray(students) || students.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#6b7280; padding:40px;">Không tìm thấy sinh viên nào trong hệ thống</td></tr>`;
            return;
        }








        allStudents = students;








        students.forEach(sv => {
            const tr = document.createElement("tr");
           
            // Generate status badge
            let statusBadge = `<span class="badge success">Đang hoạt động</span>`;
            if (sv.status && sv.status !== 'ACTIVE') {
                statusBadge = `<span class="badge warning">${sv.status === 'LOCKED' ? 'Bị khóa' : sv.status}</span>`;
            }








            let displayGender = '-';
            if (sv.gender === 'MALE') displayGender = 'Nam';
            else if (sv.gender === 'FEMALE') displayGender = 'Nữ';
            else if (sv.gender === 'OTHER') displayGender = 'Khác';








            tr.innerHTML = `
                <td><strong>${sv.id}</strong></td>
                <td><strong>${sv.full_name}</strong></td>
                <td>${sv.email}</td>
                <td>${displayGender}</td>
                <td>${sv.phone || '-'}</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-icons">
                        <a href="#" onclick="openInfoModal('${sv.id}')" class="action-btn edit" style="background:#3b82f6; color:white;"><i class="fa-solid fa-eye"></i></a>
                        <a href="#" onclick="openEditModal('${sv.id}')" class="action-btn edit"><i class="fa-solid fa-pen"></i></a>
                        ${sv.status === 'LOCKED'
                            ? `<a href="#" onclick="executeUnlock('${sv.id}')" class="action-btn" style="background:#10b981; color:white;"><i class="fa-solid fa-unlock"></i></a>`
                            : `<a href="#" onclick="confirmDelete('${sv.id}')" class="action-btn delete"><i class="fa-solid fa-lock"></i></a>`
                        }
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });








    } catch (error) {
        console.error("Lỗi Fetch:", error);
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#DC2626; padding:40px;">Lỗi kết nối dữ liệu: ${error.message}</td></tr>`;
    }
}








async function saveStudent() {
    const full_name = document.getElementById("modal_fullname").value.trim();
    const email = document.getElementById("modal_email").value.trim();
    const password = document.getElementById("modal_password").value.trim();
    const gender = document.getElementById("modal_gender").value;
    const dob = document.getElementById("modal_dob").value;
    const phone = document.getElementById("modal_phone").value.trim();
    const department_id = document.getElementById("modal_department_id").value;
    const address = document.getElementById("modal_address").value.trim();
    const enrollment_year = document.getElementById("modal_enrollment_year").value;








    if (!full_name || !email || !department_id) {
        alert("Vui lòng điền các thông tin bắt buộc: Họ tên, Email, Khoa!");
        return;
    }
   
    if (!currentEditId && !password) {
        alert("Vui lòng điền mật khẩu cho sinh viên mới!");
        return;
    }








    const payload = {
        full_name: full_name,
        email: email,
        password: password,
        date_of_birth: dob || null,
        gender: gender || null,
        phone: phone || null,
        address: address || null,
        department_id: parseInt(department_id),
        enrollment_year: parseInt(enrollment_year)
    };
   
    let method = "POST";
    let url = `${API_URL}/students`;
   
    if (currentEditId) {
        method = "PUT";
        url = `${API_URL}/students/${currentEditId}`;
    } else {
        payload.password = password;
    }








    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(url, {
            method: method,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });








        const result = await response.json();








        if (!response.ok) {
            const errorMsg = result.detail ? (typeof result.detail === 'object' ? JSON.stringify(result.detail) : result.detail) : "Lỗi không xác định từ Backend";
            throw new Error(errorMsg);
        }








        alert(currentEditId ? "Cập nhật sinh viên thành công!" : "Thêm sinh viên thành công!");
        closeModal('student-modal');
       
        // Reset form
        document.getElementById("modal_fullname").value = "";
        document.getElementById("modal_email").value = "";
        document.getElementById("modal_password").value = "";
        document.getElementById("modal_dob").value = "";
        document.getElementById("modal_phone").value = "";
        document.getElementById("modal_address").value = "";








        fetchStudents();








    } catch (error) {
        alert("Không thể lưu sinh viên: " + error.message);
        console.error("Lỗi Save:", error);
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
        const response = await fetch(`${API_URL}/students/${currentDeleteId}/lock`, {
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








        alert("Đã khóa sinh viên thành công!");
        closeModal('delete-modal');
        currentDeleteId = null;
        fetchStudents();








    } catch (error) {
        alert("Lỗi thực hiện xóa: " + error.message);
        console.error("Lỗi Delete:", error);
    }
}


async function executeUnlock(id) {
    if (!confirm("Bạn có chắc muốn mở khóa sinh viên này?")) return;
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/students/${id}/unlock`, {
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


        alert("Đã mở khóa sinh viên thành công!");
        fetchStudents();
    } catch (error) {
        alert("Lỗi mở khóa: " + error.message);
        console.error("Lỗi Unlock:", error);
    }
}








// Modal Toggle Functions
function openEditModal(id) {
    const sv = allStudents.find(s => s.id == id);
    if (!sv) return;
   
    currentEditId = id;
   
    document.getElementById("modal_fullname").value = sv.full_name || '';
    document.getElementById("modal_email").value = sv.email || '';
   
    const pwdGroup = document.getElementById("modal_password").closest('.form-group');
    if (pwdGroup) pwdGroup.style.display = 'none'; // Backend doesn't support updating password here
   
    document.getElementById("modal_gender").value = sv.gender || 'MALE';
    document.getElementById("modal_dob").value = sv.date_of_birth || '';
    document.getElementById("modal_phone").value = sv.phone || '';
    document.getElementById("modal_department_id").value = sv.department_id || 1;
    document.getElementById("modal_address").value = sv.address || '';
    document.getElementById("modal_enrollment_year").value = sv.enrollment_year || "";
   
    document.querySelector('#student-modal h2').innerText = "Cập nhật sinh viên";
    openModal('student-modal');
}








function openInfoModal(id) {
    const sv = allStudents.find(s => s.id == id);
    if (!sv) return;




    let displayGender = '-';
    if (sv.gender === 'MALE') displayGender = 'Nam';
    else if (sv.gender === 'FEMALE') displayGender = 'Nữ';
    else if (sv.gender === 'OTHER') displayGender = 'Khác';




    let displayStatus = 'Đang hoạt động';
    if (sv.status === 'LOCKED') displayStatus = 'Bị khóa';
    else if (sv.status) displayStatus = sv.status;




    document.getElementById("info_id").innerText = sv.id || '-';
    document.getElementById("info_fullname").innerText = sv.full_name || '-';
    document.getElementById("info_email").innerText = sv.email || '-';
    document.getElementById("info_gender").innerText = displayGender;
    document.getElementById("info_dob").innerText = sv.date_of_birth || '-';
    document.getElementById("info_phone").innerText = sv.phone || '-';
    document.getElementById("info_address").innerText = sv.address || '-';
   
    const dept = departments.find(d => d.id == sv.department_id);
    document.getElementById("info_department").innerText = dept ? dept.department_name : (sv.department_name || sv.department_id || '-');
   
    document.getElementById("info_status").innerText = displayStatus;




    openModal('student-info-modal');
}








function openCreateModal() {
    currentEditId = null;
    document.getElementById("modal_fullname").value = "";
    document.getElementById("modal_email").value = "";
    document.getElementById("modal_password").value = "";
    const pwdGroup = document.getElementById("modal_password").closest('.form-group');
    if (pwdGroup) pwdGroup.style.display = 'block';
    document.getElementById("modal_dob").value = "";
    document.getElementById("modal_phone").value = "";
    document.getElementById("modal_address").value = "";
    document.getElementById("modal_enrollment_year").value = new Date().getFullYear();
    document.querySelector('#student-modal h2').innerText = "Thêm sinh viên";
    openModal('student-modal');
}


function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
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













