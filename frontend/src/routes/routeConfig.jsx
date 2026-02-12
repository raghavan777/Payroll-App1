import Dashboard from "../pages/Dashboard";
import AuditLogs from "../pages/AuditLogs";
import Employees from "../pages/Employees";
import MyTaxDetails from "../pages/MyTaxDetails";
import TaxProjection from "../pages/TaxProjection";
import AddEmployee from "../pages/AddEmployee";
import Payroll from "../pages/Payroll";
import PayslipList from "../pages/payslip/PayslipList";
import Reports from "../pages/reports/Reports";
import Notifications from "../pages/notifications/Notifications";
import Settings from "../pages/Settings";
import MyProfile from "../pages/MyProfile";
import Attendance from "../pages/Attendance";
import RunPayroll from "../pages/RunPayroll";
import SalaryTemplate from "../pages/SalaryTemplate";
import StatutoryConfig from "../pages/StatutoryConfig";
import TaxSlab from "../pages/TaxSlab";
import TaxDeclarationList from "../pages/TaxDeclarationList";

import PayrollPreview from "../pages/PayrollPreview";
import PayrollApproval from "../pages/PayrollApproval";
import PayrollHistory from "../pages/PayrollHistory";
import Analytics from "../pages/analytics/Analytics";

import PayrollProfileList from "../pages/PayrollProfileList";
import PayrollProfileForm from "../pages/PayrollProfileForm";
import PayrollProfileEdit from "../pages/PayrollProfileEdit";
import PayrollProfileView from "../pages/PayrollProfileView";
import SalaryPreview from "../pages/SalaryPreview";
import TaxSlabForm from "../pages/TaxSlabForm";
import TaxDeclarationForm from "../pages/TaxDeclarationForm";
import SalaryTemplateForm from "../pages/salary/SalaryTemplateForm";
import SalaryTemplateEdit from "../pages/SalaryTemplateEdit";

export const appRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        element: <Dashboard />,
        icon: "dashboard",
    },
    {
        path: "/employees",
        name: "Employees",
        element: <Employees />,
        icon: "users",
    },
    {
        path: "/users", // Sidebar alias
        name: "Employees",
        element: <Employees />,
        icon: "users",
    },
    {
        path: "/add-employee",
        name: "Add Employee",
        element: <AddEmployee />,
        icon: "user-plus",
    },
    {
        path: "/my-profile",
        name: "My Profile",
        element: <MyProfile />,
        icon: "user",
    },
    {
        path: "/attendance",
        name: "Attendance",
        element: <Attendance />,
        icon: "clock",
    },
    {
        path: "/run-payroll",
        name: "Run Payroll",
        element: <RunPayroll />,
        icon: "play-circle",
    },
    {
        path: "/payroll",
        name: "Payroll",
        element: <Payroll />,
        icon: "money",
    },
    {
        path: "/payroll-preview",
        name: "Payroll Preview",
        element: <PayrollPreview />,
        icon: "visibility",
    },
    {
        path: "/payroll-approve",
        name: "Payroll Approval",
        element: <PayrollApproval />,
        icon: "check-circle",
    },
    {
        path: "/payroll-history",
        name: "Payroll History",
        element: <PayrollHistory />,
        icon: "history",
    },
    {
        path: "/payslips",
        name: "Payslips",
        element: <PayslipList />,
        icon: "file",
    },
    {
        path: "/salary-templates",
        name: "Salary Templates",
        element: <SalaryTemplate />,
        icon: "file-text",
    },
    {
        path: "/salary-template", // Sidebar alias
        name: "Salary Template",
        element: <SalaryTemplate />,
        icon: "file-text",
    },
    {
        path: "/salary_template", // Alias support
        name: "Salary Template",
        element: <SalaryTemplate />,
        icon: "file-text",
    },
    {
        path: "/salary_templates", // Alias support
        name: "Salary Templates",
        element: <SalaryTemplate />,
        icon: "file-text",
    },
    {
        path: "/salary-template/create",
        name: "Create Salary Template",
        element: <SalaryTemplateForm />,
        icon: "plus",
    },
    {
        path: "/salary-template/edit/:id",
        name: "Edit Salary Template",
        element: <SalaryTemplateEdit />,
        icon: "edit",
    },
    {
        path: "/tax-config",
        name: "Tax Config",
        element: <TaxSlab />,
        icon: "file-text",
    },
    {
        path: "/tax-slab", // Sidebar alias
        name: "Tax Slab",
        element: <TaxSlab />,
        icon: "file-text",
    },
    {
        path: "/tax/slabs",
        name: "Tax Slab Form",
        element: <TaxSlabForm />,
        icon: "file-text",
    },
    {
        path: "/statutory",
        name: "Statutory Config",
        element: <StatutoryConfig />,
        icon: "file-text",
    },
    {
        path: "/tax-declarations",
        name: "Tax Declaration",
        element: <TaxDeclarationList />,
        icon: "file-text",
    },
    {
        path: "/tax/declarations", // Sidebar alias
        name: "Tax Declaration",
        element: <TaxDeclarationList />,
        icon: "file-text",
    },
    {
        path: "/tax/declarations/new",
        name: "New Tax Declaration",
        element: <TaxDeclarationForm />,
        icon: "file-text",
    },
    {
        path: "/tax/my-details",
        name: "My Tax Details",
        element: <MyTaxDetails />,
        icon: "receipt",
    },
    {
        path: "/tax/projection",
        name: "Tax Projection",
        element: <TaxProjection />,
        icon: "calculate",
    },
    {
        path: "/reports",
        name: "Reports",
        element: <Reports />,
        icon: "chart",
    },
    {
        path: "/audit-logs",
        name: "Audit Logs",
        element: <AuditLogs />,
        icon: "policy",
    },
    {
        path: "/analytics",
        name: "Analytics",
        element: <Analytics />,
        icon: "analytics",
    },
    {
        path: "/notifications",
        name: "Notifications",
        element: <Notifications />,
        icon: "bell",
    },
    {
        path: "/attendance/:employeeCode",
        name: "Employee Attendance",
        element: <Attendance />,
        icon: "clock",
    },
    {
        path: "/salary-preview/:id",
        name: "Salary Preview",
        element: <SalaryPreview />,
        icon: "visibility",
    },
    {
        path: "/settings",
        name: "Settings",
        element: <Settings />,
        icon: "settings",
    },
    {
        path: "/payroll-profiles",
        name: "Payroll Profiles",
        element: <PayrollProfileList />,
        icon: "list",
    },
    {
        path: "/payroll-profile/create",
        name: "Create Payroll Profile",
        element: <PayrollProfileForm />,
        icon: "plus",
    },
    {
        path: "/payroll-profile/:employeeCode",
        name: "View Payroll Profile",
        element: <PayrollProfileView />,
        icon: "user",
    },
    {
        path: "/payroll-profile/edit/:employeeCode",
        name: "Edit Payroll Profile",
        element: <PayrollProfileEdit />,
        icon: "edit",
    },
];
