// File: routes/course/quiz.routes.js

import express from "express";
import * as QuizController from "../../controllers/course/quiz.controller.js";

const router = express.Router();

/**
 * @route   POST /api/quiz
 * @desc    Create a new quiz
 * @access  Protected (Scoped by role/tenant middleware if applicable)
 *
 * @route   GET /api/quiz?course_id=&module_id=
 * @desc    Get quizzes by course/module
 */
router
  .route("/")
  .post(QuizController.createQuiz)
  .get(QuizController.getQuizzes);

/**
 * @route   POST /api/quiz/question
 * @desc    Add a new question to a quiz
 */
router.route("/question").post(QuizController.addQuizQuestion);

/**
 * @route   POST /api/quiz/options
 * @desc    Add options to a specific question
 */
router.route("/options").post(QuizController.addQuizOptions);

/**
 * @route   GET /api/quiz/:quiz_id
 * @desc    Get quiz details including questions and options
 */
router.route("/:quiz_id").get(QuizController.getQuizDetails);

export default router;
