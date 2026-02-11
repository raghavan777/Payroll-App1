import axios from "axios";

/* =====================================================
   BASE URL
===================================================== */
const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

/* =====================================================
   ATTACH TOKEN AUTOMATICALLY
===================================================== */
API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
