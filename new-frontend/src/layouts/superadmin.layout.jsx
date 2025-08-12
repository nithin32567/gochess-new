import { Outlet } from "react-router-dom";
import SideBar from "../components/sidebar";
import Header from "../components/header";
import { useEffect } from "react";

export default function Layout() {
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
    <SideBar />
    <div className="sidebarfooter">
     <button className="settings-btn">
      <i className="fa-solid fa-gear" />
     </button>
     <button className="customersupport-btn">
      <i className="fa-solid fa-headphones-simple" /> Customer Support
     </button>
    </div>
   </div>
   <Header />
   <Outlet />
  </>
 );
}