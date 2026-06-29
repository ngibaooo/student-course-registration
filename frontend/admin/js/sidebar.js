// Sidebar logic is handled by main.js


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

