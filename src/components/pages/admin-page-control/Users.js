import React, { Component } from 'react';
import {
    Table, Tag, message, Pagination, Input, Row, Col, Button, Form, Modal
} from 'antd';
import api from '../../../api/axios-config';
import { withRouter } from '../../../config/withRouter'; // ⬅️ HOC import

class Users extends Component {
    state = {
        users: [],
        loading: false,
        totalElements: 0,
        page: 0,
        size: 5,
        filters: {
            searchUsernameExact: '',
            searchId: ''
        },
        addTeacherModalVisible: false,
        addTeacherForm: {
            firstname: '',
            lastname: '',
            username: '',
            email: '',
            password: ''
        }
    };

    componentDidMount() {
        this.fetchAllUsers();
    }

    fetchAllUsers = () => {
        this.setState({ loading: true });
        const { page, size } = this.state;
        api.get(`/admin/user/users?page=${page}&size=${size}`)
            .then(res => {
                const { content, totalElements } = res.data.data;
                this.setState({ users: content, totalElements, loading: false });
            }).catch(() => {
            message.error("Foydalanuvchilarni olishda xatolik!");
            this.setState({ loading: false });
        });
    };

    handlePageChange = (page, size) => {
        this.setState({ page: page - 1, size }, this.fetchAllUsers);
    };

    handleSearchByUsernameExact = () => {
        const username = this.state.filters.searchUsernameExact;
        if (!username) return;

        this.setState({ loading: true });
        api.get(`/admin/user/find-by-username?username=${username}`)
            .then(res => {
                if (res.data.success) {
                    this.setState({ users: [res.data.data], totalElements: 1, loading: false });
                } else {
                    message.warning("Foydalanuvchi topilmadi");
                }
            }).catch(() => {
            message.error("Username orqali qidirishda xatolik");
            this.setState({ loading: false });
        });
    };

    handleSearchById = () => {
        const id = this.state.filters.searchId;
        if (!id) return;

        this.setState({ loading: true });
        api.get(`/admin/user/get-user-by-id/${id}`)
            .then(res => {
                if (res.data.success) {
                    this.setState({ users: [res.data.data], totalElements: 1, loading: false });
                } else {
                    message.warning(res.data.message);
                }
            }).catch(() => {
            message.error("ID orqali qidirishda xatolik");
            this.setState({ loading: false });
        });
    };

    handleAddTeacherSubmit = () => {
        const form = this.state.addTeacherForm;

        if (!form.firstname || !form.username || !form.password || !form.email) {
            message.warning("Barcha maydonlarni to‘ldiring!");
            return;
        }

        this.setState({ loading: true });
        api.post('/admin/user/add-teacher', form)
            .then(res => {
                if (res.data.success) {
                    message.success("O‘qituvchi muvaffaqiyatli qo‘shildi!");
                    this.setState({ addTeacherModalVisible: false });
                    this.fetchAllUsers();
                } else {
                    message.error("O‘qituvchi qo‘shishda xatolik!");
                }
            }).catch(() => {
            message.error("Server bilan bog‘lanishda xatolik!");
        }).finally(() => this.setState({ loading: false }));
    };

    handleShowGroups = (user) => {
        const { navigate } = this.props;
        navigate(`/admin/users/${user.userId}/groups`);
    };

    render() {
        const {
            users, loading, totalElements, page, size, filters,
            addTeacherModalVisible, addTeacherForm
        } = this.state;

        const columns = [
            { title: 'ID', dataIndex: 'userId', key: 'userId' },
            { title: 'Ismi', dataIndex: 'firstname', key: 'firstname' },
            {
                title: 'Familiyasi', dataIndex: 'lastname', key: 'lastname',
                render: (text) => text || '-'
            },
            { title: 'Username', dataIndex: 'username', key: 'username' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
            {
                title: 'Role', dataIndex: 'role', key: 'role',
                render: (roles) => roles?.map((role) => {
                    let color = 'default', label = role.replace('ROLE_', '');
                    if (role === 'ROLE_ADMIN') color = 'red';
                    else if (role === 'ROLE_TEACHER') color = 'blue';
                    else if (role === 'ROLE_STUDENT') color = 'green';
                    return <Tag color={color} key={role}>{label}</Tag>;
                })
            },
            {
                title: 'Ro‘yxatga olingan',
                dataIndex: 'created',
                key: 'created',
                render: (text) => new Date(text).toLocaleString()
            },
            {
                title: 'Guruhlar',
                key: 'groups',
                render: (_, record) => (
                    <Button type="link" onClick={() => this.handleShowGroups(record)}>
                        Guruhlarini ko‘rish
                    </Button>
                )
            }
        ];

        return (
            <div>
                <h2>Foydalanuvchilar ro‘yxati</h2>

                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Input.Search
                            placeholder="Username bo‘yicha qidirish"
                            value={filters.searchUsernameExact}
                            onChange={(e) =>
                                this.setState({ filters: { ...filters, searchUsernameExact: e.target.value } })
                            }
                            onSearch={this.handleSearchByUsernameExact}
                            allowClear
                        />
                    </Col>
                    <Col span={6}>
                        <Input.Search
                            placeholder="ID bo‘yicha qidirish"
                            value={filters.searchId}
                            onChange={(e) =>
                                this.setState({ filters: { ...filters, searchId: e.target.value } })
                            }
                            onSearch={this.handleSearchById}
                            allowClear
                        />
                    </Col>
                    <Col span={6}>
                        <Button type="primary" onClick={() => this.setState({ addTeacherModalVisible: true })}>
                            O‘qituvchi qo‘shish
                        </Button>
                    </Col>
                </Row>

                <Table
                    rowKey="userId"
                    columns={columns}
                    dataSource={users}
                    loading={loading}
                    pagination={false}
                />

                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    <Pagination
                        current={page + 1}
                        pageSize={size}
                        total={totalElements}
                        onChange={this.handlePageChange}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20', '50']}
                    />
                </div>

                <Modal
                    title="Yangi o‘qituvchi qo‘shish"
                    open={addTeacherModalVisible}
                    onOk={this.handleAddTeacherSubmit}
                    onCancel={() => this.setState({ addTeacherModalVisible: false })}
                    okText="Qo‘shish"
                    cancelText="Bekor qilish"
                >
                    <Form layout="vertical">
                        <Form.Item label="Ismi">
                            <Input
                                value={addTeacherForm.firstname}
                                onChange={(e) =>
                                    this.setState({
                                        addTeacherForm: { ...addTeacherForm, firstname: e.target.value }
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Familiyasi">
                            <Input
                                value={addTeacherForm.lastname}
                                onChange={(e) =>
                                    this.setState({
                                        addTeacherForm: { ...addTeacherForm, lastname: e.target.value }
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Username">
                            <Input
                                value={addTeacherForm.username}
                                onChange={(e) =>
                                    this.setState({
                                        addTeacherForm: { ...addTeacherForm, username: e.target.value }
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input
                                value={addTeacherForm.email}
                                onChange={(e) =>
                                    this.setState({
                                        addTeacherForm: { ...addTeacherForm, email: e.target.value }
                                    })
                                }
                            />
                        </Form.Item>
                        <Form.Item label="Parol">
                            <Input.Password
                                value={addTeacherForm.password}
                                onChange={(e) =>
                                    this.setState({
                                        addTeacherForm: { ...addTeacherForm, password: e.target.value }
                                    })
                                }
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default withRouter(Users); // ✅ export HOC bilan
