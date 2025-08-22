import React from "react";
import InstructorCard from "./InstructorCard";
import { useSelector } from "react-redux";

const ListInstructors = () => {
 const { instructors, loading, error } = useSelector((state) => state.tenant);
 
 if (loading) {
  return (
   <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
    <div className="spinner-border" role="status">
     <span className="visually-hidden">Loading...</span>
    </div>
   </div>
  );
 }

 if (error) {
  return (
   <div className="alert alert-danger" role="alert">
    Error loading instructors: {error}
   </div>
  );
 }

 if (!instructors || instructors.length === 0) {
  return (
   <div className="alert alert-info" role="alert">
    No instructors found.
   </div>
  );
 }
 
 return (
  <div className="w-100 d-flex justify-content-center">
   <div className="table-responsive table-styles mt-4" style={{ width: "100%", maxWidth: "100%" }}>
    <table className="table table-striped w-100">
     <thead>
      <tr>
       <th scope="col" style={{ width: "10%" }}>#</th>
       {/* <th scope="col" style={{ width: "15%" }}>Image</th> */}
       <th scope="col" style={{ width: "35%" }}>Name</th>
       <th scope="col" style={{ width: "25%" }}>Role</th>
       <th scope="col" style={{ width: "15%" }}>Actions</th>
      </tr>
     </thead>
     <tbody>
      {instructors?.map((instructor, index) => (
       <InstructorCard key={index} instructor={instructor} index={index} />
      ))}
     </tbody>
    </table>
   </div>
  </div>
 );
};

export default ListInstructors;
