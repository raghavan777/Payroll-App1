import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  MdPeople,
  MdAttachMoney,
  MdAccessTime,
  MdAnalytics,
  MdAccountBalance,
  MdBusiness,
  MdPendingActions,
  MdReceipt,
  MdPerson
} from "react-icons/md";

export default function Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    axios
      .get("http://localhost:5000/api/users/stats", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setStats({ users: res.data.totalUsers }))
      .catch(() => setStats({ users: 0 }));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Dashboard Overview
      </h2>

      {/* Greeting Card */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <h3 className="text-lg font-medium text-gray-800">
          Welcome back, {user?.name || "User"} 👋
        </h3>
        <p className="text-gray-500 text-sm mt-1">
          Role:{" "}
          <span className="text-violet-600 font-semibold">
            {role || "Loading..."}
          </span>
        </p>
      </div>

      {/* Role Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {role === "SUPER_ADMIN" && (
          <SuperAdminWidgets stats={stats} navigate={navigate} />
        )}
        {role === "HR_ADMIN" && <HRWidgets navigate={navigate} />}
        {role === "EMPLOYEE" && <EmployeeWidgets navigate={navigate} />}
      </div>

      {/* SUPER ADMIN ONLY PANELS */}
      {role === "SUPER_ADMIN" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-2">Organization Overview</h3>
            <p className="text-gray-600 text-sm">
              Your organization is active with{" "}
              <b>{stats.users}</b> users.
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
            <button
              onClick={() => navigate("/users")}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
            >
              Manage Users
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== REUSABLE WIDGET ===================== */

function Widget({ icon, title, value, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition"
    >
      <div className={`p-3 rounded-lg text-white ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

/* ================= SUPER ADMIN WIDGETS ====================== */

function SuperAdminWidgets({ stats, navigate }) {
  return (
    <>
      <Widget
        icon={<MdBusiness size={24} />}
        title="Organization Status"
        value="Active"
        color="bg-violet-500"
      />

      <Widget
        icon={<MdPeople size={24} />}
        title="Users"
        value={stats.users}
        color="bg-indigo-500"
        onClick={() => navigate("/users")}
      />

      <Widget
        icon={<MdAttachMoney size={24} />}
        title="Payroll Engine"
        value="Configured"
        color="bg-fuchsia-500"
      />

      <Widget
        icon={<MdAnalytics size={24} />}
        title="Compliance"
        value="On Track"
        color="bg-teal-500"
      />
    </>
  );
}

/* ===================== HR WIDGETS ===================== */

function HRWidgets() {
  return (
    <>
      <Widget
        icon={<MdAccessTime size={24} />}
        title="Attendance"
        value="94%"
        color="bg-violet-500"
      />
      <Widget
        icon={<MdAttachMoney size={24} />}
        title="Payroll"
        value="Pending"
        color="bg-indigo-500"
      />
      <Widget
        icon={<MdPendingActions size={24} />}
        title="Approvals"
        value="3 Pending"
        color="bg-orange-500"
      />
      <Widget
        icon={<MdAnalytics size={24} />}
        title="Reports"
        value="Enabled"
        color="bg-green-500"
      />
    </>
  );
}

/* ===================== EMPLOYEE WIDGETS ===================== */

function EmployeeWidgets() {
  return (
    <>
      <Widget
        icon={<MdReceipt size={24} />}
        title="Payslip"
        value="Available"
        color="bg-violet-500"
      />
      <Widget
        icon={<MdAccessTime size={24} />}
        title="Attendance"
        value="Present"
        color="bg-indigo-500"
      />
      <Widget
        icon={<MdAccountBalance size={24} />}
        title="Tax"
        value="View"
        color="bg-teal-500"
      />
      <Widget
        icon={<MdPerson size={24} />}
        title="Profile"
        value="Complete"
        color="bg-fuchsia-500"
      />
    </>
  );
}
