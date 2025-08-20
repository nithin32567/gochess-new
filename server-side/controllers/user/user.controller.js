import User from "../../models/user.model.js";
import Login from "../../models/login.model.js";
import mongoose from "mongoose";
import sendMail from "../../utils/senMail.js";
import bcrypt from "bcrypt";
// Create a new user with login credentials
export const createUser = async (req, res) => {
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
    } = req.body;

    // Validate required fields
    if (!fname || !lname || !email || !role_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    // console.log();

    // Check if email already exists for the tenant
    const existingLogin = await Login.findOne({
      email,
      tenant_id: req.user.tenant_id,
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
      phone_number: "9988998976",
      email,
    });
    const password = `student@${Math.floor(Math.random() * 10000)}`;
    console.log(password);

    await user.save({ session });
    console.log(user, "user created");
    // Create login credentials
    const login = new Login({
      user_id: user._id,
      tenant_id: req.user.tenant_id,
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
    sendMail({
      to: login.email,
      subject: "Welcome to our platform",
      text: `Your password is ${password}`,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: userResponse,
    });
  } catch (error) {
    await session.abortTransaction();
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

// Get user details by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Get user with login details using aggregation
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
        $project: {
          _id: 1,
          fname: 1,
          lname: 1,
          age: 1,
          dob: 1,
          phone_number: 1,
          created_at: 1,
          email: "$login.email",
          role_id: "$login.role_id",
          tenant_id: "$login.tenant_id",
          is_active: "$login.is_active",
        },
      },
    ]);

    if (!user.length) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const {
      fname,
      lname,
      age,
      dob,
      phone_number,
      email,
      // password,
      role_id,
      is_active,
    } = req.body;

    console.log(id);

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if user exists and get their current role
    const userLogin = await Login.findOne({ user_id: id }).populate("role_id");
    if (!userLogin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deactivation of super admin
    const superAdminRoleId = "682c0541089c54ce890db8b3";
    if (
      userLogin.role_id._id.toString() === superAdminRoleId &&
      is_active === false
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot deactivate super admin user",
      });
    }

    // Prevent role change of super admin
    if (
      userLogin.role_id._id.toString() === superAdminRoleId &&
      role_id &&
      role_id !== superAdminRoleId
    ) {
      return res.status(403).json({
        success: false,
        message: "Cannot change super admin role",
      });
    }

    // Update user details
    const user = await User.findByIdAndUpdate(
      id,
      {
        fname,
        lname,
        age,
        dob,
        phone_number,
      },
      { new: true, session }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update login details if provided
    const loginUpdate = {};
    if (email) loginUpdate.email = email;
    // if (password) loginUpdate.password = password;
    if (role_id) loginUpdate.role_id = role_id;
    if (typeof is_active === "boolean") loginUpdate.is_active = is_active;

    if (Object.keys(loginUpdate).length > 0) {
      const login = await Login.findOneAndUpdate({ user_id: id }, loginUpdate, {
        new: true,
        session,
      });

      if (!login) {
        throw new Error("Login details not found");
      }
    }

    await session.commitTransaction();

    // Get updated user with login details
    const updatedUser = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
        $project: {
          _id: 1,
          fname: 1,
          lname: 1,
          age: 1,
          dob: 1,
          phone_number: 1,
          created_at: 1,
          email: "$login.email",
          role_id: "$login.role_id",
          tenant_id: "$login.tenant_id",
          is_active: "$login.is_active",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};

// --------------------------------------------------

// Delete user (complete deletion from both tables)
export const deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Check if user exists and get their role
    const userLogin = await Login.findOne({ user_id: id }).populate("role_id");
    if (!userLogin) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deletion of super admin
    const superAdminRoleId = "682c0541089c54ce890db8b3";
    if (userLogin.role_id._id.toString() === superAdminRoleId) {
      return res.status(403).json({
        success: false,
        message: "Cannot delete super admin user",
      });
    }

    // Delete from login table first
    await Login.deleteOne({ user_id: id }, { session });

    // Then delete from user table
    await User.deleteOne({ _id: id }, { session });

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  } finally {
    // End the session
    session.endSession();
  }
};

// Get all users for a tenant
export const getUsersByTenant = async (req, res) => {
  try {
    const { tenant_id } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    // Validate tenant ID
    if (!mongoose.Types.ObjectId.isValid(tenant_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid tenant ID",
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
          ...searchQuery,
        },
      },
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
          role_id: "$login.role_id",
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

  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      data: users,
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

    // Validate role ID
    if (!mongoose.Types.ObjectId.isValid(role_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    // Get users with the specified role
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
          "login.role_id": new mongoose.Types.ObjectId(role_id),
        },
      },
      {
        $project: {
          _id: 1,
          fname: 1,
          lname: 1,
          email: "$login.email",
          is_active: "$login.is_active",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: users,
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

export const searchUsers = async (req, res) => {
  const { tenant_id } = req.user;
  console.log("------------------------------");
  try {
    const { searchValue } = req.params;
    const { role_id } = req.query; // Get role_id from query parameters

    if (!tenant_id) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID is required",
      });
    }

    console.log(role_id, "role_id");
    console.log(searchValue, "searchValue");
    const matchStage = {
      $match: {
        $or: [
          { fname: { $regex: searchValue, $options: "i" } },
          { lname: { $regex: searchValue, $options: "i" } },
          { email: { $regex: searchValue, $options: "i" } },
        ],
      },
    };

    // If role_id is provided, add it to the match stage
    if (role_id) {
      matchStage.$match.role_id = role_id;
    }

    const users = await Login.find({ role_id }).populate("user_id");
    const userIds = users.map((user) => user.user_id);
    const usersData = await User.find({ _id: { $in: userIds } });
    console.log(usersData, "usersData");
    // filter by searchValue
    let filteredUsers = [];
    if (searchValue !== "all") {
      filteredUsers = usersData.filter((user) => {
        return (
          user.fname.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.lname.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.email.toLowerCase().includes(searchValue.toLowerCase())
        );
      });
    } else {
      filteredUsers = usersData;
    }
    console.log(filteredUsers, "filteredUsers");
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
  //   const password=`student@${Math.floor(Math.random() * 10000)}`
  // console.log(password);
  //  sendMail({ to: login.email, subject: "Welcome to our platform", text: `Your password is ${password}` });
  console.log("inside requestresetpassword", req.body);
  const { email, _id } = req.body;
  console.log(email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const login = await Login.findOne({ user_id: user._id });
    if (!login) {
      return res.status(404).json({ message: "Login not found" });
    }
    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     role: user.role_id.name,
    //     role_id: user.role_id._id,
    //     tenant_id: user.tenant_id,
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" }
    // );
    const key = `student@${Math.floor(Math.random() * 10000)}`;
    const password = await bcrypt.hash(key, 10);

    await Login.updateOne({ _id: login._id }, { $set: { password } });
    sendMail({
      to: login.email,
      subject: "Welcome to our platform",
      text: `Your password is ${key}`,
    });
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ message: "Error sending password reset email" });
  }
}

export const getUsersCount = async (req, res) => {
  const users = await User.find({});
  res.status(200).json({
    success: true,
    data: users.length,
  });
};
