// /seeds/seedLessonTypes.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Lesson_Type from "../models/Lesson_Type.model.js"; // Adjust path as needed

dotenv.config(); // Load environment variables

const seedLessonTypes = async () => {
  try {
    const connectDB = async () => {
      try {
        const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.s0xqnyv.mongodb.net/${process.env.DB_NAME}`;

        await mongoose.connect(MONGO_URI);

        console.log("MongoDB Connected Successfully");
      } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
      }
    };
    connectDB();

    const existing = await Lesson_Type.find({});
    if (existing.length > 0) {
      console.log("Lesson types already seeded.");
      process.exit(0);
    }

    await Lesson_Type.insertMany([
      { lesson_type: "video" },
      { lesson_type: "pdf" },
      { lesson_type: "quiz" },
      { lesson_type: "live" },
      { lesson_type: "assignment" },
      { lesson_type: "text" },
    ]);

    console.log("✅ Lesson types seeded successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to seed lesson types:", err);
    process.exit(1);
  }
};

seedLessonTypes();
