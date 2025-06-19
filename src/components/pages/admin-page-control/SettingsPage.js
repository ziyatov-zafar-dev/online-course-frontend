// File: src/components/pages/SettingsPage.js
import React, { Component } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import api from '../../../api/axios-config';

class ChangePasswordForm extends Component {
    state = {
        oldPassword: '',
        newPassword: ''
    };

    handleSubmit = () => {
        const { oldPassword, newPassword } = this.state;
        api.put('/admin/change-password', { oldPassword, newPassword })
            .then(res => {
                if (res.data.success) {
                    message.success(res.data.message);
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
                        <Input.Password onChange={e => this.setState({ oldPassword: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Yangi parol">
                        <Input.Password onChange={e => this.setState({ newPassword: e.target.value })} />
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
        loading: false,
    };

    componentDidMount() {
        api.get('/user-info/get-user')
            .then(res => {
                if (res.data.success) {
                    this.setState({ username: res.data.data.username });
                }
            })
            .catch(() => {
                message.error("Username olishda xatolik yuz berdi");
            });
    }

    // ✅ Bu funksiya o‘zgartirishdan so‘ng ishga tushadi
    onUsernameChanged = (newUsername) => {
        console.log("Username o‘zgartirildi:", newUsername);
        // Masalan: boshqa sahifaga yo‘naltirish yoki boshqa ma’lumotlarni yangilash
    };

    handleSubmit = () => {
        const { username } = this.state;
        if (!username) return message.warning("Username bo‘sh bo‘lmasligi kerak");

        this.setState({ loading: true });

        api.put('/admin/change-username', { username })
            .then(res => {
                if (res.data.success) {
                    message.success("Username muvaffaqiyatli o‘zgartirildi");
                    this.onUsernameChanged(username); // ✅ Qo‘shimcha funksiya chaqirildi
                } else {
                    message.error("O‘zgartirishda muammo yuz berdi");
                }
            })
            .catch(() => {
                message.error("Tarmoq xatosi!");
            })
            .finally(() => this.setState({ loading: false }));
    };

    render() {
        const { username, loading } = this.state;

        return (
            <Card title="Username ni o‘zgartirish" style={{ marginBottom: 24 }}>
                <Form layout="vertical" onFinish={this.handleSubmit}>
                    <Form.Item label="Yangi username">
                        <Input
                            value={username}
                            onChange={e => this.setState({ username: e.target.value })}
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
        email: ''
    };

    componentDidMount() {
        api.get('/user-info/get-user')
            .then(res => {
                if (res.data.success) {
                    const { firstname, lastname, email } = res.data.data;
                    this.setState({ firstname, lastname, email });
                }
            });
    }

    handleSubmit = () => {
        const { firstname, lastname, email } = this.state;
        api.put('/admin/change-profile', { firstname, lastname, email })
            .then(res => {
                if (res.data.success) {
                    message.success("Profil ma'lumotlari yangilandi");
                } else {
                    message.error("Yangilashda xatolik yuz berdi");
                }
            })
            .catch(() => message.error("Server bilan bog'lanishda xatolik!"));
    };

    render() {
        const { firstname, lastname, email } = this.state;
        return (
            <Card title="Profil ma'lumotlarini o'zgartirish">
                <Form layout="vertical" onFinish={this.handleSubmit}>
                    <Form.Item label="Ism">
                        <Input value={firstname} onChange={e => this.setState({ firstname: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Familiya">
                        <Input value={lastname} onChange={e => this.setState({ lastname: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Email">
                        <Input value={email} onChange={e => this.setState({ email: e.target.value })} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Yangilash</Button>
                </Form>
            </Card>
        );
    }
}

class SettingsPage extends Component {
    render() {
        return (
            <div style={{ padding: 24, display: 'grid', gap: 24 }}>
                <ChangePasswordForm />
                <ChangeUsernameForm />
                <ChangeProfileForm />
            </div>
        );
    }
}

export default SettingsPage;