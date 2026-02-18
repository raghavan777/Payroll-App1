const Employee = require("../models/Employee");
const User = require("../models/User");
const Payslip = require("../models/Payslip");
const { logAction } = require("./auditController");
const { createNotification } = require("./notificationController");

/* =====================================================
   GENERATE UNIQUE EMPLOYEE CODE (ORG SAFE)
   Format: EMP001, EMP002, EMP003...
===================================================== */
const generateEmployeeCode = async (organizationId) => {
  try {
    const lastEmployee = await Employee.findOne({ organizationId })
      .sort({ createdAt: -1 })
      .select("employeeCode");

    if (!lastEmployee) return "EMP001";

    const lastNumber = parseInt(
      lastEmployee.employeeCode.replace("EMP", ""),
      10
    );

    const nextNumber = lastNumber + 1;

    return `EMP${String(nextNumber).padStart(3, "0")}`;
  } catch (error) {
    console.error("EMP CODE ERROR:", error);
    return `EMP${Date.now()}`; // fallback safe
  }
};

/* =====================================================
   CREATE EMPLOYEE
===================================================== */
exports.createEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and Email required" });
    }

    const normalizedEmail = email.toLowerCase();

    /* ================= CHECK DUPLICATE ================= */
    const existing = await Employee.findOne({
      email: normalizedEmail,
      organizationId: req.user.organizationId,
    });

    if (existing) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    /* ================= GENERATE CODE ================= */
    const employeeCode = await generateEmployeeCode(
      req.user.organizationId
    );

    /* ================= CREATE EMPLOYEE ================= */
    const employee = await Employee.create({
      employeeCode,
      name,
      email: normalizedEmail,
      organizationId: req.user.organizationId,
    });

    /* ================= AUDIT & NOTIFICATION ================= */
    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "EMPLOYEE_CREATED",
      module: "EMPLOYEE",
      details: { name, email, employeeCode },
      req
    });

    await createNotification({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      title: "New Employee Added",
      message: `${name} (${employeeCode}) has been added to the organization.`,
      type: "SYSTEM",
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (err) {
    console.error("CREATE EMPLOYEE ERROR:", err);
    return res.status(500).json({
      message: "Failed to create employee",
      error: err.message,
    });
  }
};

/* =====================================================
   GET ALL EMPLOYEES (ORG-WISE)
===================================================== */
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({
      organizationId: req.user.organizationId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (err) {
    console.error("GET EMPLOYEES ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   GET SINGLE EMPLOYEE
===================================================== */
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeCode: req.params.employeeCode,
      organizationId: req.user.organizationId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(employee);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   DELETE EMPLOYEE (AND LOGIN USER)
===================================================== */
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      employeeCode: req.params.employeeCode,
      organizationId: req.user.organizationId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Delete login user also
    if (employee.userId) {
      await User.findByIdAndDelete(employee.userId);
    }

    /* ================= AUDIT & NOTIFICATION ================= */
    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "EMPLOYEE_DELETED",
      module: "EMPLOYEE",
      details: { employeeCode: req.params.employeeCode, name: employee.name },
      req
    });

    await createNotification({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      title: "Employee Removed",
      message: `${employee.name} (${req.params.employeeCode}) has been removed.`,
      type: "SYSTEM",
    });

    return res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   MODULE 11 — EMPLOYEE DASHBOARD
===================================================== */
exports.getEmployeeDashboard = async (req, res) => {
  try {
    const payslips = await Payslip.find({
      employeeId: req.user.id,
    }).sort({ createdAt: -1 });

    const latest = payslips[0];

    return res.json({
      latestSalary: latest?.netSalary || 0,
      totalPayslips: payslips.length,
      status: latest?.status || "No Payroll",
    });
  } catch (err) {
    console.error("EMPLOYEE DASHBOARD ERROR:", err);
    return res.status(500).json({
      message: "Failed to load employee dashboard",
    });
  }
};
