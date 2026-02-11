import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { sidebarItems } from "../config/sidebarConfig";
import * as MdIcons from "react-icons/md";
import { toast } from "react-hot-toast";

const Icon = ({ name, size = 20 }) => {
  const IconComponent = MdIcons[name];
  return IconComponent ? <IconComponent size={size} /> : <MdIcons.MdHelpOutline size={size} />;
};

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, role, logout } = useAuth();

  const currentRole = role || "EMPLOYEE";
  const routes = sidebarItems[currentRole] || sidebarItems["EMPLOYEE"];

  const toggleMenu = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      {/* --- SIDEBAR --- */}
      <aside
        className={`relative flex flex-col transition-all duration-300 ease-in-out z-50 ${collapsed ? "w-20" : "w-64"
          } bg-[#0f172a] text-slate-300 shadow-xl`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">P</div>
              <h3 className="font-bold text-lg text-white tracking-tight">Payroll Pro</h3>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:text-white transition-colors p-1"
          >
            <Icon name={collapsed ? "MdMenuOpen" : "MdMenu"} size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto mt-4 px-3 space-y-1">
          {routes.map((item) => {
            if (item.children) {
              const isOpen = openMenus[item.label];
              return (
                <div key={item.label} className="group mr-2">
                  <div
                    onClick={() => toggleMenu(item.label)}
                    className="flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-slate-800 hover:text-white transition-all duration-200"
                  >
                    <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
                      <Icon name={item.icon} size={22} className="text-slate-400 group-hover:text-indigo-400" />
                      {!collapsed && <span className="font-medium">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <MdIcons.MdExpandMore
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        size={18}
                      />
                    )}
                  </div>
                  {isOpen && !collapsed && (
                    <div className="ml-4 mt-1 border-l border-slate-800 pl-4 py-1 space-y-1">
                      {item.children.map(child => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `flex items-center gap-3 p-2 rounded-lg text-sm transition-all ${isActive ? "text-indigo-400 font-semibold" : "hover:text-white"
                            }`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-indigo-600/10 text-indigo-400 border-r-4 border-indigo-500 rounded-r-none font-semibold"
                    : "hover:bg-slate-800 hover:text-white"
                  } ${collapsed ? "justify-center mx-0" : ""}`
                }
              >
                <Icon name={item.icon} size={22} className={item.path === window.location.pathname ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-300"} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Section */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <MdIcons.MdLogout size={22} />
            {!collapsed && <span className="font-semibold">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Welcome back, <span className="text-indigo-600">{user?.name || "Member"}</span>
            </h2>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border border-slate-200">
              {currentRole.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`text-slate-400 hover:text-indigo-500 p-2 rounded-full hover:bg-slate-50 transition-all ${showNotifications ? 'bg-slate-50 text-indigo-500' : ''}`}
              >
                <MdIcons.MdNotificationsNone size={24} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <h3 className="font-black text-xs text-slate-800 uppercase tracking-widest">Intelligence Center</h3>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 New</span>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto">
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <MdIcons.MdVerifiedUser size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">Payroll Processing Complete</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Jan 2026 disbursement protocol has been finalized.</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                            <MdIcons.MdInfoOutline size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">New Compliance Update</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">Statutory parameters for 2026-27 have been updated.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-slate-50 text-[11px] font-black text-slate-500 hover:text-indigo-600 hover:bg-white transition-all uppercase tracking-widest">
                      View All Protocols
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">Online</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 border-2 border-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Area */}
        <section className="flex-1 overflow-y-auto p-8 lg:p-10 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}
