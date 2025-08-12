import React from "react";
import { MdDashboard, MdSchool, MdEvent, MdVideoCall, MdLogout, MdPeople } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { Link, useLocation, Outlet } from "react-router-dom";

const instructorMenuItems = [
  {
    label: "Dashboard",
    icon: <MdDashboard className="w-6 h-6" />,
    path: "/instructor",
  },
  {
    label: "My Courses",
    icon: <MdSchool className="w-6 h-6" />,
    path: "/instructor/instructor_courses",
  },
  {
    label: "Students",
    icon: <MdPeople className="w-6 h-6" />,
    path: "/instructor/instructor-view-students",
  },
  {
    label: "Live Sessions",
    icon: <MdVideoCall className="w-6 h-6" />,
    path: "/instructor/sessions",
  },
  {
    label: "Events",
    icon: <MdEvent className="w-6 h-6" />,
    path: "/instructor/events",
  },
  {
    label: "Logout",
    icon: <MdLogout className="w-6 h-6" />,
    path: "/",
  },
];

function InstructorSidebar() {
  const location = useLocation();
  return (
    <aside className="w-[250px] bg-white border-r border-gray-200 p-6 flex flex-col gap-4 min-h-screen">
      <div className="flex items-center gap-2 mb-8">
        <img
          src="https://img.icons8.com/fluency/48/graduation-cap.png"
          alt="logo"
          className="w-8"
        />
        <span className="font-bold text-2xl text-gray-800">Instructor</span>
      </div>
      <nav className="flex flex-col gap-2">
        {instructorMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              location.pathname === item.path
                ? "bg-[#2563eb] text-white" // blue-600
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

function InstructorNavbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white w-full">
      <h1 className="text-xl font-bold text-center">
        Welcome to <span className="text-yellow-500">Instructor Dashboard</span>
      </h1>
      <div className="flex items-center gap-4">
        <FaUser className="w-6 h-6" />
      </div>
    </div>
  );
}

export default function InstructorLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <InstructorSidebar />
      <div className="flex-1 flex flex-col">
        <InstructorNavbar />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
