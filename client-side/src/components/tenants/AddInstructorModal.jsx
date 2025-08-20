import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createInstructor } from "@/redux/tenant.slice";
import { toast } from "react-toastify";

const AddInstructorModal = ({
 setOpenAddInstructorModal,
 instructorRoleId,
}) => {
 const dispatch = useDispatch();
 const [formData, setFormData] = useState({
  fname: "",
  lname: "",
  age: "",
  dob: "",
  phone_number: "",
  email: "",
  role_id: instructorRoleId,
 });
 console.log(instructorRoleId, "instructorRoleId");
 // const api_url = import.meta.env.VITE_API_URL;
 const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
   ...prev,
   [name]: value,
  }));
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  formData.role_id = instructorRoleId;

  const result = await dispatch(createInstructor(formData));
  console.log(result, "result inside the handleSubmit");
  if (createInstructor.full) {
   setOpenAddInstructorModal(false);
   toast.success("Instructor added successfully");
  } else {
   toast.error("Failed to add instructor");
  }

 };

 return (
  <>
   <h1 className="modal-title">Add New Instructor</h1>
   <button
    type="button"
    className="btn-close"
    data-bs-dismiss="modal"
    aria-label="Close"
    onClick={() => setOpenAddInstructorModal(false)}
   >
    <i className="fa-solid fa-xmark" />
   </button>

   <form onSubmit={handleSubmit} className="space-y-4">
    <div className="trainer-input-item">
     <input type="text"
      id="fname"
      name="fname"
      value={formData.fname}
      onChange={handleChange}
      placeholder="Enter first name"
      required />
    </div>
    <div className="trainer-input-item">
     <input
      type="text"
      id="lname"
      name="lname"
      value={formData.lname}
      onChange={handleChange}
      placeholder="Enter last name"
      required
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="number"
      id="age"
      name="age"
      value={formData.age}
      onChange={handleChange}
      placeholder="Enter age"
      required
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="date"
      id="dob"
      name="dob"
      value={formData.dob}
      onChange={handleChange}
      required
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="tel"
      id="phone_number"
      name="phone_number"
      value={formData.phone_number}
      onChange={handleChange}
      placeholder="Enter phone number"
      required
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Enter email address"
      required
     />
    </div>
    <p className="text-sm font-medium text-gray-700">
     Role: Instructor
    </p>
    <div className="row justify-content-center">
     <div className="col-lg-4">
      <button
       onClick={() => setOpenAddInstructorModal(false)}
       type="button"
       className="addtrainer-btn">
       Cancel
      </button>
     </div>
     <div className="col-lg-4">
      <button
       type="submit"
       className="addtrainer-btn">
       Add Instructor
      </button>
     </div>
    </div>
   </form>




   <div className="fixed inset-0 bg-[#000000d3] flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
     {/* Modal Header */}

     {/* Modal Body */}
     <form onSubmit={handleSubmit} className="space-y-4">

      {/* Modal Footer */}
     </form>
    </div>
   </div>
  </>
 );
};

export default AddInstructorModal;
