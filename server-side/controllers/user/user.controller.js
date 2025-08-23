import User from "../../models/user.model.js";
import Login from "../../models/login.model.js";
import Course from "../../models/Course.js";
import mongoose from "mongoose";
import sendMail from "../../utils/senMail.js";
import bcrypt from "bcrypt";
import generateRandomPassword from "../../config/generatePassword.js";
import jwt from "jsonwebtoken";
import Role from "../../models/role.model.js";
import Tenant from "../../models/tenant.model.js";
// Create a new user with login credentials

export const updateInstructor = async (req, res) => {
  const { id } = req.params;
  const { fname, lname, age, dob, phone_number, email, status } = req.body;

  const instructor = await User.findByIdAndUpdate(id, { fname, lname, age, dob, phone_number }, { new: true });
  res.status(200).json({ success: true, data: instructor });
};

// Get user details by ID


// Update user details
// export const updateUser = async (req, res) => {
//   console.log('working');
//   console.log(req.body);

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { id } = req.params;
//     const {
//       fname,
//       lname,
//       age,
//       dob,
//       phone_number,
//       email,
//       // password,
//       role_id,
//       status,
//     } = req.body;

//     // console.log(is_active);

//     // Validate user ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid user ID",
//       });
//     }

//     // Check if user exists and get their current role
//     const userLogin = await Login.findOne({ user_id: id }).populate("role_id");
//     if (!userLogin) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Check if email already exists (excluding current user)
//     if (email && email !== userLogin.email) {
//       const existingEmail = await Login.findOne({
//         email: email,
//         user_id: { $ne: id } // Exclude current user
//       });

//       if (existingEmail) {
//         return res.status(400).json({
//           success: false,
//           message: "Email already exists",
//         });
//       }
//     }
//     // Prevent deactivation of super admin
//     const superAdminRoleId = "682c0541089c54ce890db8b3";
//     if (
//       userLogin.role_id._id.toString() === superAdminRoleId &&
//       is_active === false
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Cannot deactivate super admin user",
//       });
//     }

//     // Prevent role change of super admin
//     if (
//       userLogin.role_id._id.toString() === superAdminRoleId &&
//       role_id &&
//       role_id !== superAdminRoleId
//     ) {
//       return res.status(403).json({
//         success: false,
//         message: "Cannot change super admin role",
//       });
//     }

//     // Update user details
//     const user = await User.findByIdAndUpdate(
//       id,
//       {
//         fname,
//         lname,
//         age,
//         dob,
//         phone_number,

//       },
//       { new: true, session }
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Update login details if provided
//     const loginUpdate = {};
//     if (email) loginUpdate.email = email;
//     // if (password) loginUpdate.password = password;
//     if (role_id) loginUpdate.role_id = role_id;
//     // if (typeof is_active === "boolean") 
//     loginUpdate.is_active = status == "active" ? true : false;
//     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
//     console.log(loginUpdate);

//     if (Object.keys(loginUpdate).length > 0) {
//       const login = await Login.findOneAndUpdate({ user_id: id }, loginUpdate, {
//         new: true,
//         session,
//       });
//       console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
//       console.log(login);


//       if (!login) {
//         throw new Error("Login details not found");
//       }
//     }

//     await session.commitTransaction();

//     // Get updated user with login details
//     const updatedUser = await User.aggregate([
//       { $match: { _id: new mongoose.Types.ObjectId(id) } },
//       {
//         $lookup: {
//           from: "logins",
//           localField: "_id",
//           foreignField: "user_id",
//           as: "login",
//         },
//       },
//       { $unwind: "$login" },
//       {
//         $project: {
//           _id: 1,
//           fname: 1,
//           lname: 1,
//           age: 1,
//           dob: 1,
//           phone_number: 1,
//           created_at: 1,
//           email: "$login.email",
//           role_id: "$login.role_id",
//           tenant_id: "$login.tenant_id",
//           is_active: "$login.is_active",
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser[0],
//     });
//   } catch (error) {
//     console.error("Error updating user:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error updating user",
//       error: error.message,
//     });
//   } finally {
//     session.endSession();
//   }
// };






// updated

// --------------------------------------------------

// updated


// Get all users for a tenant
export const getUsersByTenant = async (req, res) => {
  // try {
  //   const { tenant_id } = req.params;
  //   // const { page = 1, limit = 10, search = "" } = req.query;

  //   // Validate tenant ID
  //   if (!mongoose.Types.ObjectId.isValid(tenant_id)) {
  //     return res.status(400).json({
  //       success: false,
  //       message: "Invalid tenant ID",
  //     });
  //   }

  //   // Build search query
  //   const searchQuery = search
  //     ? {
  //       $or: [
  //         { fname: { $regex: search, $options: "i" } },
  //         { lname: { $regex: search, $options: "i" } },
  //         { "login.email": { $regex: search, $options: "i" } },
  //       ],
  //     }
  //     : {};

  //   // Get users with pagination
  //   const users = await User.aggregate([
  //     {
  //       $lookup: {
  //         from: "logins",
  //         localField: "_id",
  //         foreignField: "user_id",
  //         as: "login",
  //       },
  //     },
  //     { $unwind: "$login" },
  //     {
  //       $match: {
  //         "login.tenant_id": new mongoose.Types.ObjectId(tenant_id),
  //         ...searchQuery,
  //       },
  //     },
  //     {
  //       $project: {
  //         _id: 1,
  //         fname: 1,
  //         lname: 1,
  //         age: 1,
  //         dob: 1,
  //         phone_number: 1,
  //         created_at: 1,
  //         email: "$login.email",
  //         role_id: "$login.role_id",
  //         is_active: "$login.is_active",
  //       },
  //     },
  //     // { $skip: (page - 1) * limit },
  //     // { $limit: parseInt(limit) },
  //   ]);

  //   // Get total count for pagination
  //   const total = await User.aggregate([
  //     {
  //       $lookup: {
  //         from: "logins",
  //         localField: "_id",
  //         foreignField: "user_id",
  //         as: "login",
  //       },
  //     },
  //     { $unwind: "$login" },
  //     {
  //       $match: {
  //         "login.tenant_id": new mongoose.Types.ObjectId(tenant_id),
  //         ...searchQuery,
  //       },
  //     },
  //     { $count: "total" },
  //   ]);

  //   res.status(200).json({
  //     success: true,
  //     data: users,
  //     pagination: {
  //       total: total[0]?.total || 0,
  //       page: parseInt(page),
  //       limit: parseInt(limit),
  //       pages: Math.ceil((total[0]?.total || 0) / limit),
  //     },
  //   });
  // } catch (error) {
  //   console.error("Error fetching users:", error);
  //   res.status(500).json({
  //     success: false,
  //     message: "Error fetching users",
  //     error: error.message,
  //   });
  // }


  try {
    const { tenant_id } = req.params;
    const TenantData = await Login.find({ tenant_id: tenant_id }).populate([
      { path: 'user_id' },
      { path: 'role_id' },
      { path: 'tenant_id' }
    ]);
    console.log(TenantData, "TenantData")
    res.status(200).json({
      success: true,
      data: TenantData
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error fetching users by tenant",
      error: error.message,
    });
  }
};

// Get users by tenant and role
export const getUsersByTenantAndRole = async (req, res) => {
  try {
    const { tenant_id, role_id } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    // Validate IDs
    if (
      !mongoose.Types.ObjectId.isValid(tenant_id) ||
      !mongoose.Types.ObjectId.isValid(role_id)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid tenant ID or role ID",
      });
    }

    // Build search query
    const searchQuery = search
      ? {
        $or: [
          { fname: { $regex: search, $options: "i" } },
          { lname: { $regex: search, $options: "i" } },
          { "login.email": { $regex: search, $options: "i" } },
        ],
      }
      : {};

    // Get users with pagination
    const users = await User.aggregate([
      {
        $lookup: {
          from: "logins",
          localField: "_id",
          foreignField: "user_id",
          as: "login",
        },
      },
      { $unwind: "$login" },
      {
        $match: {
          "login.tenant_id": new mongoose.Types.ObjectId(tenant_id),
          "login.role_id": new mongoose.Types.ObjectId(role_id),
          ...searchQuery,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "login.role_id",
          foreignField: "_id",
          as: "role",
        },
      },
      { $unwind: "$role" },
      {
        $project: {
          _id: 1,
          fname: 1,
          lname: 1,
          age: 1,
          dob: 1,
          phone_number: 1,
          created_at: 1,
          email: "$login.email",
          role: {
            _id: "$role._id",
            name: "$role.name",
          },
          is_active: "$login.is_active",
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ]);

    // Get total count for pagination
    const total = await User.aggregate([
      {
        $lookup: {
          from: "logins",
          localField: "_id",
          foreignField: "user_id",
          as: "login",
        },
      },
      { $unwind: "$login" },
      {
        $match: {
          "login.tenant_id": new mongoose.Types.ObjectId(tenant_id),
          "login.role_id": new mongoose.Types.ObjectId(role_id),
          ...searchQuery,
        },
      },
      { $count: "total" },
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total: total[0]?.total || 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil((total[0]?.total || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

// Get all users with their details
export const getAllUsers = async (req, res) => {
  console.log(
    "getAllUsers==================================================*******************"
  );
  console.log(req.user, "req.user");
  // console.log(req.user)

  try {
    // const loginData = await Login.find
    const loginData = await Login.find({}).populate([
      { path: 'user_id' },
      { path: 'role_id' },
      { path: 'tenant_id' }
    ]);

    // console.log(loginData, "loginData")

    // const organizedData =

    res.status(200).json({
      success: true,
      data: loginData


    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const getUsersByRole = async (req, res) => {
  try {
    const { role_id } = req.params;
    const roleData = await Role.findById(role_id)
    const loginData = await Login.find({ role_id: role_id }).select('-password')
    const tenantData = await Tenant.findById(loginData.tenant_id)
    const userData = await User.findById(loginData.user_id)

    res.status(200).json({
      success: true,
      data: { loginData, roleData, tenantData, userData }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    })
  }
};

// toggle user status
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // validate user id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }
    // check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const login = await Login.findOne({ user_id: id });
    if (!login) {
      return res.status(404).json({
        success: false,
        message: "Login not found",
      });
    }
    login.is_active = !login.is_active;
    await login.save();
    res.status(200).json({
      success: true,
      message: "User status toggled successfully",
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling user status",
      error: error.message,
    });
  }
};

export async function requestPasswordReset(req, res) {
  console.log("inside requestresetpassword", req.body);
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const login = await Login.findOne({ user_id: user._id });
    if (!login) {
      return res.status(404).json({ message: "Login not found" });
    }

    // Generate a secure reset token that expires in 1 hour
    const resetToken = jwt.sign(
      { 
        userId: user._id,
        email: email,
        type: 'password_reset'
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store the reset token in the login record
    await Login.findByIdAndUpdate(login._id, {
      password_reset_token: resetToken,
      password_reset_expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour from now
    });

    // Create the reset link
    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email with the reset link
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.fname},</p>
        <p>You have requested to reset your password. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetPasswordLink}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetPasswordLink}</p>
        <p><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>Best regards,<br>GoChess LMS Team</p>
      </div>
    `;

    await sendMail({
      to: email,
      subject: "Password Reset Request - GoChess LMS",
      text: `Hello ${user.fname}, you have requested to reset your password. Please visit this link to reset your password: ${resetPasswordLink}. This link expires in 1 hour.`,
      html: htmlContent
    });

    res.status(200).json({ 
      success: true,
      message: "Password reset email sent successfully" 
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ 
      success: false,
      message: "Error sending password reset email" 
    });
  }
}

// New function to reset password using token
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid token type" 
      });
    }

    // Find the login record with this reset token
    const login = await Login.findOne({
      password_reset_token: token,
      password_reset_expires: { $gt: new Date() }
    });

    if (!login) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired reset token" 
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear the reset token
    await Login.findByIdAndUpdate(login._id, {
      password: hashedPassword,
      password_reset_token: null,
      password_reset_expires: null
    });

    res.status(200).json({ 
      success: true,
      message: "Password reset successfully" 
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ 
        success: false,
        message: "Token has expired" 
      });
    }
    res.status(500).json({ 
      success: false,
      message: "Error resetting password" 
    });
  }
}

export const getUsersCount = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    data: users.length,
  });
};

// Superadmin search users with tenant filtering
export const searchUsersSuperadmin = async (req, res) => {
  try {
    const { searchValue } = req.params;
    const { tenant_id } = req.query;

    let query = {};

    // Add tenant filter if provided
    if (tenant_id && tenant_id !== "") {
      query.tenant_id = tenant_id;
    }

    // Get login records with tenant filter
    const loginRecords = await Login.find(query).populate([
      { path: 'user_id' },
      { path: 'role_id' },
      { path: 'tenant_id' }
    ]);

    // Filter by search value
    let filteredUsers = loginRecords;
    if (searchValue && searchValue !== "") {
      filteredUsers = loginRecords.filter(login => {
        const user = login.user_id;
        return (
          user.fname.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.lname.toLowerCase().includes(searchValue.toLowerCase()) ||
          login.email.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    }

    res.status(200).json({
      success: true,
      data: filteredUsers,
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};

// Superadmin filter users by role with tenant support
export const getUsersByRoleSuperadmin = async (req, res) => {
  try {
    const { role_id } = req.params;
    const { tenant_id } = req.query;

    let query = { role_id };

    // Add tenant filter if provided
    if (tenant_id && tenant_id !== "") {
      query.tenant_id = tenant_id;
    }

    // Get login records with role and tenant filter
    const loginRecords = await Login.find(query).populate([
      { path: 'user_id' },
      { path: 'role_id' },
      { path: 'tenant_id' }
    ]);

    res.status(200).json({
      success: true,
      data: loginRecords,
    });
  } catch (error) {
    console.error("Error filtering users by role:", error);
    res.status(500).json({
      success: false,
      message: "Error filtering users by role",
      error: error.message,
    });
  }
};




// updated user datas ==============================================



export const createUser = async (req, res) => {
  // >>>>>>> dev
  console.log("createUser", req.body);
  const session = await mongoose.startSession();
  session.startTransaction();
  console.log(req.user, "req.user");

  try {
    const {
      // User details
      fname,
      lname,
      age,
      dob,
      phone_number,
      // Login details
      email,
      // password,
      role_id,
      tenant_id,
    } = req.body;

    console.log(tenant_id, "tenant_id=======================");

    // Validate required fields
    if (!fname || !lname || !email || !role_id || !tenant_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(role_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tenant_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tenant ID format",
      });
    }

    // Verify role and tenant exist
    const role = await Role.findById(role_id);
    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role not found",
      });
    }

    const tenant = await Tenant.findById(tenant_id);
    if (!tenant) {
      return res.status(400).json({
        success: false,
        message: "Tenant not found",
      });
    }
    // console.log();

    // Check if email already exists for the tenant
    const existingLogin = await Login.findOne({
      email,
      tenant_id: tenant_id,
    });
    if (existingLogin) {
      return res.status(400).json({
        success: false,
        message: "Email already exists for this tenant",
      });
    }

    // Create user
    const user = new User({
      fname,
      lname,
      age,
      dob,
      phone_number,
      email,
    });
    // !password should be generated in a more secure random way

    const password = generateRandomPassword(12);
    console.log(password);

    await user.save({ session });
    console.log(user, "user created ==========================");
    // Create login credentials
    const login = new Login({
      user_id: user._id,
      tenant_id: tenant_id,
      email,
      password, // Will be hashed by pre-save middleware
      role_id,
    });

    await login.save({ session });

    await session.commitTransaction();

    // Return user data without sensitive information
    const userResponse = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: login.email,
      role_id: login.role_id,
      tenant_id: login.tenant_id,
      created_at: user.createdAt,
    };

    // Send email after successful transaction commit
    try {
      const token = jwt.sign({ email: login.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
      await sendMail({
        to: login.email,
        subject: "Welcome to our platform",
        text: `Your password is ${password}`,
        resetPasswordLink,
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      // Don't fail the user creation if email fails
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    // Only abort transaction if it hasn't been committed yet
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const loginData = await Login.findById(id).select("-password")
    const roleData = await Role.findById(loginData.role_id).select("-permissions")
    const tenantData = await Tenant.findById(loginData.tenant_id)
    const userData = await User.findById(loginData.user_id)
    res.status(200).json({
      success: true,
      data: { loginData, roleData, tenantData, userData }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message
    })
  }
};
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;


    console.log(req.body)
    const login = await Login.findById(id)
    const user = await User.findById(login.user_id)

    if ("is_active" in req.body) {
      login.is_active = req.body.is_active; // assign directly
    }
    // if (req.body.is_active) {
    //   login.is_active === true ? login.is_active = true : login.is_active = false
    // }
    if (req.body.role_id) {
      login.role_id = req.body.role_id
    }
    if (req.body.email) {
      login.email = req.body.email
    }
    if (req.body.tenant_id) {
      login.tenant_id = req.body.tenant_id
    }
    if (req.body.fname) {
      user.fname = req.body.fname
    }
    if (req.body.lname) {
      user.lname = req.body.lname
    }
    if (req.body.age) {
      user.age = req.body.age
    }
    if (req.body.dob) {
      user.dob = req.body.dob
    }
    if (req.body.phone_number) {
      user.phone_number = req.body.phone_number
    }
    await user.save()
    await login.save()
    res.status(200).json({
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Login.findById(id)
    await user.deleteOne()
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }

};



export const searchUsers = async (req, res) => {
  try {
    const { searchValue } = req.params;
    const { tenant_id } = req.query;

    console.log("Searching for:", searchValue, "with tenant_id:", tenant_id);

    // Build the aggregation pipeline
    let pipeline = [
      // Populate all related data
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $lookup: {
          from: "roles",
          localField: "role_id",
          foreignField: "_id",
          as: "role"
        }
      },
      {
        $lookup: {
          from: "tenants",
          localField: "tenant_id",
          foreignField: "_id",
          as: "tenant"
        }
      },
      // Unwind the arrays
      {
        $unwind: "$user"
      },
      {
        $unwind: "$role"
      },
      {
        $unwind: "$tenant"
      },
      // Add tenant filter if provided
      ...(tenant_id && tenant_id !== "" ? [{ $match: { tenant_id: mongoose.Types.ObjectId.isValid(tenant_id) ? new mongoose.Types.ObjectId(tenant_id) : tenant_id } }] : []),
      // Add search filter if searchValue is provided
      ...(searchValue && searchValue !== "" ? [{
        $match: {
          $or: [
            // Search in user fields
            { "user.fname": { $regex: searchValue, $options: "i" } },
            { "user.lname": { $regex: searchValue, $options: "i" } },
            { "user.phone_number": { $regex: searchValue, $options: "i" } },
            // Search in login fields
            { "email": { $regex: searchValue, $options: "i" } },
            // Search in role fields
            { "role.name": { $regex: searchValue, $options: "i" } },
            { "role.description": { $regex: searchValue, $options: "i" } },
            // Search in tenant fields
            { "tenant.name": { $regex: searchValue, $options: "i" } },
            { "tenant.subdomain": { $regex: searchValue, $options: "i" } },
            // Search in combined name fields
            { 
              $expr: { 
                $regexMatch: { 
                  input: { $concat: ["$user.fname", " ", "$user.lname"] }, 
                  regex: searchValue, 
                  options: "i" 
                } 
              } 
            }
          ]
        }
      }] : []),
      // Project the final structure to match the expected format
      {
        $project: {
          _id: 1,
          email: 1,
          is_active: 1,
          created_at: 1,
          last_login: 1,
          user_id: "$user",
          role_id: "$role",
          tenant_id: "$tenant"
        }
      }
    ];

    const searchResults = await Login.aggregate(pipeline);

    console.log(`Found ${searchResults.length} users matching search criteria`);

    res.status(200).json({
      success: true,
      data: searchResults,
      count: searchResults.length
    });

  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};



// ======================================================================