import Course from "../../models/Course.js";
import Login from "../../models/login.model.js";
import User from "../../models/user.model.js";

export const getInstructorCourses = async (req, res) => {
  console.log("getInstructorCourses");

  // const id = "683d38868e3ab8f9a9302b0d";
  console.log("==============================");
  // console.log('user',req.user.id);
  console.log("==============================");

  const users = await Login.findOne({ _id: req.user.id }).populate("user_id");
  console.log("users", users);
  const id = users.user_id._id;
  try {
    // const instructorObjectId = new mongoose.Types.ObjectId(id);

    const courseAssignedToInstructor = await Course.find({
      instructors: { $in: [id] },
    })
      .populate("category", "category")
      .populate("subcategory", "subcategory_name")
      .populate("language", "language")
      .populate("level", "course_level");

    // console.log(courseAssignedToInstructor, "courses");

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

export const getInstructorAndDetailsById = async (req, res) => {
  console.log("getInstructorAndDetailsById");
  try {
    const { instructorId } = req.params;
    const LoginDetails = await Login.findOne({ _id: instructorId });
    const { user_id } = LoginDetails;

    const userDetails = await Promise.all([
      User.findOne({ _id: user_id }),
      Course.find({ instructors: instructorId }),
    ]);

    const [user, courses] = userDetails;

    return res.status(200).json({
      success: true,
      data: {
        user,
        courses,
        email: LoginDetails.email,
        is_active: LoginDetails.is_active,
      },
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch instructor",
      error: error.message,
    });
  }
};
