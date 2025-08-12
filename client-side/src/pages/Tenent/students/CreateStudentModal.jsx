import React, { useEffect, useState } from 'react';
import axios from "axios"
const CreateStudentModal = ({ AddStudentsModalOpen, setIsAddStudentsModalOpen }) => {
    const [role_id,setRole_id]=useState(null);
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
},[])
async function getRoles() {
    const res=await axios.get(`${import.meta.env.VITE_API_URL}/roles`,{withCredentials:true});
    
    
    setRole_id(res.data.data.find(role => role.name === "student")._id);
}
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
try {
    
    const emptyField = Object.values(formData).some((value) => value === "");
    if (emptyField) {
      alert("Please fill in all fields.");
      return;
    }

    console.log("Form Submitted:", formData);
    const res=await axios.post(`${import.meta.env.VITE_API_URL}/users`,{...formData,role_id},{withCredentials:true});
    console.log(res);
    
    setIsAddStudentsModalOpen(false);
} catch (error) {
    console.log(error.response.data.message);
    
}
  };

  if (!AddStudentsModalOpen) return null;
console.log("---------roles---------");
console.log(role_id);

  return (
    <div className="fixed inset-0 bg-[#000000d3] flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">User Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              value={formData.fname}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full outline-none"
              required
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              value={formData.lname}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full outline-none"
              required
            />
          </div>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full outline-none"
            required
          />
          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={formData.dob}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full outline-none"
            required
          />
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded p-2 w-full outline-none"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddStudentsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudentModal;
