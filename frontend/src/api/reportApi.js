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

export const getStatutoryReport = (type, startDate, endDate) =>
   API.get(`/report/statutory?type=${type}&startDate=${startDate}&endDate=${endDate}`, { responseType: "blob" });

export const getBankAdvice = (startDate, endDate) =>
   API.get(`/report/bank-advice?startDate=${startDate}&endDate=${endDate}`, { responseType: "blob" });
