import { useLocation, useNavigate } from "react-router-dom";

export default function SideBar() {
 const navigate = useNavigate();
 const location = useLocation();
 const menuItems = [
  // {
  //  label: "Get Started",
  //  icon: "fa-solid fa-rocket",
  //  path: "/superadmin/dashboard",
  // },
  {
   label: "Dashboard",
   icon: "fa-solid fa-table",
   path: "/superadmin/dashboard",
  },
  {
   label: "Tenants",
   icon: "fa-solid fa-building",
   path: "/superadmin/tenants",
  },
  {
   label: "Courses",
   icon: "fa-solid fa-graduation-cap",
   path: "/superadmin/courses",
  },
  {
   label: "Settings",
   icon: "fa-solid fa-gear",
   path: "/superadmin/settings",
  },
  // {
  //  label: "Group Courses",
  //  icon: "fa-solid fa-laptop",
  //  path: "",
  // },
  // {
  //  label: "1:1 Courses",
  //  icon: "fa-regular fa-calendar-check",
  //  path: "",
  // },
  // {
  //  label: "Instructors",
  //  icon: "fa-solid fa-graduation-cap",
  //  path: "",
  // },
  // {
  //  label: "Learners",
  //  icon: "fa-solid fa-user-group",
  //  path: "",
  // },
  // {
  //  label: "Store",
  //  icon: "fa-solid fa-shop",
  //  path: "",
  // },
  // {
  //  label: "Analytics",
  //  icon: "fa-solid fa-chart-line",
  //  path: "",
  // },
 ];
 return (
  <ul>
   {menuItems.map((e, i) => (
    <li key={i}>
     <button onClick={() => navigate(e.path)} className={`${location.pathname === e.path ? "active" : ""}`}>
      <i className={e.icon} /> {e.label}
     </button>
    </li>
   ))}
   <hr />
   <hr />
   <hr />
  </ul>
 );
}