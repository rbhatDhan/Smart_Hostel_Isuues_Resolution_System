import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//JWT token check
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

//Role check
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

export default router;