// import React, { useEffect, useState } from 'react'
// import './App.css'
// import LoginPage from './components/LoginPage'
// import { Routes, Route, Link } from 'react-router-dom';
// import SignUpPage from './components/SignUpPage';
// import HomePage from './components/HomePage';
// import ResetPasswordPage from './components/ResetPassWord';
// import QuizPage from './components/QuizPage';
// import Summary from './components/Summary';
// import NotFound from './components/PageNotFound';
// import RetakeQuiz from './components/RetakePage';





// function App() {
//   const isLoggedIn = localStorage.getItem('isLoggedIn');
//   console.log("djdjdjdjd", isLoggedIn)
//   return (
//     <div className='w-full'>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="*" element={<NotFound />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignUpPage />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/resetpassword" element={<ResetPasswordPage />} />
//         <Route path="/quiz" element={<QuizPage />} />
//         <Route path="/summary" element={<Summary />} />
//         <Route path="/retake" element={<RetakeQuiz />} />
//         {/* <Route path="/no-internet" element={<NoInternetPage />} /> */}
//       </Routes>
//     </div>
//   )
// }

// export default App




// App.jsx
import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import ResetPasswordPage from './components/ResetPassWord';
import QuizPage from './components/QuizPage';
import Summary from './components/Summary';
import NotFound from './components/PageNotFound';
import RetakeQuiz from './components/RetakePage';
import NoInternetPage from './components/NoInternetConnection';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const previousPath = sessionStorage.getItem('previousPath');
      if (location.pathname === '/no-internet' && previousPath) {
        navigate(previousPath);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (location.pathname !== '/no-internet') {
        sessionStorage.setItem('previousPath', location.pathname);
        navigate('/no-internet');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [location, navigate]);

  return (
    <div className="w-full">
      <Routes>
        {/* Public routes – redirect to /home if logged in */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />

        {/* Protected routes – must be logged in */}
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/summary" element={<ProtectedRoute><Summary /></ProtectedRoute>} />
        <Route path="/retake" element={<ProtectedRoute><RetakeQuiz /></ProtectedRoute>} />

        <Route path="/no-internet" element={<NoInternetPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
