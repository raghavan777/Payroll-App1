import API from "./api";

/* ===============================
   PAYROLL SUMMARY
=============================== */
export const getPayrollSummary = () =>
    API.get("/report/payroll-summary");

/* ===============================
   PAYROLL HISTORY (TABLE DATA)
=============================== */
export const getPayrollHistory = () =>
    API.get("/payroll/history");
