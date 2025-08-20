import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const TenantSidebar = () => {
 const location = useLocation();
 const navigate = useNavigate();

 const handleLogout = async () => {
  try {
   await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/logout`,
    { withCredentials: true }
   ); 
   toast.success("Logged out successfully");
   navigate("/");
  } catch (error) {
   toast.error(error.response?.data?.message || "Error logging out");
  }
 };

 useEffect(() => {
  document.body.classList.remove("login-page");
  const buttons = document.querySelectorAll("#menubutton, .menuback-button");
  const handleHamberger = () => {
   if (document.body.classList.contains("hidemenu")) {
    document.body.classList.remove("hidemenu");
   } else {
    document.body.classList.add("hidemenu");
   }
  }

  buttons.forEach(e => e.addEventListener("click", handleHamberger));
  return () => buttons.forEach(e => e.removeEventListener("click", handleHamberger));
 }, []);

 const menuitems = [
  {
   label: "Dashboard",
   icon: "fa-solid fa-table",
   path: "/tenant",
  },
  {
   label: "Courses",
   icon: "fa-solid fa-laptop",
   path: "/tenant/courses",
  },

  {
   label: "Instructors",
   icon: "fa-solid fa-graduation-cap",
   path: "/tenant/instructors",
  },
  {
   label: "Students",
   icon: "fa-solid fa-user-group",
   path: "/tenant/students",
  },
  {
   label: "Live Sessions",
   icon: "fa-regular fa-calendar-check",
   path: "/tenant/meetings",
  },
  // {
  //  label: "Logout",
  //  icon: <MdLogout className="w-6 h-6" />,
  //  path: "/",
  //  onClick: handleLogout,
  // },
 ];

 return (
  <>
   <div className="sidebarmenu-wrapper">
    <button className="menuback-button">
     <i className="fa-solid fa-arrow-left" />
    </button>
    <div className="sidemenu-header">
     <a href="#" className="sidebarlogo">
      <img src="/img/gochess-logo.png" alt="Go Chess" />
     </a>
     <div>
      <input type="text" placeholder="Search" />
      <button>
       <i className="fa-solid fa-magnifying-glass" />
      </button>
     </div>
    </div>
    <ul>

     {menuitems.map((item, index) => (
      <li key={index}>
       <button
        onClick={() => navigate(item.path)}
        className={location.pathname === item.path ? "active" : ""}
       >
        <i className={item.icon} /> {item.label}
       </button>
      </li>
     ))}

    </ul>
    <div className="sidebarfooter">
     <button className="settings-btn">
      <i className="fa-solid fa-gear" />
     </button>
     <button className="customersupport-btn">
      <i className="fa-solid fa-headphones-simple" /> Customer Support
     </button>
    </div>
   </div>

   <section className="headertop-wrapper">
    <div className="container-fluid">
     <div className="row">
      <div className="col-lg-6 col-md-8 col-sm-8 col-7">
       <button className="burgermenu" id="menubutton">
        <i className="fa-solid fa-bars" />
       </button>
       <h4>Dashboard</h4>
      </div>
      <div className="col-lg-6 col-md-4 col-sm-4 col-5">
       <div className="dropdown">
        <button
         className="profile-icon"
         href="#"
         role="button"
         id="dropdownMenuLink"
         data-bs-toggle="dropdown"
         aria-expanded="false"
         onClick={handleLogout}
        >
         A
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
         <li>
          <a className="dropdown-item" href="#">
           Action
          </a>
         </li>
         <li>
          <a className="dropdown-item" href="#">
           Another action
          </a>
         </li>
         <li>
          <a className="dropdown-item" href="#">
           Something else here
          </a>
         </li>
        </ul>
       </div>
       <button className="bell-icon active">
        <i className="fa-regular fa-bell" />
       </button>
      </div>
     </div>
    </div>
   </section>
  </>
 );
};

export default TenantSidebar;
