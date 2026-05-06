const User = require("../models/User");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { ROLES } = require("../middleware/authMiddleware");
const { sendPasswordResetEmail } = require("../services/emailService");

const ADMIN_EMAIL_SUFFIX = "@urbanspoon.com";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();
const isAdminEmail = (email) => normalizeEmail(email).endsWith(ADMIN_EMAIL_SUFFIX);

const signAuthToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
const PASSWORD_RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const PASSWORD_SPECIAL_CHARACTER_REGEX = /[@#$%&*]/;

const buildAuthResponse = (principal, role, token) => ({
  _id: principal._id,
  name: principal.name,
  email: principal.email,
  phone: principal.phone,
  role: String(role || "").toLowerCase(),
  token,
});

const getCurrentPrincipalModel = (req) => {
  const role = String(req.authRole || "").toUpperCase();
  if (role === ROLES.ADMIN) return Admin;
  if (role === ROLES.USER) return User;
  return null;
};

const getPasswordValidationMessage = (password) => {
  const value = String(password || "");
  if (!value) return "Password is required.";
  if (value.length < 6) return "Password must be at least 6 characters.";
  if (!PASSWORD_SPECIAL_CHARACTER_REGEX.test(value)) {
    return "Password must include at least one special character (@, #, $, %, &, *).";
  }
  return "";
};

const findPrincipalByEmail = async (normalizedEmail) => {
  let principal = await Admin.findOne({ email: normalizedEmail });
  let role = ROLES.ADMIN;

  if (!principal) {
    principal = await User.findOne({ email: normalizedEmail });
    role = ROLES.USER;
  }

  return { principal, role };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const normalizedEmail = normalizeEmail(email);

    const [userExists, adminExists] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      Admin.findOne({ email: normalizedEmail }),
    ]);

    if (userExists || adminExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = isAdminEmail(normalizedEmail) ? ROLES.ADMIN : ROLES.USER;
    const Model = role === ROLES.ADMIN ? Admin : User;

    const principal = await Model.create({
      name,
      email: normalizedEmail,
      phone,
      password: hashedPassword,
    });

    const token = signAuthToken(principal._id, role);
    res.status(201).json(buildAuthResponse(principal, role, token));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = normalizeEmail(email);

    const { principal, role } = await findPrincipalByEmail(normalizedEmail);

    if (!principal) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, principal.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = signAuthToken(principal._id, role);
    res.status(200).json(buildAuthResponse(principal, role, token));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const normalizedEmail = normalizeEmail(req.body?.email);
    if (!normalizedEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const { principal } = await findPrincipalByEmail(normalizedEmail);
    if (!principal) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    principal.resetPasswordToken = hashedResetToken;
    principal.resetPasswordExpires = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MS);
    await principal.save();

    const frontendBaseUrl = String(process.env.FRONTEND_URL || "").trim();
    if (!frontendBaseUrl) {
      return res.status(500).json({ message: "FRONTEND_URL is not configured." });
    }

    const resetUrl = `${frontendBaseUrl.replace(/\/+$/g, "")}/reset-password/${resetToken}`;
    try {
      await sendPasswordResetEmail({
        to: principal.email,
        resetUrl,
        name: principal.name,
      });
    } catch (mailError) {
      principal.resetPasswordToken = null;
      principal.resetPasswordExpires = null;
      await principal.save();
      throw mailError;
    }

    return res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const rawToken = String(req.params?.token || "").trim();
    const { newPassword, confirmPassword } = req.body || {};

    if (!rawToken) {
      return res.status(400).json({ message: "Reset token is required." });
    }
    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ message: "New password and confirm password are required." });
    }
    const passwordValidationMessage = getPasswordValidationMessage(newPassword);
    if (passwordValidationMessage) {
      return res.status(400).json({ message: passwordValidationMessage });
    }
    if (String(newPassword) !== String(confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const tokenFilter = {
      resetPasswordToken: hashedResetToken,
      resetPasswordExpires: { $gt: new Date() },
    };

    let principal = await Admin.findOne(tokenFilter);
    if (!principal) {
      principal = await User.findOne(tokenFilter);
    }
    if (!principal) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    principal.password = hashedPassword;
    principal.resetPasswordToken = null;
    principal.resetPasswordExpires = null;
    await principal.save();

    return res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const Model = getCurrentPrincipalModel(req);
    if (!Model || !req.user?._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const principal = await Model.findById(req.user._id);

    if (principal) {
      res.json({
        _id: principal._id,
        name: principal.name,
        email: principal.email,
        phone: principal.phone,
        role: principal.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const trimmedName = String(name).trim();
    const normalizedEmail = String(email).trim().toLowerCase();
    const trimmedPhone = String(phone).trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const Model = getCurrentPrincipalModel(req);
    if (!Model) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const principal = await Model.findById(req.user._id);
    if (!principal) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const role = String(req.authRole || "").toUpperCase();
    const isAdminTargetEmail = isAdminEmail(normalizedEmail);
    if ((role === ROLES.ADMIN && !isAdminTargetEmail) || (role === ROLES.USER && isAdminTargetEmail)) {
      return res.status(400).json({ message: "Email does not match account type" });
    }

    const userEmailFilter = { email: normalizedEmail };
    if (role === ROLES.USER) {
      userEmailFilter._id = { $ne: principal._id };
    }

    const adminEmailFilter = { email: normalizedEmail };
    if (role === ROLES.ADMIN) {
      adminEmailFilter._id = { $ne: principal._id };
    }

    const [existingUserWithEmail, existingAdminWithEmail] = await Promise.all([
      User.findOne(userEmailFilter),
      Admin.findOne(adminEmailFilter),
    ]);

    if (existingUserWithEmail || existingAdminWithEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    principal.name = trimmedName;
    principal.email = normalizedEmail;
    principal.phone = trimmedPhone;

    const updatedPrincipal = await principal.save();

    return res.status(200).json({
      _id: updatedPrincipal._id,
      name: updatedPrincipal.name,
      email: updatedPrincipal.email,
      phone: updatedPrincipal.phone,
      role: updatedPrincipal.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

const changeUserPassword = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }
    const passwordValidationMessage = getPasswordValidationMessage(newPassword);
    if (passwordValidationMessage) {
      return res.status(400).json({ message: passwordValidationMessage });
    }

    const Model = getCurrentPrincipalModel(req);
    if (!Model) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const principal = await Model.findById(req.user._id);
    if (!principal) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const isMatch = await bcrypt.compare(currentPassword, principal.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    principal.password = hashedPassword;
    await principal.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
};
