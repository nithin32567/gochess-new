import Batch from "../../models/Batch_table.js";
import Course from "../../models/Course.js";

export const createBatch = async (req, res) => {
  try {
    const {
      course_id,
      batch_name,
      instructor_id,
      start_date,
      end_date
    } = req.body;

    if (!course_id || !batch_name || !instructor_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const batch = new Batch({
      course_id,
      batch_name,
      instructor_id,
      start_date,
      end_date
    });
    await batch.save();

    return res.status(201).json({
      success: true,
      message: "Batch created successfully.",
      data: batch
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create batch.",
      error: error.message
    });
  }
};

