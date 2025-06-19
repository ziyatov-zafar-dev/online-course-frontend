import React, {Component} from 'react';
import {Form, Input, Button, message} from 'antd';
import axios from '../api/axios-config';

class LoginForm extends Component {
    handleLogin = async (values) => {
        try {
            console.log('values');
            console.log(values);
            const res = await axios.post('/auth/sign-in', values);
            const token = res.data.data.access_token;
            localStorage.setItem('token', token);

            const info = await axios.get('/user-info/get-user');
            const role = info.data.data.authorities[0];
            localStorage.setItem('role', role);

            message.success('Login successful!');
            window.location.href = '/dashboard';
        } catch (err) {
            message.error('Login failed');
        }
    };

    componentDidMount() {
        let token = localStorage.getItem('token');
        if (token) window.location.href = '/dashboard';
    }

    render() {
        return (
            <Form layout="vertical" onFinish={this.handleLogin} style={{maxWidth: 400, margin: 'auto'}}>
                <h2>Login</h2>
                <Form.Item name="username" label="Username" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="password" label="Password" rules={[{required: true}]}>
                    <Input.Password/>
                </Form.Item>
                <Button type="primary" htmlType="submit">Login</Button>
            </Form>
        );
    }
}

export default LoginForm;
