import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sidebarItems } from '../config/sidebarConfig';
import * as MdIcons from 'react-icons/md';

const Icon = ({ name, size = 20 }) => {
    const IconComponent = MdIcons[name];
    return IconComponent ? <IconComponent size={size} /> : <MdIcons.MdHelpOutline size={size} />;
};

export default function CommandPalette({ isOpen, onClose }) {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const { role } = useAuth();

    const currentRole = role || 'EMPLOYEE';
    const routes = sidebarItems[currentRole] || sidebarItems['EMPLOYEE'];

    // Flatten all routes including nested children
    const allRoutes = routes.reduce((acc, item) => {
        if (item.children) {
            return [...acc, ...item.children.map(child => ({
                ...child,
                category: item.label
            }))];
        }
        return [...acc, { ...item, category: 'Main' }];
    }, []);

    // Filter routes based on search
    const filteredRoutes = allRoutes.filter(route =>
        route.label.toLowerCase().includes(search.toLowerCase()) ||
        route.category.toLowerCase().includes(search.toLowerCase())
    );

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev =>
                        prev < filteredRoutes.length - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (filteredRoutes[selectedIndex]) {
                        navigate(filteredRoutes[selectedIndex].path);
                        onClose();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    onClose();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, selectedIndex, filteredRoutes, navigate, onClose]);

    // Reset selection when search changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    // Reset search when closed
    useEffect(() => {
        if (!isOpen) {
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Command Palette */}
            <div
                className="relative z-10 flex items-start justify-center pt-[15vh] px-4 h-full"
                onClick={onClose}
            >
                <div
                    className="w-full max-w-2xl glass-morphic rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-white/10">
                        <MdIcons.MdSearch size={24} className="text-white/60" />
                        <input
                            type="text"
                            placeholder="Search pages... (type to filter)"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                            className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-lg"
                        />
                        <kbd className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">ESC</kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {filteredRoutes.length === 0 ? (
                            <div className="p-8 text-center text-white/40">
                                <MdIcons.MdSearchOff size={48} className="mx-auto mb-3 opacity-50" />
                                <p>No pages found</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                {filteredRoutes.map((route, index) => (
                                    <button
                                        key={route.path}
                                        onClick={() => {
                                            navigate(route.path);
                                            onClose();
                                        }}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${index === selectedIndex
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/70 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${index === selectedIndex ? 'bg-white/20' : 'bg-white/10'
                                            }`}>
                                            <Icon name={route.icon} size={20} />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <div className="font-semibold">{route.label}</div>
                                            <div className="text-xs text-white/40">{route.category}</div>
                                        </div>
                                        {index === selectedIndex && (
                                            <MdIcons.MdKeyboardReturn size={16} className="text-white/40" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-3 border-t border-white/10 bg-white/5 text-xs text-white/40">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑</kbd>
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↓</kbd>
                                Navigate
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                                Select
                            </span>
                        </div>
                        <span>{filteredRoutes.length} results</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
