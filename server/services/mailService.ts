import nodemailer, { Transporter } from "nodemailer";

let transporterPromise: Promise<Transporter> | null = null;

function buildTransporter(): Promise<Transporter> {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return Promise.resolve(
      nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }),
    );
  }

  // No real SMTP creds configured: fall back to a disposable Ethereal test
  // inbox so program-assignment emails can still be exercised end-to-end
  // locally. Ethereal never delivers to real inboxes; view sends via the
  // preview URL logged to the console.
  return nodemailer.createTestAccount().then((testAccount) => {
    console.warn(
      `No SMTP_USER/SMTP_PASS set; using an auto-generated Ethereal test inbox (${testAccount.user}). ` +
        `Emails will NOT reach real recipients — check the server console for a preview link after each send.`,
    );
    return nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  });
}

function getTransporter(): Promise<Transporter> {
  if (!transporterPromise) {
    transporterPromise = buildTransporter();
  }
  return transporterPromise;
}

const MailService = {
  async sendProgramAssignmentEmail(to: string, customerName: string, programName: string, description?: string) {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "Prime Gym <no-reply@primegym.test>",
      to,
      subject: `New Routine Assigned: ${programName}`,
      text: `Hi ${customerName},\n\nYou have been assigned a new workout routine: ${programName}.\n${description ? `\n${description}\n` : ""}\nSee you at the gym!`,
      html: `<p>Hi ${customerName},</p><p>You have been assigned a new workout routine: <strong>${programName}</strong>.</p>${description ? `<p>${description}</p>` : ""}<p>See you at the gym!</p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Program assignment email preview (Ethereal): ${previewUrl}`);
    }
  },

  async sendPasswordResetEmail(to: string, resetUrl: string) {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "Prime Gym <no-reply@primegym.test>",
      to,
      subject: "Reset your Prime Gym password",
      text: `We received a request to reset your password.\n\nReset it here: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, you can ignore this email.`,
      html: `<p>We received a request to reset your password.</p><p><a href="${resetUrl}">Click here to reset your password</a></p><p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`Password reset email preview (Ethereal): ${previewUrl}`);
    }
  },

  async sendOtpEmail(to: string, otp: string) {
    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER || "Prime Gym <no-reply@primegym.test>",
      to,
      subject: "Verify your Prime Gym account",
      text: `Welcome to Prime Gym!\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes. If you didn't request this, you can ignore this email.`,
      html: `<p>Welcome to Prime Gym!</p><p>Your verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;">${otp}</p><p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`OTP email preview (Ethereal): ${previewUrl}`);
    }
  },
};

export default MailService;
