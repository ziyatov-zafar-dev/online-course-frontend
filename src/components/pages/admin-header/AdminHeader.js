import React, { Component } from 'react';
import { Layout, Dropdown, Menu, Avatar, Popconfirm, message } from 'antd';
import { withRouter } from '../../../config/withRouter'; // 👈 qo‘shing
import api from '../../../api/axios-config';

const { Header } = Layout;

class AdminHeader extends Component {
    state = {
        username: '',
        lastname: '',
    };

    componentDidMount() {
        this.fetchUserInfo();
    }

    fetchUserInfo = () => {
        api.get('/user-info/get-user')
            .then((res) => {
                if (res.data.success) {
                    const { username, lastname } = res.data.data;
                    this.setState({ username, lastname: lastname || '' });
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

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        message.success('Tizimdan chiqdingiz');
        window.location.href = '/login';
    };

    handleSettings = () => {
        this.props.navigate('/admin/settings'); // 👈 react-router navigatsiya
    };

    render() {
        const { username, lastname } = this.state;

        const menu = (
            <Menu>
                <Menu.Item key="1" onClick={this.handleSettings}>
                    Sozlamalar
                </Menu.Item>
                <Menu.Item key="2">
                    <Popconfirm
                        title="Rostdan ham chiqmoqchimisiz?"
                        onConfirm={this.handleLogout}
                        okText="Ha"
                        cancelText="Yo'q"
                    >
                        <span style={{ cursor: 'pointer' }}>Chiqish</span>
                    </Popconfirm>
                </Menu.Item>
            </Menu>
        );

        return (
            <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <Dropdown overlay={menu} placement="bottomRight">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <Avatar>{username ? username[0].toUpperCase() : '?'}</Avatar>
                        <span>{username} {lastname}</span>
                    </div>
                </Dropdown>
            </Header>
        );
    }
}

export default withRouter(AdminHeader); // 👈 export qilishda withRouter ni o‘rab chiqish muhim
