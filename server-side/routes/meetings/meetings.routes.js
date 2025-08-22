import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { instructorMiddleware } from "../../middleware/instructor.middleware.js";
import {
    createMeeting,
    getMeetings,
    updateMeeting,
    cancelMeeting,
    
  } from "../../controllers/meetings/meeting.controller.js";
import express from 'express'
import { authCheckMiddleware } from "../../middleware/authCheckMiddleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";
const router = express.Router();

router.route("/meetings").get(tenantMiddleware,instructorMiddleware,getMeetings);
router.route("/create_meetings").post(tenantMiddleware,instructorMiddleware, createMeeting);
router.route("/edit_meetings/:meetingId").put(tenantMiddleware,instructorMiddleware, updateMeeting);
router.route("/cancel_meetings/:meetingId").put(tenantMiddleware,instructorMiddleware, cancelMeeting);

export default router;
