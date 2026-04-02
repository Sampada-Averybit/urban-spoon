const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");

const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
};

function getModelForRole(role) {
  if (role === ROLES.ADMIN) return Admin;
  if (role === ROLES.USER) return User;
  return null;
}

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const role = String(decoded?.role || "").toUpperCase();
      const Model = getModelForRole(role);
      if (!Model || !decoded?.id) {
        return res.status(401).json({ message: "Not authorized, token failed" });
      }

      // Get user from the token
      const principal = await Model.findById(decoded.id).select("-password");
      if (!principal) {
        return res.status(401).json({ message: "Not authorized, token failed" });
      }

      req.user = principal;
      req.authRole = role;

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  const allowedRoles = roles.map((role) => String(role).toUpperCase());
  const currentRole = String(req.authRole || "").toUpperCase();

  if (!allowedRoles.includes(currentRole)) {
    return res.status(403).json({ message: "Forbidden: insufficient permissions" });
  }

  return next();
};

module.exports = { protect, authorizeRoles, ROLES };
