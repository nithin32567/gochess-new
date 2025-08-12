import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
} from "../controllers/role.controller.js";
import { isSuperAdmin } from "../middleware/isSuperAdmin.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";

const router = Router();

// Apply super admin middleware to all routes
// router.use(isSuperAdmin);

// Role routes
router
  .route("/")
  .post(tenantMiddleware, createRole)
  .get(tenantMiddleware, getAllRoles);

router.route("/:roleId").get(getRoleById).patch(updateRole);

// Assign permissions to role
router.post("/:roleId/permissions", assignPermissionsToRole);

export default router;
