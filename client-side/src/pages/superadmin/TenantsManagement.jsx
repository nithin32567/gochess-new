import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddTenantModal from "../../components/super-admin/AddTenantModal";
import { fetchTenantsWithCourseCountandUserCount } from "../../redux/super.admin.slice";
import axios from "axios";
// close icon react icon
import { MdClose } from "react-icons/md";

const TenantsManagement = () => {
 const tenantDetails = useSelector((state) => state.superAdmin.tenantDetails);
 console.log("tenantDetails", tenantDetails);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
 const [editingTenant, setEditingTenant] = useState(null);
 const [formData, setFormData] = useState({
  name: "",
  subdomain: "",
  zoomApiKey: "",
  zoomApiSecret: "",
  zoomApiId: "",
  tenantId: "",
 });
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const dispatch = useDispatch();
 const api_url = import.meta.env.VITE_API_URL;

 console.log(isDeleteModalOpen);

 useEffect(() => {
  dispatch(fetchTenantsWithCourseCountandUserCount());
 }, []);

 const handleEdit = (tenantId) => {
  const tenant = tenantDetails.find(t => t.tenant._id === tenantId);
  if (tenant) {
   setEditingTenant(tenant);
   console.log('tena', tenant.zoomapikey);

   setFormData({
    name: tenant.tenant.name || "",
    subdomain: tenant.tenant.subdomain || "",
    zoomApiKey: tenant.zoomapikey?.zoomApiKey || "",
    zoomApiSecret: tenant.zoomapikey?.zoomApiSecret || "",
    zoomApiId: tenant.zoomapikey?.zoomApiId || "",
    tenantId: tenant.tenant._id || "",
   });
   setIsEditModalOpen(true);
  }
 };

 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
   ...prev,
   [name]: value,
  }));
 };

 const handleUpdateSubmit = async (e) => {
  e.preventDefault();
  try {
   setLoading(true);
   setError(null);

   const response = await axios.put(
    `${api_url}/tenants/update/${formData.tenantId}`,
    formData,
    {
     withCredentials: true,
     headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
     },
    }
   );

   if (response.data) {
    dispatch(fetchTenantsWithCourseCountandUserCount());
    setIsEditModalOpen(false);
   }
  } catch (err) {
   console.error("Error updating tenant:", err);
   setError(err.response?.data?.message || "Failed to update tenant");
  } finally {
   setLoading(false);
  }
 };

 const handleDelete = (tenantId) => {
  console.log("delete", tenantId);
  setIsDeleteModalOpen(true);
 };

 const addTenant = () => {
  setIsAddTenantModalOpen(true);
 };
 return (
  <>
   <main className="container-wrapper-scroll">
    <section className="course-single-page container-height">
     <div className="container-fluid">
      <div className="row justify-content-center">
       <div className="col-lg-2 col-md-3 col-6">
        <button
         onClick={addTenant}
         className="addtenant-btn">
         <i className="fa-solid fa-plus"></i>
         Add
         Tenant
        </button>
       </div>
      </div>

      <div className="table-responsive table-styles mt-4">
       <table className="table table-striped">
        <thead>
         <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Subdomain</th>
          <th scope="col">Active</th>
          <th scope="col">Created at</th>
          <th scope="col">Courses</th>
          <th scope="col">Users</th>
          <th scope="col">Actions</th>
         </tr>
        </thead>
        <tbody>

         {tenantDetails &&
          tenantDetails.map((tenant, index) => (
           <tr key={index}>
            <th scope="row">{index + 1}</th>
            <td>{tenant.tenant.name}</td>
            <td>{tenant.tenant.subdomain}.{import.meta.env.VITE_APP_URL}</td>
            <td>{tenant.is_active ? "Active" : "Inactive"}</td>
            <td>{new Date(tenant.createdAt).toLocaleDateString()}</td>
            <td>{tenant.userCount}</td>
            <td>{tenant.courseCount}</td>
            <td>
             <button
              onClick={() => handleEdit(tenant.tenant._id)}
              className="edit">
              <i className="fa-solid fa-pen-to-square"></i>
             </button>
             <button
              onClick={() => handleDelete(tenant.tenant._id)}
              className="delete">
              <i className="fa-solid fa-trash-can"></i>
             </button>
            </td>
           </tr>
          ))}
        </tbody>
       </table>
      </div>
      {isEditModalOpen && (
       <div
        className="modal fade active show"
        style={{ display: "block", backgroundColor: "#1119" }}
        id="exampleModal"
        tabIndex={-1}
        aria-modal="true"
        data-bs-backdrop="static"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
       >
        <div className="modal-dialog modal-dialog-centered">
         <div className="modal-content">
          <div className="modal-body newtrainer-modal">
           <h1 className="modal-title">Edit Tenant</h1>
           {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
             <span className="block sm:inline">{error}</span>
            </div>
           )}
           <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setIsEditModalOpen(false)}
           >
            <i className="fa-solid fa-xmark" />
           </button>
           <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
            <div className="trainer-input-item">
             <label htmlFor="name">Name</label>
             <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Name"
             />
            </div>
            <div className="trainer-input-item">
             <label htmlFor="subdomain">Subdomain</label>
             <input
              type="text"
              id="subdomain"
              name="subdomain"
              value={formData.subdomain}
              onChange={handleInputChange}
              required
              placeholder="Subdomain"
             />
            </div>
            <div className="trainer-input-item">
             <label>Zoom API Key</label>
             <input
              type="text"
              name="zoomApiKey"
              value={formData.zoomApiKey}
              onChange={handleInputChange}
              placeholder="Enter Zoom API Key"
             />
            </div>
            <div className="trainer-input-item">
             <label>Zoom API Secret</label>
             <input
              type="text"
              name="zoomApiSecret"
              value={formData.zoomApiSecret}
              onChange={handleInputChange}
              placeholder="Enter Zoom API Secret"
             />
            </div>
            <div className="trainer-input-item">
             <label>Zoom Account Id</label>
             <input
              type="text"
              name="zoomApiId"
              value={formData.zoomApiId}
              onChange={handleInputChange}
              placeholder="Enter Zoom Account Id"
             />
            </div>
            <div className="row justify-content-center">
             <div className="col-lg-4">
              <button type="button" className="addtrainer-btn">
               {editingTenant?.is_active ? "Deactivate" : "Activate"}
              </button>
             </div>
             <div className="col-lg-4">
              <button type="submit" disabled={loading ? true : false} className="addtrainer-btn">
               Save Changes
              </button>
             </div>
            </div>
           </form>
          </div>
         </div>
        </div>
       </div>
      )}
      {isAddTenantModalOpen && (
       <AddTenantModal setIsAddTenantModalOpen={setIsAddTenantModalOpen} />
      )}
     </div>
    </section>
    <section className="footer-wrapper">
     <p>&copy; Copyright 2024 GoChess Academy. All rights reserved.</p>
    </section>
   </main>
  </>
 );
};

export default TenantsManagement;
