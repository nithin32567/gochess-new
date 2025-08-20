

import React, { useEffect, useState } from 'react';
import CreateStudentModal from './CreateStudentModal';
import EditStudent from './EditStudent';
import axios from 'axios';
import Popup from "../../../components/popup";

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
 }, [isEditModalOpen, AddStudentsModalOpen]);

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
 const handleResetPassword = async (_id, email) => {
  console.log(_id, email);
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/requestpasswordreset`, { _id, email }, {
   withCredentials: true,
  });
  console.log(res);

 }
 return (
  <main className="container-wrapper-scroll">
   <section className="addcourse">
    <div className="container-fluid">
     <div className="row justify-content-center">
      <div className="col-xl-2 col-lg-3 col-md-4">
       <button
        className="addnewcourse-btn"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        onClick={() => setIsAddStudentsModalOpen(true)}
       >
        <i className="fa-solid fa-plus" /> Add Student
       </button>
      </div>
     </div>
    </div>
   </section>

   <section className="search-section py-2">
    <div className="container-fluid">
     <div className="row">
      <div className="col-xl-12 col-lg-12 col-sm-12 px-4">
       <div className="search-course">
        <input
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         type="text"
         placeholder="Search Course" />
        {/* <button onClick={handleSearch}>
         <i className="fa-solid fa-magnifying-glass" />
        </button> */}
       </div>
      </div>
     </div>
    </div>
   </section>

   <section className="course-single-page container-height">
    <div className="container-fluid">
     <div className="table-responsive table-styles mt-4">
      <table className="table table-striped">
       <thead>
        <tr>
         <th scope="col">#</th>
         <th scope="col">First Name</th>
         <th scope="col">Last Name</th>
         <th scope="col">Email</th>
         <th scope="col">Created At</th>
         <th scope="col">Updated At</th>
         <th scope="col">Reset Password</th>
         <th scope="col">Actions</th>
        </tr>
       </thead>
       <tbody>
        {currentStudents.map((student, index) => (
         <tr key={index}>
          <th scope="row">{index + 1}</th>
          <td>{student?.user_id?.fname}</td>
          <td>{student?.user_id?.fname}</td>
          <td>{student?.email}</td>
          <td>{formatDate(student?.createdAt)}</td>
          <td>{formatDate(student?.updatedAt)}</td>
          <td>
           <span
            style={{ cursor: "pointer" }}
            onClick={() => handleResetPassword(student.user_id._id, student.user_id.email)}
           >
            Send Mail
           </span>
          </td>
          <td>
           <button onClick={() => handleEdit(student)} className="edit">
            <i className="fa-solid fa-pen-to-square"></i>
           </button>
           <button onClick={() => handleDelete(student.user_id._id)} className="delete">
            <i className="fa-solid fa-trash-can"></i>
           </button>
          </td>
         </tr>
        ))}
       </tbody>
      </table>
     </div>
    </div>

    <div className="text-center text-gray-600">
     Showing {startIndex + 1} to {Math.min(endIndex, filteredStudents.length)} of{' '}
     {filteredStudents.length} students
    </div>
   </section>

   {/* Pagination */}
   {/* {totalPages > 1 && (
    <div className="flex justify-center items-center gap-2">
     <button
      type="button"
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-2 rounded-md ${currentPage === 1
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
        className={`px-3 py-2 rounded-md transition-colors ${currentPage === pageNumber
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
      className={`px-3 py-2 rounded-md ${currentPage === totalPages
       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
       : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'
       }`}
     >
      Next
     </button>
    </div>
   )} */}

   {/* Create Student Modal */}
   {AddStudentsModalOpen &&
    <Popup>
     <CreateStudentModal
      AddStudentsModalOpen={AddStudentsModalOpen}
      setIsAddStudentsModalOpen={setIsAddStudentsModalOpen}
     />
    </Popup>}

   <div className="w-full px-12 py-12 flex flex-col gap-6">




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
  </main>
 );
};

export default ListStudents;
