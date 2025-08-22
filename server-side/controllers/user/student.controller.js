  import Course from "../../models/Course.js";
import CoursePurchase from "../../models/Course_Purchase.js"
import Login from "../../models/login.model.js";
import User from "../../models/user.model.js";
import Module from "../../models/Module.js";
import Lesson from "../../models/Lesson.model.js";
import Lesson_Type from "../../models/Lesson_Type.model.js";

export async function getCourses(req, res) {
  // console.log("get courses");
// console.log(req.user);

  try {
const {id}=req.user;

    if (!id) {
      return res.status(400).json({ success: false, message: "Tenant ID is required" });
    }
const {user_id}=await Login.findOne({_id:id});
// console.log("*****************************");
// console.log(user_id);

// console.log("*****************************");

    // Find all courses for this tenant
    const courses = await CoursePurchase.find({ user_id }).populate("course_id");
    // console.log(courses);
    
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export async function getStudentCourse(req, res) {
  // console.log("getStudent");
  
  try {
    const { id } = req.user;
    const { course_id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID is required" 
      });
    }

    if (!course_id) {
      return res.status(400).json({ 
        success: false, 
        message: "Course ID is required" 
      });
    }

    // Get user_id from login
    const loginRecord = await Login.findOne({ _id: id });
    // console.log(loginRecord);
    
    if (!loginRecord) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const user_id = loginRecord.user_id;

    // Check if student has purchased this course
    const coursePurchase = await CoursePurchase.findOne({ 
      user_id: user_id, 
      course_id: course_id 
    });
    // console.log(course_id);
    
// console.log(coursePurchase);

    if (!coursePurchase) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have access to this course" 
      });
    }

    // Get course details with populated data
    const course = await Course.findById(course_id)
      .populate('category')
      .populate('subcategory')
      .populate('language')
      .populate('level')
      .populate('instructors', 'fname lname email');

    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // Get modules for this course
    const modules = await Module.find({ 
      course_id: { $in: [course_id] },
      is_deleted: false 
    }).sort({ display_order: 1 });

    // Get lessons for each module with lesson types
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await Lesson.find({ 
          module_id: module._id 
        })
        .populate('lesson_type_id')
        .populate('quiz_id')
        // .populate('live_session_id')
        .sort({ display_order: 1 });

        return {
          _id: module._id,
          module_title: module.module_title,
          module_description: module.module_description,
          display_order: module.display_order,
          is_locked: module.is_locked,
          created_at: module.created_at,
          updated_at: module.updated_at,
          lessons: lessons.map(lesson => ({
            _id: lesson._id,
            lesson_title: lesson.lesson_title,
            lesson_type: lesson.lesson_type_id,
            description: lesson.description,
            video_url: lesson.video_url,
            file_path: lesson.file_path,
            quiz_id: lesson.quiz_id,
            live_session_id: lesson.live_session_id,
            lesson_duration: lesson.lesson_duration,
            is_downloadable: lesson.is_downloadable,
            is_preview: lesson.is_preview,
            display_order: lesson.display_order,
            created_at: lesson.created_at,
            updated_at: lesson.updated_at
          }))
        };
      })
    );

    // Get all lesson types for reference
    const lessonTypes = await Lesson_Type.find().sort({ lesson_type: 1 });

    return res.status(200).json({
      success: true,
      message: "Course data fetched successfully",
      data: {
        course: {
          _id: course._id,
          course_title: course.course_title,
          short_description: course.short_description,
          description: course.description,
          category: course.category,
          subcategory: course.subcategory,
          language: course.language,
          level: course.level,
          instructors: course.instructors,
          max_enrollment: course.max_enrollment,
          is_active: course.is_active,
          is_archived: course.is_archived,
          drip_content_enabled: course.drip_content_enabled,
          start_date: course.start_date,
          end_date: course.end_date,
          image: course.image,
          created_at: course.createdAt,
          updated_at: course.updatedAt
        },
        modules: modulesWithLessons,
        lesson_types: lessonTypes,
        course_purchase: {
          purchased_at: coursePurchase.purchased_at,
          valid_till: coursePurchase.valid_till
        }
      },
      module_count: modulesWithLessons.length,
      lesson_count: modulesWithLessons.reduce((total, module) => total + module.lessons.length, 0),
      lesson_type_count: lessonTypes.length
    });

  } catch (error) {
    console.error("Error fetching student course:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course data",
      error: error.message
    });
  }
}
