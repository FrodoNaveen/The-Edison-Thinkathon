// components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PublicRoute({ children }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (isLoggedIn) {
        return <Navigate to="/home" replace />;
    }

    return children;
}
