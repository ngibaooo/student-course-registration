// document.addEventListener("DOMContentLoaded", async () => {

//     const sidebarContainer =
//         document.getElementById("sidebar-container");

//     const response = await fetch(
//         "../components/sidebar.html"
//     );

//     const html = await response.text();

//     sidebarContainer.innerHTML = html;

//     const currentPage =
//         window.location.pathname.split("/").pop();

//     document
//         .querySelectorAll(".menu-item")
//         .forEach(item => {

//             item.classList.remove("active");

//             const href = item.getAttribute("href");

//             if (href === currentPage) {
//                 item.classList.add("active");
//             }
//         });
// });
document.addEventListener("DOMContentLoaded", async () => {

    const sidebarContainer =
        document.getElementById("sidebar-container");

    const response =
        await fetch("../components/sidebar.html");

    sidebarContainer.innerHTML =
        await response.text();

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.classList.remove("active");

            const href =
                item.getAttribute("href");

            if(href === currentPage){
                item.classList.add("active");
            }
        });

    // gắn sự kiện logout
    const logoutBtn =
        document.getElementById("logoutBtn");

    if(logoutBtn){
        logoutBtn.addEventListener(
            "click",
            logout
        );
    }

});

async function logout(){

    const confirmLogout =
        confirm("Bạn có chắc muốn đăng xuất?");

    if(!confirmLogout){
        return;
    }

    try{

        const token =
            localStorage.getItem(
                "access_token"
            );

        await fetch(
            "http://127.0.0.1:8000/api/auth/logout",
            {
                method: "POST",

                headers:{
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    }
    catch(error){

        console.error(
            "Logout API error:",
            error
        );

    }
    finally{

        // xóa toàn bộ dữ liệu localStorage

        localStorage.removeItem(
            "access_token"
        );

        localStorage.removeItem(
            "user_id"
        );

        localStorage.removeItem(
            "user_role"
        );

        localStorage.removeItem(
            "full_name"
        );

        localStorage.removeItem(
            "username"
        );

        // quay về login

        window.location.href =
            "../pages/login.html";
    }
}