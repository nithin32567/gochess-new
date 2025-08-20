import React from "react";
import InstructorCard from "./InstructorCard";
import { useSelector } from "react-redux";

const ListInstructors = ({ instructors }) => {
 // const { instructors } = useSelector((state) => state.tenant);
 return (
  <div className="table-responsive table-styles mt-4">
   <table className="table table-striped">
    <thead>
     <tr>
      <th scope="col">#</th>
      <th scope="col">Image</th>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
      <th scope="col">Actions</th>
     </tr>
    </thead>
    <tbody>
     {instructors?.map((instructor, index) => (
      <InstructorCard key={instructor._id} instructor={instructor} index={index} />
     ))}
    </tbody>
   </table>
  </div>
 );
};

export default ListInstructors;
