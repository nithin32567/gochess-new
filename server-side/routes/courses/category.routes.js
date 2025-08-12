import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../../controllers/course/category.controller.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);

export default router;
