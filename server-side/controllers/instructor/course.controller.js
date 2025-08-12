import Course from "../../models/Course.js";

export const getInstructorCourses = async (req, res) => {
    console.log("getInstructorCourses");
    
    const id = "683d38868e3ab8f9a9302b0d";
  
    try {
      // const instructorObjectId = new mongoose.Types.ObjectId(id);
  
      const courseAssignedToInstructor = await Course.find({
        instructors: { $in: [id] },
      });
  
      console.log(courseAssignedToInstructor, "courses");
  
      return res.status(200).json({
        success: true,
        data: courseAssignedToInstructor,
      });
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch courses",
        error: error.message,
      });
    }
  };