document.addEventListener("DOMContentLoaded", async () => {

    const sidebarContainer =
        document.getElementById("sidebar-container");

    const response = await fetch(
        "../components/sidebar.html"
    );

    const html = await response.text();

    sidebarContainer.innerHTML = html;

    const currentPage =
        window.location.pathname.split("/").pop();

    document
        .querySelectorAll(".menu-item")
        .forEach(item => {

            item.classList.remove("active");

            const href = item.getAttribute("href");

            if (href === currentPage) {
                item.classList.add("active");
            }
        });
});