// 🔴 MUST be the first line
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// 🔹 Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const payrollProfileRoutes = require("./routes/payrollProfileRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const payrollRunRoutes = require("./routes/payrollRunRoutes"); // ✅ MODULE 6
const inviteRoutes = require("./routes/inviteRoutes");
const statutoryRoutes = require("./routes/statutoryRoutes");
const salaryTemplateRoutes = require("./routes/salaryTemplateRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const payslipRoutes = require("./routes/payslipRoutes");
const taxRoutes = require("./routes/taxRoutes");

// 🔴 Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET is missing in .env file");
  process.exit(1);
}

// 🔹 Connect to MongoDB
connectDB();

// 🔹 Initialize Express app
const app = express();

// 🔹 Global middlewares
app.use(cors({
  origin: "http://localhost:5173", // 👈 EXACT frontend URL
  credentials: true               // 👈 REQUIRED
}));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Routes (Modules 1–4)
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/statutory", statutoryRoutes);
app.use("/api/payroll-profile", payrollProfileRoutes);
app.use("/api/salary-template", salaryTemplateRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/audit", require("./routes/auditRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/employee", require("./routes/employeeRoutes"));
app.use("/api/organization", require("./routes/organizationRoutes"));
app.use("/api/notification", require("./routes/notificationRoutes"));

// MODULE 5: Attendance & Leave
app.use("/api/attendance", attendanceRoutes);

// MODULE 6: Payroll Processing (Preview / Approve / Lock)
app.use("/api/payroll-run", payrollRunRoutes);

// 🔹 Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Payroll backend is running",
    timestamp: new Date(),
  });
});

// 🔹 Global error handler
app.use((err, req, res, next) => {
  if (err.code === 'ENOTFOUND' || err.message?.includes('getaddrinfo')) {
    console.error("MongoDB DNS Error: Could not resolve cluster address.");
    console.error("Check your internet connection or verify the MONGO_URI in .env");
  } else {
    console.error("Error:", err.stack);
  }
  res.status(500).json({
    message: "Internal Server Error",
  });
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
