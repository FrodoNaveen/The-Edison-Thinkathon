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
// import NoInternetPage from './components/NoInternetConnection';





// function App() {
//   const isLoggedIn = localStorage.getItem('isLoggedIn');
//   console.log("djdjdjdjd", isLoggedIn)
//   return (
//     <div className='w-full'>
//       <Routes>
//         <Route path="/" element={isLoggedIn == 'true' ? <HomePage /> : <LoginPage />} />
//         <Route path="*" element={<NotFound />} />
//         <Route path="/login" element={isLoggedIn == 'true' ? <HomePage /> : <LoginPage />} />
//         <Route path="/signup" element={isLoggedIn == 'true' ? <HomePage /> : <SignUpPage />} />
//         <Route path="/home" element={<HomePage />} />
//         <Route path="/resetpassword" element={isLoggedIn == 'true' ? <HomePage /> : <ResetPasswordPage />} />
//         <Route path="/quiz" element={<QuizPage />} />
//         <Route path="/summary" element={<Summary />} />
//         <Route path="/retake" element={<RetakeQuiz />} />
//         <Route path="/no-internet" element={<NoInternetPage />} />
//       </Routes>
//     </div>
//   )
// }

// export default App


import React, { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import ResetPasswordPage from './components/ResetPassWord';
import QuizPage from './components/QuizPage';
import Summary from './components/Summary';
import NotFound from './components/PageNotFound';
import RetakeQuiz from './components/RetakePage';
import NoInternetPage from './components/NoInternetConnection';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
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
  }, [navigate, location]);

  return (
    <div className='w-full'>
      <Routes>
        <Route path="/" element={isLoggedIn === 'true' ? <HomePage /> : <LoginPage />} />
        <Route path="/login" element={isLoggedIn === 'true' ? <HomePage /> : <LoginPage />} />
        <Route path="/signup" element={isLoggedIn === 'true' ? <HomePage /> : <SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/resetpassword" element={isLoggedIn === 'true' ? <HomePage /> : <ResetPasswordPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/retake" element={<RetakeQuiz />} />
        <Route path="/no-internet" element={<NoInternetPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
