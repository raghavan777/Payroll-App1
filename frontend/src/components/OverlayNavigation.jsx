import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as MdIcons from "react-icons/md";
import { sidebarItems } from "../config/sidebarConfig";

export default function OverlayNavigation({ isOpen, onClose }) {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const currentRole = role || "EMPLOYEE";
    const routes = sidebarItems[currentRole] || sidebarItems["EMPLOYEE"];

    const handleLogout = () => {
        logout();
        onClose();
        navigate("/login");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 hover:rotate-90 transition-all z-50"
                    >
                        <MdIcons.MdClose size={32} />
                    </button>

                    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">

                        {/* Left: Branding & Message */}
                        <div className="hidden lg:flex flex-col justify-center space-y-8 text-white p-12">
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black shadow-xl shadow-indigo-500/50"
                            >
                                P
                            </motion.div>
                            <motion.h1
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl font-black tracking-tighter leading-none"
                            >
                                Payroll Management <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Pro System</span>
                            </motion.h1>
                            <motion.p
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-lg text-indigo-100 max-w-md font-medium"
                            >
                                Navigate your institutional protocols with precision and speed.
                            </motion.p>
                        </div>

                        {/* Right: Navigation Links */}
                        <nav className="flex flex-col space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar p-4">
                            {routes.map((item, index) => {
                                const Icon = MdIcons[item.icon] || MdIcons.MdCircle;
                                return (
                                    <motion.div
                                        key={item.path || item.label}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + (index * 0.05) }}
                                    >
                                        {item.children ? (
                                            <div className="group">
                                                <div className="text-indigo-300 drop-shadow-[0_2px_10px_rgba(99,102,241,0.5)] text-xs font-black uppercase tracking-[3px] mb-3 mt-6 px-4">{item.label}</div>
                                                <div className="pl-4 space-y-2 border-l-2 border-white/10 ml-4 transition-all group-hover:border-indigo-500/30">
                                                    {item.children.map((child) => (
                                                        <NavLink
                                                            key={child.path}
                                                            to={child.path}
                                                            onClick={onClose}
                                                            className={({ isActive }) =>
                                                                `flex items-center gap-3 text-lg md:text-xl font-black py-2.5 transition-all drop-shadow-sm ${isActive ? 'text-white translate-x-3 scale-105' : 'text-slate-300 hover:text-white hover:translate-x-1.5'
                                                                }`
                                                            }
                                                        >
                                                            {child.label}
                                                        </NavLink>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <NavLink
                                                to={item.path}
                                                onClick={onClose}
                                                className={({ isActive }) =>
                                                    `flex items-center gap-4 p-4 rounded-[24px] transition-all group drop-shadow-md ${isActive
                                                        ? 'bg-white text-indigo-950 shadow-[0_20px_40px_rgba(0,0,0,0.2)] scale-105'
                                                        : 'text-white hover:text-white hover:bg-white/10'
                                                    }`
                                                }
                                            >
                                                <div className={`p-2.5 rounded-xl ${window.location.pathname === item.path ? 'bg-indigo-100 text-indigo-600' : 'bg-white/5 group-hover:bg-white/10'
                                                    }`}>
                                                    <Icon size={24} />
                                                </div>
                                                <span className="text-xl md:text-2xl font-black tracking-tight">{item.label}</span>
                                            </NavLink>
                                        )}
                                    </motion.div>
                                );
                            })}

                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                onClick={handleLogout}
                                className="mt-6 flex items-center gap-3 p-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-2xl transition-all w-full md:w-auto"
                            >
                                <MdIcons.MdLogout size={24} />
                                <span className="text-lg font-bold">Sign Out</span>
                            </motion.button>
                        </nav>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
