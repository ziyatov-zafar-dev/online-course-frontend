import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://server-online-course-backend.onrender.com/api',
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default instance;
