import React, { Component } from 'react';
import { List, Button, Card, message, Spin, Typography, Descriptions } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { withRouter } from '../../../config/withRouter';
import api from '../../../api/axios-config';

const { Title, Paragraph } = Typography;

class CourseGroups extends Component {
    state = {
        loading: false,
        groups: [],
        studentId: 0,
        joinedGroups: {},
        groupInfos: {} // 📊 Guruh statistikasi
    };

    componentDidMount() {
        this.loadGroups();
    }

    // 🆕 STATISTIKA OLISH FUNKSIYASI
    fetchGroupInfo = async (groupId) => {
        try {
            const res = await api.get(`/student/group/group-information/${groupId}`);
            if (res.data.success) {
                this.setState(prev => ({
                    groupInfos: {
                        ...prev.groupInfos,
                        [groupId]: res.data.data
                    }
                }));
            }
        } catch (error) {
            message.error(`Guruh statistikasi xatoligi: ${error.message}`);
        }
    };

    loadGroups = async () => {
        const { courseId } = this.props.params;
        this.setState({ loading: true });

        try {
            const userRes = await api.get('/user-info/get-user');
            if (!userRes.data.success) {
                message.warning('Foydalanuvchi ma’lumotlarini olishda xatolik!');
                return this.setState({ loading: false });
            }

            const studentId = userRes.data.data.studentId;
            this.setState({ studentId });

            const groupRes = await api.get(`/student/group/groups/${courseId}?page=0&size=200`);
            if (!groupRes.data.success || groupRes.data.data.content.length === 0) {
                message.warning('Darslar mavjud emas');
                return this.setState({ loading: false });
            }

            const groups = groupRes.data.data.content;
            this.setState({ groups });

            for (const group of groups) {
                const joinRes = await api.post(`/student/group/is-join-group?groupId=${group.pkey}&studentId=${studentId}`);
                if (joinRes.data.success) {
                    this.setState((prev) => ({
                        joinedGroups: {
                            ...prev.joinedGroups,
                            [group.pkey]: joinRes.data.data,
                        }
                    }));
                }

                // 🆕 STATISTIKA FUNKSIYASINI CHAQIRISH
                this.fetchGroupInfo(group.pkey);
            }

        } catch (error) {
            message.error(`Xatolik: ${error.message}`);
        } finally {
            this.setState({ loading: false });
        }
    };

    toggleJoinLeave = (groupId, isJoined) => {
        const { studentId } = this.state;
        const url = isJoined
            ? `/student/group/left-group?groupId=${groupId}&studentId=${studentId}`
            : `/student/group/join-group?groupId=${groupId}&studentId=${studentId}`;

        api.post(url)
            .then((res) => {
                if (res.data.success) {
                    message.success(res.data.message);
                    this.setState((prev) => ({
                        joinedGroups: {
                            ...prev.joinedGroups,
                            [groupId]: !isJoined,
                        }
                    }));
                    this.fetchGroupInfo(groupId);
                } else {
                    message.warning(res.data.message);
                }
            })
            .catch(() => {
                message.error('Tizimda xatolik yuz berdi');
            });
    };

    render() {
        const { groups, loading, joinedGroups, groupInfos } = this.state;
        const { navigate } = this.props;

        return (
            <div style={{ padding: '24px' }}>
                {/* 🔙 Orqaga tugmasi */}
                <div style={{
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate(-1)}
                        style={{
                            fontWeight: '500',
                            fontSize: '16px',
                            color: '#1890ff'
                        }}
                    >
                        Orqaga
                    </Button>
                    <Title level={3} style={{ margin: 0 }}>👥 Guruhlar</Title>
                </div>

                <Spin spinning={loading}>
                    <List
                        grid={{ gutter: 24, column: 2 }}
                        dataSource={groups}
                        renderItem={(group) => {
                            const isJoined = joinedGroups[group.pkey] || false;
                            const info = groupInfos[group.pkey];

                            return (
                                <List.Item>
                                    <Card
                                        hoverable
                                        style={{
                                            borderRadius: '12px',
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                        }}
                                        title={<Title level={5} style={{ margin: 0 }}>{group.name}</Title>}
                                    >
                                        <Paragraph
                                            ellipsis={{ rows: 3 }}
                                            style={{ marginBottom: 12 }}
                                        >
                                            {group.description}
                                        </Paragraph>

                                        {/* 📊 Statistikalar */}
                                        {info && (
                                            <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
                                                <Descriptions.Item label="Darslar soni">{info.lessonCount}</Descriptions.Item>
                                                <Descriptions.Item label="Talabalar soni">{info.studentCount}</Descriptions.Item>
                                                <Descriptions.Item label="Yaratilgan sana">{new Date(info.createdGroup).toLocaleDateString()}</Descriptions.Item>
                                                <Descriptions.Item label="So‘nggi tahrir">{new Date(info.lastEdited).toLocaleDateString()}</Descriptions.Item>
                                            </Descriptions>
                                        )}

                                        <Button
                                            type={isJoined ? 'default' : 'primary'}
                                            danger={isJoined}
                                            block
                                            onClick={() => this.toggleJoinLeave(group.pkey, isJoined)}
                                        >
                                            {isJoined ? 'Tark etish' : 'Qo‘shilish'}
                                        </Button>
                                    </Card>
                                </List.Item>
                            );
                        }}
                    />
                </Spin>
            </div>
        );
    }
}

export default withRouter(CourseGroups);
