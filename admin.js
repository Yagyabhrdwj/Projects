let videoStream = null;
let isSubmitting = false;

function showLoading() {
    document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : 'success'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

async function loadStatistics() {
    try {
        const response = await fetch('/admin/statistics');
        if (!response.ok) {
            throw new Error('Failed to load statistics');
        }
        const data = await response.json();
        
        document.getElementById('totalStudents').textContent = data.total_students;
        document.getElementById('todayAttendance').textContent = data.today_attendance;
        document.getElementById('totalAttendance').textContent = data.total_attendance;
    } catch (err) {
        showToast('Error loading statistics: ' + err.message, true);
    }
}

async function loadStudentsList() {
    try {
        const response = await fetch('/admin/students');
        if (!response.ok) {
            throw new Error('Failed to load students list');
        }
        const data = await response.json();
        const container = document.getElementById('studentsList');
        
        if (data.students && data.students.length > 0) {
            container.innerHTML = data.students
                .map(student => `
                    <div class="student-entry">
                        <span>
                            <i class="fas fa-user"></i>
                            ${student.name}
                        </span>
                        <div class="student-actions">
                            <button onclick="viewAttendance('${student.name}')" class="action-btn view-btn">
                                <i class="fas fa-calendar-alt"></i>
                            </button>
                            <button onclick="removeStudent('${student.name}')" class="delete-btn">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `)
                .join('');
        } else {
            container.innerHTML = '<p class="empty-state">No students registered</p>';
        }
    } catch (err) {
        showToast('Error loading students list: ' + err.message, true);
    }
}

function handleFileSelect(input) {
    const file = input.files[0];
    const addFaceBtn = document.getElementById('addFaceBtn');
    const personName = document.getElementById('personName');
    
    // Enable/disable submit button based on both fields being filled
    addFaceBtn.disabled = !(file && personName.value.trim());
    
    if (file) {
        // Show preview
        const preview = document.createElement('img');
        preview.className = 'image-preview';
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
        const container = input.parentElement;
        const existingPreview = container.querySelector('.image-preview');
        if (existingPreview) {
            existingPreview.remove();
        }
        container.appendChild(preview);
    }
}

// Add input event listener for person name
document.getElementById('personName')?.addEventListener('input', function() {
    const addFaceBtn = document.getElementById('addFaceBtn');
    const fileInput = document.getElementById('newFaceImage');
    addFaceBtn.disabled = !(fileInput.files[0] && this.value.trim());
});

async function addNewFace() {
    if (isSubmitting) return;
    
    const fileInput = document.getElementById('newFaceImage');
    const nameInput = document.getElementById('personName');
    const addFaceBtn = document.getElementById('addFaceBtn');
    
    if (!fileInput.files.length || !nameInput.value.trim()) {
        showToast('Please select an image and enter a name', true);
        return;
    }

    isSubmitting = true;
    addFaceBtn.disabled = true;
    showLoading();
    
    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('name', nameInput.value.trim());

    try {
        const response = await fetch('/admin/add_face', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Failed to add face');
        }
        
        const result = await response.json();
        showToast(result.message);
        
        // Clear form
        fileInput.value = '';
        nameInput.value = '';
        const preview = document.querySelector('.image-preview');
        if (preview) {
            preview.remove();
        }
        
        // Refresh data
        await loadStudentsList();
        await loadStatistics();
    } catch (err) {
        showToast('Error adding face: ' + err.message, true);
        addFaceBtn.disabled = false;
    } finally {
        hideLoading();
        isSubmitting = false;
    }
}

async function removeStudent(name) {
    if (!confirm(`Are you sure you want to remove ${name}?`)) {
        return;
    }

    showLoading();
    try {
        const response = await fetch('/admin/remove_student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        
        if (!response.ok) {
            throw new Error('Failed to remove student');
        }
        
        const result = await response.json();
        showToast(result.message);
        
        // Refresh data
        await loadStudentsList();
        await loadStatistics();
    } catch (err) {
        showToast('Error removing student: ' + err.message, true);
    } finally {
        hideLoading();
    }
}

async function viewAttendance(name) {
    try {
        const response = await fetch(`/admin/student_attendance/${encodeURIComponent(name)}`);
        if (!response.ok) {
            throw new Error('Failed to load attendance records');
        }
        
        const data = await response.json();
        const container = document.getElementById('operationResults');
        
        if (data.attendance && data.attendance.length > 0) {
            container.innerHTML = `
                <h3>${name}'s Attendance Records</h3>
                <div class="attendance-list">
                    ${data.attendance.map(record => `
                        <div class="attendance-entry">
                            <span>
                                <i class="fas fa-clock"></i>
                                ${new Date(record.timestamp).toLocaleString()}
                            </span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            container.innerHTML = `<p class="empty-state">No attendance records found for ${name}</p>`;
        }
    } catch (err) {
        showToast('Error loading attendance records: ' + err.message, true);
    }
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', () => {
    loadStudentsList();
    loadStatistics();
});