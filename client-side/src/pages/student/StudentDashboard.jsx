import React from "react";
import Search from "../../components/Search";
import AllCourses from "../../components/students/AllCourses";
const StudentDashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Welcome to Gochess</h1>
      <div className="flex flex-col gap-4">
        {/* search component */}
        <Search />
        <AllCourses />
      </div>
    </div>
  );
};

export default StudentDashboard;
