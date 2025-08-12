import express from "express";
import { 
  getStudentsByTenant, 
  createStudent, 
  deleteStudent 
} from "../../controllers/instructor/student.controller.js";
import { instructorMiddleware } from "../../middleware/instructor.middleware.js";

const router = express.Router();

// Student management routes for instructors
router.get("/students", instructorMiddleware, getStudentsByTenant);
router.post("/students", instructorMiddleware, createStudent);
router.delete("/students/:studentId", instructorMiddleware, deleteStudent);

export default router; 