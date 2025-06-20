import React, {Component} from 'react';
import {
    Table, Button, Space, Modal, Form, Input, Switch, message,
    Popconfirm, Pagination, Tag, Tooltip, Select
} from 'antd';
import {
    PlusOutlined, EditOutlined, DeleteOutlined,
    LinkOutlined, BookOutlined
} from '@ant-design/icons';
import api from '../../../api/axios-config';

const {Option} = Select;

class Courses extends Component {
    state = {
        courses: [],
        teachers: [],
        loading: false,
        visible: false,
        editMode: false,
        currentCourse: null,
        page: 0,
        size: 5,
        total: 0,
        showGroups: false,
        groups: [],
        selectedCourse: null,
        groupPage: 0,
        groupSize: 5,
        groupTotal: 0,
        teacherModalVisible: false,
        selectedTeacher: null
    };

    formRef = React.createRef();

    componentDidMount() {
        this.fetchCourses();
        this.fetchTeachers();
    }

    fetchCourses = () => {
        const {page, size} = this.state;
        this.setState({loading: true});
        api.get(`/admin/course/list?page=${page}&size=${size}`)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        courses: res.data.data.content,
                        total: res.data.data.totalElements,
                    });
                }
            })
            .catch(() => message.error("❌ Kurslarni yuklashda xatolik"))
            .finally(() => this.setState({loading: false}));
    };

    fetchTeachers = () => {
        api.get('/admin/user/teachers')
            .then(res => {
                if (res.data.success) {
                    this.setState({teachers: res.data.data});
                }
            })
            .catch(() => message.error("❌ Teacherlarni yuklashda xatolik"));
    };

    fetchGroupsByCourse = (courseId) => {
        const {groupPage, groupSize} = this.state;
        this.setState({loading: true});
        api.get(`/admin/group/get-all-groups-by-course-id/${courseId}?page=${groupPage}&size=${groupSize}`)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        groups: res.data.data.content,
                        groupTotal: res.data.data.totalElements,
                        showGroups: true,
                        selectedCourse: courseId
                    });
                }
            })
            .catch(() => message.error("❌ Guruhlarni yuklashda xatolik"))
            .finally(() => this.setState({loading: false}));
    };

    fetchCourseTeacher = (courseId) => {
        this.setState({loading: true});
        api.get(`/admin/course/get-course-teacher/${courseId}`)
            .then(res => {
                if (res.data.success) {
                    this.setState({
                        selectedTeacher: res.data.data,
                        teacherModalVisible: true
                    });
                } else {
                    message.warning("Bu guruhning o'qituvchisi mavjud emas")
                }
            })
            .catch(() => message.error("❌ O‘qituvchini yuklashda xatolik"))
            .finally(() => this.setState({loading: false}));
    };

    handleAdd = () => {
        this.setState({visible: true, editMode: false, currentCourse: null}, () => {
            setTimeout(() => {
                if (this.formRef.current) {
                    this.formRef.current.resetFields();
                }
            }, 0);
        });
    };

    handleEdit = (record) => {
        this.setState({visible: true, editMode: true, currentCourse: record}, () => {
            api.get(`/admin/course/get-course-teacher/${record.pkey}`)
                .then(res => {
                    if (res.data.success) {
                        const teacherId = res.data.data.teacherId;
                        setTimeout(() => {
                            if (this.formRef.current) {
                                this.formRef.current.setFieldsValue({
                                    ...record,
                                    teacherId
                                });
                            }
                        }, 0);
                    } else {
                        message.warning("Ushbu kursga biriktirilgan o‘qituvchi yo‘q");
                    }
                })
                .catch(() => message.error("❌ O‘qituvchini yuklashda xatolik"));
        });
    };

    handleDelete = (id) => {
        api.delete(`/admin/course/delete-course/${id}`)
            .then(res => {
                if (res.data.success) {
                    message.success("🗑️ Kurs o‘chirildi");
                    this.fetchCourses();
                }
            })
            .catch(() => message.error("❌ Kursni o‘chirishda xatolik"));
    };

    handleSubmit = (values) => {
        const {editMode, currentCourse} = this.state;
        const requestBody = {...values, teacherId: values.teacherId};
        const request = editMode
            ? api.put(`/admin/course/edit-course/${currentCourse.pkey}`, requestBody)
            : api.post('/admin/course/add-course', requestBody);

        request
            .then(res => {
                if (res.data.success) {
                    message.success(editMode ? "✅ Kurs o‘zgartirildi" : "✅ Yangi kurs qo‘shildi");
                    this.setState({visible: false});
                    this.fetchCourses();
                } else {
                    message.error("❌ Saqlashda xatolik yuz berdi");
                }
            })
            .catch(() => message.error("❌ Tarmoq xatosi!"));
    };

    handlePageChange = (page, size) => {
        this.setState({page: page - 1, size}, this.fetchCourses);
    };

    renderCoursesTable = () => {
        const {courses, loading, page, size, total} = this.state;

        const columns = [
            {
                title: '📘 Nomi',
                dataIndex: 'name',
                key: 'name',
                render: text => <b style={{fontSize: 16}}>{text}</b>
            },
            {
                title: '📄 Tavsif',
                dataIndex: 'description',
                key: 'description',
                ellipsis: {showTitle: false},
                render: (text) => (
                    <Tooltip placement="topLeft" title={text}>
                        <span style={{
                            display: 'inline-block',
                            maxWidth: 250,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: '#555'
                        }}>
                            {text}
                        </span>
                    </Tooltip>
                )
            },
            {
                title: <LinkOutlined/>,
                dataIndex: 'telegramChannel',
                key: 'telegramChannel',
                align: 'center',
                render: (link, record) =>
                    record.hasTelegramChannel ? (
                        <Tooltip title="Telegram kanalga o‘tish">
                            <a href={link} target="_blank" rel="noreferrer">
                                <Tag color="blue">Kanal</Tag>
                            </a>
                        </Tooltip>
                    ) : (
                        <Tag color="red">Yo‘q</Tag>
                    )
            },
            {
                title: 'Guruhlar',
                key: 'groups',
                render: (_, record) => (
                    <Button onClick={() => this.fetchGroupsByCourse(record.pkey)}>
                        Guruhlarini ko‘rish
                    </Button>
                )
            },
            {
                title: "O'qituvchi",
                key: 'teacher',
                render: (_, record) => (
                    <Button onClick={() => this.fetchCourseTeacher(record.pkey)}>
                        O‘qituvchini ko‘rish
                    </Button>
                )
            },
            {
                title: '⚙️ Amallar',
                key: 'action',
                align: 'center',
                render: (_, record) => (
                    <Space>
                        <Tooltip title="Tahrirlash">
                            <Button icon={<EditOutlined/>} onClick={() => this.handleEdit(record)}/>
                        </Tooltip>
                        <Popconfirm
                            title="Rostdan o‘chirmoqchimisiz?"
                            onConfirm={() => this.handleDelete(record.pkey)}
                        >
                            <Tooltip title="O‘chirish">
                                <Button danger icon={<DeleteOutlined/>}/>
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
                    dataSource={courses}
                    rowKey="pkey"
                    loading={loading}
                    pagination={false}
                    bordered
                    style={{
                        background: '#fff',
                        borderRadius: 8,
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                    }}
                />
                <div style={{marginTop: 24, textAlign: 'right'}}>
                    <Pagination
                        current={page + 1}
                        pageSize={size}
                        total={total}
                        onChange={this.handlePageChange}
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20']}
                        showTotal={(total) => `Jami ${total} ta kurs`}
                    />
                </div>
            </>
        );
    };

    renderGroupsTable = () => {
        const {groups, groupPage, groupSize, groupTotal, loading} = this.state;

        const columns = [
            {
                title: "📘 Guruh nomi",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "🧑‍🎓 Talabalar soni",
                dataIndex: "studentCount",
                key: "studentCount"
            },
            {
                title: "⏱️ Boshlanish vaqti",
                dataIndex: "startTime",
                key: "startTime"
            }
        ];

        return (
            <>
                <Button onClick={() => this.setState({showGroups: false})} style={{marginBottom: 16}}>
                    🔙 Kurslar ro‘yxatiga qaytish
                </Button>
                <Table
                    columns={columns}
                    dataSource={groups}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    bordered
                />
                <div style={{marginTop: 24, textAlign: 'right'}}>
                    <Pagination
                        current={groupPage + 1}
                        pageSize={groupSize}
                        total={groupTotal}
                        onChange={(page, size) =>
                            this.setState(
                                {groupPage: page - 1, groupSize: size},
                                () => this.fetchGroupsByCourse(this.state.selectedCourse)
                            )
                        }
                        showSizeChanger
                        pageSizeOptions={['5', '10', '20']}
                        showTotal={(total) => `Jami ${total} ta guruh`}
                    />
                </div>
            </>
        );
    };

    render() {
        const {visible, editMode, showGroups, teachers, teacherModalVisible, selectedTeacher} = this.state;

        return (
            <div style={{padding: '32px', background: '#f9f9fb', minHeight: '100vh'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24}}>
                    <h1 style={{fontSize: 28, margin: 0, fontWeight: 600}}>
                        <BookOutlined style={{color: '#1677ff'}}/> Kurslar boshqaruvi
                    </h1>
                    {!showGroups && (
                        <Button type="primary" icon={<PlusOutlined/>} onClick={this.handleAdd}>
                            Yangi kurs
                        </Button>
                    )}
                </div>

                {showGroups ? this.renderGroupsTable() : this.renderCoursesTable()}

                <Modal
                    title={editMode ? '✏️ Kursni tahrirlash' : '➕ Yangi kurs qo‘shish'}
                    open={visible}
                    onCancel={() => this.setState({visible: false})}
                    footer={null}
                    destroyOnClose
                >
                    <Form layout="vertical" ref={this.formRef} onFinish={this.handleSubmit}>
                        <Form.Item
                            name="teacherId"
                            label="Ustozni tanlang"
                            rules={[{required: true, message: 'Ustozni tanlang'}]}
                        >
                            <Select disabled={editMode} placeholder="Ustozni tanlang">
                                {teachers.map(teacher => (
                                    <Option key={teacher.teacherId} value={teacher.teacherId}>
                                        {teacher.firstname} {teacher.lastname} ({teacher.username})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="name"
                            label="Kurs nomi"
                            rules={[{required: true, message: 'Nomini kiriting'}]}
                        >
                            <Input placeholder="Masalan: Java Backend"/>
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Tavsif"
                            rules={[{required: true, message: 'Tavsif kiriting'}]}
                        >
                            <Input.TextArea rows={3} placeholder="Kurs tavsifi..."/>
                        </Form.Item>
                        <Form.Item name="telegramChannel" label="Telegram kanali">
                            <Input placeholder="https://t.me/..."/>
                        </Form.Item>
                        <Form.Item
                            name="hasTelegramChannel"
                            label="Telegram kanal mavjud"
                            valuePropName="checked"
                        >
                            <Switch/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                Saqlash
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal
                    title="👨‍🏫 O‘qituvchi ma’lumotlari"
                    open={teacherModalVisible}
                    onCancel={() => this.setState({teacherModalVisible: false})}
                    footer={null}
                >
                    {selectedTeacher ? (
                        <div style={{lineHeight: 2}}>
                            <p><b>Ismi:</b> {selectedTeacher.firstname}</p>
                            <p><b>Familiyasi:</b> {selectedTeacher.lastname}</p>
                            <p><b>Username:</b> {selectedTeacher.username}</p>
                            <p><b>Email:</b> {selectedTeacher.email}</p>
                        </div>
                    ) : (
                        <p>Ma’lumotlar topilmadi</p>
                    )}
                </Modal>
            </div>
        );
    }
}

export default Courses;
