# 📚  Learning Management System (LMS)

This project is a **Multi-Tenant Learning Management System** built using the MERN stack (MongoDB, Express.js, React, and Node.js). It enables educational institutions, companies, or organizations to manage their own sub-platforms (tenants) under a single centralized system.

Each tenant has isolated access to:
- Their own users (students, instructors, staff)
- Courses and content
- Plans and subscriptions
- Settings and dashboards

The **Super Admin** manages all tenants, while tenant admins manage content and users within their own environments. The platform supports scalable growth, role-based access control, and customizable configurations for each tenant.

---

## ✨ Key Features

- Multi-tenant architecture with subdomain support
- Role-based access control (Super Admin, Tenant Admin, Instructors, Students)
- Course and user management
- Subscription and plan handling
- Clean and responsive UI using Tailwind CSS
- Secure authentication with password validation
- RESTful API with Mongoose for MongoDB

---

## 🧱 Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, bcrypt
- **Version Control**: Git & GitHub

---
### 📊 Role Table Structure

The `Role` model defines various roles within the system (e.g., Super Admin, Tenant Admin, Instructor, Student), each with its own set of permissions. Roles help enforce **role-based access control (RBAC)** throughout the application.

#### 🧾 Schema Fields

| Field         | Type                           | Description                                        | Required | Unique | Default |
|---------------|--------------------------------|----------------------------------------------------|----------|--------|---------|
| `name`        | `String`                       | The name of the role (e.g., "Instructor")          | ✅       | ✅     | –       |
| `description` | `String`                       | A short description of the role's responsibilities | ✅       | ❌     | –       |
| `permissions` | `[ObjectId] (ref: Permission)` | An array of associated permissions                 | ❌       | ❌     | `[]`    |
| `createdAt`   | `Date`                         | Timestamp when the role was created                | ✅ (auto)| ❌     | –       |
| `updatedAt`   | `Date`                         | Timestamp when the role was last updated           | ✅ (auto)| ❌     | –       |
### 🛡️ Super Admin Table Structure

The `SuperAdmin` model represents users with the highest level of access. Super Admins have the ability to manage all tenants, global settings, and oversee platform-wide operations.

#### 🧾 Schema Fields

| Field          | Type                           | Description                                             | Required | Unique | Default |
|----------------|--------------------------------|---------------------------------------------------------|----------|--------|---------|
| `name`         | `String`                       | Full name of the Super Admin                            | ✅       | ❌     | –       |
| `email`        | `String`                       | Email address (must be unique and valid format)         | ✅       | ✅     | –       |
| `password`     | `String`                       | Hashed password for authentication                      | ✅       | ❌     | –       |
| `phone_number` | `String`                       | 10-digit contact number                                 | ✅       | ❌     | –       |
| `role_id`      | `ObjectId` (ref: Role)         | Reference to the associated role document               | ✅       | ❌     | –       |
| `is_active`    | `Boolean`                      | Status flag to enable/disable the account               | ❌       | ❌     | `true`  |
| `createdAt`    | `Date`                         | Timestamp when the account was created                  | ✅ (auto)| ❌     | –       |
| `updatedAt`    | `Date`                         | Timestamp when the account was last updated             | ✅ (auto)| ❌     | –       |
---
### 🔐 Permission Table Structure

The `Permission` model defines specific actions or privileges that can be granted to roles. These permissions are used to enforce fine-grained access control throughout the system.

#### 🧾 Schema Fields

| Field       | Type      | Description                                      | Required | Unique | Default |
|-------------|-----------|--------------------------------------------------|----------|--------|---------|
| `name`      | `String`  | The name of the permission (e.g., "create_user") | ✅       | ❌     | –       |
| `is_active` | `Boolean` | Indicates if the permission is currently active  | ❌       | ❌     | `true`  |

---
### 👤 User Table Structure

The `User` model represents individual users within a tenant's environment, such as students, instructors, or staff. This schema stores basic profile and contact information.

#### 🧾 Schema Fields

| Field          | Type     | Description                                      | Required | Unique | Default |
|----------------|----------|--------------------------------------------------|----------|--------|---------|
| `fname`        | `String` | User’s first name                                | ✅       | ❌     | –       |
| `lname`        | `String` | User’s last name                                 | ✅       | ❌     | –       |
| `age`          | `Number` | User’s age                                       | ❌       | ❌     | –       |
| `dob`          | `Date`   | Date of birth                                    | ❌       | ❌     | –       |
| `email`        | `String` | Unique email (valid format, lowercase & trimmed) | ✅       | ✅     | –       |
| `phone_number` | `String` | 10-digit phone number                            | ✅       | ❌     | –       |
| `createdAt`    | `Date`   | Timestamp when the user was created              | ✅ (auto)| ❌     | –       |
| `updatedAt`    | `Date`   | Timestamp when the user was last updated         | ✅ (auto)| ❌     | –       |

---
### 🔑 Login Table Structure

The `Login` model manages authentication credentials and session-related data for users within a specific tenant. It links users to their role and tenant, and includes secure password handling and reset functionality.

#### 🧾 Schema Fields

| Field                   | Type                            | Description                                                                 | Required | Unique | Default        |
|-------------------------|----------------------------------|-----------------------------------------------------------------------------|----------|--------|----------------|
| `user_id`               | `ObjectId` (ref: User)           | Reference to the associated user                                            | ✅       | ❌     | –              |
| `tenant_id`             | `ObjectId` (ref: Tenant)         | Reference to the tenant this user belongs to                                | ✅       | ❌     | –              |
| `email`                 | `String`                         | User’s login email (unique per tenant, validated format)                    | ✅       | ✅*    | –              |
| `password`              | `String`                         | Hashed login password                                                       | ❌       | ❌     | –              |
| `passwordSetupToken`    | `String`                         | Token for initial password setup                                            | ❌       | ❌     | –              |
| `tokenExpiry`           | `Date`                           | Expiry date/time for the password setup token                               | ❌       | ❌     | –              |
| `role_id`               | `ObjectId` (ref: Role)           | Role assigned to this login                                                 | ✅       | ❌     | –              |
| `created_at`            | `Date`                           | Explicit timestamp of creation                                              | ❌       | ❌     | `Date.now`     |
| `is_active`             | `Boolean`                        | Indicates whether the login is currently active                             | ❌       | ❌     | `true`         |
| `last_login`            | `Date`                           | Timestamp of the last login                                                 | ❌       | ❌     | –              |
| `password_changed_at`   | `Date`                           | Time when the password was last updated                                     | ❌       | ❌     | –              |
| `password_reset_token`  | `String`                         | Token used for password reset                                               | ❌       | ❌     | –              |
| `password_reset_expires`| `Date`                           | Expiry time for the reset token                                             | ❌       | ❌     | –              |
| `createdAt`             | `Date`                           | Auto-generated timestamp of creation                                        | ✅ (auto)| ❌     | –              |
| `updatedAt`             | `Date`                           | Auto-generated timestamp of last update                                     | ✅ (auto)| ❌     | –              |

> 🔒 **Compound Index**: A unique compound index is enforced on `{ email, tenant_id }` to ensure email addresses are unique **within each tenant**.

#### 🛠️ Schema Methods

- **`comparePassword(candidatePassword)`**  
  Compares a provided password with the stored hash to validate login.

- **`changedPasswordAfter(timestamp)`**  
  Checks if the password was changed after a certain timestamp (used for token validation).

> 💡 Passwords are hashed automatically before saving using Mongoose `pre-save` middleware and `bcrypt`.

---
### 🏠 Address Table Structure

The `Address` model is used to store structured address information. It can be linked to users, tenants, or any other entity requiring location details.

#### 🧾 Schema Fields

| Field           | Type     | Description                                 | Required | Unique | Default |
|-----------------|----------|-----------------------------------------_---|----------|--------|---------|
| `address_line1` | `String` | Primary street address or location line     | ✅       | ❌     | –       |
| `address_line2` | `String` | Additional address details (apt, suite, etc.)| ❌       | ❌     | –       |
| `city`          | `String` | City or locality name                       | ❌       | ❌     | –       |
| `state`         | `String` | State, province, or region                  | ❌       | ❌     | –       |
| `postal_code`   | `String` | ZIP or postal code                          | ❌       | ❌     | –       |
| `country`       | `String` | Country name                                | ❌       | ❌     | –       |
---
### 📍 UserAddress Table Structure

The `UserAddress` model represents the relationship between a user and one or more addresses. This allows users to have multiple address records (e.g., home, work), with the option to flag one as primary.

#### 🧾 Schema Fields

| Field         | Type                           | Description                                     | Required | Unique | Default  |
|---------------|--------------------------------|-------------------------------------------------|----------|--------|----------|
| `user_id`     | `ObjectId` (ref: User)         | Reference to the user                           | ✅       | ❌     | –        |
| `address_id`  | `ObjectId` (ref: Address)      | Reference to the address                        | ✅       | ❌     | –        |
| `address_type`| `String`                       | Type of address (e.g., home, work, billing)     | ❌       | ❌     | –        |
| `is_primary`  | `Boolean`                      | Indicates if this is the user's primary address | ❌       | ❌     | `false`  |

---
### 🏢 Tenant Table Structure

The `Tenant` model represents individual organizations or institutions using the LMS platform. Each tenant operates in an isolated environment under a unique subdomain.

#### 🧾 Schema Fields

| Field        | Type     | Description                                                                 | Required | Unique | Default   |
|--------------|----------|-----------------------------------------------------------------------------|----------|--------|-----------|
| `name`       | `String` | Name of the tenant organization                                             | ✅       | ✅     | –         |
| `subdomain`  | `String` | Unique subdomain identifier (used for multi-tenancy routing)                | ✅       | ✅     | –         |
| `is_active`  | `Boolean`| Indicates whether the tenant account is currently active                    | ❌       | ❌     | `false`   |
| `createdAt`  | `Date`   | Timestamp when the tenant was created                                       | ✅ (auto)| ❌     | –         |
| `updatedAt`  | `Date`   | Timestamp when the tenant was last updated                                  | ✅ (auto)| ❌     | –         |

> 🌐 **Subdomain Format**: Must contain only lowercase letters, numbers, and hyphens (e.g., `acme-school`, `tech-institute`).
---
### 🗂️ Category Table Structure

The `Category` model is used to organize content such as courses, articles, or other educational material within the LMS. Categories help structure and filter offerings for users.

#### 🧾 Schema Fields

| Field       | Type     | Description                                 | Required | Unique | Default |
|-------------|----------|---------------------------------------------|----------|--------|---------|
| `category`  | `String` | Name of the category (e.g., "Mathematics")  | ✅       | ✅     | –       |
| `createdAt` | `Date`   | Timestamp when the category was created     | ✅ (auto)| ❌     | –       |
| `updatedAt` | `Date`   | Timestamp when the category was last updated| ✅ (auto)| ❌     | –       |
---
### 🧩 Subcategory Table Structure

The `Subcategory` model allows further classification under each `Category`, providing a more granular organization of content such as courses or topics.

#### 🧾 Schema Fields

| Field             | Type                           | Description                                   | Required | Unique | Default |
|-------------------|--------------------------------|-----------------------------------------------|----------|--------|---------|
| `category_id`     | `ObjectId` (ref: Category)     | Reference to the parent category              | ✅       | ❌     | –       |
| `subcategory_name`| `String`                       | Name of the subcategory (e.g., "Algebra I")   | ✅       | ❌     | –       |
| `createdAt`       | `Date`                         | Timestamp when the subcategory was created    | ✅ (auto)| ❌     | –       |
| `updatedAt`       | `Date`                         | Timestamp when the subcategory was updated    | ✅ (auto)| ❌     | –       |

> 🔗 **Relationship**: Each subcategory is linked to a single parent `Category`, enabling hierarchical structuring of course content.

---
### 🌐 Language Table Structure

The `Language` model defines the available languages that can be associated with courses, content, or user preferences within the platform.

#### 🧾 Schema Fields

| Field       | Type     | Description                             | Required | Unique | Default |
|-------------|----------|-----------------------------------------|----------|--------|---------|
| `language`  | `String` | Name of the language (e.g., "English")  | ✅       | ✅     | –       |
| `createdAt` | `Date`   | Timestamp when the language was created | ✅ (auto)| ❌     | –       |
| `updatedAt` | `Date`   | Timestamp when the language was updated | ✅ (auto)| ❌     | –       |

> 🌍 **Use Case**: This schema enables multilingual support for courses, UI elements, and user settings across tenants.
---
### 🎯 CourseLevel Table Structure

The `CourseLevel` schema defines the skill or difficulty level of a course, enabling better categorization and personalized learning paths for users.

#### 🧾 Schema Fields

| Field           | Type     | Description                                             | Required | Enum Values                              | Default |
|------------------|----------|---------------------------------------------------------|----------|-------------------------------------------|---------|
| `course_level`   | `String` | Indicates the difficulty level of the course            | ✅       | `Beginner`, `Intermediate`, `Advanced`    | –       |
| `createdAt`      | `Date`   | Timestamp when the record was created                   | ✅ (auto)| –                                         | –       |
| `updatedAt`      | `Date`   | Timestamp when the record was last updated              | ✅ (auto)| –                                         | –       |

> 📘 **Use Case**: Helps learners filter and enroll in courses based on their current skill level or desired challenge.
---
### 📘 Course Table Structure

The `Course` model defines the core structure for educational content within the LMS. Each course belongs to a tenant and includes metadata like category, instructors, language, and more.

#### 🧾 Schema Fields

| Field                  | Type                              | Description                                                   | Required | Default  |
|------------------------|-----------------------------------|---------------------------------------------------------------|----------|----------|
| `tenant_id`            | `ObjectId` (ref: Tenant)          | The tenant who owns the course                                | ✅       | –        |
| `course_title`         | `String`                          | Title of the course                                           | ✅       | –        |
| `short_description`    | `String`                          | A brief summary of the course                                 | ✅       | –        |
| `description`          | `String`                          | Full course description                                       | ✅       | –        |
| `category`             | `ObjectId` (ref: Category)        | Category the course belongs to                                | ✅       | –        |
| `subcategory`          | `ObjectId` (ref: Subcategory)     | Subcategory under the main category                           | ✅       | –        |
| `language`             | `ObjectId` (ref: Language)        | Language the course is delivered in                           | ✅       | –        |
| `instructors`          | `[ObjectId]` (ref: User)          | List of users assigned as instructors                         | ❌       | `[]`     |
| `students`             | `[ObjectId]` (ref: User)          | List of enrolled students                                     | ❌       | `[]`     |
| `max_enrollment`       | `Number`                          | Maximum number of students allowed                            | ✅       | –        |
| `is_active`            | `Boolean`                         | Status of the course (active/inactive)                        | ❌       | `true`   |
| `is_archived`          | `Boolean`                         | Indicates if the course is archived                           | ❌       | `false`  |
| `level`                | `ObjectId` (ref: CourseLevel)     | Difficulty level of the course                                | ✅       | –        |
| `drip_content_enabled` | `Boolean`                         | Enables scheduled release of content                          | ❌       | `false`  |
| `start_date`           | `Date`                            | Optional course start date                                    | ❌       | –        |
| `end_date`             | `Date`                            | Optional course end date                                      | ❌       | –        |
| `createdAt`            | `Date`                            | Timestamp when the course was created                         | ✅ (auto)| –        |
| `updatedAt`            | `Date`                            | Timestamp when the course was last updated                    | ✅ (auto)| –        |

> 🧩 **Relationships**: A course is connected to categories, instructors, and students. It supports multilingual and multi-level structures across tenants.
---
### 🧩 Module Table Structure

The `Module` schema defines the modular breakdown of a course. Each module belongs to a specific course and may contain lessons or units of learning. Modules help organize content into structured learning paths.

#### 🧾 Schema Fields

| Field               | Type                          | Description                                           | Required | Default     |
|---------------------|-------------------------------|-------------------------------------------------------|----------|-------------|
| `course_id`         | `ObjectId` (ref: Course)       | Reference to the course this module belongs to        | ✅       | –           |
| `module_title`      | `String`                       | Title of the module                                   | ✅       | –           |
| `module_description`| `String`                       | Optional description of the module                    | ❌       | `""`        |
| `display_order`     | `Number`                       | Order of the module in course sequence                | ❌       | `0`         |
| `is_locked`         | `Boolean`                      | Whether the module is locked until certain criteria   | ❌       | `false`     |
| `is_deleted`        | `Boolean`                      | Soft delete flag                                      | ❌       | `false`     |
| `created_at`        | `Date`                         | Timestamp when the module was created                 | ✅ (auto)| –           |
| `updated_at`        | `Date`                         | Timestamp when the module was last updated            | ✅ (auto)| –           |

> 🔗 **Relationship**: Each module is linked to a `Course` and typically contains one or more `Lessons` or `Topics`.

> 🧠 **Use Case**: Use modules to divide course content into manageable, sequential chunks for structured delivery and learner progression.
---
### 📘 LessonType Table Structure

The `LessonType` schema defines the types of lessons supported within the LMS. This allows categorization and handling of lesson content based on its delivery format.

#### 🧾 Schema Fields

| Field         | Type     | Description                              | Required | Default |
|---------------|----------|------------------------------------------|----------|---------|
| `lesson_type` | `String` | The type of lesson content. Allowed values include: `"video"`, `"pdf"`, `"quiz"`, `"live"`, `"assignment"`, `"text"` | ✅       | –       |
| `createdAt`   | `Date`   | Timestamp when the lesson type was created | ✅ (auto)| –       |
| `updatedAt`   | `Date`   | Timestamp when the lesson type was last updated | ✅ (auto)| –   |

> 🎯 **Purpose**: Ensures each lesson in a course is classified properly for content rendering and platform features.

> 💡 **Note**: You can expand the enum in the future to support new content types (e.g. SCORM, interactive games).
---
### 📗 Lesson Table Structure

The `Lesson` schema defines individual learning units within a module. Lessons can vary by type—video, text, quiz, live session, and more—based on their `lesson_type_id`. This schema supports flexible and rich learning content.

#### 🧾 Schema Fields

| Field              | Type                          | Description                                                 | Required | Default   |
|--------------------|-------------------------------|-------------------------------------------------------------|----------|-----------|
| `module_id`        | `ObjectId` (ref: Module)      | The module to which this lesson belongs                     | ✅       | –         |
| `lesson_title`     | `String`                      | Title of the lesson                                          | ✅       | –         |
| `lesson_type_id`   | `ObjectId` (ref: Lesson_Type) | Type of lesson (e.g. video, pdf, quiz, etc.)                | ✅       | –         |
| `description`      | `String`                      | Optional description for the lesson                         | ❌       | `""`      |
| `video_url`        | `String`                      | URL to a hosted video lesson                                | ❌       | `""`      |
| `file_path`        | `String`                      | File path for downloadable content (e.g. PDFs)              | ❌       | `""`      |
| `quiz_id`          | `ObjectId` (ref: Quiz)        | Optional reference to a quiz                                | ❌       | `null`    |
| `live_session_id`  | `ObjectId` (ref: Live_session)| Optional reference to a live session                        | ❌       | `null`    |
| `lesson_duration`  | `Number`                      | Duration of the lesson in minutes                           | ❌       | `0`       |
| `is_downloadable`  | `Boolean`                     | Whether the lesson file can be downloaded                   | ❌       | `false`   |
| `is_preview`       | `Boolean`                     | Whether the lesson is available as a free preview           | ❌       | `false`   |
| `display_order`    | `Number`                      | Sort order of lessons within the module                     | ❌       | `0`       |
| `created_at`       | `Date`                        | Timestamp when lesson was created                           | ✅ (auto)| –         |
| `updated_at`       | `Date`                        | Timestamp when lesson was last updated                      | ✅ (auto)| –         |

> 🔗 **Relationships**: 
> - Links to a `Module`, 
> - a `LessonType` for content classification,
> - optionally a `Quiz` or `Live Session`.

> 🧠 **Use Case**: Allows the LMS to deliver diverse formats of educational content in a structured, ordered fashion.
---
### 📝 Quiz Table Structure

The `Quiz` schema represents assessments attached to courses or specific modules. It defines quiz settings, duration, passing criteria, and more, enabling instructors to evaluate learner progress.

#### 🧾 Schema Fields

| Field                | Type                          | Description                                                   | Required | Default |
|----------------------|-------------------------------|---------------------------------------------------------------|----------|---------|
| `course_id`          | `ObjectId` (ref: Course)      | The course to which this quiz belongs                         | ✅       | –       |
| `module_id`          | `ObjectId` (ref: Module)      | The module this quiz is associated with                       | ✅       | –       |
| `title`              | `String`                      | Title of the quiz                                             | ✅       | –       |
| `description`        | `String`                      | A short description of the quiz                               | ✅       | –       |
| `pass_percentage`    | `Number`                      | Percentage required to pass the quiz (0-100)                  | ✅       | `50`    |
| `time_limit_minutes` | `Number`                      | Time limit to complete the quiz (in minutes)                  | ✅       | –       |
| `attempts_allowed`   | `Number`                      | Number of attempts a student is allowed                       | ✅       | `1`     |
| `created_at`         | `Date`                        | When the quiz was created                                     | ✅ (auto)| –       |
| `updated_at`         | `Date`                        | When the quiz was last updated                                | ✅ (auto)| –       |

> 🔗 **Relationships**:
> - Connected to both a `Course` and a `Module` for contextual relevance.

> 📘 **Use Case**:
> - Helps instructors assess student knowledge after completing a section/module in the course.
> - Can be configured with time limits and multiple attempts.
---
### ❓ QuizQuestion Table Structure

The `QuizQuestion` schema defines individual questions belonging to a quiz. Each question can be of different types such as multiple choice, true/false, or fill-in-the-blank, and carries a score value.

#### 🧾 Schema Fields

| Field            | Type                          | Description                                           | Required | Default |
|------------------|-------------------------------|-------------------------------------------------------|----------|---------|
| `quiz_id`        | `ObjectId` (ref: Quiz)        | Reference to the quiz this question belongs to       | ✅       | –       |
| `question_text`  | `String`                      | The actual question text                             | ✅       | –       |
| `question_type`  | `String`                      | Type of question: `mcq`, `true_false`, `fill_blank`  | ✅       | –       |
| `score`          | `Number`                      | Score awarded for the correct answer                 | ✅       | `1`     |
| `created_at`     | `Date`                        | Timestamp for when the question was created          | ✅ (auto)| –       |
| `updated_at`     | `Date`                        | Timestamp for last update                            | ✅ (auto)| –       |

> 🧠 **Question Types**:
> - `mcq`: Multiple choice question
> - `true_false`: True or False
> - `fill_blank`: Fill in the blank

> 📘 **Use Case**:
> - Questions are linked to quizzes and support grading logic through the `score` field.
---
### 🔘 QuizOptions Table Structure

The `QuizOptions` schema defines the possible answer choices for a given quiz question. Each option is linked to a `QuizQuestion` and can be marked as correct or incorrect.

#### 🧾 Schema Fields

| Field           | Type                           | Description                                         | Required | Default  |
|----------------|--------------------------------|-----------------------------------------------------|----------|----------|
| `question_id`  | `ObjectId` (ref: QuizQuestion) | Reference to the associated quiz question          | ✅       | –        |
| `option_text`  | `String`                       | The answer option text                             | ✅       | –        |
| `is_correct`   | `Boolean`                      | Indicates whether this option is the correct answer| ✅       | `false`  |
| `created_at`   | `Date`                         | Timestamp for when the option was created          | ✅ (auto)| –        |
| `updated_at`   | `Date`                         | Timestamp for last update                          | ✅ (auto)| –        |

> ✅ **Use Case**: 
> - Supports MCQs with multiple or single correct answers depending on quiz logic.
> - Enables dynamic generation of options in quizzes for student interaction.
---
### 📡 MeetingCredential Table Structure

The `MeetingCredential` schema stores Zoom API credentials for each tenant, enabling integration with Zoom services such as live classes or meetings.

#### 🧾 Schema Fields

| Field           | Type                           | Description                                           | Required | Default |
|----------------|--------------------------------|-------------------------------------------------------|----------|---------|
| `tenantId`      | `ObjectId` (ref: Tenant)       | Reference to the tenant that owns these credentials   | ✅       | –       |
| `zoomApiKey`    | `String`                       | The API key used to authenticate Zoom API requests    | ✅       | –       |
| `zoomApiSecret` | `String`                       | The secret key paired with the API key                | ✅       | –       |

> ⚠️ **Security Note**:  
> Store `zoomApiSecret` securely. Consider encrypting it at rest and never expose it in logs or frontend code.

> ✅ **Use Case**:  
> Allows each tenant in a multi-tenant LMS to configure their own Zoom account for live sessions or webinars.
---
### 🎥 LiveSession Table Structure

The `LiveSession` schema manages and stores metadata about live Zoom sessions linked to courses or modules.

#### 🧾 Schema Fields

| Field                 | Type       | Description                                                         | Required | Default     |
|----------------------|------------|---------------------------------------------------------------------|----------|-------------|
| `live_session_Id`     | `ObjectId` | Unique identifier for the live session (auto-generated from `_id`) | ✅       | `_id`       |
| `zoom_meeting_id`     | `String`   | Zoom meeting ID (must be unique)                                    | ✅       | –           |
| `zoom_host_id`        | `String`   | Host's Zoom ID                                                      | ✅       | –           |
| `topic`               | `String`   | Topic/title of the live session                                     | ✅       | –           |
| `agenda`              | `String`   | Detailed agenda or description of the session                       | ✅       | –           |
| `scheduled_start_time`| `String`   | Scheduled start time (ISO 8601 or formatted string)                 | ✅       | –           |
| `scheduled_end_time`  | `String`   | Scheduled end time (ISO 8601 or formatted string)                   | ✅       | –           |
| `host_url`            | `String`   | Zoom URL for the host                                               | ✅       | –           |
| `join_url`            | `String`   | Public Zoom URL for attendees                                       | ✅       | –           |
| `passcode`            | `String`   | Meeting passcode for access control                                 | ✅       | –           |
| `status`              | `String`   | Current session status                                              | ✅       | `scheduled` |
| `created_at`          | `Date`     | Timestamp when the session was created                              | –        | Auto        |
| `updated_at`          | `Date`     | Timestamp of the last update                                        | –        | Auto        |

#### 📌 Status Enum

- `scheduled`: The session is scheduled to start.
- `ongoing`: The session is currently live.
- `completed`: The session has ended.
- `cancelled`: The session was cancelled before starting.

> 🔒 **Note**: Fields like `zoom_meeting_id` and `live_session_Id` are unique to prevent duplication across sessions.

> 📅 **Tip**: Consider using `Date` type for `scheduled_start_time` and `scheduled_end_time` for better time operations and validations.

---
---
# API STRUCTURE
---
## 🔐 Superadmin Login

### `POST /api/auth/superadmin/login/`

Authenticate a Super Admin using their email and password credentials.
### 📦 Example Request Body

```json
{
  "email": "EMAIL",
  "password": "PASSWORD"
}
```
---
## 👤 Get Superadmin Profile

### `GET /api/auth/superadmin/me`

Fetches the profile details of the currently authenticated Superadmin.

---
## 🚪 Superadmin Logout

### `POST /api/auth/superadmin/logout`

Logs out the currently authenticated Superadmin by clearing the authentication cookie.
> ⚠️ **Authentication Required:** Only accessible when a Superadmin is logged in.

---
## 🆕 Superadmin Register

### `POST /api/superadmin/register`

Creates a new Superadmin user in the system.

> ⚠️ **Authentication Required:** Only accessible when a Superadmin is logged in.

### 📥 Request Body

```json
{
  "name": "Demo User",
  "email": "superadmin@example.com",
  "password": "Demo@123",
  "phone_number": "9876543210",
  "role_id": "60f71df5bcbf4c3e88a9d567"
}
```
---
## 📊 Superadmin Dashboard

### `GET /api/superadmin/dashboard`

Fetches an overview of the entire platform’s data relevant to the Superadmin, such as user stats, course metrics, revenue info, and system insights.

> ⚠️ **Authentication Required:** Only accessible when a Superadmin is logged in.
---
## 🏢 Create Tenant

### `POST /api/tenants`

Creates a new Tenant along with the Superadmin's subdomain and associated user account.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

### 📥 Request Body

```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "vysakh799@gmail.com",
  "phone_number": "1234567890",
  "subdomain": "johndoe123",
  "role_id": "682dc1ed998041d8856a5653"
}
```
---
## 📄 Get All Tenants

### `GET /api/tenants`

Fetches a list of all tenants in the system.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

---
## 🔧 Update Tenant

### `PUT /api/tenants/update/:id`

Updates the details of a specific tenant.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

### 🧩 URL Parameters

| Parameter | Type   | Description                  |
|-----------|--------|------------------------------|
| `id`      | String | The ObjectId of the Tenant to update |

### 📤 Example Request

`PUT api/tenants/update/68396e5ea1146af19dbd6f58`

```json
{
  "_id": "68396e5ea1146af19dbd6f58",
  "name": "vysakh K S",
  "subdomain": "v-dev",
  "is_active": false,
  "zoomApiKey": "ZOOM API KEY",
  "zoomApiSecret": "ZOOM API SECRET"
}
```
---
## 🔍 Get Single Tenant

### `GET /api/tenants/:id`

Fetches the details of a single tenant by their ID.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

---

### 🧩 URL Parameters

| Parameter | Type   | Description                    |
|-----------|--------|--------------------------------|
| `id`      | String | The ObjectId of the tenant     |

---

### 📤 Example Request

`GET api/tenants/68396e5ea1146af19dbd6f58`

---

### ✅ Example Success Response

```json
{
  "_id": "68396e5ea1146af19dbd6f58",
  "name": "vysakh K S",
  "subdomain": "v-dev",
  "is_active": false,
  "zoomApiKey": "fabkjabfj38275hfj",
  "zoomApiSecret": "jflhhajfj65346372",
  "createdAt": "2025-06-08T12:00:00.000Z",
  "updatedAt": "2025-06-09T15:40:00.000Z"
}
```
---
## 🔐 Get All Permissions

### `GET /api/permissions/`

Fetches a list of all available permissions in the system.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

---
## ➕ Create Permission

### `POST /api/permissions/`

Creates a new permission in the system.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

### 📦 Example Request Body

```json
{
  "name": "test data"
}
```
---
## 📝 Update Permission

### `PUT /api/permissions/{id}`

Updates the details of an existing permission using its ID.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

### 📦 Example Request Body

```json
{
  "name": "demo",
  "is_active": true
}
```
---
## 🔐 Get All Roles

### `GET /api/roles`

Fetches a list of all available roles in the system.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.

---
## ➕ Create Role

### `POST /api/roles`

Creates a new role with a given name, description, and an optional list of permissions.

> ⚠️ **Authentication Required:** Only accessible by a logged-in Superadmin.
### 📝 Request Body

```json
{
  "name": "demo",
  "description": "demo role",
  "permissions": []
}
```
---
## 🛠️ Update Role

### `PATCH /api/roles/:id`

Update an existing role's details and permissions.

> 🔐 **Authorization Required:** Only accessible to logged-in Superadmin users.
### 📝 Example Request Body

```json
{
  "name": "Demo",
  "description": "Demo Role",
  "permissions": []
}
```
---
## 🔐 Tenant User Login

### `POST /api/users/login`

Authenticate a tenant user using email and password.

### 📝 Example Request Body

```json
{
  "email": "vysakher@gmail.com",
  "password": "asd123..."
}
```
---
## 🗂️ Get All Categories

### `GET /api/categories`

Fetches a list of all course categories available in the system.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
---
## ➕ Create Category

### `POST /api/categories`

Creates a new course category.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
### 📥 Request Body

```json
{
  "category": "Demo"
}
```
---
## 📝 Update Category

### `PATCH /api/categories/:id`

Updates the name of an existing course category.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
### 📥 Request Body

```json
{
  "category": "its Demo"
}
```
---
## 📚 Get All Subcategories

### `GET /api/subcategories`

Fetches a list of all subcategories available in the system.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
---
## ➕ Create Subcategory

### `POST /api/subcategories`

Creates a new subcategory under a given category.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
### 📝 Request Body

```json
{
  "category_id": "684abca55ff16f9f09af7650",
  "subcategory_name": "demo sub"
}
```
---
## ✏️ Update Subcategory

### `PATCH /api/subcategories/:id`

Updates an existing subcategory's name or parent category.
### 📝 Request Body

```json
{
  "category_id": "684abca55ff16f9f09af7650",
  "subcategory_name": "demo sub for testing"
}
```
---

## 📚 Get All Courses

### `GET /api/courses`

Retrieve a list of all available courses for the authenticated tenant.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
---
## 📚 Create a New Course

### `POST /api/courses`

Creates a new course under a tenant.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
### 📝 Request Body
```json
{
  "course_title": "Full Stack Developer Bootcamp",
  "short_description": "Learn to build complete web applications from scratch.",
  "description": "This course provides an in-depth understanding of full-stack development using popular technologies like HTML, CSS, JavaScript, React, Node.js, MongoDB, and Express. It includes project-based learning and real-world scenarios.",
  "category": "1234567890abcdef12345678",
  "subcategory": "abcdef1234567890abcdef12",
  "language": "0987654321fedcba09876543",
  "instructors": [
    "abc123abc123abc123abc123",
    "def456def456def456def456"
  ],
  "max_enrollment": 50,
  "is_active": true,
  "is_archived": false,
  "level": "level1234567890abcdef",
  "drip_content_enabled": false,
  "start_date": "2025-07-01T00:00:00.000Z",
  "end_date": "2025-09-30T00:00:00.000Z"
}
```

---
## 🛠️ Update an Existing Course

### `PUT /api/courses/:ID`

Updates an existing course by ID.
> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.

### 📝 Request Body

```json
{
  "course_title": "Advanced Web Development Bootcamp 2025",
  "short_description": "Master modern web development with hands-on projects and real-world applications",
  "description": "A comprehensive course covering advanced web development concepts including React, Node.js, and modern JavaScript practices. Learn through real-world projects, industry best practices, and hands-on coding exercises. This course will take you from intermediate to advanced level in web development..",
  "category": "68343a9bcab8da9e7ee3fb56",
  "subcategory": "68343542a494c47d0cedea63",
  "language": "68343d425a1875affc0cdbcf",
  "instructors": [
    "683d6b7e35cb6cbac204a6bf",
    "683d38868e3ab8f9a9302b0d"
  ],
  "max_enrollment": 100,
  "is_active": true,
  "is_archived": false,
  "level": "683a09a9ff6a9bd4c0dba463",
  "drip_content_enabled": true,
  "start_date": "2024-04-01T00:00:00.000Z",
  "end_date": "2024-07-01T00:00:00.000Z"
}
```
---
## ❌ Delete a Course

### `DELETE /api/courses/:ID`

Deletes an existing course by its ID.

> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.

---
## 🔢 Get Course Count

### `GET /api/courses/count`

Returns the total number of courses in the system.

> 🔐 **Authorization Required:** Only accessible to logged-in **Super Admins**.
---
## 📘 Get Single Course

### `GET /api/courses/get-single-course/:courseId`

Fetches the details of a specific course by its ID.

> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
--- 
## 📘 Create a New Module

### `POST /api/modules`

Creates a new module under a specific course.

> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.

### 📝 Request Body

```json
{
  "course_id": ["684d5f53fb3f1d01d504735f"],
  "module_title": "Demo Module",
  "module_description": "For testing demo module",
  "display_order": 2,
  "is_locked": false
}
```
---
## 📘 Get All Modules

### `GET /api/modules`

Retrieves a list of all modules associated with available courses.

> 🔐 **Authorization Required:** Only accessible to logged-in **Tenants**.
---