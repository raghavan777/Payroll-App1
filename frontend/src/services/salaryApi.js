import axios from "axios";

const API = "http://localhost:5000/api/salary-template";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ================================
   FETCH ALL SALARY TEMPLATES
================================ */
export const getSalaryTemplates = () => {
  return axios.get(API, authHeader());
};

/* ================================
   ASSIGN TEMPLATE TO PAYROLL PROFILE
================================ */
export const assignSalaryTemplate = (profileId, templateId) => {
  return axios.post(
    `${API}/assign`,
    { profileId, templateId },
    authHeader()
  );
};

/* ================================
   PREVIEW SALARY BY PROFILE ID
================================ */
export const previewSalaryByProfile = (profileId) => {
  return axios.get(
    `${API}/calculate/${profileId}`,
    authHeader()
  );
};
