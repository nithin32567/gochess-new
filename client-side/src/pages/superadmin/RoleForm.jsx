import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PERMISSION_GROUPS } from '../../config/permissions';

const RoleForm = () => {
 const navigate = useNavigate();
 const { roleId } = useParams();
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
  name: '',
  description: '',
  permissions: []
 });

 useEffect(() => {
  if (roleId) {
   fetchRole();
  }
 }, [roleId]);

 const fetchRole = async () => {
  try {
   const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/roles/${roleId}`,
    { withCredentials: true }
   );
   if (response.data.success) {
    const role = response.data.data;
    setFormData({
     name: role.name,
     description: role.description,
     permissions: role.permissions || []
    });
   }
  } catch (error) {
   toast.error('Error fetching role details');
   navigate('/superadmin/roles');
  }
 };

 const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
   ...prev,
   [name]: value
  }));
 };

 const handlePermissionChange = (permissionKey) => {
  setFormData(prev => {
   const permissions = prev.permissions.includes(permissionKey)
    ? prev.permissions.filter(p => p !== permissionKey)
    : [...prev.permissions, permissionKey];

   return {
    ...prev,
    permissions
   };
  });
 };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
   const url = roleId
    ? `${import.meta.env.VITE_API_URL}/roles/${roleId}`
    : `${import.meta.env.VITE_API_URL}/roles`;

   const method = roleId ? 'put' : 'post';

   const response = await axios[method](
    url,
    formData,
    { withCredentials: true }
   );

   if (response.data.success) {
    toast.success(`Role ${roleId ? 'updated' : 'created'} successfully`);
    navigate('/superadmin/roles');
   }
  } catch (error) {
   toast.error(error.response?.data?.message || `Error ${roleId ? 'updating' : 'creating'} role`);
  } finally {
   setLoading(false);
  }
 };

 return (
  <main className="container-wrapper-scroll">
   <section className="course-single-page container-height">
    <div className="container-fluid">
     <h4 className="text-2xl font-bold mb-6 text-gray-800">
      {roleId ? 'Edit Role' : 'Create Role'}
     </h4>
     <form onSubmit={handleSubmit} className="newtrainer-modal">
      <div className="trainer-input-item">
       <label>
        Role Name
       </label>
       <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
        placeholder="Enter role name"
       />
      </div>
      <div className="trainer-input-item">
       <label>
        Description
       </label>
       <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Enter role description"
        rows="3"
       />
      </div>
      <h4 className="text-lg font-medium text-gray-900 mb-4">Permissions</h4>
      <div>
       {PERMISSION_GROUPS.map((group) => (
        <div key={group.name} className="border rounded-lg p-2">
         <h5 className="font-medium text-gray-900 pb-1">{group.name}</h5>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {group.permissions.map((permission) => (
           <label
            key={permission.key}
            className="flex items-center mx-4"
           >
            <input
             type="checkbox"
             checked={formData.permissions.includes(permission.key)}
             onChange={() => handlePermissionChange(permission.key)}
             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">
             {permission.label}
            </span>
           </label>
          ))}
         </div>
        </div>
       ))}
      </div>
      <div className="row justify-content-center">
       <div className="col-lg-4">
        <button
         onClick={() => navigate('/superadmin/roles', { replace: true })}
         type="button"
         className="addtrainer-btn">
         Cancel
        </button>
       </div>
       <div className="col-lg-4">
        <button
         disabled={loading}
         type="submit"
         className="addtrainer-btn">
         {loading ? 'Saving...' : roleId ? 'Update Role' : 'Create Role'}
        </button>
       </div>
      </div>
     </form>
    </div>
   </section>
  </main>
 );
};

export default RoleForm; 