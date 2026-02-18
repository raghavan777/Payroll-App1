import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import * as MdIcons from "react-icons/md";
import { useAuth } from "../context/AuthContext";
// import DownloadTaxButton from "./DownloadTaxButton"; // Assuming this exists or we mock it

export default function DashboardNavigationCards() {
    const navigate = useNavigate();
    const { role } = useAuth();

    // Define cards based on the requirements
    // [ Payroll History ] [ Tax Details ] [ Tax Projection ] [ Download Payslip ]

    // Role-based card configuration
    const getCardsByRole = (userRole) => {
        const role = userRole || "EMPLOYEE";

        switch (role) {
            case "SUPER_ADMIN":
                return [
                    {
                        label: "Employees",
                        path: "/users",
                        icon: "MdPeople",
                        color: "from-blue-500 to-indigo-600",
                        desc: "Manage organization workforce"
                    },
                    {
                        label: "Payroll Profiles",
                        path: "/payroll-profiles",
                        icon: "MdListAlt",
                        color: "from-emerald-500 to-teal-600",
                        desc: "Configure employee salary structures"
                    },
                    {
                        label: "Tax Slab",
                        path: "/tax-slab",
                        icon: "MdPayments",
                        color: "from-amber-500 to-orange-600",
                        desc: "Manage tax regimes and slabs"
                    },
                    {
                        label: "Reports",
                        path: "/reports",
                        icon: "MdBarChart",
                        color: "from-rose-500 to-pink-600",
                        desc: "View system analytics and logs"
                    }
                ];
            case "HR_ADMIN":
                return [
                    {
                        label: "Run Payroll",
                        path: "/run-payroll",
                        icon: "MdPayments",
                        color: "from-blue-500 to-indigo-600",
                        desc: "Execute monthly payroll process"
                    },
                    {
                        label: "Payroll Profiles",
                        path: "/payroll-profiles",
                        icon: "MdListAlt",
                        color: "from-emerald-500 to-teal-600",
                        desc: "Manage employee profiles"
                    },
                    {
                        label: "Salary Templates",
                        path: "/salary-template",
                        icon: "MdCalculate",
                        color: "from-amber-500 to-orange-600",
                        desc: "Configure salary components"
                    },
                    {
                        label: "Payroll History",
                        path: "/payroll-history",
                        icon: "MdHistory",
                        color: "from-rose-500 to-pink-600",
                        desc: "View past payroll records"
                    }
                ];
            case "EMPLOYEE":
            default:
                return [
                    {
                        label: "Payroll History",
                        path: "/payroll-history",
                        icon: "MdHistory",
                        color: "from-blue-500 to-indigo-600",
                        desc: "View all your past payslips"
                    },
                    {
                        label: "My Tax Details",
                        path: "/tax/my-details",
                        icon: "MdReceiptLong",
                        color: "from-emerald-500 to-teal-600",
                        desc: "Manage taxdeclarations"
                    },
                    {
                        label: "Tax Projection",
                        path: "/tax/projection",
                        icon: "MdTrendingUp",
                        color: "from-amber-500 to-orange-600",
                        desc: "Forecast tax liabilities"
                    },
                    {
                        label: "Download Payslip",
                        path: "/payroll-history",
                        icon: "MdFileDownload",
                        color: "from-rose-500 to-pink-600",
                        desc: "Get latest salary slip"
                    }
                ];
        }
    };

    const cards = getCardsByRole(role);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
            {cards.map((card, index) => {
                const Icon = MdIcons[card.icon];
                return (
                    <motion.div
                        key={index}
                        whileHover={{ y: -16, scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => navigate(card.path)}
                        className="cursor-pointer relative overflow-hidden premium-card border-2 border-white/5 group-hover:border-white/20 shadow-2xl shadow-indigo-600/5 group-hover:shadow-[0_20px_60px_-15px] p-8 group flex flex-col h-full transition-all duration-500"
                        style={{
                            '--hover-shadow-color': card.color.includes('blue') ? 'rgba(59, 130, 246, 0.5)' :
                                card.color.includes('emerald') ? 'rgba(16, 185, 129, 0.5)' :
                                    card.color.includes('amber') ? 'rgba(245, 158, 11, 0.5)' :
                                        'rgba(236, 72, 153, 0.5)'
                        }}
                    >
                        {/* Animated Background Gradient - Full Card Coverage on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-20 transition-all duration-700 ease-out`} />

                        {/* Radial Glow Effect */}
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${card.color} opacity-0 rounded-full blur-3xl -mr-32 -mt-32 group-hover:opacity-30 group-hover:scale-150 transition-all duration-700`} />

                        {/* Bottom Left Accent Glow */}
                        <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${card.color} opacity-0 rounded-full blur-2xl -ml-24 -mb-24 group-hover:opacity-20 transition-all duration-700 delay-100`} />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                                style={{
                                    boxShadow: 'var(--hover-shadow-color) 0px 10px 40px -10px'
                                }}>
                                <Icon size={28} />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-black text-white mb-2 group-hover:scale-105 group-hover:text-white transition-all tracking-tight origin-left duration-300">
                                    {card.label}
                                </h3>
                                <p className="text-sm text-slate-300 group-hover:text-white/90 font-medium leading-relaxed opacity-90 transition-colors duration-300">
                                    {card.desc}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-indigo-400 group-hover:text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <span>Execute Protocol</span>
                                <MdIcons.MdArrowForward size={14} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
