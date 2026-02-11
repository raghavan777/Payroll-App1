import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Login handler
  const login = (token) => {
    localStorage.setItem("token", token);

    const decoded = jwtDecode(token);

    setUser({
      token,
      name: decoded.name,
      role: decoded.role,
      permissions: decoded.permissions || [],
      organizationId: decoded.organizationId
    });

    setLoading(false);
  };

  // 🔄 Restore user from localStorage on refresh
  const loadUser = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      setUser({
        token,
        name: decoded.name,
        role: decoded.role,
        permissions: decoded.permissions || [],
        organizationId: decoded.organizationId
      });
    } catch (err) {
      // Invalid / expired token
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  // 🔐 Permission check
  const hasPermission = (perm) => {
    return Array.isArray(user?.permissions) && user.permissions.includes(perm);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token: user?.token || null,
        role: user?.role || null,
        isAuthenticated: !!user, // 🔥 CRITICAL FIX
        loading,
        login,
        logout,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
