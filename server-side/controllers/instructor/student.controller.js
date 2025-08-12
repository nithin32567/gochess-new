import Login from "../../models/login.model.js";
import User from "../../models/user.model.js";

export const getStudentsByTenant = async (req, res) => {
  try {
    console.log("getStudentsByTenant called",req.user);
    
    // Get the tenant_id from the authenticated user
    const { tenant_id } = req.user;
    
    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required"
      });
    }

    const students = await Login.find({
        tenant_id: tenant_id,
        role_id: "682dfad99aabacbc92fab14d"
      })
      .populate('user_id', 'fname lname email phone_number dob age tenant_id')
      .select('user_id tenant_id created_at updated_at');
      
    // Flatten the user_id fields into the top-level object
    const flatStudents = students.map(s => ({
      _id: s.user_id?._id || s._id,
      fname: s.user_id?.fname || "",
      lname: s.user_id?.lname || "",
      email: s.user_id?.email || "",
      phone_number: s.user_id?.phone_number || "",
      dob: s.user_id?.dob || "",
      age:s.user_id?.age || "",
      tenant_id: s.user_id?.tenant_id || s.tenant_id,
      created_at: s.created_at,
      updated_at: s.updated_at
    }));

    console.log(`Found ${flatStudents.length} students for tenant: ${tenant_id}`, flatStudents);

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: flatStudents,
      count: flatStudents.length
    });

  } catch (error) {
    console.error("Error fetching students by tenant:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message
    });
  }
};


export const createStudent = async (req, res) => {
  try {
    const { tenant_id } = req.user;
    const { fname, lname, email, phone_number, dob, age } = req.body;

    // Validate required fields
    if (!fname || !lname || !email || !phone_number || !dob || !age) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // Check if email already exists in User or Login
    const existingUser = await User.findOne({ email });
    const existingLogin = await Login.findOne({ email, tenant_id });
    if (existingUser || existingLogin) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    // 1. Create User
    const newUser = new User({
      fname,
      lname,
      email,
      phone_number,
      dob,
      age,
    });
    await newUser.save();

    // 2. Create Login (replace 'role_id' with your actual student role ObjectId)
    const studentRoleId = "682dfad99aabacbc92fab14d"; // <-- your student role ObjectId
    const newLogin = new Login({
      user_id: newUser._id,
      tenant_id,
      email,
      role_id: studentRoleId,
      is_active: true,
    });
    await newLogin.save();

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: {
        user: {
          _id: newUser._id,
          fname: newUser.fname,
          lname: newUser.lname,
          email: newUser.email,
          phone_number: newUser.phone_number,
          dob: newUser.dob,
          age: newUser.age,
        },
        login: {
          _id: newLogin._id,
          user_id: newLogin.user_id,
          tenant_id: newLogin.tenant_id,
          email: newLogin.email,
          role_id: newLogin.role_id,
        }
      }
    });

  } catch (error) {
    console.error("Error creating student:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    console.log("deleteStudent called");
    
    const { tenant_id } = req.user;
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required"
      });
    }

    // Find and delete student, ensuring it belongs to the current tenant
    const student = await User.findOneAndDelete({
      _id: studentId,
      tenant_id: tenant_id,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or you don't have permission to delete"
      });
    }

    console.log(`Student deleted successfully: ${studentId}`);

    return res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message
    });
  }
};
