import API from "./api";

/* CREATE EMPLOYEE */
export const createEmployee = (data) => API.post("/employees", data);

/* GET EMPLOYEES */
export const getEmployees = () => API.get("/employees");

/* GET SINGLE */
export const getEmployee = (code) => API.get(`/employees/${code}`);

/* DELETE */
export const deleteEmployee = (code) => API.delete(`/employees/${code}`);
