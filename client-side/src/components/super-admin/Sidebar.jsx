import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
 MdDashboard,
 MdPeople,
 MdSecurity,
 MdSchool,
 MdBusiness,
 MdSettings,
 MdLogout,
} from "react-icons/md";
import { toast } from "react-toastify";

const SuperAdminSidebar = () => {
 const location = useLocation();
 const navigate = useNavigate();

 const menuItems = [
  {
   label: "Dashboard",
   icon: <MdDashboard className="w-6 h-6" />,
   path: "/superadmin/dashboard",
  },
  {
   label: "Tenants",
   icon: <MdBusiness className="w-6 h-6" />,
   path: "/superadmin/tenants",
  },
  {
   label: "Courses",
   icon: <MdSchool className="w-6 h-6" />,
   path: "/superadmin/courses",
  },
  {
   label: "Settings",
   icon: <MdSettings className="w-6 h-6" />,
   path: "/superadmin/settings",
  },
  {
   label: "Logout",
   icon: <MdLogout className="w-6 h-6" />,
   path: "#",
   isLogout: true,
  },
 ];

 const handleLogout = async () => {
  try {
   await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/superadmin/logout`,
    {},
    { withCredentials: true }
   );
   toast.success("Logged out successfully");
   //   navigate("/superadmin/auth");
   toast.success("Logged out successfully");
   window.location.reload();
  } catch (error) {
   toast.error(error.response?.data?.message || "Error logging out");
  }
 };

 return (
  <div className="flex flex-col h-screen bg-gray-800 text-white w-64">
   {/* Logo/Brand Section */}
   <div className="p-4 border-b border-gray-700">
    <h1 className="text-xl font-bold">Super Admin</h1>
   </div>

   {/* Navigation Menu */}
   <nav className="flex-1 overflow-y-auto py-4">
    <div className="px-3 space-y-1">
     {menuItems.map((item) =>
      item.isLogout ? (
       <button
        key={item.label}
        onClick={handleLogout}
        className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
       >
        <span className="mr-3">{item.icon}</span>
        {item.label}
       </button>
      ) : (
       <Link
        key={item.path}
        to={item.path}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${location.pathname === item.path
          ? "bg-gray-700 text-white"
          : "text-gray-300 hover:bg-gray-700 hover:text-white"
         }`}
       >
        <span className="mr-3">{item.icon}</span>
        {item.label}
       </Link>
      )
     )}
    </div>
   </nav>

   {/* User Profile Section */}
   <div className="p-4 border-t border-gray-700">
    <div className="flex items-center">
     <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
      <span className="text-sm font-medium">SA</span>
     </div>
     <div className="ml-3">
      <p className="text-sm font-medium">Super Admin</p>
      <p className="text-xs text-gray-400">admin@example.com</p>
     </div>
    </div>
   </div>
  </div>
 );
};

export default SuperAdminSidebar;
