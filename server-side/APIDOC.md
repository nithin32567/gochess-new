# API Documentation

This document provides an overview of all API endpoints available in this project. Endpoints are grouped by their base path as defined in the main router.

---

## Table of Contents
- [Auth (Super Admin)](#auth-super-admin)
- [Auth](#auth)
- [Tenants](#tenants)
- [Permissions](#permissions)
- [Roles](#roles)
- [Users](#users)
- [Courses](#courses)
- [Categories](#categories)
- [Subcategories](#subcategories)
- [Superadmin](#superadmin)
- [Modules](#modules)
- [Lessons](#lessons)
- [Quizzes](#quizzes)
- [Instructors](#instructors)
- [Instructor (Student Management)](#instructor-student-management)
- [Levels](#levels)
- [Languages](#languages)

---

## [Summary Tables](#table-of-contents)

## Auth (Super Admin)
**Base Path:** `/auth/superadmin`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /login    | Login as super admin |
| POST   | /logout   | Logout super admin (requires super admin) |
| GET    | /me       | Get current super admin info (requires super admin) |

## Auth
**Base Path:** `/auth`

| Method | Path                | Description |
|--------|---------------------|-------------|
| POST   | /generate/password  | Generate or reset password |
| POST   | /resend-mail        | Resend verification or password mail |
| POST   | /logout             | Logout current user |

## Tenants
**Base Path:** `/tenants`

| Method | Path                | Description |
|--------|---------------------|-------------|
| POST   | /                   | Create a new tenant (super admin only) |
| GET    | /                   | Get all tenants (super admin only) |
| PUT    | /update/:id         | Update tenant by ID (super admin only) |
| GET    | /meetings           | Get all meetings for tenant |
| POST   | /create_meetings    | Create a new meeting for tenant |
| PUT    | /edit_meetings/:meetingId | Update meeting by ID for tenant |
| GET    | /:id                | Get tenant by ID (super admin only) |

## Permissions
**Base Path:** `/permissions`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /         | Create a new permission (super admin only) |
| GET    | /         | Get all permissions (super admin only) |
| PUT    | /:id      | Update permission by ID (super admin only) |

## Roles
**Base Path:** `/roles`

| Method | Path                | Description |
|--------|---------------------|-------------|
| POST   | /                   | Create a new role (tenant only) |
| GET    | /                   | Get all roles (tenant only) |
| GET    | /:roleId            | Get role by ID |
| PATCH  | /:roleId            | Update role by ID |
| POST   | /:roleId/permissions| Assign permissions to a role |

## Users
**Base Path:** `/users`

| Method | Path                | Description |
|--------|---------------------|-------------|
| GET    | /                   | Get all users (super admin only) |
| POST   | /                   | Create a new user |
| GET    | /count              | Get user count (super admin only) |
| GET    | /:id                | Get user by ID |
| PUT    | /:id                | Update user by ID |
| DELETE | /:id                | Delete user by ID |
| GET    | /tenant/:tenant_id  | Get users by tenant ID |
| GET    | /role/:role_id      | Get users by role ID |
| POST   | /login              | User login |
| GET    | /getcurrentuser/me  | Get current user info |
| GET    | /search/:searchValue| Search users by value |
| PUT    | /toggle-status/:id  | Toggle user status by ID |
| POST   | /requestpasswordreset| Request password reset |

## Courses
**Base Path:** `/courses`

| Method | Path                | Description |
|--------|---------------------|-------------|
| POST   | /                   | Create a new course (tenant only) |
| GET    | /                   | Get all courses (tenant only) |
| GET    | /count              | Get course count (super admin only) |
| PUT    | /:id                | Update course by ID (tenant only) |
| DELETE | /:id                | Delete course by ID (tenant only) |
| GET    | /:id                | Get course by ID (tenant only) |
| POST   | /assign-instructors | Assign instructors to course |
| POST   | /toggle-active-status| Toggle course active status |
| POST   | /set-course-dates   | Set course dates |
| POST   | /toggle-archive-status| Toggle course archive status |
| GET    | /get-course-names-with-id | Get course names with IDs (tenant only) |
| GET    | /search/course/value/:searchValue | Search courses by value (tenant only) |

## Categories
**Base Path:** `/categories`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /         | Create a new category |
| GET    | /         | Get all categories |
| GET    | /:id      | Get category by ID |
| PUT    | /:id      | Update category by ID |

## Subcategories
**Base Path:** `/subcategories`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /         | Create a new subcategory |
| GET    | /         | Get all subcategories |
| GET    | /:categoryId | Get subcategories by category ID |

## Superadmin
**Base Path:** `/superadmin`

| Method | Path      | Description |
|--------|-----------|-------------|
| GET    | /tenants  | Get all tenants (super admin only) |
| GET    | /tenants/course-count-and-user-count | Get tenants with course and user count (super admin only) |
| GET    | /courses/tenant/:tenantId | Get courses by tenant ID (super admin only) |
| POST   | /tenant/create-tenant | Create a new tenant (super admin only) |

## Modules
**Base Path:** `/modules`

| Method | Path      | Description |
|--------|-----------|-------------|
| GET    | /         | Get all modules |
| POST   | /create-module-and-assign-to-course/:course_id | Create module and assign to course |
| GET    | /get-modules-associated-with-the-course/:course_id | Get modules associated with a course (tenant only) |
| POST   | /assign-course-to-the-modules | Assign course to modules |
| PUT    | /update/display-order/:module_id | Update module display order |

## Lessons
**Base Path:** `/lessons`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /:module_id | Create a lesson for a module (file upload supported) |
| GET    | /:module_id | Get lessons for a module |
| GET    | /get-lessons-name/:module_id | Get lesson names for a module |
| PUT    | /update-order | Update lesson orders |
| PUT    | /editlesson/:id | Edit a lesson (file upload supported) |
| GET    | /get-lesson-content/:lesson_id | Get lesson content by lesson ID |

## Quizzes
**Base Path:** `/quizzes`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /         | Create a new quiz |
| GET    | /         | Get quizzes (by course/module) |
| POST   | /question | Add a new question to a quiz |
| POST   | /options  | Add options to a quiz question |
| GET    | /:quiz_id | Get quiz details by quiz ID |

## Instructors
**Base Path:** `/instructors`

| Method | Path      | Description |
|--------|-----------|-------------|
| GET    | /get_all  | Get all instructors (tenant only) |
| GET    | /search/:searchValue | Search instructors (tenant only) |
| GET    | /instructor-courses | Get instructor courses (instructor only) |

## Instructor (Student Management)
**Base Path:** `/instructor`

| Method | Path      | Description |
|--------|-----------|-------------|
| GET    | /students | Get students for instructor (instructor only) |
| POST   | /students | Create student for instructor (instructor only) |
| DELETE | /students/:studentId | Delete student for instructor (instructor only) |

## Levels
**Base Path:** `/levels`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /         | Create a new level |
| GET    | /         | Get all levels |
| PUT    | /:id      | Update level by ID |
| DELETE | /:id      | Delete level by ID |

## Languages
**Base Path:** `/languages`

| Method | Path      | Description |
|--------|-----------|-------------|
| POST   | /         | Create a new language |
| GET    | /         | Get all languages |
| PUT    | /:id      | Update language by ID |
| DELETE | /:id      | Delete language by ID |

---

## Notes
- Some endpoints require authentication and/or specific roles (e.g., super admin, tenant, instructor). See middleware usage in the code for details.
- File upload endpoints (e.g., lessons) require multipart/form-data.
- For more details on request/response bodies, refer to the controller implementations. 

---

# Detailed Endpoint Reference

Below are detailed specifications for each API endpoint, including authentication, headers, parameters, request/response examples, and error cases.

## Auth (Super Admin)

### POST /auth/superadmin/login
- **Description:** Login as super admin
- **Authentication:** None
- **Headers:** None
- **Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "yourpassword"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "super_admin"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```
- **Cookies:** Sets `token` cookie (JWT)

### POST /auth/superadmin/logout
- **Description:** Logout super admin
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /auth/superadmin/me
- **Description:** Get current super admin info
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "email": "string",
    "role_id": { "_id": "string", "name": "super_admin", "description": "string" },
    ...
  }
}
```

## Auth

### POST /auth/generate/password
- **Description:** Generate or reset password
- **Authentication:** None
- **Headers:** None
- **Request Body:**
```json
{
  "token": "string",
  "password": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Password setup successful. Your account is now active."
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Invalid or expired token."
}
```

### POST /auth/resend-mail
- **Description:** Resend verification or password mail
- **Authentication:** None
- **Headers:** None
- **Request Body:**
```json
{
  "email": "string"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Mail sent successfully."
}
```

### POST /auth/logout
- **Description:** Logout current user
- **Authentication:** User must be logged in (token in cookie)
- **Headers:** Cookie: `token=<JWT>`
- **Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Tenants

### POST /tenants
- **Description:** Create a new tenant (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Tenant created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Tenant already exists"
}
```

### GET /tenants
- **Description:** Get all tenants (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "isActive": true
    }
  ]
}
```

### PUT /tenants/update/:id
- **Description:** Update tenant by ID (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "isActive": true
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Tenant updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Tenant not found"
}
```

### GET /tenants/meetings
- **Description:** Get all meetings for tenant
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "date": "string",
      "time": "string",
      "duration": "string",
      "status": "string",
      "createdAt": "string"
    }
  ]
}
```

### POST /tenants/create_meetings
- **Description:** Create a new meeting for tenant
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "date": "string",
  "time": "string",
  "duration": "string",
  "status": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Meeting created successfully",
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "date": "string",
    "time": "string",
    "duration": "string",
    "status": "string",
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Failed to create meeting"
}
```

### PUT /tenants/edit_meetings/:meetingId
- **Description:** Update meeting by ID for tenant
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "date": "string",
  "time": "string",
  "duration": "string",
  "status": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Meeting updated successfully",
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "date": "string",
    "time": "string",
    "duration": "string",
    "status": "string",
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Meeting not found"
}
```

### GET /tenants/:id
- **Description:** Get tenant by ID (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Tenant not found"
}
```

## Permissions

### POST /permissions
- **Description:** Create a new permission (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Permission created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Permission already exists"
}
```

### GET /permissions
- **Description:** Get all permissions (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### PUT /permissions/:id
- **Description:** Update permission by ID (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Permission updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Permission not found"
}
```

## Roles

### POST /roles
- **Description:** Create a new role (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Role already exists"
}
```

### GET /roles
- **Description:** Get all roles (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### GET /roles/:roleId
- **Description:** Get role by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Role not found"
}
```

### PATCH /roles/:roleId
- **Description:** Update role by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Role not found"
}
```

### POST /roles/:roleId/permissions
- **Description:** Assign permissions to a role
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "permissions": ["string"]
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Permissions assigned successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "permissions": ["string"]
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Role or permissions not found"
}
```

## Users

### GET /users
- **Description:** Get all users (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": { "_id": "string", "name": "string", "description": "string" },
      "isActive": true
    }
  ]
}
```

### POST /users
- **Description:** Create a new user
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": { "_id": "string", "name": "string", "description": "string" },
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

### GET /users/count
- **Description:** Get user count (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "total": 100
  }
}
```

### GET /users/:id
- **Description:** Get user by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": { "_id": "string", "name": "string", "description": "string" },
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "User not found"
}
```

### PUT /users/:id
- **Description:** Update user by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "isActive": true
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": { "_id": "string", "name": "string", "description": "string" },
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "User not found"
}
```

### DELETE /users/:id
- **Description:** Delete user by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "User not found"
}
```

### GET /users/tenant/:tenant_id
- **Description:** Get users by tenant ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": { "_id": "string", "name": "string", "description": "string" },
      "isActive": true
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Tenant not found"
}
```

### GET /users/role/:role_id
- **Description:** Get users by role ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": { "_id": "string", "name": "string", "description": "string" },
      "isActive": true
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Role not found"
}
```

### POST /users/login
- **Description:** User login
- **Authentication:** None
- **Headers:** None
- **Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": { "_id": "string", "name": "string", "description": "string" },
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### GET /users/getcurrentuser/me
- **Description:** Get current user info
- **Authentication:** User must be logged in (token in cookie)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": { "_id": "string", "name": "string", "description": "string" },
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "User not logged in"
}
```

### GET /users/search/:searchValue
- **Description:** Search users by value
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "role": { "_id": "string", "name": "string", "description": "string" },
      "isActive": true
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "No users found"
}
```

### PUT /users/toggle-status/:id
- **Description:** Toggle user status by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "message": "User status toggled successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "User not found"
}
```

### POST /users/requestpasswordreset
- **Description:** Request password reset
- **Authentication:** None
- **Headers:** None
- **Request Body:**
```json
{
  "email": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Password reset request sent"
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "User not found"
}
```

## Courses

### POST /courses
- **Description:** Create a new course (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": 100,
  "duration": "string",
  "level": "string",
  "category": "string",
  "subcategory": "string",
  "instructor": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": 100,
    "duration": "string",
    "level": "string",
    "category": "string",
    "subcategory": "string",
    "instructor": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course already exists"
}
```

### GET /courses
- **Description:** Get all courses (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": 100,
      "duration": "string",
      "level": "string",
      "category": "string",
      "subcategory": "string",
      "instructor": "string",
      "isActive": true,
      "createdAt": "string"
    }
  ]
}
```

### GET /courses/count
- **Description:** Get course count (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "total": 100
  }
}
```

### PUT /courses/:id
- **Description:** Update course by ID (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "price": 100,
  "duration": "string",
  "level": "string",
  "category": "string",
  "subcategory": "string",
  "instructor": "string",
  "isActive": true
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": 100,
    "duration": "string",
    "level": "string",
    "category": "string",
    "subcategory": "string",
    "instructor": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

### DELETE /courses/:id
- **Description:** Delete course by ID (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

### GET /courses/:id
- **Description:** Get course by ID (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": 100,
    "duration": "string",
    "level": "string",
    "category": "string",
    "subcategory": "string",
    "instructor": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

### POST /courses/assign-instructors
- **Description:** Assign instructors to course
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "courseId": "string",
  "instructorIds": ["string"]
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Instructors assigned to course successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": 100,
    "duration": "string",
    "level": "string",
    "category": "string",
    "subcategory": "string",
    "instructor": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course or instructors not found"
}
```

### POST /courses/toggle-active-status
- **Description:** Toggle course active status
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "courseId": "string",
  "isActive": true
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Course active status toggled successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": 100,
    "duration": "string",
    "level": "string",
    "category": "string",
    "subcategory": "string",
    "instructor": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

### POST /courses/set-course-dates
- **Description:** Set course dates
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "courseId": "string",
  "startDate": "string",
  "endDate": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Course dates set successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": 100,
    "duration": "string",
    "level": "string",
    "category": "string",
    "subcategory": "string",
    "instructor": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

### POST /courses/toggle-archive-status
- **Description:** Toggle course archive status
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "courseId": "string",
  "isArchived": true
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Course archive status toggled successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "price": 100,
    "duration": "string",
    "level": "string",
    "category": "string",
    "subcategory": "string",
    "instructor": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

### GET /courses/get-course-names-with-id
- **Description:** Get course names with IDs (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string"
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "No courses found"
}
```

### GET /courses/search/course/value/:searchValue
- **Description:** Search courses by value (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string"
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "No courses found"
}
```

## Categories

### POST /categories
- **Description:** Create a new category
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Category already exists"
}
```

### GET /categories
- **Description:** Get all categories
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### GET /categories/:id
- **Description:** Get category by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

### PUT /categories/:id
- **Description:** Update category by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

## Subcategories

### POST /subcategories
- **Description:** Create a new subcategory
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "category": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Subcategory created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "category": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Subcategory already exists"
}
```

### GET /subcategories
- **Description:** Get all subcategories
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "category": "string"
    }
  ]
}
```

### GET /subcategories/:categoryId
- **Description:** Get subcategories by category ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "category": "string"
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

## Superadmin

### GET /superadmin/tenants
- **Description:** Get all tenants (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "isActive": true
    }
  ]
}
```

### GET /superadmin/tenants/course-count-and-user-count
- **Description:** Get tenants with course and user count (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "isActive": true,
      "courseCount": 10,
      "userCount": 50
    }
  ]
}
```

### GET /superadmin/courses/tenant/:tenantId
- **Description:** Get courses by tenant ID (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": 100,
      "duration": "string",
      "level": "string",
      "category": "string",
      "subcategory": "string",
      "instructor": "string",
      "isActive": true,
      "createdAt": "string"
    }
  ]
}
```

### POST /superadmin/tenant/create-tenant
- **Description:** Create a new tenant (super admin only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Tenant created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Tenant already exists"
}
```

## Modules

### GET /modules
- **Description:** Get all modules
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "course": "string",
      "displayOrder": 1
    }
  ]
}
```

### POST /modules/create-module-and-assign-to-course/:course_id
- **Description:** Create module and assign to course
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "course": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Module created and assigned successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "course": "string",
    "displayOrder": 1
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course or module already exists"
}
```

### GET /modules/get-modules-associated-with-the-course/:course_id
- **Description:** Get modules associated with a course (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "course": "string",
      "displayOrder": 1
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course not found"
}
```

### POST /modules/assign-course-to-the-modules
- **Description:** Assign course to modules
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "courseId": "string",
  "moduleIds": ["string"]
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Course assigned to modules successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "course": "string",
    "displayOrder": 1
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Course or modules not found"
}
```

### PUT /modules/update/display-order/:module_id
- **Description:** Update module display order
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "moduleId": "string",
  "displayOrder": 1
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Module display order updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "course": "string",
    "displayOrder": 1
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Module not found"
}
```

## Lessons

### POST /lessons/:module_id
- **Description:** Create a lesson for a module (file upload supported)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "file": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Lesson created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "file": "string",
    "course": "string",
    "module": "string",
    "displayOrder": 1
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Module or lesson already exists"
}
```

### GET /lessons/:module_id
- **Description:** Get lessons for a module
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "file": "string",
      "course": "string",
      "module": "string",
      "displayOrder": 1
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Module not found"
}
```

### GET /lessons/get-lessons-name/:module_id
- **Description:** Get lesson names for a module
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string"
    }
  ]
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Module not found"
}
```

### PUT /lessons/update-order
- **Description:** Update lesson orders
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "moduleId": "string",
  "newOrder": [1, 2, 3]
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Lesson orders updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "file": "string",
    "course": "string",
    "module": "string",
    "displayOrder": 1
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Module not found"
}
```

### PUT /lessons/editlesson/:id
- **Description:** Edit a lesson (file upload supported)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "file": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Lesson updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "file": "string",
    "course": "string",
    "module": "string",
    "displayOrder": 1
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Lesson not found"
}
```

### GET /lessons/get-lesson-content/:lesson_id
- **Description:** Get lesson content by lesson ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "file": "string",
    "course": "string",
    "module": "string",
    "displayOrder": 1
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Lesson not found"
}
```

## Quizzes

### POST /quizzes
- **Description:** Create a new quiz
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "course": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Quiz created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "course": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Quiz already exists"
}
```

### GET /quizzes
- **Description:** Get quizzes (by course/module)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "course": "string",
      "isActive": true,
      "createdAt": "string"
    }
  ]
}
```

### POST /quizzes/question
- **Description:** Add a new question to a quiz
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "question": "string",
  "options": ["string"],
  "correctOption": "string",
  "quiz": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Question added to quiz successfully",
  "data": {
    "_id": "string",
    "question": "string",
    "options": ["string"],
    "correctOption": "string",
    "quiz": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Quiz or question already exists"
}
```

### POST /quizzes/options
- **Description:** Add options to a quiz question
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "questionId": "string",
  "options": ["string"]
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Options added to question successfully",
  "data": {
    "_id": "string",
    "question": "string",
    "options": ["string"]
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Question not found"
}
```

### GET /quizzes/:quiz_id
- **Description:** Get quiz details by quiz ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string",
    "course": "string",
    "isActive": true,
    "createdAt": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Quiz not found"
}
```

## Instructors

### GET /instructors/get_all
- **Description:** Get all instructors (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "isActive": true
    }
  ]
}
```

### GET /instructors/search/:searchValue
- **Description:** Search instructors (tenant only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "isActive": true
    }
  ]
}
```

### GET /instructors/instructor-courses
- **Description:** Get instructor courses (instructor only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "price": 100,
      "duration": "string",
      "level": "string",
      "category": "string",
      "subcategory": "string",
      "instructor": "string",
      "isActive": true,
      "createdAt": "string"
    }
  ]
}
```

## Instructor (Student Management)

### GET /instructor/students
- **Description:** Get students for instructor (instructor only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "email": "string",
      "isActive": true
    }
  ]
}
```

### POST /instructor/students
- **Description:** Create student for instructor (instructor only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "isActive": true
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Student already exists"
}
```

### DELETE /instructor/students/:studentId
- **Description:** Delete student for instructor (instructor only)
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Student not found"
}
```

## Levels

### POST /levels
- **Description:** Create a new level
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Level created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Level already exists"
}
```

### GET /levels
- **Description:** Get all levels
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### PUT /levels/:id
- **Description:** Update level by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Level updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Level not found"
}
```

### DELETE /levels/:id
- **Description:** Delete level by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "message": "Level deleted successfully"
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Level not found"
}
```

## Languages

### POST /languages
- **Description:** Create a new language
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Language created successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Language already exists"
}
```

### GET /languages
- **Description:** Get all languages
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

### PUT /languages/:id
- **Description:** Update language by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Request Body:**
```json
{
  "name": "string",
  "description": "string"
}
```
- **Response (Success):**
```json
{
  "success": true,
  "message": "Language updated successfully",
  "data": {
    "_id": "string",
    "name": "string",
    "description": "string"
  }
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Language not found"
}
```

### DELETE /languages/:id
- **Description:** Delete language by ID
- **Authentication:** Super admin (requires `isSuperAdmin` middleware)
- **Headers:** Cookie: `token=<JWT>`
- **Response (Success):**
```json
{
  "success": true,
  "message": "Language deleted successfully"
}
```
- **Response (Error):**
```json
{
  "success": false,
  "message": "Language not found"
}
``` 