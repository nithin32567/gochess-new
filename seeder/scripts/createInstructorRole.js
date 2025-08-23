import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.model.js";
import connectDB from "../config/database.js";
dotenv.config();

const createInstructorRole = async () => {
  try {
    await connectDB();

    // Check if instructor role exists
    const existingRole = await Role.findOne({ name: "instructor" });

    if (!existingRole) {
      // Create instructor role
      const role = new Role({
        name: "instructor",
        description: "Instructor with course management and teaching capabilities",
      });

      await role.save();
      console.log("Instructor role created successfully");
    } else {
      console.log("Instructor role already exists");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating instructor role:", error);
    process.exit(1);
  }
};

createInstructorRole();
