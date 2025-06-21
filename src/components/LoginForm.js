// import React, {Component} from 'react';
// import {Form, Input, Button, message} from 'antd';
// import axios from '../api/axios-config';
//
// class LoginForm extends Component {
//     handleLogin = async (values) => {
//         try {
//             console.log('values');
//             console.log(values);
//             const res = await axios.post('/auth/sign-in', values);
//             const token = res.data.data.access_token;
//             localStorage.setItem('token', token);
//
//             const info = await axios.get('/user-info/get-user');
//             const role = info.data.data.authorities[0];
//             localStorage.setItem('role', role);
//
//             message.success('Login successful!');
//             setTimeout(() => {
//                 window.location.href = '/dashboard';
//             }, 1000);
//         } catch (err) {
//             message.error('Login failed');
//         }
//     };
//
//     componentDidMount() {
//         let token = localStorage.getItem('token');
//         if (token) window.location.href = '/dashboard';
//     }
//
//     render() {
//         return (
//             <Form layout="vertical" onFinish={this.handleLogin} style={{maxWidth: 400, margin: 'auto'}}>
//                 <h2>Login</h2>
//                 <Form.Item name="username" label="Username" rules={[{required: true}]}>
//                     <Input/>
//                 </Form.Item>
//                 <Form.Item name="password" label="Password" rules={[{required: true}]}>
//                     <Input.Password/>
//                 </Form.Item>
//                 <Button type="primary" htmlType="submit">Login</Button>
//             </Form>
//         );
//     }
// }
//
// export default LoginForm;
import React, {Component} from 'react';
import {Form, Input, Button, message} from 'antd';
import axios from '../api/axios-config';
import { Link } from 'react-router-dom';

class LoginForm extends Component {
    handleLogin = async (values) => {
        try {
            const res = await axios.post('/auth/sign-in', values);
            const token = res.data.data.access_token;
            localStorage.setItem('token', token);

            const info = await axios.get('/user-info/get-user');
            const role = info.data.data.authorities[0];
            localStorage.setItem('role', role);

            message.success('Login successful!');
            setTimeout(() => {
                if (role === 'ROLE_ADMIN') {
                    window.location.href = '/dashboard';
                } else if (role === 'ROLE_TEACHER') {
                    window.location.href = '/teacher/dashboard';
                } else if (role === 'ROLE_STUDENT') {
                    window.location.href = '/student/dashboard';
                } else {
                    window.location.href = '/dashboard';
                }
            }, 1000);
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
                <Button type="primary" htmlType="submit" block>Login</Button>

                <div style={{marginTop: 16, textAlign: 'center'}}>
                    <span>Hisobingiz yo‘qmi? </span>
                    <Link to="/signup">Ro‘yxatdan o‘tish</Link>
                </div>
            </Form>
        );
    }
}

export default LoginForm;
