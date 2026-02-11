import API from "./api";

/* ===============================
   GET ANALYTICS SUMMARY
=============================== */
export const getAnalyticsSummary = () =>
    API.get("/analytics/summary");

/* ===============================
   GET MONTHLY PAYROLL TREND
=============================== */
export const getPayrollTrend = () =>
    API.get("/analytics/trend");
