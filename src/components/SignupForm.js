import React, { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from '../api/axios-config';

class SignupForm extends Component {
    handleSignup = async (values) => {
        try {
            await axios.post('/auth/sign-up', values);
            message.success('Registration successful! Now login.');
            window.location.href = '/login';
        } catch (err) {
            message.error('Signup failed');
        }
    };

    render() {
        return (
            <Form layout="vertical" onFinish={this.handleSignup} style={{ maxWidth: 400, margin: 'auto' }}>
                <h2>Signup</h2>
                <Form.Item name="firstname" label="First Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="lastname" label="Last Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <Button type="primary" htmlType="submit">Register</Button>
            </Form>
        );
    }
}

export default SignupForm;
