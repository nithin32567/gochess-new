import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/database.js";

import Category from "../models/Category.js";
import Language from "../models/Language.js";
import CourseLevel from "../models/CourseLevel.js";
import Subcategory from "../models/Subcategory.js";

dotenv.config();

const seedCategories = async () => {
  const categoryNames = [
    "Development",
    "Design",
    "Marketing",
    "Business",
    "Photography",
    "Music",
  ];

  const nameToCategoryId = new Map();

  for (const name of categoryNames) {
    const doc = await Category.findOneAndUpdate(
      { category: name },
      { category: name },
      { upsert: true, new: true }
    );
    nameToCategoryId.set(name, doc._id);
  }

  console.log(`Seeded categories: ${categoryNames.join(", ")}`);
  return nameToCategoryId;
};

const seedLanguages = async () => {
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Hindi",
    "Tamil",
  ];

  for (const language of languages) {
    await Language.findOneAndUpdate(
      { language },
      { language },
      { upsert: true, new: true }
    );
  }

  console.log(`Seeded languages: ${languages.join(", ")}`);
};

const seedCourseLevels = async () => {
  // Must match enum in model: Beginner | Intermediate | Advanced
  const levels = ["Beginner", "Intermediate", "Advanced"];

  for (const level of levels) {
    await CourseLevel.findOneAndUpdate(
      { course_level: level },
      { course_level: level },
      { upsert: true, new: true }
    );
  }

  console.log(`Seeded course levels: ${levels.join(", ")}`);
};

const seedSubcategories = async (categoryIdMap) => {
  // Define subcategories per category
  const data = {
    Development: [
      "Web Development",
      "Mobile Development",
      "Data Science",
      "Game Development",
    ],
    Design: ["UI/UX", "Graphic Design", "Product Design"],
    Marketing: ["Digital Marketing", "SEO", "Content Marketing"],
    Business: ["Entrepreneurship", "Finance", "Management"],
    Photography: ["DSLR", "Photo Editing", "Lighting"],
    Music: ["Music Production", "Guitar", "Piano"],
  };

  for (const [categoryName, subcategoryNames] of Object.entries(data)) {
    const categoryId = categoryIdMap.get(categoryName);
    if (!categoryId) continue;

    for (const subcategory_name of subcategoryNames) {
      await Subcategory.findOneAndUpdate(
        { category_id: categoryId, subcategory_name },
        { category_id: categoryId, subcategory_name },
        { upsert: true, new: true }
      );
    }
  }

  console.log("Seeded subcategories for all categories");
};

const run = async () => {
  try {
    await connectDB();

    const categoryIdMap = await seedCategories();
    await seedLanguages();
    await seedCourseLevels();
    await seedSubcategories(categoryIdMap);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed dummy data:", err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

run();


