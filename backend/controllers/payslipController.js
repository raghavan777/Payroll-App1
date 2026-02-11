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
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(18).text("PAYSLIP", { align: "center" });
    doc.moveDown();

    doc.text(`Employee: ${employee.name}`);
    doc.text(`Employee Code: ${employee.employeeCode}`);
    doc.text(`Period: ${payPeriod}`);
    doc.text(`Issue Date: ${issueDate.toDateString()}`);
    doc.moveDown();

    doc.text("EARNINGS");
    Object.entries(earnings).forEach(([k, v]) =>
      doc.text(`${k}: ${toNumber(v).toFixed(2)}`)
    );
    doc.moveDown();

    doc.text("DEDUCTIONS");
    Object.entries(deductions).forEach(([k, v]) =>
      doc.text(`${k}: ${toNumber(v).toFixed(2)}`)
    );
    doc.moveDown();

    doc.text(`Net Salary: ${toNumber(netSalary).toFixed(2)}`, {
      underline: true,
    });

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

    const existing = await Payslip.findOne({ payrollId });
    if (existing)
      return res.status(409).json({ message: "Payslip already exists" });

    const { earnings, deductions, netSalary } =
      buildSalaryBreakdown(payroll);

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

    const payslip = await Payslip.create({
      employeeId: employee._id,
      payrollId: payroll._id,
      earnings,
      deductions,
      netSalary,
      payPeriod,
      issueDate,
      pdfUrl,
    });

    await logAction({
      userId: req.user.id,
      organizationId: req.user.organizationId,
      action: "PAYSLIP_GENERATED",
      module: "PAYSLIP",
      details: { payrollId, employeeCode: employee.employeeCode },
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

    return res.status(201).json({
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
