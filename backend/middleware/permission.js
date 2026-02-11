module.exports = (perm) => {
  return (req, res, next) => {
    // DEBUG LOGGING
    console.log(`[Permission Check] Required: ${perm}`);
    console.log(`[Permission Check] User Role: ${req.user?.role}`);
    console.log(`[Permission Check] User Permissions:`, req.user?.permissions);

    if (!req.user?.permissions?.includes(perm)) {
      console.log("[Permission Check] ❌ DENIED");
      return res.status(403).json({ message: "Forbidden: Missing Permission" });
    }
    console.log("[Permission Check] ✅ GRANTED");
    next();
  };
};
