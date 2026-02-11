import axios from "axios";

const API_URL = "http://localhost:5000/api/payroll-profile";

// Helper for Authorization Header
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* =========================================================
   ✔ CREATE Payroll Profile
   ✔ data MUST contain employeeCode (EMP-2026-0003)
   ========================================================= */
export const createPayrollProfile = (data) => {
  return axios.post(API_URL, data, authHeader());
};

/* =========================================================
   ✔ GET ALL Payroll Profiles
   ========================================================= */
export const getPayrollProfiles = () => {
  return axios.get(API_URL, authHeader());
};

/* =========================================================
   ✔ GET Single Payroll Profile
   ✔ PARAM = employeeCode
   ========================================================= */
export const getPayrollProfile = (employeeCode) => {
  return axios.get(`${API_URL}/${employeeCode}`, authHeader());
};

/* =========================================================
   ✔ UPDATE Payroll Profile
   ✔ PARAM = employeeCode
   ========================================================= */
export const updatePayrollProfile = (employeeCode, data) => {
  return axios.put(`${API_URL}/${employeeCode}`, data, authHeader());
};

/* =========================================================
   ✔ DELETE Payroll Profile
   ✔ PARAM = employeeCode
   ========================================================= */
export const deletePayrollProfile = (employeeCode) => {
  return axios.delete(`${API_URL}/${employeeCode}`, authHeader());
};

/* =========================================================
   ✔ ASSIGN SALARY TEMPLATE
   ✔ PARAM = employeeCode
   ========================================================= */
export const assignSalaryTemplate = (employeeCode, templateId) => {
  return axios.put(
    `${API_URL}/${employeeCode}/assign-template`,
    { templateId },
    authHeader()
  );
};
