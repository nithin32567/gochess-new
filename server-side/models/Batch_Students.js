import mongoose from "mongoose";

const BatchStudentSchema = new mongoose.Schema(
  {
    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    joined_at: {
      type: Date,
      default: Date.now,
    },
  }
);

const BatchStudent = mongoose.model("BatchStudent", BatchStudentSchema);
export default BatchStudent;
