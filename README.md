# 🌟 The Edison Thinkathon Web App

A React-based quiz and learning platform that integrates Google Login, provides secure routing, and stores user progress locally. Built for the Edison Thinkathon Challenge 2025.

---

## 📦 Setup Instructions

### 🔧 Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Vite (comes with dependencies)

---

### 🧭 Clone the Repository

```bash
git clone https://github.com/your-username/thinkathon-app.git
cd thinkathon-app

npm install
# or
yarn install



🤖 AI Service Integration
While the current version does not use a backend AI service, it is designed to simulate interaction and quiz functionality.

Planned AI Capabilities:
✅ Decoding JWTs from Google OAuth

🚧 AI-generated quiz questions (GEMINI integration)

🚧 AI-based scoring or feedback

🚧 Cloud storage for user profiles (Local Storage)


🧱 Architecture Decisions
| Area               | Choice                                      |
| ------------------ | ------------------------------------------- |
| Frontend Framework | React with Vite                             |
| Routing            | React Router DOM v6                         |
| Styling            | Tailwind CSS                                |
| Auth Integration   | Google OAuth via `@react-oauth/google`      |
| State Management   | useState + localStorage                     |
| Deployment         | [Vercel](https://vercel.com/)               |
| Network Handling   | Offline detection + redirection             |
| Routing Protection | `ProtectedRoute` / `PublicRoute` components |


📁 Folder Structure

src/
├── components/
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   ├── HomePage.jsx
│   ├── QuizPage.jsx
│   ├── Summary.jsx
│   ├── ResetPassword.jsx
│   ├── RetakePage.jsx
│   ├── ProtectedRoute.jsx
│   ├── PublicRoute.jsx
│   └── NoInternetConnection.jsx
├── App.jsx
├── main.jsx
└── assets/


✨ Features Implemented
✅ Google Sign-In (Popup Only — No auto-login prompt)
✅ Email/Password login using localStorage
✅ Protected & Public routing based on login status
✅ Quiz component with scoring & navigation
✅ Summary page with correct/incorrect tracking
✅ Retake Quiz feature
✅ Forgot Password dummy flow
✅ Offline page auto-redirect if connection drops
✅ Smooth dark UI with glassmorphism & gradients
✅ Fully responsive (mobile-first)


🚧 Known Limitations
❌ No backend — all user data is stored in localStorage
❌ No real password or OTP validation
❌ Google login replaces previous email/password users with same email
❌ Not scalable for multiple users on one browser

🧑‍💻 Contributors
💻 Developer: [V.Naveen Kumar]
🎯 Challenge: Edison Thinkathon 2025


🌐 Deployed Link
Hosted on Vercel
🔗 Live Demo: https://the-edison-thinkathon.vercel.app/

#Screenshots
<img width="1440" alt="Screenshot 2025-07-06 at 4 30 15 PM" src="https://github.com/user-attachments/assets/85a5c812-9a93-4507-9d50-f8d6d56ff3cc" />
<img width="1440" alt="Screenshot 2025-07-06 at 4 30 08 PM" src="https://github.com/user-attachments/assets/489eb093-3987-4d5d-ad28-ecf57aea24bb" />
<img width="1440" alt="Screenshot 2025-07-06 at 4 29 54 PM" src="https://github.com/user-attachments/assets/5e05fa8a-7904-4778-af11-363057bf4f73" />
<img width="1440" alt="Screenshot 2025-07-06 at 4 29 43 PM" src="https://github.com/user-attachments/assets/49d10c23-ddbf-4e6c-8aab-f61b0dbf3729" />
<img width="1440" alt="Screenshot 2025-07-06 at 4 29 31 PM" src="https://github.com/user-attachments/assets/ac108ea6-4e82-4cda-8e21-b4e72ee433ec" />
<img width="1440" alt="Screenshot 2025-07-06 at 4 29 20 PM" src="https://github.com/user-attachments/assets/4accfa6c-24ef-4200-aa92-65f2a46bb431" />
<img width="1440" alt="Screenshot 2025-07-06 at 4 28 54 PM" src="https://github.com/user-attachments/assets/c89b8fe2-1397-425e-b21b-bcee50f5c654" />

Let me know if you want me to:
- Generate screenshot placeholders
- Add a project logo
- Include usage instructions for each page

Would you like this saved as a downloadable `.md` file?






