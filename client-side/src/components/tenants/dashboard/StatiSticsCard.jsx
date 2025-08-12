import React from "react";
import { FaChartLine } from "react-icons/fa";

const StatiSticsCard = ({ data, length, description, icon }) => {
 return (
  <>
   <div className="col-xl-2 col-lg-4 col-md-4 col-sm-4 col-6">
    <button className="counts-item">
     <span>
      {/* <img src="/img/courses.png" alt="Courses" /> */}
      {icon}
     </span>
     <div>
      <h3>{length}</h3>
      <h6>{description}</h6>
      <i className="fa-solid fa-chevron-right" />
     </div>
    </button>
   </div>
  </>
 );
};

export default StatiSticsCard;
