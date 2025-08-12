import React, { useState, useEffect } from "react";
import axios from "axios";

export default function InstructorStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    dob: "",
    phone_number: "",
    age: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formMessage, setFormMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/instructor/students`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setStudents(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch students");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await axios.delete(`${API_URL}/instructor/students/${studentId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setStudents(students.filter(student => student._id !== studentId));
        } else {
          alert(response.data.message || "Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        alert(error.response?.data?.message || "Failed to delete student");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/instructor/students`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setFormMessage("Student added successfully!");
        setFormData({
          fname: "",
          lname: "",
          email: "",
          dob: "",
          phone_number: "",
          age: "",
        });
        // Refresh the students list
        fetchStudents();
        // Close modal after successful addition
        setTimeout(() => {
          setShowAddModal(false);
          setFormMessage("");
        }, 1000);
      } else {
        setFormMessage(response.data.message || "Failed to add student");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      setFormMessage(
        error.response?.data?.message || "An error occurred while adding student"
      );
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Improved search: supports full name and email
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredStudents = students.filter(student => {
    const fullName = `${student.fname || ""} ${student.lname || ""}`.toLowerCase();
    return (
      student.fname?.toLowerCase().includes(normalizedSearch) ||
      student.lname?.toLowerCase().includes(normalizedSearch) ||
      fullName.includes(normalizedSearch) ||
      student.email?.toLowerCase().includes(normalizedSearch)
    );
  });

  const clearForm = () => {
    setFormData({
      fname: "",
      lname: "",
      email: "",
      dob: "",
      phone_number: "",
      age: "",
    });
    setFormMessage("");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Add Student
        </button>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Add New Student</h2>
            {formMessage && (
              <div className={`p-4 mb-4 rounded-lg ${
                formMessage.includes("successfully") 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {formMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Adding..." : "Add Student"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8">Loading students...</div>
      ) : error ? (
        <div className="p-8 text-red-600">Error: {error}</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          {searchTerm ? "No students found matching your search." : "No students found."}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.fname} {student.lname}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.phone_number}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(student.dob)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.age}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.tenant_id}</div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}