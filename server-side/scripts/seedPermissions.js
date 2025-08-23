import mongoose from 'mongoose';
import Permission from '../models/permissions.models.js';
import dotenv from 'dotenv';

dotenv.config();

// Permissions from frontend config
const PERMISSIONS = [
  // User Management
  "user:create",
  "user:view", 
  "user:edit",
  "user:delete",
  "user:list",

  // Course Management
  "course:create",
  "course:view",
  "course:edit", 
  "course:delete",
  "course:list",

  // Dashboard
  "dashboard:view",

  // Role Management
  "role:create",
  "role:view",
  "role:edit",
  "role:delete", 
  "role:list",

  // Tenant Management
  "tenant:create",
  "tenant:view",
  "tenant:edit",
  "tenant:delete",
  "tenant:list",
];

const seedPermissions = async () => {
  try {
    // Connect to MongoDB using the same configuration as the main app
    const MONGO_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.s0xqnyv.mongodb.net`;
    
    await mongoose.connect(MONGO_URI, {
      dbName: process.env.DB_NAME,
    });
    console.log('Connected to MongoDB');

    // Clear existing permissions
    await Permission.deleteMany({});
    console.log('Cleared existing permissions');

    // Create permissions
    const permissionPromises = PERMISSIONS.map(permissionName => 
      Permission.create({
        name: permissionName,
        is_active: true
      })
    );

    const createdPermissions = await Promise.all(permissionPromises);
    console.log(`Created ${createdPermissions.length} permissions:`);
    
    createdPermissions.forEach(permission => {
      console.log(`- ${permission.name}`);
    });

    console.log('Permissions seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding permissions:', error);
    process.exit(1);
  }
};

seedPermissions(); 