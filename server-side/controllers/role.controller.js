import Role from "../models/role.model.js";
import Permission from "../models/permissions.models.js";

// Create a new role
export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role with this name already exists",
      });
    }

    // Convert permission keys to ObjectIds if permissions are provided
    let permissionIds = [];
    if (permissions && permissions.length > 0) {
      // Check if permissions are already ObjectIds or permission keys
      const isObjectId = permissions[0] && typeof permissions[0] === 'string' && permissions[0].length === 24;
      
      if (isObjectId) {
        // If they're already ObjectIds, use them directly
        permissionIds = permissions;
      } else {
        // If they're permission keys, look them up in the database
        const permissionDocs = await Permission.find({
          name: { $in: permissions },
          is_active: true
        });
        
        if (permissionDocs.length !== permissions.length) {
          return res.status(400).json({
            success: false,
            message: "One or more permissions are invalid or inactive",
          });
        }
        
        permissionIds = permissionDocs.map(permission => permission._id);
      }
    }

    // Create new role
    const role = await Role.create({
      name,
      description,
      permissions: permissionIds,
    });

    // Populate permissions for response
    const populatedRole = await Role.findById(role._id).populate("permissions");

    return res.status(201).json({
      success: true,
      data: populatedRole,
      message: "Role created successfully",
    });
  } catch (error) {
    console.error("Create role error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error creating role",
    });
  }
};

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions");

    return res.status(200).json({
      success: true,
      data: roles,
      message: "Roles fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching roles",
    });
  }
};

// Get role by ID
export const getRoleById = async (req, res) => {
  try {
    const { roleId } = req.params;

    const role = await Role.findById(roleId).populate("permissions");
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: role,
      message: "Role fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching role",
    });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if new name conflicts with existing role
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: "Role with this name already exists",
        });
      }
    }

    // Convert permission keys to ObjectIds if permissions are provided
    let permissionIds = role.permissions; // Keep existing permissions by default
    if (permissions !== undefined) {
      if (permissions.length === 0) {
        permissionIds = [];
      } else {
        // Check if permissions are already ObjectIds or permission keys
        const isObjectId = permissions[0] && typeof permissions[0] === 'string' && permissions[0].length === 24;
        
        if (isObjectId) {
          // If they're already ObjectIds, use them directly
          permissionIds = permissions;
        } else {
          // If they're permission keys, look them up in the database
          const permissionDocs = await Permission.find({
            name: { $in: permissions },
            is_active: true
          });
          
          if (permissionDocs.length !== permissions.length) {
            return res.status(400).json({
              success: false,
              message: "One or more permissions are invalid or inactive",
            });
          }
          
          permissionIds = permissionDocs.map(permission => permission._id);
        }
      }
    }

    // Update role
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      {
        $set: {
          name: name || role.name,
          description: description || role.description,
          permissions: permissionIds,
        },
      },
      { new: true }
    ).populate("permissions");

    return res.status(200).json({
      success: true,
      data: updatedRole,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error updating role",
    });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    await Role.findByIdAndDelete(roleId);

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error deleting role",
    });
  }
};

// Assign permissions to role
export const assignPermissionsToRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body;

    // Validate input
    if (!permissionIds || !Array.isArray(permissionIds)) {
      return res.status(400).json({
        success: false,
        message: "Permission IDs array is required",
      });
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if all permissions exist and are active
    const permissions = await Permission.find({
      _id: { $in: permissionIds },
      is_active: true,
    });

    if (permissions.length !== permissionIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more permissions are invalid or inactive",
      });
    }

    // Update role with new permissions
    role.permissions = permissionIds;
    await role.save();

    // Return updated role with populated permissions
    const updatedRole = await Role.findById(roleId).populate("permissions");

    return res.status(200).json({
      success: true,
      message: "Permissions assigned successfully",
      data: updatedRole,
    });
  } catch (error) {
    console.error("Assign permissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Error assigning permissions",
    });
  }
};

export const getRoleByName = async (req, res) => {
  console.log('==============================')
  try {
    const { roleName } = req.params;
    const role_name = roleName.toLowerCase().trim();
    const role = await Role.findOne({ name: role_name });
    console.log(role, "role");
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: role,
      message: "Role fetched successfully",
    });
  } catch (error) {
    console.error("Get role by name error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching role",
    });
  }
};

// Get permissions by keys (useful for frontend)
export const getPermissionsByKeys = async (req, res) => {
  try {
    const { keys } = req.query;
    
    if (!keys) {
      return res.status(400).json({
        success: false,
        message: "Permission keys are required",
      });
    }

    const permissionKeys = keys.split(',');
    const permissions = await Permission.find({
      name: { $in: permissionKeys },
      is_active: true
    });

    return res.status(200).json({
      success: true,
      data: permissions,
      message: "Permissions fetched successfully",
    });
  } catch (error) {
    console.error("Get permissions by keys error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching permissions",
    });
  }
};
