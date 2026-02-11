export const sidebarItems = {
  SUPER_ADMIN: [
    { path: "/dashboard", label: "Dashboard", icon: "MdDashboard" },
    { path: "/users", label: "Employees", icon: "MdPeople" },
    { path: "/add-employee", label: "Add Employee", icon: "MdPersonAdd" },
    { path: "/payroll-profiles", label: "Payroll Profiles", icon: "MdListAlt" }, // <-- Module-3
    { path: "/tax-slab", label: "Tax Slab", icon: "MdPayments" },
    { path: "/tax/slabs", label: "Tax Slab Form", icon: "MdReceiptLong" },
    { path: "/tax/declarations/new", label: "Tax Declaration Form", icon: "MdDescription" },
    { path: "/tax/declarations", label: "Tax Declaration List", icon: "MdListAlt" },
    { path: "/statutory", label: "Statutory Config", icon: "MdGavel" },
    { path: "/salary-template", label: "Salary Templates", icon: "MdCalculate" },
    {
      label: "Payroll",
      icon: "MdPayments",
      children: [
        { label: "Run Payroll", path: "/run-payroll", permission: "run_payroll" },
        { label: "Payroll Preview", path: "/payroll-preview", permission: "run_payroll" },
        { label: "Payroll Approve", path: "/payroll-approve", permission: "approve_payroll" },
        { label: "Payroll History", path: "/payroll-history", permission: "view_reports" },
      ],
    }
  ],

  HR_ADMIN: [
    { path: "/dashboard", label: "Dashboard", icon: "MdDashboard" },
    { path: "/payroll-profiles", label: "Payroll Profiles", icon: "MdListAlt" }, // <-- Module-3
    { path: "/salary-template", label: "Salary Templates", icon: "MdCalculate" },
    {
      label: "Payroll",
      icon: "MdPayments",
      children: [
        { label: "Run Payroll", path: "/run-payroll", permission: "run_payroll" },
        { label: "Payroll Preview", path: "/payroll-preview", permission: "run_payroll" },
        { label: "Payroll Approve", path: "/payroll-approve", permission: "approve_payroll" },
        { label: "Payroll History", path: "/payroll-history", permission: "view_reports" },
      ],
    }
  ],
  EMPLOYEE: [
    { path: "/dashboard", label: "Dashboard", icon: "MdDashboard" },
    { path: "/payroll-history", label: "Payroll History", icon: "MdHistory" },
    { path: "/tax/my-details", label: "My Tax Details", icon: "MdReceiptLong" },
    { path: "/tax/projection", label: "Tax Projection", icon: "MdCalculate" }
  ]
};
