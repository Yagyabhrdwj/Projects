# Face Recognition Attendance System

This is a Flask-based web application for managing attendance using face recognition. The system allows admins to register new students by uploading face images, capture attendance via webcam or image uploads, and view attendance statistics.

---

## 🚀 Features

- Face recognition using OpenCV and `face_recognition` library
- Admin login and dashboard
- Add/remove students using face images
- Real-time webcam capture for attendance
- View attendance logs and statistics
- Responsive frontend with JavaScript and dynamic updates

---

## 🛠️ Technologies Used

### Backend:
- Python
- Flask
- OpenCV
- face_recognition
- NumPy

### Frontend:
- HTML/CSS
- JavaScript (`script.js`, `admin.js`)
- Font Awesome (for icons)

---

## 📂 Project Structure

```
├── main.py              # Flask backend
├── script.js            # Webcam attendance capture script
├── admin.js             # Admin dashboard logic
├── templates/           # HTML templates (e.g., index.html, admin_login.html, admin_dashboard.html)
├── static/              # Static files like JS, CSS
├── images/              # Uploaded face images
├── faces.csv            # CSV storing names and face encodings
├── attendance_log.csv   # CSV storing attendance logs
```

---

## ⚙️ Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/face-recognition-attendance.git
   cd face-recognition-attendance
   ```

2. **Create and activate a virtual environment**  
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the app**  
   ```bash
   python main.py
   ```

5. **Visit**  
   Open your browser and navigate to `http://127.0.0.1:5000`

---

## 🔐 Admin Credentials (default)

| Username | Password  |
|----------|-----------|
| admin    | admin123  |

> 🔒 You should change these before deploying.

---

## 📸 Usage

### For Attendance:
- Start webcam → Press `Enter` to capture and submit an image
- Attendance will be logged if a known face is detected

### For Admins:
- Login at `/admin/login`
- Add new student with image
- View and delete student records
- Check real-time statistics

---

## ✅ Supported Image Formats

- `.jpg`
- `.jpeg`
- `.png`

Maximum size: **16MB**

---

## 🧠 Face Recognition Notes

- Each face encoding must have 128 dimensions
- Only one face per image is supported for registration
- Attendance is logged only once per session/image to avoid duplication

---

## 📊 Statistics Tracked

- Total registered students
- Total attendance entries
- Attendance today

---

## 📜 License

This project is open-source and free to use under the [MIT License](LICENSE).

---

## 👨‍💻 Author

- Built with ❤️ using Python and JavaScript