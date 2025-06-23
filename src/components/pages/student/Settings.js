// File: src/components/pages/SettingsPage.js
import React, {Component} from 'react';
import {Card, Form, Input, Button, message} from 'antd';
import api from '../../../api/axios-config';
import {ArrowLeftOutlined} from "@ant-design/icons";

class ChangePasswordForm extends Component {
    state = {
        oldPassword: '',
        newPassword: ''
    };

    handleSubmit = () => {
        const {oldPassword, newPassword} = this.state;
        api.put('/student/change-password', {oldPassword, newPassword})
            .then(res => {
                if (res.data.success) {
                    message.success(res.data.message);
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else {
                    message.error("Parolni o'zgartirishda xatolik!");
                }
            })
            .catch(() => message.error("Server bilan bog'lanishda xatolik!"));
    };

    render() {
        return (
            <Card title="Parolni o'zgartirish">
                <Form layout="vertical" onFinish={this.handleSubmit}>
                    <Form.Item label="Eski parol">
                        <Input.Password onChange={e => this.setState({oldPassword: e.target.value})}/>
                    </Form.Item>
                    <Form.Item label="Yangi parol">
                        <Input.Password onChange={e => this.setState({newPassword: e.target.value})}/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">O'zgartirish</Button>
                </Form>
            </Card>
        );
    }
}


class ChangeUsernameForm extends Component {
    state = {
        username: '',
        loading: false
    };

    componentDidMount() {
        api.get('/user-info/get-user')
            .then(res => {
                if (res.data.success) {
                    this.setState({username: res.data.data.username});
                }
            })
            .catch(() => {
                message.error("Username olishda xatolik yuz berdi");
            });
    }

    // ✅ Token o‘zgarganidan keyin kerakli harakatlar
    onUsernameChanged = (newUsername, tokens) => {
        localStorage.setItem('token', tokens.access_token);
        message.success("Username muvaffaqiyatli o'zgartirildi");
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
    };

    handleSubmit = () => {
        const {username} = this.state;
        if (!username) return message.warning("Username bo‘sh bo‘lmasligi kerak");

        this.setState({loading: true});

        api.put(`/admin/profile/change-username?username=${username}`)
            .then(res => {
                if (res.data.success) {
                    message.success("Username muvaffaqiyatli o‘zgartirildi");
                    const {access_token, refresh_token} = res.data.data;

                    this.onUsernameChanged(username, {access_token, refresh_token}); // ✅ Yangi tokenlar yuborilyapti

                } else {
                    message.error(res.data.message);
                }
            })
            .catch(() => {
                message.error("Tarmoq xatosi!");
            })
            .finally(() => this.setState({loading: false}));
    };

    render() {
        const {username, loading} = this.state;

        return (
            <Card title="Username ni o‘zgartirish" style={{marginBottom: 24}}>
                <Form layout="vertical" onFinish={this.handleSubmit}>
                    <Form.Item label="Yangi username">
                        <Input
                            value={username}
                            onChange={e => this.setState({username: e.target.value})}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        O‘zgartirish
                    </Button>
                </Form>
            </Card>
        );
    }
}


class ChangeProfileForm extends Component {
    state = {
        firstname: '',
        lastname: '',
        email: '',
        loading: false
    };

    componentDidMount() {
        api.get('/user-info/get-user')
            .then(res => {
                if (res.data.success) {
                    const {firstname, lastname, email} = res.data.data;
                    this.setState({firstname, lastname, email});
                }
            })
            .catch(() => message.error("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi"));
    }

    handleSubmit = () => {
        const {firstname, lastname, email} = this.state;
        this.setState({loading: true});

        api.put('/admin/profile/change-firstname-lastname-email', {
            firstname,
            lastname,
            email
        })
            .then(res => {
                if (res.data.success) {
                    message.success("Profil ma'lumotlari muvaffaqiyatli yangilandi");
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1000);
                } else {
                    message.error("Profilni yangilashda xatolik yuz berdi");
                }
            })
            .catch((e) => message.error(e.message))
            .finally(() => this.setState({loading: false}));
    };

    render() {
        const {firstname, lastname, email, loading} = this.state;

        return (
            <Card title="Profil ma'lumotlarini o'zgartirish">
                <Form layout="vertical" onFinish={this.handleSubmit}>
                    <Form.Item label="Ism">
                        <Input
                            value={firstname}
                            onChange={e => this.setState({firstname: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item label="Familiya">
                        <Input
                            value={lastname}
                            onChange={e => this.setState({lastname: e.target.value})}
                        />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input
                            value={email}
                            onChange={e => this.setState({email: e.target.value})}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Yangilash
                    </Button>
                </Form>
            </Card>
        );
    }
}

class Settings extends Component {
    handleBack = () => {
        // Agar react-router-dan foydalansangiz:
        // this.props.history?.goBack(); // yoki this.props.navigate(-1) agar hook olingan bo‘lsa
        window.location.href = '/dashboard';
    };

    render() {
        return (
            <div style={{ padding: 24 }}>
                <div style={{ display: 'grid', gap: 24 }}>
                    <ChangePasswordForm />
                </div>
            </div>
        );
    }
}

export default Settings;