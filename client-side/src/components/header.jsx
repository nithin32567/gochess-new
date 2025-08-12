import React from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Header() {
 const handleLogout = async () => {
  try {
   await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/superadmin/logout`,
    {},
    { withCredentials: true }
   );
   localStorage.removeItem("token");
   // toast.success("Logged out successfully");
   //   navigate("/superadmin/auth");
   toast.success("Logged out successfully");
   window.location.reload();
  } catch (error) {
   toast.error(error.response?.data?.message || "Error logging out");
  }
 };
 return (
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
      <button onClick={handleLogout} className="profile-icon">{"D"}</button>
      <button className="bell-icon active">
       <i className="fa-regular fa-bell" />
      </button>
     </div>
    </div>
   </div>
  </section>
 );
}