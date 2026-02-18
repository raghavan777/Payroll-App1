import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sidebarItems } from '../config/sidebarConfig';
import * as MdIcons from 'react-icons/md';

const Icon = ({ name, size = 20 }) => {
    const IconComponent = MdIcons[name];
    return IconComponent ? <IconComponent size={size} /> : <MdIcons.MdHelpOutline size={size} />;
};

export default function TopNavigation({ onOpenCommandPalette }) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const { role } = useAuth();

    const currentRole = role || 'EMPLOYEE';
    const routes = sidebarItems[currentRole] || sidebarItems['EMPLOYEE'];

    const toggleDropdown = (label) => {
        setOpenDropdown(openDropdown === label ? null : label);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    return (
        <nav className="flex items-center gap-6">
            {routes.map((item) => {
                if (item.children) {
                    const isOpen = openDropdown === item.label;
                    return (
                        <div
                            key={item.label}
                            className="relative"
                            onMouseLeave={closeDropdown}
                        >
                            <button
                                onClick={() => toggleDropdown(item.label)}
                                onMouseEnter={() => setOpenDropdown(item.label)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
                            >
                                <Icon name={item.icon} size={18} />
                                <span>{item.label}</span>
                                <MdIcons.MdExpandMore
                                    size={16}
                                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {isOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 glass-panel rounded-xl shadow-xl overflow-hidden animate-slide-in-down z-50">
                                    {item.children.map((child) => (
                                        <NavLink
                                            key={child.path}
                                            to={child.path}
                                            onClick={closeDropdown}
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-4 py-3 transition-all ${isActive
                                                    ? 'bg-indigo-50 text-indigo-600 font-semibold'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                                }`
                                            }
                                        >
                                            <Icon name={child.icon || 'MdCircle'} size={16} />
                                            <span className="text-sm">{child.label}</span>
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
                            `flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-medium ${isActive
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-slate-700 hover:text-indigo-600 hover:bg-indigo-50'
                            }`
                        }
                    >
                        <Icon name={item.icon} size={18} />
                        <span>{item.label}</span>
                    </NavLink>
                );
            })}

            {/* Quick Search Button */}
            <button
                onClick={onOpenCommandPalette}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-200 hover:border-indigo-200"
            >
                <MdIcons.MdSearch size={18} />
                <span className="text-sm hidden xl:inline">Quick search</span>
                <kbd className="hidden xl:inline px-1.5 py-0.5 bg-slate-100 rounded text-xs">⌘K</kbd>
            </button>
        </nav>
    );
}
