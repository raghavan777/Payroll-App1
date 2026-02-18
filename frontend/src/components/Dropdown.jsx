import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdKeyboardArrowDown, MdCheck } from "react-icons/md";

export default function Dropdown({
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    label,
    icon: Icon,
    error,
    disabled = false,
    className = "",
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
    const triggerRef = useRef(null);
    const panelRef = useRef(null);

    // Calculate position when opening
    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                left: rect.left,
                width: rect.width,
            });
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                triggerRef.current && !triggerRef.current.contains(event.target) &&
                panelRef.current && !panelRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Close on scroll/resize
    useEffect(() => {
        if (!isOpen) return;
        const handleClose = () => setIsOpen(false);
        window.addEventListener("scroll", handleClose, true);
        window.addEventListener("resize", handleClose);
        return () => {
            window.removeEventListener("scroll", handleClose, true);
            window.removeEventListener("resize", handleClose);
        };
    }, [isOpen]);

    const handleSelect = (option) => {
        if (disabled) return;
        const optionValue = typeof option === "object" ? option.value : option;
        onChange({ target: { value: optionValue, name: label } });
        setIsOpen(false);
    };

    // Find selected label
    const selectedOption = options.find((opt) => {
        const optValue = typeof opt === "object" ? opt.value : opt;
        return optValue === value;
    });

    const displayValue = selectedOption
        ? typeof selectedOption === "object"
            ? selectedOption.label
            : selectedOption
        : placeholder;

    return (
        <div className={`relative w-full ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                    {label}
                </label>
            )}

            <div
                ref={triggerRef}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
          relative flex items-center justify-between w-full px-4 py-3.5 
          bg-white/[0.06] backdrop-blur-xl border 
          ${error ? "border-rose-500/50 bg-rose-500/10" : "border-white/10 hover:border-indigo-400/50"}
          ${isOpen ? "border-indigo-500/60 ring-4 ring-indigo-500/15" : ""}
          ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:bg-white/[0.09]"}
          rounded-xl transition-all duration-200 group
        `}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {Icon && <Icon className={`text-lg ${isOpen ? "text-indigo-400" : "text-slate-400 group-hover:text-indigo-400"}`} />}
                    <span className={`truncate font-medium ${!selectedOption ? "text-slate-500" : "text-white"}`}>
                        {displayValue}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-400 flex-shrink-0 ml-2"
                >
                    <MdKeyboardArrowDown size={20} />
                </motion.div>
            </div>

            {/* Portal-based dropdown panel to avoid overflow clipping */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            ref={panelRef}
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                top: dropdownPos.top,
                                left: dropdownPos.left,
                                width: dropdownPos.width,
                                zIndex: 9999,
                            }}
                            className="bg-slate-900/95 backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl shadow-black/50 max-h-60 overflow-y-auto custom-scrollbar p-1.5"
                        >
                            {options.length > 0 ? (
                                options.map((option, index) => {
                                    const optValue = typeof option === "object" ? option.value : option;
                                    const optLabel = typeof option === "object" ? option.label : option;
                                    const isSelected = optValue === value;

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleSelect(option)}
                                            className={`
                      flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150
                      ${isSelected
                                                    ? "bg-indigo-500/20 text-indigo-300 font-semibold"
                                                    : "text-slate-300 hover:bg-white/[0.08] hover:text-white"}
                    `}
                                        >
                                            <span className="truncate">{optLabel}</span>
                                            {isSelected && <MdCheck className="text-indigo-400 text-lg flex-shrink-0 ml-2" />}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-3 text-sm text-slate-500 text-center italic">
                                    No options available
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            {error && (
                <p className="mt-1.5 ml-1 text-xs font-semibold text-rose-400 flex items-center gap-1 animate-pulse">
                    {error}
                </p>
            )}
        </div>
    );
}
