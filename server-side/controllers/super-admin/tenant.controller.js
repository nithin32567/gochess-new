import Tenant from "../../models/tenant.model.js";
import Role from "../../models/role.model.js";
import User from "../../models/user.model.js";
import Login from "../../models/login.model.js";
import Crypto from "crypto";
import sendMail from "../../utils/senMail.js";
import mongoose from "mongoose";
import Subcategory from "../../models/Subcategory.js";
import Course from "../../models/Course.js";
import MeetingCredential from "../../models/meeting.credential.model.js";
import Module from "../../models/Module.js";
import Lesson from "../../models/Lesson.model.js";

// Create new tenant

export const getCurrentTenant = async (req, res) => {
  try {
    const { id } = req.user;
    const tenant = await Tenant.findById(id);
    res.status(200).json(tenant);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tenant",
      error: error.message,
    });
  }
};

// Create a new tenant

// // Get all tenants
export const getAllTenants = async (req, res) => {
  console.log("getAllTenants");
  try {
    // Fetch all tenants
    const tenants = await Tenant.find();
    // console.log(tenants, "tenants");
    // For each tenant, get user and login info
    const detailedTenants = await Promise.all(
      tenants.map(async (tenant) => {
        const user = await User.findOne({ tenant_id: tenant._id });
        const login = await Login.findOne({ tenant_id: tenant._id });
        const zoomapikey = await MeetingCredential.findOne({
          tenantId: tenant._id,
        });

        return {
          tenant,
          user,
          login,
          zoomapikey,
        };
      })
    );
    // console.log(detailedTenants, "detailedTenants");

    res.status(200).json({
      success: true,
      count: detailedTenants.length,
      tenants: detailedTenants,
    });
  } catch (error) {
    console.error("Get tenants error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// // Get single tenant
export const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tenant,
    });
  } catch (error) {
    console.error("Get tenant error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTenant = async (req, res) => {
  // console.log("updateTenant");
  try {
    const { id } = req.params;
    const {
      name,
      subdomain,
      is_active,
      email,
      zoomApiKey,
      zoomApiSecret,
      zoomApiId,
    } = req.body;

    const tenant = await Tenant.findByIdAndUpdate(
      id,
      { name, subdomain, is_active },
      { new: true }
    );
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    const login = await Login.findOneAndUpdate(
      { tenant_id: id },
      { email },
      { new: true }
    );
    if (!login) {
      return res.status(404).json({
        success: false,
        message: "Login not found",
      });
    }

    if (zoomApiId || zoomApiKey || zoomApiSecret) {
      const zoomapikey = await MeetingCredential.findOneAndUpdate(
        { tenantId: id },
        { zoomApiKey, zoomApiSecret, zoomApiId },
        { new: true }
      );
      if (!zoomapikey) {
        await MeetingCredential.create({
          tenantId: id,
          zoomApiKey,
          zoomApiSecret,
          zoomApiId,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Tenant updated successfully",
    });
  } catch (error) {
    console.error("Update tenant error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteTenant = async (req, res) => {
  console.log("deleteTenant");
  const { tenantId } = req.params;
  console.log("id", tenantId);
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const courses = await Course.find({ tenant_id: tenantId }).session(session);
    for (const course of courses) {
      const modules = await Module.find({ course_id: course._id }).session(
        session
      );
      for (const module of modules) {
        await Lesson.deleteMany({ module_id: module._id }).session(session);
      }
      await Module.deleteMany({ course_id: course._id }).session(session);
      await Course.findByIdAndDelete(course._id).session(session);
    }
    await Login.deleteMany({ tenant_id: tenantId }).session(session);
    await Tenant.findByIdAndDelete(tenantId).session(session);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      success: true,
      message: "Tenant deleted successfully",
    });
  } catch (error) {
    console.error("Delete tenant error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const tenant = await Tenant.findByIdAndUpdate(
      id,
      { is_active: status },
      { new: true }
    );
    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//=====================================================

export const createTenant = async (req, res) => {
  try {
    const { fname, lname, name, subdomain, email, phone_number, plan } =
      req.body;
    const isUserExist = await Login.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // validate phone number
    if (!phone_number || phone_number.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required and must be 10 digits",
      });
    }

    const tenant = await Tenant.create({ name, subdomain, is_active: false });
    const roleId = await Role.findOne({ name: "tenant" });
    const password = Crypto.randomBytes(16).toString("hex");
    const user = await User.create({
      fname,
      lname,
      phone_number,
      email,
      dob: new Date(),
      age: 0,
    });
    const login = await Login.create({
      user_id: user._id,
      email,
      password,
      role_id: roleId._id,
      tenant_id: tenant._id,
    });

    await Promise.all([user.save(), login.save(), tenant.save()]).then(
      async () => {
        try {
          const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to GoChess LMS</h2>
            <p>Hello ${name},</p>
            <p>Your tenant account has been created successfully. Here are your temporary login credentials:</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> ${password}</p>
            </div>
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>⚠️ Security Notice:</strong></p>
              <ul>
                <li>This is a temporary password for your first login</li>
                <li>You will be required to change your password immediately after login</li>
                <li>Do not share these credentials with anyone</li>
              </ul>
            </div>
            <p>Best regards,<br>GoChess LMS Team</p>
          </div>
        `;

          await sendMail({
            to: email,
            subject:
              "Welcome to GoChess LMS - Your Temporary Account Credentials",
            text: `Welcome to GoChess LMS! Your tenant account has been created. Email: ${email}, Temporary Password: ${password}. You must change your password after first login for security.`,
            html: htmlContent,
          });

          res.status(200).json({
            success: true,
            message: "Tenant created successfully and welcome email sent",
          });
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
          res.status(200).json({
            success: true,
            message: "Tenant created successfully but email sending failed",
          });
        }
      }
    );
  } catch (error) {
    console.error("Create tenant error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
