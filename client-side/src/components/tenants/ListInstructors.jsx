import React from "react";
import InstructorCard from "./InstructorCard";
import { useSelector } from "react-redux";

const ListInstructors = () => {
  const { instructors } = useSelector((state) => state.tenant);
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {instructors.map((instructor) => (
        <InstructorCard key={instructor._id} instructor={instructor} />
      ))}
    </div>
  );
};

export default ListInstructors;
