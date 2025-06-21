import React, {Component} from 'react';
import {
    List, Card, Button, Typography, Spin, message, Modal, Space, Upload, Select
} from 'antd';
import {
    ArrowLeftOutlined, VideoCameraOutlined,
    FilePdfOutlined, FileExcelOutlined, FileImageOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import {withRouter} from '../../../config/withRouter';
import api from '../../../api/axios-config';
import ReactPlayer from 'react-player';

const {Title, Paragraph} = Typography;
const {Option} = Select;

class MyGroups extends Component {
    state = {
        loading: false,
        groups: [],
        selectedGroup: null,
        lessons: [],
        joinedGroups: {},
        studentId: 0,
        videoModal: {visible: false, url: '', title: ''},
        homeworkUploadModal: {visible: false, homeworkId: null},
        fileTypes: [],
        selectedTypeId: null,
        selectedFile: null
    };

    async componentDidMount() {
        const groups = await this.loadGroups();
        const typeListResp = await api.get(`/file-types/list`);
        this.setState({fileTypes: typeListResp.data.data});

        const {groupId} = this.props.params;
        if (groupId && groups) {
            const gd = groups.find(g => g.group.pkey === groupId);
            if (gd) this.openGroup(gd);
        }
    }

    loadGroups = async () => {
        this.setState({loading: true});
        try {
            const u = await api.get('/user-info/get-user');
            const studentId = u.data.data.studentId;
            this.setState({studentId});

            const res = await api.get(`/student/group/my-groups?page=0&size=50`);
            const groups = res.data.data;
            console.log('groups', groups);
            this.setState({groups});

            for (let g of groups) {
                const j = await api.post(`/student/group/is-join-group?groupId=${g.group.pkey}&studentId=${studentId}`);
                this.setState(prev => ({
                    joinedGroups: {...prev.joinedGroups, [g.group.pkey]: j.data.data}
                }));
            }
            return groups;
        } catch (e) {
            message.error('Xatolik yuz berdi');
            return [];
        } finally {
            this.setState({loading: false});
        }
    };

    openGroup = async (groupData) => {
        const {group, getLessons} = groupData;

        this.setState({loading: true});

        try {
            const lessonsWithHomeworks = await Promise.all(
                getLessons.map(async lesson => {
                    try {
                        const resp = await api.get(`/student/homework/get-all-homeworks-by-lesson-id/${lesson.pkey}?page=0&size=1200`);
                        console.log('homeworks');
                        console.log(resp.data.data)
                        return {
                            ...lesson,
                            homeworks: resp.data.data?.content || []
                        };
                    } catch {
                        return {
                            ...lesson,
                            homeworks: []
                        };
                    }
                })
            );

            this.setState({
                selectedGroup: groupData,
                lessons: lessonsWithHomeworks
            }, () => {
                this.props.navigate(`/student/dashboard/groups/${group.pkey}`);
            });

        } finally {
            this.setState({loading: false});
        }
    };

    openVideo = (url, title) => this.setState({videoModal: {visible: true, url, title}});
    closeVideo = () => this.setState({videoModal: {visible: false, url: '', title: ''}});

    downloadNonVideoFile = async (lessonFileId, fileName) => {
        const api_url = `/student/lesson/download-lesson-file/${lessonFileId}`;
        try {
            const resp = await api.get(api_url, {responseType: 'blob'});
            const blobUrl = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            message.error('Faylni yuklab bo‘lmadi');
        }
    };

    downloadHomework = async (lessonId) => {
        try {
            const resp = await api.get(`/student/homework/download-homeworks/${lessonId}`, {
                responseType: 'blob'
            });

            const contentType = resp.headers['content-type'];

            if (contentType && contentType.includes('application/json')) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const text = reader.result;
                        const json = JSON.parse(text);
                        if (!json.success) {
                            message.warning(json.message || 'Uyga vazifa topilmadi yoki muddati tugagan');
                        }
                    } catch {
                        message.warning('Xatolik yuz berdi');
                    }
                };
                reader.readAsText(resp.data);
            } else {
                const url = window.URL.createObjectURL(new Blob([resp.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `homework_${lessonId}.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (err) {
            message.warning('Uyga vazifa topilmadi yoki muddati tugagan');
        }
    };

    toggleJoin = async (groupId, joined) => {
        const {studentId} = this.state;
        if (joined) {
            Modal.confirm({
                title: 'Guruhni tark etmoqchimisiz?',
                icon: <ExclamationCircleOutlined/>,
                content: <p>Bu guruhdagi barcha darslarga kirish huquqingiz yo‘qoladi.</p>,
                okText: 'Ha',
                okType: 'danger',
                cancelText: 'Yo‘q',
                onOk: async () => {
                    try {
                        await api.post(`/student/group/left-group?groupId=${groupId}&studentId=${studentId}`);
                        this.setState(prev => ({
                            joinedGroups: {...prev.joinedGroups, [groupId]: false}
                        }));
                        message.success('Guruh tark etildi');
                        await this.loadGroups();
                        this.setState({selectedGroup: null, lessons: []});
                        this.props.navigate('/student/my-groups');
                    } catch {
                        message.error('Tark etishda xatolik');
                    }
                }
            });
        } else {
            try {
                await api.post(`/student/group/join-group?groupId=${groupId}&studentId=${studentId}`);
                this.setState(prev => ({
                    joinedGroups: {...prev.joinedGroups, [groupId]: true}
                }));
                message.success('Guruhga qo‘shildingiz');
                await this.loadGroups();
            } catch {
                message.error('Xatolik yuz berdi');
            }
        }
    };

    openUploadModal = (homeworkId) => {
        this.setState({
            homeworkUploadModal: {visible: true, homeworkId},
            selectedFile: null,
            selectedTypeId: null
        });
    };

    closeUploadModal = () => {
        this.setState({
            homeworkUploadModal: {visible: false, homeworkId: null},
            selectedFile: null,
            selectedTypeId: null
        });
    };

    handleSubmitFile = async () => {
        const {selectedFile, selectedTypeId, studentId, homeworkUploadModal} = this.state;

        console.log('selected file', selectedFile, 'selected file type id', selectedTypeId, selectedTypeId);
        console.log('homework', homeworkUploadModal)
        if (!selectedFile || !selectedTypeId || !homeworkUploadModal.homeworkId) {
            message.warning("Iltimos, barcha maydonlarni to‘ldiring");
            return;
        }

        const formData = new FormData();
        // formData.append("file", selectedFile);
        formData.append("file", new File([selectedFile], selectedFile.name, {
            type: selectedFile.type || 'application/octet-stream'
        }));
        formData.append("studentId", studentId.toString());
        formData.append("typeId", selectedTypeId.toString());
        formData.append("homeworkId", homeworkUploadModal.homeworkId.toString()); // UUID ham string bo'lishi shart


        try {
            let res = await api.post(
                "/student/homework-submission/add-homework-submission",
                formData,
                {
                    headers: {
                        // Axios multipartni avtomatik o'zi belgilaydi, hech narsa yozmaslik ham mumkin
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            if (!res.data.success) message.warning(res.data.message)
            else {
                message.success("Uyga vazifa muvaffaqiyatli yuborildi");
                this.closeUploadModal();
            }
        } catch (error) {
            console.error("Xatolik:", error);
            message.error("Yuklashda xatolik: " + error?.response?.data?.message || "Serverga ulanib bo‘lmadi");
        }
    };


    renderGroupsList() {
        const {groups, joinedGroups, loading} = this.state;
        return (
            <Spin spinning={loading}>
                <List
                    grid={{gutter: 16, column: 2}}
                    dataSource={groups}
                    renderItem={({group, getLessons}) => (
                        <List.Item>
                            <Card hoverable title={group.name}>
                                <Paragraph ellipsis={{rows: 2}}>{group.description}</Paragraph>
                                <Space>
                                    <Button onClick={() => this.openGroup({group, getLessons})}>Guruhni ko‘rish</Button>
                                    <Button
                                        type={joinedGroups[group.pkey] ? 'default' : 'primary'}
                                        danger={joinedGroups[group.pkey]}
                                        onClick={() => this.toggleJoin(group.pkey, joinedGroups[group.pkey])}
                                    >
                                        {joinedGroups[group.pkey] ? 'Tark etish' : 'Qo‘shilish'}
                                    </Button>
                                </Space>
                            </Card>
                        </List.Item>
                    )}
                />
            </Spin>
        );
    }

    renderGroupDetail() {
        const {selectedGroup, lessons, videoModal} = this.state;
        return (
            <div>
                <Button type="text" icon={<ArrowLeftOutlined/>} onClick={() => {
                    this.setState({selectedGroup: null, lessons: []});
                    this.props.navigate('/student/dashboard/my-courses');
                }}>
                    Guruhlarga qaytish
                </Button>
                <Title level={4}>{selectedGroup.group.name}</Title>
                <Paragraph>{selectedGroup.group.description}</Paragraph>

                <Spin spinning={this.state.loading}>
                    <List
                        grid={{gutter: 12, column: 1}}
                        dataSource={lessons}
                        renderItem={l => (
                            <List.Item key={l.pkey}>
                                <Card title={l.title}>
                                    <Paragraph>{l.description}</Paragraph>
                                    <Space wrap>
                                        {l.files?.map(f => {
                                            const isVideo = f.typeName === 'mp4';
                                            const Icon = isVideo ? VideoCameraOutlined : {
                                                pdf: FilePdfOutlined, xlsx: FileExcelOutlined,
                                                jpg: FileImageOutlined, png: FileImageOutlined
                                            }[f.typeName] || FilePdfOutlined;

                                            return (
                                                <Button
                                                    key={f.fileName}
                                                    icon={<Icon/>}
                                                    onClick={() =>
                                                        isVideo
                                                            ? this.openVideo(f.fileUrl, l.title)
                                                            : this.downloadNonVideoFile(f.fileId, f.fileName)
                                                    }
                                                >
                                                    {isVideo ? "Darsni ko'rish" : f.fileName}
                                                </Button>
                                            );
                                        })}

                                        <Button
                                            type="primary"
                                            icon={<FilePdfOutlined/>}
                                            onClick={() => this.downloadHomework(l.pkey)}
                                            style={{backgroundColor: '#2db7f5', borderColor: '#2db7f5', color: 'white'}}
                                        >
                                            📥 Uyga vazifa yuklab olish
                                        </Button>

                                        {l.homeworks?.map(hw => (
                                            <div key={hw.id}>
                                                {/*<Paragraph strong>📘 {hw.title}</Paragraph>*/}
                                                <Space>
                                                    {hw.files?.map(f => (
                                                        <Button
                                                            key={f.fileName}
                                                            icon={<FilePdfOutlined/>}
                                                            onClick={() => window.open(f.fileUrl, "_blank")}
                                                        >
                                                            {"Ushbu dars faylini yuklab olish"}
                                                        </Button>
                                                    ))}
                                                    <Button
                                                        type="primary"
                                                        onClick={() => this.openUploadModal(hw.pkey)}
                                                        style={{backgroundColor: "#52c41a", borderColor: "#52c41a"}}
                                                    >
                                                        📤 Vazifani yuklash (modal)
                                                    </Button>
                                                </Space>
                                            </div>
                                        ))}
                                    </Space>
                                </Card>
                            </List.Item>
                        )}
                    />
                </Spin>

                <Modal
                    visible={videoModal.visible}
                    footer={null}
                    onCancel={this.closeVideo}
                    width={800}
                    bodyStyle={{padding: 0}}
                >
                    <ReactPlayer
                        url={videoModal.url}
                        controls playing
                        width="100%" height="450px"
                        config={{file: {attributes: {controlsList: 'nodownload', disablePictureInPicture: true}}}}
                        onContextMenu={e => e.preventDefault()}
                    />
                </Modal>

                <Modal
                    visible={this.state.homeworkUploadModal.visible}
                    onCancel={this.closeUploadModal}
                    onOk={this.handleSubmitFile}
                    okText="Yuborish"
                    cancelText="Bekor qilish"
                >
                    <Space direction="vertical" style={{width: "100%"}}>
                        <Select
                            placeholder="Fayl turini tanlang"
                            style={{width: "100%"}}
                            onChange={(value) => this.setState({selectedTypeId: value})}
                        >
                            {this.state.fileTypes.map(ft => (
                                <Option key={ft.id} value={ft.id}>{ft.type}</Option>
                            ))}
                        </Select>

                        <Upload
                            beforeUpload={(file) => {
                                this.setState({selectedFile: file});
                                return false;
                            }}
                            showUploadList={false}
                        >
                            <Button>Faylni tanlang</Button>
                        </Upload>
                    </Space>
                </Modal>
            </div>
        );
    }

    render() {
        return (
            <div style={{padding: 24}}>
                <Title level={3}>🤝 Mening guruhlarim</Title>
                {this.state.selectedGroup
                    ? this.renderGroupDetail()
                    : this.renderGroupsList()}
            </div>
        );
    }
}

export default withRouter(MyGroups);
