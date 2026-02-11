const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

const auth = require("../middleware/auth");
const User = require("../models/User");
const Employee = require("../models/Employee");
const Payslip = require("../models/Payslip");
const generateEmployeeCode = require("../utils/generateemployeeCode");

/* =====================================================
   CREATE EMPLOYEE (WITH LOGIN ACCESS)
   Roles: SUPER_ADMIN / HR_ADMIN
===================================================== */
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      dateOfJoining,
    } = req.body;

    /* ================= VALIDATION ================= */
    if (!name || !email || !password || !department || !dateOfJoining) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const normalizedEmail = email.toLowerCase();

    /* ================= CHECK DUPLICATE USER ================= */
    const existingUser = await User.findOne({
      email: normalizedEmail,
      organizationId: req.user.organizationId,
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    /* ================= HASH PASSWORD ================= */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= ROLE + PERMISSIONS ================= */
    const role = department === "HR" ? "HR_ADMIN" : "EMPLOYEE";

    const permissions =
      role === "HR_ADMIN"
        ? ["manage_users", "manage_statutory", "view_payroll"]
        : [];

    /* ================= CREATE LOGIN USER ================= */
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      permissions,
      organizationId: req.user.organizationId,
    });

    /* ================= GENERATE EMPLOYEE CODE ================= */
    const employeeCode = await generateEmployeeCode(dateOfJoining);

    /* ================= CREATE EMPLOYEE RECORD ================= */
    const employee = await Employee.create({
      employeeCode,
      name,
      email: normalizedEmail,
      department,
      designation,
      dateOfJoining,
      organizationId: req.user.organizationId,
      userId: user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error("EMPLOYEE CREATE ERROR:", error);
    return res.status(500).json({
      message: "Failed to create employee",
      error: error.message,
    });
  }
});

/* =====================================================
   GET ALL EMPLOYEES (ORG-WISE)
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const employees = await Employee.find({
      organizationId: req.user.organizationId,
    })
      .sort({ createdAt: -1 })
      .select("-__v");

    return res.json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("FETCH EMPLOYEE ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
});

/* =====================================================
   GET SINGLE EMPLOYEE
===================================================== */
router.get("/:employeeCode", auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      employeeCode: req.params.employeeCode,
      organizationId: req.user.organizationId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(employee);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/* =====================================================
   DELETE EMPLOYEE
===================================================== */
router.delete("/:employeeCode", auth, async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete({
      employeeCode: req.params.employeeCode,
      organizationId: req.user.organizationId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await User.findByIdAndDelete(employee.userId);

    return res.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/* =====================================================
   MODULE 11 — EMPLOYEE DASHBOARD
===================================================== */
router.get("/dashboard/overview", auth, async (req, res) => {
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
    return res.status(500).json({
      message: "Failed to load employee dashboard",
    });
  }
});

module.exports = router;
