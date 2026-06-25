document.addEventListener("DOMContentLoaded", async () => {
    const sidebarContainer = document.getElementById("sidebar-container");

    if (sidebarContainer) {
        try {
            const response = await fetch("../components/sidebar.html");
            if (response.ok) {
                sidebarContainer.innerHTML = await response.text();
            }
        } catch (error) {
            console.error("Lỗi tải sidebar:", error);
        }
    }

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".menu-item").forEach(item => {
        item.classList.remove("active");
        const href = item.getAttribute("href");
        if(href === currentPage){
            item.classList.add("active");
        }
    });
});

// Sử dụng Event Delegation: Gắn sự kiện ở cấp document
// Đảm bảo nút luôn hoạt động dù HTML sidebar có bị JS khác ghi đè lại
document.addEventListener("click", (e) => {
    // Tìm xem phần tử bị click (hoặc thẻ cha của nó) có id là logoutBtn không
    const logoutBtn = e.target.closest("#logoutBtn");
    
    if (logoutBtn) {
        e.preventDefault(); // Chặn hành vi thêm dấu # vào URL
        logout();
    }
});

async function logout() {
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