import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
  getRoleByName,
  getPermissionsByKeys,
} from "../controllers/role.controller.js";
import { isSuperAdmin } from "../middleware/isSuperAdmin.js";
import { tenantMiddleware } from "../middleware/tenant.middleware.js";
import { authCheckMiddleware } from "../middleware/authCheckMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = Router();

// Apply super admin middleware to all routes
// router.use(isSuperAdmin);

// Role routes
router
  .route("/")
  .post(authCheckMiddleware, authorizeRoles("superadmin"), createRole)
  .get(authCheckMiddleware, authorizeRoles("superadmin", "tenant"), getAllRoles);

// Get permissions by keys
router.get("/permissions/by-keys", authCheckMiddleware, authorizeRoles("superadmin"), getPermissionsByKeys);

router.route("/:roleId").get(getRoleById).patch(updateRole);

// Get role by name
router.get("/name/:roleName", tenantMiddleware, getRoleByName);
// Assign permissions to role
router.post("/:roleId/permissions", assignPermissionsToRole);

export default router;
