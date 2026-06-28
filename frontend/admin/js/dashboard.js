document.addEventListener("DOMContentLoaded", () => {
    // Biểu đồ hình tròn (Trạng thái lớp học phần)
    const ctxStatus = document.getElementById('statusChart');
    if (ctxStatus) {
        new Chart(ctxStatus, {
            type: 'doughnut',
            data: {
                labels: ['Đang mở', 'Kế hoạch', 'Đã khóa'],
                datasets: [{
                    data: [60, 25, 15],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
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


    // Biểu đồ cột (Sinh viên theo khoa)
    const ctxDept = document.getElementById('departmentChart');
    if (ctxDept) {
        new Chart(ctxDept, {
            type: 'bar',
            data: {
                labels: ['CNTT', 'Kinh tế số', 'Điện tử', 'Cơ khí', 'Ngoại ngữ'],
                datasets: [{
                    label: 'Số lượng sinh viên',
                    data: [4500, 3200, 2100, 1500, 1150],
                    backgroundColor: '#3B82F6',
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
});



