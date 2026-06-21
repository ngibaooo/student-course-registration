async function loadTopbar(pageTitle = "") {

    const container =
        document.getElementById("topbar-container");

    const response =
        await fetch("../components/topbar.html");

    container.innerHTML =
        await response.text();

    if (pageTitle) {

        document.getElementById("pageTitle")
            .textContent = pageTitle;

    }

    await loadTopbarUser();
}

async function loadTopbarUser() {

    try {

        const token =
            localStorage.getItem("access_token");

        const response = await fetch(
            "http://127.0.0.1:8000/api/student/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const result =
            await response.json();

        const student =
            result.data;

        document.getElementById("topbarFullName")
            .textContent = student.full_name;

        document.getElementById("topbarStudentId")
            .textContent = `ID: ${student.id}`;

        document.getElementById("topbarAvatar")
            .textContent = getInitials(student.full_name);

    }
    catch(error){

        console.error(error);

    }
}

function getInitials(fullName){

    const words =
        fullName.trim().split(" ");

    if(words.length === 1){
        return words[0][0].toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
}