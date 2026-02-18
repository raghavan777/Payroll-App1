import api from "../api/axios";

export const getStatutoryConfigs = async () => {
    const res = await api.get("/api/statutory");
    return res.data;
};

export const createStatutoryConfig = async (data) => {
    const res = await api.post("/api/statutory", data);
    return res.data;
};

export const updateStatutoryConfig = async (id, data) => {
    const res = await api.put(`/api/statutory/${id}`, data);
    return res.data;
};

export const deleteStatutoryConfig = async (id) => {
    const res = await api.delete(`/api/statutory/${id}`);
    return res.data;
};
