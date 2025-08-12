import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import StudentDashboard from "../StudentDashboard";
import Navbar from "../../../components/students/Navbar";

const StudentLayout = () => {
  const location = useLocation();

  //   no need of sidebar in student layout
  return (
    <div className="flex flex-col h-full bg-gray-100 w-full">
      <Navbar />

      <div className="flex-1 p-6 w-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;
