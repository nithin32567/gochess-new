import express from "express";
import * as CourseController from "../../controllers/course/course.controller.js";

import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { isSuperAdmin } from "../../middleware/isSuperAdmin.js";
import { instructorMiddleware } from "../../middleware/instructor.middleware.js";

const router = express.Router();

// Course Routes
router
  .route("/")
  .post(tenantMiddleware, CourseController.createCourse)
  .get(tenantMiddleware, CourseController.getAllCourses);

router
  .route("/count")
  .get(authMiddleware, isSuperAdmin, CourseController.getCourseCount);
router
  .route("/:id")
  .put(tenantMiddleware, CourseController.updateCourse)
  .delete(tenantMiddleware, CourseController.deleteCourse)
  .get(tenantMiddleware, CourseController.getCourseById);

router.post("/assign-instructors", CourseController.assignInstructors);
router.post("/toggle-active-status", CourseController.toggleCourseActiveStatus);
router.post("/set-course-dates", CourseController.setCourseDates);
router.post("/toggle-archive-status", CourseController.toggleArchiveStatus);
router.get(
  "/get-course-names-with-id",
  tenantMiddleware,
  CourseController.getCourseNamesWithId
);



// router.get(
//   "/category/:categoryId",
//   tenantMiddleware,
//   CourseController.getCoursesByCategory
// );

//   .route("/category")
//   .post(CategoryController.createCategory)
//   .get(CategoryController.getCategories);

// // Language Routes
// router
//   .route("/language")
//   .post(LanguageController.createLanguage)
//   .get(LanguageController.getLanguages);

// // Subcategory Routes
// router
//   .route("/subcategory")
//   .post(SubcategoryController.createSubcategory)
//   .get(SubcategoryController.getSubcategories);

// // Level Routes
// router
//   .route("/level")
//   .post(LevelController.createCourseLevel)
//   .get(LevelController.getCourseLevels);

// search courses
router.get(
  "/search/course/value/:searchValue",
  tenantMiddleware,
  CourseController.searchCourses
);

export default router;
