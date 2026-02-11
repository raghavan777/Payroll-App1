import API from "./api";

/* MY PAYSLIPS */
export const getMyPayslips = () => API.get("/payslip/my");

/* DOWNLOAD */
export const downloadPayslip = (id) =>
    window.open(`http://localhost:5000/api/payslip/download/${id}`, "_blank");
