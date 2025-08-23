import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.model.js";
import connectDB from "../config/database.js";
dotenv.config();

const createStudentRole = async () => {
  try {
    await connectDB();

    // Check if student role exists
    const existingRole = await Role.findOne({ name: "student" });

    if (!existingRole) {
      // Create student role
      const role = new Role({
        name: "student",
        description: "Student with course enrollment and learning capabilities",
      });

      await role.save();
      console.log("Student role created successfully");
    } else {
      console.log("Student role already exists");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating student role:", error);
    process.exit(1);
  }
};

createStudentRole();
