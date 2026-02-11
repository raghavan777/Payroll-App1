exports.requestMFA = async (req, res) => {
  const user = req.user;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  user.mfaCode = code;
  user.mfaExpires = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendEmail(user.email, `Your MFA Code is ${code}`);

  return res.json({ message: "MFA code sent" });
};
exports.verifyMFA = async (req, res) => {
  const { code } = req.body;
  const user = req.user;

  if (user.mfaCode !== code || user.mfaExpires < new Date()) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  user.mfaCode = null;
  user.mfaExpires = null;
  await user.save();

  return res.json({ message: "MFA verified" });
};
