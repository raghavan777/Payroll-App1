import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sidebarItems } from "../config/sidebarConfig";
import * as MdIcons from "react-icons/md";

// Helper to render icon by name
const Icon = ({ name, size = 20 }) => {
  const IconComponent = MdIcons[name];
  return IconComponent ? <IconComponent size={size} /> : <MdIcons.MdHelpOutline size={size} />;
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});

  const { user, role, logout } = useAuth();
  const currentRole = role || "EMPLOYEE";

  const routes = sidebarItems[currentRole] || sidebarItems["EMPLOYEE"];

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const renderNavLink = (item) => (
    <NavLink
      key={item.path}
      to={item.path}
      style={({ isActive }) => ({
        display: "block",
        padding: "10px",
        margin: "6px 0",
        borderRadius: "6px",
        textDecoration: "none",
        color: "#fff",
        fontSize: "14px",
        background: isActive ? "rgba(255,255,255,0.2)" : "transparent",
        transition: "0.2s",
      })}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: collapsed ? "center" : "flex-start" }}>
        <Icon name={item.icon} />
        {!collapsed && <span>{item.label}</span>}
      </div>
    </NavLink>
  );

  return (
    <div style={{ display: "flex" }}>
      {/* ================= SIDEBAR ================= */}
      <div
        style={{
          width: collapsed ? "70px" : "230px",
          background: "linear-gradient(180deg,#6a11cb,#2575fc)",
          color: "#fff",
          minHeight: "100vh",
          padding: "15px",
          transition: "0.3s",
        }}
      >
        {/* ===== HEADER ===== */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {!collapsed && <h3>Payroll SaaS</h3>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "transparent",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            {collapsed ? "➡" : "⬅"}
          </button>
        </div>

        {/* ===== MENU ===== */}
        <div style={{ marginTop: "20px" }}>
          {routes.map((item) => {
            if (item.children) {
              const isOpen = openMenus[item.label];
              return (
                <div key={item.label}>
                  <div
                    onClick={() => toggleMenu(item.label)}
                    style={{
                      padding: "20px",
                      margin: "6px 0",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "transparent",
                      transition: "0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: collapsed ? "center" : "flex-start" }}>
                      <Icon name={item.icon} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && <span>{isOpen ? "▾" : "▸"}</span>}
                  </div>
                  {isOpen && !collapsed && (
                    <div style={{ paddingLeft: "20px" }}>
                      {item.children.map(child => renderNavLink({ ...child, icon: "MdSubdirectoryArrowRight" }))}
                    </div>
                  )}
                </div>
              );
            }
            return renderNavLink(item);
          })}

          <button
            onClick={logout}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "20px",
              border: "none",
              background: "rgba(255, 0, 0, 1)",
              color: "#fff",
              borderRadius: "6px",
              cursor: "pointer",
              textAlign: collapsed ? "center" : "left",
              fontSize: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: collapsed ? "center" : "flex-start" }}>
              <MdIcons.MdLogout size={20} />
              {!collapsed && <span>Logout</span>}
            </div>
          </button>
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f6fa", minHeight: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
}
