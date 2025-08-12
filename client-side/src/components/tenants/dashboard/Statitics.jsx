import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import StatiSticsCard from "./StatiSticsCard";
import { FaUserTie } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBook } from "react-icons/fa";

const Statitics = () => {
 const { students } = useSelector((state) => state.tenant);
 const { courses } = useSelector((state) => state.course);
 const { instructors } = useSelector((state) => state.tenant);
 console.log("courses", courses);
 // display as cards with
 return (
  <section className="counts-wrapper">
   <div className="container-fluid">
    <div className="row">
     <StatiSticsCard
      icon={<FaUser className="h-6 w-6 text-slate-600" />}
      length={students.length}
      description="Students"
     />
     <StatiSticsCard
      icon={<FaBook className="h-6 w-6 text-slate-600" />}
      length={courses.length}
      description="Courses"
     />
     <StatiSticsCard
      icon={<FaUserTie className="h-6 w-6 text-slate-600" />}
      length={instructors.length}
      description="Instructors"
     />
    </div>
   </div>
  </section>
 );
};

export default Statitics;
