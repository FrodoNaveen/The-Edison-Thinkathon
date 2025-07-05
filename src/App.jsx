import React, { useEffect, useState } from 'react'
import './App.css'
import LoginPage from './components/LoginPage'
import { Routes, Route, Link } from 'react-router-dom';
import SignUpPage from './components/SignUpPage';
import HomePage from './components/HomePage';
import ResetPasswordPage from './components/ResetPassWord';
import QuizPage from './components/QuizPage';
import Summary from './components/Summary';
import NotFound from './components/PageNotFound';





function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  console.log("djdjdjdjd", typeof (isLoggedIn))
  return (
    <div className='w-full'>
      <Routes>
        <Route path="/" element={isLoggedIn == 'true' ? <HomePage /> : <LoginPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={isLoggedIn == 'true' ? <HomePage /> : <LoginPage />} />
        <Route path="/signup" element={isLoggedIn == 'true' ? <HomePage /> : <SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/resetpassword" element={isLoggedIn == 'true' ? <HomePage /> : <ResetPasswordPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </div>
  )
}

export default App
