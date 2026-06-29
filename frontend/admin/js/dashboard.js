document.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem("access_token");
        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };


        // Fetch all required data
        const [studentsRes, coursesRes, semestersRes, classesRes] = await Promise.all([
            fetch(`${API_URL}/students`, { headers }),
            fetch(`${API_URL}/courses`, { headers }),
            fetch(`${API_URL}/semesters`, { headers }),
            fetch(`${API_URL}/course-sections`, { headers })
        ]);


        const students = await studentsRes.json();
        const courses = await coursesRes.json();
        const semesters = await semestersRes.json();
        const classes = await classesRes.json();


        // Populate summary numbers
        document.getElementById('totalStudents').textContent = students.length || 0;
        document.getElementById('totalCourses').textContent = courses.length || 0;
        document.getElementById('totalSemesters').textContent = semesters.length || 0;
        document.getElementById('totalClasses').textContent = classes.length || 0;


        // Populate recent classes table (last 5)
        const recentClassesTable = document.getElementById('recentClassesTable');
        if (classes.length > 0) {
            recentClassesTable.innerHTML = "";
            classes.slice(-5).reverse().forEach(c => {
                const tr = document.createElement("tr");
                tr.style.borderBottom = "1px solid #e5e7eb";
                tr.innerHTML = `
                    <td style="padding: 18px 15px;">HP${c.course_id}.${c.id}</td>
                    <td style="padding: 18px 15px;">Môn ${c.course_id}</td>
                    <td style="padding: 18px 15px;">GV${c.lecturer_id}</td>
                    <td style="padding: 18px 15px;">${c.registered_students || 0}/${c.maximum_students}</td>
                    <td style="padding: 18px 15px; text-align: center;">
                        <a href="class-manage.html" style="background:#3b82f6; color:white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 13px;"><i class="fa-solid fa-eye"></i> Xem</a>
                    </td>
                `;
                recentClassesTable.appendChild(tr);
            });
        } else {
            recentClassesTable.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px;">Chưa có lớp học phần nào</td></tr>`;
        }


        // Prepare data for charts
        let activeClasses = 0, inactiveClasses = 0, plannedClasses = 0;
        classes.forEach(c => {
            if (c.status === 'ACTIVE') activeClasses++;
            else if (c.status === 'INACTIVE') inactiveClasses++;
            else plannedClasses++;
        });


        let male = 0, female = 0, other = 0;
        students.forEach(s => {
            if (s.gender === 'MALE') male++;
            else if (s.gender === 'FEMALE') female++;
            else other++;
        });


        // Status Chart
        const ctxStatus = document.getElementById('statusChart');
        if (ctxStatus) {
            new Chart(ctxStatus, {
                type: 'doughnut',
                data: {
                    labels: ['Đang mở', 'Đã khóa', 'Khác'],
                    datasets: [{
                        data: [activeClasses, inactiveClasses, plannedClasses],
                        backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: 'Trạng thái Lớp Học Phần', font: { size: 16 } }
                    }
                }
            });
        }


        // Gender Chart
        const ctxGender = document.getElementById('genderChart');
        if (ctxGender) {
            new Chart(ctxGender, {
                type: 'pie',
                data: {
                    labels: ['Nam', 'Nữ', 'Khác'],
                    datasets: [{
                        data: [male, female, other],
                        backgroundColor: ['#3B82F6', '#EC4899', '#9CA3AF'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: 'Tỉ lệ Giới Tính Sinh Viên', font: { size: 16 } }
                    }
                }
            });
        }


    } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
    }
});



