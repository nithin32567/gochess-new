import express from "express";
import * as ModuleController from "../../controllers/course/module.controller.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";

const router = express.Router();

router.route("/").get(ModuleController.getModules);

router.post(
  "/create-module-and-assign-to-course/:course_id",
  ModuleController.createModule
);

router.get(
  "/get-modules-associated-with-the-course/:course_id",
  tenantMiddleware,
  ModuleController.getModulesAssociatedWithTheCourse
);

router.post(
  "/assign-course-to-the-modules",
  ModuleController.assignCourseToTheModules
);

// router.get(
//   "/current-course-modules/:id",
//   ModuleController.getCurrentCourseModules
// );

router.put(
  "/update/display-order/:module_id",
  ModuleController.updateDisplayOrder
);
export default router;
