import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByTenant,
  searchUsers,
  toggleUserStatus,
  searchUsersSuperadmin,
  getUsersByRoleSuperadmin,
  requestPasswordReset,
  resetPassword,
} from "../../controllers/user/user.controller.js";
import { loginUser } from "../../controllers/auth/userAuth.controlller.js";

import { authorizeRoles } from "../../middleware/authorizeRoles.js";
const router = express.Router();

import { authCheckMiddleware } from "../../middleware/authCheckMiddleware.js";
router
  .route("/")
  .get(authCheckMiddleware, authorizeRoles("superadmin"), getAllUsers)

  .post(authCheckMiddleware, authorizeRoles("superadmin", "tenant"), createUser);

router
  .route("/tenant/:tenant_id")
  .get(
    authCheckMiddleware,
    authorizeRoles("superadmin", "tenant"),
    getUsersByTenant
  );

router
  .route("/delete/:id")
  .delete(
    authCheckMiddleware,
    authorizeRoles("superadmin", "tenant"),
    deleteUser
  );

router
  .route("/update/:id")
  .put(authCheckMiddleware, authorizeRoles("superadmin", "tenant"), updateUser);

router
  .route("/single/:id")
  .get(
    authCheckMiddleware,
    authorizeRoles("superadmin", "tenant"),
    getUserById
  );

router
  .route("/role/:role_id")
  .get(
    authCheckMiddleware,
    authorizeRoles("superadmin"),
    getUsersByRoleSuperadmin
  );

router
  .route("/search/:searchValue")
  .get(
    authCheckMiddleware,
    authorizeRoles("superadmin"),
    searchUsersSuperadmin
  );

router
  .route("/toggle-status/:id")
  .put(authCheckMiddleware, authorizeRoles("superadmin"), toggleUserStatus);

// Add route for regular searchUsers function
router
  .route("/search-users/:searchValue")
  .get(authCheckMiddleware, authorizeRoles("superadmin"), searchUsers);

// router.route('/update-instructor').put(authMiddleware);
// router.route("/count").get(authMiddleware, isSuperAdmin, getUsersCount);
// router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);
// router.route("/tenant/:tenant_id").get(getUsersByTenant);
// router.route("/role/:role_id").get(getUsersByRole);
router.route("/login").post(loginUser);
// router.route("/getcurrentuser/me").get(userMiddleware, getCurrentUser);
// router.route("/search/:searchValue").get(tenantMiddleware, searchUsers);
// router.route("/toggle-status/:id").put(toggleUserStatus);
// Password reset routes (no authentication required)
router.route("/requestpasswordreset").post(requestPasswordReset);
router.route("/resetpassword").post(resetPassword);

// router.route("/getcourses/tenent").get(userMiddleware, getCourses);
// router
//   .route("/student/getstudentcourse/:course_id")
//   .get(userMiddleware, getStudentCourse);
export default router;
