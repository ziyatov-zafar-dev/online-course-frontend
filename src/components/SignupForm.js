import React, { Component } from 'react';
import { Form, Input, Button, message, Modal } from 'antd';
import axios from '../api/axios-config';
import { Link } from 'react-router-dom';

class SignupForm extends Component {
    state = {
        isVerificationModalVisible: false,
        email: '',
        verificationCode: '',
        loading: false
    };

    formRef = React.createRef();

    handleSignup = async (values) => {
        try {
            this.setState({ loading: true });
            const res = await axios.post('/auth/sign-up', values);

            if (res.data.success) {
                message.success(res.data.message);
                this.setState({
                    isVerificationModalVisible: true,
                    email: values.email
                });
            } else {
                message.error("Ro‘yxatdan o‘tishda xatolik!");
            }
        } catch (err) {
            message.error('Ro‘yxatdan o‘tishda xatolik');
        } finally {
            this.setState({ loading: false });
        }
    };

    handleVerifyCode = async () => {
        const { verificationCode } = this.state;
        if (!verificationCode) {
            message.warning("Kodni kiriting");
            return;
        }

        this.setState({ loading: true });
        try {
            const res = await axios.post(`/auth/verification?verificationCode=${verificationCode}`);
            if (res.data.success) {
                message.success("Email tasdiqlandi. Endi login qilishingiz mumkin.");
                this.setState({ isVerificationModalVisible: false });
                window.location.href = '/login';
            } else {
                message.error("Kod noto‘g‘ri yoki muddati tugagan.");
            }
        } catch (err) {
            message.error("Tasdiqlashda xatolik");
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const { isVerificationModalVisible, loading } = this.state;

        return (
            <>
                <Form
                    layout="vertical"
                    onFinish={this.handleSignup}
                    style={{ maxWidth: 400, margin: 'auto' }}
                    ref={this.formRef}
                >
                    <h2>Ro‘yxatdan o‘tish</h2>
                    <Form.Item name="firstname" label="Ism" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastname" label="Familiya" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Parol" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Ro‘yxatdan o‘tish
                    </Button>

                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <span>Allaqachon hisobingiz bormi? </span>
                        <Link to="/login">Login</Link>
                    </div>
                </Form>

                <Modal
                    title="📧 Email tasdiqlash"
                    open={isVerificationModalVisible}
                    onCancel={() => this.setState({ isVerificationModalVisible: false })}
                    onOk={this.handleVerifyCode}
                    okText="Tasdiqlash"
                    cancelText="Bekor qilish"
                    confirmLoading={loading}
                >
                    <p>Yuborilgan 4 xonali kodni kiriting (amal qilish muddati 2 daqiqa):</p>
                    <Input
                        maxLength={6}
                        placeholder="Masalan: 2311"
                        onChange={(e) => this.setState({ verificationCode: e.target.value })}
                    />
                </Modal>
            </>
        );
    }
}

export default SignupForm;
