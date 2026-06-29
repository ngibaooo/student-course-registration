const API_URL = "http://127.0.0.1:8000/admin";
const currentScriptTag = document.currentScript;
const currentPage = currentScriptTag ? currentScriptTag.getAttribute('data-page') : 'dashboard';


document.addEventListener("DOMContentLoaded", function () {
    // 1. Tự động tải Sidebar (Đi từ admin/pages ra components của admin)
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch('../components/sidebar.html')
            .then(res => res.text())
            .then(data => {
                sidebarContainer.innerHTML = data;
                const activeMenu = document.getElementById(`menu-${currentPage}`);
                if (activeMenu) activeMenu.classList.add('active');
            })
            .catch(err => console.error("Lỗi tải Sidebar:", err));
    }




    // 2. Tự động tải Topbar + Đổ dữ liệu thật + Đồng bộ tiêu đề trang
    const topbarContainer = document.getElementById('topbar-container');
    if (topbarContainer) {
        fetch('../../student/components/topbar.html')
            .then(res => res.text())
            .then(data => {
                topbarContainer.innerHTML = data;




                // --- TỰ ĐỘNG ĐỔ THÔNG TIN ADMIN LÊN TOPBAR ---
                const fullName = localStorage.getItem("full_name") || "Quản trị viên";
                const userId = localStorage.getItem("user_id") || "ADMIN";




                const nameEl = document.getElementById("topbarFullName");
                const idEl = document.getElementById("topbarStudentId");
                const avatarEl = document.getElementById("topbarAvatar");




                if (nameEl) nameEl.textContent = fullName;
                if (idEl) idEl.textContent = userId;
                if (avatarEl && fullName) {
                    // Lấy chữ cái đầu tiên của tên làm Avatar đại diện
                    avatarEl.textContent = fullName.charAt(0).toUpperCase();
                }




                // --- ĐỔI TIÊU ĐỀ CHỮ LỚN GÓC TRÁI THEO TRANG HIỆN TẠI ---
                const titleMap = {
                    'dashboard': 'Dashboard',
                    'student': 'Quản lý sinh viên',
                    'course': 'Quản lý môn học',
                    'semester': 'Quản lý học kỳ',
                    'class': 'Quản lý lớp học phần'
                };
                const titleEl = document.getElementById("pageTitle");
                if (titleEl && titleMap[currentPage]) {
                    titleEl.textContent = titleMap[currentPage];
                }
            })
            .catch(err => console.error("Lỗi tải Topbar:", err));
    }
});




// 3. Hàm xử lý bật/tắt Popup Modals chung (Hỗ trợ cả class CSS và thuộc tính inline style của Topbar)
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        // Ép kiểu hiển thị flex nếu dùng cho popup logout nằm trong topbar component
        if (modalId === 'logout-confirm-modal') {
            modal.style.display = 'flex';
        }
    }
}




function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        // Ẩn hiển thị nếu dùng cho popup logout
        if (modalId === 'logout-confirm-modal') {
            modal.style.display = 'none';
        }
    }
}




// 4. HÀM XỬ LÝ ĐĂNG XUẤT SAU KHI ĐÃ BẤM XÁC NHẬN TRÊN POPUP
async function executeLogout() {
    // Xóa sạch thông tin phiên làm việc cũ lưu trên trình duyệt
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("full_name");
    localStorage.removeItem("user_id");




    // Đóng popup trước khi chuyển trang
    closeModal('logout-confirm-modal');




    // Điều hướng đưa tài khoản quay trở lại trang đăng nhập hệ thống
    window.location.href = "../../student/pages/login.html";
}





