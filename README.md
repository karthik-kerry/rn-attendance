# 📱 RN Attendance

A React Native app to manage and track attendance easily.

![rn-attendance-banner](https://via.placeholder.com/1200x300?text=RN+Attendance+App)  
_Simple attendance tracking at your fingertips_

---

![GitHub repo size](https://img.shields.io/github/repo-size/karthik-kerry/rn-attendance)
![GitHub last commit](https://img.shields.io/github/last-commit/karthik-kerry/rn-attendance)
![GitHub license](https://img.shields.io/github/license/karthik-kerry/rn-attendance)
![GitHub issues](https://img.shields.io/github/issues/karthik-kerry/rn-attendance)
![Platform](https://img.shields.io/badge/platform-react--native-blue)

---

## ✨ Features

- User authentication (login/logout)
- Mark attendance (present/absent)
- View daily / monthly attendance history
- Offline-first support
- Clean, modern UI with React Native & Expo
- Easily customizable

---

## ⚙️ Tech Stack

- **React Native**
- **Expo**
- AsyncStorage / Local database _(replace if using something else)_
- React Navigation

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16.x
- npm or yarn
- Expo CLI

npm install -g expo-cli
Installation
bash
Copy
Edit
git clone https://github.com/karthik-kerry/rn-attendance.git
cd rn-attendance
npm install

# or

yarn install
npx expo start
Scan the QR code in Expo Go app to view it on your device.

📝 Usage
Login:
Enter your username & password to authenticate.

Mark Attendance:
On the home screen, tap the “Mark Present” or “Mark Absent” button.

View History:
Navigate to History tab to see your attendance records.

Logout:
Tap the profile icon and choose Logout.

📡 API (Example)
(Replace this section if your app works fully offline, or document actual endpoints if you have them)

Method Endpoint Description
POST /api/login Authenticate user
GET /api/attendance Fetch attendance list
POST /api/attendance Mark attendance (present/absent)

Sample request:

http
Copy
Edit
POST /api/attendance
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
"date": "2025-07-11",
"status": "present"
}
Sample response:

json
Copy
Edit
{
"success": true,
"message": "Attendance marked successfully"
}
📸 Screenshots
Login Screen Home Screen History Screen

(Replace placeholder URLs with real screenshots)

📂 Project Structure
go
Copy
Edit
rn-attendance/
├── assets/
├── components/
├── screens/
├── navigation/
├── App.js
└── package.json
✅ Contributing
Contributions are welcome!

Fork the repo

Create your feature branch (git checkout -b feature/my-feature)

Commit your changes (git commit -m 'Add feature')

Push to branch (git push origin feature/my-feature)

Open Pull Request

📄 License
Distributed under the MIT License.
See LICENSE.

✉️ Contact
Karthik
GitHub
