import express from "express";
import { getAllInstructors } from "../../controllers/instructor/instructor.controller.js";
import { searchInstructor } from "../../controllers/instructor/instructor.controller.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { getInstructorCourses } from "../../controllers/instructor/course.controller.js";
import { instructorMiddleware } from "../../middleware/instructor.middleware.js";
import { getStudentsByTenant } from "../../controllers/instructor/student.controller.js";

const router = express.Router();

router.route("/get_all").get(tenantMiddleware, getAllInstructors);
router.route("/search/:searchValue").get(tenantMiddleware, searchInstructor);
router.get(
    "/instructor-courses",
    instructorMiddleware,getInstructorCourses
  );
router.get("/instructor-courses",instructorMiddleware,getStudentsByTenant)

export default router;
