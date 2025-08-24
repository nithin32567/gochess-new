import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import TenantSidebar from "../../../components/tenants/Sidebar";

import TenentDashBoard from "../TenentDashBoard";
import TenantMeetings from "../TenantMeetings";
import { useDispatch, useSelector } from "react-redux";
import { fetchTenant } from "../../../redux/tenant.slice";

import { fetchStudents } from "../../../redux/tenant.slice";
import { fetchCourses } from "../../../redux/course.slice";
import { fetchInstructors } from "../../../redux/tenant.slice";
import { getCurrentUser } from "../../../redux/user.slice";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.user);
  const { courses } = useSelector((state) => state.course);
  console.log(courses, "courses");
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(fetchTenant());
    // dispatch(fetchStudents());
    dispatch(fetchCourses());
    // dispatch(fetchInstructors());
    dispatch(getCurrentUser());
  }, []);


  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case "/tenant":
        return <TenentDashBoard />;
      case "/tenant/meetings":
        return (
          <div className="flex-1 p-6">
            <TenantMeetings />
          </div>
        );
      // Add more cases for other routes
      default:
        return <TenentDashBoard />;
    }
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <TenantSidebar />

      {/* Main Content */}

      <div className="flex-1 p-6 h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
