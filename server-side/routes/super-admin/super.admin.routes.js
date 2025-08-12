import express from "express";
import {
  getTenants,
  getTenantsWithCourseCountandUserCount,
  getCoursesByTenant,
} from "../../controllers/super-admin/super.admin.controller.js";
import { isSuperAdmin } from "../../middleware/isSuperAdmin.js";
import { createTenant } from "../../controllers/super-admin/tenant.controller.js";

const router = express.Router();

router.route("/tenants").get(isSuperAdmin, getTenants);
router
  .route("/tenants/course-count-and-user-count")
  .get(isSuperAdmin, getTenantsWithCourseCountandUserCount);
router.route("/courses/tenant/:tenantId").get(isSuperAdmin, getCoursesByTenant);

router.route("/tenant/create-tenant").post(isSuperAdmin, createTenant);
export default router;
``