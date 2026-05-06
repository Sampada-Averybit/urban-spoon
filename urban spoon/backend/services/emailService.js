const nodemailer = require("nodemailer");

const getRequiredEnv = (key) => {
  const value = String(process.env[key] || "").trim();
  if (!value) {
    throw new Error(`${key} is not configured.`);
  }
  return value;
};

const createTransporter = () => {
  const host = getRequiredEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  const user = getRequiredEnv("SMTP_USER");
  const pass = getRequiredEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    // Render may fail on IPv6 routes for some SMTP endpoints; force IPv4.
    family: 4,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
    auth: { user, pass },
  });
};

async function sendPasswordResetEmail({ to, resetUrl, name }) {
  const from = getRequiredEnv("SMTP_FROM");
  const appName = String(process.env.APP_NAME || "Urban Spoon");
  const safeName = String(name || "there").trim();
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
    from,
    to,
    subject: `${appName} Password Reset`,
    text: `Hi ${safeName},

We received a request to reset your password.
Use this link to set a new password:
${resetUrl}

This link will expire in 15 minutes.
If you did not request this, you can ignore this email.
`,
    html: `
      <p>Hi ${safeName},</p>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetUrl}" target="_blank" rel="noopener noreferrer">
          Click here to reset your password
        </a>
      </p>
      <p>This link will expire in <strong>15 minutes</strong>.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
    });
  } catch (error) {
    // Log only operational context; never log SMTP password or secrets.
    console.error("[emailService] Failed to send password reset email", {
      to,
      smtpHost: process.env.SMTP_HOST || null,
      smtpPort: process.env.SMTP_PORT || null,
      smtpSecure: process.env.SMTP_SECURE || null,
      errorMessage: error?.message || "Unknown error",
      errorCode: error?.code || null,
      errorCommand: error?.command || null,
      errorResponseCode: error?.responseCode || null,
    });
    throw error;
  }
}

module.exports = { sendPasswordResetEmail };
