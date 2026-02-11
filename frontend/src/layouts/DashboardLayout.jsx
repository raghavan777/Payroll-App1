import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sidebarItems } from "../config/sidebarConfig";
import * as Icons from "react-icons/md";
import { useState } from "react";

export default function DashboardLayout() {
  const { role, hasPermission, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const currentRole = role || "SUPER_ADMIN";

  const renderIcon = (name) => {
    const Icon = Icons[name];
    return Icon ? <Icon size={22} /> : null;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* SIDEBAR */}
      <aside
        className={`${isOpen ? "w-64" : "w-20"
          } bg-gradient-to-b from-violet-600 to-indigo-600 text-white flex flex-col transition-all duration-300`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4">
          {isOpen && <span className="text-lg font-bold">Payroll SaaS</span>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 bg-white/10 hover:bg-white/20 rounded-md"
          >
            {isOpen ? (
              <Icons.MdChevronLeft size={20} />
            ) : (
              <Icons.MdChevronRight size={20} />
            )}
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {(sidebarItems[currentRole] || []).map((item, idx) => {
            if (item.permission && !hasPermission(item.permission)) return null;

            /* =====================
               PARENT MENU (Payroll)
            ===================== */
            if (item.children) {
              return (
                <div key={idx}>
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === item.label ? null : item.label)
                    }
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-md hover:bg-black/10 transition"
                  >
                    {renderIcon(item.icon)}
                    {isOpen && (
                      <>
                        <span className="text-sm font-medium flex-1 text-left">
                          {item.label}
                        </span>
                        {openMenu === item.label ? (
                          <Icons.MdExpandLess />
                        ) : (
                          <Icons.MdExpandMore />
                        )}
                      </>
                    )}
                  </button>

                  {/* CHILD ITEMS */}
                  {openMenu === item.label &&
                    isOpen &&
                    item.children
                      .filter(
                        (child) =>
                          !child.permission ||
                          hasPermission(child.permission)
                      )
                      .map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `ml-10 flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${isActive
                              ? "bg-black/30"
                              : "hover:bg-black/10"
                            }`
                          }
                        >
                          {renderIcon(child.icon)}
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                </div>
              );
            }

            /* =====================
               NORMAL SINGLE LINK
            ===================== */
            return (
              <NavLink
                key={idx}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-md transition ${isActive ? "bg-black/20" : "hover:bg-black/10"
                  }`
                }
              >
                {renderIcon(item.icon)}
                {isOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-3 py-3 text-red-200 hover:bg-red-500/20 transition mx-2 mb-3 rounded"
        >
          <Icons.MdLogout size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
