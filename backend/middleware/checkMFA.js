module.exports = (req, res, next) => {
  if (req.user.mfaEnabled) {
    if (!req.headers['x-mfa-verified']) {
      return res.status(401).json({ requireMFA: true, message: "MFA Required" });
    }
  }
  next();
};
