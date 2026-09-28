const API_URL = '/api/students';

// Lấy danh sách sinh viên khi tải trang (Yêu cầu 5 & 7)
document.addEventListener('DOMContentLoaded', fetchStudents);

// Hàm gọi API lấy danh sách sinh viên
async function fetchStudents() {
    try {
        document.getElementById('searchInput').value = '';
        const response = await fetch(API_URL);
        const students = await response.json();
        renderStudentTable(students);
    } catch (error) {
        console.error('Lỗi khi tải danh sách sinh viên:', error);
    }
}

// Hàm tìm kiếm sinh viên (Yêu cầu 3 & 10: @GetMapping("/search"))
async function searchStudents() {
    const keyword = document.getElementById('searchInput').value.trim();
    try {
        const response = await fetch(`${API_URL}/search?keyword=${encodeURIComponent(keyword)}`);
        const students = await response.json();
        renderStudentTable(students);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm sinh viên:', error);
    }
}

// Hàm hiển thị danh sách lên bảng (Đã sửa đúng trường dữ liệu SQL Server)
function renderStudentTable(students) {
    const tableBody = document.getElementById('studentTableBody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td><strong>${student.studentCode || ''}</strong></td>
            <td>${student.fullName || ''}</td>
            <td>${student.email || ''}</td>
            <td>${student.phone || ''}</td>
            <td>${student.className || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editStudent('${student.id}')">
                    <i class="bi bi-pencil-square"></i> Sửa
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id}')">
                    <i class="bi bi-trash"></i> Xóa
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Xử lý sự kiện gửi form: Tự động phân biệt Thêm mới (Yêu cầu 1) và Cập nhật (Yêu cầu 6 & 9)
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('studentId').value;
    const studentData = {
        studentCode: document.getElementById('studentCode').value,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        className: document.getElementById('className').value
    };

    // Nếu có ID thì gọi API /update/{id}, ngược lại gọi API thêm mới
    const url = id ? `${API_URL}/update/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: 'POST', // Cả thêm mới và cập nhật đều dùng POST theo barem điểm
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        if (response.ok) {
            resetForm();
            fetchStudents(); // Tải lại danh sách
        } else {
            alert('Không thể lưu sinh viên! Vui lòng kiểm tra trùng Mã SV hoặc Email.');
        }
    } catch (error) {
        console.error('Lỗi khi lưu sinh viên:', error);
    }
});

// Hàm lấy thông tin sinh viên theo ID đổ lên form để sửa (Yêu cầu 4 & 9)
async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (response.ok) {
            const student = await response.json();
            document.getElementById('studentId').value = student.id;
            document.getElementById('studentCode').value = student.studentCode || '';
            document.getElementById('fullName').value = student.fullName || '';
            document.getElementById('email').value = student.email || '';
            document.getElementById('phone').value = student.phone || '';
            document.getElementById('className').value = student.className || '';

            document.getElementById('formTitle').innerText = 'Cập nhật Sinh viên';
            document.getElementById('submitBtn').innerText = 'Lưu Cập nhật';
            document.getElementById('submitBtn').classList.replace('btn-primary', 'btn-warning');
            document.getElementById('cancelBtn').classList.remove('d-none');
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin sinh viên:', error);
    }
}

// Hàm xóa sinh viên theo ID (Yêu cầu 2 & 8: Bắt buộc dùng POST /delete/{id})
async function deleteStudent(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) return;

    try {
        const response = await fetch(`${API_URL}/delete/${id}`, {
            method: 'POST'
        });

        if (response.ok) {
            fetchStudents(); // Tải lại danh sách sau khi xóa
        } else {
            alert('Không thể xóa sinh viên!');
        }
    } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
    }
}

// Đặt lại form về trạng thái Thêm mới
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('formTitle').innerText = 'Thêm Sinh viên Mới';
    document.getElementById('submitBtn').innerText = 'Thêm Sinh viên';
    document.getElementById('submitBtn').classList.replace('btn-warning', 'btn-primary');
    document.getElementById('cancelBtn').classList.add('d-none');
}