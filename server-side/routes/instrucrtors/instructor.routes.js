import express from "express";
import { getAllInstructors } from "../../controllers/instructor/instructor.controller.js";
import { searchInstructor } from "../../controllers/instructor/instructor.controller.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import {
  getInstructorCourses,
  getInstructorAndDetailsById,
} from "../../controllers/instructor/course.controller.js";
import { instructorMiddleware } from "../../middleware/instructor.middleware.js";
import { assignCoursesToInstructor,getCourseDataById } from "../../controllers/course/course.controller.js";
import {
  getStudentsByTenant,
  createStudent,
} from "../../controllers/instructor/student.controller.js";
import { authCheckMiddleware } from "../../middleware/authCheckMiddleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";

const router = express.Router();

router
  .route("/get_all")
  .get(authCheckMiddleware, authorizeRoles("tenant"), getAllInstructors);
router.route("/search/:searchValue").get(authCheckMiddleware, searchInstructor);
router.get("/instructor-courses", authCheckMiddleware, getInstructorCourses);
router.get("/students", authCheckMiddleware, getStudentsByTenant);
router.post("/students", authCheckMiddleware, createStudent);
router.get(
  "/get-instructor-by-id/:instructorId",
  authCheckMiddleware,
  authorizeRoles("tenant"),
  getInstructorAndDetailsById
);
router.post(
  "/assign-courses/:instructorId",
  authCheckMiddleware,
  authorizeRoles("tenant"),
  assignCoursesToInstructor
);
// router.get("/getcoursedatabyid/asd/:id",getCourseDataById)
router.get("/getcoursedatabyid/asd/:id",authCheckMiddleware,getCourseDataById)
// router.get("/getcoursedatabyid/asd/:id",getCourseDataById)
export default router;
