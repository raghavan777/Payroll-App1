import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as MdIcons from 'react-icons/md';

const actionsByRoute = {
    '/dashboard/employees': [
        { icon: 'MdPersonAdd', label: 'Add Employee', path: '/dashboard/employees/add' },
        { icon: 'MdUpload', label: 'Import', action: 'import' },
    ],
    '/dashboard/payroll': [
        { icon: 'MdPlayArrow', label: 'Run Payroll', path: '/dashboard/payroll/run' },
        { icon: 'MdHistory', label: 'History', path: '/dashboard/payroll/history' },
    ],
    '/dashboard/salary-templates': [
        { icon: 'MdAdd', label: 'New Template', path: '/dashboard/salary-templates/create' },
    ],
    '/dashboard/tax-management': [
        { icon: 'MdAdd', label: 'New Declaration', path: '/dashboard/tax-management/declaration/create' },
    ],
};

export default function FloatingActionButton() {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    const actions = actionsByRoute[location.pathname] || [];

    if (actions.length === 0) return null;

    return (
        <div className="fixed bottom-8 right-8 z-50">
            {/* Expanded Actions */}
            {isExpanded && (
                <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-2 animate-slide-in-up">
                    {actions.map((action, index) => {
                        const IconComponent = MdIcons[action.icon];
                        return (
                            <button
                                key={index}
                                onClick={() => {
                                    if (action.path) {
                                        window.location.href = action.path;
                                    } else if (action.action) {
                                        // Handle custom actions
                                        console.log('Action:', action.action);
                                    }
                                    setIsExpanded(false);
                                }}
                                className="flex items-center gap-3 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover-lift group"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <span className="text-sm font-medium whitespace-nowrap">{action.label}</span>
                                <div className="w-10 h-10 bg-indigo-100 group-hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-all">
                                    <IconComponent size={20} className="text-indigo-600 group-hover:text-white transition-colors" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Main FAB Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-14 h-14 rounded-full bg-gradient-primary text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center ${isExpanded ? 'rotate-45 scale-110' : 'hover:scale-110'
                    } animate-glow`}
            >
                <MdIcons.MdAdd size={28} />
            </button>
        </div>
    );
}
