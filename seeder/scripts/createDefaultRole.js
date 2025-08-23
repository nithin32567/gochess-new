import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/role.js";
import connectDB from "../connectDB.js";
dotenv.config();

const DEFAULT_ROLE_ID = "682c0541089c54ce890db8b3";

const createDefaultRole = async () => {
  try {
    await connectDB();

    // Check if role exists
    const existingRole = await Role.findById(DEFAULT_ROLE_ID);

    if (!existingRole) {
      // Create default role
      const role = new Role({
        _id: new mongoose.Types.ObjectId(DEFAULT_ROLE_ID),
        name: "Super Admin",
        description: "Super administrator with full system access",
      });

      await role.save();
      console.log("Default role created successfully");
    } else {
      console.log("Default role already exists");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating default role:", error);
    process.exit(1);
  }
};

createDefaultRole();
