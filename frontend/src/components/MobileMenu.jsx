import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sidebarItems } from '../config/sidebarConfig';
import * as MdIcons from 'react-icons/md';

const Icon = ({ name, size = 20 }) => {
    const IconComponent = MdIcons[name];
    return IconComponent ? <IconComponent size={size} /> : <MdIcons.MdHelpOutline size={size} />;
};

export default function MobileMenu({ isOpen, onClose }) {
    const [openMenus, setOpenMenus] = useState({});
    const { role } = useAuth();

    const currentRole = role || 'EMPLOYEE';
    const routes = sidebarItems[currentRole] || sidebarItems['EMPLOYEE'];

    const toggleMenu = (label) => {
        setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Menu Drawer */}
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-slate-900 shadow-2xl animate-slide-in-left overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
                            P
                        </div>
                        <h3 className="font-bold text-xl text-white">Payroll</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-2"
                    >
                        <MdIcons.MdClose size={24} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="p-4 space-y-2">
                    {routes.map((item) => {
                        if (item.children) {
                            const isOpen = openMenus[item.label];
                            return (
                                <div key={item.label}>
                                    <button
                                        onClick={() => toggleMenu(item.label)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon name={item.icon} size={22} />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <MdIcons.MdExpandMore
                                            size={20}
                                            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-800 pl-4">
                                            {item.children.map(child => (
                                                <NavLink
                                                    key={child.path}
                                                    to={child.path}
                                                    onClick={onClose}
                                                    className={({ isActive }) =>
                                                        `flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${isActive
                                                            ? 'bg-indigo-600 text-white font-semibold'
                                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                        }`
                                                    }
                                                >
                                                    <Icon name={child.icon || 'MdCircle'} size={16} />
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
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 p-4 rounded-xl transition-all ${isActive
                                        ? 'bg-indigo-600 text-white font-semibold'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                <Icon name={item.icon} size={22} />
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
