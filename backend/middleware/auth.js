const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach EVERYTHING needed downstream
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      name: decoded.name,
      permissions: decoded.permissions,
      organizationId: decoded.organizationId,
      employeeCode: decoded.employeeCode // <--- Added this to allow access in controllers
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
