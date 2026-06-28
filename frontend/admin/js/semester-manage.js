let currentEditId = null;
let currentToggleId = null;
let currentToggleAction = null; // 'open' or 'close'
let allSemesters = [];


document.addEventListener("DOMContentLoaded", () => {
    fetchSemesters();
    const searchInput = document.getElementById("searchSemesterInput");
    if (searchInput) {
        // Local search filter for semesters since there is no backend search endpoint for semesters
        searchInput.addEventListener("input", (e) => filterSemesters(e.target.value.trim()));
    }
});


async function fetchSemesters() {
    const tableBody = document.getElementById("semesterTableBody");
    if (!tableBody) return;


    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/semesters`, {
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });


        if (!response.ok) throw new Error("Không thể tải danh sách học kỳ");


        const result = await response.json();
       
        let semesters = [];
        if (Array.isArray(result)) {
            semesters = result;
        } else if (result && Array.isArray(result.data)) {
            semesters = result.data;
        }


        allSemesters = semesters;
        renderSemesters(allSemesters);
    } catch (e) {
        console.error(e);
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#DC2626; padding:40px;">Lỗi kết nối dữ liệu: ${e.message}</td></tr>`;
    }
}


function filterSemesters(keyword) {
    if (!keyword) {
        renderSemesters(allSemesters);
        return;
    }
    const lowerKeyword = keyword.toLowerCase();
    const filtered = allSemesters.filter(s =>
        (s.semester_name && s.semester_name.toLowerCase().includes(lowerKeyword)) ||
        (s.academic_year && s.academic_year.toLowerCase().includes(lowerKeyword))
    );
    renderSemesters(filtered);
}


function renderSemesters(semesters) {
    const tableBody = document.getElementById("semesterTableBody");
    tableBody.innerHTML = "";


    if (!Array.isArray(semesters) || semesters.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="8" style="text-align:center; color:#6b7280; padding:40px;">Không tìm thấy học kỳ nào</td></tr>`;
        return;
    }


    semesters.forEach(s => {
        const tr = document.createElement("tr");


        let statusBadge = `<span class="badge success">Đang mở</span>`;
        if (s.status === 'PLANNED') statusBadge = `<span class="badge" style="background:#E5E7EB; color:#374151;">Kế hoạch</span>`;
        else if (s.status === 'ACTIVE') statusBadge = `<span class="badge success">Đang mở</span>`;
        else if (s.status === 'CLOSED') statusBadge = `<span class="badge danger">Đã đóng</span>`;
        else statusBadge = `<span class="badge warning">${s.status}</span>`;
       
        // Format datetime purely for display
        const formatDT = (dt) => {
            if(!dt) return '';
            const d = new Date(dt);
            return d.toLocaleString('vi-VN', {day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'});
        };


        const isClosed = s.status === 'CLOSED';
        const toggleIcon = isClosed ? "fa-lock-open" : "fa-lock";
        const toggleAction = isClosed ? "open" : "close";
        const toggleTitle = isClosed ? "Mở học kỳ" : "Đóng học kỳ";


        tr.innerHTML = `
            <td><strong>${s.id}</strong></td>
            <td><strong>${s.semester_name}</strong></td>
            <td>${s.academic_year}</td>
            <td>${s.start_date}</td>
            <td>${s.end_date}</td>
            <td style="font-size: 13px;">
                <div><span style="color:#16A34A;">Mở:</span> ${formatDT(s.registration_open_date)}</div>
                <div><span style="color:#DC2626;">Đóng:</span> ${formatDT(s.registration_close_date)}</div>
            </td>
            <td>${statusBadge}</td>
            <td>
                <div class="action-icons">
                    <a href="#" onclick="openEditModal(${s.id})" class="action-btn edit" title="Sửa"><i class="fa-solid fa-pen"></i></a>
                    <a href="#" onclick="confirmToggleStatus(${s.id}, '${toggleAction}')" class="action-btn ${isClosed ? 'success' : 'delete'}" title="${toggleTitle}"><i class="fa-solid ${toggleIcon}"></i></a>
                </div>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}


function formatDatetimeForInput(dtStr) {
    if (!dtStr) return "";
    const dt = new Date(dtStr);
    // Add timezone offset to get correct local time string for input format
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(dt - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
}


function openAddModal() {
    currentEditId = null;
    document.getElementById("modal_sem_name").value = "";
    document.getElementById("modal_sem_year").value = "";
    document.getElementById("modal_sem_start").value = "";
    document.getElementById("modal_sem_end").value = "";
    document.getElementById("modal_reg_open").value = "";
    document.getElementById("modal_reg_close").value = "";
    document.getElementById("modal_reg_cancel").value = "";
    openModal('semester-modal');
}


function openEditModal(id) {
    const sem = allSemesters.find(s => s.id === id);
    if (!sem) return;


    currentEditId = id;
    document.getElementById("modal_sem_name").value = sem.semester_name;
    document.getElementById("modal_sem_year").value = sem.academic_year;
    document.getElementById("modal_sem_start").value = sem.start_date;
    document.getElementById("modal_sem_end").value = sem.end_date;
   
    document.getElementById("modal_reg_open").value = formatDatetimeForInput(sem.registration_open_date);
    document.getElementById("modal_reg_close").value = formatDatetimeForInput(sem.registration_close_date);
    document.getElementById("modal_reg_cancel").value = formatDatetimeForInput(sem.cancel_deadline);


    openModal('semester-modal');
}


async function saveSemester() {
    const name = document.getElementById("modal_sem_name").value.trim();
    const year = document.getElementById("modal_sem_year").value.trim();
    const start = document.getElementById("modal_sem_start").value;
    const end = document.getElementById("modal_sem_end").value;
   
    let regOpen = document.getElementById("modal_reg_open").value;
    let regClose = document.getElementById("modal_reg_close").value;
    let regCancel = document.getElementById("modal_reg_cancel").value;


    if (!name || !year || !start || !end || !regOpen || !regClose || !regCancel) {
        alert("Vui lòng điền đầy đủ tất cả thông tin!");
        return;
    }


    if (regOpen.length === 16) regOpen += ":00";
    if (regClose.length === 16) regClose += ":00";
    if (regCancel.length === 16) regCancel += ":00";


    const payload = {
        semester_name: name,
        academic_year: year,
        start_date: start,
        end_date: end,
        registration_open_date: regOpen,
        registration_close_date: regClose,
        cancel_deadline: regCancel
    };


    try {
        const token = localStorage.getItem("access_token");
       
        let url = `${API_URL}/semesters`;
        let method = "POST";
       
        if (currentEditId) {
            url = `${API_URL}/semesters/${currentEditId}`;
            method = "PUT";
        }


        const response = await fetch(url, {
            method: method,
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });


        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.detail ? JSON.stringify(result.detail) : "Lỗi lưu học kỳ");
        }


        alert("Lưu học kỳ thành công!");
        closeModal('semester-modal');
        fetchSemesters();
    } catch (e) {
        alert(e.message);
    }
}


function confirmToggleStatus(id, action) {
    currentToggleId = id;
    currentToggleAction = action;
   
    const isOpening = action === 'open';
    document.getElementById("statusModalTitle").textContent = isOpening ? "Mở học kỳ?" : "Đóng học kỳ?";
    document.getElementById("statusModalText").textContent = isOpening
        ? "Bạn có chắc chắn muốn mở lại học kỳ này không? Sinh viên sẽ có thể tiếp tục thao tác."
        : "Bạn có chắc chắn muốn đóng học kỳ này không? Mọi chức năng đăng ký sẽ bị khóa.";
       
    openModal('status-modal');
}


async function executeToggleStatus() {
    if (!currentToggleId || !currentToggleAction) return;


    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${API_URL}/semesters/${currentToggleId}/${currentToggleAction}`, {
            method: "PATCH",
            headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
        });


        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.detail || "Yêu cầu bị từ chối từ Server");
        }


        alert("Thay đổi trạng thái thành công!");
        closeModal('status-modal');
        currentToggleId = null;
        currentToggleAction = null;
        fetchSemesters();


    } catch (error) {
        alert("Lỗi thực hiện thay đổi: " + error.message);
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
