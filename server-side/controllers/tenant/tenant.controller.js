import Role from "../../models/role.model.js";
import Login from "../../models/login.model.js";
import User from "../../models/user.model.js";
// import Course from "../../models/Course.js";
import CoursePurchase from "../../models/Course_Purchase.js";
export async function getStudents(req, res) {
  try {
    const { tenant_id } = req.user;
    const { course_id } = req.params; // or req.body, depending on how you send it

    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

    // Step 1: Get student role_id from Role model
    const studentRole = await Role.findOne({ name: "student" });

    if (!studentRole) {
      return res.status(404).json({
        success: false,
        message: "Student role not found",
      });
    }

    const studentRoleId = studentRole._id;
    // console.log("Student Role ID:", studentRoleId);

    // Step 2: Get login data from Login model based on role_id and tenant_id
    const loginRecords = await Login.find({
      role_id: studentRoleId,
      tenant_id: tenant_id,
      // is_active: true,
    }).populate("user_id");


    if (!loginRecords || loginRecords.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No students found for this tenant",
        data: [],
        count: 0,
      });
    }

    // Step 3: Extract user_ids and fetch complete user data from User model
    const userIds = loginRecords.map((login) => login.user_id._id);

    const students = await User.find({
      _id: { $in: userIds },
    });

    // console.log(students, "students================");

    // Step 4: Combine the data for all students
    const allStudentData = students.map((student) => {
      const loginRecord = loginRecords.find(
        (login) => login.user_id._id.toString() === student._id.toString()
      );
      console.log('students',student._id);
      

      return {
        _id: student._id,
        user_id:student._id,
        fname: student.fname,
        lname: student.lname,
        email: student.email,
        phone_number: student.phone_number,
        age: student.age,
        dob: student.dob,
        tenant_id: tenant_id,
        role_id: studentRoleId,
        is_active: loginRecord ? loginRecord.is_active : false,
        created_at: student.createdAt,
        updated_at: student.updatedAt,
      };
    });

    // console.log(
    //   `Found ${allStudentData.length} students for tenant: ${tenant_id}`
    // );

    // Step 5: Get course students if course_id is provided
    const coursePurchasedStudents = await CoursePurchase.find({
      course_id,
      tenant_id,
    });

    return res.status(200).json({
      success: true,
      message: "Students fetched successfully",
      all_students: allStudentData,
      coursePurchasedStudents: coursePurchasedStudents,
      all_count: allStudentData.length,
      coursePurchasedStudentsCount: coursePurchasedStudents.length,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
}

export async function EnrollStudents(req, res) {
  try {
    const { tenant_id } = req.user;
    const { course_id } = req.params;
    const { courseStudents } = req.body; // array of objects: [{ user_id }]
    
    // console.log("********************************************");
    // console.log(courseStudents);
    // console.log("********************************************");
    
    if (!tenant_id || !course_id || !Array.isArray(courseStudents)) {
      return res.status(400).json({
        success: false,
        message: "Missing tenant_id, course_id, or courseStudents array"
      });
    }

    const now = new Date();
    const validTill = new Date(now);
    validTill.setMonth(validTill.getMonth() + 12);

    // Get all user_ids to enroll
    const userIds = courseStudents.map(obj => obj.user_id);

    // Find already enrolled students
    const alreadyEnrolled = await CoursePurchase.find({
      user_id: { $in: userIds },
      course_id: course_id
    }).distinct('user_id');

    // Filter out already enrolled students
    const newUserIds = userIds.filter(id => !alreadyEnrolled.includes(id));

    // Prepare docs for new enrollments
    const purchaseDocs = newUserIds.map(studentId => ({
      user_id: studentId,
      tenant_id: tenant_id,
      course_id: course_id,
      purchased_at: now,
      valid_till: validTill
    }));

    // Insert only new enrollments
    let inserted = [];
    let errors = [];
    if (purchaseDocs.length > 0) {
      try {
        const result = await CoursePurchase.insertMany(purchaseDocs, { ordered: false });
        inserted = result.map(doc => doc.user_id);
      } catch (err) {
        errors = err.writeErrors ? err.writeErrors.map(e => e.errmsg) : [err.message];
      }
    }

    // Remove enrollments for students NOT in courseStudents
    await CoursePurchase.deleteMany({
      tenant_id: tenant_id,
      course_id: course_id,
      user_id: { $nin: userIds }
    });

    return res.status(200).json({
      success: true,
      message: "Students enrolled/unenrolled successfully",
      enrolled_students: inserted,
      skipped_students: alreadyEnrolled,

      errors

    });
  } catch (error) {
    res.status(500).send(error);
  }
}
