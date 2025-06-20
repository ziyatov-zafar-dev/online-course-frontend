// File: src/components/pages/admin-page-control/UserGroups.js
import React, { Component } from 'react';
import { Table, Button, message, Tag } from 'antd';
import { withRouter } from '../../../config/withRouter';
import api from '../../../api/axios-config';

class UserGroups extends Component {
    state = {
        user: null,
        groups: [],
        loading: false
    };

    componentDidMount() {
        const { userId } = this.props.params;
        this.setState({ loading: true });

        api.get(`/admin/user/get-user-by-id/${userId}`)
            .then(res => {
                if (res.data.success) {
                    const user = res.data.data;
                    this.setState({ user });

                    const role = user.role?.[0];
                    const url = role === 'ROLE_TEACHER'
                        ? `/admin/group/teacher-groups/${userId}?page=0&size=10`
                        : `/admin/group/student-groups/${userId}?page=0&size=10`;

                    return api.get(url);
                }
            })
            .then(res => {
                if (res?.data?.success) {
                    this.setState({ groups: res.data.data.content });
                }
            })
            .catch(() => {
                message.error("Guruhlarni olishda xatolik!");
            })
            .finally(() => this.setState({ loading: false }));
    }

    render() {
        const { groups, loading, user } = this.state;
        const { navigate } = this.props;

        const columns = [
            {
                title: 'Guruh nomi',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: 'Tavsif',
                dataIndex: 'description',
                key: 'description'
            },
            {
                title: 'Telegram kanal',
                key: 'telegramChannel',
                render: (_, record) =>
                    record.hasTelegramChannel && record.telegramChannel ? (
                        <a href={record.telegramChannel} target="_blank" rel="noopener noreferrer">
                            Kanalga ulanish
                        </a>
                    ) : (
                        <p style={{
                            color: 'black'
                        }}>Mavjud emas</p>
                    )
            },
            {
                title: 'Kurs',
                dataIndex: ['course', 'name'],
                key: 'course'
            },
            {
                title: 'Yaratilgan sana',
                dataIndex: 'created',
                key: 'created',
                render: (created) => {
                    if (!created) return '-';
                    const { year, month, day, hour, minute, second } = created;
                    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ` +
                        `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
                }
            }
        ];

        return (
            <div>
                <h2>{user?.username} foydalanuvchining guruhlari</h2>
                <Button type="primary" onClick={() => navigate(-1)}>
                    ← Orqaga
                </Button>
                <Table
                    rowKey="pkey"
                    columns={columns}
                    dataSource={groups}
                    loading={loading}
                    style={{ marginTop: 16 }}
                />
            </div>
        );
    }
}

export default withRouter(UserGroups);
