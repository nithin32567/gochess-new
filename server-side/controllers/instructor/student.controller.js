import Login from "../../models/login.model.js";
import User from "../../models/user.model.js";
import sendMail from "../../utils/senMail.js";
import mongoose from "mongoose";
import Crypto from "crypto";
import Role from "../../models/role.model.js";
import CoursePurchase from "../../models/Course_Purchase.js";
import Course from "../../models/Course.js";

export const getStudentsByTenant = async (req, res) => {
  try {
    console.log("**************************");
    console.log("getStudentsByTenant called", req.user);

    const { tenant_id } = req.user;

    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

   
    const users = await Login.findOne({ _id: req.user.id }).populate('user_id');

    const assignedCourses = await Course.find({
      instructors: { $in: [users.user_id._id] },
    });
    // console.log('assignedcur',assignedCourses);
    

    const courseIds = assignedCourses.map(course => course._id);
    if (courseIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No courses assigned to instructor",
        data: [],
        count: 0,
      });
    }

    // console.log('Course IDs assigned to instructor:', courseIds);

    // Step 3: Find course purchases for these courses
    const coursePurchases = await CoursePurchase.find({
      course_id: { $in: courseIds },
    }).populate({
      path: 'user_id',
      select: 'fname lname email phone_number dob age tenant_id'
    });

    console.log('Course purchases:', coursePurchases);

    // Get unique students from course purchases
    const uniqueStudents = [];
    const seenStudentIds = new Set();

    // coursePurchases.forEach(purchase => {
    //   if (purchase.user_id && !seenStudentIds.has(purchase.user_id._id.toString())) {
    //     seenStudentIds.add(purchase.user_id._id.toString());
    //     // console.log(purchase);
        
    //     uniqueStudents.push({
    //       user_id: purchase.user_id._id,
    //       fname: purchase.user_id.fname,
    //       lname: purchase.user_id.lname,
    //       email: purchase.user_id.email,
    //       phone_number: purchase.user_id.phone_number,
    //       dob: purchase.user_id.dob,
    //       age: purchase.user_id.age,
    //       tenant_id: purchase.user_id.tenant_id,
    //       purchase_date: purchase.createdAt,
    //       course_id: purchase.course_id,
    //       is_active: purchase.user_id.is_active
    //     });
    //   }
    // });

    // console.log('Unique students:', uniqueStudents);

    for (const purchase of coursePurchases) {
      const studentId = purchase.user_id?._id?.toString();
      if (studentId && !seenStudentIds.has(studentId)) {
        seenStudentIds.add(studentId);
    
        // 🔍 Fetch login record to get status
        const loginData = await Login.findOne({ user_id: studentId });
    
        uniqueStudents.push({
          user_id: purchase.user_id._id,
          fname: purchase.user_id.fname,
          lname: purchase.user_id.lname,
          email: purchase.user_id.email,
          phone_number: purchase.user_id.phone_number,
          dob: purchase.user_id.dob,
          age: purchase.user_id.age,
          tenant_id: purchase.user_id.tenant_id,
          purchase_date: purchase.createdAt,
          course_id: purchase.course_id,
          is_active: loginData?.is_active || false  // fallback if null
        });
      }
    }
    

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      data: uniqueStudents,
      count: uniqueStudents.length,
    });

  } catch (error) {
    console.error("Error fetching students by tenant:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

export const createStudent = async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { tenant_id } = req.user;
    const { fname, lname, email, phone_number, dob, age } = req.body;
    console.log('req.user',req.user);
    

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

    // Find student role dynamically
    const roleFind = await Role.findOne({ name: "student" });
    if (!roleFind) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Student role not found"
      });
    }
    const role_id = roleFind._id;

    // Generate password setup token
    const passwordSetupToken = Crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    // 1. Create User within transaction
    const newUserArr = await User.create([
      {
        fname,
        lname,
        email,
        phone_number,
        dob,
        age,
        tenant_id,
      },
    ], { session });
    const newUser = newUserArr[0];

    // 2. Create Login within transaction
    await Login.create([
      {
        user_id: newUser._id,
        tenant_id,
        email,
        role_id,
        passwordSetupToken,
        tokenExpiry,
        is_active: false,
      },
    ], { session });

    // Prepare email
    const setupLink = `${process.env.CORS_ORIGIN}/common/generate-password?token=${passwordSetupToken}`;

    // Try to send email
    try {
      await sendMail({
        to: email,
        subject: "Welcome to LMS SaaS",
        text: `Click this link to set your password: ${setupLink}`,
      });
    } catch (emailError) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Student creation aborted.",
        error: emailError.message,
      });
    }

    // If everything is successful, commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      success: true,
      message: "Student created successfully. Email sent.",
      // Optionally return newUser or login info if needed
    });
  } catch (error) {
    // Only abort transaction if it hasn't been committed yet
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
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
