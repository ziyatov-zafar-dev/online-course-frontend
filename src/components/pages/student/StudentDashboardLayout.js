// File: components/pages/student/StudentDashboardLayout.jsx
import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Button, message } from 'antd';
import {
    BookOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    AppstoreOutlined
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import { withLocation } from '../../../config/withLocation';

const { Header, Sider, Content } = Layout;

class StudentDashboardLayout extends Component {
    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        message.success("Tizimdan chiqdingiz");
        window.location.href = "/dashboard";
    };

    renderProfileMenu = () => (
        <Menu>
            <Menu.Item key="profile" icon={<UserOutlined />}>
                <Link to="/student/dashboard/profile">Profilim</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
                <Link to="/student/dashboard/settings">Sozlamalar</Link>
            </Menu.Item>
            <Menu.Item key="logout" danger icon={<LogoutOutlined />} onClick={this.handleLogout}>
                Chiqish
            </Menu.Item>
        </Menu>
    );

    getSelectedKey = () => {
        const { pathname } = this.props.location;

        if (pathname.startsWith("/student/dashboard/courses")) {
            return "/student/dashboard/courses";
        }
        if (pathname.startsWith("/student/my-courses")) {
            return "/student/my-courses";
        }
        if (pathname.startsWith("/student/dashboard/profile")) {
            return "/student/dashboard/profile";
        }
        if (pathname.startsWith("/student/dashboard/settings")) {
            return "/student/dashboard/settings";
        }

        return "";
    };

    render() {
        const selectedKey = this.getSelectedKey();

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible>
                    <div className="logo" style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>
                        Student
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[selectedKey]}
                    >
                        <Menu.Item key="/student/dashboard/courses" icon={<AppstoreOutlined />}>
                            <Link to="/student/dashboard/courses">Barcha kurslar</Link>
                        </Menu.Item>
                        <Menu.Item key="/student/my-courses" icon={<BookOutlined />}>
                            <Link to="/student/my-courses">Mening kurslarim</Link>
                        </Menu.Item>
                        <Menu.Item key="/student/dashboard/profile" icon={<UserOutlined />}>
                            <Link to="/student/dashboard/profile">Profilim</Link>
                        </Menu.Item>
                        <Menu.Item key="/student/dashboard/settings" icon={<SettingOutlined />}>
                            <Link to="/student/dashboard/settings">Sozlamalar</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header style={{
                        background: '#fff',
                        padding: '0 16px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center'
                    }}>
                        <Dropdown overlay={this.renderProfileMenu()} trigger={['click']}>
                            <Button icon={<UserOutlined />}>Profil</Button>
                        </Dropdown>
                    </Header>
                    <Content style={{ margin: '16px' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default withLocation(StudentDashboardLayout);
