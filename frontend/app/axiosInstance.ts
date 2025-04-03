import axios from 'axios';
import config from "~/config";

const axiosInstance = axios.create({
    baseURL: `${config.BACKEND_URL}`, // Replace with your backend URL
    withCredentials: true, // To include cookies in requests
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;