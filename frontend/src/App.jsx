import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

/* ================= PUBLIC PAGES ================= */
import Login from "./pages/Login";
import RegisterOrg from "./pages/RegisterOrg";
import VerifyOrgPage from "./pages/VerifyOrgPage";

/* ================= LAYOUT ================= */
import DashboardLayout from "./layouts/DashboardLayout";

/* ================= MODULE 1 ================= */
import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import AddEmployee from "./pages/AddEmployee";
import Payroll from "./pages/Payroll";

/* ================= MODULE 2 ================= */
import RunPayroll from "./pages/RunPayroll";
import TaxSlab from "./pages/TaxSlab";
import StatutoryConfig from "./pages/StatutoryConfig";
import TaxSlabForm from "./pages/TaxSlabForm";
import TaxDeclarationForm from "./pages/TaxDeclarationForm";
import TaxDeclarationList from "./pages/TaxDeclarationList";
import MyTaxDetails from "./pages/MyTaxDetails";
import TaxProjection from "./pages/TaxProjection";

/* ================= MODULE 3 ================= */
import PayrollProfileForm from "./pages/PayrollProfileForm";
import PayrollProfileList from "./pages/PayrollProfileList";
import PayrollProfileView from "./pages/PayrollProfileView";
import PayrollProfileEdit from "./pages/PayrollProfileEdit";

/* ================= MODULE 4 ================= */
import SalaryTemplateList from "./pages/salary/SalaryTemplateList";
import SalaryTemplateForm from "./pages/salary/SalaryTemplateForm";
import SalaryTemplateEdit from "./pages/SalaryTemplateEdit";
import SalaryPreview from "./pages/salary/SalaryPreview";
import AssignTemplate from "./pages/salary/AssignTemplate";

/* ================= MODULE 5 ================= */
import Attendance from "./pages/Attendance";

/* ================= MODULE 6 ================= */
import PayrollPreview from "./pages/PayrollPreview";
import PayrollApproval from "./pages/PayrollApproval";
import PayrollHistory from "./pages/PayrollHistory";

/* ================= MODULE 7 ================= */
import PayslipList from "./pages/payslip/PayslipList";

/* ================= MODULE 8 ================= */
import TaxDeclaration from "./pages/tax/TaxDeclaration";

/* ================= MODULE 9 ================= */
import Reports from "./pages/reports/Reports";

/* ================= MODULE 10 ================= */
import Analytics from "./pages/analytics/Analytics";

/* ================= MODULE 11 ================= */
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";

/* ================= MODULE 12 ================= */
import Notifications from "./pages/notifications/Notifications";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register-org" element={<RegisterOrg />} />
          <Route path="/verify-org/:status" element={<VerifyOrgPage />} />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* ================= PROTECTED ROUTES ================= */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* ===== MODULE 1 ===== */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/add-employee" element={<AddEmployee />} />
            <Route path="/payroll" element={<Payroll />} />

            {/* ===== MODULE 2 ===== */}
            <Route path="/run-payroll" element={<RunPayroll />} />
            <Route path="/tax-slab" element={<TaxSlab />} />
            <Route path="/tax/slabs" element={<TaxSlabForm />} />
            <Route path="/tax/declarations/new" element={<TaxDeclarationForm />} />
            <Route path="/tax/declarations" element={<TaxDeclarationList />} />
            <Route path="/tax/my-details" element={<MyTaxDetails />} />
            <Route path="/tax/projection" element={<TaxProjection />} />
            <Route path="/statutory" element={<StatutoryConfig />} />

            {/* ===== MODULE 3 ===== */}
            <Route path="/payroll-profile/create" element={<PayrollProfileForm />} />
            <Route path="/payroll-profiles" element={<PayrollProfileList />} />
            <Route path="/payroll-profile/:employeeCode" element={<PayrollProfileView />} />
            <Route path="/payroll-profile/edit/:employeeCode" element={<PayrollProfileEdit />} />

            {/* ===== MODULE 4 ===== */}
            <Route path="/salary-template" element={<SalaryTemplateList />} />
            <Route path="/salary-template/new" element={<SalaryTemplateForm />} />
            <Route path="/salary-template/edit/:id" element={<SalaryTemplateEdit />} />
            <Route path="/salary-preview/:id" element={<SalaryPreview />} />
            <Route path="/assign-template/:id" element={<AssignTemplate />} />

            {/* ===== MODULE 5 ===== */}
            <Route path="/attendance/:employeeCode" element={<Attendance />} />

            {/* ===== MODULE 6 ===== */}
            <Route path="/payroll-preview" element={<PayrollPreview />} />
            <Route path="/payroll-approve" element={<PayrollApproval />} />
            <Route path="/payroll-history" element={<PayrollHistory />} />

            {/* ===== MODULE 7 ===== */}
            <Route path="/payslips" element={<PayslipList />} />

            {/* ===== MODULE 8 ===== */}
            <Route path="/tax-declaration" element={<TaxDeclaration />} />

            {/* ===== MODULE 9 ===== */}
            <Route path="/reports" element={<Reports />} />

            {/* ===== MODULE 10 ===== */}
            <Route path="/analytics" element={<Analytics />} />

            {/* ===== MODULE 11 ===== */}
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

            {/* ===== MODULE 12 ===== */}
            <Route path="/notifications" element={<Notifications />} />
          </Route>

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
