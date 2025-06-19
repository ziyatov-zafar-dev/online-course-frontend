import React, { Component } from 'react';
import { Layout, Dropdown, Menu, Avatar, Popconfirm, message, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { withRouter } from '../../../config/withRouter';
import api from '../../../api/axios-config';

const { Header } = Layout;

class AdminHeader extends Component {
    state = {
        username: '',
        firstname: '',
        lastname: '',
    };

    componentDidMount() {
        this.fetchUserInfo();
    }

    fetchUserInfo = () => {
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

    handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        message.success('Tizimdan chiqdingiz');
        window.location.href = '/login';
    };

    handleSettings = () => {
        this.props.navigate('/admin/settings');
    };

    toggleSidebar = () => {
        if (this.props.toggleMenu) {
            this.props.toggleMenu(!this.props.menuVisible);
        }
    };

    render() {
        const { username, lastname, firstname } = this.state;
        const { menuVisible } = this.props;

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
            <Header
                style={{
                    background: '#fff',
                    padding: '0 20px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}
            >
                {/* Sidebar toggle button */}
                <Button type="text" onClick={this.toggleSidebar} style={{fontSize: '18px'}}>
                    {menuVisible ? <MenuFoldOutlined/> : <MenuUnfoldOutlined/>}
                </Button>

                {/* User dropdown */}
                <Dropdown overlay={menu} placement="bottomRight">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <Avatar>{username ? username[0].toUpperCase() : '?'}</Avatar>
                        <span>{firstname} {lastname}</span>
                    </div>
                </Dropdown>

            </Header>
        );
    }
}

export default withRouter(AdminHeader);
