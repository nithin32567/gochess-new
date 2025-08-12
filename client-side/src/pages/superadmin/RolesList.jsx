import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PERMISSIONS } from "../../config/permissions";

const RolesList = () => {
 const navigate = useNavigate();
 const [roles, setRoles] = useState([]);
 const [loading, setLoading] = useState(true);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [roleToDelete, setRoleToDelete] = useState(null);

 console.log(roleToDelete);

 useEffect(() => {
  fetchRoles();
 }, []);

 const fetchRoles = async () => {
  try {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/roles`,
    { withCredentials: true }
   );
   console.log(response.data);
   if (response.data.success) {
    setRoles(response.data.data);
   }
  } catch (error) {
   console.log(error);
   toast.error("Error fetching roles");
  } finally {
   setLoading(false);
  }
 };

 const openDeleteModal = (role) => {
  setRoleToDelete(role);
  setDeleteModalOpen(true);
 };

 const closeDeleteModal = () => {
  setRoleToDelete(null);
  setDeleteModalOpen(false);
 };

 const handleDelete = async () => {
  if (!roleToDelete) return;

  try {
   console.log('Attempting to delete role:', roleToDelete);
   const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/roles/${roleToDelete._id}`,
    {
     withCredentials: true,
     headers: {
      'Content-Type': 'application/json'
     }
    }
   );
   if (response.data.success) {
    toast.success("Role deleted successfully");
    fetchRoles();
    closeDeleteModal();
   }
  } catch (error) {
   console.error('Delete role error:', error);
   const errorMessage = error.response?.data?.message || error.message || "Error deleting role";
   toast.error(errorMessage);
   console.log('Error response:', error.response);
  }
 };

 const getPermissionLabel = (permissionKey) => {
  // Find the permission label from the permission key
  for (const group of Object.values(PERMISSIONS)) {
   for (const [key, value] of Object.entries(group)) {
    if (key.toLowerCase() === permissionKey.name.split("_")[0]) {
     return value.toLowerCase().replace(":", " ");
    }
   }
  }
  return permissionKey.name;
 };

 if (loading) {
  return (
   <div className="container mx-auto px-4 py-8">
    <div className="text-center">Loading...</div>
   </div>
  );
 }

 return (
  <>
   <main className="container-wrapper-scroll">
    <section className="course-single-page container-height">
     <div className="container-fluid">
      <div className="row justify-content-center">
       <div className="col-lg-2 col-md-3 col-6">
        <button
         onClick={() => navigate("/superadmin/roles/create")}
         className="addtenant-btn">
         <i className="fa-solid fa-plus"></i>
         Create
         Role
        </button>
       </div>
      </div>

      {roles.length > 0 ? (<div className="table-responsive table-styles mt-4">
       <table className="table table-striped">
        <thead>
         <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Permission</th>
          <th scope="col">Actions</th>
         </tr>
        </thead>
        <tbody>
         {roles.map((role) => (
          <tr>
           <th scope="row">1</th>
           <td>{role.name}</td>
           <td>{role.description}</td>
           <td>
            <div className="flex flex-wrap gap-2">
             {(role.permissions || []).map((permission, i) => (
              <span
               key={i}
               className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
               {getPermissionLabel(permission)}
              </span>
             ))}
            </div>
           </td>
           <td>
            <button
             onClick={() =>
              navigate(`/superadmin/roles/${role._id}`)
             }
             className="edit">
             <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <button
             onClick={() => openDeleteModal(role)}
             className="delete">
             <i className="fa-solid fa-trash-can"></i>
            </button>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
      </div>) : (
       <div className="text-center py-4 text-gray-500">No roles found</div>
      )}

     </div>
    </section>
    <section className="footer-wrapper">
     <p>&copy; Copyright 2024 GoChess Academy. All rights reserved.</p>
    </section>
    {deleteModalOpen && (
     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
       <div className="mt-3 text-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
         Delete Role
        </h3>
        <div className="mt-2 px-7 py-3">
         <p className="text-sm text-gray-500">
          Are you sure you want to delete the role "{roleToDelete?.name}
          "? This action cannot be undone.
         </p>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
         <button
          onClick={closeDeleteModal}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
         >
          Cancel
         </button>
         <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
         >
          Delete
         </button>
        </div>
       </div>
      </div>
     </div>
    )}
   </main>
  </>
 );
};

export default RolesList;
