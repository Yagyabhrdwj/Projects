let videoStream = null;
 let isEnterEnabled = false;

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

async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = document.getElementById('webcam');
        videoStream = stream;
        video.srcObject = stream;
        document.getElementById('webcamContainer').style.display = 'block';
        document.getElementById('webcamBtn').disabled = true;
        
        // Enable Enter key functionality
        isEnterEnabled = true;
        showToast('Press Enter to capture attendance', false);
    } catch (err) {
        showToast('Error accessing webcam: ' + err.message, true);
    }
}

function stopWebcam() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        document.getElementById('webcamContainer').style.display = 'none';
        document.getElementById('webcamBtn').disabled = false;
        isEnterEnabled = false;
    }
}

async function captureImage() {
    const video = document.getElementById('webcam');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    await processImageData(imageBlob);
}

async function processImageData(imageData) {
    showLoading();
    const formData = new FormData();
    formData.append('image', imageData);

    try {
        const response = await fetch('/process_image', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        
        if (response.ok) {
            displayResults(result);
            showToast('Image processed successfully');
        } else {
            showToast(result.error || 'Error processing image', true);
        }
    } catch (err) {
        showToast('Error processing image: ' + err.message, true);
    } finally {
        hideLoading();
    }
}

function displayResults(results) {
    const container = document.getElementById('attendanceResults');
    
    if (results.recognized_faces && results.recognized_faces.length > 0) {
        container.innerHTML = results.recognized_faces
            .map(face => `
                <div class="attendance-entry">
                    <span>
                        <i class="fas fa-user"></i>
                        ${face.name}
                    </span>
                    <span>
                        <i class="fas fa-clock"></i>
                        ${face.timestamp}
                    </span>
                </div>
            `)
            .join('');
    } else {
        container.innerHTML = '<p class="empty-state">No faces recognized</p>';
    }
}

// Add Enter key event listener
document.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && isEnterEnabled) {
        captureImage();
    }
});