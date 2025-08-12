import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByTenant,
  getUsersByRole,
  searchUsers,
  toggleUserStatus,
  requestPasswordReset,
  getUsersCount,
} from "../../controllers/user/user.controller.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  loginUser,
  getCurrentUser,
} from "../../controllers/auth/userAuth.controlller.js";
import { userMiddleware } from "../../middleware/user.middleware.js";
import { isSuperAdmin } from "../../middleware/isSuperAdmin.js";
const router = express.Router();

router
  .route("/")
  .get(authMiddleware, isSuperAdmin, getAllUsers)
  .post(authMiddleware, createUser);

router.route("/count").get(authMiddleware, isSuperAdmin, getUsersCount);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
router.route("/tenant/:tenant_id").get(getUsersByTenant);
router.route("/role/:role_id").get(getUsersByRole);
router.route("/login").post(loginUser);
router.route("/getcurrentuser/me").get(userMiddleware, getCurrentUser);
router.route("/search/:searchValue").get(tenantMiddleware, searchUsers);
router.route("/toggle-status/:id").put(toggleUserStatus);
router.route("/requestpasswordreset").post(requestPasswordReset);

export default router;
