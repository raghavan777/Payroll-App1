import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import { appRoutes } from "./routes/routeConfig";

import toast, { useToaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load auth pages for better performance
const Login = lazy(() => import("./pages/Login"));
const RegisterOrg = lazy(() => import("./pages/RegisterOrg"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white font-semibold">Loading...</p>
    </div>
  </div>
);

// --- Premium Toast System ---
const TOAST_CONFIG = {
  success: {
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    bg: 'linear-gradient(135deg, rgba(10, 20, 35, 0.97) 0%, rgba(16, 185, 129, 0.07) 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#10b981" opacity="0.15" />
        <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="2" fill="none" />
        <path d="M8 12.5L10.5 15L16 9" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Success',
  },
  error: {
    color: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.25)',
    bg: 'linear-gradient(135deg, rgba(10, 20, 35, 0.97) 0%, rgba(244, 63, 94, 0.07) 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#f43f5e" opacity="0.15" />
        <circle cx="12" cy="12" r="9" stroke="#f43f5e" strokeWidth="2" fill="none" />
        <path d="M9 9L15 15M15 9L9 15" stroke="#f43f5e" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    title: 'Error',
  },
  loading: {
    color: '#818cf8',
    glow: 'rgba(129, 140, 248, 0.25)',
    bg: 'linear-gradient(135deg, rgba(10, 20, 35, 0.97) 0%, rgba(129, 140, 248, 0.07) 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="premium-toast-spinner">
        <circle cx="12" cy="12" r="9" stroke="rgba(129,140,248,0.2)" strokeWidth="2.5" fill="none" />
        <path d="M12 3a9 9 0 0 1 9 9" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </svg>
    ),
    title: 'Processing',
  },
  blank: {
    color: '#60a5fa',
    glow: 'rgba(96, 165, 250, 0.15)',
    bg: 'linear-gradient(135deg, rgba(10, 20, 35, 0.97) 0%, rgba(96, 165, 250, 0.05) 100%)',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#60a5fa" opacity="0.15" />
        <circle cx="12" cy="12" r="9" stroke="#60a5fa" strokeWidth="2" fill="none" />
        <circle cx="12" cy="8" r="1.2" fill="#60a5fa" />
        <rect x="11" y="11" width="2" height="6" rx="1" fill="#60a5fa" />
      </svg>
    ),
    title: 'Info',
  },
};

function PremiumToaster() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts
        .filter((t) => t.visible)
        .map((t) => {
          const config = TOAST_CONFIG[t.type] || TOAST_CONFIG.blank;
          const message = typeof t.message === 'function' ? t.message(t) : t.message;

          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                background: config.bg,
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                border: `1px solid rgba(255, 255, 255, 0.08)`,
                borderLeft: `4px solid ${config.color}`,
                borderRadius: '16px',
                padding: '16px 18px',
                maxWidth: '420px',
                minWidth: '300px',
                boxShadow: `0 24px 64px -16px rgba(0, 0, 0, 0.55), 0 0 32px -8px ${config.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                animation: t.visible
                  ? 'premiumToastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                  : 'premiumToastOut 0.3s cubic-bezier(0.4, 0, 1, 1) forwards',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '80px',
                height: '100%',
                background: `linear-gradient(90deg, ${config.glow}, transparent)`,
                opacity: 0.4,
                pointerEvents: 'none',
              }} />

              {/* Icon */}
              <div style={{
                flexShrink: 0,
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: `rgba(255,255,255,0.04)`,
                border: `1px solid rgba(255,255,255,0.06)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1,
              }}>
                {config.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: config.color,
                  marginBottom: '3px',
                  opacity: 0.9,
                }}>
                  {config.title}
                </div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#e2e8f0',
                  lineHeight: 1.45,
                  letterSpacing: '-0.01em',
                }}>
                  {message}
                </div>
              </div>

              {/* Close button */}
              {t.type !== 'loading' && (
                <button
                  onClick={() => toast.dismiss(t.id)}
                  style={{
                    flexShrink: 0,
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    position: 'relative',
                    zIndex: 1,
                    fontSize: '14px',
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.color = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.04)';
                    e.target.style.color = '#64748b';
                  }}
                >
                  ✕
                </button>
              )}

              {/* Progress bar */}
              {t.type !== 'loading' && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '0 0 16px 16px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${config.color}, transparent)`,
                    borderRadius: '0 0 16px 16px',
                    animation: `premiumToastProgress ${t.duration || 3500}ms linear forwards`,
                    opacity: 0.6,
                  }} />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <PremiumToaster />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register-org" element={<RegisterOrg />} />

              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                {appRoutes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Route>

              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
