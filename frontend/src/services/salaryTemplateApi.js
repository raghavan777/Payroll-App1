import axios from "axios";

const API = "http://localhost:5000/api/salary-template";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSalaryTemplates = () =>
  axios.get(API, authHeader());

export const getSalaryTemplate = (id) =>
  axios.get(`${API}/${id}`, authHeader());

export const createSalaryTemplate = (data) =>
  axios.post(API, data, authHeader());

export const updateSalaryTemplate = (id, data) =>
  axios.put(`${API}/${id}`, data, authHeader());

export const deleteSalaryTemplate = (id) =>
  axios.delete(`${API}/${id}`, authHeader());
