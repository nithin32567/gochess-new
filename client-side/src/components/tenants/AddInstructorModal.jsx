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
    <div className="fixed inset-0 bg-[#000000d3] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Instructor
          </h2>
          <button
            onClick={() => setOpenAddInstructorModal(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="fname"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lname"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter age"
                required
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm font-medium text-gray-700">
              Role: Instructor
            </p>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setOpenAddInstructorModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Instructor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInstructorModal;
