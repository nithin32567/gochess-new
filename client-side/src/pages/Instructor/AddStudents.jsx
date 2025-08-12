import React, { useState } from "react";
import axios from "axios";

export default function AddStudents() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    tenant: "",
    dob: "",
    phone_number: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/users/create`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessage("Student added successfully!");
        setFormData({
          fname: "",
          lname: "",
          email: "",
          tenant: "",
          dob: "",
          phone_number: "",
        });
      } else {
        setMessage(response.data.message || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setMessage(
        error.response?.data?.message || "An error occurred while adding student"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Student</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded-lg ${
          message.includes("successfully") 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fname" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="fname"
              name="fname"
              value={formData.fname}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="lname" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lname"
              name="lname"
              value={formData.lname}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="tenant" className="block text-sm font-medium text-gray-700 mb-2">
              Tenant *
            </label>
            <input
              type="text"
              id="tenant"
              name="tenant"
              value={formData.tenant}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              fname: "",
              lname: "",
              email: "",
              tenant: "",
              dob: "",
              phone_number: "",
            })}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
} 