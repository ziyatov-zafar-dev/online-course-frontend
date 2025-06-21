
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        if (role === 'ROLE_ADMIN') {
            navigate('/admin/users');
        } else if (role === 'ROLE_STUDENT') {
            navigate('/student/dashboard/courses');
        }else if (role === 'ROLE_TEACHER') {
            navigate('/teacher/dashboard');
        } else {
            navigate('/login');
        }
    }, [role, navigate]);

    return (
        <div style={{ padding: 30 }}>
            <h2>Redirecting...</h2>
        </div>
    );
};

export default Dashboard;
