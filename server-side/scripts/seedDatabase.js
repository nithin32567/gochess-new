import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Role from "../models/role.model.js";
import SuperAdmin from "../models/superAdmin.model.js";
import Lesson_Type from "../models/Lesson_Type.model.js";
import mongoose from "mongoose";

dotenv.config();

const DEFAULT_ROLE_ID = "682c0541089c54ce890db8b3";

const connectDB = async () => {
  const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.s0xqnyv.mongodb.net`;

  try {
    const conn = await mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);

    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};


const seedLessonTypes = async () => {
  try {
    console.log("Checking for existing lesson types...");

    const existing = await Lesson_Type.find({});
    if (existing.length > 0) {
      console.log("Lesson types already seeded.");
      return;
    }

    const lessonTypes = [
      { lesson_type: "video" },
      { lesson_type: "pdf" },
      { lesson_type: "quiz" },
      { lesson_type: "live" },
      { lesson_type: "assignment" },
      { lesson_type: "text" },
    ];

    await Lesson_Type.insertMany(lessonTypes);
    console.log("Lesson types seeded successfully.");
  } catch (error) {
    console.error("Failed to seed lesson types:", error);
    throw error;
  }
};

const createSuperAdminRole = async () => {
  try {
    console.log("Checking for superadmin role...");

    let existingRole = await Role.findById(DEFAULT_ROLE_ID);

    if (!existingRole) {
      existingRole = new Role({
        _id: new mongoose.Types.ObjectId(DEFAULT_ROLE_ID),
        name: "superadmin",
        description: "Super administrator with full system access",
      });
      await existingRole.save();
      console.log("Superadmin role created with specific ID.");
    } else {
      await Role.findOneAndUpdate(
        { _id: DEFAULT_ROLE_ID },
        {
          name: "superadmin",
          description: "Super administrator with full system access",
        },
        { new: true }
      );
      console.log("Superadmin role already exists and updated.");
    }

    return existingRole;
  } catch (error) {
    console.error("Failed to create superadmin role:", error);
    throw error;
  }
};


const createSuperAdmin = async (roleId) => {
  try {
    console.log("Checking for existing superadmin user...");

    const existingSuperAdmin = await SuperAdmin.findOne({
      email: process.env.SUPERADMIN_EMAIL || "superadmin@lms.com",
    });

    if (existingSuperAdmin) {
      console.log("Super Admin already exists.");
      return existingSuperAdmin;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD || "Admin@123",
      salt
    );

    const superAdmin = await SuperAdmin.create({
      name: "Super Admin",
      email: process.env.SUPERADMIN_EMAIL || "superadmin@lms.com",
      password: hashedPassword,
      phone_number: process.env.SUPERADMIN_PHONE || "1234567890",
      role_id: roleId,
    });

    console.log("Super Admin created successfully.");
    return superAdmin;
  } catch (error) {
    console.error("Failed to create superadmin:", error);
    throw error;
  }
};


const seedDatabase = async () => {
  try {
    console.log("Starting database seeding process...");

    try {
      await connectDB();
    } catch (error) {
      console.error("Failed to connect to database:", error);
      process.exit(1);
    }

    console.log("\nStep 1: Seeding lesson types...");
    await seedLessonTypes();

    console.log("\nStep 2: Creating superadmin role...");
    const superAdminRole = await createSuperAdminRole();

    console.log("\nStep 3: Creating superadmin user...");
    await createSuperAdmin(superAdminRole._id);

    console.log("\nDatabase seeding completed successfully!");


    await mongoose.connection.close();
    console.log("Database connection closed.");

    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);

    try {
      await mongoose.connection.close();
      console.log("Database connection closed.");
    } catch (closeError) {
      console.error("Failed to close database connection:", closeError);
    }

    process.exit(1);
  }
};

seedDatabase();
