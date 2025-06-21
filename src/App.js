// File: src/App.js
import React, {Component} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import {ProtectedRoute} from './routes';
import {withLocation} from './config/withLocation'; // location o‘tkazish uchun

// Admin pages
import Users from './components/pages/admin-page-control/Users';
import Courses from './components/pages/admin-page-control/Courses';
import Groups from './components/pages/admin-page-control/Groups';
import Lessons from './components/pages/admin-page-control/Lessons';
import Grades from './components/pages/admin-page-control/Grades';
import Teachers from './components/pages/admin-page-control/Teachers';
import Statistics from './components/pages/admin-page-control/Statistics';
import UserGroups from './components/pages/admin-page-control/UserGroups';
import SettingsPage from "./components/pages/admin-header/SettingsPage";
import {Button, message} from "antd";
import StudentDashboard from "./components/StudentDashboard";
import MyGroup from "./components/pages/student/MyGroup";
import Profile from "./components/pages/student/Profile";
import Settings from "./components/pages/student/Settings";
import StudentCourses from "./components/pages/student/StudentCourses";
import CourseGroups from "./components/pages/student/CourseGroups";
import MyGroups from "./components/pages/student/MyGroup"; // ✅ yangi sahifa

const AdminDashboardWithLocation = withLocation(AdminDashboard);

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard"/>}/>
                    <Route path="/login" element={<LoginForm/>}/>
                    <Route path="/signup" element={<SignupForm/>}/>

                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                    }/>

                    <Route path="/teacher/dashboard" element={
                        <ProtectedRoute roles={['ROLE_TEACHER']}>
                            <div>
                                <Button onClick={() => {
                                    // handleLogout = () => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('role');
                                    message.success('Tizimdan chiqdingiz');
                                    window.location.href = '/dashboard';
                                    // };
                                }}>Teacher dashboard</Button>
                            </div>
                        </ProtectedRoute>
                    }/>

                    <Route path="/student/dashboard" element={
                        <ProtectedRoute roles={['ROLE_STUDENT']}>
                            <StudentDashboard/>
                            {/*<Route path="*" element={<Navigate to="/student/dashboard/courses" />} />*/}
                        </ProtectedRoute>
                    }>
                        <Route path="my-courses" element={<MyGroup/>}/>
                        <Route
                            path="/student/dashboard/courses/:courseId/groups"
                            element={<CourseGroups/>}
                        />
                        <Route
                            path="/student/dashboard/groups/:groupId"
                            element={<MyGroup/>}
                        />
                        {/*<Route path="/student/dashboard/my-groups/:groupId" element={<ProtectedRoute roles={['ROLE_STUDENT']}><MyGroups/></ProtectedRoute>} />*/}

                        <Route path="courses" element={<StudentCourses/>}/>
                        <Route path="profile" element={<Profile/>}/>
                        <Route path="settings" element={<Settings/>}/>
                        <Route index element={<Navigate to="/student/dashboard/courses"/>}/>
                        <Route path="*" element={<Navigate to="/student/dashboard/courses"/>}/>
                    </Route>


                    <Route path="/admin" element={
                        <ProtectedRoute roles={['ROLE_ADMIN']}>
                            <AdminDashboardWithLocation/>
                        </ProtectedRoute>
                    }>
                        <Route path="users" element={<Users/>}/>
                        <Route path="users/:userId/groups" element={<UserGroups/>}/> {/* ✅ yangi path */}
                        <Route path="courses" element={<Courses/>}/>
                        <Route path="groups" element={<Groups/>}/>
                        <Route path="lessons" element={<Lessons/>}/>
                        <Route path="grades" element={<Grades/>}/>
                        <Route path="teachers" element={<Teachers/>}/>
                        <Route path="statistics" element={<Statistics/>}/>
                        <Route path="settings" element={<SettingsPage/>}/>
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard"/>}/>
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
