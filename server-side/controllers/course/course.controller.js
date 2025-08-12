import mongoose, { Mongoose } from "mongoose";
import Course from "../../models/Course.js";
import Category from "../../models/Category.js";
import Subcategory from "../../models/Subcategory.js";
import Language from "../../models/Language.js";
import Level from "../../models/CourseLevel.js";
import User from "../../models/user.model.js";
import Role from "../../models/role.model.js";

// Create a new course
export const createCourse = async (req, res) => {
  console.log(req.body);
  
  try {
    const {
      course_title,
      short_description,
      description,
      category,
      subcategory,
      language,
      level,
      max_enrollment,
      start_date,
      end_date,
      instructors,
      drip_content_enabled,
    } = req.body;
    const { tenant_id } = req.user;

    // Basic validation for mandatory fields
    if (
      !course_title ||
      !short_description ||
      !description ||
      !category ||
      !subcategory ||
      !language ||
      !level ||
      !max_enrollment ||
      !tenant_id
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided.",
      });
    }

    // Check if course title is unique
    const existingCourse = await Course.findOne({
      course_title,
      tenant_id,
    });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message:
          "Course title already exists. Please use a different title for this tenant.",
      });
    }

    // Create and save the new course
    const course = new Course({
      course_title,
      short_description,
      description,
      category,
      subcategory,
      language,
      level,
      tenant_id,
      max_enrollment,
      instructors: instructors || [],
      start_date,
      end_date,
      drip_content_enabled: drip_content_enabled || false,
    });

    await course.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (error) {
    console.error("Course creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the course.",
      error: error.message,
    });
  }
};

// Get single course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructors", "fname lname email _id")
      .select("-createdAt -updatedAt -__v")
      .populate("category", "category")
      .populate("subcategory", "subcategory_name")
      .populate("language", "language")
      .populate("level", "course_level");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the course",
      error: error.message,
    });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    // Find and update course
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate("instructors", "name email");

    res.status(200).json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the course",
      error: error.message,
    });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if course has enrolled students
    if (
      Array.isArray(course.enrolledStudents) &&
      course.enrolledStudents.length > 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete course with enrolled students",
      });
    }

    await Course.deleteOne({ _id: course._id });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the course",
      error: error.message,
    });
  }
};

// Get course statistics
export const getCourseStats = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalEnrollments: { $sum: { $size: "$enrolledStudents" } },
        },
      },
    ]);

    const categoryStats = await Course.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusStats: stats,
        categoryStats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course statistics",
      error: error.message,
    });
  }
};

// Add instructor to course
export const addInstructorToCourse = async (req, res) => {
  try {
    const { courseId, instructorId } = req.params;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user has permission to modify course
    if (
      course.instructor.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this course",
      });
    }

    // Check if instructor is already assigned
    if (course.instructor.toString() === instructorId) {
      return res.status(400).json({
        success: false,
        message: "Instructor is already assigned to this course",
      });
    }

    // Update course with new instructor
    course.instructor = instructorId;
    course.updatedBy = req.user._id;
    course.updatedAt = Date.now();
    await course.save();

    // Populate instructor details in response
    await course.populate("instructor", "name email");

    res.status(200).json({
      success: true,
      message: "Instructor added successfully",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding instructor",
      error: error.message,
    });
  }
};

export const assignInstructors = async (req, res) => {
  const { courseId, instructorIds } = req.body;

  // Input validation
  if (
    !courseId ||
    !Array.isArray(instructorIds) ||
    instructorIds.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Both courseId and a non-empty instructorIds array are required.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid courseId format.",
    });
  }

  const invalidInstructorIds = instructorIds.filter(
    (id) => !mongoose.Types.ObjectId.isValid(id)
  );

  if (invalidInstructorIds.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Invalid instructorIds: ${invalidInstructorIds.join(", ")}`,
    });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Filter out already assigned instructors
    const alreadyAssigned = instructorIds.filter((id) =>
      course.instructors
        .map((instructorId) => instructorId.toString())
        .includes(id)
    );

    const newInstructors = instructorIds.filter(
      (id) => !alreadyAssigned.includes(id)
    );

    if (newInstructors.length === 0) {
      return res.status(200).json({
        success: false,
        message:
          "All provided instructors are already assigned to this course.",
        alreadyAssigned,
      });
    }

    // Assign only new instructors
    course.instructors.push(...newInstructors);
    await course.save();
    console.log(
      "============================================ not going to this"
    );
    return res.status(200).json({
      success: true,
      message: "Instructors assigned successfully.",
      data: course,
    });
  } catch (error) {
    // console.log("================================================");
    console.log(error);
    // console.log("================================================");
    return res.status(500).json({
      success: false,
      message: "An error occurred while assigning instructors.",
      error: error.message,
    });
  }
};

export const toggleCourseActiveStatus = async (req, res) => {
  const { courseId, isActive } = req.body;

  // Validate courseId
  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing courseId.",
    });
  }

  // Validate isActive
  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "The 'isActive' field must be a boolean value.",
    });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // Check if the status is already the same
    if (course.is_active === isActive) {
      return res.status(200).json({
        success: false,
        message: `Course is already ${isActive ? "active" : "inactive"}.`,
      });
    }

    course.is_active = isActive;
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Course has been successfully ${isActive ? "activated" : "deactivated"
        }.`,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message,
    });
  }
};

export const setCourseDates = async (req, res) => {
  const { courseId, start_date, end_date } = req.body;

  // Validate courseId
  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing courseId.",
    });
  }

  // Validate date formats
  if (!start_date || !end_date) {
    return res.status(400).json({
      success: false,
      message: "Both start_date and end_date are required.",
    });
  }

  const start = new Date(start_date);
  const end = new Date(end_date);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid date format. Use ISO format: YYYY-MM-DD.",
    });
  }

  if (start >= end) {
    return res.status(400).json({
      success: false,
      message: "Start date must be earlier than end date.",
    });
  }

  try {
    const course = await Course.findByIdAndUpdate(
      courseId,
      { start_date: start, end_date: end },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course dates updated successfully.",
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating course dates.",
      error: error.message,
    });
  }
};

export const toggleArchiveStatus = async (req, res) => {
  const { courseId, archive } = req.body;

  // Validate courseId
  if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing courseId.",
    });
  }

  // Validate archive boolean
  if (typeof archive !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "'archive' field must be a boolean value (true or false).",
    });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    if (course.is_archived === archive) {
      return res.status(200).json({
        success: false,
        message: `Course is already ${archive ? "archived" : "unarchived"}.`,
      });
    }

    course.is_archived = archive;
    await course.save();

    return res.status(200).json({
      success: true,
      message: `Course has been successfully ${archive ? "archived" : "unarchived"
        }.`,
      data: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating course archive status.",
      error: error.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { tenant_id } = req.user;

    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        message: "tenant_id is required in query parameters",
      });
    }

    const courses = await Course.find({ tenant_id })

      .populate("category")
      .populate("subcategory", "subcategory_name")
      .populate("language")
      .populate("level")

      .populate({
        path: "instructors",
        model: "User",
        select: "fname lname email",
      })
      .populate({
        path: "students",
        model: "User",
        select: "fname lname email",
      });

    return res.status(200).json({
      success: true,
      message: "Courses retrieved successfully",
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// !search courses
export const searchCourses = async (req, res) => {
  try {
    const { searchValue } = req.params;
    // console.log(searchValue, "searchValue========================");
    const { tenant_id } = req.user;
    let courses = [];
    if (searchValue === "") {
      courses = await Course.find({ tenant_id })
        .populate("category", "category")
        .populate("subcategory", "subcategory_name")
        .populate("language", "language")
        .populate("level", "course_level");

      return res.status(200).json({
        success: true,
        message: "Courses retrieved successfully",
        data: courses,
      });
    }
    if (searchValue) {
      courses = await Course.find({
        tenant_id,
        $or: [
          { course_title: { $regex: searchValue, $options: "i" } },
          { description: { $regex: searchValue, $options: "i" } },
        ],
      })
        .populate("category", "category")
        .populate("subcategory", "subcategory_name")
        .populate("language", "language")
        .populate("level", "course_level");
    }
    const filteredCourses = courses.filter((course) => {
      return (
        course.category?.name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        course.subcategory?.name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        course.language?.name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        course.level?.name?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    const finalResults = [...courses, ...filteredCourses].filter(
      (value, index, self) =>
        index ===
        self.findIndex((v) => v._id.toString() === value._id.toString())
    );

    return res.status(200).json({
      success: true,
      message: "Courses retrieved based on search",
      data: finalResults,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while searching for courses.",
      error: error.message,
    });
  }
};

export const getCourseNamesWithId = async (req, res) => {
  const { tenant_id } = req.user;
  try {
    const courses = await Course.find({ tenant_id });
    const courseNames = courses.map((course) => ({
      id: course._id,
      course_title: course.course_title,
    }));
    return res.status(200).json({
      success: true,
      data: courseNames,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course names",
      error: error.message,
    });
  }
};

export const getCourseCount = async (req, res) => {
  try {
    const courses = await Course.find({});
    return res.status(200).json({
      success: true,
      data: courses.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching course count",
      error: error.message,
    });
  }
};

export const getCoursesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { tenant_id } = req.user;
    const courses = await Course.find({ category: categoryId, tenant_id });
    // console.log(courses, "courses");

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching courses by category",
      error: error.message,
    });
  }
};


