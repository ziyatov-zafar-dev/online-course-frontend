import React, { Component } from 'react';
import {
    Table, Button, Modal, Form, Input, Switch,
    message, Popconfirm, Space, Pagination, Tooltip, Select, Tag
} from 'antd';
import {
    EditOutlined, DeleteOutlined, PlusOutlined
} from '@ant-design/icons';
import api from '../../../api/axios-config';

const { Option } = Select;

class Groups extends Component {
    state = {
        groups: [],
        courses: [],
        loading: false,
        visible: false,
        editMode: false,
        currentGroup: null,
        page: 0,
        size: 5,
        total: 0,
    };

    formRef = React.createRef();

    componentDidMount() {
        this.fetchGroups();
        this.fetchCourses();
    }

    fetchGroups = () => {
        const { page, size } = this.state;
        this.setState({ loading: true });
        api.get(`/admin/group/get-all-groups?page=${page}&size=${size}`)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        groups: res.data.data.content,
                        total: res.data.data.totalElements
                    });
                }
            })
            .catch(() => message.error("❌ Guruhlarni yuklashda xatolik"))
            .finally(() => this.setState({ loading: false }));
    };

    fetchCourses = () => {
        api.get('/admin/course/list?page=0&size=100')
            .then(res => {
                if (res.data.success) {
                    this.setState({ courses: res.data.data.content });
                }
            })
            .catch(() => message.error("❌ Kurslarni yuklashda xatolik"));
    };

    handleAdd = () => {
        this.setState({ visible: true, editMode: false, currentGroup: null }, () => {
            this.formRef.current?.resetFields();
        });
    };

    handleEdit = (record) => {
        this.setState({ visible: true, editMode: true, currentGroup: record }, () => {
            setTimeout(() => {
                this.formRef.current?.setFieldsValue({
                    ...record,
                    'course-pkey': record.course?.pkey
                });
            }, 0);
        });
    };

    handleDelete = (id) => {
        api.delete(`/admin/group/delete-group/${id}`)
            .then(res => {
                if (res.data.success) {
                    message.success("🗑️ Guruh o‘chirildi");
                    this.fetchGroups();
                }
            })
            .catch(() => message.error("❌ O‘chirishda xatolik"));
    };

    handleSubmit = (values) => {
        const { editMode, currentGroup } = this.state;
        const url = editMode
            ? `/admin/group/edit-group/${currentGroup.pkey}`
            : '/admin/group/add-group';

        const payload = editMode
            ? values
            : { ...values, ['course-pkey']: values['course-pkey'] };

        const request = editMode
            ? api.put(url, payload)
            : api.post(url, payload);

        request
            .then(res => {
                if (res.data.success) {
                    message.success(editMode ? "✅ Guruh o‘zgartirildi" : "✅ Guruh qo‘shildi");
                    this.setState({ visible: false });
                    this.fetchGroups();
                } else {
                    message.error("❌ Xatolik yuz berdi");
                }
            })
            .catch(() => message.error("❌ Server bilan ulanishda xatolik"));
    };

    handlePageChange = (page, size) => {
        this.setState({ page: page - 1, size }, () => {
            this.fetchGroups();
        });
    };

    renderTable = () => {
        const { groups, loading, page, size, total } = this.state;

        const columns = [
            {
                title: "№",
                key: "index",
                render: (_, __, index) => (page * size) + index + 1,
            },
            {
                title: 'Nomi',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Tavsif',
                dataIndex: 'description',
                key: 'description',
                ellipsis: true
            },
            {
                title: 'Kurs',
                dataIndex: ['course', 'name'],
                key: 'courseName',
                render: text => <Tag color="blue">{text}</Tag>
            },
            {
                title: 'Telegram',
                dataIndex: 'telegramChannel',
                key: 'telegramChannel',
                render: (link, record) =>
                    record.hasTelegramChannel ? (
                        <a href={link} target="_blank" rel="noreferrer">
                            <Tag color="green">Bor</Tag>
                        </a>
                    ) : (
                        <Tag color="red">Yo‘q</Tag>
                    )
            },
            {
                title: 'Amallar',
                key: 'actions',
                render: (_, record) => (
                    <Space>
                        <Tooltip title="Tahrirlash">
                            <Button icon={<EditOutlined />} onClick={() => this.handleEdit(record)} />
                        </Tooltip>
                        <Popconfirm
                            title="Rostdan o‘chirmoqchimisiz?"
                            onConfirm={() => this.handleDelete(record.pkey)}
                        >
                            <Tooltip title="O‘chirish">
                                <Button danger icon={<DeleteOutlined />} />
                            </Tooltip>
                        </Popconfirm>
                    </Space>
                )
            }
        ];

        return (
            <>
                <Table
                    columns={columns}
                    dataSource={groups}
                    rowKey="pkey"
                    loading={loading}
                    pagination={false}
                    bordered
                />
                <div style={{ marginTop: 16, textAlign: 'right' }}>
                    <Pagination
                        current={page + 1}
                        pageSize={size}
                        total={total}
                        onChange={this.handlePageChange}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20']}
                        showTotal={(total) => `Jami ${total} ta guruh`}
                    />
                </div>
            </>
        );
    };

    render() {
        const { visible, courses, editMode } = this.state;

        return (
            <div style={{ padding: 32, background: '#f0f2f5', minHeight: '100vh' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 24
                }}>
                    <h1>Guruhlar boshqaruvi</h1>
                    <Button type="primary" icon={<PlusOutlined />} onClick={this.handleAdd}>
                        Yangi guruh
                    </Button>
                </div>

                {this.renderTable()}

                <Modal
                    title={editMode ? "✏️ Guruhni tahrirlash" : "➕ Guruh qo‘shish"}
                    open={visible}
                    onCancel={() => this.setState({ visible: false })}
                    footer={null}
                    destroyOnClose
                >
                    <Form layout="vertical" onFinish={this.handleSubmit} ref={this.formRef}>
                        {!editMode && (
                            <Form.Item
                                name="course-pkey"
                                label="Kursni tanlang"
                                rules={[{ required: true, message: 'Kursni tanlang' }]}
                            >
                                <Select placeholder="Kursni tanlang">
                                    {courses.map(course => (
                                        <Option key={course.pkey} value={course.pkey}>
                                            {course.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        )}
                        <Form.Item
                            name="name"
                            label="Guruh nomi"
                            rules={[{ required: true, message: 'Nomi kerak' }]}
                        >
                            <Input placeholder="Masalan: Java Backend 1-guruh" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Tavsif"
                            rules={[{ required: true, message: 'Tavsif kiriting' }]}
                        >
                            <Input.TextArea rows={3} placeholder="Guruh tavsifi" />
                        </Form.Item>
                        <Form.Item
                            name="telegramChannel"
                            label="Telegram kanali"
                        >
                            <Input placeholder="https://t.me/..." />
                        </Form.Item>
                        <Form.Item
                            name="hasTelegramChannel"
                            label="Telegram mavjud"
                            valuePropName="checked"
                        >
                            <Switch />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Saqlash
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Groups;
