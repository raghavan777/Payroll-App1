import api from "../api/axios";

export const getSalaryTemplates = () =>
  api.get("/api/salary-template");

export const getSalaryTemplate = (id) =>
  api.get(`/api/salary-template/${id}`);

export const createSalaryTemplate = (data) =>
  api.post("/api/salary-template", data);

export const updateSalaryTemplate = (id, data) =>
  api.put(`/api/salary-template/${id}`, data);

export const deleteSalaryTemplate = (id) =>
  api.delete(`/api/salary-template/${id}`);
