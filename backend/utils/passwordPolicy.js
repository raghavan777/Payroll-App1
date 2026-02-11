module.exports = function validatePassword(password) {
  const minLength = /.{8,}/;
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const number = /[0-9]/;
  const special = /[^A-Za-z0-9]/;

  if (!minLength.test(password)) return "Password must be at least 8 characters";
  if (!uppercase.test(password)) return "Password must contain an uppercase letter";
  if (!lowercase.test(password)) return "Password must contain a lowercase letter";
  if (!number.test(password)) return "Password must contain a number";
  if (!special.test(password)) return "Password must contain a special character";

  return null;
};
