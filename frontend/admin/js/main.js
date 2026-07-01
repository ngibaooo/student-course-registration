const API_URL = "http://127.0.0.1:8000/admin";
const currentScriptTag = document.currentScript;
const currentPage = currentScriptTag ? currentScriptTag.getAttribute('data-page') : 'dashboard';

const originalFetch = window.fetch.bind(window);
window.fetch = async function(resource, options = {}) {
    const url = resource instanceof Request ? resource.url : String(resource);
    const isApiRequest = url.startsWith('http://127.0.0.1:8000') || url.startsWith('http://localhost:8000');

    if (!isApiRequest) {
        return originalFetch(resource, options);
    }

    const token = localStorage.getItem("access_token");
    const headers = new Headers(options.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const mergedOptions = {
        ...options,
        headers
    };

    const response = await originalFetch(resource, mergedOptions);

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_role");
        localStorage.removeItem("full_name");
        localStorage.removeItem("username");
        window.location.href = "../../student/pages/login.html";
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }

    return response;
};

document.addEventListener("DOMContentLoaded", function () {
    // 1. Tự động tải Sidebar (Đi từ admin/pages ra components của admin)
    const sidebarContainer = document.getElementById('sidebar-container');
    if (sidebarContainer) {
        fetch('../components/sidebar.html')
            .then(res => res.text())
            .then(data => {
                sidebarContainer.innerHTML = data;

                // Active menu hiện tại
                const activeMenu = document.getElementById(`menu-${currentPage}`);
                if (activeMenu) {
                    activeMenu.classList.add("active");
                }

                const group = sidebarContainer.querySelector(".menu-group");
                const toggle = sidebarContainer.querySelector(".menu-toggle");

                if(group && toggle){

                    // Nếu đang ở bất kỳ trang con nào của Quản lý đăng ký
                    if(
                        currentPage === "registration-manage" ||
                        currentPage === "registration-student-history" ||
                        currentPage === "registration-log" 
                    ){

                        // Mở submenu
                        group.classList.add("open");

                        // Active menu cha
                        toggle.classList.add("active");
                    }

                    toggle.addEventListener("click",(e)=>{

                        e.preventDefault();

                        group.classList.toggle("open");

                    });

                }
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
                    'class': 'Quản lý lớp học phần',
                    'registration-manage': "Quản lý đăng kí học phần",
                    'registration-student-history': "Quản lý đăng kí học phần",
                    'registration-log': "Quản lý đăng kí học phần",
                };
                const titleEl = document.getElementById("pageTitle");
                if (titleEl && titleMap[currentPage]) {
                    titleEl.textContent = titleMap[currentPage];
                }
            })
            .catch(err => console.error("Lỗi tải Topbar:", err));
    }


    // Global listener for logout button
    document.addEventListener("click", (e) => {
        const logoutBtn = e.target.closest("#logoutBtn");
        if (logoutBtn) {
            e.preventDefault();
            if (typeof window.logout === "function") {
                window.logout();
            }
        }
    });
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








// 4. HÀM XỬ LÝ ĐĂNG XUẤT
window.logout = async function() {
    const confirmLogout = confirm("Bạn có chắc muốn đăng xuất?");
    if (!confirmLogout) return;


    try {
        const token = localStorage.getItem("access_token");
        if (token) {
            await fetch("http://127.0.0.1:8000/api/auth/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
    } catch(error) {
        console.error("Logout API error:", error);
    } finally {
        // Xóa toàn bộ dữ liệu localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_role");
        localStorage.removeItem("full_name");
        localStorage.removeItem("username");


        // Quay về login
        window.location.href = "../../student/pages/login.html";
    }
}













