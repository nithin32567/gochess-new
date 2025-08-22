import Tenant from "../../models/tenant.model.js";
import Login from "../../models/login.model.js";

import Course from "../../models/Course.js";
import User from "../../models/user.model.js";
import MeetingCredential from "../../models/meeting.credential.model.js";

// ! this is used to get all the tenants
export const getTenants = async (req, res) => {
  console.log('tenant')
  const tenants = await Tenant.find({});
  res.status(200).json({
    success: true,
    data: tenants,
  });
};

// ! this is used to get the tenants with the course count and user count
// export const getTenantsWithCourseCountandUserCount = async (req, res) => {
//   try {
//     const tenants = await Tenant.find({});

//     const enrichedTenants = await Promise.all(
//       tenants.map(async (tenant) => {
//         const [courseCount, userCount] = await Promise.all([
//           Course.countDocuments({ tenant_id: tenant._id }),
//           Login.countDocuments({ tenant_id: tenant._id }),
//         ]);

//         return {
//           ...tenant.toObject(),
//           courseCount,
//           userCount,
//         };
//       })
//     );
//     console.log("enrichedTenants", enrichedTenants);

//     res.status(200).json({
//       success: true,
//       data: enrichedTenants,
//     });
//   } catch (error) {
//     console.error("Error fetching tenant metrics:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to retrieve tenant data with counts",
//     });
//   }
// };

// Get all tenants with user, login, zoomapikey, courseCount and userCount
export const getTenantsWithCourseCountandUserCount = async (req, res) => {
  console.log("Fetching all tenant details...");
  try {
    const tenants = await Tenant.find();

    const detailedTenants = await Promise.all(
      tenants.map(async (tenant) => {
        const [user, login, zoomapikey, courseCount, userCount] =
          await Promise.all([
            User.findOne({ tenant_id: tenant._id }),
            Login.findOne({ tenant_id: tenant._id }),
            MeetingCredential.findOne({ tenantId: tenant._id }),
            Course.countDocuments({ tenant_id: tenant._id }),
            Login.countDocuments({ tenant_id: tenant._id }),
          ]);

        return {
          tenant: tenant.toObject(),
          user,
          login,
          zoomapikey,
          courseCount,
          userCount,
        };
      })
    );
    // console.log(detailedTenants);

    res.status(200).json({
      success: true,
      count: detailedTenants.length,
      tenants: detailedTenants,
    });
  } catch (error) {
    console.error("Error fetching tenant details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ! this is used to get the courses by tenant and enrollerd students count
export const getCoursesByTenant = async (req, res) => {
  console.log(
    "req.params =========================================================",
    req.params
  );
  try {
    const { tenantId } = req.params;
    const courses = await Course.find({ tenant_id: tenantId });
    // console.log("courses", courses);
    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
    });
  }
};

export const disableTenant = async (req, res) => {
  console.log(
    "disableTenant ================================================="
  );
  try {
    const { tenantId } = req.params;

    const LoginUser = await Login.findOneAndUpdate(
      { tenant_id: tenantId },
      {
        is_active: false,
      }
    );
    console.log("LoginUser", LoginUser);

    const tenant = await Tenant.findOneAndUpdate(
      { _id: tenantId },
      {
        is_active: false,
      }
    );
    console.log("tenant", tenant);
    console.log(
      "---------------------------------------------------------------------------------------------------------"
    );
    res.status(200).json({
      success: true,
      message: "Tenant disabled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to disable tenant",
    });
  }
};

export const enableTenant = async (req, res) => {
  console.log("enableTenant =================================================");
  try {
    const { tenantId } = req.params;
    const LoginUser = await Login.findOneAndUpdate(
      { tenant_id: tenantId },
      {
        is_active: true,
      }
    );
    console.log("LoginUser", LoginUser);
    const tenant = await Tenant.findOneAndUpdate(
      { _id: tenantId },
      {
        is_active: true,
      }
    );
    console.log("tenant", tenant);
    console.log(
      "---------------------------------------------------------------------------------------------------------"
    );
    res.status(200).json({
      success: true,
      message: "Tenant enabled successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to enable tenant",
    });
  }
};
