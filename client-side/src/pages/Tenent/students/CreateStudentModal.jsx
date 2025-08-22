import React, { useEffect, useState } from 'react';
import axios from "axios"
import { toast } from "react-toastify";
const CreateStudentModal = ({ AddStudentsModalOpen, setIsAddStudentsModalOpen }) => {
  const [role_id, setRole_id] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    age: "",
    dob: "",
    phone_number: "",
    email: "",
  });
  useEffect(() => {
    getRoles();
  }, [])
  async function getRoles() {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/roles`, { withCredentials: true });


    setRole_id(res.data.data.find(role => role.name === "student")._id);
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const emptyField = Object.values(formData).some((value) => value === "");
      if (emptyField) {
        toast.error("Please fill in all fields.");
        return;
      }

      console.log("Form Submitted:", formData);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, { ...formData, role_id }, { withCredentials: true });
      console.log(res);

      toast.success("Student added successfully!");
      setIsAddStudentsModalOpen(false);
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response?.data?.message || "Failed to add student");
      setIsAddStudentsModalOpen(false);
    }
  };

  if (!AddStudentsModalOpen) return null;
  console.log("---------roles---------");
  console.log(role_id);

  return (
    <>
      <h1 className="modal-title">Student Information</h1>
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="modal"
        aria-label="Close"
        onClick={() => setIsAddStudentsModalOpen(false)}
      >
        <i className="fa-solid fa-xmark" />
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="trainer-input-item">
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            value={formData.fname}
            onChange={handleChange}
            required />
        </div>
        <div className="trainer-input-item">
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            value={formData.lname}
            onChange={handleChange}
            required />
        </div>
        <div className="trainer-input-item">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required />
        </div>
        <div className="trainer-input-item">
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            required />
        </div>
        <div className="trainer-input-item">
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required />
        </div>
        <div className="trainer-input-item">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required />
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-4">
            <button
              onClick={() => setIsAddStudentsModalOpen(false)}
              type="button"
              className="addtrainer-btn">
              Cancel
            </button>
          </div>
          <div className="col-lg-4">
            <button type="submit" className="addtrainer-btn">
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateStudentModal;
