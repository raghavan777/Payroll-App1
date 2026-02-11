const jwt = require("jsonwebtoken");

/**
 * Protect middleware
 * - Verifies JWT token
 * - Attaches decoded user to req.user
 */
exports.protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      role: decoded.role,
      organizationId: decoded.organizationId,
      employeeCode: decoded.employeeCode,
      permissions: decoded.permissions
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

/**
 * Role-based authorization for Payroll Profile
 */
exports.authorizeHR = (req, res, next) => {
  const role = req.user?.role;

  if (!role) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const allowedRoles = [
    "SUPER_ADMIN",
    "HR_ADMIN",
    "PAYROLL_ADMIN",
    "Super Admin",
    "HR Admin",
    "Payroll Admin",
  ];

  if (!allowedRoles.includes(role)) {
    return res.status(403).json({ message: "Access Denied" });
  }

  next();
};
