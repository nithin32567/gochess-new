import express from "express";
import superAdminAuthRoutes from "./auth/superAdminAuth.routes.js";
import tenantRoutes from "./tenant/tenant.routes.js";
import permissionRoutes from "./permissions/permission.routes.js";
import roleRoutes from "./role.routes.js";
import userRoutes from "./user/user.routes.js";
import courseRoutes from "./courses/course.routes.js";
import moduleRoutes from "./courses/module.routes.js";
import lessonRoutes from "./courses/lesson.routes.js";
import quizRoutes from "./courses/quiz.routes.js";
import { isSuperAdmin } from "../middleware/isSuperAdmin.js";
import instructorRoutes from "./instrucrtors/instructor.routes.js";
import instructorStudentRoutes from "./instructor/instructor.routes.js";
import categoryRoutes from "./courses/category.routes.js";
import subCategoryRoutes from "./courses/subcatgory.routes.js";
import superAdminRoutes from "./super-admin/super.admin.routes.js";
import authRoutes from "./auth/auth.routes.js";
import levelRoutes from "./courses/level.routes.js";
import languageRoutes from "./courses/language.routes.js";

const router = express.Router();

router.use("/auth/superadmin", superAdminAuthRoutes);
router.use("/auth", authRoutes);
router.use("/tenants", tenantRoutes);
// router.use("/superadmin", superAdminRoute);
router.use("/permissions", permissionRoutes);

router.use("/roles", roleRoutes);

router.use("/users", userRoutes);

router.use("/courses", courseRoutes);

router.use("/categories", categoryRoutes);

router.use("/subcategories", subCategoryRoutes);

router.use("/superadmin", superAdminRoutes);
router.use("/modules", moduleRoutes);

router.use("/lessons", lessonRoutes);

router.use("/quizzes", quizRoutes);

router.use("/instructors", instructorRoutes);
router.use("/instructor", instructorStudentRoutes);

router.use("/levels", levelRoutes);

router.use("/languages", languageRoutes);

export default router;
