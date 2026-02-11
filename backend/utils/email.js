const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (email, token) => {
  const link = `http://localhost:5000/api/auth/verify-org/${token}`;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: `"Payroll SaaS" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Organization",
    html: `
      <p>Welcome to Payroll SaaS!</p>
      <p>Please verify your organization by clicking the link below:</p>
      <a href="${link}">Verify Organization</a>
    `
  });
};

exports.sendInviteEmail = async (email, token) => {
  const inviteUrl = `http://localhost:5173/accept-invite/${token}`;

  await transporter.sendMail({
    from: `"Payroll SaaS" <no-reply@payroll.com>`,
    to: email,
    subject: "You're invited to join the organization",
    html: `
      <h3>You've been invited!</h3>
      <p>Click below to set up your account:</p>
      <a href="${inviteUrl}">Accept Invite</a>
    `
  });
};
