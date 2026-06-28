document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .getElementById("loginForm")
            .addEventListener(
                "submit",
                login
            );
    }
);

document.addEventListener("DOMContentLoaded", () => {

    const token =
        localStorage.getItem("access_token");
    const role = 
        localStorage.getItem("user_role");
<<<<<<< Updated upstream
    if(token){
        if (role === "STUDENT") {
            window.location.href =
                "profile.html";
        }else{
=======

    if(token){

        if (role === "STUDENT") {

            window.location.href =
                "profile.html";
        } 
        else {

            // Tự động chuyển hướng Admin vào đúng trang khi đã có token trước đó
>>>>>>> Stashed changes
            window.location.href =
                "../../admin/pages/dashboard.html";
        }

        return;
    }

});

async function login(event){

    event.preventDefault();

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value
            .trim();

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );

    const loginBtn =
        document.getElementById(
            "loginBtn"
        );

    errorMessage.textContent = "";

    loginBtn.disabled = true;
    loginBtn.textContent = "Đang đăng nhập...";

    try{

        const response =
            await fetch(
                "http://127.0.0.1:8000/api/auth/login",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

        const result =
            await response.json();

        if(!response.ok){

            throw new Error(
                result.detail ||
                "Đăng nhập thất bại"
            );
        }

        const data =
            result.data;

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        localStorage.setItem(
            "user_role",
            data.role
        );

        localStorage.setItem(
            "full_name",
            data.full_name
        );

        localStorage.setItem(
            "user_id",
            data.user_id
        );

        if(data.role === "STUDENT"){

            window.location.href =
                "profile.html";
        }
        else{

            // Đã fix lỗi nhảy sai thư mục cho Admin
            window.location.href =
                "../../admin/pages/dashboard.html";
        }

    }
    catch(error){

        errorMessage.textContent =
            error.message;

        console.error(error);

    }
    finally{

        loginBtn.disabled = false;

        loginBtn.textContent =
            "Đăng nhập";
    }
}