import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByTenant,
  getUsersByRole,
  searchUsers,
  toggleUserStatus,
  requestPasswordReset,
  getUsersCount,
  searchUsersSuperadmin,
  getUsersByRoleSuperadmin,
} from "../../controllers/user/user.controller.js";
import { tenantMiddleware } from "../../middleware/tenant.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  loginUser,
  getCurrentUser,
} from "../../controllers/auth/userAuth.controlller.js";
import { userMiddleware } from "../../middleware/user.middleware.js";
import { isSuperAdmin } from "../../middleware/isSuperAdmin.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";
const router = express.Router();
import {
  getCourses,
  getStudentCourse,
} from "../../controllers/user/student.controller.js";
import { authCheckMiddleware } from "../../middleware/authCheckMiddleware.js";
router
  .route("/")
  .get(authCheckMiddleware, authorizeRoles("superadmin"), getAllUsers)

  
  .post(authCheckMiddleware, authorizeRoles("superadmin"), createUser);


router.route("/tenant/:tenant_id").get(authCheckMiddleware, authorizeRoles("superadmin", "tenant"), getUsersByTenant);

router.route("/delete/:id").delete(authCheckMiddleware, authorizeRoles("superadmin", "tenant"), deleteUser);

router.route("/update/:id").put(authCheckMiddleware, authorizeRoles("superadmin", "tenant"), updateUser);

router.route("/single/:id").get(authCheckMiddleware, authorizeRoles("superadmin", "tenant"), getUserById);

router.route("/role/:role_id").get(authCheckMiddleware, authorizeRoles("superadmin"), getUsersByRoleSuperadmin);

router.route("/search/:searchValue").get(authCheckMiddleware, authorizeRoles("superadmin"), searchUsersSuperadmin);

router.route("/toggle-status/:id").put(authCheckMiddleware, authorizeRoles("superadmin"), toggleUserStatus);

// Add route for regular searchUsers function
router.route("/search-users/:searchValue").get(authCheckMiddleware, authorizeRoles("superadmin"), searchUsers);

// router.route('/update-instructor').put(authMiddleware);
// router.route("/count").get(authMiddleware, isSuperAdmin, getUsersCount);
// router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
// router.route("/tenant/:tenant_id").get(getUsersByTenant);
// router.route("/role/:role_id").get(getUsersByRole);
// router.route("/login").post(loginUser);
// router.route("/getcurrentuser/me").get(userMiddleware, getCurrentUser);
// router.route("/search/:searchValue").get(tenantMiddleware, searchUsers);
// router.route("/toggle-status/:id").put(toggleUserStatus);
// router.route("/requestpasswordreset").post(requestPasswordReset);

// router.route("/getcourses/tenent").get(userMiddleware, getCourses);
// router
//   .route("/student/getstudentcourse/:course_id")
//   .get(userMiddleware, getStudentCourse);
export default router;
