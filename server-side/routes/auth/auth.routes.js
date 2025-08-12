import express from "express";
import {
  generatePassword,
  resendMail,
} from "../../controllers/auth.controller.js";

const router = express.Router();

router.post("/generate/password", generatePassword);
router.post("/resend-mail", resendMail);
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
});

export default router;
