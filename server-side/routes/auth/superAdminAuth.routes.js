import express from "express";
import {
  loginSuperAdmin,
  logoutSuperAdmin,
  getCurrentSuperAdmin,
} from "../../controllers/auth/superadminAuth.controller.js";
import { isSuperAdmin } from "../../middleware/isSuperAdmin.js";

const router = express.Router();

router.post("/login", loginSuperAdmin);
router.post("/logout", isSuperAdmin, logoutSuperAdmin);
router.get("/me", isSuperAdmin, getCurrentSuperAdmin);
export default router;
