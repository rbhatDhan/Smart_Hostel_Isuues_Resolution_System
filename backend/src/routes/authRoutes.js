import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import User from "../models/User.js"; // ✅ added

const router = express.Router();

// ================= AUTH =================
router.post("/register", registerUser);
router.post("/login", loginUser);

// ================= PROFILE =================
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

// ================= ROLE CHECK =================

// ✅ Admin only
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

// ✅ Warden only
router.get(
  "/warden",
  protect,
  authorizeRoles("warden"),
  (req, res) => {
    res.json({ message: "Welcome Warden" });
  }
);

// ✅ Admin + Warden (shared access)
router.get(
  "/staff",
  protect,
  authorizeRoles("admin", "warden"),
  (req, res) => {
    res.json({ message: "Welcome Staff" });
  }
);

// ================= ADMIN FEATURE =================

// ✅ Get all users (Admin only)
router.get(
  "/users",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;