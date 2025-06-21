// File: components/pages/student/StudentDashboardLayout.jsx
import React, { Component } from 'react';
import { Layout, Menu, Button, message, Modal } from 'antd'; // ✅ Modal qo‘shildi
import {
    AppstoreOutlined,
    BookOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';
import { withRouter } from '../config/withRouter';
import api from "../api/axios-config";

const { Header, Sider, Content } = Layout;

class StudentDashboardLayout extends Component {
    state = {
        menuVisible: true,
        firstname: '',
        lastname: '',
    };

    toggleMenu = (visible) => {
        this.setState({ menuVisible: visible });
    };

    handleLogout = () => {
        Modal.confirm({
            title: 'Chiqishni tasdiqlang',
            content: 'Rostan ham tizimdan chiqmoqchimisiz?',
            okText: 'Ha',
            cancelText: 'Yo‘q',
            onOk: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                message.success("Tizimdan chiqdingiz");
                window.location.href = "/login";
            }
        });
    };

    componentDidMount() {
        this.getCurrentUser();
    }

    getCurrentUser = () => {
        api.get('/user-info/get-user')
            .then((res) => {
                if (res.data.success) {
                    const { username, firstname, lastname } = res.data.data;
                    this.setState({ username, firstname, lastname: lastname || '' });
                } else {
                    message.warning('Foydalanuvchi ma’lumotlarini olishda xatolik!');
                }
            })
            .catch(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/login';
            });
    };

    render() {
        const { location } = this.props;
        const currentPath = location.pathname;
        const { menuVisible } = this.state;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                {menuVisible && (
                    <Sider>
                        <Menu
                            theme="dark"
                            mode="inline"
                            selectedKeys={[currentPath]}
                        >
                            <Menu.Item key="/student/dashboard/courses" icon={<AppstoreOutlined />}>
                                <Link to="/student/dashboard/courses">Barcha kurslar</Link>
                            </Menu.Item>
                            <Menu.Item key="/student/dashboard/my-courses" icon={<BookOutlined />}>
                                <Link to="/student/dashboard/my-courses">Mening guruhlarim</Link>
                            </Menu.Item>
                            <Menu.Item key="/student/dashboard/profile" icon={<UserOutlined />}>
                                <Link to="/student/dashboard/profile">Profilim</Link>
                            </Menu.Item>
                            <Menu.Item key="/student/dashboard/settings" icon={<SettingOutlined />}>
                                <Link to="/student/dashboard/settings">Sozlamalar</Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                )}
                <Layout>
                    <Header style={{
                        background: '#fff',
                        paddingLeft: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ fontWeight: 'bold', fontSize: 16 }}>
                            👨‍🎓 {this.state.firstname} {this.state.lastname}
                        </div>
                        <Button
                            type="primary"
                            icon={<LogoutOutlined />}
                            danger
                            onClick={this.handleLogout}
                        >
                            Chiqish
                        </Button>
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export default withRouter(StudentDashboardLayout);
