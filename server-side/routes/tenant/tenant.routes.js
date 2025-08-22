import express from "express";
import {
  createTenant,
  getAllTenants,
  deleteTenant,
  getTenantById,
  updateTenant,
  updateStatus,
} from "../../controllers/super-admin/tenant.controller.js";
import { authCheckMiddleware } from "../../middleware/authCheckMiddleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";
import {
  getStudents,
  EnrollStudents,
} from "../../controllers/tenant/tenant.controller.js";
const router = express.Router();

router
  .route("/")
  .get(authCheckMiddleware, authorizeRoles("superadmin"), getAllTenants);

router
  .route("/update/:id")
  .put(authCheckMiddleware, authorizeRoles("superadmin"), updateTenant);
router
  .route("/updatestatus/:id")
  .put(authCheckMiddleware, authorizeRoles("superadmin"), updateStatus);

router
  .route("/delete/:id")
  .delete(authCheckMiddleware, authorizeRoles("superadmin"), deleteTenant);

router
  .route("/students/get-students-by-company")
  .get(
    authCheckMiddleware,
    authorizeRoles("superadmin", "tenant"),
    getStudents
  );

router
  .route("/:id")
  .delete(authCheckMiddleware, authorizeRoles("superadmin"), deleteTenant)
  .get(authCheckMiddleware, authorizeRoles("superadmin"), getTenantById);
router
  .route("/tenant/getstudents/:course_id")
  .get(
    authCheckMiddleware,
    authorizeRoles("superadmin", "tenant"),
    getStudents
  );
router
  .route("/tenant/enrollstudents/:course_id")
  .post(
    authCheckMiddleware,
    authorizeRoles("superadmin", "tenant"),
    EnrollStudents
  );
export default router;
