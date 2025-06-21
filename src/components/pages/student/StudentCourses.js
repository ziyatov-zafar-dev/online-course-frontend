import React, { Component } from 'react';
import { List, Pagination, Card, Spin, message, Typography, Button } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../../api/axios-config';
import { TeamOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;

class StudentCourses extends Component {
    state = {
        loading: false,
        courses: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 6,
    };

    componentDidMount() {
        this.fetchCourses(0); // always fetch page 0 initially
    }

    fetchCourses = (page) => {
        const { pageSize } = this.state;
        this.setState({ loading: true });

        api.get(`/student/course/list?page=${page}&size=${pageSize}`)
            .then((res) => {
                if (res.data.success) {
                    const { content, totalElements, totalPages, number } = res.data.data;
                    this.setState({
                        courses: content,
                        totalPages,
                        totalElements,
                        currentPage: number,
                        loading: false
                    });
                } else {
                    message.warning(res.data.message || "Kurslarni yuklashda xatolik");
                    this.setState({ loading: false });
                }
            })
            .catch(() => {
                message.error("Server bilan bog'lanishda xatolik");
                this.setState({ loading: false });
            });
    };

    handlePageChange = (page) => {
        this.fetchCourses(page - 1); // because API uses 0-based indexing
    };

    render() {
        const { courses, currentPage, totalElements, pageSize, loading } = this.state;

        return (
            <div style={{ padding: '24px' }}>
                <Title level={3}>📚 Barcha kurslar</Title>
                <p>Buyerda siz barcha kurslarni ko'rasiz</p>

                <Spin spinning={loading}>
                    <List
                        grid={{ gutter: 24, column: 3 }}
                        dataSource={courses}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                    hoverable
                                    title={<Title level={5} style={{ marginBottom: 0 }}>{item.name}</Title>}
                                    style={{
                                        borderRadius: '12px',
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Paragraph ellipsis={{ rows: 3 }}>
                                        {item.description}
                                    </Paragraph>

                                    {item.hasTelegramChannel && (
                                        <a
                                            href={item.telegramChannel}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: 'block', marginTop: 12, color: '#1890ff' }}
                                        >
                                            Telegram kanalga o‘tish
                                        </a>
                                    )}

                                    <Link to={`/student/dashboard/courses/${item.pkey}/groups`}>
                                        <Button
                                            type="default"
                                            icon={<TeamOutlined />}
                                            block
                                            style={{
                                                marginTop: 12,
                                                fontWeight: '500',
                                                backgroundColor: '#f0f5ff',
                                                color: '#2f54eb',
                                                borderColor: '#adc6ff'
                                            }}
                                        >
                                            Guruhlarni ko‘rish
                                        </Button>
                                    </Link>
                                </Card>
                            </List.Item>
                        )}
                    />
                </Spin>

                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <Pagination
                        current={currentPage + 1} // +1 to shift from 0-indexed API
                        pageSize={pageSize}
                        total={totalElements}
                        onChange={this.handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        );
    }
}

export default StudentCourses;
