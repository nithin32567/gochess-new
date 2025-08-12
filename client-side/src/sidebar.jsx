import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Sidebar = () => {
 const navigate = useNavigate();
 const menuItems = [
  {
   label: "Dashboard",
   icon: "fa-solid fa-table",
   path: "/superadmin/dashboard",
  },
  {
   label: "Users",
   icon: "fa-solid fa-user",
   path: "/superadmin/users",
  },
  {
   label: "Roles",
   icon: "fa-solid fa-users",
   path: "/superadmin/roles",
  },
  {
   label: "Courses",
   icon: "fa-solid fa-graduation-cap",
   path: "/superadmin/courses",
  },
  {
   label: "Tenants",
   icon: "fa-solid fa-building",
   path: "/superadmin/tenants",
  },
  {
   label: "Settings",
   icon: "fa-solid fa-gear",
   path: "/superadmin/settings",
  },
 ];

 return (
  <ul>
   {menuItems.map((item, index) => (
    <li key={index}>
     <button onClick={() => navigate(item.path)} className={`${location.pathname === item.path ? "active" : ""}`}>
      <i className={item.icon} /> {item.label}
     </button>
    </li>
   ))}
   <hr/>
   <hr/>
   <hr/>
   <hr/>
  </ul>
 );
};
