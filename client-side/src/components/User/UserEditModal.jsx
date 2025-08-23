import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const UserEditModal = ({ user_id, setEditModalOpen, roles, tenants }) => {

 const [user, setUser] = useState(null)
 console.log(user, "user")
 const [formData, setFormData] = useState({
  fname: user?.userData?.fname || '',
  lname: user?.userData?.lname || '',
  phone_number: user?.userData?.phone_number || '',
  role_id: user?.roleData?._id || '',
  tenant_id: user?.tenantData?._id || '',
  is_active: user?.loginData?.is_active || false,
  email: user?.loginData?.email || '',
 })


 console.log(formData, 'formdata on change in theuser edit modal')
 useEffect(() => {
  findUser(user_id)
 }, [user_id])

 const findUser = async (user_id) => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/single/${user_id}`, { withCredentials: true })
  console.log(response, "response single user")
  setUser(response.data.data)
 }

 useEffect(() => {
  if (user) {
   setFormData({
    fname: user?.userData?.fname || '',
    lname: user?.userData?.lname || '',
    phone_number: user?.userData?.phone_number || '',
    role_id: user?.roleData?._id || '',
    tenant_id: user?.tenantData?._id || '',
    is_active: user?.loginData?.is_active || false,
    email: user?.loginData?.email || '',
   })
  }
 }, [user])


 const handleUpdateUser = async (e) => {
  e.preventDefault();
  try {
   const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/update/${user_id}`, formData, { withCredentials: true })
   console.log(response, "response update user")
   if (response.data.success) {
    toast.success("User updated successfully");
    setEditModalOpen(false);
   }
  } catch (error) {
   console.log(">>>>>>>>>>", error);
   toast.error("Failed to update user");
  }
 }

 return (
  <>
   <h1 className="modal-title">Edit User</h1>
   <button
    type="button"
    className="btn-close"
    data-bs-dismiss="modal"
    aria-label="Close"
    onClick={() => setEditModalOpen(false)}
   >
    <i className="fa-solid fa-xmark" />
   </button>
   <form onSubmit={handleUpdateUser}>
    <div className="trainer-input-item">
     <input
      type="text"
      name="fname"
      placeholder="First Name"
      value={formData.fname}
      onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="text"
      name="lname"
      placeholder="Last Name"
      value={formData.lname}
      onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
     />
    </div>
    <div className="trainer-input-item">
     <input
      style={{ backgroundColor: '#171717', color: 'white', cursor: 'not-allowed' }}
      type="email"
      name="email"
      disabled
      placeholder="Email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
     />
    </div>
    <div className="trainer-input-item">
     <input
      type="text"
      name="phone_number"
      placeholder="Phone Number"
      value={formData.phone_number}
      onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
     />
    </div>
    <div className="trainer-input-item">
     <select
      className="border-2 border-gray-300 rounded-md p-2"
      name="role_id"
      value={formData.role_id}
      onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
     >
      <option className="text-gray-500" value="">
       Select Role
      </option>
      {roles?.map((role, i) => (
       <option key={i} className="text-gray-500" value={role._id}>
        {role.name}
       </option>
      ))}
     </select>
    </div>
    <div className="trainer-input-item">
     <select
      className="border-2 border-gray-300 rounded-md p-2"
      name="tenant_id"
      value={formData.tenant_id}
      onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
     >
      <option className="text-gray-500" value="">
       Select Tenant
      </option>
      {tenants?.map((tenant, i) => (
       <option key={i} className="text-gray-500" value={tenant._id}>
        {tenant.name}
       </option>
      ))}
     </select>
    </div>
    <div className="trainer-input-item">
     <p>{formData.is_active ? "Active" : "Inactive"}</p>
     <button type="button" onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}>
      {formData.is_active ? "Active" : "Inactive"}

     </button>
    </div>
    <div className="row justify-content-center">
     <div className="col-lg-4">
      <button type="submit" className="addtrainer-btn">
       Update User
      </button>
     </div>
    </div>
   </form>
  </>
 )
}

export default UserEditModal
