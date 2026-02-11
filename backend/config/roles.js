module.exports = {
  SUPER_ADMIN: [
    "manage_org",
    "manage_compliance",
    "manage_users",
    "run_payroll",
    "view_reports",
    "view_dashboard",
    "ADD_USER",
    "VIEW_USER",
    "configure_tax",
    "configure_statutory",
    "view_payroll",
    "view_self"
  ],
  HR_ADMIN: [
    "manage_users",
    "manage_employee_profiles",
    "view_dashboard",
    "ADD_USER",
    "VIEW_USER",
    "run_payroll",
    "view_reports",
    "view_payroll"

  ],
  PAYROLL_ADMIN: [
    "manage_salary_structure",
    "run_payroll",
    "generate_payslips"
  ],
  MANAGER: [
    "approve_attendance",
    "approve_leave"
  ],
  EMPLOYEE: [
    "view_self"
  ]
};
