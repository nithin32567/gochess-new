import React from "react";
import {
 BrowserRouter as Router,
 Routes,
 Route,
 Navigate,
} from "react-router-dom";
import Signin from "./pages/auth/Signin";
import Layout from "./pages/superadmin/Layout";
import Dashboard from "./pages/superadmin/Dashboard";
// import TenantManagement from "./pages/superadmin/TenantManagement";
import UserManagement from "./pages/superadmin/UserManagement";
import UserList from "./pages/superadmin/UserList";
import ProtectedRoute from "./components/ProtectedRoute";
import RolesList from "./pages/superadmin/RolesList";
import RoleForm from "./pages/superadmin/RoleForm";
import AdminCourseManagement from "./pages/superadmin/AdminCourseManagement";
import DashboardLayout from "./pages/Tenent/layouts/DashbordLayout";
import GeneratePassword from "./pages/common/GeneratePassword";
import TenantMeetings from "./pages/Tenent/TenantMeetings";
import TenentDashBoard from "./pages/Tenent/TenentDashBoard";
import TenantInstructor from "./pages/Tenent/instructor/TenantInstructor";
import TenantCourses from "./pages/Tenent/courses/TenantCourses";
import ListStudents from "./pages/Tenent/students/ListStudents";
// import Lessons from "./pages/Tenent/courses/ModuleAndLessonAddModal";
// import AllCourses from "./components/students/AllCourses";
import StudentLayout from "./pages/student/layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import TenantSettings from "./pages/Tenent/TenantSettings";

import UserLogin from "./pages/common/auth/UserLogin";
import CourseDetails from "./pages/student/CourseDetails";
import ViewCourseDetails from "./pages/Tenent/ViewCourseDetails";
import TenantsManagement from "./pages/superadmin/TenantsManagement";
import Settings from "./pages/superadmin/Settings";
import InstructorLayout from "./pages/Instructor/InstructorLayout";
import InstructorDashboard from "./pages/Instructor/Dashboard";
import ViewCourseInstructor from "./pages/Instructor/ViewCourse";
import InstructorStudents from "./pages/Instructor/InstructorStudents";
import { ToastContainer } from "react-toastify";

function App() {
 return (
  <Router>
   <ToastContainer />
   <Routes>
    {/* Public Route */}
    <Route path="/" element={<h1>Hello World</h1>} />

    {/* Superadmin Auth */}
    <Route path="/superadmin/auth" element={<Signin />} />

    {/* Protected Superadmin Routes */}
    <Route
     path="/superadmin"
     element={
      <ProtectedRoute>
       <Layout />
      </ProtectedRoute>
     }
    >
     <Route
      index
      element={<Navigate to="/superadmin/dashboard" replace />}
     />
     <Route path="dashboard" element={<Dashboard />} />
     <Route path="tenants" element={<TenantsManagement />} />
     <Route path="users" element={<UserList />} />
     <Route path="users/create" element={<UserManagement />} />
     <Route path="roles" element={<RolesList />} />
     <Route path="roles/create" element={<RoleForm />} />
     <Route path="roles/:roleId" element={<RoleForm />} />
     <Route path="courses" element={<AdminCourseManagement />} />
     <Route path="settings" element={<Settings />} />
    </Route>

    {/* Tenant Routes */}
    <Route path="/tenant" element={<DashboardLayout />}>
     <Route index element={<TenentDashBoard />} />
     <Route path="meetings" element={<TenantMeetings />} />
     <Route path="instructors" element={<TenantInstructor />} />
     <Route path="courses" element={<TenantCourses />} />
     <Route path="students" element={<ListStudents />} />
     {/* <Route path="create-module" element={<Lessons />} /> */}
     <Route path="settings" element={<TenantSettings />} />
     <Route
      path="view-course-details/:id"
      element={<ViewCourseDetails />}
     />
    </Route>

    {/* Tenant Auth (outside of dashboard layout) */}

    {/* Common Route */}
    <Route
     path="/common/generate-password"
     element={<GeneratePassword />}
    />
    <Route path="/users/login" element={<UserLogin />} />

    {/* Student Routes */}
    <Route path="/student" element={<StudentLayout />}>
     <Route index element={<StudentDashboard />} />
     <Route path="course/:id" element={<CourseDetails />} />

     {/* <Route path="courses" element={<StudentCourses />} />
     <Route path="lessons" element={<StudentLessons />} />
     <Route path="quizzes" element={<StudentQuizzes />} /> */}

    </Route>

    {/* Instructor Routes */}
    <Route path="/instructor" element={<InstructorLayout />}>
     <Route index element={<InstructorDashboard />} />
     <Route path="instructor_courses" element={<ViewCourseInstructor />} />
     <Route path="instructor-view-students" element={<InstructorStudents />} />
    </Route>
   </Routes>
  </Router>
 );
}

export default App;
