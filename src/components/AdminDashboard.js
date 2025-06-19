import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import {
    UserOutlined,
    BookOutlined,
    TeamOutlined,
    ReadOutlined,
    FileTextOutlined,
    CrownOutlined,
    BarChartOutlined,
} from '@ant-design/icons';
import AdminHeader from "./pages/admin-header/AdminHeader";

const { Header, Content, Sider } = Layout;

class AdminDashboard extends Component {
    render() {
        const { location } = this.props;
        const currentPath = location.pathname;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[currentPath]} // dinamik active menyu
                    >
                        <Menu.Item key="/admin/users" icon={<UserOutlined />}>
                            <Link to="/admin/users">Foydalanuvchilar</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/courses" icon={<BookOutlined />}>
                            <Link to="/admin/courses">Kurslar</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/groups" icon={<TeamOutlined />}>
                            <Link to="/admin/groups">Guruhlar</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/lessons" icon={<ReadOutlined />}>
                            <Link to="/admin/lessons">Darslar</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/grades" icon={<FileTextOutlined />}>
                            <Link to="/admin/grades">Baholar</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/teachers" icon={<CrownOutlined />}>
                            <Link to="/admin/teachers">O‘qituvchilar</Link>
                        </Menu.Item>
                        <Menu.Item key="/admin/statistics" icon={<BarChartOutlined />}>
                            <Link to="/admin/statistics">Statistikalar</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', paddingLeft: 20 }}>
                        <AdminHeader />
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default AdminDashboard;
