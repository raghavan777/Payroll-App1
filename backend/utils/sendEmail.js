// Simple wrapper used by MFA and generic notifications
module.exports = async function sendEmail(to, message) {
  console.log(`📧 DEV EMAIL → To: ${to} | Message: ${message}`);
  return true;
};
