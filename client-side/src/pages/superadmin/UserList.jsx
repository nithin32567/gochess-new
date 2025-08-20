import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pagination } from "@mui/material";
import UserCreationModal from "../../components/User/UserCreationModal";
import Popup from "../../components/popup";

const UserList = () => {
 const navigate = useNavigate();
 const [users, setUsers] = useState([]);
 const [loading, setLoading] = useState(true);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [userToDelete, setUserToDelete] = useState(null);
 const [editModalOpen, setEditModalOpen] = useState(false);
 const [userToEdit, setUserToEdit] = useState(null);
 const [roles, setRoles] = useState([]);
 const [searchValue, setSearchValue] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPages, setTotalPages] = useState(1);
 const [open, setOpen] = useState(false);
 const handleOpen = () => setOpen(true);
 const handleClose = () => setOpen(false);

 useEffect(() => {
  fetchUsers();
  fetchRoles();
 }, []);

 const fetchUsers = async () => {
  try {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/users`,
    { withCredentials: true }
   );
   console.log(response, "response user");
   if (response.data.success) {
    setUsers(response.data.data);
   }
  } catch (error) {
   console.log(error);
   toast.error("Error fetching users");
  } finally {
   setLoading(false);
  }
 };

 const fetchRoles = async () => {
  try {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/roles`,
    { withCredentials: true }
   );
   console.log(response, "roles fetch");
   if (response.data.success) {
    setRoles(response.data.data);
   }
  } catch (error) {
   console.log(error);
   toast.error("Error fetching roles");
  }
 };

 const filterUsers = async (roleId) => {
  console.log(roleId, "roleId");
  try {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/role/${roleId}`,
    { withCredentials: true }
   );
   console.log(response, "response filter users");
   if (response.data.success) {
    setUsers(response.data.data);
   }
  } catch (error) {
   console.log(error);
   toast.error("Error filtering users");
  }
 };

 const searchUsers = async (searchValue) => {
  console.log(searchValue, "searchValue");
  try {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/search/${searchValue}`,
    { withCredentials: true }
   );
   console.log(response, "response search users");
   if (response.data.success) {
    setUsers(response.data.data);
   }
  } catch (error) {
   console.log(error);
   toast.error("Error searching users");
  }
 };

 const toggleUserStatus = async (userId) => {
  // confirm the action
  const confirm = window.confirm(
   "Are you sure you want to toggle the user status?"
  );
  if (!confirm) {
   return;
  }
  try {
   const response = await axios.put(
    `${import.meta.env.VITE_API_URL}/users/toggle-status/${userId}`,
    { withCredentials: true }
   );
   if (response.data.success) {
    toast.success("User status toggled successfully");
    fetchUsers();
   }
  } catch (error) {
   console.log(error);
   toast.error("Error toggling user status");
  }
 };

 const handlePageChange = (event, value) => {
  setCurrentPage(value);
  fetchUsers(value);
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
      <div className="row  justify-content-between userlist-header">
       <div className="col-lg-4  col-md-6">
        <div className="row">
         <div className="col-lg-6 col-md-6 col-7">
          <select name="" id="" defaultValue={""}>
           <option disabled="" value="">
            Select Tenant
           </option>
           <option value="">Tenant A</option>
           <option value="">Tenant B</option>
           <option value="">Tenant C</option>
          </select>
         </div>
         <div className="col-lg-6 col-md-6 col-5">
          <button onClick={handleOpen} className="addtenant-btn">
           <i className="fa-solid fa-plus" /> Create Role
          </button>
         </div>
         {open && (
          <Popup>
           <UserCreationModal
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
            roles={roles}
           />
          </Popup>
         )}
        </div>
       </div>
       <div className="col-lg-4 col-md-6">
        <div className="row">
         <div className="col-lg-6 col-md-6 col-7">
          <input
           onChange={(e) => {
            const searchValue = e.target.value;
            if (searchValue === "") {
             fetchUsers();
            } else {
             searchUsers(searchValue);
            }
           }}
           type="text" placeholder="Search" />
         </div>
         <div className="col-lg-6 col-md-6 col-5">
          <select
           name=""
           id=""
           onChange={(e) => {
            const selectedRoleId = e.target.value;
            if (selectedRoleId === "all") {
             fetchUsers();
            } else {
             filterUsers(selectedRoleId);
            }
           }}
          >
           <option value="all">All Users</option>
           {roles.map((role) => (
            <option value={role._id} key={role._id}>
             {role.name}
            </option>
           ))}
          </select>
         </div>
        </div>
       </div>
      </div>
      <div className="table-responsive table-styles mt-4">
       <table className="table table-striped">
        <thead>
         <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Tenant</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
         </tr>
        </thead>
        <tbody>
         {users.map((user, i) => (
          <tr key={user._id}>
           <th scope="row">{i + 1}</th>
           <td>{user.fname} {user.lname}</td>
           <td>{user.email}</td>
           <td>{user.role?.name || "N/A"}</td>
           <td>{user.tenant?.name || "N/A"}</td>
           <td>
            <span
             onClick={() => toggleUserStatus(user._id)}
             className={`px-2 py-1 border-xl text-sm cursor-pointer ${user.is_active
              ? "bg-success text-white"
              : "bg-danger text-white"
              }`}
            >
             {user.is_active ? "Active" : "Inactive"}
            </span>
           </td>
           <td>
            <button
             onClick={() => {
              setUserToEdit(user);
              setEditModalOpen(true);
             }}
             className="edit">
             <i className="fa-solid fa-pen-to-square" />
            </button>{" "}
            <button
             onClick={() => {
              setUserToDelete(user);
              setDeleteModalOpen(true);
             }}
             className="delete">
             <i className="fa-solid fa-trash-can" />
            </button>
           </td>
          </tr>
         ))}
        </tbody>
       </table>
       <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
       />
      </div>
     </div>
    </section>
   </main>
  </>
 );
};

export default UserList;
