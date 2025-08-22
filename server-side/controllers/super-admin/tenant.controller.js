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

export const createTenant = async (req, res) => {
  console.log("working");

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fname, lname, email, phone_number, subdomain } = req.body;
    console.log("paylod", req.body);

    const roleFind = await Role.findOne({ name: "tenant" });
    const role_id = roleFind._id;
    console.log("role_id--------------------------", role_id);
    // Validation
    if (!fname || !lname || !email || !phone_number || !subdomain) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    console.log("================ ======  ========================");
    // Check for existing user
    const existingUser = await Login.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Check for existing tenant
    const existingTenant = await Tenant.findOne({ subdomain });
    if (existingTenant) {
      return res.status(400).json({
        success: false,
        message: "Tenant with this subdomain already exists",
      });
    }

    // find role

    const roleId = await Role.findOne({ name: "tenant" });
    console.log("roleId--------------------------", roleId);

    // Generate password setup token
    const passwordSetupToken = Crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000;

    // Create tenant within transaction
    const tenant = await Tenant.create(
      [
        {
          name: `${fname} ${lname}`,
          subdomain,
          is_active: false,
        },
      ],
      { session }
    );

    // Create user within transaction
    const newUser = await User.create(
      [
        {
          fname,
          lname,
          email,
          phone_number,
          tenant_id: tenant[0]._id,
        },
      ],
      { session }
    );

    // Create login record within transaction
    await Login.create(
      [
        {
          email,
          user_id: newUser[0]._id,
          tenant_id: tenant[0]._id,
          role_id,
          passwordSetupToken,
          tokenExpiry,
          is_active: false,
          tenant_id: tenant[0]._id,
        },
      ],
      { session }
    );
    // console.log(newUser, "newUser");

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
      // console.log(emailError, "emailError");
      // If email fails, abort the transaction
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        success: false,
        message: "Failed to send email. Tenant creation aborted.",
        error: emailError.message,
      });
    }

    // If everything is successful, commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Tenant created successfully. Email sent.",
      data: tenant[0],
    });
  } catch (error) {
    // Only abort transaction if it hasn't been committed yet
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();

    console.error("Tenant creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating tenant",
      error: error.message,
    });
  }
};

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
        const user = await User.findOne({ tenant_id: tenant._id })
        const login = await Login.findOne({ tenant_id: tenant._id })
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
