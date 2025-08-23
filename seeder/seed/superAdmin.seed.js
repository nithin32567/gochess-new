import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Role from "../models/role.model.js";
import SuperAdmin from "../models/superAdmin.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.s0xqnyv.mongodb.net/${process.env.DB_NAME}`;

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  try {
    // Connect to database
    await connectDB();

    // Create super admin role
    const superAdminRole = await Role.findOneAndUpdate(
      { name: "super_admin" },
      {
        name: "super_admin",
        description: "Super Administrator with full system access",
      },
      { upsert: true, new: true }
    );

    // Check if super admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({
      email: process.env.SUPERADMIN_EMAIL || "superadmin@lms.com",
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists");
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD || "Admin@123",
      salt
    );

    // Create super admin
    const superAdmin = await SuperAdmin.create({
      name: "Super Admin",
      email: process.env.SUPERADMIN_EMAIL || "superadmin@lms.com",
      password: hashedPassword,
      phone_number: process.env.SUPERADMIN_PHONE || "1234567890",
      role_id: superAdminRole._id,
    });

    console.log("Super Admin created successfully:", superAdmin);

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    // Close the database connection on error
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
createSuperAdmin();
