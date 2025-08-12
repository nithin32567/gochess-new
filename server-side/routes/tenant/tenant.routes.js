import express from "express";
import {
  createTenant,
  getAllTenants,
  deleteTenant,
  getTenantById,
  updateTenant,
} from "../../controllers/super-admin/tenant.controller.js";
import { isSuperAdmin } from "../../middleware/isSuperAdmin.js";

import { loginTenant } from "../../controllers/tenant/login.controller.js";
// import { loginTenant } from "../../controllers/tenant/login.controller.js";
import {
  createMeeting,
  getMeetings,
  updateMeeting,
} from "../../controllers/tenant/tenant.meeting.controller.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(isSuperAdmin, createTenant)
  .get(isSuperAdmin, getAllTenants);

router.route("/update/:id").put(isSuperAdmin, updateTenant);
// router.route("/login").post(loginTenant);
router.route("/meetings").get(tenantMiddleware, getMeetings);
router.route("/create_meetings").post(tenantMiddleware, createMeeting);
router.route("/edit_meetings/:meetingId").put(tenantMiddleware, updateMeeting);

router
  .route("/:id")
  // .delete(isSuperAdmin, deleteTenant)
  .get(isSuperAdmin, getTenantById);

export default router;
