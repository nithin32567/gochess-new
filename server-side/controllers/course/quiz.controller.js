import QuizOptions from "../../models/QuizOptions.js";
import QuizQuestion from "../../models/QuizQuestion.js";
import Quiz from "../../models/QuizTable.js";

export const createQuiz = async (req, res) => {
  try {
    const {
      course_id,
      module_id,
      title,
      description,
      pass_percentage,
      time_limit_minutes,
      attempts_allowed,
    } = req.body;

    if (
      !course_id ||
      !module_id ||
      !title ||
      !description ||
      !pass_percentage ||
      !time_limit_minutes ||
      !attempts_allowed
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingQuiz = await Quiz.findOne({
      course_id,
      module_id,
      title,
    });

    if (existingQuiz) {
      return res
        .status(400)
        .json({ success: false, message: "Quiz already exists" });
    }

    const quiz = new Quiz({
      course_id,
      module_id,
      title,
      description,
      pass_percentage,
      time_limit_minutes,
      attempts_allowed,
    });

    await quiz.save();
    return res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizzes = async (req, res) => {
  try {
    const { course_id, module_id } = req.query;

    const quizzes = await Quiz.find({ course_id, module_id }).populate(
      "course_id module_id"
    );
    if (!quizzes || quizzes.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No quizzes found" });
    }
    console.log(quizzes);
    return res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addQuizQuestion = async (req, res) => {
  try {
    const { quiz_id, question_text, question_type, score } = req.body;

    if (!quiz_id || !question_text || !question_type || !score) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingQuestion = await QuizQuestion.findOne({
      quiz_id,
      question_text,
    });

    if (existingQuestion) {
      return res
        .status(400)
        .json({ success: false, message: "Question already exists" });
    }

    const question = new QuizQuestion({
      quiz_id,
      question_text,
      question_type,
      score,
    });

    await question.save();
    return res.status(201).json({ success: true, data: question });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addQuizOptions = async (req, res) => {
  try {
    const { question_id, options } = req.body; // options: [{ option_text, is_correct }, ...]

    if (!question_id || !Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "question_id and 4 options are required",
      });
    }

    const existingOptions = await QuizOptions.find({ question_id });
    if (existingOptions.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Options already exist for this question",
      });
    }

    const correctCount = options.filter((opt) => opt.is_correct).length;
    if (correctCount !== 1) {
      return res.status(400).json({
        success: false,
        message: "Exactly one correct option must be provided",
      });
    }

    const formattedOptions = options.map((opt) => ({
      question_id,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
    }));

    const createdOptions = await QuizOptions.insertMany(formattedOptions);

    return res.status(201).json({ success: true, data: createdOptions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getQuizDetails = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    console.log(quiz_id);

    const questions = await QuizQuestion.find({ quiz_id });

    if (!questions) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await QuizOptions.find({ question_id: q._id });
        return { ...q.toObject(), options };
      })
    );

    if (!questionsWithOptions) {
      return res
        .status(404)
        .json({ success: false, message: "No questions found" });
    }

    return res.status(200).json({ success: true, data: questionsWithOptions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// export const getQuiz=async(req,res)=>{
//   try {
//     const { quiz_id } = req.params;
//     console.log(quiz_id);

//     const quiz = await Quiz.findById(quiz_id);
//     if (!quiz) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Quiz not found" });
//     }
//     return res.status(200).json({ success: true, data: quiz });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };
