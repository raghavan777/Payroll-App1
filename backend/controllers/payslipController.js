const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const Payslip = require("../models/Payslip");
const { logAction } = require("./auditController");

const { createNotification } = require("./notificationController");

const PUBLIC_PAYSLIP_DIR = path.join(__dirname, "..", "public", "payslips");

/* =====================================================
   HELPERS
===================================================== */

const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const totalFromObject = (obj) =>
  Object.values(obj).reduce((sum, value) => sum + toNumber(value), 0);

const normalizePeriod = (dateValue) => {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "N/A";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const buildSalaryBreakdown = (payroll) => {
  const earnings = {
    basic: toNumber(payroll.basic),
    hra: toNumber(payroll.hra),
    allowances: toNumber(payroll.allowances),
    overtimePay: toNumber(payroll.overtimePay),
  };

  const deductions = {
    pf: toNumber(payroll.pf),
    esi: toNumber(payroll.esi),
    professionalTax: toNumber(payroll.professionalTax),
    tax: toNumber(payroll.tax),
    lopAmount: toNumber(payroll.lopAmount),
  };

  const earningsTotal = totalFromObject(earnings);
  const deductionsTotal = totalFromObject(deductions);

  let netSalary = toNumber(payroll.netSalary);
  if (!netSalary) netSalary = earningsTotal - deductionsTotal;

  netSalary = Number(Math.max(0, netSalary).toFixed(2));

  return { earnings, deductions, netSalary };
};

/* =====================================================
   PDF GENERATOR
===================================================== */

const generatePayslipPdf = async ({
  payroll,
  employee,
  earnings,
  deductions,
  netSalary,
  payPeriod,
  issueDate,
}) => {
  await fs.promises.mkdir(PUBLIC_PAYSLIP_DIR, { recursive: true });

  const fileName = `payslip-${employee.employeeCode}-${Date.now()}.pdf`;
  const filePath = path.join(PUBLIC_PAYSLIP_DIR, fileName);
  const pdfUrl = `/public/payslips/${fileName}`;

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const stream = fs.createWriteStream(filePath);
    const PDFService = require("../services/pdfService");
    const pdfService = new PDFService(doc);

    doc.pipe(stream);

    // 1. Header
    pdfService.drawHeader("PAYSLIP", `Period: ${payPeriod}`);

    // 2. Entity Details
    pdfService.drawEntityDetails(
      {
        title: "EMPLOYEE SUMMARY",
        items: [
          { value: employee.name, subValue: employee.employeeCode },
          { value: employee.designation || "Employee", subValue: employee.department || "" }
        ]
      },
      {
        title: "PAYROLL DETAILS",
        items: [
          { label: "Pay Period", value: payPeriod },
          { label: "Issue Date", value: issueDate.toLocaleDateString() },
          { label: "Bank Account", value: "****" + (payroll.accountNumber?.slice(-4) || "N/A") }
        ]
      }
    );

    // 3. Salary Computation Table
    const rows = [];

    // Earnings Section
    Object.entries(earnings).forEach(([key, value]) => {
      if (toNumber(value) > 0) {
        rows.push({ label: key.charAt(0).toUpperCase() + key.slice(1), value: value });
      }
    });
    // Gross Total (Optional, but good for clarity. Let's calculate it to be safe)
    const totalEarnings = Object.values(earnings).reduce((a, b) => a + toNumber(b), 0);
    rows.push({ label: "GROSS EARNINGS", value: totalEarnings, isTotal: true });

    // Deductions Section
    Object.entries(deductions).forEach(([key, value]) => {
      if (toNumber(value) > 0) {
        rows.push({ label: key.charAt(0).toUpperCase() + key.slice(1), value: value });
      }
    });
    const totalDeductions = Object.values(deductions).reduce((a, b) => a + toNumber(b), 0);
    rows.push({ label: "TOTAL DEDUCTIONS", value: totalDeductions, isTotal: true });

    // Net Salary
    rows.push({ label: "NET SALARY PAYABLE", value: netSalary, isHighlight: true });

    pdfService.drawSummaryTable("SALARY COMPUTATION", rows, 250);

    // 5. Footer
    pdfService.drawFooter(payroll._id);

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  return { filePath, pdfUrl };
};

/* =====================================================
   GENERATE PAYSLIP
===================================================== */

exports.generatePayslip = async (req, res) => {
  try {
    const { payrollId } = req.body;
    if (!payrollId)
      return res.status(400).json({ message: "payrollId required" });

    const payroll = await Payroll.findById(payrollId);
    if (!payroll)
      return res.status(404).json({ message: "Payroll not found" });

    if (payroll.status !== "APPROVED")
      return res
        .status(400)
        .json({ message: "Payroll must be APPROVED first" });

    if (
      String(payroll.organizationId) !== String(req.user.organizationId)
    )
      return res.status(403).json({ message: "Access denied" });

    const employee = await Employee.findOne({
      employeeCode: payroll.employeeCode,
      organizationId: payroll.organizationId,
    });

    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    let payslip = await Payslip.findOne({ payrollId });

    const { earnings, deductions, netSalary } = buildSalaryBreakdown(payroll);
    const payPeriod = normalizePeriod(payroll.periodStart);
    const issueDate = new Date();

    const { pdfUrl } = await generatePayslipPdf({
      payroll,
      employee,
      earnings,
      deductions,
      netSalary,
      payPeriod,
      issueDate,
    });

    if (payslip) {
      // Update existing payslip
      payslip.earnings = earnings;
      payslip.deductions = deductions;
      payslip.netSalary = netSalary;
      payslip.pdfUrl = pdfUrl;
      payslip.issueDate = issueDate;
      await payslip.save();
    } else {
      // Create new payslip
      payslip = await Payslip.create({
        employeeId: employee._id,
        payrollId: payroll._id,
        earnings,
        deductions,
        netSalary,
        payPeriod,
        issueDate,
        pdfUrl,
      });
    }

    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "PAYSLIP_GENERATED",
      module: "PAYSLIP",
      details: { payrollId, employeeCode: employee.employeeCode, isRegenerated: !!payslip },
      req
    });

    /* ================= CREATE NOTIFICATION (SAFE) ================= */
    await createNotification({
      userId: employee.userId,
      organizationId: payroll.organizationId,
      title: "Payslip Generated",
      message: `Your payslip for ${new Date(
        payroll.periodStart
      ).toLocaleDateString()} is ready.`,
      type: "PAYSLIP",
    });

    const fullUrl = `${req.protocol}://${req.get("host")}${pdfUrl}`;

    return res.status(200).json({
      message: "Payslip generated successfully",
      payslip,
      pdfUrl: fullUrl,
    });
  } catch (error) {
    console.error("PAYSLIP ERROR:", error);
    res.status(500).json({ message: "Failed to generate payslip" });
  }
};

/* =====================================================
   GET PAYSLIP BY ID
===================================================== */

exports.getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id).populate(
      "employeeId"
    );

    if (!payslip)
      return res.status(404).json({ message: "Payslip not found" });

    const payroll = await Payroll.findById(payslip.payrollId);

    if (
      String(payroll.organizationId) !== String(req.user.organizationId)
    )
      return res.status(403).json({ message: "Access denied" });

    const fileName = path.basename(payslip.pdfUrl);
    const filePath = path.join(PUBLIC_PAYSLIP_DIR, fileName);

    return res.sendFile(filePath);
  } catch (error) {
    console.error("GET PAYSLIP ERROR:", error);
    res.status(500).json({ message: "Failed to fetch payslip" });
  }
};
