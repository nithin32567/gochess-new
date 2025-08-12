

import React, { useEffect, useState } from 'react';
import CreateStudentModal from './CreateStudentModal';
import EditStudent from './EditStudent';
import axios from 'axios';

const ListStudents = () => {
  const [AddStudentsModalOpen, setIsAddStudentsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 9;
  useEffect(() => {
    getAllUsers();
  }, [isEditModalOpen,AddStudentsModalOpen]);

  async function getAllUsers() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
        withCredentials: true,
      });
      const filtered = res.data.data.filter(
        (user) => user.role_id.name === 'student'
      );
      setStudents(filtered);
    } catch (error) {
      console.log(error);
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const filteredStudents = students.filter((student) =>
    student.user_id.fname.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const endIndex = startIndex + studentsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleEdit = (student) => {
    
    setIsEditModalOpen(true);
    setSelectedStudent(student);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        withCredentials: true,
      });
      setStudents((prev) =>
        prev.filter((student) => student.user_id._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };
const handleResetPassword=async(_id,email)=>{
  console.log(_id,email);
    const res=await axios.post(`${import.meta.env.VITE_API_URL}/users/requestpasswordreset`, {_id,email},{
        withCredentials: true,
      });
  console.log(res);
  
}
  return (
    <div className="w-full px-12 py-12 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students</h1>
        <button
          type="button"
          onClick={() => setIsAddStudentsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Add Student
        </button>
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search Students..."
          className="px-4 py-2 border border-gray-400 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)} 
        />
      </div>

      <table className="w-full mx-auto my-10 border-collapse">
        <thead>
          <tr>
            <th className="text-center border-b border-gray-300">Name</th>
            <th className="text-center border-b border-gray-300">Email</th>
            <th className="text-center border-b border-gray-300">Role</th>
            <th className="text-center border-b border-gray-300">Created At</th>
            <th className="text-center border-b border-gray-300">Updated At</th>
            <th className="text-center border-b border-gray-300">Reset Password</th>
            <th className="text-center border-b border-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentStudents.map((student) => (
            <tr className="border-b border-gray-300" key={student?._id}>
              <td className="text-center py-2">{student?.user_id?.fname}</td>
              <td className="text-center py-2">{student?.email}</td>
              <td className="text-center py-2">{student?.role_id?.name}</td>
              <td className="text-center py-2">
                {formatDate(student?.createdAt)}
              </td>
              <td className="text-center py-2">
                {formatDate(student?.updatedAt)}
              </td>
              <td><span style={{cursor:"pointer"}} onClick={() => handleResetPassword(student.user_id._id,student.user_id.email)}>Send Mail</span></td>
              <td className="text-center py-2">
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => handleEdit(student)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(student.user_id._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'
            }`}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-3 py-2 rounded-md transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {pageNumber}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'
            }`}
          >
            Next
          </button>
        </div>
      )}

      <div className="text-center text-gray-600">
        Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of{' '}
        {filteredStudents.length} students
      </div>

      {/* Create Student Modal */}
      <CreateStudentModal
        AddStudentsModalOpen={AddStudentsModalOpen}
        setIsAddStudentsModalOpen={setIsAddStudentsModalOpen}
      />

      {/* Edit Student Modal */}
      <EditStudent
     
       isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        student={selectedStudent}
      />
      {/* <EditStudentModal
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        student={selectedStudent}
      /> */}
    </div>
  );
};

export default ListStudents;
