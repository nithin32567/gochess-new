import React from "react";
import axios from "axios";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const UserCreationModal = ({ open, handleOpen, handleClose, roles }) => {
 const [formData, setFormData] = useState({
  fname: "",
  lname: "",
  email: "",
  password: "",
  role: "",
 });

 const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData);
  try {
   const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/users`,
    formData,
    {
     headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
     }
    }
   );
   console.log(response);
   if (response.data.success) {
    toast.success("User created successfully");
    handleClose();
   }
  } catch (error) {
   console.log(">>>>>>>>>>", error);
  }
 };
 

 return (
  <>
   <h1 className="modal-title">Add New User</h1>
   <button
    type="button"
    className="btn-close"
    data-bs-dismiss="modal"
    aria-label="Close"
    onClick={handleClose}
   >
    <i className="fa-solid fa-xmark" />
   </button>
   <form onSubmit={handleSubmit}>
    <div className="trainer-input-item">
     <input
      type="text"
      name="fname"
      placeholder="First Name"
      value={formData.fname}
      onChange={handleChange}
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="text"
      name="lname"
      placeholder="Last Name"
      value={formData.lname}
      onChange={handleChange}
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="email"
      name="email"
      placeholder="Email"
      value={formData.email}
      onChange={handleChange}
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleChange}
     />
    </div>
    <div className="trainer-input-item">

    </div>
    <div className="trainer-input-item">
     <select
      className="border-2 border-gray-300 rounded-md p-2"
      name="role_id"
      id=""
      value={formData.role_id}
      onChange={handleChange}
     >
      <option className="text-gray-500" value="">
       Select Role
      </option>
      {roles.map((role, i) => (
       <option key={i} className="text-gray-500" value={role.id}>
        {role.name}
       </option>
      ))}
     </select>
    </div>
    <div className="row justify-content-center">
     <div className="col-lg-4">
      <button type="submit" className="addtrainer-btn">
       Create User
      </button>
     </div>
    </div>
   </form>
  </>
 );
};

export default UserCreationModal;
