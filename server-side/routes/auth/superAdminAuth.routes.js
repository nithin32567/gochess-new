import express from "express";
import {
  loginSuperAdmin,
  logoutSuperAdmin,
  getCurrentSuperAdmin,
} from "../../controllers/auth/superadminAuth.controller.js";
import { authCheckMiddleware } from "../../middleware/authCheckMiddleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";
const router = express.Router();

router.post("/login", loginSuperAdmin);
router.post(
  "/logout",
  authCheckMiddleware,
  authorizeRoles("superadmin"),
  logoutSuperAdmin
);
router.get(
  "/me",
  authCheckMiddleware,
  authorizeRoles("superadmin"),
  getCurrentSuperAdmin
);
export default router;
