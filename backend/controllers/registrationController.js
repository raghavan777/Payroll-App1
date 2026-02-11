const validatePassword = require("../utils/passwordPolicy");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).json({ message: passwordError });

  // ... continue normal registration
};
