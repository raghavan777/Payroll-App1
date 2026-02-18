import toast from "react-hot-toast";

/**
 * Premium toast wrapper that adds custom styling via react-hot-toast's
 * built-in custom rendering. We use the `toast()` function with
 * render callbacks to create animated, glowing toasts.
 */

const successIcon = `
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#10b981"/>
    <path d="M6.5 11.5L9.5 14.5L15.5 8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
`;

const errorIcon = `
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#f43f5e"/>
    <path d="M8 8L14 14M14 8L8 14" stroke="white" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;

const infoIcon = `
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <circle cx="11" cy="11" r="11" fill="#818cf8"/>
    <circle cx="11" cy="7" r="1.2" fill="white"/>
    <rect x="10" y="9.5" width="2" height="6" rx="1" fill="white"/>
  </svg>
`;

const loadingIcon = `
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="toast-spinner">
    <circle cx="11" cy="11" r="9" stroke="#334155" stroke-width="2.5"/>
    <path d="M11 2C6.03 2 2 6.03 2 11" stroke="#818cf8" stroke-width="2.5" stroke-linecap="round"/>
  </svg>
`;

export const premiumToast = {
    success: (message) =>
        toast.success(message, {
            icon: "🎉",
        }),

    error: (message) =>
        toast.error(message, {
            icon: "✖",
        }),

    loading: (message) =>
        toast.loading(message),

    info: (message) =>
        toast(message, {
            icon: "ℹ️",
            style: {
                borderLeft: "4px solid #818cf8",
                background:
                    "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(129, 140, 248, 0.08) 100%)",
            },
        }),

    promise: (promise, msgs) => toast.promise(promise, msgs),
};

export default premiumToast;
