import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import SuperAdmin from "../../models/superAdmin.model.js";
import Role from "../../models/role.model.js";
import { ROLE_IDS } from "../../constants/roles.js";

// Login Super Admin
export const loginSuperAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find super admin by email and populate role
    const superAdmin = await SuperAdmin.findOne({ email }).populate({
      path: "role_id",
      select: "name description",
    });

    console.log(superAdmin, "superAdmin populated");

    // Check if super admin exists
    if (!superAdmin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if super admin is active
    if (!superAdmin.is_active) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: superAdmin._id,
        email: superAdmin.email,
        role_id: superAdmin.role_id,
        role: ROLE_IDS.SUPER_ADMIN,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role_id ? superAdmin.role_id.name : "super_admin",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Logout Super Admin
export const logoutSuperAdmin = (req, res) => {
  console.log("logoutSuperAdmin", req.user);
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get Current Super Admin
export const getCurrentSuperAdmin = async (req, res) => {
  try {
    const superAdmin = await SuperAdmin.findById(req.user.id)
      .select("-password")
      .populate({
        path: "role_id",
        select: "name description",
      });

    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "Super admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: superAdmin,
    });
  } catch (error) {
    console.error("Get current super admin error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

